import Link from 'next/link'
import { links, socialLinks } from '@/mock-data'
import { ArrowUpRight } from 'lucide-react'

type NavLink = { href: string; label: string }
type SocialLink = { href: string; label: string; icon: React.ElementType }

const _cn = [
  { x: 60,   y: 80 }, { x: 200,  y: 40 }, { x: 360,  y: 100 }, { x: 520,  y: 45 },
  { x: 680,  y: 105 },{ x: 840,  y: 55 }, { x: 1000, y: 115 }, { x: 1150, y: 70 },
  { x: 1280, y: 95 }, { x: 130,  y: 158 },{ x: 290,  y: 168 }, { x: 450,  y: 150 },
  { x: 610,  y: 172 },{ x: 770,  y: 155 },{ x: 930,  y: 165 }, { x: 1080, y: 152 },
]
const _ce = [
  [0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],
  [9,10],[10,11],[11,12],[12,13],[13,14],[14,15],
  [0,9],[1,10],[2,11],[3,12],[4,13],[5,14],[6,15],
]
function CTANodes() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1400 210"
      className="absolute inset-0 w-full h-full text-white"
      style={{ opacity: 0.06 }}
      preserveAspectRatio="xMidYMid slice"
    >
      {_ce.map((edge, i) => (
        <line key={i}
          x1={_cn[edge[0]].x} y1={_cn[edge[0]].y}
          x2={_cn[edge[1]].x} y2={_cn[edge[1]].y}
          stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.6"
        />
      ))}
      {_cn.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r="3"
          fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.8"
        />
      ))}
    </svg>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/5">

      {/* ── CTA strip ──────────────────────────────────────────────── */}
      <div className="border-b border-white/5 py-20 px-6 text-center relative overflow-hidden">
        {/* Subtle grid bg */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-40 bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none" />
        {/* Node graph */}
        <CTANodes />

        <div className="relative">
          <p className="text-[10px] font-mono text-cyan-500/60 tracking-[0.25em] uppercase mb-4">
            Get in touch
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
            Let&apos;s build something.
          </h2>
          <p className="text-gray-500 text-sm max-w-sm mx-auto mb-8 leading-relaxed">
            Tell me what you&apos;re working on. I&apos;ll tell you how I can help.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-bold tracking-widest uppercase px-8 py-3.5 rounded-full transition-colors duration-200"
          >
            Start a conversation
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-gray-700 mt-5 tracking-wide">
            Typically respond within 24 hours
          </p>
        </div>
      </div>

      {/* ── Main grid ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3">

        {/* Col 1 — Contact */}
        <div className="px-8 py-10 border-b md:border-b-0 md:border-r border-white/5">
          <p className="text-[10px] font-mono text-gray-700 tracking-[0.22em] uppercase mb-7">
            Contact
          </p>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] text-gray-700 tracking-widest uppercase mb-1">Email</p>
              <a
                href="mailto:md.c.alamin00@gmail.com"
                className="text-sm text-gray-300 hover:text-cyan-400 transition-colors duration-150"
              >
                md.c.alamin00@gmail.com
              </a>
            </div>
            <div>
              <p className="text-[10px] text-gray-700 tracking-widest uppercase mb-1">Location</p>
              <p className="text-sm text-gray-500">Dhaka, Bangladesh</p>
              <p className="text-xs text-gray-700 mt-0.5">Available for remote work</p>
            </div>
          </div>
        </div>

        {/* Col 2 — Navigate */}
        <div className="px-8 py-10 border-b md:border-b-0 md:border-r border-white/5">
          <p className="text-[10px] font-mono text-gray-700 tracking-[0.22em] uppercase mb-7">
            Navigate
          </p>
          <ul className="space-y-3">
            {(links as NavLink[]).map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm text-gray-500 hover:text-white transition-colors duration-150"
                >
                  {label}
                </Link>
              </li>
            ))}
            <li className="pt-1">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1 text-sm text-cyan-500 hover:text-cyan-400 transition-colors duration-150"
              >
                Hire Me
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3 — Social + brand */}
        <div className="px-8 py-10 flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-mono text-gray-700 tracking-[0.22em] uppercase mb-7">
              Social
            </p>
            <ul className="space-y-3">
              {(socialLinks as SocialLink[]).map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="group inline-flex items-center gap-2.5 text-sm text-gray-500 hover:text-cyan-400 transition-colors duration-150"
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{label}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-y-px transition-opacity duration-150" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Faint brand watermark */}
          <p className="mt-10 text-4xl font-black tracking-tighter select-none"
            style={{ color: 'rgba(255,255,255,0.04)' }}>
            MD<span style={{ color: 'rgba(34,211,238,0.06)' }}>.</span>
          </p>
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────────────── */}
      <div className="border-t border-white/5 px-8 py-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-gray-700">
          © {year} MD Alamin. All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-green-400 tracking-widest uppercase">
            Open to work
          </span>
        </div>
      </div>

    </footer>
  )
}
