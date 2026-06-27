---
title: "Scripts as System Coordination: Managing a Monorepo with Node.js Scripts"
date: 2026-06-24
tags: [scripts, monorepo, system coordination, Node.js, type generation, deploy, automation]
metaDescription: How three Node.js scripts in a production monorepo replace fragile multi-step manual processes — keeping the type chain in sync, orchestrating deploys, and seeding databases — with single commands.
readTime: 5
type: technical
excerpt: A monorepo with four submodules, a shared contracts package, and a generated type chain has coordination problems no single repo has. Here are three scripts that solve them with one command each.
cover: '/blog-covers/scripts-part-3-system-coordination.svg'
---

# Scripts as System Coordination: Managing a Monorepo with Node.js Scripts

**Series: The Scripts Deep-Dive — Part 3 of 4**

---

[Part 1](#) established that scripts are architecture. [Part 2](#) showed how scripts act as quality gates at the boundary of a single commit. This post zooms all the way out, to the level where scripts stop managing files and start managing systems.

A single repository has problems an individual file does not: it needs a build, a test suite, a deploy. But a monorepo of four submodules, a shared contracts package, and a generated type chain has an entire class of problem that no individual repository has. State has to stay coordinated across boundaries. A change in one place has to propagate correctly to every place that depends on it. And the tooling to do that has to be simple enough that a developer reaches for it instead of doing the coordination by hand and getting it wrong.

This monorepo solves three of these system-level problems with scripts. Each one replaces a multi-step manual process — the kind that works until the day someone forgets a step — with a single command.

---

## Problem One: The Type Chain Must Never Drift

In this project, the frontend never hand-writes API types. It cannot, because hand-written types drift from the API the moment a backend developer changes a DTO and the frontend developer does not hear about it. Instead, the types are generated, and the generation runs through a chain.

The chain looks like this:

```
contracts:generate
  └─► openapi:export  (in the api package)
        └─► nest build              compiles src/ → dist/
        └─► node dist/openapi-export.js
                                    boots NestJS headless,
                                    reads every @ApiTags / @ApiOperation
                                    decorator, writes openapi.json
  └─► generate  (in the contracts package)
        └─► openapi-typescript openapi.json → src/schema.ts
        └─► tsc → dist/             compiles the generated types
```

A single command at the root — `pnpm contracts:generate` — runs the whole thing. It rebuilds the API, boots it in a headless mode with no HTTP server, walks every controller's Swagger decorators to produce a fresh `openapi.json`, then feeds that spec into `openapi-typescript` to regenerate `src/schema.ts` in the contracts package. That generated schema is the single source of truth for every API type the web app consumes.

The significance is in what this eliminates. Without the chain, a backend developer who adds a field to a response DTO has created a silent obligation: someone, somewhere, must remember to update the corresponding frontend type by hand. That obligation is invisible, easy to forget, and discovered only when a runtime error appears in production. With the chain, the same change is a mechanical regeneration. The types cannot drift because no human is responsible for keeping them in sync — a script is.

This is also where the custom annotation checker from Part 2 earns its place. The chain is only as honest as the decorators it reads. A controller method missing its `@ApiOperation` is a gap in the generated types. The pre-commit check that enforces those decorators is not a style rule — it is the thing that guarantees this chain produces complete output. The quality gate and the coordination script are two halves of the same design.

---

## Problem Two: Four Submodules and One Lockfile

A monorepo built from git submodules has a coordination cost that is easy to underestimate. Each submodule is its own repository with its own remote and its own main branch. The root repository tracks a specific commit of each one. And the whole thing shares a single `pnpm-lock.yaml`.

Keeping that consistent by hand means, every time a submodule releases an update: pulling the root, pulling each of the four submodules to their latest main, reinstalling to regenerate the lockfile, and committing the pointer and lockfile changes together. Miss a step and the consequences are concrete. The most common failure mode was `ERR_PNPM_OUTDATED_LOCKFILE` — a Docker build failing because the lockfile committed to the root did not match the submodule states it pointed at. The build worked locally, where the lockfile happened to be fresh, and failed in CI, where it was rebuilt from scratch.

The `sub:sync` family of scripts removes the possibility of missing a step:

```
sub:sync
  └─► git pull origin develop
  └─► git -C <submodule> pull origin main   ×4
  └─► pnpm install                          regenerates pnpm-lock.yaml
  └─► git commit                            pointers + lockfile together

sub:sync:push   →  sub:sync, then git push origin develop
sub:sync:pr     →  sub:sync:push, then gh pr create  (develop → main)
```

The escalation across the three variants maps cleanly onto intent. `sub:sync` is the local routine — bring `develop` in step with the submodule releases and stop there. `sub:sync:push` is the same operation when the result is ready to share. `sub:sync:pr` carries it the final step, opening a pull request from `develop` to `main` via the GitHub CLI when a sync is ready to be promoted toward production. One mental model, three levels of commitment, no manual git choreography at any of them.

A companion script, `sub:status`, prints a one-line summary per submodule — branch, short SHA, and whether the working tree is clean. It is the morning check: a single command that answers "what has moved since yesterday" before any sync is attempted. Coordination scripts are most useful when paired with a cheap way to see the state they are about to change.

---

## Problem Three: Workflow Consistency Across Five Repositories

The third coordination problem is human rather than mechanical. Five repositories — root, api, web, mobile, and contracts — mean five places a pull request can originate, and without intervention, five subtly different conventions for how those PRs are titled, structured, and tracked.

Two scripts standardise the entire workflow.

`pr:create` reads the current branch name and derives a correctly formatted PR from it. A branch named `feat/PROJ-1234-add-roles` becomes a PR titled `feat(PROJ-1234): add roles`, with a structured body template that includes an issue-link slot, a type-of-change section, a test plan, and a submodule-impact checklist — opened via `gh pr create`. The same script is defined in the root, api, and web repos, so a developer working inside any submodule opens an identically-shaped PR with the same single command. The conventional-commit discipline enforced by the `commit-msg` hook in Part 2 is what makes this derivation possible: because branch names and commits follow a known pattern, a script can parse them reliably.

`pr:list` runs `gh pr list` across all five repositories and prints a unified open-PR summary. For the person leading the project, this is the standup view — the entire cross-repo PR backlog in one command, instead of five browser tabs and a mental merge.

Together these two scripts encode a workflow as code. The convention is not a wiki page that new contributors are asked to read and remember. It is a script they run, which produces the correct result whether or not they have internalised the convention. That is the most reliable form of documentation: the kind that executes.

---

## One More Coordination Layer: Deployment and the Mail Queue

Two further pieces of the system are worth naming, because they show coordination scripts operating at the edges of the application.

The server-side `deploy.sh` is a coordination script in the deployment dimension. It fetches and hard-resets to `origin/main`, rebuilds and restarts the API container via Docker Compose, waits up to sixty seconds for the container to report healthy, and prunes unused images. Every step is one that a human deploying by hand would have to remember in order — and the health-check wait in particular is the step most likely to be skipped under pressure, which is exactly when it matters most. Encoding the sequence as a script makes the careful version the default version.

The `mail-queue` is coordination in the runtime dimension rather than the tooling dimension, but it follows the same principle. A single BullMQ queue, wired directly in the mail service, decouples the act of requesting an email from the act of sending one. A call to enqueue a templated message returns immediately; a worker picks the job up, renders the MJML template with Handlebars variable substitution, and sends it through Nodemailer, logging and retrying on failure. The application code that needs to send a password-reset email does not wait on SMTP or handle its failure modes. The queue coordinates that work asynchronously, which is the runtime equivalent of what every script in this series does at the tooling layer: take a multi-step, failure-prone process and give it a single, reliable entry point.

---

## The Through-Line So Far

Across three posts, the same idea has appeared at three scales.

At the file level, a script gives a repeatable unit of work a stable name, separating *what* from *how*. At the commit level, a script defends a property of the codebase automatically, moving an entire category of friction off the critical path. At the system level, a script collapses a multi-step coordination process into one command, removing the possibility of a forgotten step.

The unifying principle is the same one each time: **encode the discipline so a human does not have to remember it.** A stable name so nobody memorises a long command. An automatic check so nobody relies on a reviewer catching a typo. A sync command so nobody hand-coordinates four submodules and a lockfile. A generation chain so nobody keeps two sets of types in their head.

Scripts are how a codebase remembers how to operate itself. The fifty-plus entries in this monorepo are not fifty conveniences. They are fifty decisions about how the system runs, written down in the one place that executes them. That is what makes them architecture, and that is why they were worth designing rather than accumulating.

Part 4 leaves the toolchain entirely, and shows a script doing something most developers would reach for a design tool or an AI service to do — generating a unique, branded cover image for every post on this site, deterministically, from the post's own text.

---

**Part 1: [Scripts Are Not Shortcuts. They Are Architecture.](#)**

**Part 2: [Scripts as Quality Gates — How the Pre-Commit Hook Works](#)**

**Part 4: [Broadening the Horizon — What Scripts Can Build Beyond the Toolchain](#)**
