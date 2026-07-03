---
title: "Scripts as Quality Gates: How the Pre-Commit Hook Works"
date: 2026-06-22
tags: [scripts, quality gates, pre-commit, Husky, lint-staged, monorepo, CI, developer tooling]
metaDescription: How six pre-commit checks in a production monorepo enforce code quality at commit time using Husky and lint-staged, and why speed is what makes developers trust a gate instead of bypassing it.
readTime: 5
type: technical
excerpt: Six pre-commit checks, all running on staged files only, completing in under three seconds. Here's the design behind a quality gate that developers leave enabled instead of bypassing with --no-verify.
cover: '/blog-covers/scripts-part-2-quality-gates.svg'
---

# Scripts as Quality Gates: How the Pre-Commit Hook Works

**Series: The Scripts Deep-Dive, Part 2 of 4**

---

In [Part 1](#), I argued that scripts are architecture, not shortcuts: the layer of discipline that makes a codebase behave consistently across machines and time. This post narrows the focus to one category that determines whether a team ships clean code or spends its days fighting CI: scripts as quality gates.

A quality gate is a script that runs automatically and refuses to let bad work proceed. The most valuable place to put one is the moment a developer commits, before the code ever reaches a branch, a pull request, or CI. This is the principle of shifting left: the earlier a problem is caught, the cheaper it is to fix. A typo caught by a pre-commit hook costs five seconds. The same typo caught by a CI run twelve minutes later, or by a reviewer the next morning, costs orders of magnitude more in context-switching and round trips.

This monorepo runs six distinct checks at commit time, all wired through Husky git hooks and `lint-staged`. The interesting part is not that these checks exist: every mature project has linting. The interesting part is the design decisions that make developers trust the gate instead of bypassing it with `--no-verify`.

---

## The Cardinal Rule: Speed Determines Trust

A quality gate that takes thirty seconds will be disabled. Not by policy, by frustration. A developer committing ten times an hour will not tolerate five minutes of accumulated waiting, and the moment they discover `git commit --no-verify`, your gate is gone and you will not know it is gone.

This is the single most important design constraint on any pre-commit hook, and it dictates almost every other decision: the hook must be fast enough that nobody is tempted to skip it.

The tool that makes this possible is `lint-staged`. Instead of running Prettier, ESLint, and the spell checker across the entire codebase on every commit, `lint-staged` runs them only on the files that are actually staged. A commit that touches three files runs the checks against three files, not three thousand. The gate stays under a few seconds regardless of how large the project grows.

```jsonc
// The core idea: checks run on staged files only
"lint-staged": {
  "*.{js,jsx,ts,tsx}": ["prettier --write", "eslint --fix"],
  "*.{md,json}": ["prettier --write", "cspell"],
  "src/**/*.controller.ts": ["node scripts/check-api-annotations.mjs"]
}
```

The second design choice that protects speed is ordering checks from cheapest to most expensive, and from most-likely-to-fail to least. There is no point running a slow integration check if a formatting check is going to fail anyway. Fail fast, fail cheap.

---

## The Six Checks, and What Each One Defends

The pre-commit pipeline defends six different properties of the codebase. Each check exists because a specific class of problem was worth preventing at the door rather than discovering later.

### 1. Prettier: formatting consistency

```
prettier --write
```

Prettier does not check formatting and complain. It rewrites the file to be correctly formatted and stages the result. This is a deliberate distinction. A check that says "your indentation is wrong" creates work for the developer. A check that silently fixes the indentation removes the entire category of problem from human attention. Formatting debates die here, permanently, because there is nothing left to debate.

### 2. ESLint: correctness and code-smell

```
eslint --fix
```

ESLint catches the class of bugs that are syntactically valid but semantically suspect: unused variables, unreachable code, missing `await`, accidental reassignment. The `--fix` flag auto-resolves what it safely can and surfaces the rest. Like Prettier, it stages its own fixes, so the developer's commit ends up clean without a second round trip.

### 3. cspell: spelling in code and docs

```
cspell "**/*.{js,jsx,ts,tsx,md,json}" --no-progress
```

A spell checker in a pre-commit hook surprises people. It earns its place. Typos in variable names, comments, API documentation, and commit-facing strings are the kind of small error that no reviewer reliably catches and every reader eventually notices. A misspelled property name in a public API is a permanent embarrassment that becomes impossible to rename once consumers depend on it. cspell catches it before it is ever written to a branch.

### 4. secretlint: no committed credentials

```
secretlint "**/*"
```

This is the check that justifies the entire hook system on its own. `secretlint` scans staged files for accidentally committed secrets: API keys, access tokens, database passwords, private keys. A secret committed to git history is not fixed by deleting it in a later commit; it lives in the history forever and must be rotated. Catching it at the pre-commit boundary, before it enters history at all, is the difference between a non-event and a security incident. This check blocks the commit. It does not warn; it stops.

### 5. pnpm audit: dependency vulnerabilities

```
pnpm audit --audit-level=moderate
```

This scans the dependency tree for known CVEs at moderate severity or higher. It is configured to warn rather than block at commit time, because a new CVE disclosure is not the committing developer's fault and should not stop unrelated work. The signal still surfaces at the moment of commit, which is when someone is paying attention, rather than being buried in a weekly report nobody reads.

### 6. The custom OpenAPI annotation checker: contract integrity

```
node scripts/check-api-annotations.mjs
```

This is the most interesting check in the system because it is bespoke. It parses every `*.controller.ts` file using the TypeScript compiler API and verifies that every route handler carries the decorators the project's contract pipeline depends on: `@ApiTags`, an `@ApiOperation` with a non-empty summary, a typed response decorator, no untyped `type: Object` responses, and `@ApiBearerAuth` on guarded routes.

The reason this check exists connects directly to the architecture covered in Part 3. The web app's TypeScript types are generated from the API's OpenAPI specification, which is generated from these decorators. A controller method missing its `@ApiOperation` is a hole in the generated types: a silent gap that surfaces later as an untyped API call in the frontend. Catching the missing decorator at commit time keeps the entire type chain honest. This is a quality gate defending a contract, not just a style.

---

## Two More Gates Beyond the Pre-Commit Hook

The commit-time checks are the most visible, but the project runs two further git hooks that defend different properties.

### commit-msg: enforcing conventional commits

```
Validates against: feat|fix|chore|hotfix|refactor|docs|test|ci|perf
Length: 10–100 characters
```

This hook validates the commit message itself. It enforces the conventional-commit prefix and a sane length, and prints examples on failure rather than just rejecting. This is not pedantry. Conventional commit messages are machine-readable, which means they can drive automated changelog generation, semantic versioning, and, as Part 3 will show, automatic PR title derivation. The discipline at commit time pays off as automation downstream.

### pre-push: branch freshness

```
For feature branches only (skips develop and main):
fetches origin/develop and blocks the push if the branch is behind.
```

This hook runs at push time rather than commit time, because that is the right moment for it. It fetches `origin/develop` and refuses the push if the feature branch has fallen behind, printing the exact commit count and rebase instructions. This prevents the most common merge-conflict scenario in a busy monorepo: a developer pushing work built on a stale base, then discovering at PR time that they need to rebase against a hundred commits of drift. Catching it at push keeps branches mergeable.

---

## The Principle Underneath All of It

Every check in this system follows the same rule: **automate the discipline that humans cannot reliably sustain.**

Reviewers do not reliably catch typos, missing decorators, formatting drift, or a key pasted into a config file at 2am. Not because they are careless, but because these are exactly the errors that human attention is bad at and machine attention is good at. Pushing them onto a script frees reviewers to spend their attention on the things only a human can evaluate: whether the design is right, whether the abstraction holds, whether the code solves the actual problem.

A good quality gate does not slow a team down. It speeds the team up, by moving an entire category of friction off the critical path and onto a script that runs in under three seconds and never gets tired.

The trade-off to respect is that every check you add costs time, and time is the budget that determines whether the gate survives. The gate stays fast by running on staged files only, auto-fixing instead of complaining where it can, and reserving the hard block for the one check that truly cannot be allowed through: committed secrets. Everything else either fixes itself or warns. That balance is why developers leave the hook enabled.

---

## What's Next

Part 3 takes the lens all the way up to the system level. A monorepo with four submodules, a shared contracts package, and a generated type chain has coordination problems that no individual repository has. The scripts solve them: a single command that keeps four submodule remotes and a shared lockfile in sync, a contract-generation chain that propagates a single API change through to fully-typed frontend code, and a cross-repo PR tooling layer that standardises workflow across five repositories.

**Part 1: [Scripts Are Not Shortcuts. They Are Architecture.](#)**

**Part 3: [Scripts as System Coordination: Managing a Monorepo with Node.js Scripts](#)**

**Part 4: [Broadening the Horizon: What Scripts Can Build Beyond the Toolchain](#)**
