'use client'
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import React, { memo } from 'react'
import { ArrowUpRight, CheckCircle, Cpu, Wrench, Rocket, Star } from 'lucide-react'
import Link from "next/link";
import { achievements, developmentProcess, experiences, projects, skills } from '@/mock-data'
import ExperienceCard from "@/components/ExperinceCard";
import ProjectCard from "@/components/ProjectCard";

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
    <div className="rounded-2xl overflow-hidden border border-slate-800 mb-10 grid md:grid-cols-2 min-h-[200px]">
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

/* ── Process step ───────────────────────────────────────────── */
const ProcessStep = memo(({ step, index }: { step: typeof developmentProcess[0]; index: number }) => (
  <div className="relative pl-10">
    <div className="absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
      {index + 1}
    </div>
    <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-5 hover:border-slate-700 transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <step.icon className="h-4 w-4 text-cyan-400" />
        <h3 className="text-sm font-bold text-gray-100">{step.title}</h3>
      </div>
      <p className="text-gray-500 text-xs mb-3 leading-relaxed">{step.description}</p>
      <ul className="grid sm:grid-cols-2 gap-1.5">
        {step.details.map((d, i) => (
          <li key={i} className="flex items-start gap-1.5 text-gray-400 text-xs">
            <CheckCircle className="h-3.5 w-3.5 text-cyan-500/60 shrink-0 mt-0.5" />
            {d}
          </li>
        ))}
      </ul>
    </div>
  </div>
))
ProcessStep.displayName = 'ProcessStep'

/* ── Page ───────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="max-w-4xl mx-auto space-y-10">

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
        <div className="grid gap-6">
          {projects.slice(0, 2).map((project, i) => (
            <ProjectCard key={i} project={project} />
          ))}
        </div>
      </section>

      {/* Process */}
      <section>
        <SectionHeader title="How I Work" />
        <div className="space-y-4">
          {developmentProcess.map((step, i) => (
            <ProcessStep key={i} step={step} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
