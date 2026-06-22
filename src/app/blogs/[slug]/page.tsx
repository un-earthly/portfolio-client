import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Sparkles, ArrowUpRight, MessageSquare } from "lucide-react";
import { getBlogBySlug, getAllBlogSlugs, getRelatedBlogs } from "@/lib/blogs";
import { parseMarkdown, extractToc } from "@/lib/markdown";
import { Badge } from "@/components/ui/badge";
import MermaidRenderer from "@/components/MermaidRenderer";
import { BlogToc } from "@/components/BlogToc";

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
  const toc = extractToc(post.content);
  const related = getRelatedBlogs(slug, post.tags);
  const tldr = post.tldr || post.excerpt || post.metaDescription;

  return (
    <div className="relative">
      {/* subtle section background, matching the site */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-20">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors my-8 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          All posts
        </Link>

        {post.cover && (
          <div className="mb-8 overflow-hidden rounded-2xl border border-slate-800">
            <img src={post.cover} alt={post.title} className="w-full aspect-1200/630 object-cover" />
          </div>
        )}

        {/* Header */}
        <header className="mb-8 pb-8 border-b border-slate-800 max-w-3xl">
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
            <Calendar className="h-3.5 w-3.5" />
            <span>{post.date}</span>
            <span>·</span>
            <Clock className="h-3.5 w-3.5" />
            <span>{post.readTime} min read</span>
            <span>·</span>
            <span className="capitalize text-cyan-600">{post.type.replace("-", " ")}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-100 leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-gray-400 leading-relaxed mb-5">{post.metaDescription}</p>
          <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="border-cyan-500/30 text-gray-500 text-xs shrink-0">
                {tag}
              </Badge>
            ))}
          </div>
        </header>

        {/* Two columns: sticky TOC + content */}
        <div className="flex gap-10">
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto hide-scrollbar">
              <BlogToc items={toc} />
            </div>
          </aside>

          <article className="min-w-0 max-w-3xl flex-1 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-sm p-6 md:p-10">
            {/* TL;DR */}
            {tldr && (
              <div className="mb-10 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
                <p className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400">
                  <Sparkles className="h-3.5 w-3.5" /> TL;DR
                </p>
                <p className="text-sm leading-relaxed text-gray-300">{tldr}</p>
              </div>
            )}

            <MermaidRenderer html={html} />

            {/* FAQ */}
            {post.faqs && post.faqs.length > 0 && (
              <section className="mt-14 border-t border-slate-800 pt-10">
                <h2 className="text-xl font-bold text-gray-100 mb-5">Frequently asked</h2>
                <div className="space-y-3">
                  {post.faqs.map((f, i) => (
                    <details key={i} className="group rounded-xl border border-white/8 bg-white/2 p-4">
                      <summary className="cursor-pointer list-none text-sm font-semibold text-gray-200 marker:hidden">
                        {f.q}
                      </summary>
                      <p className="mt-2 text-sm leading-relaxed text-gray-400">{f.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* Hiring / work-with-me CTA */}
            <section className="mt-14 overflow-hidden rounded-2xl border border-cyan-500/20 bg-linear-to-br from-cyan-500/10 to-transparent p-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400 mb-2">
                Hiring or have a project?
              </p>
              <h2 className="text-2xl font-black text-white mb-2">Let&apos;s build something that holds.</h2>
              <p className="text-sm text-gray-400 mb-5 max-w-md">
                Full-stack engineering, system design, and legacy modernization — available for
                freelance, contract, and full-time roles.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-6 py-2.5 text-sm font-bold text-black transition-colors hover:bg-cyan-400"
                >
                  Book a call <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:border-cyan-500/40 hover:text-white"
                >
                  See my work
                </Link>
              </div>
            </section>

            {/* Related posts */}
            {related.length > 0 && (
              <section className="mt-14 border-t border-slate-800 pt-10">
                <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-gray-100">
                  <MessageSquare className="h-4 w-4 text-cyan-500" /> Keep reading
                </h2>
                <div className="grid gap-3 sm:grid-cols-3">
                  {related.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/blogs/${r.slug}`}
                      className="group rounded-xl border border-white/8 bg-white/2 p-4 transition-colors hover:border-cyan-500/30 hover:bg-cyan-500/5"
                    >
                      <span className="font-mono text-[9px] uppercase tracking-wider text-cyan-500/70">
                        {r.type.replace("-", " ")}
                      </span>
                      <p className="mt-1 text-sm font-semibold leading-snug text-gray-200 group-hover:text-cyan-100">
                        {r.title}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </article>
        </div>
      </div>
    </div>
  );
}
