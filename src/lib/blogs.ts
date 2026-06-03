import fs from "fs";
import path from "path";

export interface BlogMeta {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  metaDescription: string;
  readTime: number;
  excerpt: string;
  type: "technical" | "hot-take";
}

export interface BlogPost extends BlogMeta {
  content: string;
}

const blogsDir = path.join(process.cwd(), "src/content/blogs");

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

export function getAllBlogs(): BlogMeta[] {
  if (!fs.existsSync(blogsDir)) return [];
  const files = fs.readdirSync(blogsDir).filter((f) => f.endsWith(".md"));
  const blogs = files.map((filename) => {
    const slug = filename.replace(".md", "");
    const raw = fs.readFileSync(path.join(blogsDir, filename), "utf-8");
    const { meta } = parseFrontmatter(raw);
    return {
      slug,
      title: (meta.title as string) || slug,
      date: (meta.date as string) || "",
      tags: (meta.tags as string[]) || [],
      metaDescription: (meta.metaDescription as string) || "",
      readTime: Number(meta.readTime) || 5,
      excerpt: (meta.excerpt as string) || "",
      type: ((meta.type as "technical" | "hot-take") || "technical"),
    };
  });
  return blogs.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getBlogBySlug(slug: string): BlogPost | null {
  const filepath = path.join(blogsDir, `${slug}.md`);
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
    content: body,
  };
}

export function getAllBlogSlugs(): string[] {
  if (!fs.existsSync(blogsDir)) return [];
  return fs
    .readdirSync(blogsDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(".md", ""));
}
