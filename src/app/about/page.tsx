'use client'

import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

export default function Component() {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section)
  }

  const Section = ({ title, children, id }: { title: string; children: React.ReactNode; id: string }) => (
    <div className="mb-8">
      <button
        onClick={() => toggleSection(id)}
        className="flex justify-between items-center w-full text-left text-xl font-semibold text-gray-200 mb-4 focus:outline-none"
      >
        {title}
        <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${activeSection === id ? 'transform rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${activeSection === id ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        {children}
      </div>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto">


      <Section title="About Me" id="about">
        <p className="text-gray-400 leading-relaxed">
          I&apos;m a dynamic developer with over 3 years of experience across the MERN stack, complemented by hands-on expertise in mobile development, system design, and web scraping. I specialize in creating scalable, high-performance web solutions using Next.js, React.js, Vue.js, Node.js, MongoDB, PostgreSQL, MSSQL, and MySQL. Throughout my career, I&apos;ve contributed to both frontend and backend development, driving efficiencies and delivering user-centric solutions.
        </p>
      </Section>

      <Section title="Key Skills" id="skills">
        <ul className="grid grid-cols-2 gap-2 text-gray-400">
          <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>React & Next.js</li>
          <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>Vue.js & Nuxt.js</li>
          <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>Node.js & Express.js</li>
          <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>MongoDB & PostgreSQL</li>
          <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>React Native & Flutter</li>
          <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>Docker & Kubernetes</li>
          <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>AWS (EC2, S3)</li>
          <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>System Design & Architecture</li>
        </ul>
      </Section>

      <Section title="Professional Highlights" id="highlights">
        <ul className="space-y-3 text-gray-400">
          <li className="flex items-start">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 mt-2"></span>
            <span>Currently leading two system management projects for USA-based clients at Masleap, focusing on building scalable solutions.</span>
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 mt-2"></span>
            <span>Developed and published an LMS serving 3,000+ users at Ishqool, progressing from Junior React Developer to Full-Stack Developer.</span>
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 mt-2"></span>
            <span>Delivered 5 e-commerce applications, including Flutter and React Native solutions for Middle Eastern and Northern clients at Premium Solutions Limited.</span>
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 mt-2"></span>
            <span>Led the frontend team at TNC Global Limited after successfully developing and designing an ERP management prototype.</span>
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 mt-2"></span>
            <span>Improved overall app performance and implemented multilingual support using React Native at Prolific Tech Solution.</span>
          </li>
        </ul>
      </Section>

    </div>
  )
}