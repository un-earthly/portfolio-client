---
title: I Built a Figma Comment Tracker With No Backend Comment Storage. Here's Why.
date: 2025-11-28
tags: [Figma API, Cloudflare Functions, Supabase, OAuth, architecture, vanilla JS, developer tools]
metaDescription: How I built Figcoms — a browser-based Figma comment dashboard with live API fetching, zero backend comment storage, and a single Cloudflare Function handling OAuth securely.
readTime: 14
type: technical
excerpt: The standard approach to a tool like Figcoms would be to fetch comments, store them in a database, and serve from your own API. I made a different call — no backend comment storage at all. Here's the architecture, the tradeoffs, and the interesting implementation details.
---

Design teams lose hours chasing Figma comments across dozens of files. Comments get missed. Feedback loops break. Handoffs fail.

I built Figcoms to fix that.

Figcoms is a browser-based dashboard that pulls all comments from any Figma file and makes them filterable, actionable, and trackable. The interesting constraint I imposed from the start: **no backend comment storage**. Comments are fetched live directly from the Figma REST API on demand. Supabase handles auth only. Everything else runs entirely in the browser.

This post is about the architecture decision, the implementation details, and what this class of tool design looks like in practice.

## The Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Figcoms Architecture                   │
│                                                         │
│  Browser (static HTML/CSS/JS)                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Comment Dashboard                               │   │
│  │  ┌────────────┐  ┌──────────────────────────┐   │   │
│  │  │ Filter     │  │  Comment List             │   │   │
│  │  │ Sidebar    │  │  (rendered in-memory)     │   │   │
│  │  │ - Status   │  │                           │   │   │
│  │  │ - Pages    │  │  Deep links → Figma nodes │   │   │
│  │  │ - Authors  │  │  Reply from dashboard     │   │   │
│  │  │ - Labels   │  └──────────────────────────┘   │   │
│  │  └────────────┘                                  │   │
│  └──────────────┬──────────────────────────────────┘   │
│                 │  fetch() with Bearer token             │
│                 ▼                                        │
│         Figma REST API                                   │
│         /v1/files/:key/comments                         │
│         /v1/files/:key?depth=4  (for page resolution)  │
│                                                         │
│  Auth path only:                                        │
│  Browser → Cloudflare Function → Figma OAuth           │
│                │                                        │
│                ▼                                        │
│         Supabase (auth + user_settings row only)        │
│         No comment data ever stored                     │
└─────────────────────────────────────────────────────────┘
```

## The Core Architectural Decision

The standard approach to a tool like this: fetch comments from Figma, store them in a database, serve from your own API. That creates sync complexity, stale data problems, and infrastructure cost.

I made a different call early: **no backend comment storage at all**.

Every comment fetch is a direct browser → Figma API call. Supabase exists only for a `user_settings` table with one row per user: their encrypted Figma token, saved file keys, and UI preferences. The comment content never touches my servers.

The reasoning was constraint-driven:

```
Option A: Store comments in DB
──────────────────────────────────────────────────────────
+ Comment history, cross-file analytics, push notifications
- Sync pipeline to maintain
- Stale data when comments update in Figma between syncs
- Storage cost scales with usage
- Comment content on my servers (privacy concern for teams)
- Webhook infrastructure for near-real-time

Option B: Live fetch, no storage
──────────────────────────────────────────────────────────
+ Always current — what you see is what Figma has
+ Zero sync logic
+ Minimal infrastructure (1 Cloudflare Function, 1 Supabase project)
+ Comment content never leaves Figma's servers
- No comment history
- No cross-file analytics
- No notifications (no server-side listener)

For the use case — triage during active design sprint, handoff review —
Option B is the right call. The missing features are nice-to-have, not
core to the workflow problem being solved.
```

This is an example of constraint-driven design working correctly: the constraint (no backend comment storage) forced simpler architecture that happens to be better for the primary use case.

## Figma OAuth Without Leaking Secrets

The Figma OAuth flow requires a client secret for the code-for-token exchange. Client secrets cannot be in browser JavaScript — they'd be visible in source.

The entire backend for Figcoms is a single Cloudflare Function:

```javascript
// figma-token.js — the only server-side code in the project
export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const { code, redirect_uri } = await request.json();

    if (!code || !redirect_uri) {
      return new Response("Missing required fields", { status: 400 });
    }

    // Exchange code for token — client secret stays server-side
    const tokenResponse = await fetch("https://api.figma.com/v1/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: env.FIGMA_CLIENT_ID,
        client_secret: env.FIGMA_CLIENT_SECRET, // never exposed to browser
        redirect_uri,
        code,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      return new Response(JSON.stringify({ error }), {
        status: tokenResponse.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const tokenData = await tokenResponse.json();

    // Return token to browser — user stores it in their Supabase row
    return new Response(JSON.stringify({ access_token: tokenData.access_token }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN,
      },
    });
  },
};
```

Everything else — comment fetching, filtering, rendering — is direct browser-to-Figma API calls using the access token. No proxy needed for reads. The secret only matters during the initial OAuth exchange.

## Page Name Resolution

This was the most interesting implementation problem.

Figma's comment API returns a `node_id` per comment — it does not tell you which page that node lives on. To build a Pages filter that's actually useful, I needed to map every `node_id` to its parent page name.

The approach: fetch the file structure at `depth=4`, traverse the document tree, build the map:

```javascript
async function buildNodeToPageMap(fileKey, accessToken) {
  // Fetch file structure — depth 4 gets us deep enough for most real files
  const response = await fetch(
    `https://api.figma.com/v1/files/${fileKey}?depth=4`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const { document } = await response.json();

  const nodeToPage = new Map();

  // document.children = top-level pages
  for (const page of document.children) {
    if (page.type !== "CANVAS") continue;

    // Recursively tag every descendant node with this page name
    tagNodes(page, page.name, nodeToPage);
  }

  return nodeToPage;
}

function tagNodes(node, pageName, map) {
  map.set(node.id, pageName);
  if (node.children) {
    for (const child of node.children) {
      tagNodes(child, pageName, map);
    }
  }
}

// Usage: resolving a comment's page
function resolveCommentPage(comment, nodeToPage) {
  if (!comment.client_meta?.node_id) return "Global"; // file-level comments
  return nodeToPage.get(comment.client_meta.node_id) ?? "Unknown Page";
}
```

This runs once per file load — the traversal is `O(n)` in the number of nodes, which for typical design files (hundreds to low thousands of nodes) is imperceptible. The map lives in memory for the session.

The `depth=4` parameter keeps the response payload manageable. Real Figma files can have deeply nested components, but page attribution only needs the top few levels of the document tree.

## Auto-Label Detection

Comment labels (Bug, Approved, Urgent, Question, Done, Mention) are detected automatically from comment text — no tagging required from the user.

```javascript
const LABEL_PATTERNS = {
  Bug:      /\b(bug|broken|fix|error|crash|issue|wrong)\b/i,
  Approved: /\b(approved?|lgtm|looks good|ship it|good to go)\b/i,
  Urgent:   /\b(urgent|asap|blocker|critical|immediately|priority)\b/i,
  Question: /\?|^(what|why|how|when|where|who|can you|should we)/im,
  Done:     /\b(done|fixed|resolved|addressed|completed)\b/i,
  Mention:  /@\w+/,
};

function detectLabels(commentText) {
  return Object.entries(LABEL_PATTERNS)
    .filter(([, pattern]) => pattern.test(commentText))
    .map(([label]) => label);
}
```

Simple pattern matching, zero user overhead. The false positive rate on real design comments is low enough that this approach works well in practice. If a comment matches multiple patterns, it gets multiple labels — a "Looks good but there's a bug here?" gets both Approved and Bug, which is correct behaviour.

## Filter Logic

Filters combine as: **OR within a dimension, AND across dimensions**.

```javascript
function applyFilters(comments, filters) {
  return comments.filter(comment => {
    // Status: single-select, must match if set
    if (filters.status === "open" && comment.resolved_at) return false;
    if (filters.status === "resolved" && !comment.resolved_at) return false;
    if (filters.status === "recent") {
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      if (new Date(comment.created_at).getTime() < sevenDaysAgo) return false;
    }

    // Pages: multi-select, OR — comment must be on at least one selected page
    if (filters.pages.size > 0) {
      const commentPage = resolveCommentPage(comment, nodeToPage);
      if (!filters.pages.has(commentPage)) return false;
    }

    // Authors: multi-select, OR — comment must be by at least one selected author
    if (filters.authors.size > 0) {
      if (!filters.authors.has(comment.user.handle)) return false;
    }

    // Labels: multi-select, OR — comment must have at least one selected label
    if (filters.labels.size > 0) {
      const commentLabels = new Set(detectLabels(comment.message));
      const intersection = [...filters.labels].some(l => commentLabels.has(l));
      if (!intersection) return false;
    }

    return true;
  });
}
```

The AND-across-OR-within semantics are the intuitive behaviour for this use case. "Show me Bug OR Urgent comments on the Login OR Onboarding pages" is the natural query. A pure AND across everything would make the filter unusable for any multi-select combination.

## Why No Framework, No Build System

Deliberate. Figcoms is plain HTML, CSS, and Vanilla JS. No webpack, no Vite, no npm install. The Supabase client loads from CDN.

The reasoning: this is a tool project, not a product codebase. The development surface is small enough that a framework adds overhead without adding capability. Local dev is `python3 -m http.server`. Deployment is pushing static files.

The absence of a build pipeline is itself a feature — it means contributors can open a file, make a change, and see it work without understanding a build system. For a solo side project, that matters.

This is not a universal argument against frameworks. It's a context-specific argument that the overhead of a framework is not justified when:

- The codebase is < 2,000 lines
- There's no component reuse that benefits from a component model
- The rendering is imperative and straightforward
- The deployment target is a CDN

When the answer to "do I need React?" is "no, I need to render a list and respond to filter clicks" — you don't need React.

## What This Project Demonstrates

From an engineering standpoint, Figcoms is an exercise in constraint-driven design:

- **Third-party API integration at a production level** — OAuth flows, token handling, pagination, rate limiting awareness, data transformation
- **Architectural tradeoffs with explicit reasoning** — the no-backend-storage decision was deliberate, documented, and defensible
- **Shipping without over-engineering** — the right tool for each layer, no framework sprawl
- **Design for the actual use case** — the missing features (history, notifications) were deliberately out of scope, not overlooked

The constraint-first approach is transferable. In larger systems, the instinct to add infrastructure "for when we need it" creates maintenance burden before the need is real. Starting from constraints produces leaner systems.

**Live at:** [figcoms.alamin-md.xyz](#) | **Source:** [github.com/un-earthly/figcoms](#)


figcoms-figma-comment-tracker-architecture.md