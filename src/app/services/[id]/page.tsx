import React from 'react';
import {
    Terminal,
    ArrowLeft,
    CheckCircle,
    Clock,
    Zap,
    LineChart,
    Code2,
    GitBranch,
    Layers,
    Database,
    Shield,
    MessageSquare,
    ExternalLink
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const ServiceDetail = () => {
    // Example data - In real app, this would come from your data source based on the service ID
    const service = {
        id: 'full-stack-dev',
        icon: Terminal,
        title: "Full Stack Development",
        description: "End-to-end web application development with modern technologies and best practices. From concept to deployment, I deliver scalable and maintainable solutions that drive business growth.",
        features: [
            {
                title: "Custom Web Applications",
                description: "Tailored solutions built with React, Next.js, and Node.js",
                icon: Code2
            },
            {
                title: "API Development",
                description: "RESTful and GraphQL APIs with robust authentication",
                icon: GitBranch
            },
            {
                title: "Database Architecture",
                description: "Optimized database design and query performance",
                icon: Database
            },
            {
                title: "System Architecture",
                description: "Scalable and maintainable system design",
                icon: Layers
            },
            {
                title: "Security Implementation",
                description: "Best practices for web security and data protection",
                icon: Shield
            }
        ],
        technologies: [
            "React", "Next.js", "Node.js", "TypeScript", "PostgreSQL",
            "MongoDB", "Redis", "Docker", "AWS", "GraphQL"
        ],
        process: [
            "Requirements Analysis",
            "System Architecture Design",
            "Database Schema Design",
            "API Development",
            "Frontend Implementation",
            "Testing & QA",
            "Deployment & Monitoring"
        ],
        projects: [
            {
                title: "E-Learning Platform",
                description: "A comprehensive LMS serving 3000+ users",
                metrics: "300% increase in user engagement"
            },
            {
                title: "Enterprise ERP System",
                description: "Custom ERP solution for manufacturing company",
                metrics: "50% reduction in processing time"
            }
        ]
    };

    return (
        <div className="min-h-screen py-16">
            
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <Link
                        href="/services"
                        className="inline-flex items-center text-gray-400 hover:text-cyan-400 transition-colors mb-8"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Services
                    </Link>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-cyan-500/10 rounded-lg">
                            <service.icon className="h-8 w-8 text-cyan-400" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-100">{service.title}</h1>
                    </div>

                    <p className="text-xl text-gray-400 mb-12">{service.description}</p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto space-y-16">
                    <section>
                        <h2 className="text-2xl font-bold mb-8 text-gray-100">Key Features</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {service.features.map((feature, index) => (
                                <Card key={index} className="bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-cyan-500/10 rounded-lg">
                                                <feature.icon className="h-5 w-5 text-cyan-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-100 mb-2">{feature.title}</h3>
                                                <p className="text-gray-400">{feature.description}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-8 text-gray-100">Technologies Used</h2>
                        <div className="flex flex-wrap gap-3">
                            {service.technologies.map((tech, index) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-200 text-sm border border-cyan-500/20"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-8 text-gray-100">Development Process</h2>
                        <div className="relative">
                            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-blue-500/50 to-cyan-500/50" />
                            <div className="space-y-6">
                                {service.process.map((step, index) => (
                                    <div key={index} className="flex items-center gap-6 ml-0">
                                        <div className="relative">
                                            <div className="w-3 h-3 rounded-full bg-cyan-400" />
                                        </div>
                                        <Card className="flex-1 bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800">
                                            <CardContent className="p-4">
                                                <p className="text-gray-300">{step}</p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-8 text-gray-100">Success Stories</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {service.projects.map((project, index) => (
                                <Card key={index} className="group bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300">
                                    <CardContent className="p-6">
                                        <h3 className="text-xl font-bold text-gray-100 mb-2">{project.title}</h3>
                                        <p className="text-gray-400 mb-4">{project.description}</p>
                                        <div className="flex items-center gap-2 text-cyan-400">
                                            <LineChart className="h-4 w-4" />
                                            <span className="text-sm">{project.metrics}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    <section>
                        <Card className="bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800">
                            <CardContent className="p-8">
                                <div className="max-w-2xl mx-auto text-center">
                                    <h2 className="text-2xl font-bold text-gray-100 mb-4">Ready to Get Started?</h2>
                                    <p className="text-gray-400 mb-8">
                                        Let's discuss your project requirements and create a solution that perfectly fits your needs.
                                    </p>
                                    <div className="flex flex-wrap justify-center gap-4">
                                        <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
                                            <MessageSquare className="h-4 w-4 mr-2" />
                                            Schedule Consultation
                                        </Button>
                                        <Button variant="outline" className="border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10">
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            View Portfolio
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

export default ServiceDetail;