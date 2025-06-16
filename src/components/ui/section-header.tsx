import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

interface SectionHeaderProps {
    title: string
    href?: string
}

export function SectionHeader({ title, href }: SectionHeaderProps) {
    const Header = () => (
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-800/50 transition-all duration-300 cursor-pointer group">
            <h2 className="text-3xl text-white font-bold text-center group-hover:text-cyan-400 transition-colors">
                {title}
            </h2>
            {href && (
                <>
                    <ArrowUpRight className="h-6 w-6 text-cyan-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300 ease-out" />
                    <span className="sr-only">View all {title.toLowerCase()}</span>
                </>
            )}
        </div>
    )

    if (href) {
        return (
            <Link href={href} className="block w-fit mx-auto mb-4">
                <Header />
            </Link>
        )
    }

    return (
        <div className="block w-fit mx-auto mb-8">
            <Header />
        </div>
    )
} 