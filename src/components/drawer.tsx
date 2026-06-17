'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useReducedMotion } from 'motion/react'
import { links } from '@/mock-data'
import { Home, Briefcase, BookOpen, User, ArrowUpRight } from 'lucide-react'

type NavLink = { href: string; label: string; accent?: boolean }

const iconMap: Record<string, React.ElementType> = {
  Home,
  Portfolio: Briefcase,
  Blog: BookOpen,
  About: User,
}

const navLinks = links as NavLink[]
const HIRE_ME: NavLink = { href: '/contact', label: 'Hire Me', accent: true }

/* A single magnifying dock icon with a hover-reveal title — mirrors the contact dock. */
function DockItem({
  link,
  active,
  reduced,
}: {
  link: NavLink
  active: boolean
  reduced: boolean
}) {
  const { href, label, accent } = link
  const Icon = accent ? ArrowUpRight : iconMap[label] ?? Home
  const highlighted = accent || active

  return (
    <motion.div
      whileHover={reduced ? undefined : { y: -10, scale: 1.18 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 380, damping: 18 }}
      className="relative"
    >
      <Link
        href={href}
        aria-label={label}
        aria-current={active ? 'page' : undefined}
        className={`group relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] transition-colors duration-200 ${
          highlighted ? 'text-cyan-400' : 'text-gray-400'
        }`}
      >
        {/* glow behind the icon */}
        <span
          className={`absolute inset-0 rounded-2xl blur-md transition-colors duration-300 ${
            accent
              ? 'bg-cyan-500/20 group-hover:bg-cyan-500/30'
              : active
                ? 'bg-cyan-500/15'
                : 'bg-transparent group-hover:bg-white/10'
          }`}
        />
        <Icon
          className={`relative h-5 w-5 transition-colors duration-200 ${
            highlighted ? '' : 'group-hover:text-white'
          }`}
        />
        {/* hover-reveal title */}
        <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-black/85 px-2.5 py-1 text-xs font-medium text-white opacity-0 backdrop-blur-sm transition-all duration-200 group-hover:-top-11 group-hover:opacity-100">
          {label}
          <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-white/10 bg-black/85" />
        </span>
      </Link>
    </motion.div>
  )
}

export default function Navbar() {
  const pathname = usePathname()
  const reduced = useReducedMotion() ?? false

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href))

  return (
    <nav
      aria-label="Site navigation"
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-1/2 z-50 -translate-x-1/2"
    >
      {/* Glassmorphism floating dock — identical styling to the contact dock */}
      <div className="flex items-center gap-2 rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-2.5 shadow-2xl shadow-black/40 backdrop-blur-2xl">
        {navLinks.map((link) => (
          <DockItem key={link.href} link={link} active={isActive(link.href)} reduced={reduced} />
        ))}

        {/* Divider before the accent CTA */}
        <span aria-hidden="true" className="mx-0.5 h-7 w-px bg-white/10" />

        <DockItem link={HIRE_ME} active={isActive(HIRE_ME.href)} reduced={reduced} />
      </div>
    </nav>
  )
}
