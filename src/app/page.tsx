'use client'
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import React, { memo } from 'react'
import { ArrowUpRight, Cpu, Wrench, Rocket, Star } from 'lucide-react'
import Link from "next/link";
import { achievements, experiences, projects, skills, socialLinks, yearsOfExperince } from '@/mock-data'
import ExperienceCard from "@/components/ExperinceCard";
import { HowIWork } from "@/components/HowIWork";

/* ── Hero node graph ────────────────────────────────────────── */
const _hn = [
  { x: 120, y: 100 }, { x: 300, y: 55 },  { x: 480, y: 155 },
  { x: 650, y: 75 },  { x: 820, y: 165 }, { x: 980, y: 88 },
  { x: 1120, y: 148 },{ x: 195, y: 285 }, { x: 395, y: 350 },
  { x: 575, y: 288 }, { x: 748, y: 378 }, { x: 900, y: 282 },
  { x: 1052, y: 352 },
]
const _he = [
  [0,1],[1,2],[2,3],[3,4],[4,5],[5,6],
  [0,7],[7,8],[8,9],[9,10],[10,11],[11,12],
  [1,7],[2,9],[3,9],[4,11],[5,12],[2,8],[4,10],[6,12],
]
function HeroNodeGraph() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 460"
      className="absolute inset-0 w-full h-full text-white"
      style={{ opacity: 0.08 }}
      preserveAspectRatio="xMidYMid slice"
    >
      {_he.map((edge, i) => (
        <line
          key={i}
          x1={_hn[edge[0]].x} y1={_hn[edge[0]].y}
          x2={_hn[edge[1]].x} y2={_hn[edge[1]].y}
          stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.7"
        />
      ))}
      {_hn.map((n, i) => (
        <circle
          key={i}
          cx={n.x} cy={n.y} r="4"
          fill="none" stroke="currentColor" strokeWidth="1.2"
          className="hero-node"
          style={{ animationDelay: `${((i * 0.28) % 3).toFixed(2)}s` }}
        />
      ))}
      {/* Accent nodes — cyan highlight on two key junctions */}
      <circle cx={480} cy={155} r="7" fill="none" stroke="#22d3ee" strokeWidth="1"
        strokeOpacity="0.55" className="hero-node" style={{ animationDelay: '0.5s' }} />
      <circle cx={820} cy={165} r="5.5" fill="none" stroke="#22d3ee" strokeWidth="1"
        strokeOpacity="0.4" className="hero-node" style={{ animationDelay: '1.2s' }} />
    </svg>
  )
}

/* ── Hero ───────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden border-b border-white/5">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
      {/* Cyan glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      {/* Node graph */}
      <HeroNodeGraph />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-16 py-24">

        {/* Eyebrow label */}
        <p
          className="font-mono tracking-[0.2em] uppercase text-gray-500 mb-8"
          style={{ fontSize: 'clamp(0.6rem, 1vw, 0.75rem)' }}
        >
          Full Stack Engineer — Legacy Modernization
        </p>

        {/* Massive display heading */}
        <h1
          className="font-black uppercase tracking-tight mb-10"
          style={{ lineHeight: 0.88 }}
        >
          <span
            className="block text-white"
            style={{ fontSize: 'clamp(4rem, 10vw, 9rem)' }}
          >
            I FIX
          </span>
          {/* "BROKEN" — outline-only with cyan stroke; the visual anchor of the page */}
          <span
            className="block"
            style={{
              fontSize: 'clamp(4rem, 10vw, 9rem)',
              color: 'transparent',
              WebkitTextStroke: '2px #22d3ee',
            }}
          >
            BROKEN
          </span>
          <span
            className="block text-white"
            style={{ fontSize: 'clamp(4rem, 10vw, 9rem)' }}
          >
            SYSTEMS.
          </span>
        </h1>

        {/* Punchy single-sentence body */}
        <p
          className="text-gray-400 max-w-105 leading-relaxed mb-10"
          style={{ fontSize: 'clamp(1rem, 1.6vw, 1.2rem)' }}
        >
          Product companies hire me to modernize slow legacy stacks — without
          downtime, without big rewrites.
        </p>

        {/* CTA row */}
        <div className="flex flex-wrap items-center gap-4 mb-20">
          <Link
            href="/contact"
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-bold tracking-widest uppercase px-7 py-3.5 rounded-full transition-colors duration-200"
          >
            Let&apos;s Talk
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <Link
            href="/portfolio"
            className="flex items-center gap-2 border border-white/10 hover:border-cyan-500/40 text-gray-300 hover:text-white text-sm font-medium tracking-wide px-7 py-3.5 rounded-full transition-colors duration-200"
          >
            See Work
          </Link>
          <div className="flex items-center gap-3 ml-2">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-gray-500 hover:text-cyan-400 hover:border-cyan-400/40 transition-colors"
                aria-label={label}
              >
                <Icon className="w-4 h-4" />
              </Link>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-x-10 gap-y-5 border-t border-white/5 pt-8">
          {[
            { value: `${yearsOfExperince}+`, label: 'Years Experience', pct: 0.65 },
            { value: '20+', label: 'Projects Delivered', pct: 0.50 },
            { value: '95%', label: 'Client Satisfaction', pct: 0.95 },
            { value: '10K+', label: 'Concurrent Users Handled', pct: 0.75 },
          ].map(({ value, label, pct }) => {
            const r = 14
            const circ = 2 * Math.PI * r
            return (
              <div key={label} className="flex items-center gap-3">
                <svg
                  width="36" height="36" viewBox="0 0 36 36"
                  aria-hidden="true"
                  className="shrink-0 -rotate-90"
                >
                  <circle cx="18" cy="18" r={r} fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.1" />
                  <circle
                    cx="18" cy="18" r={r} fill="none"
                    stroke="#22d3ee" strokeWidth="1.5"
                    strokeDasharray={`${(pct * circ).toFixed(1)} ${circ.toFixed(1)}`}
                    strokeLinecap="round" strokeOpacity="0.55"
                  />
                </svg>
                <div>
                  <div className="text-3xl font-black text-white tracking-tight">{value}</div>
                  <div className="text-xs text-gray-500 tracking-widest uppercase mt-1">{label}</div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

/* ── small helpers ─────────────────────────────────────────── */
const SkillBadge = memo(({ skill, accent }: { skill: string; accent?: boolean }) => (
  <Badge
    variant={accent ? "default" : "outline"}
    className={accent
      ? "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-200 border-cyan-500/20 transition-colors"
      : "border-slate-700 hover:border-cyan-500/30 hover:bg-cyan-500/5 text-gray-400 transition-colors"}
  >
    {skill}
  </Badge>
))
SkillBadge.displayName = 'SkillBadge'

/* ── Featured / hero card (ProAgenda split style) ───────────── */
function HeroCard() {
  const top = achievements[0]
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-800 mb-10 grid md:grid-cols-2 min-h-50">
      {/* Left — dark, text */}
      <div className="bg-linear-to-br from-slate-900 to-slate-950 p-8 flex flex-col justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-4">
            <Star className="h-3 w-3" /> Available for work
          </span>
          <h2 className="text-xl font-bold text-gray-100 leading-snug mb-3">
            Building systems that scale—<br />
            <span className="text-cyan-400">without breaking under load.</span>
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            5+ years turning complex problems into clean, maintainable software.
            Open to remote backend, full-stack, and leadership roles.
          </p>
        </div>
        <Link
          href="/contact"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors group"
        >
          Start a conversation
          <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* Right — accent, stats grid */}
      <div className="bg-linear-to-br from-cyan-950/40 to-slate-900 p-8 flex flex-col justify-center gap-4 border-l border-slate-800">
        <div className="grid grid-cols-2 gap-4">
          {achievements.slice(0, 4).map((a, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/20 transition-colors">
              <a.icon className="h-4 w-4 text-cyan-400 mb-2" />
              <p className="text-gray-100 text-xs font-semibold leading-snug">{a.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Skill pill group ───────────────────────────────────────── */
const SkillGroup = memo(({ title, icon: Icon, items, accent }: {
  title: string; icon: typeof Cpu; items: string[]; accent?: boolean
}) => (
  <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-5 hover:border-slate-700 transition-colors">
    <div className="flex items-center gap-2 mb-3">
      <div className="p-1.5 bg-slate-800 rounded-md">
        <Icon className="h-4 w-4 text-cyan-400" />
      </div>
      <h3 className="text-sm font-semibold text-gray-200">{title}</h3>
    </div>
    <div className="flex flex-wrap gap-1.5">
      {items.map((s) => <SkillBadge key={s} skill={s} accent={accent} />)}
    </div>
  </div>
))
SkillGroup.displayName = 'SkillGroup'

/* ── Featured project card ──────────────────────────────────── */
function FeaturedProjectCard({
  project,
  tall,
}: {
  project: { id: string; title: string; image: string; category: string; technologies: string[] }
  tall?: boolean
}) {
  return (
    <Link
      href={`/portfolio/${project.id}`}
      className={[
        'group relative overflow-hidden rounded-xl block border border-white/5',
        tall ? 'h-72' : 'h-52',
      ].join(' ')}
    >
      <img
        src={project.image}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/45 group-hover:bg-black/25 transition-colors duration-500" />
      <div className="absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-end p-5">
        <span className="text-[9px] tracking-[0.18em] uppercase text-cyan-400/60 font-mono mb-1.5">
          {project.category}
        </span>
        <h3
          className="text-white font-bold tracking-tight leading-tight mb-2.5"
          style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)' }}
        >
          {project.title}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 3).map((t) => (
            <span
              key={t}
              className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-white/60 font-mono border border-white/10"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm border border-white/15 text-white/80 text-[9px] tracking-widest uppercase px-2.5 py-1.5 rounded-sm">
          <ArrowUpRight className="w-3 h-3" />
          Case Study
        </span>
      </div>
    </Link>
  )
}

/* ── Page ───────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div>
      <Hero />

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8 space-y-8">

      {/* Hero split card */}
      <HeroCard />

      {/* Skills */}
      <section>
        <SectionHeader title="Technical Expertise" />
        <div className="grid gap-4">
          <SkillGroup title="Core Stack" icon={Cpu} items={skills.specialized} accent />
          <div className="grid sm:grid-cols-2 gap-4">
            <SkillGroup title="Infrastructure & Tooling" icon={Wrench} items={skills.comfortable} />
            <SkillGroup title="Tools & Platforms" icon={Rocket} items={skills.tools} />
          </div>
        </div>
      </section>

      {/* Experience */}
      <section>
        <SectionHeader title="Professional Experience" href="/experience" />
        <div className="grid gap-6">
          {experiences.slice(0, 2).map((company, i) => (
            <ExperienceCard company={company} key={i} />
          ))}
        </div>
      </section>

      {/* Projects */}
      <section>
        <SectionHeader title="Featured Projects" href="/portfolio" />
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <FeaturedProjectCard project={projects[0]} tall />
          </div>
          <FeaturedProjectCard project={projects[1]} />
          <FeaturedProjectCard project={projects[2]} />
        </div>
      </section>


      </div>

      <HowIWork />
    </div>
  );
}
