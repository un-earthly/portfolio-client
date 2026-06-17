'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { links } from '@/mock-data'
import { Home, Briefcase, BookOpen, User, ArrowUpRight, ChevronLeft } from 'lucide-react'

type NavLink = { href: string; label: string }

const iconMap: Record<string, React.ElementType> = {
  Home,
  Portfolio: Briefcase,
  Blog: BookOpen,
  About: User,
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const h = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [])
  return reduced
}

const glass: React.CSSProperties = {
  background: 'rgba(0, 0, 0, 0.55)',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
  borderRadius: '16px',
}

const navLinks = links as NavLink[]

export default function Navbar() {
  const [isDockVisible, setIsDockVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()
  const reducedMotion = useReducedMotion()
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Detect touch-primary device
  useEffect(() => {
    const mobile = window.matchMedia('(hover: none)').matches
    setIsMobile(mobile)
    // Desktop: always pinned open
    if (!mobile) setIsDockVisible(true)
  }, [])

  // Mobile only: close on route change
  useEffect(() => { if (isMobile) setIsDockVisible(false) }, [pathname, isMobile])

  const show = () => {
    clearTimeout(closeTimerRef.current!)
    setIsDockVisible(true)
  }

  const scheduleHide = () => {
    if (!isMobile) return
    clearTimeout(closeTimerRef.current!)
    closeTimerRef.current = setTimeout(() => setIsDockVisible(false), 200)
  }

  const close = () => { if (isMobile) setIsDockVisible(false) }

  // Per-item style: desktop items always visible, mobile staggered
  function itemStyle(i: number): React.CSSProperties {
    if (!isMobile) return { opacity: 1, transform: 'none' }
    if (reducedMotion) return { opacity: isDockVisible ? 1 : 0 }
    const ITEM_COUNT = navLinks.length + 1
    const delay = isDockVisible ? i * 60 : (ITEM_COUNT - 1 - i) * 40
    return {
      opacity: isDockVisible ? 1 : 0,
      transform: isDockVisible ? 'translateX(0px)' : 'translateX(-10px)',
      transition: `opacity 200ms ease-out ${delay}ms, transform 200ms ease-out ${delay}ms`,
    }
  }

  const dockStyle: React.CSSProperties = isMobile
    ? {
        width: isDockVisible ? '186px' : '48px',
        opacity: 1,
        pointerEvents: 'auto',
        transform: 'translateY(-50%)',
        transition: reducedMotion ? 'none' : 'width 250ms ease',
      }
    : {
        // Desktop: always pinned open
        width: '186px',
        pointerEvents: 'auto',
        transform: 'translateX(0px) translateY(-50%)',
        transition: 'none',
      }

  return (
    <>
      {/* Brand mark */}
      <div
        className="fixed top-3 left-3 z-50"
        onMouseEnter={show}
        onMouseLeave={scheduleHide}
      >
        <Link
          href="/"
          style={glass}
          className="flex items-center px-3 py-2 rounded-xl text-base font-black text-white tracking-tighter hover:text-cyan-400 transition-colors duration-200 select-none"
          aria-label="MD. — Home"
          onClick={(e) => {
            if (isMobile) {
              e.preventDefault()
              setIsDockVisible(prev => !prev)
            }
          }}
        >
          MD<span className="text-cyan-400">.</span>
        </Link>
      </div>

      {/* Vertical dock */}
      <nav
        aria-label="Site navigation"
        className="fixed left-2 z-40 flex flex-col overflow-hidden"
        style={{ top: '50%', ...glass, ...dockStyle }}
        onMouseEnter={show}
        onMouseLeave={scheduleHide}
        onClick={() => { if (isMobile && !isDockVisible) show() }}
      >
        <ul role="list" className="flex flex-col">
          {navLinks.map(({ href, label }, i) => {
            const Icon = iconMap[label] ?? Home
            const active = pathname === href || (href !== '/' && pathname.startsWith(href))
            return (
              <li key={href} style={isMobile ? undefined : itemStyle(i)}>
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  onClick={close}
                  className={[
                    'flex items-center gap-3 px-3 py-3 whitespace-nowrap transition-colors duration-150',
                    active
                      ? 'text-cyan-400 bg-cyan-500/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5',
                  ].join(' ')}
                >
                  <span className="flex w-5 shrink-0 items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="text-sm font-medium tracking-wide">{label}</span>
                </Link>
              </li>
            )
          })}
        </ul>

        <div style={isMobile ? undefined : itemStyle(navLinks.length)}>
          <div className="mx-3 border-t border-white/5" />
          <Link
            href="/contact"
            onClick={close}
            className="flex items-center gap-3 px-3 py-3 whitespace-nowrap text-cyan-400 hover:bg-cyan-500/10 transition-colors duration-150"
          >
            <span className="flex w-5 shrink-0 items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </span>
            <span className="text-sm font-bold tracking-widest uppercase">Hire Me</span>
          </Link>
        </div>

        {isMobile && (
          <div
            className="overflow-hidden border-t border-white/5"
            style={{
              maxHeight: isDockVisible ? '40px' : '0px',
              transition: reducedMotion ? 'none' : 'max-height 220ms ease',
            }}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Collapse navigation"
              tabIndex={isDockVisible ? 0 : -1}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:text-gray-300 transition-colors duration-150"
            >
              <ChevronLeft className="w-4 h-4 shrink-0" />
              <span className="text-xs whitespace-nowrap">Collapse</span>
            </button>
          </div>
        )}
      </nav>
    </>
  )
}
