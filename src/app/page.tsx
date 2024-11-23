'use client'
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from 'react'
import { Button, } from "@/components/ui/button"
import { ArrowUpRight, Briefcase, Building2, CheckCircle, Code2, Cpu, Database, ExternalLink, Globe, Laptop, Layout, Mail, MessageSquare, Microscope, Palette, PenTool, Repeat, Rocket, Search, Sparkles, Store, Trophy, Users, Wrench } from 'lucide-react'
import Link from "next/link";
import { achievements, developmentProcess, experiences, projects, skills, tags } from '@/mock-data'
export default function Home() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">Key Achievements</h2>
        <div className="grid gap-8 md:grid-cols-2">
          {achievements.map((achievement, index) => (
            <Card
              key={index}
              className="group relative bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-950/30 via-slate-900/30 to-indigo-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <CardHeader className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-slate-700/50 transition-colors">
                    <achievement.icon className="h-5 w-5 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-100">{achievement.title}</h3>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-gray-300">{achievement.description}</p>
              </CardContent>
              <div className="absolute inset-0 border border-blue-500/0 group-hover:border-blue-500/20 rounded-lg transition-colors duration-300" />
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">Technical Expertise</h2>
        <div className="grid gap-8">
          <Card className="group relative bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/30 via-slate-900/30 to-blue-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <CardHeader className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-slate-700/50 transition-colors">
                  <Cpu className="h-5 w-5 text-cyan-400" />
                </div>
                <CardTitle className="text-gray-100">Core Technologies</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="relative z-10 flex flex-wrap gap-2">
              {skills.specialized.map((skill) => (
                <Badge
                  key={skill}
                  variant="default"
                  className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-200 transition-colors"
                >
                  {skill}
                </Badge>
              ))}
            </CardContent>
            <div className="absolute inset-0 border border-cyan-500/0 group-hover:border-cyan-500/20 rounded-lg transition-colors duration-300" />
          </Card>

          <Card className="group relative bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/30 via-slate-900/30 to-blue-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <CardHeader className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-slate-700/50 transition-colors">
                  <Wrench className="h-5 w-5 text-cyan-400" />
                </div>
                <CardTitle className="text-gray-100">Additional Competencies</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="relative z-10 flex flex-wrap gap-2">
              {skills.comfortable.map((skill) => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="border-cyan-500/30 hover:bg-cyan-500/10 text-gray-300 transition-colors"
                >
                  {skill}
                </Badge>
              ))}
            </CardContent>
            <div className="absolute inset-0 border border-cyan-500/0 group-hover:border-cyan-500/20 rounded-lg transition-colors duration-300" />
          </Card>

          <Card className="group relative bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/30 via-slate-900/30 to-blue-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <CardHeader className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-slate-700/50 transition-colors">
                  <Wrench className="h-5 w-5 text-cyan-400" />
                </div>
                <CardTitle className="text-gray-100">Tools & Platforms</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="relative z-10 flex flex-wrap gap-2">
              {skills.tools.map((tool) => (
                <Badge
                  key={tool}
                  variant="outline"
                  className="border-cyan-500/30 hover:bg-cyan-500/10 text-gray-300 transition-colors"
                >
                  {tool}
                </Badge>
              ))}
            </CardContent>
            <div className="absolute inset-0 border border-cyan-500/0 group-hover:border-cyan-500/20 rounded-lg transition-colors duration-300" />
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">Professional Experience</h2>
        <div className="grid gap-8">
          {experiences.map((exp, index) => (
            <Card
              key={index}
              className="group relative bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/30 via-slate-900/30 to-blue-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <CardHeader className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-slate-700/50 transition-colors">
                      <Briefcase className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-100">{exp.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Building2 className="h-4 w-4" />
                        <span>{exp.company}</span>
                        <span>•</span>
                        <span>{exp.period}</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 rounded-full hover:bg-slate-800/50 transition-colors group-hover:text-cyan-400">
                    <ArrowUpRight className="h-5 w-5 transform text-cyan-400 group-hover:rotate-45 transition-transform duration-300" />
                  </button>
                </div>
              </CardHeader>

              <CardContent className="relative z-10">
                <ul className="space-y-2">
                  {exp.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-300">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-500/70 shrink-0" />
                      {resp}
                    </li>
                  ))}
                </ul>
              </CardContent>

              <div className="absolute inset-0 border border-cyan-500/0 group-hover:border-cyan-500/20 rounded-lg transition-colors duration-300" />
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-100">Featured Projects</h2>
        <div className="grid gap-8">
          {projects.map((project) => (
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
                      <div className="p-2 rounded-full bg-slate-800/50 group-hover:bg-cyan-500/20 transition-colors">
                        <ArrowUpRight className="h-5 w-5 text-cyan-400" />
                      </div>
                    </div>

                    <p className="text-gray-400 mb-4">
                      {project.description}
                    </p>

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

                    <div className="flex gap-4 relative z-20">
                      <Button
                        variant="outline"
                        size="sm"
                        className="group-hover:text-cyan-400 group-hover:border-cyan-400/50"
                        onClick={(e) => {
                          e.preventDefault();
                          window.open(project.liveUrl, '_blank');
                        }}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Live
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="group-hover:text-cyan-400 group-hover:border-cyan-400/50"
                        onClick={(e) => {
                          e.preventDefault();
                          window.open(project.githubUrl, '_blank');
                        }}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Source Code
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 flex items-center gap-2 text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>View Case Study</span>
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </CardContent>

              <div className="absolute inset-0 border border-cyan-500/0 group-hover:border-cyan-500/20 rounded-lg transition-colors duration-300" />
            </Card>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-100">Development Process</h2>
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-blue-500/50 to-purple-500/50 hidden md:block" />

          <div className="space-y-8">
            {developmentProcess.map((step, index) => (
              <Card
                key={index}
                className="relative group bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300 ml-0 md:ml-16"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/30 via-slate-900/30 to-blue-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute -left-2 top-6 w-4 h-4 rounded-full bg-cyan-400 hidden md:block" />

                <CardContent className="relative z-10 p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-slate-800/50 rounded-lg group-hover:bg-slate-700/50 transition-colors">
                      <step.icon className="h-6 w-6 text-cyan-400" />
                    </div>
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

                <div className="absolute inset-0 border border-cyan-500/0 group-hover:border-cyan-500/20 rounded-lg transition-colors duration-300" />
              </Card>
            ))}
          </div>
        </div>
      </section>


    </div>

  );
}
