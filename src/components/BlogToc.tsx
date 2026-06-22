'use client'
import { useEffect, useState } from 'react'
import type { TocItem } from '@/lib/markdown'

// Sticky left-rail table of contents with scroll-spy (Google-Docs minimap style).
export function BlogToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    if (!items.length) return
    const headings = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => Boolean(el))

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length) {
          // topmost visible heading wins
          const top = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b))
          setActive(top.target.id)
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    )
    headings.forEach((h) => obs.observe(h))
    return () => obs.disconnect()
  }, [items])

  if (items.length < 2) return null

  const go = (id: string) => {
    const el = document.getElementById(id)
    if (el) { window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' }); setActive(id) }
  }

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-500/60">On this page</p>
      <ul className="space-y-1 border-l border-white/8">
        {items.map((it) => {
          const isActive = active === it.id
          return (
            <li key={it.id}>
              <button
                onClick={() => go(it.id)}
                className={`block w-full text-left -ml-px border-l-2 py-1 transition-colors ${
                  it.depth === 3 ? 'pl-6' : 'pl-3'
                } ${
                  isActive
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                {it.text}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
