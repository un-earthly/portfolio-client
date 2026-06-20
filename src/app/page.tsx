'use client'
import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { SectionHeader } from "@/components/ui/section-header";
import { ArrowUpRight } from 'lucide-react'
import Link from "next/link";
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
      <img
        src={project.image}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
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
type BlogCardData = { slug: string; title: string; excerpt: string; readTime: number; type: 'technical' | 'hot-take'; tags: string[] }

const FEATURED_BLOGS: BlogCardData[] = [
  {
    slug: 'legacy-system-modernization-vbnet-nuxtjs-case-study',
    title: 'I Modernized a 20-Year-Old VB.NET System Without Burning the Business Down',
    excerpt: 'Migrating a VB.NET monolith to Nuxt.js while the business ran uninterrupted — 95% load time reduction.',
    readTime: 20, type: 'technical', tags: ['legacy modernization', 'VB.NET'],
  },
  {
    slug: 'ai-replacing-mid-level-developers-not-juniors',
    title: 'Junior Devs Are Not Losing Jobs to AI. Mid-Level Devs Are.',
    excerpt: "AI is compressing the mid-level skill premium out of existence. Here's what's actually happening on engineering teams.",
    readTime: 8, type: 'hot-take', tags: ['AI', 'career'],
  },
  {
    slug: 'building-rust-tui-api-monitor-part-1-ownership',
    title: 'I Tried to Print a Variable Twice and Rust Refused',
    excerpt: 'Building a terminal API monitor in Rust — stopped cold on day one by the borrow checker.',
    readTime: 13, type: 'technical', tags: ['Rust', 'ownership'],
  },
  {
    slug: 'bloom-filters-vs-hash-sets-deep-dive-benchmarks',
    title: 'Bloom Filters vs Hash Sets: Why the Wrong Choice Costs You Millions of DB Calls',
    excerpt: 'At ten million items, a Bloom filter uses 9 MB where a hash set uses 320 MB.',
    readTime: 12, type: 'technical', tags: ['bloom filter', 'system design'],
  },
  {
    slug: 'typescript-wrong-usage-type-safety-best-practices',
    title: "Stop Using TypeScript Like It's JavaScript With Spellcheck",
    excerpt: "The `any` type is a lie you tell TypeScript so it stops asking questions.",
    readTime: 11, type: 'hot-take', tags: ['TypeScript', 'best practices'],
  },
  {
    slug: 'consistent-hashing-deep-dive-implementation-benchmarks',
    title: 'Consistent Hashing: The Algorithm That Keeps Million-User Apps From Falling Over',
    excerpt: 'When you add one server and your app goes down, the culprit is almost always naive load distribution.',
    readTime: 14, type: 'technical', tags: ['consistent hashing', 'distributed systems'],
  },
  {
    slug: 'hyperloglog-deep-dive-implementation-benchmarks',
    title: 'HyperLogLog: How Spotify Counts 600 Million Users With 12 Kilobytes of Memory',
    excerpt: 'HyperLogLog estimates distinct element counts in O(log log N) memory — 12 KB and ~1.3% error across cardinalities up to 10 billion.',
    readTime: 13, type: 'technical', tags: ['HyperLogLog', 'probabilistic data structures'],
  },
  {
    slug: 'multi-agent-ai-system-openai-local-llm-business-automation',
    title: 'I Built a Multi-Agent AI System That Runs My Business While I Sleep',
    excerpt: 'A four-agent system on local LLMs with zero cloud AI cost — automating operations end-to-end.',
    readTime: 16, type: 'technical', tags: ['AI agents', 'automation'],
  },
  {
    slug: 'ai-coding-tools-github-copilot-claude-engineering-quality',
    title: "AI Coding Tools Don't Make You a Better Engineer. They Make Visible Whether You Already Were One.",
    excerpt: 'GitHub Copilot and Claude do not make all engineers equally capable. They make the gap wider and faster to observe.',
    readTime: 9, type: 'hot-take', tags: ['AI coding tools', 'engineering quality'],
  },
  {
    slug: 'debugging-mental-models-software-engineering-skills',
    title: "The Best Debugging Skill Is Not Reading Stack Traces. It's Building Mental Models.",
    excerpt: 'Two engineers face the same bug. One resolves it in 20 minutes, the other in three hours. Same logs, same debugger — different mental models.',
    readTime: 9, type: 'hot-take', tags: ['debugging', 'mental models'],
  },
  {
    slug: 'ble-mesh-offline-event-platform-javascript',
    title: 'How I Built an Offline-First Event Platform Using BLE Mesh Networking',
    excerpt: 'Most apps assume the internet exists. I built one that does not — BLE mesh, Kalman-filtered positioning, and hybrid transport.',
    readTime: 22, type: 'technical', tags: ['BLE mesh', 'offline-first'],
  },
  {
    slug: 'clean-code-overrated-pragmatic-engineering-productivity',
    title: '"Clean Code" Is Killing Your Productivity and Your Team Doesn\'t Know It',
    excerpt: 'Clean Code has sold millions of copies. It\'s also responsible for some of the most over-engineered, slow-to-ship codebases I\'ve seen.',
    readTime: 9, type: 'hot-take', tags: ['clean code', 'pragmatism'],
  },
]

function BlogCard({ slug, title, excerpt, readTime, type, tags }: BlogCardData) {
  return (
    <Link
      href={`/blogs/${slug}`}
      className="group flex flex-col justify-between h-full rounded-2xl border border-white/8 bg-white/2 hover:border-cyan-500/30 hover:bg-white/4 transition-all duration-300 p-5"
    >
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
    </Link>
  )
}

/* ── Blog horizontal scroll section ────────────────────────── */
function BlogScrollSection() {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)   // measures real content width
  const [scrollDist, setScrollDist] = React.useState(0)

  React.useEffect(() => {
    const CARD_W = 500
    const GAP = 12
    const PL = 32
    const PR = 64
    const remainingCards = FEATURED_BLOGS.length - 1
    const cols = Math.ceil(remainingCards / 2)

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
  }, [])

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
          <p className="text-[10px] font-mono text-gray-700">{FEATURED_BLOGS.length} articles &amp; essays</p>
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
              <div style={{ flexShrink: 0, width: '50vw', height: '100%' }}>
                <BlogCard {...FEATURED_BLOGS[0]} />
              </div>

              {/* remaining cards — 2-row grid, auto columns at 240px */}
              <div style={{
                flexShrink: 0,
                height: '100%',
                display: 'grid',
                gridTemplateRows: 'repeat(2, 1fr)',
                gridAutoFlow: 'column',
                gridAutoColumns: '500px',
                gap: '12px',
              }}>
                {FEATURED_BLOGS.slice(1).map(post => (
                  <div key={post.slug} style={{ minHeight: 0 }}>
                    <BlogCard {...post} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* bottom bar */}
        <div style={{
          flexShrink: 0,
          padding: '16px 32px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Link
            href="/blogs"
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/4 border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/8 text-xs font-mono text-gray-300 hover:text-white transition-all"
          >
            Read more <ArrowUpRight size={11} />
          </Link>
          <div style={{ flex: 1, margin: '0 24px', height: '1px', background: 'rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
            <motion.div style={{ width: barWidth, position: 'absolute', inset: 0, background: 'rgba(34,211,238,0.5)' }} />
          </div>
          <p className="text-[9px] font-mono text-gray-700 tracking-widest uppercase">scroll →</p>
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

      <div className="mx-auto px-6 lg:px-8 py-8 space-y-8">

        {/* Experience */}
        <section>
          <SectionHeader title="Professional Experience" href="/experience" />
          <div className="grid gap-6">
            {experiences.slice(0, 2).map((company, i) => (
              <ExperienceCard company={company} key={i} />
            ))}
          </div>
        </section>

        {/* Projects */}
        <section>
          <SectionHeader title="Featured Projects" href="/portfolio" />
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <FeaturedProjectCard project={projects[0]} tall />
            </div>
            <FeaturedProjectCard project={projects[1]} />
            <FeaturedProjectCard project={projects[2]} />
          </div>
        </section>

      </div>

      {/* Horizontal scroll blog section — full bleed */}
      <BlogScrollSection />

      <HowIWork />
    </div>
  );
}
