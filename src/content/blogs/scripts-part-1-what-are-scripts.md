---
title: "Scripts Are Not Shortcuts. They Are Architecture."
date: 2026-06-20
tags: [scripts, monorepo, developer tooling, Node.js, automation, architecture, package.json]
metaDescription: Why npm scripts are a form of architecture, not just aliases: a deep dive into how a real monorepo uses scripts to encode decisions about how a project is run, validated, and shipped.
readTime: 5
type: technical
excerpt: npm scripts are not aliases. They are the interface between a developer's intent and a system's behaviour. Here's how a real production monorepo uses over fifty scripts to encode decisions about how it runs, validates itself, and ships.
cover: '/blog-covers/scripts-part-1-what-are-scripts.svg'
---

# Scripts Are Not Shortcuts. They Are Architecture.

**Series: The Scripts Deep-Dive, Part 1 of 4**

---

Every serious project eventually accumulates a `package.json` full of entries in the `"scripts"` block. Most developers treat them as convenient aliases: a shorter way to type a long command. That framing undersells what scripts actually are.

Scripts are a form of architecture. They encode decisions about how a project is run, validated, and shipped. When they are designed deliberately, they become the interface between a developer's intent and the system's behaviour. When they are ignored or left ad hoc, they become the source of "it works on my machine" conversations, inconsistent CI failures, and onboarding friction that nobody can explain.

This post is the first in a four-part series built from a real production monorepo: a moderately complex system built on NestJS, Next.js, Supabase, BullMQ, and WebSockets, with four submodules, a shared contracts package, and several moving parts in production. The scripts reference in that codebase runs to over fifty entries. That number is intentional and worth examining.

---

## What a Script Actually Is

At the most literal level, a script in a Node.js project is a named shell command stored in `package.json`. When you run `pnpm dev`, the package manager looks up the `dev` key in `scripts` and executes the value as a shell command in the project's directory.

That is the mechanism. The purpose is different.

A script is a repeatable unit of work with a stable name. The name is what matters. When a developer on your team runs `pnpm migration:run`, they are not thinking about TypeORM CLI flags or the path to `data-source.ts`. They are thinking about applying pending migrations. The script handles the how so the developer can focus on the what.

This distinction between *what* and *how* is the same principle that separates a good API from a bad one. A good API hides the implementation detail and exposes a stable contract. Scripts do the same for your local and CI workflows.

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

Scripts are not shortcuts. They are the layer of discipline that makes a codebase behave consistently across machines, environments, and time.

---

## What's Next

Part 2 of this series goes deeper into one specific category: scripts as quality gates. The pre-commit hook runs Prettier, ESLint, cspell, secretlint, a pnpm audit, and a custom OpenAPI annotation checker, all on staged files only, completing in under three seconds. The design decisions behind that system are worth examining closely, because the difference between a quality gate that developers trust and one they bypass with `--no-verify` is almost entirely a question of speed and reliability.

**Part 2: [Scripts as Quality Gates: How the Pre-Commit Hook Works](#)**

**Part 3: [Scripts as System Coordination: Managing a Monorepo with Node.js Scripts](#)**

**Part 4: [Broadening the Horizon: What Scripts Can Build Beyond the Toolchain](#)**
