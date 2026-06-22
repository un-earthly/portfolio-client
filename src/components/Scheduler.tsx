'use client'
import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Check, Loader2, Video } from 'lucide-react'

type Slot = { start: string; end: string; label: string }

const WD = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const startOfDay = (d: Date) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x }

export function Scheduler() {
  const today = startOfDay(new Date())
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() })
  const [date, setDate] = useState<string | null>(null)
  const [slots, setSlots] = useState<Slot[]>([])
  const [tz, setTz] = useState('')
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [slotError, setSlotError] = useState('')
  const [slot, setSlot] = useState<Slot | null>(null)

  const [form, setForm] = useState({ name: '', email: '', notes: '', company: '' })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState<{ when: string; meetLink: string | null } | null>(null)
  const [formError, setFormError] = useState('')

  // build the month grid
  const first = new Date(view.y, view.m, 1)
  const lead = first.getDay()
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate()
  const cells: (Date | null)[] = [
    ...Array(lead).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(view.y, view.m, i + 1)),
  ]

  useEffect(() => {
    if (!date) return
    setLoadingSlots(true); setSlotError(''); setSlots([]); setSlot(null)
    fetch(`/api/schedule/slots?date=${date}`)
      .then(async (r) => {
        const d = await r.json()
        if (!r.ok) throw new Error(d.error || 'Failed to load slots.')
        setSlots(d.slots); setTz(d.tz)
      })
      .catch((e) => setSlotError(e.message))
      .finally(() => setLoadingSlots(false))
  }, [date])

  const book = async () => {
    if (!slot) return
    if (!form.name.trim() || !form.email.trim()) { setFormError('Name and email are required.'); return }
    setSubmitting(true); setFormError('')
    try {
      const r = await fetch('/api/schedule', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, start: slot.start }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Booking failed.')
      setDone({ when: d.when, meetLink: d.meetLink })
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Booking failed.')
    } finally { setSubmitting(false) }
  }

  const prevDisabled = view.y === today.getFullYear() && view.m === today.getMonth()

  if (done) {
    return (
      <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-400">
          <Check className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-white">You&apos;re booked!</h3>
        <p className="mt-1 text-sm text-gray-400">{done.when}</p>
        <p className="mt-1 text-xs text-gray-600">A calendar invite is on its way to your inbox.</p>
        {done.meetLink && (
          <a href={done.meetLink} target="_blank" rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-cyan-500 px-6 py-2.5 text-sm font-bold text-black transition-colors hover:bg-cyan-400">
            <Video className="h-4 w-4" /> Join Google Meet
          </a>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-white/8 bg-white/2 p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Calendar */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-bold text-white">{MONTHS[view.m]} {view.y}</span>
            <div className="flex gap-1">
              <button
                aria-label="Previous month" disabled={prevDisabled}
                onClick={() => setView((v) => ({ y: v.m === 0 ? v.y - 1 : v.y, m: (v.m + 11) % 12 }))}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
              ><ChevronLeft className="h-4 w-4" /></button>
              <button
                aria-label="Next month"
                onClick={() => setView((v) => ({ y: v.m === 11 ? v.y + 1 : v.y, m: (v.m + 1) % 12 }))}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-white/5 hover:text-white"
              ><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {WD.map((d) => <span key={d} className="py-1 text-[10px] font-mono uppercase text-gray-600">{d}</span>)}
            {cells.map((d, i) => {
              if (!d) return <span key={i} />
              const past = startOfDay(d) < today
              const sel = date === ymd(d)
              return (
                <button
                  key={i} disabled={past}
                  onClick={() => setDate(ymd(d))}
                  className={`aspect-square rounded-lg text-sm transition-colors ${
                    sel ? 'bg-cyan-500 font-bold text-black'
                    : past ? 'text-gray-700 cursor-not-allowed'
                    : 'text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-300'
                  }`}
                >{d.getDate()}</button>
              )
            })}
          </div>
        </div>

        {/* Slots / form */}
        <div className="sm:border-l sm:border-white/5 sm:pl-6">
          {!date && <p className="py-12 text-center text-sm text-gray-600">Pick a date to see open times.</p>}

          {date && !slot && (
            <>
              <p className="mb-3 text-xs font-mono uppercase tracking-wider text-gray-500">
                {new Date(date + 'T00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                {tz && <span className="ml-1 text-gray-700">· {tz}</span>}
              </p>
              {loadingSlots && <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin text-gray-500" /></div>}
              {slotError && <p className="py-8 text-center text-sm text-red-400/80">{slotError}</p>}
              {!loadingSlots && !slotError && slots.length === 0 && (
                <p className="py-10 text-center text-sm text-gray-600">No open times this day.</p>
              )}
              <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto">
                {slots.map((s) => (
                  <button key={s.start} onClick={() => setSlot(s)}
                    className="rounded-lg border border-white/8 bg-white/2 py-2 text-sm text-gray-300 transition-colors hover:border-cyan-500/40 hover:bg-cyan-500/5 hover:text-cyan-300">
                    {s.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {date && slot && (
            <div className="space-y-3">
              <button onClick={() => setSlot(null)} className="text-xs text-cyan-400 hover:text-cyan-300">← change time</button>
              <p className="text-sm text-white">{slot.label}{tz && <span className="text-gray-600"> · {tz}</span>}</p>
              <input
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                className="w-full rounded-lg border border-white/8 bg-white/2 px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:border-cyan-500/40 focus:outline-none"
              />
              <input
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                type="email" placeholder="you@email.com"
                className="w-full rounded-lg border border-white/8 bg-white/2 px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:border-cyan-500/40 focus:outline-none"
              />
              <textarea
                value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="What's it about? (optional)" rows={2}
                className="w-full resize-none rounded-lg border border-white/8 bg-white/2 px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:border-cyan-500/40 focus:outline-none"
              />
              {/* honeypot — hidden from humans, bots fill it */}
              <input
                value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                name="company" tabIndex={-1} autoComplete="off" aria-hidden="true"
                className="hidden" style={{ display: 'none' }}
              />
              {formError && <p className="text-xs text-red-400/80">{formError}</p>}
              <button onClick={book} disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-cyan-500 py-2.5 text-sm font-bold text-black transition-colors hover:bg-cyan-400 disabled:opacity-60">
                {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Booking…</> : 'Confirm booking'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
