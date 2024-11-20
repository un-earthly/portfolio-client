// 'use client'
// import axios from 'axios';
// import { useEffect, useState } from 'react';
// import { GET_PROJECT_LIST_URL } from '../utilities/urls';
// import SkeletonCard from '@/components/SkeletonCard';
// import Newcard from '@/components/Newcard';

// export default function Portfolio() {
//     const [loading, setLoading] = useState(true);
//     const [data, setData] = useState([]);

//     useEffect(() => {
//         async function fetchData() {
//             try {
//                 const res = await axios.get(GET_PROJECT_LIST_URL);
//                 console.log(res)
//                 setData(res.data.data);
//                 setLoading(false);
//             } catch (error) {
//                 console.error("Error fetching data", error);
//             }
//         }
//         fetchData();
//     }, []);
//     useEffect(() => {
//         if (data.length > 0) {
//             setLoading(false);
//         }
//     }, [data]);

//     return (
//         <div className="container grid lg:grid-cols-1 gap-8 mx-auto pb-40  ">

//             {
//                 loading ?
//                     [1, 2, 3, 4, 5, 6].map(e => <SkeletonCard key={e}></SkeletonCard>)
//                     :
//                     data.map((project: any) => {
//                         return (
//                             <Newcard
//                                 key={project._id}
//                                 project={project}
//                             />
//                         )
//                     })
//             }
//         </div>
//     )
// }


import React from 'react';
import {
    ArrowUpRight,
    ArrowLeft,
    ExternalLink,
    Github,
    LineChart,
    Users,
    Clock,
    Gauge,
    Laptop,
    Database,
    Shield,
    Code2,
    CheckCircle,
    MessageSquare,
    Eye
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Project Listing Page Component
export default function ProjectsPage() {
    const projects = [
        {
            id: 'lms-platform',
            title: 'Learning Management System',
            shortDesc: 'A comprehensive e-learning platform serving 3,000+ users with advanced analytics.',
            thumbnail: '/api/placeholder/600/400',
            category: 'Full Stack Application',
            timeline: '4 months',
            stack: ['Next.js', 'Node.js', 'PostgreSQL', 'AWS'],
            metrics: {
                users: '3,000+',
                satisfaction: '95%',
                performance: '99.9%'
            }
        },
        // Add more projects...
    ];

    const categories = ['All Projects', 'Full Stack', 'Mobile Apps', 'E-Commerce', 'Enterprise'];

    return (
        <div className="min-h-screen py-16">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl font-bold text-gray-100 mb-4">Featured Projects</h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Exploring the intersection of design and technology through carefully crafted solutions.
                        </p>
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {categories.map((category, index) => (
                            <button
                                key={index}
                                className="px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-200 text-sm border border-cyan-500/20 hover:bg-cyan-500/20 transition-all duration-300 hover:scale-105"
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Projects Grid */}
                    <div className="grid gap-8">
                        {projects.map((project) => (
                            <Link href={`/portfolio/${project.id}`} key={project.id}>
                                <Card className="group relative overflow-hidden bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10">
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/30 via-slate-900/30 to-blue-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <CardContent className="relative z-10 p-6">
                                        <div className="grid md:grid-cols-2 gap-6 items-center">
                                            {/* Project Image */}
                                            <div className="relative overflow-hidden rounded-lg">
                                                <img
                                                    src={project.thumbnail}
                                                    alt={project.title}
                                                    className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </div>

                                            {/* Project Info */}
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

                                                <p className="text-gray-300 mb-4">{project.shortDesc}</p>

                                                {/* Tech Stack */}
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {project.stack.map((tech) => (
                                                        <span
                                                            key={tech}
                                                            className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-200 text-sm"
                                                        >
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Metrics */}
                                                <div className="grid grid-cols-3 gap-4 text-sm">
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
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};