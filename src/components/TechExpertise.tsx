'use client'
import {
  TypeScript, JavaScript, React as ReactIcon, Redux, VueJs, NuxtJs, NextJs,
  NodeJs, NestJS, GraphQL, MongoDB, PostgreSQL, MySQL, MicrosoftSQLServer,
  Docker, Kubernetes, Redis, AWS,
  TailwindCSS, MaterialUI, ShadcnUI, Flutter, Webpack, ViteJS,
  Figma, AdobeXD, Git, GitHubDark, GitLab, Jira, Postman, Insomnia,
  OpenAI, ClaudeAI, ChatGPT, GitHubCopilot,
  Jest, Swagger, Esbuild, NPM, PnpmDark,
  RustDark, Go, Python, Linux,
} from 'developer-icons'

type TechItem = { label: string; Icon?: React.ElementType; img?: string; invert?: boolean }

const TECH_ITEMS: TechItem[] = [
  { label: 'TypeScript',    Icon: TypeScript },
  { label: 'JavaScript',    Icon: JavaScript },
  { label: 'Go',            Icon: Go },
  { label: 'Rust',          Icon: RustDark,       invert: true },
  { label: 'Python',        Icon: Python },
  { label: 'React',         Icon: ReactIcon },
  { label: 'Next.js',       Icon: NextJs },
  { label: 'Vue.js',        Icon: VueJs },
  { label: 'Nuxt.js',       Icon: NuxtJs },
  { label: 'Redux',         Icon: Redux },
  { label: 'React Native',  Icon: ReactIcon },
  { label: 'Tailwind CSS',  Icon: TailwindCSS },
  { label: 'Material UI',   Icon: MaterialUI },
  { label: 'shadcn/ui',     Icon: ShadcnUI,        invert: true },
  { label: 'Flutter',       Icon: Flutter },
  { label: 'Node.js',       Icon: NodeJs },
  { label: 'NestJS',        Icon: NestJS },
  { label: 'GraphQL',       Icon: GraphQL },
  { label: 'REST APIs',     img: '/rest-api.svg' },
  { label: 'Microservices', img: '/microservices.svg' },
  { label: 'WebSockets',    img: '/socketio.svg' },
  { label: 'RabbitMQ',      img: '/rabbitmq.svg' },
  { label: 'PostgreSQL',    Icon: PostgreSQL },
  { label: 'MongoDB',       Icon: MongoDB },
  { label: 'MySQL',         Icon: MySQL },
  { label: 'MSSQL',         Icon: MicrosoftSQLServer },
  { label: 'Redis',         Icon: Redis },
  { label: 'Sequelize',     img: '/sequelize-logo.svg' },
  { label: 'Docker',        Icon: Docker },
  { label: 'Kubernetes',    Icon: Kubernetes },
  { label: 'AWS',           Icon: AWS },
  { label: 'Linux',         Icon: Linux },
  { label: 'GitLab CI/CD',  Icon: GitLab },
  { label: 'Jest',          Icon: Jest },
  { label: 'Vite',          Icon: ViteJS },
  { label: 'Webpack',       Icon: Webpack },
  { label: 'ESBuild',       Icon: Esbuild },
  { label: 'Swagger',       Icon: Swagger },
  { label: 'npm',           Icon: NPM },
  { label: 'pnpm',          Icon: PnpmDark },
  { label: 'Git',           Icon: Git },
  { label: 'GitHub',        Icon: GitHubDark },
  { label: 'GitLab',        Icon: GitLab },
  { label: 'Jira',          Icon: Jira },
  { label: 'Figma',         Icon: Figma },
  { label: 'Adobe XD',      Icon: AdobeXD },
  { label: 'Postman',       Icon: Postman },
  { label: 'Insomnia',      Icon: Insomnia },
  { label: 'OpenAI',        Icon: OpenAI },
  { label: 'Claude AI',     Icon: ClaudeAI },
  { label: 'ChatGPT',       Icon: ChatGPT },
  { label: 'Copilot',       Icon: GitHubCopilot,   invert: true },
  { label: 'JWT',           img: '/jwt.svg' },
  { label: 'OAuth 2.0',     img: '/oauth.svg' },
  { label: 'RBAC' },
  { label: 'System Design' },
  { label: 'Clean Arch.' },
  { label: 'Design Patterns' },
]

const ROWS = 3
const techRows: TechItem[][] = Array.from({ length: ROWS }, () => [])
TECH_ITEMS.forEach((item, i) => techRows[i % ROWS].push(item))

/* per-row: duration (s) and direction */
const ROW_CONFIG = [
  { duration: 30, reverse: false },
  { duration: 22, reverse: true  },
  { duration: 36, reverse: false },
]

function TechCell({ label, Icon, img, invert }: TechItem) {
  return (
    <div className="mq-cell group relative flex flex-col items-center justify-center gap-2.5 w-24 h-24 shrink-0 rounded-2xl border border-white/8 bg-linear-to-b from-white/5 to-white/1 hover:border-cyan-400/40 transition-all duration-300 cursor-default overflow-hidden">
      {/* hover glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.18),transparent_70%)]" />
      <span className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-white/3 border border-white/5 group-hover:border-cyan-400/20 group-hover:bg-cyan-400/6 transition-colors">
        {Icon
          ? <span className="mq-icon" style={invert ? { filter: 'invert(1)' } : undefined}><Icon width={28} height={28} /></span>
          : img
          ? <img src={img} alt={label} width={28} height={28} className="mq-icon object-contain" />
          : (
            <span className="text-[11px] font-mono font-bold text-cyan-400/80">
              {label.slice(0, 2).toUpperCase()}
            </span>
          )
        }
      </span>
      <span className="relative text-[9px] text-gray-500 group-hover:text-gray-200 text-center leading-tight transition-colors font-mono tracking-wide px-1">
        {label}
      </span>
    </div>
  )
}

function MarqueeRow({ items, duration, reverse }: { items: TechItem[]; duration: number; reverse: boolean }) {
  /* 4× duplication: animating -25% = exactly one set, starts fully visible */
  const quad = [...items, ...items, ...items, ...items]
  return (
    <div className="mq-row">
      <div
        className={`mq-track${reverse ? ' mq-reverse' : ''}`}
        style={{ '--mq-duration': `${duration}s` } as React.CSSProperties}
      >
        {quad.map((item, i) => <TechCell key={i} {...item} />)}
      </div>
    </div>
  )
}

export function TechExpertise() {
  return (
    <section className="py-16 overflow-hidden space-y-3">
      {/* Header */}
      <div className="px-8 mb-8 flex items-baseline gap-4">
        <p className="flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] uppercase text-cyan-500/70">
          <span className="inline-block w-6 h-px bg-cyan-400/50" />
          Technical Stack
        </p>
        <p className="text-2xl font-black text-white">
          {TECH_ITEMS.length}<span className="text-cyan-400">+</span>
          <span className="text-sm font-normal text-gray-600 ml-2 font-mono">technologies in production</span>
        </p>
      </div>

      {techRows.map((row, ri) => (
        <MarqueeRow key={ri} items={row} {...ROW_CONFIG[ri]} />
      ))}
    </section>
  )
}
