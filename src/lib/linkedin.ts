// ── Config ───────────────────────────────────────────────────────────────────

const OWNER = process.env.GITHUB_REPO_OWNER ?? "un-earthly";
const REPO = process.env.GITHUB_REPO_NAME ?? "portfolio-client";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? "";
const POSTS_PATH = process.env.LINKEDIN_POSTS_PATH ?? "src/content/linkedin-posts.json";

const LINKEDIN_ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN ?? "";
const LINKEDIN_PERSON_URN = process.env.LINKEDIN_PERSON_URN ?? ""; // e.g. "urn:li:person:AbCdEfGhIj"
const LINKEDIN_API_VERSION = process.env.LINKEDIN_API_VERSION ?? "202506";

// ── Types ────────────────────────────────────────────────────────────────────

export type PostStatus = "draft" | "scheduled" | "published" | "failed";

export interface LinkedInPost {
  id: string;
  content: string;
  status: PostStatus;
  scheduled_at?: string; // ISO 8601
  published_at?: string; // ISO 8601
  li_post_urn?: string;
  error?: string;
  created_at: string;
  updated_at: string;
}

// ── GitHub Contents API helpers (storage) ───────────────────────────────────

interface GHFile {
  content?: string;
  sha: string;
}

async function ghRequest(method: string, endpoint: string, body?: Record<string, unknown>): Promise<unknown> {
  const res = await fetch(`https://api.github.com${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub API ${method} ${endpoint} → ${res.status}: ${err}`);
  }
  return res.json();
}

async function repoGetFile(path: string): Promise<{ content: string; sha: string } | null> {
  try {
    const file = (await ghRequest("GET", `/repos/${OWNER}/${REPO}/contents/${path}`)) as GHFile;
    const content = Buffer.from(file.content ?? "", "base64").toString("utf-8");
    return { content, sha: file.sha };
  } catch {
    return null;
  }
}

async function repoPutFile(path: string, content: string, message: string, sha?: string): Promise<void> {
  const encoded = Buffer.from(content, "utf-8").toString("base64");
  await ghRequest("PUT", `/repos/${OWNER}/${REPO}/contents/${path}`, {
    message,
    content: encoded,
    ...(sha ? { sha } : {}),
  });
}

// ── Post storage (single JSON array, mirrors the blogs-manifest pattern) ────

async function readPosts(): Promise<{ posts: LinkedInPost[]; sha?: string }> {
  const data = await repoGetFile(POSTS_PATH);
  if (!data) return { posts: [] };
  try {
    return { posts: JSON.parse(data.content) as LinkedInPost[], sha: data.sha };
  } catch {
    return { posts: [] };
  }
}

async function writePosts(posts: LinkedInPost[], message: string, sha?: string): Promise<void> {
  const sorted = [...posts].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  await repoPutFile(POSTS_PATH, JSON.stringify(sorted, null, 2), message, sha);
}

function newId(): string {
  return `post_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function listPosts(status?: PostStatus): Promise<LinkedInPost[]> {
  const { posts } = await readPosts();
  return status ? posts.filter((p) => p.status === status) : posts;
}

export async function getPost(id: string): Promise<LinkedInPost | null> {
  const { posts } = await readPosts();
  return posts.find((p) => p.id === id) ?? null;
}

export async function createDraft(content: string): Promise<LinkedInPost> {
  const { posts, sha } = await readPosts();
  const now = new Date().toISOString();
  const post: LinkedInPost = { id: newId(), content, status: "draft", created_at: now, updated_at: now };
  posts.push(post);
  await writePosts(posts, `linkedin: draft ${post.id}`, sha);
  return post;
}

export async function updatePost(
  id: string,
  patch: Partial<Pick<LinkedInPost, "content" | "status" | "scheduled_at" | "published_at" | "li_post_urn" | "error">>
): Promise<LinkedInPost | null> {
  const { posts, sha } = await readPosts();
  const idx = posts.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  posts[idx] = { ...posts[idx], ...patch, updated_at: new Date().toISOString() };
  await writePosts(posts, `linkedin: update ${id}`, sha);
  return posts[idx];
}

export async function deletePost(id: string): Promise<boolean> {
  const { posts, sha } = await readPosts();
  const filtered = posts.filter((p) => p.id !== id);
  if (filtered.length === posts.length) return false;
  await writePosts(filtered, `linkedin: delete ${id}`, sha);
  return true;
}

// ── LinkedIn API ─────────────────────────────────────────────────────────────

export function linkedinConfigured(): boolean {
  return !!LINKEDIN_ACCESS_TOKEN && !!LINKEDIN_PERSON_URN;
}

export class LinkedInAuthError extends Error {}

/** Publishes a text post to the configured LinkedIn member profile via the Posts API. */
export async function publishToLinkedIn(content: string): Promise<string> {
  if (!linkedinConfigured()) {
    throw new Error(
      "LinkedIn not configured. Set LINKEDIN_ACCESS_TOKEN and LINKEDIN_PERSON_URN in Vercel env vars."
    );
  }

  const res = await fetch("https://api.linkedin.com/rest/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
      "LinkedIn-Version": LINKEDIN_API_VERSION,
      "X-Restli-Protocol-Version": "2.0.0",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      author: LINKEDIN_PERSON_URN,
      commentary: content,
      visibility: "PUBLIC",
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    }),
  });

  if (res.status === 401 || res.status === 403) {
    throw new LinkedInAuthError(
      `LinkedIn rejected the request (${res.status}). The access token is likely expired — it needs to be refreshed manually and LINKEDIN_ACCESS_TOKEN updated in Vercel.`
    );
  }
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`LinkedIn publish failed (${res.status}): ${body}`);
  }

  const urn = res.headers.get("x-restli-id") ?? res.headers.get("x-linkedin-id") ?? "";
  return urn;
}

/** Fetches the connected member's own profile info (name, headline, picture) via OpenID userinfo. */
export async function getMyLinkedInProfile(): Promise<Record<string, unknown>> {
  if (!LINKEDIN_ACCESS_TOKEN) {
    throw new Error("LinkedIn not configured. Set LINKEDIN_ACCESS_TOKEN in Vercel env vars.");
  }
  const res = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: { Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}` },
  });
  if (res.status === 401 || res.status === 403) {
    throw new LinkedInAuthError(
      `LinkedIn rejected the request (${res.status}). The access token is likely expired — it needs to be refreshed manually and LINKEDIN_ACCESS_TOKEN updated in Vercel.`
    );
  }
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`LinkedIn userinfo failed (${res.status}): ${body}`);
  }
  return res.json();
}

/** Publishes a specific stored post now and updates its record. Shared by the MCP tool and the cron job. */
export async function publishStoredPost(post: LinkedInPost): Promise<LinkedInPost> {
  try {
    const urn = await publishToLinkedIn(post.content);
    const updated = await updatePost(post.id, {
      status: "published",
      published_at: new Date().toISOString(),
      li_post_urn: urn,
      error: undefined,
    });
    return updated ?? post;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    await updatePost(post.id, { status: "failed", error: message });
    throw err;
  }
}

export const CRON_SECRET = process.env.CRON_SECRET ?? "";
