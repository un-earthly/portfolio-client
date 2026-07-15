import type { Metadata } from "next";
import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { services, developmentProcess } from '@/mock-data';

export const metadata: Metadata = {
  title: "Services",
  description:
    "MD Alamin offers full-stack development, UI/UX design, and technical consulting services. Building scalable web applications and providing strategic technology guidance.",
  alternates: { canonical: "https://alamin-md.xyz/services" },
  openGraph: {
    title: "Services | MD Alamin",
    description:
      "Full-stack development, UI/UX design, and technical consulting services.",
    url: "https://alamin-md.xyz/services",
  },
};

export default function ServicesPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <p className="text-xs font-semibold text-cyan-500 uppercase tracking-widest mb-3">
          What I Do
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">
          Services
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Full-stack development, UI/UX design, and technical consulting for teams shipping
          scalable, maintainable software — from greenfield builds to legacy system modernisation.
        </p>
      </div>

      {/* Services grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-20">
        {services.map((service) => (
          <Card
            key={service.id}
            className="bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-cyan-500/40 transition-all duration-300"
          >
            <CardContent className="p-6">
              <div className="inline-block p-3 rounded-full bg-cyan-500/10 mb-4">
                <service.icon className="h-6 w-6 text-cyan-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-100 mb-2">{service.title}</h2>
              <p className="text-gray-400 text-sm mb-4">{service.description}</p>
              <ul className="space-y-2">
                {service.keyFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Process */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-100 mb-8 text-center">How I Work</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {developmentProcess.map((step, index) => (
            <Card
              key={index}
              className="bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-slate-700 transition-colors"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10">
                    <step.icon className="h-5 w-5 text-cyan-400" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-100">{step.title}</h3>
                </div>
                <p className="text-gray-400 text-sm">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-bold tracking-widest uppercase px-7 py-3.5 rounded-full transition-colors duration-200"
        >
          Start a Project
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
