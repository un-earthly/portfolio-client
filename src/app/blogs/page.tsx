import type { Metadata } from "next";
import Link from "next/link";
import { getAllBlogs } from "@/lib/blogs";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";
import { GradientCard } from "@/components/ui/gradient-card";
import { CardContent } from "@/components/ui/card";
import { ArrowUpRight, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Technical writing by MD Alamin on BLE mesh networking, legacy system migration, multi-agent AI, TypeScript architecture, and software engineering career strategy.",
  alternates: { canonical: "https://alamin-md.xyz/blogs" },
  openGraph: {
    title: "Blog | MD Alamin",
    description:
      "Deep technical writing on BLE mesh, legacy systems, AI agents, and engineering career strategy.",
    url: "https://alamin-md.xyz/blogs",
  },
};

type Blog = ReturnType<typeof getAllBlogs>[number];

function BlogCard({ blog }: { blog: Blog }) {
  return (
    <GradientCard>
      <CardContent className="relative z-10 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
              <span>{blog.date}</span>
              <span>·</span>
              <Clock className="h-3 w-3" />
              <span>{blog.readTime} min read</span>
            </div>
            <h2 className="text-base font-semibold text-gray-100 mb-2 leading-snug">
              {blog.title}
            </h2>
            <p className="text-gray-400 text-sm mb-3 leading-relaxed line-clamp-2">
              {blog.excerpt}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {blog.tags.slice(0, 4).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="border-cyan-500/30 text-gray-500 text-xs px-2 py-0"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <Link
            href={`/blogs/${blog.slug}`}
            className="shrink-0 p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 transition-colors"
            aria-label={`Read ${blog.title}`}
          >
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </GradientCard>
  );
}

export default function BlogsPage() {
  const blogs = getAllBlogs();
  const technical = blogs.filter((b) => b.type === "technical");
  const hotTakes = blogs.filter((b) => b.type === "hot-take");

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <section>
        <SectionHeader title="Technical Deep Dives" />
        <div className="grid gap-4">
          {technical.map((blog) => (
            <BlogCard key={blog.slug} blog={blog} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Hot Takes" />
        <div className="grid gap-4">
          {hotTakes.map((blog) => (
            <BlogCard key={blog.slug} blog={blog} />
          ))}
        </div>
      </section>
    </div>
  );
}
