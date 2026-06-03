import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { getBlogBySlug, getAllBlogSlugs } from "@/lib/blogs";
import { parseMarkdown } from "@/lib/markdown";
import { Badge } from "@/components/ui/badge";

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.metaDescription,
    alternates: { canonical: `https://alamin-md.xyz/blogs/${slug}` },
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      url: `https://alamin-md.xyz/blogs/${slug}`,
      type: "article",
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) notFound();

  const html = parseMarkdown(post.content);

  return (
    <article className="max-w-3xl mx-auto pb-16">
      <Link
        href="/blogs"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors mb-8 text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        All posts
      </Link>

      <header className="mb-10 pb-8 border-b border-slate-800">
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
          <Calendar className="h-3.5 w-3.5" />
          <span>{post.date}</span>
          <span>·</span>
          <Clock className="h-3.5 w-3.5" />
          <span>{post.readTime} min read</span>
          <span>·</span>
          <span className="capitalize text-cyan-600">{post.type.replace("-", " ")}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-100 leading-tight mb-4">
          {post.title}
        </h1>
        <p className="text-gray-400 leading-relaxed mb-5">{post.metaDescription}</p>
        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {post.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="border-cyan-500/30 text-gray-500 text-xs shrink-0"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </header>

      <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
