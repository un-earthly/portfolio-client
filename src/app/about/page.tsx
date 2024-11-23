
import React from 'react';
import {
  Code2,
  Coffee,
  Brain,
  Target,
  Sparkles,
  Heart,
  Puzzle,
  Book,
  Rocket,
  ArrowRight,
  Music,
  Globe,
  Laptop
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { persona, personalInterests, sprints, userStories } from '@/mock-data';

const AboutMe = () => {


  return (
    <div>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-16">
            <div className="inline-block p-4 rounded-full bg-cyan-500/10 mb-6">
              <Code2 className="h-12 w-12 text-cyan-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-100 mb-4">{persona.role}</h1>
            <p className="text-xl text-gray-400">{persona.mission}</p>
          </div>

          {/* Character Traits */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {persona.characteristics.map((trait, index) => (
              <Card key={index} className="bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="inline-block p-3 rounded-full bg-cyan-500/10 mb-4">
                    <trait.icon className="h-6 w-6 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-100 mb-2">{trait.trait}</h3>
                  <p className="text-gray-400">{trait.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* User Stories */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-100 mb-8">User Stories</h2>
            <div className="space-y-6">
              {userStories.map((story, index) => (
                <Card key={index} className="group bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors">
                          <Sparkles className="h-5 w-5 text-cyan-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-100 mb-1">As {story.as}</h3>
                          <p className="text-gray-400">I want {story.want}</p>
                          <p className="text-gray-400">So that {story.so}</p>
                        </div>
                      </div>
                      <div className="ml-12 flex flex-wrap gap-3">
                        {story.metrics.map((metric, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-200 text-sm"
                          >
                            {metric}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>


          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-100 mb-8">Epic Journey</h2>
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-blue-500/50 to-cyan-500/50 hidden md:block" />

              <div className="space-y-8">
                {persona.epics.map((epic, index) => (
                  <div key={index} className="relative ml-0 md:ml-16">
                    <div className="absolute left-[-2rem] top-6 w-4 h-4 rounded-full bg-cyan-400 hidden md:block" />

                    <Card className="bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-2 rounded-lg bg-cyan-500/10">
                            <epic.icon className="h-5 w-5 text-cyan-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-100 mb-2">{epic.title}</h3>
                            <p className="text-gray-400 mb-4">{epic.description}</p>
                            <ul className="space-y-2">
                              {epic.milestones.map((milestone, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-gray-300">
                                  <ArrowRight className="h-4 w-4 text-cyan-400 shrink-0 mt-1" />
                                  <span>{milestone}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </section>


          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-100 mb-8">Sprint Velocity & Skills</h2>
            <div className="space-y-8">
              {sprints.map((sprint, index) => (
                <Card key={index} className="bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-100">{sprint.title}</h3>
                      <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-200 text-sm">
                        Velocity: {sprint.velocity}
                      </span>
                    </div>
                    <div className="space-y-4">
                      {sprint.skills.map((skill, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-300">{skill.name}</span>
                            <span className="text-cyan-400">{skill.level}%</span>
                          </div>
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Personal Interests */}
          <section>
            <h2 className="text-2xl font-bold text-gray-100 mb-8">Beyond Code</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {personalInterests.map((interest, index) => (
                <Card key={index} className="bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="inline-block p-3 rounded-full bg-cyan-500/10 mb-4">
                      <interest.icon className="h-6 w-6 text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-100 mb-2">{interest.title}</h3>
                    <p className="text-gray-400">{interest.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;