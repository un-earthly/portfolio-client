import React from 'react'
import { Card, CardContent } from './ui/card'
import Link from 'next/link'
import { ArrowUpRight, ExternalLink } from 'lucide-react'
import { truncateText } from '@/lib/utils'
import { Button } from './ui/button'

export default function ProjectCard({ project }: any) {
    return (
        <Card

            key={project.id}
            className="group relative bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300 transform hover:-translate-y-1"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/30 via-slate-900/30 to-blue-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <Link href={`/portfolio/${project.id}`} className="absolute inset-0 z-10">
                <span className="sr-only">View case study for {project.title}</span>
            </Link>

            <CardContent className="relative z-10 p-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative rounded-lg">
                        <img
                            src={project.image}
                            alt={`${project.title} preview`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="relative">
                        <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-bold text-gray-100">{project.title}</h3>
                            <Link href={'/portfolio/' + project.id}>
                                <div className="p-2 rounded-full bg-slate-800/50 group-hover:bg-cyan-500/20 transition-colors">
                                    <ArrowUpRight className="h-5 w-5 text-cyan-400" />
                                </div>
                            </Link>
                        </div>

                        <p className="text-gray-400 mb-4">
                            {truncateText(project.description, 250)}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {project.technologies.map((tech: any) => (
                                <span
                                    key={tech}
                                    className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-200 text-sm"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>

                        <div className="flex gap-4 relative z-20">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-cyan-500 hover:text-cyan-300  group-hover:border-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/40"
                            >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View Live
                            </Button>

                        </div>
                    </div>
                </div>

                <Link href={'/portfolio/' + project.id}>
                    <div className="absolute bottom-4 right-4 flex items-center gap-2 text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span>View Case Study</span>
                        <ArrowUpRight className="h-4 w-4" />
                    </div>
                </Link>
            </CardContent>

            <div className="absolute inset-0 border border-cyan-500/0 group-hover:border-cyan-500/20 rounded-lg transition-colors duration-300" />
        </Card>
    )
}
