import { Server } from "@modelcontextprotocol/sdk/server";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
} from "@modelcontextprotocol/sdk/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ── Config ───────────────────────────────────────────────────────────────────

const OWNER = process.env.GITHUB_REPO_OWNER ?? "un-earthly";
const REPO = process.env.GITHUB_REPO_NAME ?? "portfolio-client";
const BLOGS_PATH = process.env.GITHUB_BLOGS_PATH ?? "src/content/blogs";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? "";

// ── GitHub API helpers ───────────────────────────────────────────────────────

interface GHFile {
  name: string;
  path: string;
  sha: string;
  type: "file" | "dir";
  content?: string;
  encoding?: string;
}

async function ghRequest(
  method: string,
  endpoint: string,
  body?: Record<string, unknown>
): Promise<unknown> {
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

// ── Repo file helpers (generic) ──────────────────────────────────────────────

async function repoGetFile(path: string): Promise<{ content: string; sha: string } | null> {
  try {
    const file = (await ghRequest(
      "GET",
      `/repos/${OWNER}/${REPO}/contents/${path}`
    )) as GHFile;
    const content = Buffer.from(file.content ?? "", "base64").toString("utf-8");
    return { content, sha: file.sha };
  } catch {
    return null;
  }
}

async function repoPutFile(
  path: string,
  content: string,
  message: string,
  sha?: string
): Promise<void> {
  const encoded = Buffer.from(content, "utf-8").toString("base64");
  await ghRequest("PUT", `/repos/${OWNER}/${REPO}/contents/${path}`, {
    message,
    content: encoded,
    ...(sha ? { sha } : {}),
  });
}

async function repoListDir(path: string): Promise<{ name: string; path: string; type: string }[]> {
  const items = (await ghRequest(
    "GET",
    `/repos/${OWNER}/${REPO}/contents/${path}`
  )) as GHFile[];
  return items.map((i) => ({ name: i.name, path: i.path, type: i.type }));
}

// ── Blog file helpers ────────────────────────────────────────────────────────

async function listBlogFiles(): Promise<GHFile[]> {
  const files = (await ghRequest(
    "GET",
    `/repos/${OWNER}/${REPO}/contents/${BLOGS_PATH}`
  )) as GHFile[];
  return files.filter((f) => f.type === "file" && f.name.endsWith(".md"));
}

async function getFile(slug: string): Promise<{ content: string; sha: string } | null> {
  return repoGetFile(`${BLOGS_PATH}/${slug}.md`);
}

async function putFile(
  slug: string,
  content: string,
  message: string,
  sha?: string
): Promise<void> {
  return repoPutFile(`${BLOGS_PATH}/${slug}.md`, content, message, sha);
}

async function deleteFile(slug: string, sha: string, message: string): Promise<void> {
  await ghRequest("DELETE", `/repos/${OWNER}/${REPO}/contents/${BLOGS_PATH}/${slug}.md`, {
    message,
    sha,
  });
}

// ── Frontmatter helpers ──────────────────────────────────────────────────────

interface BlogMeta {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  metaDescription: string;
  readTime: number;
  excerpt: string;
  type: "technical" | "hot-take";
  cover: string;
  tldr?: string;
  faqs?: { q: string; a: string }[];
}

interface BlogPost extends BlogMeta {
  content: string;
}

function parseFrontmatter(raw: string): {
  meta: Record<string, string | string[]>;
  body: string;
} {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };

  const meta: Record<string, string | string[]> = {};
  match[1].split("\n").forEach((line) => {
    const colon = line.indexOf(":");
    if (colon === -1) return;
    const key = line.slice(0, colon).trim();
    const val = line.slice(colon + 1).trim();
    if (val.startsWith("[")) {
      meta[key] = val
        .slice(1, -1)
        .split(",")
        .map((v) => v.trim().replace(/^['"]|['"]$/g, ""));
    } else {
      meta[key] = val.replace(/^['"]|['"]$/g, "");
    }
  });

  return { meta, body: match[2] };
}

function parseFaqs(raw?: string): { q: string; a: string }[] {
  if (!raw) return [];
  return raw
    .split("|")
    .map((pair) => pair.split("::"))
    .filter((p) => p.length === 2)
    .map(([q, a]) => ({ q: q.trim(), a: a.trim() }));
}

function buildFrontmatter(meta: Partial<BlogMeta>): string {
  const lines: string[] = ["---"];
  if (meta.title) lines.push(`title: "${meta.title}"`);
  if (meta.date) lines.push(`date: ${meta.date}`);
  if (meta.tags && meta.tags.length > 0) lines.push(`tags: [${meta.tags.join(", ")}]`);
  if (meta.metaDescription) lines.push(`metaDescription: ${meta.metaDescription}`);
  if (meta.readTime != null) lines.push(`readTime: ${meta.readTime}`);
  if (meta.type) lines.push(`type: ${meta.type}`);
  if (meta.excerpt) lines.push(`excerpt: ${meta.excerpt}`);
  if (meta.cover) lines.push(`cover: '${meta.cover}'`);
  if (meta.tldr) lines.push(`tldr: "${meta.tldr}"`);
  if (meta.faqs && meta.faqs.length > 0) {
    lines.push(`faqs: ${meta.faqs.map((f) => `${f.q}::${f.a}`).join(" | ")}`);
  }
  lines.push("---\n");
  return lines.join("\n");
}

function rawToPost(slug: string, raw: string): BlogPost {
  const { meta, body } = parseFrontmatter(raw);
  return {
    slug,
    title: (meta.title as string) || slug,
    date: (meta.date as string) || "",
    tags: (meta.tags as string[]) || [],
    metaDescription: (meta.metaDescription as string) || "",
    readTime: Number(meta.readTime) || 5,
    excerpt: (meta.excerpt as string) || "",
    type: (meta.type as "technical" | "hot-take") || "technical",
    cover: (meta.cover as string) || `/blog-covers/${slug}.svg`,
    tldr: (meta.tldr as string) || undefined,
    faqs: parseFaqs(meta.faqs as string | undefined),
    content: body,
  };
}

// ── MCP Tools ────────────────────────────────────────────────────────────────

const TOOLS: Tool[] = [
  // ── Blog tools ──────────────────────────────────────────────────────────
  {
    name: "list_blogs",
    description: "List all blog posts with metadata, newest first. Optionally filter by tag or type.",
    inputSchema: {
      type: "object",
      properties: {
        tag: { type: "string", description: "Filter by tag (case-insensitive substring)" },
        type: { type: "string", enum: ["technical", "hot-take"] },
      },
    },
  },
  {
    name: "read_blog",
    description: "Read the full content and metadata of a blog post by slug.",
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string", description: "Blog slug (filename without .md)" },
      },
      required: ["slug"],
    },
  },
  {
    name: "create_blog",
    description: "Create a new blog post and commit it to the GitHub repo.",
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string" },
        title: { type: "string" },
        date: { type: "string", description: "YYYY-MM-DD" },
        tags: { type: "array", items: { type: "string" } },
        type: { type: "string", enum: ["technical", "hot-take"] },
        excerpt: { type: "string" },
        metaDescription: { type: "string" },
        readTime: { type: "number" },
        content: { type: "string", description: "Full markdown body" },
        cover: { type: "string" },
        tldr: { type: "string" },
        faqs: {
          type: "array",
          items: {
            type: "object",
            properties: { q: { type: "string" }, a: { type: "string" } },
            required: ["q", "a"],
          },
        },
      },
      required: ["slug", "title", "date", "type", "content"],
    },
  },
  {
    name: "update_blog",
    description: "Update metadata fields or body of an existing blog post. Only supplied fields change.",
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string" },
        title: { type: "string" },
        date: { type: "string" },
        tags: { type: "array", items: { type: "string" } },
        type: { type: "string", enum: ["technical", "hot-take"] },
        excerpt: { type: "string" },
        metaDescription: { type: "string" },
        readTime: { type: "number" },
        content: { type: "string", description: "Replaces the full markdown body" },
        cover: { type: "string" },
        tldr: { type: "string" },
        faqs: {
          type: "array",
          items: {
            type: "object",
            properties: { q: { type: "string" }, a: { type: "string" } },
            required: ["q", "a"],
          },
        },
      },
      required: ["slug"],
    },
  },
  {
    name: "delete_blog",
    description: "Delete a blog post from the GitHub repo.",
    inputSchema: {
      type: "object",
      properties: { slug: { type: "string" } },
      required: ["slug"],
    },
  },
  {
    name: "rename_blog",
    description: "Rename a blog slug: copies the file under a new name and deletes the old one.",
    inputSchema: {
      type: "object",
      properties: {
        old_slug: { type: "string" },
        new_slug: { type: "string" },
      },
      required: ["old_slug", "new_slug"],
    },
  },
  {
    name: "search_blogs",
    description:
      "Search blog posts by keyword across title, excerpt, and tags. Pass search_content: true to also scan markdown bodies (slower — fetches all files).",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string" },
        search_content: { type: "boolean", default: false },
      },
      required: ["query"],
    },
  },
  {
    name: "get_blog_stats",
    description: "Aggregate stats: total count, breakdown by type, avg read time, top 10 tags.",
    inputSchema: { type: "object", properties: {} },
  },

  // ── GitHub repo file tools ───────────────────────────────────────────────
  {
    name: "repo_read_file",
    description:
      "Read any file in the portfolio repo by its path (e.g. src/app/layout.tsx, next.config.ts). Returns the file content as a string.",
    inputSchema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "File path relative to repo root, e.g. src/app/layout.tsx",
        },
      },
      required: ["path"],
    },
  },
  {
    name: "repo_write_file",
    description:
      "Write (create or update) any file in the portfolio repo. Provide the full file content — this replaces the file entirely. Commits directly to main.",
    inputSchema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "File path relative to repo root, e.g. src/app/robots.ts",
        },
        content: {
          type: "string",
          description: "Full file content to write",
        },
        message: {
          type: "string",
          description: "Git commit message",
        },
      },
      required: ["path", "content", "message"],
    },
  },
  {
    name: "repo_list_dir",
    description:
      "List files and directories at a given path in the portfolio repo.",
    inputSchema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Directory path relative to repo root, e.g. src/app or src/components",
        },
      },
      required: ["path"],
    },
  },
];

// ── Build MCP Server ─────────────────────────────────────────────────────────

function createMcpServer(): Server {
  const server = new Server(
    { name: "portfolio-manager", version: "2.0.0" },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    const { name, arguments: args = {} } = req.params;

    try {
      switch (name) {
        // ── list_blogs ──────────────────────────────────────────────────
        case "list_blogs": {
          const files = await listBlogFiles();
          const posts = await Promise.all(
            files.map(async (f) => {
              const slug = f.name.replace(".md", "");
              const data = await getFile(slug);
              if (!data) return null;
              const { content: _, ...meta } = rawToPost(slug, data.content);
              return meta;
            })
          );
          let blogs = posts
            .filter((b): b is BlogMeta => b !== null)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

          if (args.tag) {
            const tag = (args.tag as string).toLowerCase();
            blogs = blogs.filter((b) => b.tags.some((t) => t.toLowerCase().includes(tag)));
          }
          if (args.type) {
            blogs = blogs.filter((b) => b.type === args.type);
          }

          return {
            content: [{ type: "text", text: JSON.stringify({ count: blogs.length, blogs }, null, 2) }],
          };
        }

        // ── read_blog ───────────────────────────────────────────────────
        case "read_blog": {
          const data = await getFile(args.slug as string);
          if (!data) {
            return {
              content: [{ type: "text", text: `Blog "${args.slug}" not found.` }],
              isError: true,
            };
          }
          const post = rawToPost(args.slug as string, data.content);
          return { content: [{ type: "text", text: JSON.stringify(post, null, 2) }] };
        }

        // ── create_blog ─────────────────────────────────────────────────
        case "create_blog": {
          const slug = args.slug as string;
          const existing = await getFile(slug);
          if (existing) {
            return {
              content: [{ type: "text", text: `"${slug}" already exists. Use update_blog.` }],
              isError: true,
            };
          }
          const meta: Partial<BlogMeta> = {
            title: args.title as string,
            date: args.date as string,
            tags: (args.tags as string[]) || [],
            type: (args.type as "technical" | "hot-take") || "technical",
            excerpt: (args.excerpt as string) || "",
            metaDescription: (args.metaDescription as string) || "",
            readTime: (args.readTime as number) || 5,
            cover: (args.cover as string) || `/blog-covers/${slug}.svg`,
            tldr: args.tldr as string | undefined,
            faqs: args.faqs as { q: string; a: string }[] | undefined,
          };
          const fileContent = buildFrontmatter(meta) + (args.content as string);
          await putFile(slug, fileContent, `blog: add ${slug}`);
          return { content: [{ type: "text", text: `Created and committed: ${slug}.md` }] };
        }

        // ── update_blog ─────────────────────────────────────────────────
        case "update_blog": {
          const slug = args.slug as string;
          const data = await getFile(slug);
          if (!data) {
            return {
              content: [{ type: "text", text: `"${slug}" not found. Use create_blog.` }],
              isError: true,
            };
          }
          const existing = rawToPost(slug, data.content);
          const updated: BlogMeta = { ...existing };
          if (args.title !== undefined) updated.title = args.title as string;
          if (args.date !== undefined) updated.date = args.date as string;
          if (args.tags !== undefined) updated.tags = args.tags as string[];
          if (args.type !== undefined) updated.type = args.type as "technical" | "hot-take";
          if (args.excerpt !== undefined) updated.excerpt = args.excerpt as string;
          if (args.metaDescription !== undefined) updated.metaDescription = args.metaDescription as string;
          if (args.readTime !== undefined) updated.readTime = args.readTime as number;
          if (args.cover !== undefined) updated.cover = args.cover as string;
          if (args.tldr !== undefined) updated.tldr = args.tldr as string;
          if (args.faqs !== undefined) updated.faqs = args.faqs as { q: string; a: string }[];
          const newBody = args.content !== undefined ? (args.content as string) : existing.content;
          await putFile(slug, buildFrontmatter(updated) + newBody, `blog: update ${slug}`, data.sha);
          return { content: [{ type: "text", text: `Updated and committed: ${slug}.md` }] };
        }

        // ── delete_blog ─────────────────────────────────────────────────
        case "delete_blog": {
          const slug = args.slug as string;
          const data = await getFile(slug);
          if (!data) {
            return {
              content: [{ type: "text", text: `"${slug}" not found.` }],
              isError: true,
            };
          }
          await deleteFile(slug, data.sha, `blog: delete ${slug}`);
          return { content: [{ type: "text", text: `Deleted: ${slug}.md` }] };
        }

        // ── rename_blog ─────────────────────────────────────────────────
        case "rename_blog": {
          const oldSlug = args.old_slug as string;
          const newSlug = args.new_slug as string;
          const oldData = await getFile(oldSlug);
          if (!oldData) {
            return {
              content: [{ type: "text", text: `"${oldSlug}" not found.` }],
              isError: true,
            };
          }
          if (await getFile(newSlug)) {
            return {
              content: [{ type: "text", text: `"${newSlug}" already exists.` }],
              isError: true,
            };
          }
          const autoOld = `/blog-covers/${oldSlug}.svg`;
          const autoNew = `/blog-covers/${newSlug}.svg`;
          const newContent = oldData.content.includes(autoOld)
            ? oldData.content.replaceAll(autoOld, autoNew)
            : oldData.content;
          await putFile(newSlug, newContent, `blog: rename ${oldSlug} → ${newSlug}`);
          await deleteFile(oldSlug, oldData.sha, `blog: rename ${oldSlug} → ${newSlug} (remove old)`);
          return { content: [{ type: "text", text: `Renamed: ${oldSlug} → ${newSlug}` }] };
        }

        // ── search_blogs ────────────────────────────────────────────────
        case "search_blogs": {
          const query = (args.query as string).toLowerCase();
          const searchContent = (args.search_content as boolean) ?? false;
          const files = await listBlogFiles();

          const results: BlogMeta[] = [];
          await Promise.all(
            files.map(async (f) => {
              const slug = f.name.replace(".md", "");
              const data = await getFile(slug);
              if (!data) return;
              const post = rawToPost(slug, data.content);
              const hit =
                post.title.toLowerCase().includes(query) ||
                post.excerpt.toLowerCase().includes(query) ||
                post.tags.some((t) => t.toLowerCase().includes(query)) ||
                (searchContent && post.content.toLowerCase().includes(query));
              if (hit) {
                const { content: _, ...meta } = post;
                results.push(meta);
              }
            })
          );
          results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

          return {
            content: [
              {
                type: "text",
                text:
                  results.length > 0
                    ? JSON.stringify({ count: results.length, results }, null, 2)
                    : `No blogs found matching "${args.query as string}".`,
              },
            ],
          };
        }

        // ── get_blog_stats ──────────────────────────────────────────────
        case "get_blog_stats": {
          const files = await listBlogFiles();
          const posts = await Promise.all(
            files.map(async (f) => {
              const slug = f.name.replace(".md", "");
              const data = await getFile(slug);
              if (!data) return null;
              const { content: _, ...meta } = rawToPost(slug, data.content);
              return meta;
            })
          );
          const blogs = posts
            .filter((b): b is BlogMeta => b !== null)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

          const tagCount: Record<string, number> = {};
          const byType: Record<string, number> = {};
          let totalReadTime = 0;
          for (const b of blogs) {
            b.tags.forEach((t) => { tagCount[t] = (tagCount[t] ?? 0) + 1; });
            byType[b.type] = (byType[b.type] ?? 0) + 1;
            totalReadTime += b.readTime;
          }
          const topTags = Object.entries(tagCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([tag, count]) => ({ tag, count }));

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  total: blogs.length,
                  byType,
                  avgReadTime: blogs.length ? Math.round(totalReadTime / blogs.length) : 0,
                  topTags,
                  newest: blogs[0]?.slug ?? null,
                  oldest: blogs[blogs.length - 1]?.slug ?? null,
                }, null, 2),
              },
            ],
          };
        }

        // ── repo_read_file ──────────────────────────────────────────────
        case "repo_read_file": {
          const filePath = args.path as string;
          const data = await repoGetFile(filePath);
          if (!data) {
            return {
              content: [{ type: "text", text: `File not found: ${filePath}` }],
              isError: true,
            };
          }
          return {
            content: [{ type: "text", text: data.content }],
          };
        }

        // ── repo_write_file ─────────────────────────────────────────────
        case "repo_write_file": {
          const filePath = args.path as string;
          const content = args.content as string;
          const message = args.message as string;

          // Get existing SHA if file exists (required for updates)
          const existing = await repoGetFile(filePath);
          await repoPutFile(filePath, content, message, existing?.sha);

          return {
            content: [
              {
                type: "text",
                text: existing
                  ? `Updated and committed: ${filePath}`
                  : `Created and committed: ${filePath}`,
              },
            ],
          };
        }

        // ── repo_list_dir ───────────────────────────────────────────────
        case "repo_list_dir": {
          const dirPath = args.path as string;
          const items = await repoListDir(dirPath);
          return {
            content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
          };
        }

        default:
          return { content: [{ type: "text", text: `Unknown tool: ${name}` }], isError: true };
      }
    } catch (err) {
      return {
        content: [{ type: "text", text: `Error: ${(err as Error).message}` }],
        isError: true,
      };
    }
  });

  return server;
}

// ── Route handler ─────────────────────────────────────────────────────────────

async function handleMcp(req: Request): Promise<Response> {
  if (!GITHUB_TOKEN) {
    return new Response(JSON.stringify({ error: "GITHUB_TOKEN not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  const server = createMcpServer();
  await server.connect(transport);

  // Do not call server.close() in stateless mode — handleRequest returns
  // a Promise that may not have resolved yet. Cleanup is handled by GC.
  return transport.handleRequest(req);
}

export async function POST(req: Request): Promise<Response> {
  return handleMcp(req);
}

export async function GET(req: Request): Promise<Response> {
  return handleMcp(req);
}

export async function DELETE(req: Request): Promise<Response> {
  return handleMcp(req);
}
