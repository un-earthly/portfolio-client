import ExperienceCard from '@/components/ExperinceCard'
import { experiences } from '@/mock-data'
import React from 'react'

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
