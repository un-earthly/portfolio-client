'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Layers,
    Smartphone,
    Building2,
    Globe,
    LayoutGrid,
    Code2,
    Apple,
    Monitor,
    Cloud,
    ExternalLink,
} from 'lucide-react';
import { projects } from '@/mock-data';

const filterOptions = [
    { label: 'ALL PROJECTS', key: 'all', icon: LayoutGrid },
    { label: 'FULL STACK', key: 'Full Stack Application', icon: Layers },
    { label: 'MOBILE APPS', key: 'Web & Mobile Application', icon: Smartphone },
    { label: 'ENTERPRISE', key: 'Enterprise Application', icon: Building2 },
    { label: 'WEB & CLOUD', key: 'cloud', icon: Cloud },
    { label: 'FRONTEND', key: 'frontend', icon: Monitor },
];

const techIconMap: Record<string, React.ElementType> = {
    'React': Code2,
    'Next.js': Globe,
    'React Native': Smartphone,
    'Node.js': Layers,
    'Nuxt.js': Globe,
    'Vue.js': Globe,
    'Vanilla JS': Code2,
};

const categoryTechMap: Record<string, string> = {
    'Full Stack Application': 'Full Stack Application',
    'Web & Mobile Application': 'Web & Mobile Application',
    'Enterprise Application': 'Enterprise Application',
};

function getProjectTechIcons(technologies: string[]) {
    const icons: React.ElementType[] = [];
    const seen = new Set<React.ElementType>();
    for (const tech of technologies) {
        const Icon = techIconMap[tech];
        if (Icon && !seen.has(Icon)) {
            icons.push(Icon);
            seen.add(Icon);
        }
        if (icons.length >= 4) break;
    }
    if (icons.length === 0) icons.push(Code2);
    return icons;
}

function matchesFilter(project: (typeof projects)[number], filter: string) {
    if (filter === 'all') return true;
    if (filter === 'cloud') {
        return project.technologies.some(t =>
            ['AWS', 'Docker', 'Node.js', 'Cloudflare', 'Supabase'].some(k => t.includes(k))
        );
    }
    if (filter === 'frontend') {
        return project.technologies.some(t =>
            ['React', 'Next.js', 'Vue', 'Nuxt', 'Vanilla JS', 'Tailwind'].some(k => t.includes(k))
        );
    }
    return project.category === filter;
}

const cardSizes = [
    'col-span-2 row-span-2',
    'col-span-1 row-span-2',
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
];

export default function PortfolioGrid() {
    const [activeFilter, setActiveFilter] = useState('all');

    const filtered = projects.filter(p => matchesFilter(p, activeFilter));

    return (
        <div className="w-full">
            {/* Page header */}
            <div className="border-b border-white/5 px-6 lg:px-10 py-10">
                <p className="text-xs text-cyan-400 tracking-[0.2em] uppercase mb-3">Work</p>
                <h1 className="text-4xl lg:text-6xl font-black tracking-tighter text-white">
                    Selected Projects.
                </h1>
            </div>

            {/* Filter Panel */}
            <div className="bg-[#111] border border-white/5 rounded-sm mb-0">
                <div className="grid grid-cols-3 sm:grid-cols-3 divide-x divide-y divide-white/5">
                    {filterOptions.map(({ label, key, icon: Icon }) => {
                        const active = activeFilter === key;
                        return (
                            <button
                                key={key}
                                onClick={() => setActiveFilter(key)}
                                className={`flex items-center gap-2 px-4 py-3 text-left transition-colors duration-200 ${
                                    active
                                        ? 'text-red-400 bg-red-500/5'
                                        : 'text-gray-500 hover:text-gray-300 hover:bg-white/3'
                                }`}
                            >
                                <Icon
                                    className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-red-400' : 'text-gray-600'}`}
                                    strokeWidth={1.5}
                                />
                                <span className="text-[10px] tracking-widest font-medium uppercase">
                                    {label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Project Grid */}
            <div
                className="grid gap-px bg-[#0a0a0a]"
                style={{
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gridAutoRows: '220px',
                }}
            >
                {filtered.length === 0 && (
                    <div className="col-span-3 flex items-center justify-center h-64 text-gray-600 text-sm tracking-widest uppercase">
                        No projects in this category
                    </div>
                )}
                {filtered.map((project, i) => {
                    const icons = getProjectTechIcons(project.technologies);
                    const sizeClass = cardSizes[i % cardSizes.length];

                    return (
                        <Link
                            key={project.id}
                            href={`/portfolio/${project.id}`}
                            className={`group relative overflow-hidden block ${sizeClass}`}
                        >
                            {/* Background image */}
                            <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />

                            {/* Dark overlay */}
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />

                            {/* Gradient at bottom */}
                            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col justify-end p-5">
                                {/* Project title */}
                                <h3 className="text-white font-bold tracking-tight leading-tight mb-3 drop-shadow-lg"
                                    style={{ fontSize: 'clamp(0.85rem, 2vw, 1.25rem)' }}
                                >
                                    {project.title}
                                </h3>

                                {/* Tech icons row */}
                                <div className="flex items-center gap-2">
                                    {icons.map((Icon, idx) => (
                                        <div
                                            key={idx}
                                            className="w-5 h-5 text-white/60 group-hover:text-white/90 transition-colors duration-300"
                                        >
                                            <Icon className="w-full h-full" strokeWidth={1.5} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Hover: live link */}
                            {project.liveUrl && project.liveUrl !== '#' && (
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={e => e.stopPropagation()}
                                        className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-[10px] tracking-widest uppercase px-2.5 py-1.5 rounded-sm hover:bg-white/20 transition-colors"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                        Live
                                    </a>
                                </div>
                            )}

                            {/* Category badge */}
                            <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="text-[9px] tracking-[0.15em] uppercase text-white/50 font-medium">
                                    {project.category}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
