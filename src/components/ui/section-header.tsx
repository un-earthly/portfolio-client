import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

interface SectionHeaderProps {
    title: string
    href?: string
    eyebrow?: string
}

// One consistent header shape across the site: a small cyan mono eyebrow with a
// rule, a bold display title, and an optional "view all" link on the right.
export function SectionHeader({ title, href, eyebrow = "Section" }: SectionHeaderProps) {
    return (
        <div className="mb-8 flex items-end justify-between gap-4">
            <div>
                <p className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-500/70">
                    <span className="inline-block h-px w-6 bg-cyan-400/50" />
                    {eyebrow}
                </p>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                    {title}
                </h2>
            </div>
            {href && (
                <Link
                    href={href}
                    className="group inline-flex shrink-0 items-center gap-1 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                    View all
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
            )}
        </div>
    )
}
