---
title: "I Tried to Print a Variable Twice and Rust Refused: Building a Terminal API Monitor, Part 1"
date: 2026-06-10
tags: [Rust, ownership, borrow checker, memory management, stack and heap, move semantics, RAII, reqwest, CLI, TUI series]
metaDescription: Part 1 of a 5-part series building a terminal API monitor in Rust. We scaffold the project, fire the first HTTP request, and meet the borrow checker head-on, ownership, move semantics, the stack/heap split, and why Rust frees memory without a garbage collector.
readTime: 13
type: technical
excerpt: I came to Rust from garbage-collected languages and got stopped cold on day one, by trying to use a variable twice. This is the story of building `pulse`, a terminal API monitor, and the afternoon ownership rewired how I think about memory. Part 1 of 5.
cover: '/blog-covers/rust-code.jpg'
---

I wrote three lines of Rust and the compiler told me no.

```rust
let endpoint = String::from("https://httpbin.org/status/200");
let label = endpoint;
println!("checking {endpoint}");
```

That is not exotic code. In Python, JavaScript, Go, Java, in basically every language I had ever shipped, this prints a string. In Rust it is a compile error, and the error is blunt about it:

```text
error[E0382]: borrow of moved value: `endpoint`
 --> src/main.rs:3:25
  |
1 |     let endpoint = String::from("https://httpbin.org/status/200");
  |         -------- move occurs because `endpoint` has type `String`,
  |                  which does not implement the `Copy` trait
2 |     let label = endpoint;
  |                 -------- value moved here
3 |     println!("checking {endpoint}");
  |                         ^^^^^^^^ value borrowed here after move
```

My first reaction was the same one most people have: *the compiler is broken, or I am holding it wrong.* It turned out to be neither. That error is Rust telling me something true about memory that every other language had been hiding from me, and once it clicked, I stopped writing a whole category of bug.

This is the first post in a series where I build `pulse`, a small terminal API monitor: a TUI that polls a set of HTTP endpoints, shows their status and latency live, and refreshes on a loop. Nothing about that is hard in the abstract. What makes it interesting is that Rust forces you to be honest about who owns what, and a network tool is full of values that get passed around, shared between tasks, and torn down. So the tool is the excuse. The real subject is memory.

> **TL;DR**: In Rust, every value has exactly one owner. Assigning a non-`Copy` value *moves* ownership instead of copying it, which invalidates the original binding, that is the `E0382` error. When the owner goes out of scope, the value is dropped and its heap memory is freed, with no garbage collector. Understanding the stack/heap split and move semantics is the entire foundation; everything else in the series is built on it.

---

## The Series

1. **Part 1, Ownership and the borrow checker** *(you are here)*: project setup, the first request, and why you can't use a value twice.
2. [Part 2, Borrowing, lifetimes, and parsing with serde](/blogs/building-rust-tui-api-monitor-part-2-borrowing-lifetimes)
3. [Part 3, Async, Tokio, and sharing state across tasks](/blogs/building-rust-tui-api-monitor-part-3-async-tokio-concurrency)
4. [Part 4, The TUI with ratatui, error handling, and RAII cleanup](/blogs/building-rust-tui-api-monitor-part-4-ratatui-error-handling)
5. [Part 5, Traits, iterators, zero-cost abstractions, and the release build](/blogs/building-rust-tui-api-monitor-part-5-traits-performance-release)

---

## Scaffolding `pulse`

Rust ships with `cargo`, which is the build tool, package manager, and test runner in one. Starting the project is one command.

```bash
cargo new pulse
cd pulse
```

That gives you a `Cargo.toml` (the manifest) and `src/main.rs` (a hello-world). We need one dependency to make HTTP requests: `reqwest`. For now we use its **blocking** client, a normal synchronous call that waits for the response. We will rip that out and go fully async in Part 3, but blocking code is the right place to learn ownership without the noise of futures.

```toml
[package]
name = "pulse"
version = "0.1.0"
edition = "2021"

[dependencies]
reqwest = { version = "0.12", features = ["blocking"] }
```

One request:

```rust
fn main() {
    let url = "https://httpbin.org/status/200";
    let response = reqwest::blocking::get(url).expect("request failed");
    println!("{url} -> {}", response.status());
}
```

```bash
$ cargo run
   Compiling pulse v0.1.0
    Finished dev [unoptimized] target(s) in 1.84s
     Running `target/debug/pulse`
https://httpbin.org/status/200 -> 200 OK
```

That works on the first try and it is genuinely the boring part. The interesting part started the moment I tried to give the URL a more permanent home.

---

## The Bug Rust Won't Let You Write

A monitor watches more than one endpoint, so I reached for a struct that owns its configuration:

```rust
struct Target {
    name: String,
    url: String,
}

fn main() {
    let url = String::from("https://httpbin.org/status/200");

    let target = Target {
        name: String::from("httpbin"),
        url, // shorthand for `url: url`
    };

    // I still wanted to log the raw url I started with:
    println!("configured {} at {url}", target.name);
}
```

This is the `E0382` error from the top of the post, in its natural habitat. The line `url,` moved the `String` into the struct. After that, the `url` binding is dead. The compiler will not let me read it.

In a garbage-collected language this code is fine because `url` and `target.url` would be two references to the same string object, and the runtime keeps the object alive as long as anyone can reach it. Rust does not have that runtime. There is no background process tracking who can reach what. Instead it enforces a single rule at compile time, and the rule is strict enough that it can free memory deterministically without ever scanning the heap.

The rule is **ownership**.

---

## Ownership in One Paragraph

Every value in Rust has exactly one owner, the variable binding responsible for it. When you assign that value somewhere else, or pass it to a function, ownership *moves*. The old binding is invalidated. When the owner goes out of scope, the value is dropped and any memory it holds is freed. One owner, one cleanup, no ambiguity.

To see why moving matters, you have to look at what a `String` actually is in memory.

---

## Stack and Heap: What a `String` Really Is

A Rust `String` is not the text. It is a small three-word header that lives on the **stack**: a pointer to the bytes, the length, and the capacity. The actual UTF-8 bytes live on the **heap**, which is the region for data whose size isn't known at compile time or that needs to outlive a single function call.

When you write `let label = endpoint;`, Rust copies the *header*, three machine words, but not the heap bytes. Now two stack headers point at the same heap buffer. If Rust let both stay valid, then when both went out of scope, both would try to free the same heap buffer. That is a **double free**: a classic memory-corruption bug that has caused real security vulnerabilities for decades.

Rust's fix is almost rude in its simplicity: after the copy, it marks the original binding as moved-out and refuses to let you touch it. Exactly one header is valid, so exactly one free happens.

<svg width="100%" viewBox="0 0 680 380" role="img" xmlns="http://www.w3.org/2000/svg">
  <title>String move: stack header copied, heap buffer shared, original invalidated</title>
  <desc>Diagram showing a String as a stack header (pointer, length, capacity) pointing to heap bytes, then a move that copies the header and invalidates the source binding</desc>
  <style>
    .lbl  { font-family: -apple-system, system-ui, sans-serif; font-size: 13px; fill: #444441; font-weight: 500; }
    .sub  { font-family: -apple-system, system-ui, sans-serif; font-size: 11px; fill: #5F5E5A; }
    .mono { font-family: ui-monospace, monospace; font-size: 12px; fill: #2C2C2A; }
    .dead { font-family: ui-monospace, monospace; font-size: 12px; fill: #A32D2D; }
  </style>
  <defs>
    <marker id="a1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
  <text class="lbl" x="20" y="26">Before the move, one owner, `endpoint`</text>
  <rect x="20" y="38" width="150" height="30" rx="6" fill="#F1EFE8" stroke="#888780" stroke-width="0.8"/>
  <text class="sub" x="28" y="32">STACK</text>
  <text class="mono" x="30" y="58">endpoint</text>
  <rect x="180" y="38" width="240" height="64" rx="6" fill="#E6F1FB" stroke="#378ADD" stroke-width="1"/>
  <text class="mono" x="192" y="58" font-size="11">ptr  ──────────────┐</text>
  <text class="mono" x="192" y="76" font-size="11">len  = 30</text>
  <text class="mono" x="192" y="94" font-size="11">cap  = 30</text>
  <rect x="470" y="38" width="190" height="64" rx="6" fill="#EAF3DE" stroke="#639922" stroke-width="1"/>
  <text class="sub" x="478" y="32">HEAP</text>
  <text class="mono" x="480" y="64" font-size="10">"https://httpbin</text>
  <text class="mono" x="480" y="82" font-size="10">.org/status/200"</text>
  <line x1="418" y1="58" x2="468" y2="70" stroke="#378ADD" stroke-width="1.5" marker-end="url(#a1)"/>
  <text class="lbl" x="20" y="170">After `let label = endpoint;`, header copied, source invalidated</text>
  <rect x="20" y="184" width="150" height="30" rx="6" fill="#FCEBEB" stroke="#E24B4A" stroke-width="0.8" stroke-dasharray="4 3"/>
  <text class="dead" x="30" y="204">endpoint ✗ moved</text>
  <rect x="20" y="222" width="150" height="30" rx="6" fill="#F1EFE8" stroke="#888780" stroke-width="0.8"/>
  <text class="mono" x="30" y="242">label</text>
  <rect x="180" y="222" width="240" height="64" rx="6" fill="#E6F1FB" stroke="#378ADD" stroke-width="1"/>
  <text class="mono" x="192" y="242" font-size="11">ptr  ──────────────┐</text>
  <text class="mono" x="192" y="260" font-size="11">len  = 30</text>
  <text class="mono" x="192" y="278" font-size="11">cap  = 30</text>
  <rect x="470" y="222" width="190" height="64" rx="6" fill="#EAF3DE" stroke="#639922" stroke-width="1"/>
  <text class="mono" x="480" y="248" font-size="10">"https://httpbin</text>
  <text class="mono" x="480" y="266" font-size="10">.org/status/200"</text>
  <line x1="418" y1="242" x2="468" y2="254" stroke="#378ADD" stroke-width="1.5" marker-end="url(#a1)"/>
  <text class="sub" x="20" y="318">The heap buffer was never copied, only the 3-word header moved. Cheap.</text>
  <text class="sub" x="20" y="336">`endpoint` is now off-limits, so only `label` frees the buffer. No double free.</text>
  <text class="sub" x="20" y="354">This is why the move is both fast and safe: it is a `memcpy` of 24 bytes plus a compile-time flag.</text>
</svg>

This is the whole trick. Other languages avoid double frees with a garbage collector (track references at runtime, free when unreachable) or by making you call `free` yourself (and trusting you to get it right). Rust avoids them by proving, at compile time, that each value has one owner and is freed once. The cost is paid by you, the programmer, in the form of errors like `E0382`. The payoff is no GC pauses, no manual `free`, and no double-free CVEs.

---

## Three Ways to Make the Compiler Happy

Once you accept the rule, the fix depends on what you actually meant.

**1. You meant to give the value away.** Then the move is correct and the error is pointing at a real mistake, you're trying to use something you already handed off. Reorder the code so you read the value *before* moving it:

```rust
let url = String::from("https://httpbin.org/status/200");
println!("starting with {url}");          // read first
let target = Target { name: "httpbin".into(), url }; // then move
```

**2. You genuinely need two independent copies.** Then ask for one explicitly with `.clone()`. This allocates a second heap buffer and copies the bytes. It is not free, and Rust makes you say so out loud, there are no silent deep copies.

```rust
let url = String::from("https://httpbin.org/status/200");
let target = Target { name: "httpbin".into(), url: url.clone() };
println!("configured {} at {url}", target.name); // url is still valid
```

**3. You only need to *look* at the value, not own it.** Then you borrow it with `&`, which hands out a reference without transferring ownership. This is the right answer most of the time, and it is so central that the entire next post is about it. A taste:

```rust
fn log_target(t: &Target) {        // borrows, does not take ownership
    println!("{} -> {}", t.name, t.url);
}

let target = Target { name: "httpbin".into(), url: "https://...".into() };
log_target(&target);  // lend it
log_target(&target);  // lend it again — target still owns everything
```

Notice the trade-off the language is forcing into the open. `clone()` is simple but costs an allocation. Borrowing is free but introduces the question *how long does the reference stay valid?*, which is exactly the question lifetimes answer in Part 2.

| Approach | Cost | When it's right |
|---|---|---|
| Reorder to read-before-move | Free | You really did mean to give the value away |
| `.clone()` | One heap allocation + copy | You need two independent owners |
| Borrow with `&` | Free (a pointer) | You only need temporary read access |

---

## Drop: Cleanup You Never Write

The flip side of ownership is destruction. When an owner goes out of scope, Rust inserts a call to drop the value, and for a `String` that means freeing the heap buffer. You never write the free. You never forget it either.

```rust
fn check_once() {
    let body = reqwest::blocking::get("https://httpbin.org/json")
        .unwrap()
        .text()
        .unwrap();           // `body` owns a heap String here

    println!("got {} bytes", body.len());
} // <- `body` goes out of scope here; its heap buffer is freed automatically
```

This pattern, a resource tied to a value's lifetime, released the instant the value drops, is called **RAII** (Resource Acquisition Is Initialization). It is not limited to memory. A file handle drops and closes the file. A lock guard drops and releases the lock. In Part 4 we use exactly this mechanism to guarantee the terminal is restored to a sane state even if the program panics mid-render. Memory is just the first thing RAII manages; it ends up managing everything.

<svg width="100%" viewBox="0 0 680 250" role="img" xmlns="http://www.w3.org/2000/svg">
  <title>Value lifecycle: owned on creation, dropped at end of scope</title>
  <desc>Timeline showing a value being created and owned inside a scope, then automatically dropped and its memory freed when the scope ends</desc>
  <style>
    .lbl  { font-family: -apple-system, system-ui, sans-serif; font-size: 13px; fill: #444441; font-weight: 500; }
    .sub  { font-family: -apple-system, system-ui, sans-serif; font-size: 11px; fill: #5F5E5A; }
    .mono { font-family: ui-monospace, monospace; font-size: 11px; fill: #2C2C2A; }
  </style>
  <line x1="60" y1="70" x2="640" y2="70" stroke="#B4B2A9" stroke-width="1.5"/>
  <circle cx="120" cy="70" r="6" fill="#1D9E75"/>
  <text class="lbl" x="120" y="50" text-anchor="middle">create</text>
  <text class="mono" x="120" y="98" text-anchor="middle" font-size="10">let body = ...</text>
  <text class="sub" x="120" y="114" text-anchor="middle">heap allocated</text>
  <rect x="180" y="58" width="320" height="24" rx="12" fill="#E6F1FB" stroke="#378ADD" stroke-width="1"/>
  <text class="sub" x="340" y="74" text-anchor="middle" fill="#042C53">`body` owns the buffer, you can use it freely here</text>
  <circle cx="560" cy="70" r="6" fill="#E24B4A"/>
  <text class="lbl" x="560" y="50" text-anchor="middle">scope ends</text>
  <text class="mono" x="560" y="98" text-anchor="middle" font-size="10">}</text>
  <text class="sub" x="560" y="114" text-anchor="middle">drop() runs, heap freed</text>
  <rect x="60" y="160" width="580" height="64" rx="8" fill="#F1EFE8" stroke="#B4B2A9" stroke-width="0.6"/>
  <text class="sub" x="80" y="186">No garbage collector decided when to free this. No `free()` call in your code freed it.</text>
  <text class="sub" x="80" y="206">The compiler inserted the cleanup at the closing brace because that is where the owner died.</text>
</svg>

---

## What This Actually Buys You

It is easy to read all of this as bureaucracy, the compiler making you jump through hoops a GC would have handled silently. So it is worth being concrete about what you get in exchange.

| Concern | Garbage-collected language | Manual C/C++ | Rust |
|---|---|---|---|
| Double free | Impossible (GC owns it) | Your job to avoid | Impossible (compile error) |
| Use-after-free | Impossible | Your job to avoid | Impossible (compile error) |
| Memory leak from cycles | Possible | Your job to avoid | Possible but rare, opt-in |
| Pause times | GC pauses, unpredictable | None | None |
| When memory is freed | Eventually, runtime decides | When you call free | Deterministically, at scope end |
| Cost of the guarantee | Runtime overhead | Bugs and CVEs | Compile-time friction |

For a tool like `pulse` that I want to leave running in a terminal tab for days, "no GC pauses and deterministic cleanup" is a real feature, not a tax. The latency numbers it reports won't jitter because a collector decided to run. And the friction front-loads: you fight the borrow checker while writing, not your users while running.

---

## Where We Are

We have a project that compiles, makes one HTTP request, and prints a status code. More importantly, we have the mental model that the rest of the series leans on:

- A value has **one owner**.
- Assigning or passing a non-`Copy` value **moves** it and invalidates the source.
- A `String` is a stack header pointing at heap bytes; a move copies the header, not the bytes.
- The owner going out of scope **drops** the value and frees its memory, RAII, no GC.

Right now `pulse` throws away the response body and only looks at the status line. That is wasteful, and it dodges the next hard question: how do you pull structured data out of a response and hold onto pieces of it without copying everything? That is borrowing and lifetimes, and it's where Rust's reputation for difficulty really comes from.

**Next:** [Part 2, Borrowing, lifetimes, and parsing with serde](/blogs/building-rust-tui-api-monitor-part-2-borrowing-lifetimes), where the error message changes from *"value moved"* to the infamous *"does not live long enough."*
