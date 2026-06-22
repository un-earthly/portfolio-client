'use client'
import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Mail, Check, Loader2, ArrowRight } from 'lucide-react'

// Newsletter signup that slides in as it scrolls into view.
export function Newsletter() {
  const reduced = useReducedMotion() ?? false
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('') // honeypot
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (state === 'loading') return
    setState('loading'); setMsg('')
    try {
      const r = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, company }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Something went wrong.')
      setState('done')
    } catch (err) {
      setState('error')
      setMsg(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  return (
    <motion.section
      initial={reduced ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden border-b border-white/5 px-6 py-16"
    >
      {/* grid + glow background, matching the site */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-40 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-[80px]" />

      <div className="relative mx-auto max-w-xl text-center">
        <span className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
          <Mail className="h-5 w-5" />
        </span>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
          Get new posts by email
        </h2>
        <p className="mx-auto mt-2 mb-7 max-w-sm text-sm leading-relaxed text-gray-500">
          Notes on systems, performance, and shipping software that lasts. A few emails a month. Unsubscribe anytime.
        </p>

        {state === 'done' ? (
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-300">
            <Check className="h-4 w-4" /> You&apos;re subscribed.
          </div>
        ) : (
          <form onSubmit={submit} className="mx-auto flex max-w-md flex-col gap-2 sm:flex-row">
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="flex-1 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-gray-600 focus:border-cyan-500/40 focus:outline-none"
            />
            {/* honeypot */}
            <input
              type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true"
              value={company} onChange={(e) => setCompany(e.target.value)}
              className="hidden" style={{ display: 'none' }}
            />
            <button
              type="submit" disabled={state === 'loading'}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-500 px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-cyan-400 disabled:opacity-60"
            >
              {state === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Subscribe <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>
        )}
        {state === 'error' && <p className="mt-3 text-xs text-red-400/80">{msg}</p>}
      </div>
    </motion.section>
  )
}
