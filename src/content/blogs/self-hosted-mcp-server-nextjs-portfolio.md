---
title: "I Gave an AI Direct Write Access to My Codebase. Here's the Architecture."
date: 2026-06-27
tags: [MCP, Model Context Protocol, Next.js, AI tooling, GitHub API, self-hosted, developer tooling, agentic AI]
metaDescription: How I built a self-hosted MCP server inside a Next.js portfolio app that gives Claude direct read/write access to the GitHub repo: architecture, debugging, and the stateless transport bug that took an hour to find.
readTime: 14
type: technical
excerpt: Most developers use AI as a text generator. I wired Claude directly into my portfolio repo, and it can now read, write, and commit any file without me touching a keyboard. This is how the MCP server works, what broke during the build, and why server.close() was the culprit.
cover: '/blog-covers/self-hosted-mcp-server-nextjs-portfolio.svg'
tldr: "Built a stateless MCP server as a Next.js API route. It proxies Claude tool calls to the GitHub Contents API, giving an AI agent direct commit access to the repo. The bug that broke it: calling server.close() before the async transport Promise resolved."
faqs: Is this safe? Claude has write access to your entire repo?::The GITHUB_TOKEN lives in Vercel's environment variables, never in the codebase or chat. The MCP endpoint has no auth of its own: the security model is that only Claude.ai (with the connector configured) can reach it, and Claude operates under its own safety constraints. For a personal portfolio this is an acceptable risk. For a production app with customer data you'd add an API key or OAuth layer on the MCP endpoint itself. | Why not just use the official GitHub MCP?::The official GitHub MCP exists but isn't in Claude's integration marketplace yet. Self-hosting inside the existing Next.js app meant zero additional infrastructure: the MCP server deploys with the portfolio on every git push to main. | Why is the transport stateless? Doesn't that lose context between tool calls?::MCP context lives in the Claude conversation, not in the server. Each tool call is a fresh HTTP request with all the information it needs in the request body. Stateless is correct here, since it's the serverless-friendly design and it's what lets Vercel handle it without sticky sessions. | Can I use this pattern for my own portfolio or project?::Yes. The full pattern is: Next.js API route + WebStandardStreamableHTTPServerTransport + GitHub Contents API + GITHUB_TOKEN in env vars. The key constraint is don't call server.close() before transport.handleRequest() resolves: that's the bug that killed the tool list.
---

This post is a live case study. Every commit described here was made during an active conversation with Claude, the same session that produced the architecture, debugged the failures, and ultimately shipped the working server. The AI wrote the code, diagnosed the bug, and pushed the fix. I watched the Vercel logs.

That's the premise. Here's how it works.

> **TL;DR**: Built a stateless MCP server as a Next.js API route (`WebStandardStreamableHTTPServerTransport`) that proxies Claude's tool calls to the GitHub Contents API, giving it direct read/write/commit access to the repo. The bug that broke it for an hour: calling `server.close()` before the async `transport.handleRequest()` Promise resolved, which tore down the stream mapping mid-flight and silently dropped the tool list.

---

## The Problem With AI-Assisted Development Today

Most AI coding workflows look like this: you describe a task, the AI generates code in a chat window, you copy it, paste it into your editor, run it, find an error, paste the error back, get a fix, repeat. It's useful but it's inherently disconnected. The AI has no persistent access to your actual files: it's working from whatever you paste into the window.

The Model Context Protocol (MCP) changes that. It's an open standard for giving AI systems structured, tool-mediated access to external data and capabilities. Instead of pasting code back and forth, you connect Claude to a server that exposes tools, and Claude calls those tools directly as part of its reasoning.

I had an existing MCP server for my portfolio's blog system. Claude could already read, create, and update blog posts by calling tools that proxied to the GitHub Contents API. What it couldn't do was touch anything else in the repo: layout files, config, components, anything outside the blog directory.

The goal: extend the server so Claude has full repo read/write access. No GitHub MCP in the marketplace, so self-hosted it is.

## The Architecture

The server lives at `src/app/api/mcp/route.ts`, a standard Next.js App Router API route that deploys to Vercel alongside the portfolio.

```
Claude (claude.ai)
    │
    │  HTTP POST/GET/DELETE
    ▼
https://www.alamin-md.xyz/api/mcp
    │
    │  WebStandardStreamableHTTPServerTransport
    │  (stateless, one transport instance per request)
    ▼
MCP Server (in-process, Next.js serverless function)
    │
    │  fetch() → GitHub Contents API
    ▼
un-earthly/portfolio-client (GitHub repo, main branch)
```

Each HTTP request spins up a fresh MCP server instance, handles the tool call, and returns. No persistent state, no sessions. This is the correct design for a serverless environment.

The transport layer is `WebStandardStreamableHTTPServerTransport` from `@modelcontextprotocol/sdk`, which handles the MCP wire protocol over standard web `Request`/`Response` objects, exactly what Next.js API routes deal in.

## The Three New Tools

The blog tools already existed. What I added were three generic repo tools:

```typescript
// Read any file in the repo by path
{
  name: "repo_read_file",
  inputSchema: {
    type: "object",
    properties: {
      path: { type: "string", description: "e.g. src/app/layout.tsx" }
    },
    required: ["path"]
  }
}

// Write (create or update) any file, commits directly to main
{
  name: "repo_write_file",
  inputSchema: {
    type: "object",
    properties: {
      path: { type: "string" },
      content: { type: "string", description: "Full file content" },
      message: { type: "string", description: "Git commit message" }
    },
    required: ["path", "content", "message"]
  }
}

// List a directory
{
  name: "repo_list_dir",
  inputSchema: {
    type: "object",
    properties: {
      path: { type: "string", description: "e.g. src/app or src/components" }
    },
    required: ["path"]
  }
}
```

The implementation of each is a thin wrapper around the GitHub Contents API:

```typescript
async function repoGetFile(path: string): Promise<{ content: string; sha: string } | null> {
  try {
    const file = (await ghRequest(
      "GET",
      `/repos/${OWNER}/${REPO}/contents/${path}`
    )) as GHFile;
    const content = Buffer.from(file.content ?? "", "base64").toString("utf-8");
    return { content, sha: file.sha };
  } catch {
    return null; // file doesn't exist
  }
}

async function repoPutFile(
  path: string,
  content: string,
  message: string,
  sha?: string       // required for updates, omitted for creates
): Promise<void> {
  const encoded = Buffer.from(content, "utf-8").toString("base64");
  await ghRequest("PUT", `/repos/${OWNER}/${REPO}/contents/${path}`, {
    message,
    content: encoded,
    ...(sha ? { sha } : {}),
  });
}
```

The SHA handling is the critical detail. GitHub's Contents API requires the current file SHA when updating an existing file: it's the optimistic concurrency mechanism that prevents blind overwrites. `repo_write_file` always fetches the current SHA first:

```typescript
case "repo_write_file": {
  const filePath = args.path as string;
  const existing = await repoGetFile(filePath);   // get SHA if file exists
  await repoPutFile(filePath, content, message, existing?.sha);
  // existing?.sha is undefined for new files, correct for create
  // existing?.sha is the current SHA for existing files, correct for update
}
```

## The Bug That Took an Hour

The server deployed. Claude connected. Tools didn't load.

The Vercel function log showed: `HTTP 202, 12ms execution, no outgoing requests`. The 202 is valid MCP: it's what the transport returns when Claude sends the `initialized` notification after the handshake. That part was working.

But Claude couldn't see the tools. Reconnecting didn't help. The tool manifest wasn't making it back.

First hypothesis: protocol version mismatch. Checked the SDK source: `SUPPORTED_PROTOCOL_VERSIONS` covers every version Claude could be sending. Not that.

Second hypothesis: `validateSession` failing on non-initialization requests. Read the transport source:

```typescript
validateSession(req) {
  if (this.sessionIdGenerator === undefined) {
    // Session management is disabled, skip validation entirely
    return undefined;
  }
  // ...session validation logic
}
```

`sessionIdGenerator: undefined` means stateless mode, which skips all session validation. Not that either.

Third hypothesis, and the correct one, was found by reading the `handleRequest` internals:

```typescript
// Inside WebStandardStreamableHTTPServerTransport
if (this._enableJsonResponse) {
  // Returns a Promise that resolves when all responses are ready
  return new Promise(resolve => {
    this._streamMapping.set(streamId, {
      resolveJson: resolve,
      cleanup: () => { this._streamMapping.delete(streamId); }
    });
    // message processing happens asynchronously
  });
}
```

The original `handleMcp` function was doing this:

```typescript
const response = await transport.handleRequest(req);
await server.close();   // ← THE BUG
return response;
```

`server.close()` cleans up the internal stream mapping. But `handleRequest` with `enableJsonResponse: true` returns a Promise that resolves when the response is assembled, which requires the stream mapping to still be intact. Calling `close()` before that Promise resolved was tearing down the internal state mid-flight. The tool list was being assembled and then silently dropped.

The fix is one line removed:

```typescript
// Before
const response = await transport.handleRequest(req);
await server.close();
return response;

// After
return transport.handleRequest(req);
```

In stateless mode, each request gets a fresh server instance scoped to the function call. There's nothing to clean up manually: GC handles it when the function returns. `server.close()` was doing active harm by racing against the async Promise resolution.

## The Full Route Handler

```typescript
async function handleMcp(req: Request): Promise<Response> {
  if (!GITHUB_TOKEN) {
    return new Response(JSON.stringify({ error: "GITHUB_TOKEN not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,  // stateless, correct for serverless
    enableJsonResponse: true,       // return JSON instead of SSE stream
  });

  const server = createMcpServer();
  await server.connect(transport);

  // Do NOT call server.close() here. In stateless mode with enableJsonResponse,
  // handleRequest() returns a Promise that resolves asynchronously. close()
  // tears down the stream mapping before the Promise resolves, silently
  // dropping the response. GC handles cleanup.
  return transport.handleRequest(req);
}

export async function POST(req: Request): Promise<Response> { return handleMcp(req); }
export async function GET(req: Request): Promise<Response> { return handleMcp(req); }
export async function DELETE(req: Request): Promise<Response> { return handleMcp(req); }
```

All three HTTP methods route through the same handler. MCP uses all three: POST for tool calls and initialization, GET for SSE streams (if not using JSON mode), DELETE for session termination.

## What This Enabled in Practice

After the server came up, the first thing I did in the same conversation was ask Claude to audit the portfolio's SEO. It used `repo_read_file` to pull `layout.tsx`, spotted that `BASE_URL` was missing `www`, wrote the fix, committed it. Then read `next.config.ts`, added a www redirect and security headers, committed. Then read `blogs/[slug]/page.tsx`, fixed the canonical URLs, added per-post OG images using the generated SVG covers, added `BlogPosting` and `BreadcrumbList` JSON-LD structured data, committed.

Seven commits. Zero file copying. No pasting code into a chat window. Claude read the actual files, wrote fixes against the actual codebase, and committed directly to main.

The workflow shift is meaningful. When the AI can read your code rather than your description of your code, the gap between what you asked for and what you get shrinks considerably. "Fix the canonical URL" against a real `layout.tsx` produces a targeted one-line change. Against a description, it produces boilerplate that you then have to adapt.

## The Pattern, Generalized

If you have a Next.js app on Vercel and want Claude to have repo access:

1. Create `src/app/api/mcp/route.ts` with `WebStandardStreamableHTTPServerTransport`
2. Add `GITHUB_TOKEN` to Vercel environment variables (repo scope)
3. Implement tools as thin wrappers over the GitHub Contents API
4. Do not call `server.close()` before `transport.handleRequest()` resolves
5. Add the deployed URL to Claude's MCP connectors in settings

The entire server deploys with your app. No separate infrastructure, no always-on process. Vercel handles scaling. The stateless design means each request is fully independent: exactly right for serverless.

The MCP SDK handles the wire protocol. The GitHub API handles the storage. Next.js handles the HTTP. Your tools connect them.

---

**Interested in building a similar setup?**

The full source is at `src/app/api/mcp/route.ts` in the portfolio repo. The `server.close()` bug in particular is non-obvious and the MCP SDK docs don't call it out explicitly: if you're building a stateless MCP server on a serverless platform and your tools aren't loading, start there. [Get in touch](/contact) if you're working through the same architecture.
