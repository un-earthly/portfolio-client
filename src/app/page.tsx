'use client'
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from 'react'
import { Button, } from "@/components/ui/button"
import { Activity, ArrowUpRight, Briefcase, Building2, CheckCircle, Code2, Cpu, Database, ExternalLink, Globe, Laptop, Layout, Mail, MessageSquare, Microscope, Palette, PenTool, Repeat, Rocket, Search, Sparkles, Store, Trophy, Users, Wrench } from 'lucide-react'
import Link from "next/link";

export default function Home() {
  const skills = {
    specialized: ['React & Next.js', 'Redux', 'TypeScript', 'Node & Express JS', 'MongoDB', 'PostgreSQL', 'Vue & Nuxt.js'],
    comfortable: ['Docker', 'React Native', 'Flutter', 'Web Socket', 'AWS EC2', 'S3', 'Redis', 'MSSQL', 'MySQL'],
    tools: ['Git/Github', 'Firebase', 'Stripe', 'Figma', 'NPM', 'Trello', 'Postman', 'ChatGPT']
  };
  const experiences = [
    {
      title: "Project Manager",
      company: "Masleap Plc",
      period: "August 2024 - Present",
      responsibilities: [
        "Leading two system management projects for USA-based clients",
        "Designing ERDs and system architecture for scalable solutions",
        "Mentoring junior developers and conducting Scrum ceremonies",
        "Creating Low-Level and High-Level Designs for efficient development"
      ]
    },
    {
      title: "Software Engineer",
      company: "TNC Global Limited",
      period: "November 2023 - July 2024",
      responsibilities: [
        "Led frontend team in developing ERP management prototype",
        "Developed and maintained applications using React JS and Next.js",
        "Deployed applications to AWS EC2 for scalable cloud solutions",
        "Mentored junior developers and resolved complex UI challenges"
      ]
    },
    {
      title: "Front-End Developer",
      company: "Premium Solutions Limited",
      period: "March 2023 - June 2024",
      responsibilities: [
        "Implemented frontend for 5 e-commerce projects",
        "Developed using Flutter, Vue.js, and Next.js for diverse client needs",
        "Specialized in responsive and user-friendly interfaces",
        "Integrated frontend with backend APIs for seamless functionality"
      ]
    }
  ];
  const achievements = [
    {
      title: 'LMS Development',
      description: 'Developed and published an LMS serving 3,000+ users, showcasing scalability and user-centric design.',
      icon: Layout
    },
    {
      title: 'E-commerce Solutions',
      description: 'Delivered 5 e-commerce applications, including Flutter and React Native solutions for international clients.',
      icon: Store
    },
    {
      title: 'ERP Management',
      description: 'Led frontend team in developing and designing an ERP management prototype, demonstrating leadership and technical expertise.',
      icon: Users
    },
    {
      title: 'Project Leadership',
      description: 'Currently leading two system management projects for USA-based clients, focusing on scalable and efficient solutions.',
      icon: Trophy
    }
  ];
  const projects = [
    {
      id: 'lms-platform',
      title: "Learning Management System",
      description: "A comprehensive LMS platform serving 3,000+ users with features like course management, progress tracking, and interactive assessments.",
      image: "/api/placeholder/600/400",
      technologies: ['Next.js', 'TypeScript', 'Node.js', 'MongoDB'],
      liveUrl: '#',
      githubUrl: '#',
    },
    {
      id: 'erp-system',
      title: "Enterprise Resource Planning System",
      description: "A full-featured ERP solution for managing business operations, including inventory, HR, and financial management modules.",
      image: "/api/placeholder/600/400",
      technologies: ['React', 'Redux', 'Express', 'PostgreSQL'],
      liveUrl: '#',
      githubUrl: '#',
    }
  ];
  const services = [
    {
      id: 'full-stack-dev',
      icon: Code2,
      title: "Full Stack Development",
      shortDesc: "End-to-end web applications with modern technologies.",
      description: "Crafting scalable and maintainable applications using React, Next.js, Node.js, and more.",
      keyFeatures: [
        "Custom web application development",
        "RESTful API design and implementation",
        "Database architecture and optimization",
        "Performance optimization and scaling"
      ]
    },
    {
      id: 'ui-ux-design',
      icon: Palette,
      title: "UI/UX Design",
      shortDesc: "User-centered design solutions that engage and convert.",
      description: "Creating intuitive interfaces with a focus on user experience and conversion optimization.",
      keyFeatures: [
        "Responsive web design",
        "User interface prototyping",
        "Interaction design",
        "Usability testing"
      ]
    },
    {
      id: 'tech-consulting',
      icon: Database,
      title: "Technical Consulting",
      shortDesc: "Strategic technology guidance and solutions architecture.",
      description: "Providing expert advice on technology stack selection and architecture decisions.",
      keyFeatures: [
        "Technology stack assessment",
        "Architecture planning",
        "Performance optimization",
        "Security best practices"
      ]
    }
  ];

  const developmentProcess = [
    {
      icon: Search,
      title: "Discovery & Planning",
      description: "Requirements gathering and project scope definition using Agile user stories.",
      details: [
        "As a [user type], I want to [action] so that [benefit]",
        "Story point estimation",
        "Sprint planning",
        "Acceptance criteria definition"
      ]
    },
    {
      icon: PenTool,
      title: "Design & Architecture",
      description: "System design and technical architecture planning.",
      details: [
        "High-level system design",
        "Database schema design",
        "API endpoint planning",
        "UI/UX wireframing"
      ]
    },
    {
      icon: Laptop,
      title: "Development",
      description: "Iterative development in sprints following Agile principles.",
      details: [
        "2-week sprint cycles",
        "Daily stand-ups",
        "Code reviews",
        "Continuous Integration"
      ]
    },
    {
      icon: Microscope,
      title: "Testing & QA",
      description: "Comprehensive testing and quality assurance.",
      details: [
        "Unit testing",
        "Integration testing",
        "User acceptance testing",
        "Performance testing"
      ]
    },
    {
      icon: Rocket,
      title: "Deployment",
      description: "Smooth deployment and production release.",
      details: [
        "Automated deployment",
        "Environment configuration",
        "Performance monitoring",
        "Security checks"
      ]
    },
    {
      icon: Repeat,
      title: "Maintenance & Support",
      description: "Ongoing support and iterative improvements.",
      details: [
        "Bug fixes",
        "Feature enhancements",
        "Performance optimization",
        "Security updates"
      ]
    }
  ];
  return (
    <div>
      <section className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Key Achievements</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {achievements.map((achievement, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-950/30 via-slate-900/30 to-indigo-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <CardHeader className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-slate-700/50 transition-colors">
                      <achievement.icon className="h-5 w-5 text-blue-400" />
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
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Technical Expertise</h2>
          <div className="grid gap-8">
            <Card className="group relative overflow-hidden bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-950/30 via-slate-900/30 to-fuchsia-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <CardHeader className="relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-slate-700/50 transition-colors">
                    <Cpu className="h-5 w-5 text-purple-400" />
                  </div>
                  <CardTitle>Core Technologies</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 flex flex-wrap gap-2">
                {skills.specialized.map((skill) => (
                  <Badge
                    key={skill}
                    variant="default"
                    className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-200 transition-colors"
                  >
                    {skill}
                  </Badge>
                ))}
              </CardContent>
              <div className="absolute inset-0 border border-purple-500/0 group-hover:border-purple-500/20 rounded-lg transition-colors duration-300" />
            </Card>

            <Card className="group relative overflow-hidden bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-950/30 via-slate-900/30 to-fuchsia-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <CardHeader className="relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-slate-700/50 transition-colors">
                    <Wrench className="h-5 w-5 text-purple-400" />
                  </div>
                  <CardTitle>Additional Competencies</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 flex flex-wrap gap-2">
                {skills.comfortable.map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="border-purple-500/30 hover:bg-purple-500/10 text-gray-300 transition-colors"
                  >
                    {skill}
                  </Badge>
                ))}
              </CardContent>
              <div className="absolute inset-0 border border-purple-500/0 group-hover:border-purple-500/20 rounded-lg transition-colors duration-300" />
            </Card>

            <Card className="group relative overflow-hidden bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-950/30 via-slate-900/30 to-fuchsia-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <CardHeader className="relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-slate-700/50 transition-colors">
                    <Wrench className="h-5 w-5 text-purple-400" />
                  </div>
                  <CardTitle>Tools & Platforms</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 flex flex-wrap gap-2">
                {skills.tools.map((tool) => (
                  <Badge
                    key={tool}
                    variant="outline"
                    className="border-purple-500/30 hover:bg-purple-500/10 text-gray-300 transition-colors"
                  >
                    {tool}
                  </Badge>
                ))}
              </CardContent>
              <div className="absolute inset-0 border border-purple-500/0 group-hover:border-purple-500/20 rounded-lg transition-colors duration-300" />
            </Card>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Professional Experience</h2>
          <div className="grid gap-8">
            {experiences.map((exp, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
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
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Projects</h2>
          <div className="grid gap-8">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="group relative overflow-hidden bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/30 via-slate-900/30 to-blue-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <Link href={`/case-study/${project.id}`} className="absolute inset-0 z-10">
                  <span className="sr-only">View case study for {project.title}</span>
                </Link>

                <CardContent className="relative z-10 p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative overflow-hidden rounded-lg">
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

                      {/* These buttons need to stop event propagation to work with the parent link */}
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

                  {/* Hover instruction */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>View Case Study</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </CardContent>

                <div className="absolute inset-0 border border-cyan-500/0 group-hover:border-cyan-500/20 rounded-lg transition-colors duration-300" />
              </Card>
            ))}
          </div>
        </div>
      </section>


      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-100">Services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link href={`/services/${service.id}`} key={service.id}>
                <Card
                  className="group relative overflow-hidden bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300 h-full transform hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/10"
                >
                  {/* Cyan gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/30 via-slate-900/30 to-blue-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <CardContent className="relative z-10 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-slate-800/50 rounded-lg group-hover:bg-cyan-500/20 transition-colors duration-300">
                        <service.icon className="h-6 w-6 text-cyan-400" />
                      </div>
                      <div className="p-2 rounded-full bg-slate-800/50 group-hover:bg-cyan-500/20 transition-colors duration-300">
                        <ArrowUpRight className="h-5 w-5 text-cyan-400 transform group-hover:rotate-45 transition-transform duration-300" />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-2 text-gray-100 group-hover:text-cyan-200 transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 mb-4">{service.shortDesc}</p>

                    <ul className="space-y-2">
                      {service.keyFeatures.slice(0, 2).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-300">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-500/70 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* View Details link */}
                    <div className="mt-4 flex items-center gap-2 text-cyan-400 text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <span>Explore Service</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </CardContent>

                  {/* Cyan border glow */}
                  <div className="absolute inset-0 border border-cyan-500/0 group-hover:border-cyan-500/20 rounded-lg transition-colors duration-300" />
                </Card>
              </Link>
            ))}
          </div>

          {/* Service badges/tags */}
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {[
              "Web Development",
              "Mobile Apps",
              "Cloud Solutions",
              "DevOps",
              "API Development",
              "Database Design",
              "System Architecture",
              "Performance Optimization"
            ].map((tag, index) => (
              <span
                key={index}
                className="px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-200 text-sm border border-cyan-500/20 hover:bg-cyan-500/20 transition-all duration-300 cursor-pointer hover:scale-105"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Quick contact card */}
        <div className="max-w-4xl mx-auto mt-16">
          <Card className="group relative overflow-hidden bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/30 via-slate-900/30 to-blue-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <CardContent className="relative z-10 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-100">Need a Custom Solution?</h3>
                <p className="text-gray-400">Let's discuss how I can help bring your ideas to life.</p>
              </div>
              <button className="px-6 py-3 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-200 border border-cyan-500/20 transition-all duration-300 flex items-center gap-2 hover:scale-105">
                <MessageSquare className="h-5 w-5" />
                Schedule a Call
              </button>
            </CardContent>

            <div className="absolute inset-0 border border-cyan-500/0 group-hover:border-cyan-500/20 rounded-lg transition-colors duration-300" />
          </Card>
        </div>
      </section>



      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-100">Development Process</h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-blue-500/50 to-purple-500/50 hidden md:block" />

            <div className="space-y-8">
              {developmentProcess.map((step, index) => (
                <Card
                  key={index}
                  className="relative group overflow-hidden bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300 ml-0 md:ml-16"
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
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="group relative overflow-hidden bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/30 via-slate-900/30 to-teal-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <CardContent className="relative z-10 py-8">
              <h2 className="text-3xl font-bold mb-4 text-white">Ready to Elevate Your Digital Presence?</h2>
              <p className="text-lg text-gray-400 mb-8">
                Let's discuss how my expertise in full-stack development and cloud solutions can drive your project to success.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-colors"
              >
                <a href="mailto:vijayalamin@gmail.com" className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Schedule a Consultation
                </a>
              </Button>
            </CardContent>
            <div className="absolute inset-0 border border-emerald-500/0 group-hover:border-emerald-500/20 rounded-lg transition-colors duration-300" />
          </Card>
        </div>
      </section>
    </div>

  );
}
