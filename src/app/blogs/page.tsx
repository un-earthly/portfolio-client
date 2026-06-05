import type { Metadata } from "next";
import Link from "next/link";
import { getAllBlogs } from "@/lib/blogs";
import { ArrowRight, Clock, ArrowUpRight } from "lucide-react";
import BlogGrid from "@/components/BlogGrid";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Technical writing by MD Alamin on distributed systems, legacy modernisation, AI agents, TypeScript architecture, and engineering career strategy.",
  alternates: { canonical: "https://alamin-md.xyz/blogs" },
  openGraph: {
    title: "Blog | MD Alamin",
    description:
      "Deep technical writing on distributed systems, BLE mesh, AI agents, and engineering career strategy.",
    url: "https://alamin-md.xyz/blogs",
  },
};

function FeaturedPost({ blog }: { blog: ReturnType<typeof getAllBlogs>[number] }) {
  return (
    <Link href={`/blogs/${blog.slug}`} className="group block mb-8">
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-linear-to-br from-slate-900 via-slate-900 to-slate-800 hover:border-cyan-500/40 transition-all duration-300">
        {/* Decorative glows */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

        <div className="relative p-8 lg:p-10">
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 uppercase tracking-wide">
              {blog.type === "technical" ? "Technical" : "Hot Take"}
            </span>
            <span className="text-gray-500 text-sm">{blog.date}</span>
            <span className="text-slate-700">·</span>
            <span className="text-gray-500 text-sm flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {blog.readTime} min read
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-100 mb-4 leading-tight group-hover:text-cyan-50 transition-colors max-w-3xl">
            {blog.title}
          </h2>

          {/* Excerpt */}
          <p className="text-gray-400 mb-6 leading-relaxed max-w-2xl line-clamp-2 text-[0.95rem]">
            {blog.excerpt}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {blog.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-gray-600 border border-slate-700/80 px-2.5 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <span className="flex items-center gap-1.5 text-cyan-400 text-sm font-medium shrink-0 group-hover:gap-2.5 transition-all duration-200">
              Read article <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function BlogsPage() {
  const blogs = getAllBlogs();
  const [featured, ...rest] = blogs;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs font-semibold text-cyan-500 uppercase tracking-widest mb-1">
            Writing
          </p>
          <h1 className="text-2xl font-bold text-gray-100">The Blog</h1>
        </div>
        <span className="text-gray-600 text-sm">{blogs.length} articles</span>
      </div>

      {/* Featured hero post */}
      {featured && <FeaturedPost blog={featured} />}

      {/* Filterable grid of remaining posts */}
      <BlogGrid blogs={rest} />
    </div>
  );
}
