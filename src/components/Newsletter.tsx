'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Mail, Check, Loader2, ArrowRight, X } from 'lucide-react'

// Animation helpers
const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v))
const norm  = (v: number, from: number, to: number) => clamp((v - from) / (to - from))

// How many pixels of real scroll the full animation spans.
// The page scrolls normally underneath; the overlay just happens to be visible.
const EXPERIENCE_PX = typeof window !== 'undefined' ? window.innerHeight * 3.2 : 2400

export function Newsletter() {
  const sentinelRef  = useRef<HTMLDivElement>(null)
  const [phase, setPhase]       = useState(0)
  const [dismissed, setDismissed] = useState(false)
  const [mounted, setMounted]   = useState(false)

  const [email,   setEmail]   = useState('')
  const [company, setCompany] = useState('')
  const [formState, setFormState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [msg,     setMsg]     = useState('')

  useEffect(() => { setMounted(true) }, [])

  const computePhase = useCallback(() => {
    const el = sentinelRef.current
    if (!el || dismissed) return
    // Absolute scroll position of the sentinel from top of document
    const sentinelAbsTop = el.getBoundingClientRect().top + window.scrollY
    // Phase: 0 when sentinel enters view, 1 after EXPERIENCE_PX of scrolling
    const raw = (window.scrollY - sentinelAbsTop) / EXPERIENCE_PX
    setPhase(clamp(raw))
  }, [dismissed])

  useEffect(() => {
    window.addEventListener('scroll', computePhase, { passive: true })
    computePhase()
    return () => window.removeEventListener('scroll', computePhase)
  }, [computePhase])

  const dismiss = () => setDismissed(true)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formState === 'loading') return
    setFormState('loading'); setMsg('')
    try {
      const r = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, company }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Something went wrong.')
      setFormState('done')
    } catch (err) {
      setFormState('error')
      setMsg(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  // ── Derived animation values (all 0 when dismissed) ──────────

  // Overlay fades in over first 8% of phase, out over last 8%
  const overlayOp = dismissed ? 0 : norm(phase, 0, 0.08) * (phase > 0.92 ? norm(phase, 1, 0.92) : 1)

  // Heading: fades in at 0.06, full at 0.14
  const headingOp   = dismissed ? 0 : norm(phase, 0.06, 0.14)
  // Heading rises from center: 0 lift at 0.14, −26vh lift at 0.42
  const headingLift = dismissed ? 0 : norm(phase, 0.14, 0.42) * -26 // vh

  // Description: 0.28 → 0.38
  const descOp = dismissed ? 0 : norm(phase, 0.28, 0.38)
  const descY  = (1 - descOp) * 16

  // Form: 0.38 → 0.50
  const formOp = dismissed ? 0 : norm(phase, 0.38, 0.50)
  const formY  = (1 - formOp) * 16

  const overlayVisible = overlayOp > 0.005

  const overlay = (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: overlayOp,
        pointerEvents: overlayOp > 0.5 ? 'auto' : 'none',
        willChange: 'opacity',
      }}
    >
      {/* Solid dark background */}
      <div style={{ position: 'absolute', inset: 0, background: '#050a10' }} />

      {/* Subtle grid texture */}
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.025,
          backgroundImage:
            'linear-gradient(rgba(6,182,212,1) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Cyan glow orb */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', width: '32rem', height: '16rem',
        transform: 'translate(-50%, -50%)', borderRadius: '9999px',
        background: 'rgba(6,182,212,0.05)', filter: 'blur(120px)', pointerEvents: 'none',
      }} />

      {/* Dismiss button */}
      <button
        onClick={dismiss}
        aria-label="Dismiss newsletter"
        style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Content */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '36rem', padding: '0 1.5rem', textAlign: 'center' }}>

        {/* Heading — starts dead center, rises as scroll continues */}
        <div style={{
          opacity: headingOp,
          transform: `translateY(${headingLift}vh)`,
          willChange: 'transform, opacity',
        }}>
          <span className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
            <Mail className="h-5 w-5" />
          </span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            Get new posts by email
          </h2>
        </div>

        {/* Description */}
        <div style={{
          opacity: descOp,
          transform: `translateY(calc(${headingLift}vh + ${descY}px))`,
          willChange: 'transform, opacity',
        }}>
          <p className="mx-auto mt-4 mb-8 max-w-sm text-sm leading-relaxed text-gray-500">
            Notes on systems, performance, and shipping software that lasts.
            A few emails a month. Unsubscribe anytime.
          </p>
        </div>

        {/* Form */}
        <div style={{
          opacity: formOp,
          transform: `translateY(calc(${headingLift}vh + ${formY}px))`,
          willChange: 'transform, opacity',
        }}>
          {formState === 'done' ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-300">
              <Check className="h-4 w-4" /> You&apos;re subscribed.
            </div>
          ) : (
            <form onSubmit={submit} className="mx-auto flex max-w-md flex-col gap-2 sm:flex-row">
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="flex-1 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-gray-600 focus:border-cyan-500/40 focus:outline-none"
              />
              <input
                type="text" name="company" tabIndex={-1} autoComplete="off"
                aria-hidden="true" value={company}
                onChange={e => setCompany(e.target.value)}
                style={{ display: 'none' }}
              />
              <button
                type="submit" disabled={formState === 'loading'}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-500 px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-cyan-400 disabled:opacity-60"
              >
                {formState === 'loading'
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <>Subscribe <ArrowRight className="h-4 w-4" /></>}
              </button>
            </form>
          )}
          {formState === 'error' && (
            <p className="mt-3 text-xs text-red-400/80">{msg}</p>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/*
        Zero-height sentinel — the only thing in the document flow.
        No margin, no padding, no height. It marks where in the scroll
        journey the overlay should begin to appear.
      */}
      <div ref={sentinelRef} style={{ height: 0, overflow: 'hidden' }} aria-hidden="true" />

      {/* Portal renders the overlay directly into document.body — fully outside the page layout */}
      {mounted && overlayVisible && createPortal(overlay, document.body)}
    </>
  )
}
