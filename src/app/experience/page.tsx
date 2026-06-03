import type { Metadata } from "next";
import ExperienceCard from '@/components/ExperinceCard'
import { experiences } from '@/mock-data'
import React from 'react'

export const metadata: Metadata = {
  title: "Experience",
  description:
    "MD Alamin's professional experience: Senior Software Engineer at Mediusware, Software Engineer at All Generation Tech, Lead Developer at Masleap Plc, and Full Stack Developer at IshQool.",
  alternates: { canonical: "https://alamin-md.xyz/experience" },
  openGraph: {
    title: "Experience | MD Alamin",
    description:
      "5+ years of professional experience across edtech, enterprise, and international software engineering roles.",
    url: "https://alamin-md.xyz/experience",
  },
};

export default function page() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold text-gray-100 mb-4">Experiences</h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    A chronological list of my professional journey
                </p>
            </div>

            <div className="space-y-4">
                {experiences.map((company, index) => (
                    <ExperienceCard company={company} key={index} />
                ))}
            </div>
        </div>
    )
}
