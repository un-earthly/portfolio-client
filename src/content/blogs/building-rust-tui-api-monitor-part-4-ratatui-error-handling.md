---
title: "A Panic Wrecked My Terminal, Then RAII Fixed It Forever: Building a Terminal API Monitor, Part 4"
date: 2026-06-16
tags: [Rust, ratatui, crossterm, TUI, error handling, Result, Option, pattern matching, RAII, Drop, anyhow, thiserror, TUI series]
metaDescription: Part 4 of building a terminal API monitor in Rust. We build the live dashboard with ratatui, handle errors with Result and the ? operator instead of exceptions, model status with enums and pattern matching, and use RAII and the Drop trait to guarantee the terminal is restored even on panic.
readTime: 14
type: technical
excerpt: I ran the TUI, it panicked mid-render, and left my terminal in raw mode, no echo, no newlines, a wreck. The fix turned out to be the same RAII mechanism that frees memory in Rust. This is the part about error handling without exceptions, pattern matching, and the Drop trait. Part 4 of 5.
cover: '/blog-covers/building-rust-tui-api-monitor-part-4-ratatui-error-handling.svg'
---

The engine worked. [Part 3](/blogs/building-rust-tui-api-monitor-part-3-async-tokio-concurrency) left `pulse` able to sweep a fleet of endpoints concurrently and stream results back. Now it needed a face: a live, bordered dashboard that refreshes on a loop, green for healthy, red for down, and quits when I press `q`.

I wired up ratatui, switched the terminal into raw mode, drew the first frame, and then an `.unwrap()` deep in my render code hit a `None` and panicked. The program died. And my terminal *stayed broken*: no echo when I typed, no line breaks, the cursor hidden, the prompt mangled. I had to blind-type `reset` to get it back.

That failure taught me the single most useful pattern in Rust, and it's the same one that's been quietly freeing memory since Part 1: RAII. This post is about making `pulse` look good, but really it's about handling errors and cleaning up without exceptions, `try/finally`, or trusting yourself to remember.

> **TL;DR**: Rust has no exceptions. Fallible operations return `Result<T, E>`, absence is `Option<T>`, and the `?` operator propagates errors up the call stack concisely. `match` forces you to handle every case of an enum, so "I forgot a state" is a compile error. And the `Drop` trait, RAII, guarantees cleanup code runs when a value goes out of scope, *including during a panic unwind*, which is how you restore a terminal you put into raw mode no matter how the program ends.

---

## The Series

1. [Part 1, Ownership and the borrow checker](/blogs/building-rust-tui-api-monitor-part-1-ownership)
2. [Part 2, Borrowing, lifetimes, and serde](/blogs/building-rust-tui-api-monitor-part-2-borrowing-lifetimes)
3. [Part 3, Async, Tokio, and sharing state across tasks](/blogs/building-rust-tui-api-monitor-part-3-async-tokio-concurrency)
4. **Part 4, The TUI, error handling, and RAII cleanup** *(you are here)*
5. [Part 5, Traits, iterators, zero-cost abstractions, and the release build](/blogs/building-rust-tui-api-monitor-part-5-traits-performance-release)

---

## Errors Are Values, Not Exceptions

Before any UI, we need to talk about how things fail, because a TUI does a lot of fallible I/O. Rust has no `try/catch`. A function that can fail returns its result *wrapped*:

```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

This is just an enum in the standard library, nothing magic. A function that reads from the network returns `Result<Response, reqwest::Error>`, and you can't get at the `Response` without acknowledging the `Err` case. There's no invisible exception that unwinds three stack frames to a handler you forgot to write. The failure is right there in the type signature, and the compiler makes you deal with it.

Its sibling handles absence. Instead of `null`, Rust has:

```rust
enum Option<T> {
    Some(T),
    None,
}
```

There is no null pointer in safe Rust. A value that might be missing is an `Option<T>`, and you must check before you use it. The billion-dollar mistake is simply not expressible.

Dealing with these by hand would be verbose, so the **`?` operator** does the common thing: if it's `Ok`/`Some`, unwrap the value and continue; if it's `Err`/`None`, return it from the current function immediately.

```rust
fn fetch_config() -> Result<Config, std::io::Error> {
    let text = std::fs::read_to_string("pulse.toml")?; // on Err, return early
    let config = parse(&text)?;                         // on Err, return early
    Ok(config)
}
```

`?` is what `.unwrap()` should have been: instead of crashing on failure, it hands the error to the caller. My terminal-wrecking bug was an `.unwrap()` where a `?` (or a real handler) belonged.

For the application's own errors I use two crates the whole ecosystem reaches for:

- **`anyhow`**: for application code. `anyhow::Result<T>` accepts any error type, so `?` works across reqwest errors, IO errors, and parse errors without ceremony. Great for `main` and top-level glue.
- **`thiserror`**: for library code, where callers need to *match* on specific error variants. It derives clean custom error enums.

```rust
// library-style: callers can match on the variant
#[derive(Debug, thiserror::Error)]
enum ProbeError {
    #[error("request timed out after {0}ms")]
    Timeout(u64),
    #[error("bad status: {0}")]
    BadStatus(u16),
    #[error(transparent)]
    Network(#[from] reqwest::Error), // `?` auto-converts reqwest::Error into this
}
```

---

## Modeling Status as an Enum the Compiler Polices

A probe isn't just up or down. It's up, degraded (responding but slow), or down. In a lot of languages you'd represent that with a string or an int and hope every `switch` covers every value. Rust enums carry data and force exhaustiveness:

```rust
enum Status {
    Up { latency_ms: u128 },
    Slow { latency_ms: u128 },
    Down { reason: String },
}
```

When I render a row, I `match` on the status. The payoff is that the compiler refuses to compile a `match` that misses a case:

```rust
fn render_label(status: &Status) -> (&'static str, Color) {
    match status {
        Status::Up { .. }   => ("● UP",   Color::Green),
        Status::Slow { .. } => ("● SLOW", Color::Yellow),
        Status::Down { .. } => ("● DOWN", Color::Red),
    } // add a 4th variant later and forget this match? -> compile error E0004
}
```

This sounds minor until you've shipped the bug it prevents: a new status variant added six months later, a `switch` somewhere that silently falls through to a default, a UI showing "unknown" in production. In Rust that's `error[E0004]: non-exhaustive patterns`. The state machine can't drift out of sync with the code that handles it.

---

## The Dashboard with ratatui

**ratatui** is the TUI framework; **crossterm** is the cross-platform terminal backend it draws through. The render model is immediate-mode: every frame, you describe the entire screen from your current state, and ratatui diffs it against the last frame and writes only what changed.

```toml
[dependencies]
ratatui = "0.29"
crossterm = "0.28"
anyhow = "1"
thiserror = "2"
# ...plus reqwest, tokio, serde from earlier parts
```

```rust
use ratatui::prelude::*;
use ratatui::widgets::{Block, Borders, Row, Table};

fn draw(frame: &mut Frame, probes: &[Probe]) {
    let rows = probes.iter().map(|p| {
        let (label, color) = render_label(&p.status);
        Row::new(vec![
            p.url.clone(),
            label.to_string(),
            format!("{} ms", p.latency_ms()),
        ])
        .style(Style::default().fg(color))
    });

    let table = Table::new(
        rows,
        [Constraint::Percentage(60), Constraint::Length(10), Constraint::Length(12)],
    )
    .header(Row::new(vec!["ENDPOINT", "STATUS", "LATENCY"]).bold())
    .block(
        Block::default()
            .title(" pulse — q to quit ")
            .borders(Borders::ALL),
    );

    frame.render_widget(table, frame.area());
}
```

<svg width="100%" viewBox="0 0 680 280" role="img" xmlns="http://www.w3.org/2000/svg">
  <title>The pulse terminal dashboard layout</title>
  <desc>A bordered terminal panel titled pulse with a header row and several endpoint rows colored green, yellow, and red by status</desc>
  <style>
    .term { font-family: ui-monospace, monospace; font-size: 12px; fill: #2C2C2A; }
    .hd   { font-family: ui-monospace, monospace; font-size: 12px; fill: #444441; font-weight: 700; }
    .sub  { font-family: -apple-system, system-ui, sans-serif; font-size: 11px; fill: #5F5E5A; }
  </style>
  <rect x="20" y="20" width="640" height="220" rx="8" fill="#F1EFE8" stroke="#2C2C2A" stroke-width="1.5"/>
  <rect x="20" y="20" width="640" height="26" rx="8" fill="#E6F1FB" stroke="#2C2C2A" stroke-width="1.5"/>
  <text class="hd" x="40" y="38">┌ pulse, q to quit ─────────────────────────────────────────┐</text>
  <text class="hd" x="40"  y="74">ENDPOINT</text>
  <text class="hd" x="430" y="74">STATUS</text>
  <text class="hd" x="560" y="74">LATENCY</text>
  <line x1="40" y1="84" x2="640" y2="84" stroke="#B4B2A9" stroke-width="0.8"/>
  <text class="term" x="40"  y="108">https://api.example.com/auth</text>
  <circle cx="436" cy="104" r="5" fill="#1D9E75"/>
  <text class="term" x="448" y="108" fill="#0F6E56">UP</text>
  <text class="term" x="560" y="108">42 ms</text>
  <text class="term" x="40"  y="134">https://api.example.com/billing</text>
  <circle cx="436" cy="130" r="5" fill="#1D9E75"/>
  <text class="term" x="448" y="134" fill="#0F6E56">UP</text>
  <text class="term" x="560" y="134">61 ms</text>
  <text class="term" x="40"  y="160">https://api.example.com/search</text>
  <circle cx="436" cy="156" r="5" fill="#FAC775"/>
  <text class="term" x="448" y="160" fill="#BA7517">SLOW</text>
  <text class="term" x="560" y="160">812 ms</text>
  <text class="term" x="40"  y="186">https://api.example.com/payments</text>
  <circle cx="436" cy="182" r="5" fill="#E24B4A"/>
  <text class="term" x="448" y="186" fill="#A32D2D">DOWN</text>
  <text class="term" x="560" y="186">- -</text>
  <text class="term" x="40"  y="212">https://api.example.com/notify</text>
  <circle cx="436" cy="208" r="5" fill="#1D9E75"/>
  <text class="term" x="448" y="212" fill="#0F6E56">UP</text>
  <text class="term" x="560" y="212">55 ms</text>
  <text class="sub" x="20" y="262">Each row's color comes straight from a `match` on the `Status` enum, the compiler guarantees every variant maps to something.</text>
</svg>

---

## The Event Loop

A TUI is a loop: draw the current state, wait briefly for input, react, repeat. crossterm lets us poll for events with a timeout, so the loop also serves as the refresh tick.

```rust
use std::time::Duration;
use crossterm::event::{self, Event, KeyCode};

fn run_ui(mut terminal: Terminal<impl Backend>, probes: &[Probe]) -> anyhow::Result<()> {
    loop {
        terminal.draw(|frame| draw(frame, probes))?;

        // wait up to 250ms for a key; if none, fall through and redraw
        if event::poll(Duration::from_millis(250))? {
            if let Event::Key(key) = event::read()? {
                match key.code {
                    KeyCode::Char('q') | KeyCode::Esc => return Ok(()),
                    _ => {}
                }
            }
        }
    }
}
```

`if let Event::Key(key) = ...` is pattern matching again, bind `key` only when the event is a key press, ignore mouse and resize events. Every `?` in that loop quietly forwards an IO error up to the caller instead of panicking. So when something goes wrong, we *leave the loop normally* rather than dying inside raw mode. Which brings us to the actual lesson.

---

## RAII: Cleanup That Cannot Be Skipped

Here was the bug. To draw a TUI you switch the terminal into *raw mode* (keys come through instantly, no echo) and into an *alternate screen* (so you don't clobber the scrollback). Both must be undone before the program exits, or the user's shell is left broken. My first version did the setup and teardown by hand:

```rust
enable_raw_mode()?;
execute!(stdout(), EnterAlternateScreen)?;

run_ui(terminal, &probes)?;   // <- if this panics, the next two lines never run

disable_raw_mode()?;
execute!(stdout(), LeaveAlternateScreen)?;
```

When `run_ui` panicked, control jumped straight past the teardown lines. Terminal left in raw mode. This is the exact problem `try/finally` exists to solve in other languages, and Rust's answer is better, because it ties cleanup to a *value* instead of a *block*. You make a guard type and implement `Drop` for it:

```rust
use crossterm::terminal::{
    enable_raw_mode, disable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen,
};
use crossterm::execute;
use std::io::stdout;

/// Owns the terminal's "raw + alternate screen" state.
struct TerminalGuard;

impl TerminalGuard {
    fn enter() -> anyhow::Result<Self> {
        enable_raw_mode()?;
        execute!(stdout(), EnterAlternateScreen)?;
        Ok(TerminalGuard)
    }
}

impl Drop for TerminalGuard {
    fn drop(&mut self) {
        // best-effort restore; ignore errors because we're tearing down
        let _ = disable_raw_mode();
        let _ = execute!(stdout(), LeaveAlternateScreen);
    }
}
```

Now `main` just holds the guard:

```rust
fn main() -> anyhow::Result<()> {
    let _guard = TerminalGuard::enter()?;   // raw mode ON
    let terminal = Terminal::new(CrosstermBackend::new(stdout()))?;
    let probes = collect_probes();          // from Part 3's engine

    run_ui(terminal, &probes)?;             // even if THIS panics...
    Ok(())
}                                           // ..._guard drops here, restoring the terminal
```

The key fact: when a Rust program panics, by default it *unwinds* the stack, walking back up through every frame and running the `Drop` for every live value on the way out, exactly as if each had gone out of scope normally. So whether `run_ui` returns `Ok`, returns an `Err` via `?`, or panics outright, `_guard` is dropped on the way out and the terminal is restored. There is no code path that skips it. I deleted the manual teardown lines and the bug became structurally impossible.

<svg width="100%" viewBox="0 0 680 320" role="img" xmlns="http://www.w3.org/2000/svg">
  <title>RAII guarantees terminal restore on every exit path including panic</title>
  <desc>Three exit paths from the run function, normal return, error via question mark, and panic, all converge on the guard's Drop running and the terminal being restored</desc>
  <style>
    .lbl  { font-family: -apple-system, system-ui, sans-serif; font-size: 13px; fill: #444441; font-weight: 600; }
    .sub  { font-family: -apple-system, system-ui, sans-serif; font-size: 11px; fill: #5F5E5A; }
    .mono { font-family: ui-monospace, monospace; font-size: 11px; fill: #2C2C2A; }
    .ok   { font-family: -apple-system, system-ui, sans-serif; font-size: 11px; fill: #0F6E56; font-weight: 600; }
  </style>
  <defs>
    <marker id="d1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
  <rect x="240" y="20" width="200" height="36" rx="8" fill="#FAEEDA" stroke="#BA7517" stroke-width="1.2"/>
  <text class="mono" x="340" y="42" text-anchor="middle">TerminalGuard::enter()  🔒</text>
  <rect x="40"  y="110" width="160" height="40" rx="8" fill="#EAF3DE" stroke="#639922" stroke-width="1"/>
  <text class="sub" x="120" y="135" text-anchor="middle">normal return Ok(())</text>
  <rect x="260" y="110" width="160" height="40" rx="8" fill="#E6F1FB" stroke="#378ADD" stroke-width="1"/>
  <text class="sub" x="340" y="129" text-anchor="middle">early return via `?`</text>
  <text class="sub" x="340" y="143" text-anchor="middle">(an Err)</text>
  <rect x="480" y="110" width="160" height="40" rx="8" fill="#FCEBEB" stroke="#E24B4A" stroke-width="1"/>
  <text class="sub" x="560" y="135" text-anchor="middle">panic!, stack unwinds</text>
  <line x1="340" y1="56" x2="120" y2="108" stroke="#B4B2A9" stroke-width="1" marker-end="url(#d1)"/>
  <line x1="340" y1="56" x2="340" y2="108" stroke="#B4B2A9" stroke-width="1" marker-end="url(#d1)"/>
  <line x1="340" y1="56" x2="560" y2="108" stroke="#B4B2A9" stroke-width="1" marker-end="url(#d1)"/>
  <rect x="220" y="200" width="240" height="44" rx="8" fill="#FAEEDA" stroke="#BA7517" stroke-width="1.4"/>
  <text class="mono" x="340" y="220" text-anchor="middle">_guard.drop() runs</text>
  <text class="sub" x="340" y="236" text-anchor="middle">disable_raw_mode + leave alt screen</text>
  <line x1="120" y1="150" x2="300" y2="198" stroke="#639922" stroke-width="1.3" marker-end="url(#d1)"/>
  <line x1="340" y1="150" x2="340" y2="198" stroke="#378ADD" stroke-width="1.3" marker-end="url(#d1)"/>
  <line x1="560" y1="150" x2="380" y2="198" stroke="#E24B4A" stroke-width="1.3" marker-end="url(#d1)"/>
  <rect x="240" y="276" width="200" height="34" rx="8" fill="#EAF3DE" stroke="#639922" stroke-width="1.2"/>
  <text class="ok" x="340" y="297" text-anchor="middle">✓ terminal restored, always</text>
  <line x1="340" y1="244" x2="340" y2="274" stroke="#B4B2A9" stroke-width="1" marker-end="url(#d1)"/>
</svg>

This is the same mechanism from Part 1, generalized. There, `Drop` freed a `String`'s heap buffer at end of scope. Here, `Drop` restores the terminal. A file handle's `Drop` closes the file; a `MutexGuard`'s `Drop` (Part 3) releases the lock. **Rust has exactly one cleanup model, and it works for memory, locks, files, sockets, and terminals identically.** Learn it once for `String` and you've learned it for everything. Compare that to languages where memory is the GC's job, files want `try-with-resources` or `with`, and locks want a `finally`, three different mechanisms for the same idea.

> One caveat: this relies on the default unwinding panic behavior. If you configure `panic = "abort"` in release for smaller binaries, destructors don't run on panic, so for a TUI you'd also install a panic hook that restores the terminal. Worth knowing the edge exists; the default profile unwinds.

---

## Where We Are

`pulse` is now a real, usable tool: a live dashboard that polls concurrently, colors each service by status, refreshes a few times a second, quits cleanly on `q`, and never, under any failure, leaves your terminal in a bad state.

- Errors are **values** (`Result<T, E>`), absence is `Option<T>`, and **`?`** propagates failures without exceptions.
- **`match`** is exhaustive: forgetting an enum variant is a compile error, so your state machine can't drift.
- **RAII via `Drop`** ties cleanup to a value's lifetime and runs it on *every* exit path, including panic unwind. One model for memory, locks, files, and terminals.

There's one promise from the very first post left to cash in. I claimed all this safety, no GC, no data races, deterministic cleanup, comes at *no runtime cost*. That's the "zero-cost abstractions" claim, and it's a big one. The final part builds the release binary, measures it, and shows where the cost actually went (compile time, and your patience with the borrow checker) versus where it didn't (the machine code).

**Next:** [Part 5, Traits, iterators, zero-cost abstractions, and the release build](/blogs/building-rust-tui-api-monitor-part-5-traits-performance-release).
