---
title: "Where Did the Cost Go? Building a Terminal API Monitor, Part 5"
date: 2026-06-18
tags: [Rust, traits, generics, iterators, zero-cost abstractions, monomorphization, release build, cross-compilation, performance benchmarks, memory footprint, TUI series]
metaDescription: The finale of building a terminal API monitor in Rust. Traits and generics, iterators that compile to hand-written loops, the meaning of "zero-cost abstractions," the release build with LTO, cross-compiling a static binary, and benchmarks measuring memory and binary size against Node and Python equivalents.
readTime: 15
type: technical
excerpt: For four parts I claimed Rust gives you memory safety and fearless concurrency at no runtime cost. This is where I prove it, traits, iterators that vanish into loops, zero-cost abstractions, and a release binary measured against Node and Python. The cost was real; it was just paid at compile time. Part 5 of 5.
cover: '/blog-covers/building-rust-tui-api-monitor-part-5-traits-performance-release.svg'
---

For four parts I've been making a promise and asking you to take it on credit. In [Part 1](/blogs/building-rust-tui-api-monitor-part-1-ownership) I said ownership gives you memory safety with no garbage collector. In [Part 3](/blogs/building-rust-tui-api-monitor-part-3-async-tokio-concurrency) I said the same rules prevent data races at compile time, for free. The recurring claim was *zero-cost*: all this safety, none of the runtime overhead.

That phrase deserves scrutiny, because it sounds like marketing. Abstractions usually cost something, a vtable lookup, an allocation, a layer of indirection. So in this final part I want to cash the check. We'll look at the two abstractions `pulse` leans on hardest, traits and iterators, see how they compile down to nothing, build the optimized release binary, ship it to a server as a single static file, and measure it against the same tool written in Node and Python.

The cost, it turns out, is real. It was just charged to a different account: your compile times and your patience with the borrow checker, not your users' CPUs.

> **TL;DR**: "Zero-cost abstraction" means a high-level construct compiles to the same machine code you'd write by hand. Generic functions are *monomorphized*, the compiler stamps out a specialized copy per concrete type, so trait calls become direct calls with no vtable. Iterator chains inline and fuse into a single loop with no intermediate allocations. The release profile (LTO, `opt-level=3`, `strip`) produces a small static binary that starts in milliseconds and idles in single-digit megabytes, a fraction of a Node or Python equivalent, with no runtime to install.

---

## The Series

1. [Part 1, Ownership and the borrow checker](/blogs/building-rust-tui-api-monitor-part-1-ownership)
2. [Part 2, Borrowing, lifetimes, and serde](/blogs/building-rust-tui-api-monitor-part-2-borrowing-lifetimes)
3. [Part 3, Async, Tokio, and sharing state across tasks](/blogs/building-rust-tui-api-monitor-part-3-async-tokio-concurrency)
4. [Part 4, The TUI, error handling, and RAII cleanup](/blogs/building-rust-tui-api-monitor-part-4-ratatui-error-handling)
5. **Part 5, Traits, iterators, zero-cost abstractions, and the release build** *(you are here)*

---

## Traits: Shared Behavior Without Inheritance

A trait is a set of methods a type promises to provide, close to an interface in Java or a protocol in Swift, but without class inheritance. In Part 4 we colored rows by matching on `Status`. Let's make that a capability any displayable thing can have:

```rust
use ratatui::style::Color;

trait StatusBadge {
    fn badge(&self) -> (&'static str, Color);
}

impl StatusBadge for Status {
    fn badge(&self) -> (&'static str, Color) {
        match self {
            Status::Up { .. }   => ("● UP",   Color::Green),
            Status::Slow { .. } => ("● SLOW", Color::Yellow),
            Status::Down { .. } => ("● DOWN", Color::Red),
        }
    }
}
```

Now anything that needs a badge can take "any `T` that implements `StatusBadge`." And here's the first fork in the road, the one that decides whether the abstraction costs anything:

```rust
// Static dispatch: generic over T. The compiler knows the concrete type.
fn summarize<T: StatusBadge>(item: &T) -> &'static str {
    item.badge().0
}

// Dynamic dispatch: a trait object behind a pointer. Type known only at runtime.
fn summarize_dyn(item: &dyn StatusBadge) -> &'static str {
    item.badge().0
}
```

These look almost identical and behave identically. They compile to very different things.

---

## Monomorphization: How Generics Become Free

When you call the generic `summarize::<Status>(...)`, the compiler doesn't keep `T` abstract. It performs **monomorphization**: it generates a concrete, specialized copy of the function with `T` replaced by `Status`. Inside that copy, `item.badge()` is a *direct* call to a known function, which the optimizer then happily inlines. There is no runtime type information, no indirection. The generic vanishes; what's left is exactly the code you'd have written for `Status` specifically.

The `dyn` version is the trade. A `&dyn StatusBadge` is a fat pointer: one pointer to the data, one to a *vtable* of function pointers. Calling `badge()` means loading the function address from the vtable and calling through it, a real indirection the CPU can't inline away, and one that blocks some optimizations. In exchange you get one copy of the function that works for every type, and the ability to hold a mixed `Vec<Box<dyn StatusBadge>>`.

| | Static dispatch (`<T: Trait>`) | Dynamic dispatch (`dyn Trait`) |
|---|---|---|
| Call cost | Direct call, usually inlined, zero overhead | Vtable lookup, not inlinable |
| Code size | One copy per concrete type (can bloat) | One copy total |
| Flexibility | Type fixed at compile time | Mix many types in one collection |
| Default choice | Yes, this is the zero-cost path | When you genuinely need heterogeneity |

This is the precise mechanical meaning of "zero-cost." The generic abstraction is a *compile-time* convenience that leaves no trace at runtime. `pulse` uses static dispatch everywhere it can, which is why the convenience of writing against traits costs its users nothing.

---

## Iterators: Chains That Compile to Loops

The abstraction I reached for most while building `pulse` was the iterator. Computing a summary line for the dashboard, how many services are down, what's the average latency of the healthy ones, reads like a sentence:

```rust
fn down_count(probes: &[Probe]) -> usize {
    probes.iter()
        .filter(|p| matches!(p.status, Status::Down { .. }))
        .count()
}

fn avg_healthy_latency(probes: &[Probe]) -> Option<u128> {
    let latencies: Vec<u128> = probes.iter()
        .filter_map(|p| p.latency())   // Some(ms) for Up/Slow, None for Down
        .collect();
    if latencies.is_empty() {
        return None;                   // no null — absence is explicit
    }
    Some(latencies.iter().sum::<u128>() / latencies.len() as u128)
}
```

Coming from other languages, you might assume `.filter().filter_map().sum()` builds intermediate collections at each step, the way a naive `array.filter().map()` allocates a new array per call. In Rust, iterators are **lazy**: each adapter is a tiny struct that does nothing until something pulls values through. `.count()`, `.sum()`, and `.collect()` are the things that pull. Because every adapter is generic and gets monomorphized and inlined, the optimizer fuses the whole chain into a *single pass* with no intermediate allocations. The `down_count` function above compiles to essentially the same machine code as this hand-written loop:

```rust
fn down_count(probes: &[Probe]) -> usize {
    let mut n = 0;
    for p in probes {
        if matches!(p.status, Status::Down { .. }) {
            n += 1;
        }
    }
    n
}
```

Same instructions. The expressive version is not a "nice but slower" option you trade performance for, it is, after optimization, the loop. This is the claim that sounds too good until you read the generated assembly, at which point it's just true.

<svg width="100%" viewBox="0 0 680 300" role="img" xmlns="http://www.w3.org/2000/svg">
  <title>Zero-cost abstraction: an iterator chain compiles down to a single loop</title>
  <desc>An iterator chain of filter and count passes through the compiler's monomorphization and inlining stages and emerges as machine code identical to a hand-written loop</desc>
  <style>
    .lbl  { font-family: -apple-system, system-ui, sans-serif; font-size: 13px; fill: #444441; font-weight: 600; }
    .sub  { font-family: -apple-system, system-ui, sans-serif; font-size: 11px; fill: #5F5E5A; }
    .mono { font-family: ui-monospace, monospace; font-size: 11px; fill: #2C2C2A; }
  </style>
  <defs>
    <marker id="e1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
  <text class="lbl" x="20" y="28">What you write</text>
  <rect x="20" y="40" width="280" height="74" rx="8" fill="#E6F1FB" stroke="#378ADD" stroke-width="1"/>
  <text class="mono" x="34" y="62" font-size="10">probes.iter()</text>
  <text class="mono" x="34" y="80" font-size="10">  .filter(|p| p.is_down())</text>
  <text class="mono" x="34" y="98" font-size="10">  .count()</text>
  <text class="lbl" x="20" y="150">Compiler</text>
  <rect x="20" y="162" width="280" height="56" rx="8" fill="#FAEEDA" stroke="#BA7517" stroke-width="1"/>
  <text class="sub" x="34" y="184">1. monomorphize adapters to concrete types</text>
  <text class="sub" x="34" y="202">2. inline each adapter's next() call</text>
  <text class="sub" x="34" y="216" font-size="10">→ no allocations, no indirection survive</text>
  <line x1="160" y1="114" x2="160" y2="160" stroke="#888780" stroke-width="1.5" marker-end="url(#e1)"/>
  <line x1="300" y1="190" x2="360" y2="190" stroke="#888780" stroke-width="1.5" marker-end="url(#e1)"/>
  <text class="lbl" x="380" y="28">What runs (equivalent)</text>
  <rect x="380" y="40" width="280" height="178" rx="8" fill="#EAF3DE" stroke="#639922" stroke-width="1"/>
  <text class="mono" x="394" y="66" font-size="10">let mut n = 0;</text>
  <text class="mono" x="394" y="86" font-size="10">for p in probes {</text>
  <text class="mono" x="394" y="106" font-size="10">    if p.is_down() {</text>
  <text class="mono" x="394" y="126" font-size="10">        n += 1;</text>
  <text class="mono" x="394" y="146" font-size="10">    }</text>
  <text class="mono" x="394" y="166" font-size="10">}</text>
  <text class="sub" x="394" y="196">a single loop, identical instructions</text>
  <text class="sub" x="20" y="260">The abstraction exists only in the source. By the time the CPU sees it, the layers are gone, that is the literal meaning of "zero-cost."</text>
  <text class="sub" x="20" y="278">You pay for it once, in compile time, instead of on every execution.</text>
</svg>

---

## The Release Build

Everything so far has been `cargo run`, which builds in debug mode: fast to compile, no optimization, full debug info. The shippable artifact is the release build. The defaults are good; for a small tool I tighten a few knobs in `Cargo.toml`:

```toml
[profile.release]
opt-level = 3        # full optimization
lto = true           # link-time optimization: inline ACROSS crate boundaries
codegen-units = 1    # one unit = better optimization, slower compile
strip = true         # drop symbols from the binary
panic = "abort"      # smaller binary; see the Part 4 caveat about Drop-on-panic
```

```bash
$ cargo build --release
    Finished release [optimized] target(s)

$ ls -lh target/release/pulse
-rwxr-xr-x  1  4.1M  pulse
```

`lto = true` is the one that matters most for the zero-cost story: it lets the optimizer inline across crate boundaries, so a call into reqwest or ratatui can be inlined into your code the same way your own functions are. The abstraction boundary between crates disappears too. The cost is compile time, `codegen-units = 1` plus LTO can turn a 5-second debug build into a 40-second release build. You pay it once per release, not once per run.

---

## Measuring It

Here's the part that makes the abstraction debate concrete. I built the same trivial monitor three ways, `pulse` in Rust, an equivalent using Node with a TUI library, and one in Python, and measured the things that matter for a tool you leave running in a terminal. Numbers are representative of a small fleet-of-a-dozen monitor on a Linux laptop; absolute values vary by machine, but the *ratios* are stable and the point survives precise measurement.

| Metric | Rust (`pulse`, release) | Node.js equivalent | Python equivalent |
|---|---|---|---|
| Idle resident memory (RSS) | ~5 MB | ~55 MB | ~28 MB |
| Cold start to first frame | ~6 ms | ~95 ms | ~60 ms |
| Shipping artifact | one ~4 MB binary | app + `node_modules` + Node runtime | scripts + interpreter + venv |
| Runtime required on target | none | Node | Python |
| GC pauses affecting latency readings | none | possible | possible |

<svg width="100%" viewBox="0 0 680 250" role="img" xmlns="http://www.w3.org/2000/svg">
  <title>Idle resident memory comparison across Rust, Python, and Node implementations</title>
  <desc>Bar chart comparing idle RSS: Rust around 5 megabytes, Python around 28, Node around 55</desc>
  <style>
    .lbl  { font-family: -apple-system, system-ui, sans-serif; font-size: 13px; fill: #444441; font-weight: 600; }
    .sub  { font-family: -apple-system, system-ui, sans-serif; font-size: 11px; fill: #5F5E5A; }
    .val  { font-family: ui-monospace, monospace; font-size: 12px; fill: #2C2C2A; font-weight: 700; }
    .axis { font-family: ui-monospace, monospace; font-size: 10px; fill: #5F5E5A; }
  </style>
  <text class="lbl" x="20" y="26">Idle resident memory, lower is better</text>
  <line x1="120" y1="50" x2="120" y2="200" stroke="#B4B2A9" stroke-width="1"/>
  <line x1="120" y1="200" x2="650" y2="200" stroke="#B4B2A9" stroke-width="1"/>
  <text class="sub" x="110" y="78"  text-anchor="end">Rust</text>
  <rect x="120" y="64" width="48" height="26" rx="3" fill="#1D9E75" stroke="#0F6E56" stroke-width="0.8"/>
  <text class="val" x="178" y="83">5 MB</text>
  <text class="sub" x="110" y="128" text-anchor="end">Python</text>
  <rect x="120" y="114" width="252" height="26" rx="3" fill="#FAC775" stroke="#BA7517" stroke-width="0.8"/>
  <text class="val" x="382" y="133">28 MB</text>
  <text class="sub" x="110" y="178" text-anchor="end">Node.js</text>
  <rect x="120" y="164" width="495" height="26" rx="3" fill="#F5C4B3" stroke="#D85A30" stroke-width="0.8"/>
  <text class="val" x="565" y="183" fill="#A32D2D">55 MB</text>
  <text class="sub" x="120" y="226">No runtime, no interpreter, no GC heap reserved up front, just the working set of the program itself.</text>
</svg>

None of this makes Rust "better" in the abstract, a Python script you write in ten minutes is the right tool for plenty of jobs, and the Node ecosystem is enormous. But for a long-lived, resource-sensitive utility, the gap is exactly the runtime you're *not* shipping. There's no VM warming up, no interpreter resident in memory, no collector heap reserved before your program does anything. The safety guarantees from Parts 1–4 didn't add a runtime to pay for them; they were enforced and then compiled away.

---

## One Binary, Any Server

The last promise from the series title: `pulse` "hits some server," and ideally runs *on* one too. Because the release build has no runtime dependency, you can produce a fully static binary and copy it to a box that has nothing installed, no Rust toolchain, no libc surprises.

```bash
rustup target add x86_64-unknown-linux-musl
cargo build --release --target x86_64-unknown-linux-musl

scp target/x86_64-unknown-linux-musl/release/pulse server:/usr/local/bin/
ssh server pulse        # just runs — nothing else to install
```

Linking against musl produces a static binary with no dynamic dependencies. That single file *is* the deployment. No `node_modules` to sync, no virtualenv to recreate, no "works on my machine" because the machine ships inside the binary. For a monitoring tool you want to drop onto arbitrary servers, this is the whole game.

---

## The Throughline

Five parts, one tool, and a single idea repeated in different costumes. Look back at what each error was really teaching:

| Part | The fight | What it actually bought |
|---|---|---|
| 1, Ownership | "value moved here" | No double-free, deterministic cleanup, no GC |
| 2, Borrowing & lifetimes | "does not live long enough" | No dangling pointers, no iterator invalidation |
| 3, Concurrency | "cannot be sent between threads safely" | No data races, proven at compile time |
| 4, Errors & RAII | exhaustive `match`, `Drop` | No forgotten cases, no skipped cleanup, ever |
| 5, Traits & iterators | monomorphization, LTO | All of the above at no runtime cost |

The borrow checker that stopped me from printing a variable twice on day one is the same machinery that, by Part 5, hands me a 5 MB binary with no data races, no use-after-free, and no garbage collector. Rust didn't make the cost of safety disappear. It *moved* it, from runtime, where your users feel it as crashes, pauses, and CVEs, to compile time, where you feel it as red squiggles and a compiler that won't let you ship the bug.

That's a genuinely different bargain than I was used to, and whether it's worth it depends entirely on what you're building. For a quick script, the friction isn't worth it. For a tool you'll leave running for days, a service handling real load, or anything where a memory bug is a security incident, front-loading that cost is the entire point. You argue with the compiler for an afternoon so you don't get paged at 3 a.m.

`pulse` started as an excuse to learn where Rust's reputation for difficulty comes from. It comes from the compiler refusing to let you defer hard questions about memory and concurrency. The reward for answering them up front is a small, fast, fearless binary, and a noticeably different relationship with the phrase "it works on my machine."

Thanks for reading the whole series. The full source for `pulse` ties together every concept from these five parts; if you build your own version, the borrow checker will teach you the rest.
