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
import { project } from '@/mock-data';

const CaseStudyPage = () => {

    return (
        <div>
            <div className="relative h-[500px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950" />
                <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/70" />

                <div className="absolute inset-0 flex items-center">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <Link
                                href="/portfolio"
                                className="inline-flex items-center text-gray-400 hover:text-cyan-400 transition-colors mb-8"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Projects
                            </Link>

                            <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">
                                {project.title}
                            </h1>
                            <p className="text-xl text-gray-300 mb-8">
                                {project.subtitle}
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Button className="bg-cyan-500 hover:bg-cyan-600 text-white transition-colors">
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    View Live Project
                                </Button>
                                <Button variant="outline" className="border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10">
                                    <Github className="h-4 w-4 mr-2" />
                                    View Source Code
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <Card className="relative overflow-hidden bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 mb-16 transform hover:scale-[1.01] transition-transform">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/30 via-slate-900/30 to-blue-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <CardContent className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                            {Object.entries(project.metrics).map(([key, value]) => (
                                <div key={key} className="text-center">
                                    <p className="text-2xl font-bold text-cyan-400 mb-1">{value}</p>
                                    <p className="text-gray-400 capitalize">{key.replace('_', ' ')}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-gray-100 mb-6">Project Overview</h2>
                        <div className="prose prose-invert max-w-none">
                            <p className="text-gray-300 leading-relaxed">
                                {project.overview}
                            </p>
                        </div>
                    </section>

                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-gray-100 mb-6">Key Challenges</h2>
                        <div className="grid gap-6 mb-12">
                            {project.challenges.map((challenge, index) => (
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

                        <h2 className="text-2xl font-bold text-gray-100 mb-6">Solutions Implemented</h2>
                        <div className="grid gap-6">
                            {project.solutions.map((solution, index) => (
                                <Card key={index} className="group bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                                                <solution.icon className="h-5 w-5 text-cyan-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-100 mb-2">{solution.title}</h3>
                                                <p className="text-gray-400 mb-4">{solution.description}</p>
                                                <ul className="space-y-2">
                                                    {solution.details.map((detail, idx) => (
                                                        <li key={idx} className="flex items-start gap-2 text-gray-300">
                                                            <CheckCircle className="h-4 w-4 text-cyan-400 shrink-0 mt-1" />
                                                            <span>{detail}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-gray-100 mb-6">Technology Stack</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            {Object.entries(project.techStack).map(([category, technologies]) => (
                                <Card key={category} className="bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800">
                                    <CardContent className="p-6">
                                        <h3 className="text-lg font-semibold text-gray-100 mb-4 capitalize">{category}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {technologies.map((tech) => (
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

                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-gray-100 mb-6">Development Process</h2>
                        <div className="relative">
                            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-blue-500/50 to-cyan-500/50 hidden md:block" />

                            <div className="space-y-8">
                                {project.developmentPhases.map((phase, index) => (
                                    <div key={index} className="relative ml-0 md:ml-16">
                                        <div className="absolute left-[-2rem] top-6 w-4 h-4 rounded-full bg-cyan-400 hidden md:block" />

                                        <Card className="bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-lg font-semibold text-gray-100">{phase.title}</h3>
                                                    <span className="text-cyan-400 text-sm">{phase.duration}</span>
                                                </div>
                                                <ul className="space-y-2">
                                                    {phase.activities.map((activity, idx) => (
                                                        <li key={idx} className="flex items-start gap-2 text-gray-300">
                                                            <CheckCircle className="h-4 w-4 text-cyan-400 shrink-0 mt-1" />
                                                            <span>{activity}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <h2 className="text-2xl font-bold text-gray-100 mb-6">Results & Impact</h2>
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        {project.results.map((result, index) => (
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

                    <CardContent className="p-8 text-center">
                        <div className="max-w-3xl mx-auto">
                            <div className="text-cyan-400 mb-6">
                                <svg
                                    className="h-8 w-8 mx-auto"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                </svg>
                            </div>
                            <blockquote className="text-xl text-gray-300 italic mb-6">
                                {project.testimonial.quote}
                            </blockquote>
                            <div className="text-gray-100 font-semibold">
                                {project.testimonial.author}
                            </div>
                            <div className="text-gray-400 text-sm">
                                {project.testimonial.role}
                            </div>
                        </div>
                    </CardContent>

                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-gray-100 mb-6">Key Features</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {project.keyFeatures.map((feature, index) => (
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

                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-gray-100 mb-6">Key Learnings</h2>
                        <Card className="bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800">
                            <CardContent className="p-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-cyan-400 mb-4">Technical Insights</h3>
                                        <ul className="space-y-3">
                                            <li className="flex items-start gap-2 text-gray-300">
                                                <Lightbulb className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                                                <span>Optimizing WebSocket connections for large-scale real-time updates</span>
                                            </li>
                                            <li className="flex items-start gap-2 text-gray-300">
                                                <Lightbulb className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                                                <span>Implementing efficient caching strategies for improved performance</span>
                                            </li>
                                            <li className="flex items-start gap-2 text-gray-300">
                                                <Lightbulb className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                                                <span>Managing microservices architecture in a production environment</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-cyan-400 mb-4">Project Management</h3>
                                        <ul className="space-y-3">
                                            <li className="flex items-start gap-2 text-gray-300">
                                                <Target className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                                                <span>Effective sprint planning and story point estimation</span>
                                            </li>
                                            <li className="flex items-start gap-2 text-gray-300">
                                                <Target className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                                                <span>Managing client expectations and feedback cycles</span>
                                            </li>
                                            <li className="flex items-start gap-2 text-gray-300">
                                                <Target className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                                                <span>Balancing feature development with technical debt</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-gray-100 mb-6">Future Roadmap</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                {
                                    phase: "Phase 1",
                                    title: "AI Integration",
                                    description: "Implementing AI-powered content recommendations and personalized learning paths"
                                },
                                {
                                    phase: "Phase 2",
                                    title: "Mobile App",
                                    description: "Developing native mobile applications for iOS and Android platforms"
                                },
                                {
                                    phase: "Phase 3",
                                    title: "Analytics Enhancement",
                                    description: "Advanced analytics dashboard with predictive learning insights"
                                }
                            ].map((item, index) => (
                                <Card key={index} className="bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300">
                                    <CardContent className="p-6">
                                        <div className="text-sm text-cyan-400 mb-2">{item.phase}</div>
                                        <h3 className="text-lg font-semibold text-gray-100 mb-2">{item.title}</h3>
                                        <p className="text-gray-400">{item.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    <section>
                        <Card className="bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300">
                            <CardContent className="p-8">
                                <div className="max-w-2xl mx-auto text-center">
                                    <h2 className="text-2xl font-bold text-gray-100 mb-4">Interested in Similar Solutions?</h2>
                                    <p className="text-gray-400 mb-6">
                                        Let's discuss how we can create a custom solution tailored to your needs.
                                    </p>
                                    <div className="flex flex-wrap justify-center gap-4">
                                        <Button className="bg-cyan-500 hover:bg-cyan-600 text-white transition-colors">
                                            <MessageSquare className="h-4 w-4 mr-2" />
                                            Schedule a Consultation
                                        </Button>
                                        <Button variant="outline" className="border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300">
                                            <Eye className="h-4 w-4 mr-2" />
                                            View More Projects
                                        </Button>
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