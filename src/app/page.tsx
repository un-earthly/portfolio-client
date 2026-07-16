'use client'
import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { SectionHeader } from "@/components/ui/section-header";
import { ArrowUpRight } from 'lucide-react'
import Link from "next/link";
import Image from "next/image";
import { experiences, projects, socialLinks, yearsOfExperince } from '@/mock-data'
import ExperienceCard from "@/components/ExperinceCard";
import { HowIWork } from "@/components/HowIWork";
import { ParallaxVideo } from "@/components/ParallaxVideo";
import { TechExpertise } from "@/components/TechExpertise";

/* ── Hero node graph ────────────────────────────────────────── */
const _hn = [
  { x: 120, y: 100 }, { x: 300, y: 55 }, { x: 480, y: 155 },
  { x: 650, y: 75 }, { x: 820, y: 165 }, { x: 980, y: 88 },
  { x: 1120, y: 148 }, { x: 195, y: 285 }, { x: 395, y: 350 },
  { x: 575, y: 288 }, { x: 748, y: 378 }, { x: 900, y: 282 },
  { x: 1052, y: 352 },
]
const _he = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6],
  [0, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 12],
  [1, 7], [2, 9], [3, 9], [4, 11], [5, 12], [2, 8], [4, 10], [6, 12],
]
function HeroNodeGraph() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 460"
      className="absolute inset-0 w-full h-full text-white"
      style={{ opacity: 0.08 }}
      preserveAspectRatio="xMidYMid slice"
    >
      {_he.map((edge, i) => (
        <line
          key={i}
          x1={_hn[edge[0]].x} y1={_hn[edge[0]].y}
          x2={_hn[edge[1]].x} y2={_hn[edge[1]].y}
          stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.7"
        />
      ))}
      {_hn.map((n, i) => (
        <circle
          key={i}
          cx={n.x} cy={n.y} r="4"
          fill="none" stroke="currentColor" strokeWidth="1.2"
          className="hero-node"
          style={{ animationDelay: `${((i * 0.28) % 3).toFixed(2)}s` }}
        />
      ))}
      {/* Accent nodes — cyan highlight on two key junctions */}
      <circle cx={480} cy={155} r="7" fill="none" stroke="#22d3ee" strokeWidth="1"
        strokeOpacity="0.55" className="hero-node" style={{ animationDelay: '0.5s' }} />
      <circle cx={820} cy={165} r="5.5" fill="none" stroke="#22d3ee" strokeWidth="1"
        strokeOpacity="0.4" className="hero-node" style={{ animationDelay: '1.2s' }} />
    </svg>
  )
}

/* ── Rotating headline — only the center glitch word swaps ─── */
const MID_WORDS = ['BUILDS', 'BREAKS', 'BURNS', 'REBUILDS', 'OWNS']

function RotatingHeadline() {
  const [idx, setIdx] = React.useState(0)
  const [wordVisible, setWordVisible] = React.useState(true)

  React.useEffect(() => {
    const cycle = setInterval(() => {
      setWordVisible(false)
      setTimeout(() => {
        setIdx(i => (i + 1) % MID_WORDS.length)
        setWordVisible(true)
      }, 350)
    }, 3500)
    return () => clearInterval(cycle)
  }, [])

  const word = MID_WORDS[idx]
  return (
    <h1
      className="font-black uppercase tracking-tight mb-10"
      style={{ lineHeight: 0.88 }}
    >
      <span className="block text-white" style={{ fontSize: 'clamp(4rem, 10vw, 9rem)' }}>
        MD<span className="text-cyan-400">.</span>
      </span>
      <span
        className="broken-word block transition-opacity duration-350"
        data-text={word}
        style={{
          fontSize: 'clamp(4rem, 10vw, 9rem)',
          color: 'transparent',
          WebkitTextFillColor: 'transparent',
          WebkitTextStroke: '2px #22d3ee',
          opacity: wordVisible ? 1 : 0,
        }}
      >
        {word}
      </span>
      <span className="block text-white" style={{ fontSize: 'clamp(4rem, 10vw, 9rem)' }}>
        SYSTEMS.
      </span>
    </h1>
  )
}

/* ── Hero ───────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden border-b border-white/5">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
      {/* Cyan glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      {/* Node graph */}
      <HeroNodeGraph />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-16 py-24">

        {/* Eyebrow */}
        <p
          className="font-mono tracking-[0.2em] uppercase text-gray-500 mb-8"
          style={{ fontSize: 'clamp(0.6rem, 1vw, 0.75rem)' }}
        >
          Your codebase called. It&apos;s scared.
        </p>

        {/* Massive display heading — center word cycles */}
        <RotatingHeadline />

        {/* Punchy single-sentence body */}
        <p
          className="text-gray-400 max-w-105 leading-relaxed mb-10"
          style={{ fontSize: 'clamp(1rem, 1.6vw, 1.2rem)' }}
        >
          Greenfield or halfway on fire, I build it, move it, and harden it so it holds.
        </p>

        {/* CTA row */}
        <div className="flex flex-wrap items-center gap-4 mb-20">
          <Link
            href="/contact"
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-bold tracking-widest uppercase px-7 py-3.5 rounded-full transition-colors duration-200"
          >
            Let&apos;s Talk
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <Link
            href="/portfolio"
            className="flex items-center gap-2 border border-white/10 hover:border-cyan-500/40 text-gray-300 hover:text-white text-sm font-medium tracking-wide px-7 py-3.5 rounded-full transition-colors duration-200"
          >
            See Work
          </Link>
          <div className="flex items-center gap-3 ml-2">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-gray-500 hover:text-cyan-400 hover:border-cyan-400/40 transition-colors"
                aria-label={label}
              >
                <Icon className="w-4 h-4" />
              </Link>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-x-10 gap-y-5 border-t border-white/5 pt-8">
          {[
            { value: `${yearsOfExperince}+`, label: 'Years Experience', pct: 0.65 },
            { value: '20+', label: 'Projects Delivered', pct: 0.50 },
            { value: '95%', label: 'Client Satisfaction', pct: 0.95 },
            { value: '10K+', label: 'Concurrent Users Handled', pct: 0.75 },
          ].map(({ value, label, pct }) => {
            const r = 14
            const circ = 2 * Math.PI * r
            return (
              <div key={label} className="flex items-center gap-3">
                <svg
                  width="36" height="36" viewBox="0 0 36 36"
                  aria-hidden="true"
                  className="shrink-0 -rotate-90"
                >
                  <circle cx="18" cy="18" r={r} fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.1" />
                  <circle
                    cx="18" cy="18" r={r} fill="none"
                    stroke="#22d3ee" strokeWidth="1.5"
                    strokeDasharray={`${(pct * circ).toFixed(1)} ${circ.toFixed(1)}`}
                    strokeLinecap="round" strokeOpacity="0.55"
                  />
                </svg>
                <div>
                  <div className="text-3xl font-black text-white tracking-tight">{value}</div>
                  <div className="text-xs text-gray-500 tracking-widest uppercase mt-1">{label}</div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

/* ── Featured project card ──────────────────────────────────── */
function FeaturedProjectCard({
  project,
  tall,
}: {
  project: { id: string; title: string; image: string; category: string; technologies: string[] }
  tall?: boolean
}) {
  return (
    <Link
      href={`/portfolio/${project.id}`}
      className={[
        'group relative overflow-hidden rounded-xl block border border-white/5',
        tall ? 'h-72' : 'h-52',
      ].join(' ')}
    >
      <Image
        src={project.image}
        alt={project.title}
        fill
        sizes="(min-width: 1024px) 33vw, 100vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/45 group-hover:bg-black/25 transition-colors duration-500" />
      <div className="absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-end p-5">
        <span className="text-[9px] tracking-[0.18em] uppercase text-cyan-400/60 font-mono mb-1.5">
          {project.category}
        </span>
        <h3
          className="text-white font-bold tracking-tight leading-tight mb-2.5"
          style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)' }}
        >
          {project.title}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 3).map((t) => (
            <span
              key={t}
              className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-white/60 font-mono border border-white/10"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm border border-white/15 text-white/80 text-[9px] tracking-widest uppercase px-2.5 py-1.5 rounded-sm">
          <ArrowUpRight className="w-3 h-3" />
          Case Study
        </span>
      </div>
    </Link>
  )
}

/* ── Blog section ───────────────────────────────────────────── */
type BlogCardData = { slug: string; title: string; excerpt: string; readTime: number; type: 'technical' | 'hot-take'; tags: string[]; cover: string }

// Featured posts are fetched at runtime from /api/blogs (auto-includes new posts).

function BlogCard({ slug, title, excerpt, readTime, type, tags, cover }: BlogCardData) {
  return (
    <Link
      href={`/blogs/${slug}`}
      className="group flex flex-col h-full rounded-2xl border border-white/8 bg-white/2 hover:border-cyan-500/30 hover:bg-white/4 transition-all duration-300 overflow-hidden"
    >
      {/* Cover image — 75% of card height */}
      <div className="relative w-full flex-3 min-h-0">
        <Image
          src={cover}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="500px"
        />
      </div>
      {/* Card body — 25% of card height */}
      <div className="flex flex-col justify-between flex-1 p-5">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${type === 'hot-take'
              ? 'text-orange-400 border-orange-500/30 bg-orange-500/10'
              : 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10'
              }`}>
              {type === 'hot-take' ? 'Hot Take' : 'Technical'}
            </span>
            <span className="text-[9px] text-gray-600 font-mono">{readTime} min</span>
          </div>
          <h3 className="text-sm font-bold text-gray-100 leading-snug mb-2 group-hover:text-white transition-colors line-clamp-3">
            {title}
          </h3>
          <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">{excerpt}</p>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[9px] font-mono text-gray-600 bg-white/4 border border-white/8 rounded-full px-2 py-0.5">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}

/* ── Blog horizontal scroll section ────────────────────────── */
function BlogScrollSection() {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)   // measures real content width
  const [scrollDist, setScrollDist] = React.useState(0)
  const [featured, setFeatured] = React.useState<BlogCardData[]>([])

  // Fetch posts at runtime so new markdown blogs appear automatically.
  React.useEffect(() => {
    let alive = true
    fetch('/api/blogs')
      .then((r) => r.json())
      .then((d) => { if (alive) setFeatured(d.blogs ?? []) })
      .catch(() => {})
    return () => { alive = false }
  }, [])

  React.useEffect(() => {
    const CARD_W = 500
    const GAP = 12
    const PL = 32
    const PR = 64
    const remainingCards = Math.min(Math.max(0, featured.length - 1), 12)
    const cols = Math.ceil(remainingCards / 2) + 1 // +1 for the CTA card column

    const measure = () => {
      // hero(50vw) + gap + grid(cols*500 + (cols-1)*gap) + paddings - viewport
      const heroW = window.innerWidth * 0.5
      const gridW = cols * CARD_W + (cols - 1) * GAP
      const totalW = PL + heroW + GAP + gridW + PR
      setScrollDist(Math.max(0, totalW - window.innerWidth))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [featured.length])

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ['start start', 'end end'],
  })

  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollDist])
  const barWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <div
      ref={outerRef}
      style={{ height: scrollDist > 0 ? `calc(100vh + ${scrollDist}px)` : '200vh' }}
    >
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>

        {/* eyebrow */}
        <div style={{
          flexShrink: 0,
          padding: '40px 32px 12px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-cyan-500/50">Latest Writing</p>
          <p className="text-[10px] font-mono text-gray-700">{featured.length} articles &amp; essays</p>
        </div>

        {/* heading */}
        <div style={{
          flexShrink: 0,
          padding: '20px 32px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
          <h2 className="text-4xl font-black text-white leading-none tracking-tight">
            Written from<br /><span className="text-cyan-400">the trenches.</span>
          </h2>
          <p className="text-[11px] text-gray-600 font-mono mt-2 max-w-xs leading-relaxed">
            Real-world engineering, hot takes, and deep dives — from production systems, not tutorials.
          </p>
        </div>

        {/* card track */}
        <div style={{ flex: 1, overflow: 'hidden', padding: '16px 0' }}>
          <motion.div
            style={{
              x,
              height: '100%',
              width: 'max-content',
              display: 'flex',
              flexDirection: 'row',
              gap: '12px',
              paddingLeft: '32px',
              paddingRight: '64px',
              willChange: 'transform',
            }}
          >
            {/* inner ref sits on a wrapper that has the natural layout width */}
            <div ref={innerRef} style={{
              height: '100%',
              width: 'max-content',
              display: 'flex',
              flexDirection: 'row',
              gap: '12px',
            }}>
              {/* hero card — 50vw */}
              {featured[0] && (
                <div style={{ flexShrink: 0, width: '50vw', height: '100%' }}>
                  <BlogCard {...featured[0]} />
                </div>
              )}

              {/* remaining cards — 2-row grid, auto columns at 500px */}
              <div style={{
                flexShrink: 0,
                height: '100%',
                display: 'grid',
                gridTemplateRows: 'repeat(2, 1fr)',
                gridAutoFlow: 'column',
                gridAutoColumns: '500px',
                gap: '12px',
              }}>
                {featured.slice(1, 13).map(post => (
                  <div key={post.slug} style={{ minHeight: 0 }}>
                    <BlogCard {...post} />
                  </div>
                ))}

                {/* End-of-track CTA — spans both rows */}
                <div style={{ gridRow: '1 / -1', minHeight: 0 }}>
                  <Link
                    href="/blogs"
                    style={{ height: '100%' }}
                    className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-white/8 bg-white/2 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all duration-300 group px-12"
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 group-hover:border-cyan-500/40 group-hover:bg-cyan-500/10 transition-all duration-300">
                      <ArrowUpRight className="h-6 w-6 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                    </span>
                    <div className="text-center">
                      <p className="text-xl font-black text-white tracking-tight group-hover:text-cyan-50 transition-colors">
                        Read all posts
                      </p>
                      <p className="mt-1 text-xs font-mono text-gray-600 tracking-widest uppercase">
                        {featured.length} articles &amp; essays
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* bottom bar — progress only */}
        <div style={{
          flexShrink: 0,
          padding: '16px 32px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
        }}>
          <p className="text-[9px] font-mono text-gray-700 tracking-widest uppercase shrink-0">scroll →</p>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
            <motion.div style={{ width: barWidth, position: 'absolute', inset: 0, background: 'rgba(34,211,238,0.5)' }} />
          </div>
        </div>

      </div>
    </div>
  )
}

/* ── Page ───────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div>
      <Hero />
      <ParallaxVideo />

      {/* Marquee tech stack — full bleed */}
      <TechExpertise />

{/* Experience + Projects — shared subtle grid background */}
      <div className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        {/* Experience — constrained reading width */}
        <section className="relative mx-auto max-w-4xl px-6 py-14">
          <SectionHeader title="Professional Experience" eyebrow="Where I've shipped" href="/experience" />
          <div className="grid gap-6">
            {experiences.slice(0, 2).map((company, i) => (
              <ExperienceCard company={company} key={i} />
            ))}
          </div>
        </section>

        {/* Projects — full width, like the portfolio grid */}
        <section className="relative mx-auto max-w-7xl px-6 py-14">
          <SectionHeader title="Featured Projects" eyebrow="Selected work" href="/portfolio" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="md:col-span-3">
              <FeaturedProjectCard project={projects[0]} tall />
            </div>
            {projects.slice(1, 4).map((project, i) => (
              <FeaturedProjectCard project={project} key={i} />
            ))}
          </div>
        </section>

      </div>

      {/* Horizontal scroll blog section — full bleed */}
      <BlogScrollSection />

      <HowIWork />
    </div>
  );
}
