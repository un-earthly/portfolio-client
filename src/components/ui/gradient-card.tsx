import { Card } from "./card"
import { cn } from "@/lib/utils"

interface GradientCardProps extends React.ComponentProps<typeof Card> {
    children: React.ReactNode
    gradientFrom?: string
    gradientVia?: string
    gradientTo?: string
}

export function GradientCard({
    children,
    className,
    gradientFrom = "cyan-950/30",
    gradientVia = "slate-900/30",
    gradientTo = "blue-950/30",
    ...props
}: GradientCardProps) {
    return (
        <Card
            className={cn(
                "group relative bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300",
                className
            )}
            {...props}
        >
            <div className={`absolute inset-0 bg-gradient-to-r from-${gradientFrom} via-${gradientVia} to-${gradientTo} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="absolute inset-0 border border-cyan-500/0 group-hover:border-cyan-500/20 rounded-lg transition-colors duration-300" />
            <div className="relative z-10">
                {children}
            </div>
        </Card>
    )
} 