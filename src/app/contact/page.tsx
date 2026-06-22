'use client'
import { motion, useReducedMotion } from 'motion/react'
import { Mail, FileUser } from 'lucide-react'
import { Scheduler } from '@/components/Scheduler'

/* ── Inline SVG icons ───────────────────────────────────────── */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.736-.979zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  )
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.2 3.44 9.6 8.21 11.16.6.11.82-.25.82-.56 0-.28-.01-1.02-.02-2-3.34.71-4.04-1.58-4.04-1.58-.55-1.36-1.33-1.73-1.33-1.73-1.09-.73.08-.72.08-.72 1.2.08 1.83 1.21 1.83 1.21 1.07 1.79 2.81 1.27 3.5.97.11-.76.42-1.27.76-1.56-2.67-.3-5.47-1.3-5.47-5.79 0-1.28.47-2.33 1.24-3.15-.12-.3-.54-1.5.12-3.15 0 0 1.01-.32 3.3 1.2.96-.26 1.98-.39 3-.4 1.02 0 2.04.14 3 .4 2.28-1.52 3.29-1.2 3.29-1.2.66 1.65.24 2.85.12 3.15.77.82 1.23 1.87 1.23 3.15 0 4.5-2.81 5.48-5.49 5.77.43.36.81 1.08.81 2.18 0 1.58-.01 2.85-.01 3.24 0 .31.21.68.83.56C20.57 21.88 24 17.48 24 12.29 24 5.78 18.63.5 12 .5z" />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  )
}

/* ── Primary chat channels ──────────────────────────────────── */
const PRIMARY = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    handle: '+880 1844 287 772',
    description: 'Tap to open a chat directly in WhatsApp',
    href: 'https://wa.me/8801844287772?text=Hi%20Alamin%2C%20I%20saw%20your%20portfolio%20and%20wanted%20to%20connect!',
    Icon: WhatsAppIcon,
    color: 'from-green-500/20 to-green-500/5',
    border: 'border-green-500/30 hover:border-green-400/60',
    iconColor: 'text-green-400',
    badge: 'bg-green-500/15 text-green-400 border-green-500/20',
  },
  {
    id: 'telegram',
    label: 'Telegram',
    handle: '@alamin_c_md',
    description: 'Tap to start a Telegram conversation',
    href: 'https://t.me/alamin_c_md',
    Icon: TelegramIcon,
    color: 'from-sky-500/20 to-sky-500/5',
    border: 'border-sky-500/30 hover:border-sky-400/60',
    iconColor: 'text-sky-400',
    badge: 'bg-sky-500/15 text-sky-400 border-sky-500/20',
  },
]

/* ── Secondary links ────────────────────────────────────────── */
const SECONDARY = [
  { label: 'Email', value: 'md.c.alamin00@gmail.com', href: 'mailto:md.c.alamin00@gmail.com', Icon: Mail },
  { label: 'GitHub', value: 'github.com/un-earthly', href: 'https://github.com/un-earthly', Icon: GitHubIcon },
  { label: 'LinkedIn', value: 'linkedin.com/in/alamin-md', href: 'https://www.linkedin.com/in/alamin-md/', Icon: LinkedInIcon },
  { label: 'Resume', value: 'Download PDF', href: '/resume.pdf', Icon: FileUser },
]

export default function ContactPage() {
  const reduced = useReducedMotion() ?? false

  return (
    <div className="relative min-h-screen overflow-hidden px-6 py-24">
      {/* ── Background to match site sections ── */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
      <div className="absolute top-0 left-1/4 w-160 h-160 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-2xl">
        {/* Heading */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 text-center"
        >
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-cyan-500/60 mb-3">
            Let&apos;s work together
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
            Start a conversation
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-md mx-auto">
            Book a call straight into my calendar, or ping me on whatever app you already have open.
          </p>
        </motion.div>

        {/* Scheduler */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        >
          <div className="mb-4 flex items-center gap-2">
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-cyan-500/60">Book a call</span>
            <span className="text-[11px] text-gray-600">instant Google Meet link</span>
          </div>
          <Scheduler />
        </motion.div>

        {/* WhatsApp + Telegram — single row under the scheduler */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6"
        >
          {PRIMARY.map(({ id, label, handle, href, Icon, color, border, iconColor, badge }) => (
            <a
              key={id}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center gap-4 rounded-2xl border bg-linear-to-br ${color} ${border} p-4 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]`}
            >
              <div className={`shrink-0 rounded-xl bg-white/5 p-2.5 ${iconColor}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-bold text-white text-sm">{label}</span>
                  <span className={`text-[8px] font-mono uppercase tracking-widest border rounded-full px-1.5 py-0.5 ${badge}`}>
                    instant
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 font-mono truncate">{handle}</p>
              </div>
            </a>
          ))}
        </motion.div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 border-t border-white/5" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-gray-600">or reach me via</span>
          <div className="flex-1 border-t border-white/5" />
        </div>

        {/* Secondary links */}
        <div className="grid grid-cols-2 gap-2">
          {SECONDARY.map(({ label, value, href, Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group flex items-center gap-3 rounded-xl border border-white/6 bg-white/2 p-3.5 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-colors"
            >
              <Icon className="h-4 w-4 text-gray-500 group-hover:text-cyan-400 shrink-0 transition-colors" />
              <div className="min-w-0">
                <p className="text-[9px] font-mono uppercase tracking-wider text-gray-600">{label}</p>
                <p className="text-xs text-gray-400 group-hover:text-gray-200 truncate transition-colors">{value}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
