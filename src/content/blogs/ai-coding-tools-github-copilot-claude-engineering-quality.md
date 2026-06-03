---
title: AI Coding Tools Don't Make You a Better Engineer. They Make Visible Whether You Already Were One.
date: 2025-07-20
tags: [AI coding tools, GitHub Copilot, Claude, software engineering, developer productivity, AI programming]
metaDescription: AI coding assistants are accelerators, not equalizers. In the hands of strong engineers they compound capability. In weak hands, they accelerate the production of confident garbage.
readTime: 9
type: hot-take
excerpt: GitHub Copilot and Claude do not make all engineers equally capable. They make the gap between good and bad engineers wider and faster to observe. Here's the pattern I've watched play out.
---

GitHub Copilot and Claude do not make all engineers equally capable. They make the gap between good and bad engineers wider and faster to observe.

## The Pattern

Here's what I've watched play out repeatedly:

A strong engineer uses AI assistance to ship in days what would have taken weeks. They review generated code critically, catch the subtle bugs, understand the tradeoffs the model made and whether they're acceptable. AI is their velocity multiplier.

The weak engineer uses the same tools to generate code they don't understand faster than they ever could have written it themselves. The code looks correct. It compiles. It passes the happy-path tests. Then it hits production and fails in ways they have no framework to diagnose, because they didn't write it and don't understand it.

**AI is a confidence amplifier.** It makes you move faster, which means it amplifies both your correct intuitions and your wrong ones.

## What Bad AI-Augmented Code Looks Like

I reviewed a PR recently where the developer had used AI to generate an authentication middleware. It looked right at a glance:

```typescript
// AI-generated auth middleware — looks correct, has a subtle flaw
export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
```

The problem: `process.env.JWT_SECRET!` uses the non-null assertion operator. If `JWT_SECRET` is undefined at runtime (misconfigured environment, secret rotation in progress, different env from development), `jwt.verify` throws a `secretOrPublicKey must have a value` error — which the `catch` block swallows and returns as "Invalid token." Every authenticated request silently fails. No log, no alert, no indication the secret is missing.

A strong engineer catches this instantly because they've seen it fail before. They know `jwt.verify` has a specific error for missing secrets. The fix is trivial:

```typescript
// Reviewed and corrected
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not configured");
  // This throws at startup, not at runtime — fast fail, visible error
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // no assertion needed
    req.user = decoded as JWTPayload;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
}
```

The developer who generated the original code didn't understand JWT secret handling, environment variable validation, or why fast-fail is preferable to silent failure. AI gave them plausible-looking code. It passed local tests. It would have failed in production.

## The New Job Description

Your job is no longer to write code. It's to be a rigorous reviewer of code — yours, your colleagues', and now your AI's. That requires better engineering judgment than ever, not less.

The skills that matter in the AI-augmented workflow:

```
Pre-AI critical skills:
├── Write syntactically correct code
├── Know library APIs
├── Implement standard patterns
└── Translate specs into code

Post-AI critical skills (unchanged or more important):
├── Identify subtle security vulnerabilities
├── Evaluate architectural trade-offs
├── Understand failure modes under load and edge cases
├── Know when generated code is plausible-but-wrong
├── Own accountability for production behaviour
└── Debug systems you didn't write
```

The first category — AI has largely automated. The second category — AI is structurally bad at because it requires accountability, production experience, and the knowledge of what failure looks like.

## The Practical Implication

The engineers who should be most concerned about AI coding tools are not the ones who fear replacement. It's the ones who are using AI to skip understanding.

If you can't explain why the generated code works, you don't actually know how to evaluate whether it's correct.

Treat AI output as a first draft from a talented-but-careless colleague. You wouldn't merge code from that colleague without reading it. Don't merge AI output without reading it either.

> Your value is not generating code. It's knowing which generated code to trust.


---

Looking for an engineer who treats AI output as a first draft, not ground truth? One who can review generated code the way a senior reviews a junior PR? [I am taking on remote engineering work](/contact) — let us talk about what that looks like on your team.