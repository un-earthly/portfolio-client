---
title: "Scripts Are Not Shortcuts. They Are Architecture."
date: 2026-06-20
tags: [scripts, monorepo, developer tooling, Node.js, automation, architecture, package.json]
metaDescription: Why npm scripts are a form of architecture, not just aliases: a deep dive into how a real monorepo uses scripts to encode decisions about how a project is run, validated, and shipped, plus the Bash and Linux process mechanics underneath, including how to safely stop a script you didn't mean to run.
readTime: 10
type: technical
excerpt: npm scripts are not aliases. They are the interface between a developer's intent and a system's behaviour. Here's how a real production monorepo uses over fifty scripts to encode decisions about how it runs, validates itself, and ships, plus what actually happens on the machine when a script runs and how to stop one cleanly.
cover: '/blog-covers/scripts-part-1-what-are-scripts.svg'
tldr: "npm/pnpm scripts are architecture, not shortcuts: they encode how a project runs, builds, tests, and ships behind a stable name. Running one spawns a real subshell with node_modules/.bin on PATH, so exit codes, shebangs, and signals all behave like any other Linux process. Ctrl+C sends SIGINT to the foreground job; for backgrounded or orphaned processes (like a stuck dev server on a port), use jobs/fg/kill or lsof + kill, trying SIGTERM before SIGKILL. A minimum viable script set is three: dev, lint (auto-fix), build (single source of truth for compilation)."
---

# Scripts Are Not Shortcuts. They Are Architecture.

**Series: The Scripts Deep-Dive, Part 1 of 4**

---

Every serious project eventually accumulates a `package.json` full of entries in the `"scripts"` block. Most developers treat them as convenient aliases: a shorter way to type a long command. That framing undersells what scripts actually are.

Scripts are a form of architecture. They encode decisions about how a project is run, validated, and shipped. When they are designed deliberately, they become the interface between a developer's intent and the system's behaviour. When they are ignored or left ad hoc, they become the source of "it works on my machine" conversations, inconsistent CI failures, and onboarding friction that nobody can explain.

This post is the first in a four-part series built from a real production monorepo: a moderately complex system built on NestJS, Next.js, Supabase, BullMQ, and WebSockets, with four submodules, a shared contracts package, and several moving parts in production. The scripts reference in that codebase runs to over fifty entries. That number is intentional and worth examining.

This part also goes one level lower than the rest of the series. Before you can reason about *which* scripts a project needs, you need to know what actually happens on the machine when you type `pnpm dev` and hit enter, and how to take that back if you hit enter on the wrong thing. So alongside the architecture argument, this post covers the Bash and Linux mechanics underneath: process execution, exit codes, and how to stop something you started by accident without taking down your whole terminal session.

---

## What a Script Actually Is

At the most literal level, a script in a Node.js project is a named shell command stored in `package.json`. When you run `pnpm dev`, the package manager looks up the `dev` key in `scripts` and executes the value as a shell command in the project's directory.

That is the mechanism. The purpose is different.

A script is a repeatable unit of work with a stable name. The name is what matters. When a developer on your team runs `pnpm migration:run`, they are not thinking about TypeORM CLI flags or the path to `data-source.ts`. They are thinking about applying pending migrations. The script handles the how so the developer can focus on the what.

This distinction between *what* and *how* is the same principle that separates a good API from a bad one. A good API hides the implementation detail and exposes a stable contract. Scripts do the same for your local and CI workflows. The official <a href="https://docs.npmjs.com/cli/using-npm/scripts/" target="_blank" rel="noopener noreferrer">npm scripts documentation</a> is worth reading end to end at least once, it covers the full lifecycle hook system (`pre`, `post`, and the special-cased hooks like `prepare` and `prepublishOnly`) that most developers only discover by accident.

---

## What Actually Happens When You Run One

This is the part most tutorials skip, and it is the part that matters when something goes wrong.

When you type `pnpm dev` and press enter, three things happen in sequence:

1. Your shell (Bash, Zsh, whatever your terminal runs) parses the line and hands it to `pnpm`, which is itself a program on your `PATH`.
2. `pnpm` reads `package.json`, finds the `dev` key, and spawns a **new subshell** to run the associated command string. This is why a script defined as `"dev": "node server.js"` does not run in your interactive shell; it runs in a short-lived child shell that npm/pnpm creates for that one invocation.
3. That subshell resolves `node` on its `PATH` and executes it. Critically, npm and pnpm prepend `node_modules/.bin` to the `PATH` inside that subshell, which is why a script can call `eslint` or `jest` directly without `./node_modules/.bin/` in front of it, even though those binaries are not on your normal shell's `PATH`.

Two consequences fall out of this that trip people up constantly:

**Exit codes propagate, and they matter.** Every process on Linux and macOS returns a numeric exit code between 0 and 255 when it finishes. `0` means success; anything else means failure, and different nonzero codes conventionally mean different failure modes. When you chain scripts with `&&` (`"quality": "npm run lint && npm run test"`), the second command only runs if the first exits `0`. This is not a convention npm invented, it is how every POSIX shell works, and it is why a CI pipeline correctly halts a deploy when `test:ci` fails but a chain built with `;` instead of `&&` would run every step regardless of failure and quietly ship broken code.

**A script inherits the shebang contract of whatever it calls.** If you have ever opened a `node_modules/.bin/eslint` file, the first line is `#!/usr/bin/env node`. That line, called a shebang, tells the OS which interpreter should execute the rest of the file. It is the same mechanism that lets you run a `.sh` file directly as `./deploy.sh` instead of `bash deploy.sh`. The npm docs on <a href="https://docs.npmjs.com/files/package.json/" target="_blank" rel="noopener noreferrer">package.json's `bin` field</a> call this out explicitly: any file referenced there must start with `#!/usr/bin/env node` or the OS will try to execute it as a native binary and fail immediately.

None of this requires memorizing kernel internals. It requires knowing that a script is a real process tree, not a black box, and that the same rules governing any shell command on Linux govern your `npm run` invocations too.

---

## Stopping a Script You Didn't Mean to Run

This is the part nobody writes down, and it is the part that actually causes lost time. You run `pnpm dev:all` in the wrong terminal tab, or a migration script starts against the wrong database, or a seed script you meant to run against staging fires against a `.env` still pointed at production. You need to stop it, cleanly, right now.

### The first move: Ctrl+C

`Ctrl+C` sends `SIGINT` (signal 2) to the foreground process group in your terminal. This is not npm-specific; it is a POSIX terminal convention that predates JavaScript entirely, documented in the <a href="https://www.gnu.org/software/bash/manual/html_node/Signals.html" target="_blank" rel="noopener noreferrer">Bash manual's chapter on signals</a>. A well-behaved process catches `SIGINT`, does any necessary cleanup (closing a database connection, flushing a write buffer), and exits. A process with no signal handler just dies immediately, which is fine for a dev server but can leave things in a bad state for anything touching a database or a file lock.

In a Node.js process specifically, you can intercept this yourself:

```js
process.on('SIGINT', () => {
  console.log('Caught SIGINT, closing connections...');
  db.close(() => process.exit(0));
});
```

This pattern, along with the full list of which signals Node.js can and cannot intercept (`SIGKILL` and `SIGSTOP` never can, on any OS), is documented in the <a href="https://nodejs.org/api/process.html" target="_blank" rel="noopener noreferrer">Node.js process API docs</a> under Signal Events.

### When Ctrl+C does not work

Two situations come up constantly:

**A background job.** If you launched something with a trailing `&` (`node worker.js &`), it is no longer in the foreground process group, so Ctrl+C in that terminal will not touch it. Bash's <a href="https://www.gnu.org/software/bash/manual/html_node/Job-Control-Basics.html" target="_blank" rel="noopener noreferrer">job control</a> is the tool here: run `jobs` to list what is running under the current shell, `fg %1` to bring job 1 to the foreground (where Ctrl+C works again), or send a signal directly without bringing it forward at all:

```bash
jobs                # list background jobs with their numbers
kill %1             # sends SIGTERM to job 1
kill -SIGINT %1     # or send SIGINT specifically, same as Ctrl+C would
```

The <a href="https://www.gnu.org/software/bash/manual/html_node/Job-Control-Builtins.html" target="_blank" rel="noopener noreferrer">Job Control Builtins</a> section of the Bash manual covers `kill`, `bg`, `fg`, and `disown` in full; `disown` in particular is worth knowing if you want a background job to survive after you close the terminal.

**A process holding a port, with no terminal attached to it at all.** This is the classic `EADDRINUSE: address already in use` error when a dev server did not shut down cleanly, maybe your machine slept mid-session, maybe a previous `pnpm dev` crashed without releasing the socket. There is no Ctrl+C for this because there is no foreground shell attached anymore. Find the process by the port it is holding, then kill it directly:

```bash
lsof -i :3000          # find what's listening on port 3000
kill -15 $(lsof -t -i :3000)   # SIGTERM: ask it to shut down gracefully
# still stuck after a few seconds?
kill -9 $(lsof -t -i :3000)    # SIGKILL: no cleanup, immediate death
```

On systems without `lsof` installed, `fuser -k 3000/tcp` or `ss -tulpn | grep 3000` do the same job. The full semantics of `kill` and the process ID matching rules it supports are in the <a href="https://www.man7.org/linux/man-pages/man1/kill.1.html" target="_blank" rel="noopener noreferrer">kill(1) man page</a>, and the complete signal table, what each one means and whether it can be caught, is in <a href="https://www.man7.org/linux/man-pages/man7/signal.7.html" target="_blank" rel="noopener noreferrer">signal(7)</a>.

### SIGTERM before SIGKILL, always

`kill` with no flag sends `SIGTERM` (signal 15): a request to terminate that a process can catch and handle gracefully. `kill -9` sends `SIGKILL`: an unconditional, immediate termination that the target process cannot intercept, cannot clean up after, and cannot refuse. The difference matters a lot more than it looks. A migration script killed with `SIGKILL` mid-transaction can leave a database connection half-open or, in rare cases, a partially applied schema change. The same script killed with `SIGTERM`, if it has a handler, gets a chance to roll back cleanly first. The rule of thumb worth keeping: reach for `SIGTERM` (plain `kill`) first, wait a few seconds, and only escalate to `SIGKILL` if the process ignores it or is genuinely hung.

For scripts you write yourself, especially anything long-running like a seed script or a worker, wrapping the risky part in a `trap` is the Bash-native way to guarantee cleanup runs no matter how the script is stopped:

```bash
#!/bin/bash
trap 'echo "Interrupted, rolling back."; exit 1' INT TERM
# risky work here
```

This is the same mechanism, at the shell level, that `process.on('SIGINT', ...)` gives you at the Node level. Knowing both means you are never stuck watching a stuck process with no way to stop it short of restarting your machine.

---

## The Taxonomy of Useful Scripts

Scripts cluster naturally into a small number of categories. Getting this taxonomy right at the start of a project forces you to think about what kinds of work the project actually contains, not just what commands are convenient to shorten.

In this codebase, seven categories emerged:

**Development** scripts start things. `nest start --watch` and `next dev` belong here. Their job is to get a running, reactive environment in front of a developer as quickly as possible. The key quality of a dev script is idempotency of intent: it should do the same thing every time, regardless of the state it finds the project in.

**Build** scripts compile and bundle. `nest build`, `next build`, `tsc`. These produce artefacts (`dist/` directories, `.next/` bundles) that downstream processes depend on. The important property here is determinism: the same source should produce the same output on every machine and in every CI run.

**Test** scripts verify. The project separates `test` (single run), `test:watch` (interactive), `test:cov` (coverage reporting), `test:ci` (type check followed by Jest in non-interactive mode), and `test:e2e` (full-stack integration). Each of these has a different audience and a different context. The discipline of naming them separately prevents the common failure where a developer runs the wrong test mode and draws the wrong conclusion.

**Database** scripts manage state. `db:seed` creates default roles, permissions, categories, demo users, and sample S3 assets. It uses upsert logic throughout, which makes it idempotent, a property worth demanding of every database script. A seed that fails on a second run is a seed that only works once, which means it stops being trusted.

**Migration** scripts version the schema. `migration:generate` compares entity definitions against the live schema and produces a timestamped migration file. `migration:run` applies pending files. `migration:revert` rolls back one step. These three together give the database the same kind of version control that Git gives source code. The discipline to use them instead of manual `ALTER TABLE` statements is what keeps staging and production environments reproducible.

**Infrastructure** scripts manage the system above the code: deployment, OpenAPI contract generation, and container health. These are covered in depth in Part 3 of this series.

**Utility** scripts handle developer workflow: `sub:status` shows the state of all four submodules at a glance, `pr:create` derives a conventionally-formatted PR title from the branch name and opens it via the GitHub CLI, `pr:list` prints a unified open-PR view across all five repositories.

---

## The Three Scripts Every Project Needs First

Before you have fifty scripts, you start with three. These are the minimum viable script set for any project that more than one person will work on.

### 1. A dev script that starts everything

```json
"dev": "nest start --watch"
```

Simple, direct, and stable. Every developer on the team knows that `pnpm dev` starts the server. The implementation can change (you might add environment variable loading, a database health check, or a background worker), but the name stays constant. The name is the contract.

### 2. A lint script that fixes

```json
"lint": "eslint \"src/**/*.ts\" --fix"
```

Lint scripts that only report issues and exit non-zero are only useful in CI. A lint script that auto-fixes as much as it can and then reports the remainder is useful during development. Both matter; they serve different audiences. This project names them separately: `lint` auto-fixes, `test:ci` type-checks without emitting, and the pre-commit hook runs lint on staged files only, so developers get fast feedback without scanning the entire codebase on every commit.

### 3. A build script that is the single source of truth for compilation

```json
"build": "nest build"
```

The build script should be the only way a compiled artefact is produced. If developers sometimes run `tsc` directly and sometimes run `nest build`, you have two production code paths with different configurations. Pick one, put it in `scripts`, and enforce it. Here, `start:prod` is defined as `node dist/main.js`; it does not compile anything. Compilation is the job of `build`. The separation is intentional and prevents accidental production starts against a stale `dist/`.

---

## Naming Is the Hardest Part

A script that nobody runs because nobody can remember its name does not exist in any practical sense.

Naming scripts is a design problem with real stakes. Good script names share a few properties:

They are **verb-first or noun:verb format**. `build`, `test`, `lint`, `db:seed`, `migration:run`. The action is immediately apparent. Compare this to names like `setup`, `utils`, or `tools`: these describe a vague category rather than a specific action.

They **use colons to encode scope and variant**. The colon convention (`test:watch`, `test:ci`, `test:e2e`) is widely adopted in the Node.js ecosystem for good reason. It groups related scripts visually, makes tab-completion useful, and allows a CI system to call `test:ci` while a developer calls `test:watch` without any ambiguity about which variant to use where.

They are **stable**. A script name that changes breaks every developer's muscle memory, every CI configuration file, and every onboarding document that references it. Treat a script name with the same stability expectation you would give a public API endpoint. Rename only when the underlying behaviour has fundamentally changed, and when you do, keep the old name as a deprecated alias that prints a warning.

---

## What Happens Without Them

The argument for deliberate script design is easier to make through its absence.

Without a `db:seed` script, new developers get the database into a runnable state through undocumented manual steps, tribal knowledge passed in Slack, or guesswork. The first three hours of a new developer's onboarding become a debugging session.

Without a `migration:generate` and `migration:run` pair, schema changes get applied manually on each environment at different times by different people. The staging environment drifts from production. A bug that is reproducible in staging cannot be reproduced in production, or vice versa, and the reason is a column that exists in one place and not the other.

Without a consistent `build` script, a production deploy starts working differently from a CI build. Someone runs `tsc` directly one day because it is faster, produces a `dist/` with slightly different output due to a different `tsconfig` flag, and deploys it. The system behaves correctly until it does not, and the cause is invisible in the commit history.

And without knowing the Bash mechanics underneath, an accidentally-launched script against the wrong environment turns into a five-minute panic instead of a ten-second `Ctrl+C` or `kill`. Scripts are not shortcuts. They are the layer of discipline that makes a codebase behave consistently across machines, environments, and time, and understanding the process model underneath them is what lets you trust that discipline when something goes sideways.

---

## What's Next

Part 2 of this series goes deeper into one specific category: scripts as quality gates. The pre-commit hook runs Prettier, ESLint, cspell, secretlint, a pnpm audit, and a custom OpenAPI annotation checker, all on staged files only, completing in under three seconds. The design decisions behind that system are worth examining closely, because the difference between a quality gate that developers trust and one they bypass with `--no-verify` is almost entirely a question of speed and reliability.

**Part 2: [Scripts as Quality Gates: How the Pre-Commit Hook Works](#)**

**Part 3: [Scripts as System Coordination: Managing a Monorepo with Node.js Scripts](#)**

**Part 4: [Broadening the Horizon: What Scripts Can Build Beyond the Toolchain](#)**
