'use client'
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientCard } from "@/components/ui/gradient-card";
import { SectionHeader } from "@/components/ui/section-header";
import React, { memo } from 'react'
import { ArrowUpRight, CheckCircle, Cpu, Wrench } from 'lucide-react'
import Link from "next/link";
import { achievements, developmentProcess, experiences, projects, skills } from '@/mock-data'
import ExperienceCard from "@/components/ExperinceCard";
import ProjectCard from "@/components/ProjectCard";

const IconWrapper = memo(({ children }: { children: React.ReactNode }) => (
  <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-slate-700/50 transition-colors">
    {children}
  </div>
))
IconWrapper.displayName = 'IconWrapper'

const SkillBadge = memo(({ skill, variant = "default" }: { skill: string, variant?: "default" | "outline" }) => (
  <Badge
    variant={variant}
    className={variant === "default"
      ? "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-200 transition-colors"
      : "border-cyan-500/30 hover:bg-cyan-500/10 text-gray-300 transition-colors"
    }
  >
    {skill}
  </Badge>
))
SkillBadge.displayName = 'SkillBadge'

const Achievement = memo(({ achievement }: { achievement: typeof achievements[0] }) => (
  <GradientCard>
    <CardHeader className="relative z-10">
      <div className="flex items-center gap-3 mb-2">
        <IconWrapper>
          <achievement.icon className="h-5 w-5 text-cyan-400" />
        </IconWrapper>
        <h3 className="text-xl font-semibold text-gray-100">{achievement.title}</h3>
      </div>
    </CardHeader>
    <CardContent className="relative z-10">
      <p className="text-gray-300">{achievement.description}</p>
    </CardContent>
  </GradientCard>
))
Achievement.displayName = 'Achievement'

const SkillSection = memo(({ title, icon: Icon, skills, variant }: {
  title: string
  icon: typeof Cpu
  skills: string[]
  variant?: "default" | "outline"
}) => (
  <GradientCard>
    <CardHeader className="relative z-10">
      <div className="flex items-center gap-3">
        <IconWrapper>
          <Icon className="h-5 w-5 text-cyan-400" />
        </IconWrapper>
        <CardTitle className="text-gray-100">{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent className="relative z-10 flex flex-wrap gap-2">
      {skills.map((skill) => (
        <SkillBadge key={skill} skill={skill} variant={variant} />
      ))}
    </CardContent>
  </GradientCard>
))
SkillSection.displayName = 'SkillSection'

const ProcessStep = memo(({ step }: { step: typeof developmentProcess[0] }) => (
  <GradientCard className="ml-0 md:ml-16">
    <div className="absolute -left-2 top-6 w-4 h-4 rounded-full bg-cyan-400 hidden md:block" />
    <CardContent className="relative z-10 p-6">
      <div className="flex items-start gap-4">
        <IconWrapper>
          <step.icon className="h-6 w-6 text-cyan-400" />
        </IconWrapper>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2 text-gray-100">{step.title}</h3>
          <p className="text-gray-400 mb-4">{step.description}</p>
          <ul className="grid md:grid-cols-2 gap-2">
            {step.details.map((detail, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-300">
                <CheckCircle className="h-5 w-5 text-cyan-500/70 shrink-0 mt-0.5" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </CardContent>
  </GradientCard>
))
ProcessStep.displayName = 'ProcessStep'

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <section>
        <SectionHeader title="Key Achievements" />
        <div className="grid gap-8 md:grid-cols-2">
          {achievements.map((achievement, index) => (
            <Achievement key={index} achievement={achievement} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Technical Expertise" />
        <div className="grid gap-8">
          <SkillSection
            title="Core Technologies"
            icon={Cpu}
            skills={skills.specialized}
            variant="default"
          />
          <SkillSection
            title="Additional Competencies"
            icon={Wrench}
            skills={skills.comfortable}
            variant="outline"
          />
          <SkillSection
            title="Tools & Platforms"
            icon={Wrench}
            skills={skills.tools}
            variant="outline"
          />
        </div>
      </section>

      <section>
        <SectionHeader title="Professional Experience" href="/experience" />
        <div className="grid gap-8">
          {experiences.slice(0, 2).map((company, index) => (
            <ExperienceCard company={company} key={index} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Featured Projects" href="/portfolio" />
        <div className="grid gap-8">
          {projects.slice(0, 2).map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Development Process" />
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-blue-500/50 to-purple-500/50 hidden md:block" />
          <div className="space-y-8">
            {developmentProcess.map((step, index) => (
              <ProcessStep key={index} step={step} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
