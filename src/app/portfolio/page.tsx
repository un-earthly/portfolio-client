import React from 'react';
import {
    ArrowUpRight,
    Users,
    Clock,
    Gauge,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { categories, projects } from '@/mock-data';

export default function ProjectsPage() {
    return (
        <div className="min-h-screen py-16">
            <div className="container mx-auto px-4">
                {/* <div className="max-w-6xl mx-auto"> */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-gray-100 mb-4">Featured Projects</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Exploring the intersection of design and technology through carefully crafted solutions.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category}
                            className="px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-200 text-sm border border-cyan-500/20 hover:bg-cyan-500/20 transition-all duration-300 hover:scale-105"
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="grid gap-8">
                    {projects.map((project) => (
                        <Link href={`/portfolio/${project.id}`} key={project.id}>
                            <Card className="group relative overflow-hidden bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10">
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/30 via-slate-900/30 to-blue-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <CardContent className="relative z-10 p-6">
                                    <div className="grid md:grid-cols-2 gap-6 items-center">
                                        <div className="relative overflow-hidden rounded-lg">
                                            <img
                                                src={project.image}
                                                alt={project.title}
                                                className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>

                                        <div>
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-100 group-hover:text-cyan-200 transition-colors duration-300">
                                                        {project.title}
                                                    </h3>
                                                    <p className="text-gray-400 text-sm mb-2">{project.category}</p>
                                                </div>
                                                <div className="p-2 rounded-full bg-slate-800/50 group-hover:bg-cyan-500/20 transition-colors">
                                                    <ArrowUpRight className="h-5 w-5 text-cyan-400 transform group-hover:rotate-45 transition-transform duration-300" />
                                                </div>
                                            </div>

                                            <p className="text-gray-300 mb-4">{project.description}</p>

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {project.technologies.map((tech) => (
                                                    <span
                                                        key={tech}
                                                        className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-200 text-sm"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>

                                            {project.metrics && (<div className="grid grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <div className="flex items-center gap-1 text-cyan-400 mb-1">
                                                        <Users className="h-4 w-4" />
                                                        <span>Users</span>
                                                    </div>
                                                    <p className="text-gray-300">{project.metrics.users}</p>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-1 text-cyan-400 mb-1">
                                                        <Gauge className="h-4 w-4" />
                                                        <span>Performance</span>
                                                    </div>
                                                    <p className="text-gray-300">{project.metrics.performance}</p>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-1 text-cyan-400 mb-1">
                                                        <Clock className="h-4 w-4" />
                                                        <span>Timeline</span>
                                                    </div>
                                                    <p className="text-gray-300">{project.timeline}</p>
                                                </div>
                                            </div>)}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
                {/* </div> */}
            </div>
        </div>
    );
};