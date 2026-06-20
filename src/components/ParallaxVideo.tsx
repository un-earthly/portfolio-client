'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import Link from 'next/link'
import { ArrowUpRight, Star } from 'lucide-react'
import { achievements } from '@/mock-data'

export function ParallaxVideo() {
  const sectionRef = useRef<HTMLElement>(null)

  /*
   * Track scroll relative to this section.
   * offset: ['start end', 'end start']
   *   → progress=0 when section bottom enters viewport from below
   *   → progress=1 when section top exits viewport at the top
   *
   * Video layer is positioned with 150px bleed on top and bottom.
   * y moves within that ±150px window — never clips, always fills.
   */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [150, -150])

  return (
    <section
      ref={sectionRef}
      aria-label="Showreel"
      style={{ position: 'relative', minHeight: '90vh', overflow: 'hidden' }}
    >
      {/* Video layer — 300px taller than container so ±150px y never shows black */}
      <motion.div
        style={{
          y,
          position: 'absolute',
          top: -150,
          bottom: -150,
          left: 0,
          right: 0,
        }}
      >
        <video
          src="/showreel.mp4"
          autoPlay
          muted
          loop
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </motion.div>

      {/* Top fade into hero */}
      <div
        className="absolute inset-x-0 top-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, #000, transparent)', zIndex: 1 }}
      />

      {/* Bottom gradient */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{ height: '70%', zIndex: 1, background: 'linear-gradient(to top, #000 30%, rgba(0,0,0,0.7) 60%, transparent 100%)' }}
      />

      {/* Card */}
      <div className="absolute inset-x-0 bottom-0 px-6 lg:px-8 pb-0" style={{ zIndex: 2 }}>
        <div className="max-w-7xl mx-auto">
          <div
            className="grid md:grid-cols-2 rounded-t-2xl overflow-hidden border border-white/8 border-b-0"
            style={{ backdropFilter: 'blur(24px)', background: 'linear-gradient(135deg, rgba(15,23,42,0.82) 0%, rgba(8,14,30,0.88) 100%)' }}
          >
            <div className="p-8 flex flex-col justify-between border-r border-white/5">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-4">
                  <Star className="h-3 w-3" /> Available for work
                </span>
                <h2 className="text-xl font-bold text-gray-100 leading-snug mb-3">
                  Building systems that scale—<br />
                  <span className="text-cyan-400">without breaking under load.</span>
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                  5+ years turning complex problems into clean, maintainable software.
                  Open to remote backend, full-stack, and leadership roles.
                </p>
              </div>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors group"
              >
                Start a conversation
                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            <div className="p-8 flex flex-col justify-center" style={{ background: 'rgba(6,182,212,0.04)' }}>
              <div className="grid grid-cols-2 gap-3">
                {achievements.slice(0, 4).map((a: { icon: React.ElementType; title: string }, i: number) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-white/6 hover:border-cyan-500/20 transition-colors"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    <a.icon className="h-4 w-4 text-cyan-400 mb-2" />
                    <p className="text-gray-100 text-xs font-semibold leading-snug">{a.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
