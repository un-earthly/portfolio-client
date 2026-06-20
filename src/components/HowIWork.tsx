'use client'

import { useEffect, useRef, useState } from 'react'
import { CheckCircle, ChevronDown } from 'lucide-react'

interface Phase {
  id: string
  number: string
  title: string
  description: string
  whatHappens: string[]
  outcomes: string[]
}

const phases: Phase[] = [
  {
    id: 'discover',
    number: '01',
    title: 'Discover',
    description:
      "We dig into your existing system before writing a single line. Understanding what's breaking, what's slowing you down, and where the real leverage is.",
    whatHappens: [
      'Codebase and architecture audit',
      'Stakeholder alignment session',
      'Risk and bottleneck mapping',
      'Tech stack evaluation',
    ],
    outcomes: [
      'Clear picture of what needs to change',
      'Shared understanding of scope and risk',
      'A migration or modernization strategy you can act on',
    ],
  },
  {
    id: 'plan',
    number: '02',
    title: 'Plan',
    description:
      'No guesswork. We define the roadmap, sequence the work to minimize disruption, and lock in the approach before build begins.',
    whatHappens: [
      'Phased delivery plan',
      'Technical architecture decisions',
      'Integration and dependency mapping',
      'Milestone and checkpoint definition',
    ],
    outcomes: [
      'A clear roadmap with no-surprise milestones',
      'Stakeholder-aligned priorities',
      "Foundation that the build phase won't need to undo",
    ],
  },
  {
    id: 'build',
    number: '03',
    title: 'Build',
    description:
      'Delivery in stages. You see working software every two weeks. Not at the end.',
    whatHappens: [
      'Feature delivery in short sprints',
      'Regular demos and async progress updates',
      'Continuous feedback integration',
      'Zero-downtime migration practices',
    ],
    outcomes: [
      'A product that becomes real incrementally',
      'Faster feedback cycles',
      "Visibility into what's built, what's next, and why",
    ],
  },
  {
    id: 'ship',
    number: '04',
    title: 'Ship',
    description:
      "Launch is not a handoff. We stay close through deployment, monitoring, and the first weeks in production.",
    whatHappens: [
      'CI/CD and deployment workflows',
      'Monitoring and alerting setup',
      'Launch checklists and release coordination',
      'Post-launch iteration planning',
    ],
    outcomes: [
      'Smooth, lower-risk release',
      'Confidence the system can be maintained and improved',
      "A team that doesn't disappear after go-live",
    ],
  },
]

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How I Work',
  description:
    'Four phases. Transparent milestones. Working software every two weeks.',
  step: phases.map((p, i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name: p.title,
    text: p.description,
  })),
}

/* ── SVG panels ──────────────────────────────────────────────────────────── */

function DiscoverSVG() {
  return (
    <svg viewBox="0 0 320 240" className="w-full h-full" aria-hidden="true">
      {/* Browser frame */}
      <rect x="0" y="0" width="320" height="240" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />
      <rect x="0" y="0" width="320" height="28" rx="8" fill="currentColor" fillOpacity="0.06" />
      <rect x="0" y="20" width="320" height="8" fill="currentColor" fillOpacity="0.06" />
      <circle cx="14" cy="14" r="4" fill="currentColor" fillOpacity="0.2" />
      <circle cx="26" cy="14" r="4" fill="currentColor" fillOpacity="0.2" />
      <circle cx="38" cy="14" r="4" fill="currentColor" fillOpacity="0.2" />
      <rect x="56" y="8" width="180" height="12" rx="6" fill="currentColor" fillOpacity="0.07" />
      {/* Skeleton header */}
      <rect x="16" y="44" width="240" height="14" rx="3" fill="currentColor" fillOpacity="0.1" />
      <rect x="16" y="66" width="160" height="10" rx="3" fill="currentColor" fillOpacity="0.06" />
      {/* Skeleton cards */}
      <rect x="16" y="90" width="130" height="86" rx="6" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
      <rect x="28" y="102" width="60" height="8" rx="2" fill="currentColor" fillOpacity="0.1" />
      <rect x="28" y="118" width="90" height="6" rx="2" fill="currentColor" fillOpacity="0.06" />
      <rect x="28" y="130" width="70" height="6" rx="2" fill="currentColor" fillOpacity="0.05" />
      <rect x="28" y="142" width="80" height="6" rx="2" fill="currentColor" fillOpacity="0.04" />
      <rect x="158" y="90" width="146" height="40" rx="6" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
      <rect x="170" y="102" width="80" height="8" rx="2" fill="currentColor" fillOpacity="0.1" />
      <rect x="170" y="116" width="100" height="6" rx="2" fill="currentColor" fillOpacity="0.06" />
      <rect x="158" y="138" width="146" height="38" rx="6" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
      <rect x="170" y="150" width="60" height="8" rx="2" fill="currentColor" fillOpacity="0.1" />
      <rect x="170" y="164" width="90" height="6" rx="2" fill="currentColor" fillOpacity="0.06" />
      {/* Bottom bar */}
      <rect x="16" y="192" width="288" height="1" rx="1" fill="currentColor" fillOpacity="0.06" />
      <rect x="16" y="202" width="70" height="8" rx="2" fill="currentColor" fillOpacity="0.07" />
      <rect x="94" y="202" width="100" height="8" rx="2" fill="currentColor" fillOpacity="0.05" />
      <rect x="202" y="202" width="60" height="8" rx="2" fill="currentColor" fillOpacity="0.04" />
    </svg>
  )
}

function PlanSVG() {
  const bars = [55, 85, 45, 105, 75, 95, 65]
  const maxBar = 110
  const chartBottom = 162
  const chartH = 90
  return (
    <svg viewBox="0 0 320 240" className="w-full h-full" aria-hidden="true">
      <rect x="0" y="0" width="320" height="240" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />
      <rect x="0" y="0" width="320" height="28" rx="8" fill="currentColor" fillOpacity="0.06" />
      <rect x="0" y="20" width="320" height="8" fill="currentColor" fillOpacity="0.06" />
      <circle cx="14" cy="14" r="4" fill="currentColor" fillOpacity="0.2" />
      <circle cx="26" cy="14" r="4" fill="currentColor" fillOpacity="0.2" />
      <circle cx="38" cy="14" r="4" fill="currentColor" fillOpacity="0.2" />
      <rect x="56" y="8" width="180" height="12" rx="6" fill="currentColor" fillOpacity="0.07" />
      {/* Chart title */}
      <rect x="16" y="40" width="90" height="10" rx="3" fill="currentColor" fillOpacity="0.1" />
      <rect x="220" y="40" width="84" height="10" rx="3" fill="currentColor" fillOpacity="0.06" />
      {/* Y-axis guide lines */}
      {[0, 1, 2, 3].map(i => (
        <line
          key={i}
          x1="16"
          y1={chartBottom - (chartH / 3) * i}
          x2="304"
          y2={chartBottom - (chartH / 3) * i}
          stroke="currentColor"
          strokeOpacity="0.06"
          strokeWidth="1"
        />
      ))}
      {/* Bars */}
      {bars.map((h, i) => {
        const w = 28
        const gap = 10
        const x = 22 + i * (w + gap)
        const height = (h / maxBar) * chartH
        const y = chartBottom - height
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={w}
            height={height}
            rx="3"
            fill={i === 3 ? '#22d3ee' : 'currentColor'}
            fillOpacity={i === 3 ? 0.65 : 0.13}
          />
        )
      })}
      {/* X axis */}
      <line x1="16" y1={chartBottom + 1} x2="304" y2={chartBottom + 1} stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" />
      {/* X labels */}
      {bars.map((_, i) => (
        <rect key={i} x={22 + i * 38} y={chartBottom + 8} width={24} height="6" rx="2" fill="currentColor" fillOpacity="0.06" />
      ))}
      {/* Legend */}
      <rect x="16" y="202" width="50" height="8" rx="2" fill="currentColor" fillOpacity="0.08" />
      <rect x="74" y="202" width="80" height="8" rx="2" fill="currentColor" fillOpacity="0.05" />
      <rect x="8" y="8" width="1" height="1" fill="none" />
    </svg>
  )
}

function BuildSVG() {
  const pts = [20, 28, 45, 38, 62, 55, 78, 68, 92, 80]
  const chartX = 20
  const chartY = 76
  const chartW = 280
  const chartH = 70
  const pcount = pts.length
  const polyline = pts
    .map((v, i) => `${chartX + (i / (pcount - 1)) * chartW},${chartY + chartH - (v / 100) * chartH}`)
    .join(' ')
  const area = `${chartX},${chartY + chartH} ${polyline} ${chartX + chartW},${chartY + chartH}`
  return (
    <svg viewBox="0 0 320 240" className="w-full h-full" aria-hidden="true">
      <rect x="0" y="0" width="320" height="240" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />
      <rect x="0" y="0" width="320" height="28" rx="8" fill="currentColor" fillOpacity="0.06" />
      <rect x="0" y="20" width="320" height="8" fill="currentColor" fillOpacity="0.06" />
      <circle cx="14" cy="14" r="4" fill="currentColor" fillOpacity="0.2" />
      <circle cx="26" cy="14" r="4" fill="currentColor" fillOpacity="0.2" />
      <circle cx="38" cy="14" r="4" fill="currentColor" fillOpacity="0.2" />
      <rect x="56" y="8" width="180" height="12" rx="6" fill="currentColor" fillOpacity="0.07" />
      {/* Stat chips */}
      <rect x="16" y="38" width="82" height="26" rx="6" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
      <rect x="106" y="38" width="82" height="26" rx="6" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
      <rect x="196" y="38" width="108" height="26" rx="6" fill="#22d3ee" fillOpacity="0.07" stroke="rgba(34,211,238,0.2)" strokeWidth="1" />
      <rect x="26" y="48" width="40" height="7" rx="2" fill="currentColor" fillOpacity="0.12" />
      <rect x="116" y="48" width="40" height="7" rx="2" fill="currentColor" fillOpacity="0.1" />
      <rect x="206" y="48" width="50" height="7" rx="2" fill="#22d3ee" fillOpacity="0.3" />
      {/* Grid */}
      {[0, 1, 2, 3].map(i => (
        <line key={i} x1={chartX} y1={chartY + (chartH / 3) * i} x2={chartX + chartW} y2={chartY + (chartH / 3) * i} stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" />
      ))}
      {/* Area */}
      <polygon points={area} fill="#22d3ee" fillOpacity="0.06" />
      {/* Line */}
      <polyline points={polyline} fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeOpacity="0.75" strokeLinejoin="round" strokeLinecap="round" />
      {/* Endpoint dot */}
      <circle
        cx={chartX + chartW}
        cy={chartY + chartH - (pts[pts.length - 1] / 100) * chartH}
        r="3"
        fill="#22d3ee"
        fillOpacity="0.9"
      />
      {/* Bottom table rows */}
      <line x1="16" y1="160" x2="304" y2="160" stroke="currentColor" strokeOpacity="0.07" strokeWidth="1" />
      {[0, 1, 2].map(i => (
        <g key={i}>
          <rect x="16" y={168 + i * 20} width="50" height="7" rx="2" fill="currentColor" fillOpacity="0.08" />
          <rect x="74" y={168 + i * 20} width="90" height="7" rx="2" fill="currentColor" fillOpacity="0.05" />
          <rect x="172" y={168 + i * 20} width="60" height="7" rx="2" fill="currentColor" fillOpacity="0.05" />
          <rect x="240" y={168 + i * 20} width="64" height="7" rx="2" fill={i === 0 ? '#22d3ee' : 'currentColor'} fillOpacity={i === 0 ? 0.2 : 0.04} />
        </g>
      ))}
    </svg>
  )
}

function ShipSVG() {
  return (
    <svg viewBox="0 0 320 240" className="w-full h-full" aria-hidden="true">
      <rect x="0" y="0" width="320" height="240" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />
      <rect x="0" y="0" width="320" height="28" rx="8" fill="currentColor" fillOpacity="0.06" />
      <rect x="0" y="20" width="320" height="8" fill="currentColor" fillOpacity="0.06" />
      <circle cx="14" cy="14" r="4" fill="currentColor" fillOpacity="0.2" />
      <circle cx="26" cy="14" r="4" fill="currentColor" fillOpacity="0.2" />
      <circle cx="38" cy="14" r="4" fill="currentColor" fillOpacity="0.2" />
      <rect x="56" y="8" width="180" height="12" rx="6" fill="currentColor" fillOpacity="0.07" />
      {/* Uptime section */}
      <rect x="16" y="38" width="80" height="8" rx="2" fill="currentColor" fillOpacity="0.1" />
      <rect x="230" y="36" width="74" height="12" rx="4" fill="#22d3ee" fillOpacity="0.15" stroke="rgba(34,211,238,0.25)" strokeWidth="1" />
      <rect x="238" y="40" width="40" height="5" rx="2" fill="#22d3ee" fillOpacity="0.45" />
      {/* Uptime progress bar */}
      <rect x="16" y="54" width="288" height="10" rx="5" fill="currentColor" fillOpacity="0.07" />
      <rect x="16" y="54" width="272" height="10" rx="5" fill="#22d3ee" fillOpacity="0.45" />
      <rect x="16" y="70" width="40" height="7" rx="2" fill="currentColor" fillOpacity="0.07" />
      <rect x="260" y="70" width="44" height="7" rx="2" fill="#22d3ee" fillOpacity="0.35" />
      {/* Deploy status card */}
      <rect x="16" y="86" width="288" height="56" rx="8" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
      <circle cx="40" cy="114" r="9" fill="#22d3ee" fillOpacity="0.12" stroke="rgba(34,211,238,0.35)" strokeWidth="1" />
      <circle cx="40" cy="114" r="3.5" fill="#22d3ee" fillOpacity="0.85" />
      <rect x="58" y="103" width="90" height="8" rx="2" fill="currentColor" fillOpacity="0.1" />
      <rect x="58" y="118" width="130" height="7" rx="2" fill="currentColor" fillOpacity="0.06" />
      <rect x="224" y="100" width="68" height="22" rx="5" fill="#22d3ee" fillOpacity="0.12" stroke="rgba(34,211,238,0.25)" strokeWidth="1" />
      <rect x="232" y="108" width="40" height="6" rx="2" fill="#22d3ee" fillOpacity="0.4" />
      {/* Metric bars */}
      {[
        { label: 150, fill: 260, accent: false },
        { label: 150, fill: 240, accent: true },
        { label: 150, fill: 200, accent: false },
      ].map(({ label, fill, accent }, i) => (
        <g key={i}>
          <rect x="16" y={152 + i * 24} width={label} height="14" rx="3" fill="currentColor" fillOpacity="0.04" />
          <rect x="16" y={152 + i * 24} width={fill} height="14" rx="3" fill="currentColor" fillOpacity="0.07" />
          <rect x={fill} y={152 + i * 24} width={304 - fill} height="14" rx="3" fill={accent ? '#22d3ee' : 'currentColor'} fillOpacity={accent ? 0.22 : 0.03} />
          <rect x="22" y={152 + i * 24 + 4} width="70" height="6" rx="2" fill="currentColor" fillOpacity="0.1" />
        </g>
      ))}
    </svg>
  )
}

const phaseSVGs = [DiscoverSVG, PlanSVG, BuildSVG, ShipSVG]

/* ── Phase background patterns (desktop center column) ──────────────────── */

function DiscoverPattern() {
  const pts: { x: number; y: number }[] = []
  for (let x = 20; x <= 490; x += 28) {
    for (let y = 20; y <= 690; y += 28) {
      pts.push({ x, y })
    }
  }
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 500 700"
      className="absolute inset-0 w-full h-full text-slate-600"
      preserveAspectRatio="xMidYMid slice"
      style={{ opacity: 0.07, pointerEvents: 'none' }}
    >
      {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="1.5" fill="currentColor" />)}
    </svg>
  )
}

function PlanPattern() {
  const ys = [60, 150, 240, 330, 420, 510, 600, 680]
  const ticks = [
    { x: 40, y: 60 }, { x: 160, y: 60 }, { x: 280, y: 60 }, { x: 400, y: 60 },
    { x: 80, y: 240 }, { x: 200, y: 240 }, { x: 320, y: 240 }, { x: 440, y: 240 },
    { x: 60, y: 420 }, { x: 180, y: 420 }, { x: 300, y: 420 }, { x: 420, y: 420 },
    { x: 100, y: 600 }, { x: 220, y: 600 }, { x: 340, y: 600 },
  ]
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 500 700"
      className="absolute inset-0 w-full h-full text-slate-600"
      preserveAspectRatio="xMidYMid slice"
      style={{ opacity: 0.07, pointerEvents: 'none' }}
    >
      {ys.map((y, i) => (
        <line key={i} x1="20" y1={y} x2="480" y2={y} stroke="currentColor" strokeWidth="1" />
      ))}
      {ticks.map((t, i) => (
        <line key={i} x1={t.x} y1={t.y - 9} x2={t.x} y2={t.y + 9} stroke="currentColor" strokeWidth="1.5" />
      ))}
    </svg>
  )
}

function BuildPattern() {
  const pairs: { x: number; y: number }[] = []
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 8; row++) {
      pairs.push({ x: 30 + col * 120, y: 40 + row * 84 })
    }
  }
  const h = 20
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 500 700"
      className="absolute inset-0 w-full h-full text-slate-600"
      preserveAspectRatio="xMidYMid slice"
      style={{ opacity: 0.08, pointerEvents: 'none' }}
    >
      {pairs.map((p, i) => (
        <g key={i}>
          <polyline
            points={`${p.x + 8},${p.y} ${p.x},${p.y} ${p.x},${p.y + h} ${p.x + 8},${p.y + h}`}
            fill="none" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"
          />
          <polyline
            points={`${p.x + 34},${p.y} ${p.x + 42},${p.y} ${p.x + 42},${p.y + h} ${p.x + 34},${p.y + h}`}
            fill="none" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"
          />
        </g>
      ))}
    </svg>
  )
}

function ShipPattern() {
  const radii = [80, 140, 200, 260, 320, 380, 440]
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 500 700"
      className="absolute inset-0 w-full h-full text-slate-600"
      preserveAspectRatio="xMidYMid slice"
      style={{ opacity: 0.07, pointerEvents: 'none' }}
    >
      {radii.map((rx, i) => (
        <ellipse
          key={i}
          cx="250" cy="700"
          rx={rx} ry={rx * 0.5}
          fill="none" stroke="currentColor" strokeWidth="1"
        />
      ))}
    </svg>
  )
}

/* ── Hooks ───────────────────────────────────────────────────────────────── */

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reduced
}

/* ── Mobile accordion item ───────────────────────────────────────────────── */

function MobilePhase({
  phase,
  index,
  defaultOpen,
}: {
  phase: Phase
  index: number
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(!!defaultOpen)
  const SVG = phaseSVGs[index]

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/30 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`process-${phase.id}-content`}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-cyan-500/70 w-5 shrink-0">{phase.number}</span>
          <span className="text-sm font-bold text-gray-100">{phase.title}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <section
          id={`process-${phase.id}-content`}
          aria-label={`Phase ${phase.number}: ${phase.title}`}
          className="px-5 pb-5 border-t border-slate-800"
        >
          <p className="pt-4 mb-5 text-gray-400 text-sm leading-relaxed">{phase.description}</p>

          <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3 mb-5 text-slate-600">
            <SVG />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <h4 className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-2.5">
                What Happens
              </h4>
              <ul className="space-y-2">
                {phase.whatHappens.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-gray-400 text-xs">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-cyan-500/50 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-2.5">
                Outcome
              </h4>
              <ul className="space-y-2">
                {phase.outcomes.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-gray-400 text-xs">
                    <CheckCircle className="w-3 h-3 text-cyan-500/60 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

/* ── Main component ──────────────────────────────────────────────────────── */

export function HowIWork() {
  const [activeStep, setActiveStep] = useState(0)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const observers = sectionRefs.current.map((ref, i) => {
      if (!ref) return null
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveStep(i)
          })
        },
        { threshold: 0.4 }
      )
      obs.observe(ref)
      return obs
    })
    return () => observers.forEach((obs) => obs?.disconnect())
  }, [])

  return (
    <section aria-labelledby="how-i-work-heading" className="border-t border-white/5">
      {/* JSON-LD HowTo schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      {/* Section header — stays pinned while scrolling through the phases */}
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 pt-12 pb-4 text-center">
          <h2
            id="how-i-work-heading"
            className="text-3xl font-bold text-white mb-3"
          >
            How I Work
          </h2>
          <p className="text-gray-500 text-sm tracking-wide max-w-sm mx-auto">
            Four phases. Transparent milestones. Working software every two weeks.
          </p>
        </div>
      </div>

      {/* ── Desktop: three-column sticky-scroll ─────────────────────────── */}
      <div className="hidden md:block max-w-7xl mx-auto px-6 lg:px-16 pb-24">
        <div className="grid grid-cols-[180px_1fr_280px] gap-10 lg:gap-16 items-start">

          {/* Left — sticky step navigator */}
          <nav aria-label="Process phases" className="sticky top-24 self-start pt-16">
            <ol className="space-y-1" role="list">
              {phases.map((phase, i) => {
                const isActive = activeStep === i
                const isDone = activeStep > i
                return (
                  <li key={phase.id}>
                    <a
                      href={`#process-${phase.id}`}
                      onClick={(e) => {
                        e.preventDefault()
                        document
                          .getElementById(`process-${phase.id}`)
                          ?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
                      }}
                      className={[
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 border',
                        isActive
                          ? 'bg-cyan-500/10 border-cyan-500/20'
                          : 'border-transparent hover:bg-slate-800/40',
                      ].join(' ')}
                    >
                      <span
                        className={[
                          'text-xs font-mono font-bold w-6 text-center transition-colors duration-200',
                          isActive
                            ? 'text-cyan-400'
                            : isDone
                              ? 'text-cyan-600/70'
                              : 'text-gray-600',
                        ].join(' ')}
                      >
                        {isDone ? '✓' : phase.number}
                      </span>
                      <span
                        className={[
                          'text-sm font-medium transition-colors duration-200',
                          isActive ? 'text-white' : isDone ? 'text-gray-500' : 'text-gray-600',
                        ].join(' ')}
                      >
                        {phase.title}
                      </span>
                    </a>
                  </li>
                )
              })}
            </ol>
          </nav>

          {/* Center — scrollable phase sections */}
          <div>
            {phases.map((phase, i) => (
              <section
                key={phase.id}
                id={`process-${phase.id}`}
                ref={(el) => { sectionRefs.current[i] = el }}
                aria-label={`Phase ${phase.number}: ${phase.title}`}
                className="relative overflow-hidden flex flex-col justify-center py-16 border-t border-white/5 first:border-t-0"
              >
                {i === 0 && <DiscoverPattern />}
                {i === 1 && <PlanPattern />}
                {i === 2 && <BuildPattern />}
                {i === 3 && <ShipPattern />}
                <div className="relative z-10 max-w-lg">
                  <span className="text-xs font-mono text-cyan-500/50 tracking-widest uppercase mb-3 block">
                    Phase {phase.number}
                  </span>
                  <h3 className="text-4xl font-black text-white tracking-tight mb-5">
                    {phase.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed mb-10 text-[1.05rem]">
                    {phase.description}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-3">
                        What Happens
                      </h4>
                      <ul className="space-y-2.5">
                        {phase.whatHappens.map((item, j) => (
                          <li key={j} className="flex items-start gap-2.5 text-gray-400 text-[0.9375rem]">
                            <span className="mt-2 w-1 h-1 rounded-full bg-cyan-500/50 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-3">
                        Outcome
                      </h4>
                      <ul className="space-y-2.5">
                        {phase.outcomes.map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-gray-400 text-[0.9375rem]">
                            <CheckCircle className="w-3.5 h-3.5 text-cyan-500/60 shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>

          {/* Right — sticky SVG illustration panel */}
          <div className="sticky top-24 self-start pt-16">
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 overflow-hidden">
              {/* SVG stack — all rendered, only active is visible */}
              <div className="relative" style={{ paddingBottom: '75%' }}>
                {phases.map((phase, i) => {
                  const SVG = phaseSVGs[i]
                  const isActive = activeStep === i
                  return (
                    <div
                      key={phase.id}
                      className="absolute inset-0 text-slate-600"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transform: reducedMotion
                          ? undefined
                          : isActive
                            ? 'translateY(0px)'
                            : 'translateY(12px)',
                        transition: reducedMotion
                          ? 'opacity 0ms'
                          : 'opacity 300ms ease, transform 300ms ease',
                        pointerEvents: isActive ? 'auto' : 'none',
                      }}
                      aria-hidden={!isActive}
                    >
                      <SVG />
                    </div>
                  )
                })}
              </div>

              {/* Phase label + step dots */}
              <div className="mt-4 flex items-center gap-2 border-t border-slate-800 pt-3">
                <span className="text-xs font-mono text-cyan-500/70">
                  {phases[activeStep].number}
                </span>
                <span className="text-xs text-gray-700">—</span>
                <span className="text-xs text-gray-500 font-medium">
                  {phases[activeStep].title}
                </span>
                <div className="ml-auto flex gap-1.5">
                  {phases.map((_, i) => (
                    <div
                      key={i}
                      className={[
                        'w-1.5 h-1.5 rounded-full transition-colors duration-300',
                        i === activeStep ? 'bg-cyan-400' : 'bg-slate-700',
                      ].join(' ')}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile: accordion ────────────────────────────────────────────── */}
      <div className="md:hidden max-w-xl mx-auto px-4 pb-16 space-y-3">
        {phases.map((phase, i) => (
          <MobilePhase
            key={phase.id}
            phase={phase}
            index={i}
            defaultOpen={i === 0}
          />
        ))}
      </div>
    </section>
  )
}
