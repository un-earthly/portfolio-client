"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Rocket, Globe, Layers, Sprout, Users, Database, Shield, Zap, Compass,
  MapPin, Clock, Briefcase, ArrowUpRight, Quote, Lightbulb,
} from "lucide-react";
import { journey, journeyMeta, type IconKey } from "@/data/journey";

const ICONS: Record<IconKey, React.ComponentType<{ className?: string }>> = {
  rocket: Rocket, globe: Globe, layers: Layers, seedling: Sprout,
  users: Users, database: Database, shield: Shield, zap: Zap, compass: Compass,
};

export default function JourneyContent() {
  const [activeId, setActiveId] = useState(journey[0]?.id ?? "");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative">
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-slate-800/80 px-6 py-20 md:py-28">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="mb-4 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-400/80">
            <span className="inline-block h-px w-8 bg-cyan-400/50" />
            Career · The Long Version
            <span className="inline-block h-px w-8 bg-cyan-400/50" />
          </p>
          <h1 className="text-balance text-4xl font-black tracking-tight text-white md:text-6xl">
            The story behind the résumé
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-slate-400 md:text-lg">
            The bullet points say <em>what</em>. This page is the <em>why</em> and the{" "}
            <em>how</em> — the migrations, the production fires, the things I learned
            the hard way, role by role.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 font-mono text-xs">
            {[
              { k: "Experience", v: journeyMeta.years + " yrs" },
              { k: "Companies", v: String(journeyMeta.companies) },
              { k: "Span", v: journeyMeta.span },
            ].map((s) => (
              <div
                key={s.k}
                className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-4 py-2"
              >
                <span className="text-cyan-400">{s.v}</span>
                <span className="text-slate-500">{s.k}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-center gap-4 text-sm">
            <Link href="/experience" className="text-slate-400 transition-colors hover:text-cyan-300">
              ← Back to experience
            </Link>
            <span className="text-slate-700">·</span>
            <Link href="/portfolio" className="text-slate-400 transition-colors hover:text-cyan-300">
              See the projects →
            </Link>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[220px_1fr]">
        {/* Sticky timeline nav */}
        <nav className="hidden lg:block">
          <div className="sticky top-24">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
              Timeline
            </p>
            <ol className="relative space-y-1 border-l border-slate-800 pl-5">
              {journey.map((role) => {
                const active = activeId === role.id;
                return (
                  <li key={role.id} className="relative">
                    <span
                      className="absolute -left-[1.6rem] top-2 h-2.5 w-2.5 rounded-full border-2 transition-all"
                      style={{
                        borderColor: active ? role.accent : "#334155",
                        background: active ? role.accent : "transparent",
                        boxShadow: active ? `0 0 12px ${role.accent}` : "none",
                      }}
                    />
                    <a
                      href={`#${role.id}`}
                      className="block rounded-md px-3 py-2 text-sm transition-colors"
                      style={{ color: active ? "#fff" : "#94a3b8" }}
                    >
                      <span className="block font-medium">{role.company}</span>
                      <span className="block font-mono text-[10px] text-slate-500">
                        {role.period.split(" — ")[0]}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </div>
        </nav>

        {/* Sections */}
        <div className="space-y-24">
          {journey.map((role, idx) => {
            const Icon = ICONS[role.icon];
            return (
              <section
                key={role.id}
                id={role.id}
                ref={(el) => { sectionRefs.current[role.id] = el; }}
                className="scroll-mt-24"
              >
                {/* Header */}
                <div className="mb-6 flex items-start gap-4">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border"
                    style={{ borderColor: `${role.accent}55`, background: `${role.accent}14` }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                      <span>{String(idx + 1).padStart(2, "0")}</span>
                      <span style={{ color: role.accent }}>●</span>
                      <span>{role.type}</span>
                    </div>
                    <h2 className="mt-1 text-2xl font-black tracking-tight text-white md:text-3xl">
                      {role.company}
                    </h2>
                    <p className="mt-0.5 text-base font-medium" style={{ color: role.accent }}>
                      {role.role}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{role.period}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{role.location}</span>
                    </div>
                  </div>
                </div>

                {/* TL;DR */}
                <div
                  className="mb-8 rounded-xl border bg-slate-900/40 p-5"
                  style={{ borderColor: `${role.accent}33` }}
                >
                  <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: role.accent }}>
                    <Zap className="h-3.5 w-3.5" /> TL;DR
                  </p>
                  <ul className="space-y-2">
                    {role.tldr.map((t, i) => (
                      <li key={i} className="flex gap-3 text-sm leading-relaxed text-slate-300">
                        <span style={{ color: role.accent }}>—</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Story */}
                <div className="mb-10">
                  <p className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                    <Quote className="h-3.5 w-3.5" /> The story
                  </p>
                  <div className="space-y-4 text-[15px] leading-[1.8] text-slate-300/90">
                    {role.story.map((p, i) => (
                      <p key={i} className="text-pretty">{p}</p>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div className="mb-10">
                  <p className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                    <Briefcase className="h-3.5 w-3.5" /> What I worked on
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {role.highlights.map((h) => (
                      <div
                        key={h.title}
                        className="group rounded-lg border border-slate-800 bg-slate-900/40 p-4 transition-colors hover:border-slate-700"
                      >
                        <h3 className="text-sm font-semibold text-white">{h.title}</h3>
                        <p className="mt-1 text-[13px] leading-relaxed text-slate-400">{h.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Learnings */}
                <div className="mb-10">
                  <p className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                    <Lightbulb className="h-3.5 w-3.5" /> What I learned
                  </p>
                  <ul className="space-y-2.5">
                    {role.learnings.map((l, i) => (
                      <li key={i} className="flex gap-3 text-sm leading-relaxed text-slate-300">
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ background: role.accent }}
                        />
                        <span>{l}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech + stats */}
                <div className="flex flex-col gap-6 rounded-xl border border-slate-800 bg-slate-900/30 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {role.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-slate-800 bg-slate-800/40 px-2.5 py-1 text-[11px] text-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex shrink-0 gap-5">
                    {role.stats.map((s) => (
                      <div key={s.label} className="text-center">
                        <div className="text-lg font-black" style={{ color: role.accent }}>{s.value}</div>
                        <div className="font-mono text-[9px] uppercase tracking-wider text-slate-500">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          })}

          {/* Closing CTA */}
          <div className="rounded-2xl border border-slate-800 bg-linear-to-br from-slate-900 to-slate-950 p-8 text-center">
            <h2 className="text-2xl font-black text-white">That&apos;s the long version.</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
              Want the project-level deep dives, or to talk about working together?
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-1.5 rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-bold text-black transition-colors hover:bg-cyan-300"
              >
                Explore projects <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-slate-500"
              >
                Get in touch
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
