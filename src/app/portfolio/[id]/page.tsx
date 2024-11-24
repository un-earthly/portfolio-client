'use client'
import React from 'react';
import {
    ArrowLeft,
    ExternalLink,
    Github,
    CheckCircle,
    MessageSquare,
    Eye,
    Target,
    Lightbulb
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { projectsDetails } from '@/mock-data';
import { useParams } from 'next/navigation';

const CaseStudyPage = () => {
    const { id } = useParams();
    const project: any = projectsDetails.find((p) => p.id === id) || {};

    if (!project.id) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-100 mb-4">Project Not Found</h1>
                    <Link href="/portfolio">
                        <Button variant="outline" className="border-cyan-500/20 text-cyan-400">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Portfolio
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const {
        title = '',
        subtitle = '',
        thumbnail = '',
        href,
        metrics = {},
        overview = '',
        challenges = [],
        solutions = [],
        techStack = {},
        keyFeatures = [],
        developmentPhases = [],
        responsibilities = [],
        results = []
    } = project;

    return (
        <div>
            <div className="relative h-[500px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950" />
                {thumbnail && <img src={thumbnail} alt={title} className="w-full h-full object-cover" />}
                <div className="absolute inset-0 bg-slate-950/70" />

                <div className="absolute inset-0 flex items-center">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <Link href="/portfolio" className="inline-flex items-center text-gray-400 hover:text-cyan-400 transition-colors mb-8">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Projects
                            </Link>

                            <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">{title}</h1>
                            {subtitle && <p className="text-xl text-gray-300 mb-8">{subtitle}</p>}
                            {href && (
                                <div className="flex flex-wrap gap-4">
                                    <Link target='_blank' href={href}>
                                        <Button className="bg-cyan-500 hover:bg-cyan-600 text-white transition-colors">
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            View Live Project
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    {Object.keys(metrics).length > 0 && (
                        <Card className="relative overflow-hidden bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 mb-16 transform hover:scale-[1.01] transition-transform">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/30 via-slate-900/30 to-blue-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <CardContent className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                                {Object.entries(metrics).map(([key, value]: any) => (
                                    <div key={key} className="text-center">
                                        <p className="text-2xl font-bold text-cyan-400 mb-1">{value}</p>
                                        <p className="text-gray-400 capitalize">{key.replace('_', ' ')}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {overview && (
                        <section className="mb-16">
                            <h2 className="text-2xl font-bold text-gray-100 mb-6">Project Overview</h2>
                            <div className="prose prose-invert max-w-none">
                                <p className="text-gray-300 leading-relaxed">{overview}</p>
                            </div>
                        </section>
                    )}

                    {(challenges?.length > 0 || solutions?.length > 0) && (
                        <section className="mb-16">
                            {challenges?.length > 0 && (
                                <>
                                    <h2 className="text-2xl font-bold text-gray-100 mb-6">Key Challenges</h2>
                                    <div className="grid gap-6 mb-12">
                                        {challenges.map((challenge: any, index: any) => (
                                            <Card key={index} className="bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300">
                                                <CardContent className="p-6">
                                                    <div className="flex items-start gap-4">
                                                        <div className="p-2 bg-cyan-500/10 rounded-lg">
                                                            <challenge.icon className="h-5 w-5 text-cyan-400" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-100 mb-2">{challenge.title}</h3>
                                                            <p className="text-gray-400">{challenge.description}</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </>
                            )}

                            {solutions?.length > 0 && (
                                <>
                                    <h2 className="text-2xl font-bold text-gray-100 mb-6">Solutions Implemented</h2>
                                    <div className="grid gap-6">
                                        {solutions.map((solution: any, index: any) => (
                                            <Card key={index} className="group bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300">
                                                <CardContent className="p-6">
                                                    <div className="flex items-start gap-4">
                                                        <div className="p-2 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                                                            <solution.icon className="h-5 w-5 text-cyan-400" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-100 mb-2">{solution.title}</h3>
                                                            <p className="text-gray-400 mb-4">{solution.description}</p>
                                                            {solution.details?.length > 0 && (
                                                                <ul className="space-y-2">
                                                                    {solution.details.map((detail: any, idx: any) => (
                                                                        <li key={idx} className="flex items-start gap-2 text-gray-300">
                                                                            <CheckCircle className="h-4 w-4 text-cyan-400 shrink-0 mt-1" />
                                                                            <span>{detail}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </>
                            )}
                        </section>
                    )}

                    {Object.keys(techStack).length > 0 && (
                        <section className="mb-16">
                            <h2 className="text-2xl font-bold text-gray-100 mb-6">Technology Stack</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                {Object.entries(techStack).map(([category, technologies]: any) => (
                                    <Card key={category} className="bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800">
                                        <CardContent className="p-6">
                                            <h3 className="text-lg font-semibold text-gray-100 mb-4 capitalize">{category}</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {technologies.map((tech: any) => (
                                                    <span
                                                        key={tech}
                                                        className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-200 text-sm border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    )}

                    {developmentPhases?.length > 0 && (
                        <section className="mb-16">
                            <h2 className="text-2xl font-bold text-gray-100 mb-6">Development Process</h2>
                            <div className="relative">
                                <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-blue-500/50 to-cyan-500/50 hidden md:block" />

                                <div className="space-y-8">
                                    {developmentPhases.map((phase: any, index: any) => (
                                        <div key={index} className="relative ml-0 md:ml-16">
                                            <div className="absolute left-[-2rem] top-6 w-4 h-4 rounded-full bg-cyan-400 hidden md:block" />

                                            <Card className="bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300">
                                                <CardContent className="p-6">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h3 className="text-lg font-semibold text-gray-100">{phase.title}</h3>
                                                        <span className="text-cyan-400 text-sm">{phase.duration}</span>
                                                    </div>
                                                    {phase.activities?.length > 0 && (
                                                        <ul className="space-y-2">
                                                            {phase.activities.map((activity: any, idx: any) => (
                                                                <li key={idx} className="flex items-start gap-2 text-gray-300">
                                                                    <CheckCircle className="h-4 w-4 text-cyan-400 shrink-0 mt-1" />
                                                                    <span>{activity}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {responsibilities?.length > 0 && (
                        <section className="mb-16">
                            <h2 className="text-2xl font-bold text-gray-100 mb-6">Role & Responsibilities</h2>
                            <div className="space-y-6">
                                {responsibilities.map((position: any, index: any) => (
                                    <Card
                                        key={index}
                                        className="bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300"
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-cyan-500/10 rounded-lg">
                                                    <position.icon className="h-6 w-6 text-cyan-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-semibold text-gray-100 mb-4">
                                                        {position.role}
                                                    </h3>
                                                    {position.tasks?.length > 0 && (
                                                        <div className="grid gap-3">
                                                            {position.tasks.map((task: any, taskIndex: any) => (
                                                                <div
                                                                    key={taskIndex}
                                                                    className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-cyan-500/20 transition-colors"
                                                                >
                                                                    <CheckCircle className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                                                                    <span className="text-gray-300">{task}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    )}

                    {results?.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-gray-100 mb-6">Results & Impact</h2>
                            <div className="grid md:grid-cols-3 gap-6 mb-8">
                                {results.map((result: any, index: any) => (
                                    <Card key={index} className="bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300">
                                        <CardContent className="p-6 text-center">
                                            <div className="text-3xl font-bold text-cyan-400 mb-2">
                                                {result.value}
                                            </div>
                                            <div className="text-lg font-semibold text-gray-100 mb-2">
                                                {result.metric}
                                            </div>
                                            <p className="text-gray-400 text-sm">
                                                {result.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    )}
                    {keyFeatures?.length > 0 && (
                        <section className="mb-16">
                            <h2 className="text-2xl font-bold text-gray-100 mb-6">Key Features</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {keyFeatures.map((feature: any, index: any) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3 p-4 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-cyan-500/20 transition-colors"
                                    >
                                        <CheckCircle className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                                        <span className="text-gray-300">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <section>
                        <Card className="bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300">
                            <CardContent className="p-8">
                                <div className="max-w-3xl mx-auto text-center">
                                    <h2 className="text-2xl font-bold text-gray-100 mb-4">Let's Build Something Great Together</h2>
                                    <p className="text-gray-400 mb-8">
                                        Passionate about creating efficient, scalable, and user-centric web solutions using modern technologies
                                    </p>
                                    <div className="flex flex-wrap justify-center gap-4">
                                        <Link href="mailto:vijayalamin@gmail.com">
                                            <Button className="bg-cyan-500 hover:bg-cyan-600 text-white transition-colors">
                                                <MessageSquare className="h-4 w-4 mr-2" />
                                                Start a Conversation
                                            </Button>
                                        </Link>
                                        <Link href='/portfolio'>
                                            <Button variant="outline" className="border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300">
                                                <Eye className="h-4 w-4 mr-2" />
                                                Explore More Projects
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default CaseStudyPage;