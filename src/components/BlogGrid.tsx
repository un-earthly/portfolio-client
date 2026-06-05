"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { getAllBlogs } from "@/lib/blogs";

type Blog = ReturnType<typeof getAllBlogs>[number];

const FILTERS = [
  { key: "all", label: "All" },
  { key: "technical", label: "Technical" },
  { key: "hot-take", label: "Hot Takes" },
] as const;

function BlogCard({ blog }: { blog: Blog }) {
  const isHotTake = blog.type === "hot-take";
  return (
    <Link href={`/blogs/${blog.slug}`} className="group block h-full">
      <div className="h-full rounded-xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/70 transition-all duration-200 p-5 flex flex-col">
        {/* Top meta */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide",
              isHotTake
                ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
            )}
          >
            {isHotTake ? "Hot Take" : "Technical"}
          </span>
          <span className="text-gray-600 text-xs ml-auto">{blog.date}</span>
        </div>

        {/* Title */}
        <h3 className="text-gray-100 font-semibold text-sm leading-snug mb-2 group-hover:text-cyan-100 transition-colors flex-1">
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-500 text-xs line-clamp-2 mb-4 leading-relaxed">
          {blog.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-gray-600 text-xs flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {blog.readTime} min
          </span>
          <ArrowUpRight className="h-4 w-4 text-gray-700 group-hover:text-cyan-400 transition-colors" />
        </div>
      </div>
    </Link>
  );
}

export default function BlogGrid({ blogs }: { blogs: Blog[] }) {
  const [filter, setFilter] = useState<"all" | "technical" | "hot-take">("all");

  const filtered =
    filter === "all" ? blogs : blogs.filter((b) => b.type === filter);

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-6">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150",
              filter === key
                ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/40"
                : "text-gray-500 border-slate-800 hover:border-slate-700 hover:text-gray-300 bg-transparent"
            )}
          >
            {label}
          </button>
        ))}
        <span className="ml-auto text-gray-600 text-xs">{filtered.length} posts</span>
      </div>

      {/* Card grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((blog) => (
          <BlogCard key={blog.slug} blog={blog} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-600 py-16 text-sm">No posts yet.</p>
      )}
    </div>
  );
}
