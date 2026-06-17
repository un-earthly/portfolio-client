---
title: "Fearless Concurrency Is Real: Building a Terminal API Monitor, Part 3"
date: 2026-06-14
tags: [Rust, async, tokio, concurrency, Arc, Mutex, Send, Sync, channels, data races, fearless concurrency, TUI series]
metaDescription: Part 3 of building a terminal API monitor in Rust. We go async with Tokio, poll a dozen endpoints concurrently, and hit the wall of shared mutable state — Send, Sync, Arc<Mutex<T>>, and channels — discovering that the borrow checker prevents data races at compile time.
readTime: 15
type: technical
excerpt: Polling one endpoint at a time is slow. Polling them concurrently means sharing state between tasks, and that is exactly where every other language hands you a data race at 3 a.m. This is the part where Rust's ownership rules stop feeling like bureaucracy and start feeling like a superpower. Part 3 of 5.
---

Up to now `pulse` has been polite and slow. It checks one endpoint, waits for the whole round trip, prints the result, then checks the next. With one service that's fine. With a dozen services each taking 80ms, a full sweep takes nearly a second, and the program spends 99% of that time doing nothing but waiting on sockets.

The fix is obvious: fire all the requests at once. The fix is also where, in every language I'd used before, I had eventually shipped a data race — two threads touching the same value, one of them writing, the bug appearing once a week in production and never on my machine.

So I braced for it. I wrote the concurrent version. And Rust refused to compile it — not with a vague warning, but with a precise explanation of the exact race I was about to create.

> **TL;DR** — Rust's async model uses `Future`s driven by a runtime like Tokio; `.await` yields control while waiting on I/O so one thread can juggle thousands of in-flight requests. The moment you share mutable state across tasks, the `Send` and `Sync` marker traits and the borrow checker force you to make it safe — usually with `Arc<Mutex<T>>` (shared ownership + mutual exclusion) or by not sharing at all and passing ownership through a **channel**. The same ownership rules from Parts 1 and 2 make data races a compile error. That's "fearless concurrency," and it is not marketing.

---

## The Series

1. [Part 1 — Ownership and the borrow checker](/blogs/building-rust-tui-api-monitor-part-1-ownership)
2. [Part 2 — Borrowing, lifetimes, and serde](/blogs/building-rust-tui-api-monitor-part-2-borrowing-lifetimes)
3. **Part 3 — Async, Tokio, and sharing state across tasks** *(you are here)*
4. [Part 4 — The TUI with ratatui, error handling, and RAII cleanup](/blogs/building-rust-tui-api-monitor-part-4-ratatui-error-handling)
5. [Part 5 — Traits, iterators, zero-cost abstractions, and the release build](/blogs/building-rust-tui-api-monitor-part-5-traits-performance-release)

---

## Going Async

A network request is mostly waiting. Async lets a single thread start a request, set it aside the instant it would block, and do other work until the response is ready. We swap the blocking reqwest client for the async one and add **Tokio**, the runtime that actually drives the waiting.

```toml
[dependencies]
reqwest = { version = "0.12", features = ["json"] }
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
futures = "0.3"
```

```rust
use std::time::Instant;

#[derive(Debug)]
struct Probe {
    url: String,
    status: u16,
    latency_ms: u128,
}

async fn check(url: String) -> Probe {
    let start = Instant::now();
    let status = match reqwest::get(&url).await {
        Ok(resp) => resp.status().as_u16(),
        Err(_) => 0, // 0 == unreachable, for now
    };
    Probe { url, status, latency_ms: start.elapsed().as_millis() }
}

#[tokio::main]
async fn main() {
    let probe = check("https://httpbin.org/status/200".into()).await;
    println!("{probe:?}");
}
```

Two new pieces of syntax. `async fn` returns a **`Future`** — a value representing "work that will eventually produce a `Probe`." Crucially, a future is *lazy*: calling `check(...)` does nothing until something polls it. `.await` is that something — it runs the future, and at each point the future would block on I/O, it yields control back to the runtime so the thread can go do other work. `#[tokio::main]` is a macro that wraps `main` in a runtime that does the polling.

This single-request version isn't faster than blocking. The win shows up only when you have many futures in flight at once.

---

## Concurrency for Free (Almost)

If the futures are independent, you can poll them all together. `futures::future::join_all` takes a collection of futures and drives them concurrently on one thread, finishing when the last one does.

```rust
use futures::future::join_all;

#[tokio::main]
async fn main() {
    let urls = vec![
        "https://httpbin.org/delay/0".to_string(),
        "https://httpbin.org/status/200".to_string(),
        "https://httpbin.org/status/503".to_string(),
        // ...a dozen of these
    ];

    let start = std::time::Instant::now();
    let futures = urls.into_iter().map(check);   // a future per url, not yet run
    let probes: Vec<Probe> = join_all(futures).await;
    println!("checked {} endpoints in {:?}", probes.len(), start.elapsed());
}
```

The difference is not subtle.

| Strategy | 12 endpoints, ~80ms each | Wall-clock time |
|---|---|---|
| Sequential (`for url { check(url).await }`) | sum of all latencies | ~960 ms |
| Concurrent (`join_all`) | max of all latencies | ~120 ms |

<svg width="100%" viewBox="0 0 680 300" role="img" xmlns="http://www.w3.org/2000/svg">
  <title>Sequential versus concurrent polling on a timeline</title>
  <desc>Top: four requests run one after another, total time is their sum. Bottom: four requests run overlapping, total time is the longest single request.</desc>
  <style>
    .lbl  { font-family: -apple-system, system-ui, sans-serif; font-size: 13px; fill: #444441; font-weight: 600; }
    .sub  { font-family: -apple-system, system-ui, sans-serif; font-size: 11px; fill: #5F5E5A; }
    .mono { font-family: ui-monospace, monospace; font-size: 10px; fill: #2C2C2A; }
  </style>
  <text class="lbl" x="20" y="26">Sequential — each request waits for the previous one</text>
  <rect x="60"  y="40" width="120" height="22" rx="4" fill="#F5C4B3" stroke="#D85A30" stroke-width="0.8"/>
  <text class="mono" x="120" y="55" text-anchor="middle">req 1</text>
  <rect x="180" y="40" width="120" height="22" rx="4" fill="#F5C4B3" stroke="#D85A30" stroke-width="0.8"/>
  <text class="mono" x="240" y="55" text-anchor="middle">req 2</text>
  <rect x="300" y="40" width="120" height="22" rx="4" fill="#F5C4B3" stroke="#D85A30" stroke-width="0.8"/>
  <text class="mono" x="360" y="55" text-anchor="middle">req 3</text>
  <rect x="420" y="40" width="120" height="22" rx="4" fill="#F5C4B3" stroke="#D85A30" stroke-width="0.8"/>
  <text class="mono" x="480" y="55" text-anchor="middle">req 4</text>
  <line x1="60" y1="74" x2="540" y2="74" stroke="#A32D2D" stroke-width="1"/>
  <text class="sub" x="300" y="90" text-anchor="middle" fill="#A32D2D">total ≈ sum of all four</text>
  <text class="lbl" x="20" y="150">Concurrent — all four in flight, the thread juggles them</text>
  <rect x="60" y="166" width="130" height="18" rx="4" fill="#9FE1CB" stroke="#0F6E56" stroke-width="0.8"/>
  <text class="mono" x="125" y="179" text-anchor="middle">req 1</text>
  <rect x="60" y="188" width="150" height="18" rx="4" fill="#9FE1CB" stroke="#0F6E56" stroke-width="0.8"/>
  <text class="mono" x="135" y="201" text-anchor="middle">req 2</text>
  <rect x="60" y="210" width="120" height="18" rx="4" fill="#9FE1CB" stroke="#0F6E56" stroke-width="0.8"/>
  <text class="mono" x="120" y="223" text-anchor="middle">req 3</text>
  <rect x="60" y="232" width="140" height="18" rx="4" fill="#9FE1CB" stroke="#0F6E56" stroke-width="0.8"/>
  <text class="mono" x="130" y="245" text-anchor="middle">req 4</text>
  <line x1="60" y1="262" x2="210" y2="262" stroke="#0F6E56" stroke-width="1"/>
  <text class="sub" x="135" y="278" text-anchor="middle" fill="#0F6E56">total ≈ the single slowest request</text>
  <line x1="210" y1="160" x2="210" y2="262" stroke="#B4B2A9" stroke-width="0.6" stroke-dasharray="3 3"/>
</svg>

One thread, no extra OS threads spawned, an 8x speedup. This is the entire reason async exists: I/O-bound work where the bottleneck is waiting, not computing.

---

## The Wall: Shared Mutable State

`join_all` is clean because the futures are independent and the results come back in one tidy `Vec`. Real monitors aren't always that tidy. I wanted each check to push its result into a shared collection as it finished — say, a running list the UI could read. So I spawned each check as its own task with `tokio::spawn` and tried to push into a shared `Vec`:

```rust
#[tokio::main]
async fn main() {
    let mut probes: Vec<Probe> = Vec::new();

    for url in urls {
        tokio::spawn(async move {
            let probe = check(url).await;
            probes.push(probe);   // <- here be dragons
        });
    }
}
```

This does not compile, and the error is a small lecture:

```text
error[E0373]: async block may outlive the current function, but it
              borrows `probes`, which is owned by the current function
   |
   |  probes.push(probe);
   |  ^^^^^^ `probes` is borrowed here
   |
note: function requires argument type to outlive `'static`
```

And if you try to fix it by capturing a `&mut probes` into every task, you collide with the rule from Part 2: you cannot hand out multiple mutable borrows of `probes`. `tokio::spawn` makes it worse on purpose — a spawned task may run on a *different* thread and may outlive the function that created it, so anything it captures must be safe to send to another thread and must live long enough. A plain `&mut Vec<Probe>` shared across threads is precisely a data race, and the compiler will not be talked into it.

This is the moment that converted me. In Go or Java I would have written this exact loop, it would have compiled, and it would have *mostly* worked — until two tasks pushed at the same instant and corrupted the vector's internal length, or a reallocation happened mid-push. Rust didn't let me get that far.

---

## Send and Sync: The Traits That Police Threads

How does the compiler know? Two marker traits, automatically derived for almost every type:

- **`Send`** — a type whose ownership can be safely *transferred* to another thread.
- **`Sync`** — a type that can be safely *shared* by reference (`&T`) across threads.

`tokio::spawn` requires the future you give it to be `Send` and `'static`. A future that holds a `&mut Vec<Probe>` borrowing a local is neither, so it's rejected. The genius is that these traits are structural: a type is `Send` only if all its fields are `Send`. This is why `Rc<T>` (a single-threaded reference count) is *not* `Send` — its counter isn't atomic, so sharing it across threads would race the count — while `Arc<T>` (atomic reference count) *is* `Send` and `Sync`. The fix to a whole class of threading bugs is often literally swapping `Rc` for `Arc`, and the compiler tells you exactly when you need to.

---

## Arc + Mutex: Shared Ownership, Safe Mutation

To share mutable state across tasks you need two things the compiler will accept:

1. **Shared ownership** — more than one task needs to own the value, since any of them might be the last one alive. That's `Arc<T>`: an Atomically Reference-Counted pointer. Cloning an `Arc` doesn't copy the data; it bumps an atomic counter and hands you another handle to the same value. When the last `Arc` drops, the value drops.
2. **Safe mutation** — `Arc<T>` only gives shared (`&T`) access, and you can't mutate through a shared reference. `Mutex<T>` bridges that: locking it returns an exclusive guard, and the type system guarantees only one task holds the guard at a time.

Together, `Arc<Mutex<T>>` is the canonical "shared mutable state across threads" type.

```rust
use std::sync::{Arc, Mutex};

#[tokio::main]
async fn main() {
    let probes = Arc::new(Mutex::new(Vec::<Probe>::new()));
    let mut handles = Vec::new();

    for url in urls {
        let probes = Arc::clone(&probes);  // a new handle to the SAME vec
        handles.push(tokio::spawn(async move {
            let probe = check(url).await;
            probes.lock().unwrap().push(probe); // lock, push, unlock
        }));
    }

    for h in handles {
        h.await.unwrap();                  // wait for every task
    }

    let probes = probes.lock().unwrap();
    println!("collected {} probes", probes.len());
}
```

`Arc::clone(&probes)` is cheap and explicit — it's an atomic increment, and Rust makes you write it so you never accidentally deep-copy. Each task owns its own handle; the `Vec` lives until the last handle drops. `probes.lock()` blocks until this task has exclusive access, hands back a guard, and — RAII again, straight from Part 1 — the lock releases automatically when the guard goes out of scope at the end of the `push`. You cannot forget to unlock.

<svg width="100%" viewBox="0 0 680 320" role="img" xmlns="http://www.w3.org/2000/svg">
  <title>Arc Mutex: many task handles sharing one mutex-guarded vector</title>
  <desc>Three async tasks each hold an Arc clone pointing to a single Mutex-wrapped Vec on the heap. Only the task holding the lock can mutate it.</desc>
  <style>
    .lbl  { font-family: -apple-system, system-ui, sans-serif; font-size: 13px; fill: #444441; font-weight: 600; }
    .sub  { font-family: -apple-system, system-ui, sans-serif; font-size: 11px; fill: #5F5E5A; }
    .mono { font-family: ui-monospace, monospace; font-size: 10px; fill: #2C2C2A; }
  </style>
  <defs>
    <marker id="c1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
  <rect x="20"  y="40" width="150" height="46" rx="8" fill="#E6F1FB" stroke="#378ADD" stroke-width="1"/>
  <text class="lbl" x="95" y="60" text-anchor="middle" font-size="11">Task A</text>
  <text class="mono" x="95" y="78" text-anchor="middle">Arc clone #1</text>
  <rect x="20"  y="130" width="150" height="46" rx="8" fill="#E6F1FB" stroke="#378ADD" stroke-width="1"/>
  <text class="lbl" x="95" y="150" text-anchor="middle" font-size="11">Task B 🔒 holds lock</text>
  <text class="mono" x="95" y="168" text-anchor="middle">Arc clone #2</text>
  <rect x="20"  y="220" width="150" height="46" rx="8" fill="#E6F1FB" stroke="#378ADD" stroke-width="1"/>
  <text class="lbl" x="95" y="240" text-anchor="middle" font-size="11">Task C ⏳ waiting</text>
  <text class="mono" x="95" y="258" text-anchor="middle">Arc clone #3</text>
  <rect x="380" y="110" width="280" height="96" rx="10" fill="#F1EFE8" stroke="#888780" stroke-width="1"/>
  <text class="sub" x="395" y="100">HEAP — one allocation, refcount = 3</text>
  <rect x="400" y="126" width="240" height="28" rx="6" fill="#FAEEDA" stroke="#BA7517" stroke-width="1.2"/>
  <text class="mono" x="520" y="144" text-anchor="middle">Mutex (locked by B)</text>
  <rect x="400" y="160" width="240" height="32" rx="6" fill="#EAF3DE" stroke="#639922" stroke-width="1"/>
  <text class="mono" x="520" y="180" text-anchor="middle">Vec&lt;Probe&gt;  [..]</text>
  <line x1="170" y1="63"  x2="378" y2="135" stroke="#378ADD" stroke-width="1.2" marker-end="url(#c1)"/>
  <line x1="170" y1="153" x2="378" y2="150" stroke="#BA7517" stroke-width="2"   marker-end="url(#c1)"/>
  <line x1="170" y1="243" x2="378" y2="168" stroke="#B4B2A9" stroke-width="1.2" stroke-dasharray="4 3" marker-end="url(#c1)"/>
  <text class="sub" x="20" y="300">Three owners, one value. Only the lock-holder (B) mutates; C blocks until B's guard drops. The compiler guarantees no two writers at once.</text>
</svg>

> **A real footgun worth naming:** holding a standard `std::sync::Mutex` guard across an `.await` can deadlock a Tokio task, because the task may be parked while still holding the lock. Lock, mutate, and drop the guard *before* you await — as the code above does — or use `tokio::sync::Mutex`, which is designed to be held across await points.

---

## The Cleaner Answer: Don't Share, Send

`Arc<Mutex<T>>` works, but every lock is a tiny point of contention, and shared mutable state is harder to reason about than code that doesn't have any. Often the better design is to not share at all: have each task *own* its result and hand it off through a **channel**. One task produces, one task consumes, and ownership moves cleanly between them — no locks.

```rust
use tokio::sync::mpsc;

#[tokio::main]
async fn main() {
    let (tx, mut rx) = mpsc::channel::<Probe>(32);

    for url in urls {
        let tx = tx.clone();                 // each producer gets a sender
        tokio::spawn(async move {
            let probe = check(url).await;
            let _ = tx.send(probe).await;     // ownership of probe MOVES into the channel
        });
    }
    drop(tx); // drop the original so the channel closes when producers finish

    let mut probes = Vec::new();
    while let Some(probe) = rx.recv().await {  // single consumer collects them
        probes.push(probe);
    }
    println!("collected {} probes", probes.len());
}
```

Each `Probe` has exactly one owner the entire time — it's created in a task, then *moved* into the channel, then *moved* out to the consumer. There is no moment where two threads can touch it, so there is nothing to lock and nothing to race. This is the Rust restatement of an old concurrency proverb: *don't communicate by sharing memory; share memory by communicating.* For `pulse`, this is the model we'll keep — worker tasks probe endpoints and stream results to the part of the program that owns the screen.

| Pattern | Use it when | Cost |
|---|---|---|
| `join_all` | Fixed batch, want all results together | Simplest, but waits for the whole batch |
| `Arc<Mutex<T>>` | Many tasks mutating one shared structure | Lock contention; easy to misuse across `.await` |
| Channel (`mpsc`) | Producers generate values a consumer collects | A little setup; usually the cleanest design |

---

## Why This Felt Like Magic

Here's the thing that reframed Rust for me. The rules that made Parts 1 and 2 a fight — one owner, shared XOR mutable, no reference outlives its referent — are *exactly* the rules you need for safe concurrency. A data race is, definitionally, two threads accessing one value with at least one writing and no synchronization. That is shared-and-mutable-at-once across threads, which the borrow checker already forbids. So the compiler that nagged you about printing a variable twice is the same compiler that, for free, proves your concurrent code has no data races.

Other languages bolt thread-safety on as a runtime concern: locks you remember to take, race detectors you run in CI and hope catch it, conventions in a wiki. Rust folds it into the type system you were already fighting. You don't get fewer concurrency bugs because you're more careful. You get fewer because the careless version doesn't build.

---

## Where We Are

`pulse` can now sweep a whole fleet of endpoints concurrently and stream the results back without a single lock-related bug being possible:

- **Async** turns I/O waiting into concurrency on a single thread; `.await` yields, the runtime juggles.
- **`Send`/`Sync`** are the marker traits the compiler uses to police what crosses thread boundaries — and why `Arc` works where `Rc` doesn't.
- **`Arc<Mutex<T>>`** is shared ownership plus mutual exclusion for when you genuinely must share.
- **Channels** move ownership between tasks so you often don't have to share at all.
- The ownership rules from earlier *are* the data-race guarantees. Same rules, free safety.

We have a fast, correct engine. What we don't have is anything to look at — it's all `println!`. Time to build the actual terminal interface: a live, refreshing dashboard. That means raw terminal mode, an event loop, rendering widgets, and the genuinely hard question of how to guarantee the terminal gets restored even if the program crashes mid-draw. Error handling and RAII are about to do real work.

**Next:** [Part 4 — The TUI with ratatui, error handling, and RAII cleanup](/blogs/building-rust-tui-api-monitor-part-4-ratatui-error-handling).
