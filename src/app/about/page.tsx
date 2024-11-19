// 'use client'

// import { ChevronDown } from 'lucide-react'
// import { useState } from 'react'

// export default function Component() {
//   const [activeSection, setActiveSection] = useState<string | null>(null)

//   const toggleSection = (section: string) => {
//     setActiveSection(activeSection === section ? null : section)
//   }

//   const Section = ({ title, children, id }: { title: string; children: React.ReactNode; id: string }) => (
//     <div className="mb-8">
//       <button
//         onClick={() => toggleSection(id)}
//         className="flex justify-between items-center w-full text-left text-xl font-semibold text-gray-200 mb-4 focus:outline-none"
//       >
//         {title}
//         <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${activeSection === id ? 'transform rotate-180' : ''}`} />
//       </button>
//       <div className={`overflow-hidden transition-all duration-300 ${activeSection === id ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
//         {children}
//       </div>
//     </div>
//   )

//   return (
//     <div className="max-w-3xl mx-auto">


//       <Section title="About Me" id="about">
//         <p className="text-gray-400 leading-relaxed">
//           I&apos;m a dynamic developer with over 3 years of experience across the MERN stack, complemented by hands-on expertise in mobile development, system design, and web scraping. I specialize in creating scalable, high-performance web solutions using Next.js, React.js, Vue.js, Node.js, MongoDB, PostgreSQL, MSSQL, and MySQL. Throughout my career, I&apos;ve contributed to both frontend and backend development, driving efficiencies and delivering user-centric solutions.
//         </p>
//       </Section>

//       <Section title="Key Skills" id="skills">
//         <ul className="grid grid-cols-2 gap-2 text-gray-400">
//           <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>React & Next.js</li>
//           <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>Vue.js & Nuxt.js</li>
//           <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>Node.js & Express.js</li>
//           <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>MongoDB & PostgreSQL</li>
//           <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>React Native & Flutter</li>
//           <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>Docker & Kubernetes</li>
//           <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>AWS (EC2, S3)</li>
//           <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>System Design & Architecture</li>
//         </ul>
//       </Section>

//       <Section title="Professional Highlights" id="highlights">
//         <ul className="space-y-3 text-gray-400">
//           <li className="flex items-start">
//             <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 mt-2"></span>
//             <span>Currently leading two system management projects for USA-based clients at Masleap, focusing on building scalable solutions.</span>
//           </li>
//           <li className="flex items-start">
//             <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 mt-2"></span>
//             <span>Developed and published an LMS serving 3,000+ users at Ishqool, progressing from Junior React Developer to Full-Stack Developer.</span>
//           </li>
//           <li className="flex items-start">
//             <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 mt-2"></span>
//             <span>Delivered 5 e-commerce applications, including Flutter and React Native solutions for Middle Eastern and Northern clients at Premium Solutions Limited.</span>
//           </li>
//           <li className="flex items-start">
//             <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 mt-2"></span>
//             <span>Led the frontend team at TNC Global Limited after successfully developing and designing an ERP management prototype.</span>
//           </li>
//           <li className="flex items-start">
//             <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 mt-2"></span>
//             <span>Improved overall app performance and implemented multilingual support using React Native at Prolific Tech Solution.</span>
//           </li>
//         </ul>
//       </Section>

//     </div>
//   )
// }


import React from 'react';
import {
  Code2,
  Coffee,
  Brain,
  Target,
  Sparkles,
  Heart,
  Clock,
  Puzzle,
  Book,
  Rocket,
  ArrowRight,
  Music,
  Globe,
  Laptop
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const AboutMe = () => {
  const persona = {
    role: "Full Stack Developer",
    mission: "To craft elegant solutions to complex problems while continuously learning and growing",
    characteristics: [
      {
        trait: "Problem Solver",
        description: "Thrives on tackling challenging technical puzzles",
        icon: Puzzle
      },
      {
        trait: "Continuous Learner",
        description: "Passionate about staying current with technology",
        icon: Book
      },
      {
        trait: "Team Player",
        description: "Values collaboration and knowledge sharing",
        icon: Heart
      }
    ],
    epics: [
      {
        title: "The Origin Story",
        description: "Started coding journey with a fascination for creating things",
        milestones: [
          "First 'Hello World' at age 12",
          "Built first website for school project",
          "Won regional coding competition"
        ],
        icon: Rocket
      },
      {
        title: "The Learning Path",
        description: "Continuous pursuit of knowledge and excellence",
        milestones: [
          "Computer Science Degree",
          "Multiple tech certifications",
          "Regular conference speaker"
        ],
        icon: Brain
      },
      {
        title: "The Professional Journey",
        description: "Growing through challenges and achievements",
        milestones: [
          "Led multiple successful projects",
          "Mentored junior developers",
          "Contributed to open source"
        ],
        icon: Target
      }
    ]
  };

  const userStories = [
    {
      as: "A Developer",
      want: "To create scalable and maintainable solutions",
      so: "That I can help businesses grow and succeed",
      metrics: ["5+ years experience", "20+ successful projects", "3 tech talks delivered"]
    },
    {
      as: "A Team Member",
      want: "To collaborate and share knowledge",
      so: "That the whole team can grow together",
      metrics: ["10+ developers mentored", "15+ code reviews weekly", "5+ team workshops conducted"]
    },
    {
      as: "A Tech Enthusiast",
      want: "To stay current with technology trends",
      so: "That I can implement the best solutions",
      metrics: ["Daily learning routine", "Regular blog posts", "Open source contributions"]
    }
  ];

  const sprints = [
    {
      title: "Technical Expertise",
      velocity: "High",
      skills: [
        { name: "Frontend Development", level: 90 },
        { name: "Backend Development", level: 85 },
        { name: "DevOps & Cloud", level: 80 }
      ]
    },
    {
      title: "Soft Skills",
      velocity: "Consistent",
      skills: [
        { name: "Team Collaboration", level: 95 },
        { name: "Problem Solving", level: 90 },
        { name: "Communication", level: 85 }
      ]
    }
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Persona Header */}
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

          {/* Epic Journey */}
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

          {/* Sprint Velocity & Skills */}
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
              {[
                {
                  icon: Coffee,
                  title: "Coffee Enthusiast",
                  description: "Perfect brew for perfect code"
                },
                {
                  icon: Globe,
                  title: "World Explorer",
                  description: "Discovering new perspectives"
                },
                {
                  icon: Music,
                  title: "Music Lover",
                  description: "Coding with rhythm"
                }
              ].map((interest, index) => (
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