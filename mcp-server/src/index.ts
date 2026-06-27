import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BLOGS_DIR =
  process.env.BLOGS_DIR ||
  path.join(__dirname, "../../src/content/blogs");

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
  if (meta.tags && meta.tags.length > 0) {
    lines.push(`tags: [${meta.tags.join(", ")}]`);
  }
  if (meta.metaDescription) lines.push(`metaDescription: ${meta.metaDescription}`);
  if (meta.readTime != null) lines.push(`readTime: ${meta.readTime}`);
  if (meta.type) lines.push(`type: ${meta.type}`);
  if (meta.excerpt) lines.push(`excerpt: ${meta.excerpt}`);
  if (meta.cover) lines.push(`cover: '${meta.cover}'`);
  if (meta.tldr) lines.push(`tldr: "${meta.tldr}"`);
  if (meta.faqs && meta.faqs.length > 0) {
    const faqStr = meta.faqs.map((f) => `${f.q}::${f.a}`).join(" | ");
    lines.push(`faqs: ${faqStr}`);
  }

  lines.push("---\n");
  return lines.join("\n");
}

function readBlogFile(slug: string): BlogPost | null {
  const filepath = path.join(BLOGS_DIR, `${slug}.md`);
  if (!fs.existsSync(filepath)) return null;

  const raw = fs.readFileSync(filepath, "utf-8");
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

function getAllBlogMeta(): BlogMeta[] {
  if (!fs.existsSync(BLOGS_DIR)) return [];
  return fs
    .readdirSync(BLOGS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const post = readBlogFile(f.replace(".md", ""));
      if (!post) return null;
      const { content: _content, ...meta } = post;
      return meta;
    })
    .filter((b): b is BlogMeta => b !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// ── Server ──────────────────────────────────────────────────────────────────

const server = new Server(
  { name: "portfolio-blog-manager", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

const TOOLS: Tool[] = [
  {
    name: "list_blogs",
    description:
      "List all blog posts with metadata (newest first). Optionally filter by tag or type.",
    inputSchema: {
      type: "object",
      properties: {
        tag: {
          type: "string",
          description: "Filter by tag (case-insensitive substring match)",
        },
        type: {
          type: "string",
          enum: ["technical", "hot-take"],
          description: "Filter by post type",
        },
      },
    },
  },
  {
    name: "read_blog",
    description: "Read the full content and metadata of a blog post by slug.",
    inputSchema: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description: "Blog slug (filename without .md extension)",
        },
      },
      required: ["slug"],
    },
  },
  {
    name: "create_blog",
    description: "Create a new blog post markdown file with frontmatter.",
    inputSchema: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description:
            "URL-friendly slug used as the filename (e.g. my-new-post)",
        },
        title: { type: "string", description: "Post title" },
        date: {
          type: "string",
          description: "Publication date in YYYY-MM-DD format",
        },
        tags: {
          type: "array",
          items: { type: "string" },
          description: "List of tags",
        },
        type: {
          type: "string",
          enum: ["technical", "hot-take"],
          description: "Post type",
        },
        excerpt: {
          type: "string",
          description: "Short summary shown on the blog listing page",
        },
        metaDescription: {
          type: "string",
          description: "SEO meta description (max ~160 chars)",
        },
        readTime: {
          type: "number",
          description: "Estimated read time in minutes",
        },
        content: {
          type: "string",
          description: "Full markdown body content",
        },
        cover: {
          type: "string",
          description:
            "Cover image path (defaults to /blog-covers/<slug>.svg)",
        },
        tldr: {
          type: "string",
          description: "Optional TL;DR one-liner shown at the top",
        },
        faqs: {
          type: "array",
          description: "Optional FAQ list",
          items: {
            type: "object",
            properties: {
              q: { type: "string" },
              a: { type: "string" },
            },
            required: ["q", "a"],
          },
        },
      },
      required: ["slug", "title", "date", "type", "content"],
    },
  },
  {
    name: "update_blog",
    description:
      "Update metadata fields or content of an existing blog post. Only supplied fields are changed.",
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string", description: "Slug of the blog to update" },
        title: { type: "string" },
        date: { type: "string" },
        tags: { type: "array", items: { type: "string" } },
        type: { type: "string", enum: ["technical", "hot-take"] },
        excerpt: { type: "string" },
        metaDescription: { type: "string" },
        readTime: { type: "number" },
        content: {
          type: "string",
          description: "New markdown body — replaces the existing body entirely",
        },
        cover: { type: "string" },
        tldr: { type: "string" },
        faqs: {
          type: "array",
          items: {
            type: "object",
            properties: {
              q: { type: "string" },
              a: { type: "string" },
            },
            required: ["q", "a"],
          },
        },
      },
      required: ["slug"],
    },
  },
  {
    name: "delete_blog",
    description: "Permanently delete a blog post by slug.",
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string", description: "Slug of the blog to delete" },
      },
      required: ["slug"],
    },
  },
  {
    name: "rename_blog",
    description:
      "Rename a blog post slug (renames the file and updates the default cover path if it was auto-generated).",
    inputSchema: {
      type: "object",
      properties: {
        old_slug: { type: "string", description: "Current slug" },
        new_slug: { type: "string", description: "New slug" },
      },
      required: ["old_slug", "new_slug"],
    },
  },
  {
    name: "search_blogs",
    description:
      "Search blog posts by keyword. Matches against title, excerpt, and tags by default. Pass search_content: true to also scan the markdown body.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query" },
        search_content: {
          type: "boolean",
          description:
            "Also search inside the full markdown content (slower, reads all files)",
          default: false,
        },
      },
      required: ["query"],
    },
  },
  {
    name: "get_blog_stats",
    description:
      "Return aggregate statistics: total count, breakdown by type, average read time, top 10 tags, newest and oldest post slugs.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  try {
    switch (name) {
      // ── list_blogs ──────────────────────────────────────────────────────
      case "list_blogs": {
        let blogs = getAllBlogMeta();

        if (args.tag) {
          const tag = (args.tag as string).toLowerCase();
          blogs = blogs.filter((b) =>
            b.tags.some((t) => t.toLowerCase().includes(tag))
          );
        }
        if (args.type) {
          blogs = blogs.filter((b) => b.type === args.type);
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                { count: blogs.length, blogs },
                null,
                2
              ),
            },
          ],
        };
      }

      // ── read_blog ───────────────────────────────────────────────────────
      case "read_blog": {
        const blog = readBlogFile(args.slug as string);
        if (!blog) {
          return {
            content: [
              {
                type: "text",
                text: `Blog "${args.slug}" not found. Use list_blogs to see available slugs.`,
              },
            ],
            isError: true,
          };
        }
        return { content: [{ type: "text", text: JSON.stringify(blog, null, 2) }] };
      }

      // ── create_blog ─────────────────────────────────────────────────────
      case "create_blog": {
        const slug = args.slug as string;
        const filepath = path.join(BLOGS_DIR, `${slug}.md`);

        if (fs.existsSync(filepath)) {
          return {
            content: [
              {
                type: "text",
                text: `Blog "${slug}" already exists. Use update_blog to modify it.`,
              },
            ],
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

        fs.writeFileSync(filepath, buildFrontmatter(meta) + (args.content as string), "utf-8");

        return {
          content: [{ type: "text", text: `Created: src/content/blogs/${slug}.md` }],
        };
      }

      // ── update_blog ─────────────────────────────────────────────────────
      case "update_blog": {
        const slug = args.slug as string;
        const existing = readBlogFile(slug);

        if (!existing) {
          return {
            content: [
              {
                type: "text",
                text: `Blog "${slug}" not found. Use create_blog to make a new post.`,
              },
            ],
            isError: true,
          };
        }

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

        fs.writeFileSync(
          path.join(BLOGS_DIR, `${slug}.md`),
          buildFrontmatter(updated) + newBody,
          "utf-8"
        );

        return {
          content: [{ type: "text", text: `Updated: src/content/blogs/${slug}.md` }],
        };
      }

      // ── delete_blog ─────────────────────────────────────────────────────
      case "delete_blog": {
        const slug = args.slug as string;
        const filepath = path.join(BLOGS_DIR, `${slug}.md`);

        if (!fs.existsSync(filepath)) {
          return {
            content: [{ type: "text", text: `Blog "${slug}" not found.` }],
            isError: true,
          };
        }

        fs.unlinkSync(filepath);
        return {
          content: [{ type: "text", text: `Deleted: src/content/blogs/${slug}.md` }],
        };
      }

      // ── rename_blog ─────────────────────────────────────────────────────
      case "rename_blog": {
        const oldSlug = args.old_slug as string;
        const newSlug = args.new_slug as string;
        const oldPath = path.join(BLOGS_DIR, `${oldSlug}.md`);
        const newPath = path.join(BLOGS_DIR, `${newSlug}.md`);

        if (!fs.existsSync(oldPath)) {
          return {
            content: [{ type: "text", text: `Blog "${oldSlug}" not found.` }],
            isError: true,
          };
        }
        if (fs.existsSync(newPath)) {
          return {
            content: [
              { type: "text", text: `Slug "${newSlug}" is already taken.` },
            ],
            isError: true,
          };
        }

        let fileContent = fs.readFileSync(oldPath, "utf-8");
        // Update auto-generated cover path if it was based on the old slug
        const autoOldCover = `/blog-covers/${oldSlug}.svg`;
        const autoNewCover = `/blog-covers/${newSlug}.svg`;
        if (fileContent.includes(autoOldCover)) {
          fileContent = fileContent.replaceAll(autoOldCover, autoNewCover);
        }

        fs.writeFileSync(newPath, fileContent, "utf-8");
        fs.unlinkSync(oldPath);

        return {
          content: [{ type: "text", text: `Renamed: ${oldSlug} → ${newSlug}` }],
        };
      }

      // ── search_blogs ────────────────────────────────────────────────────
      case "search_blogs": {
        const query = (args.query as string).toLowerCase();
        const searchContent = (args.search_content as boolean) ?? false;

        const results = getAllBlogMeta()
          .filter((blog) => {
            const inTitle = blog.title.toLowerCase().includes(query);
            const inExcerpt = blog.excerpt.toLowerCase().includes(query);
            const inTags = blog.tags.some((t) => t.toLowerCase().includes(query));

            if (inTitle || inExcerpt || inTags) return true;

            if (searchContent) {
              const full = readBlogFile(blog.slug);
              return full?.content.toLowerCase().includes(query) ?? false;
            }

            return false;
          })
          .map(({ slug, title, date, tags, type, excerpt, readTime }) => ({
            slug, title, date, tags, type, excerpt, readTime,
          }));

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

      // ── get_blog_stats ──────────────────────────────────────────────────
      case "get_blog_stats": {
        const blogs = getAllBlogMeta();

        const tagCount: Record<string, number> = {};
        const byType: Record<string, number> = {};
        let totalReadTime = 0;

        for (const blog of blogs) {
          blog.tags.forEach((t) => {
            tagCount[t] = (tagCount[t] ?? 0) + 1;
          });
          byType[blog.type] = (byType[blog.type] ?? 0) + 1;
          totalReadTime += blog.readTime;
        }

        const sorted = [...blogs].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        const topTags = Object.entries(tagCount)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10)
          .map(([tag, count]) => ({ tag, count }));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  total: blogs.length,
                  byType,
                  avgReadTime: blogs.length
                    ? Math.round(totalReadTime / blogs.length)
                    : 0,
                  topTags,
                  newest: sorted[0]?.slug ?? null,
                  oldest: sorted[sorted.length - 1]?.slug ?? null,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      default:
        return {
          content: [{ type: "text", text: `Unknown tool: ${name}` }],
          isError: true,
        };
    }
  } catch (err) {
    return {
      content: [{ type: "text", text: `Error: ${(err as Error).message}` }],
      isError: true,
    };
  }
});

async function main() {
  if (!fs.existsSync(BLOGS_DIR)) {
    process.stderr.write(`Warning: blogs directory not found at ${BLOGS_DIR}\n`);
  }
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  process.stderr.write(`Fatal: ${err.message}\n`);
  process.exit(1);
});
