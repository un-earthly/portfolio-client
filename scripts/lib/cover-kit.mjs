// cover-kit — generate branded blog covers with NO AI:
//   • fuzzy keyword matching to pick a relevant illustration (Iconify)
//   • template text generation from frontmatter (title / excerpt / tags)
//   • seeded random-character texture
// Network is only used to fetch + disk-cache illustration SVGs.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const HERE = dirname(fileURLToPath(import.meta.url))
const CACHE = join(HERE, '.cache', 'icons')
mkdirSync(CACHE, { recursive: true })

export const W = 1200, H = 630

export const PALETTES = {
  cyan: ['#22d3ee', '#0e7490'], amber: ['#f59e0b', '#b45309'],
  green: ['#34d399', '#0f766e'], violet: ['#a78bfa', '#6d28d9'],
  rose: ['#fb7185', '#9f1239'], blue: ['#60a5fa', '#1d4ed8'],
  orange: ['#fb923c', '#c2410c'],
}
const PAL_KEYS = Object.keys(PALETTES)

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// ── deterministic PRNG from a string seed ──────────────────────────────────
export const rand = (seed) => {
  let h = 2166136261
  for (const c of String(seed)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619) }
  return () => { h += 0x6d2b79f5; let t = Math.imul(h ^ (h >>> 15), 1 | h); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
}
const hash = (s) => { let h = 0; for (const c of String(s)) h = (Math.imul(h, 31) + c.charCodeAt(0)) | 0; return Math.abs(h) }

// ── fuzzy matching (Sørensen–Dice on character bigrams) ────────────────────
const bigrams = (s) => { s = s.toLowerCase().replace(/[^a-z0-9]/g, ''); const o = new Set(); for (let i = 0; i < s.length - 1; i++) o.add(s.slice(i, i + 2)); return o }
export const dice = (a, b) => { const A = bigrams(a), B = bigrams(b); if (!A.size || !B.size) return 0; let inter = 0; for (const g of A) if (B.has(g)) inter++; return (2 * inter) / (A.size + B.size) }

const STOP = new Set(['the', 'a', 'an', 'and', 'or', 'of', 'to', 'is', 'are', 'you', 'your', 'it', 'its', 'for', 'with', 'how', 'why', 'not', 'in', 'on', 'i'])
export const tokenize = (s) => String(s).toLowerCase().split(/[^a-z0-9]+/).filter(t => t.length > 2 && !STOP.has(t))

// keyword → preferred monochrome (recolorable) Iconify id
const ICON_DICT = [
  ['rust', 'simple-icons:rust'], ['ownership', 'tabler:lock-square'], ['borrow', 'tabler:transfer'],
  ['lifetime', 'tabler:clock-bolt'], ['async', 'tabler:arrows-shuffle'], ['concurrency', 'tabler:arrows-split-2'],
  ['tokio', 'tabler:bolt'], ['error', 'tabler:alert-triangle'], ['ratatui', 'tabler:terminal-2'],
  ['terminal', 'tabler:terminal-2'], ['performance', 'tabler:gauge'], ['benchmark', 'tabler:chart-bar'],
  ['trait', 'tabler:puzzle'], ['typescript', 'tabler:brand-typescript'], ['type', 'tabler:braces'],
  ['javascript', 'tabler:brand-javascript'], ['bloom', 'tabler:filter'], ['hash', 'tabler:hash'],
  ['cardinality', 'tabler:chart-histogram'], ['hyperloglog', 'tabler:chart-dots'], ['consistent', 'tabler:circle-dashed'],
  ['distributed', 'tabler:topology-ring'], ['load', 'tabler:scale'], ['database', 'tabler:database'],
  ['ai', 'tabler:robot'], ['agent', 'tabler:robot-face'], ['llm', 'tabler:brain'], ['automation', 'tabler:settings-automation'],
  ['copilot', 'tabler:robot'], ['debug', 'tabler:bug'], ['mental', 'tabler:bulb'], ['clean', 'tabler:sparkles'],
  ['productivity', 'tabler:rocket'], ['figma', 'tabler:brand-figma'], ['architecture', 'tabler:topology-star-3'],
  ['microservice', 'tabler:topology-complex'], ['offline', 'tabler:wifi-off'], ['mobile', 'tabler:device-mobile'],
  ['ble', 'tabler:bluetooth'], ['mesh', 'tabler:topology-full'], ['event', 'tabler:calendar-event'],
  ['legacy', 'tabler:database-export'], ['migration', 'tabler:transfer-in'], ['freelance', 'tabler:briefcase'],
  ['career', 'tabler:user-star'], ['visibility', 'tabler:eye'], ['brand', 'tabler:badge'],
  ['market', 'tabler:trending-up'], ['product', 'tabler:package'], ['fullstack', 'tabler:stack-2'],
  ['skill', 'tabler:award'], ['websocket', 'tabler:plug-connected'], ['api', 'tabler:api'],
  ['security', 'tabler:shield-lock'], ['junior', 'tabler:users'],
]

// pick best icon id from blog text via fuzzy match; falls back to a hashed default
export function pickIcon(text) {
  const toks = tokenize(text)
  let best = null, bestScore = 0
  for (const [kw, id] of ICON_DICT) {
    for (const t of toks) {
      const s = t === kw ? 1 : dice(t, kw)
      if (s > bestScore) { bestScore = s; best = id }
    }
  }
  if (bestScore >= 0.5) return best
  return ICON_DICT[hash(text) % ICON_DICT.length][1] // graceful fallback
}

// fetch (disk-cached) an Iconify icon, recolored + sized; returns inner <svg> markup or null
export async function fetchIcon(id, color, size = 340) {
  const safe = id.replace(/[^a-z0-9]+/gi, '_')
  const file = join(CACHE, `${safe}_${color.slice(1)}.svg`)
  if (existsSync(file)) return readFileSync(file, 'utf8')
  const [prefix, name] = id.split(':')
  const url = `https://api.iconify.design/${prefix}/${name}.svg?height=${size}&color=${encodeURIComponent(color)}`
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(12000) })
    if (!res.ok) return null
    const svg = await res.text()
    if (!svg.startsWith('<svg') || svg.includes('404')) return null
    writeFileSync(file, svg)
    return svg
  } catch { return null }
}

// turn a fetched <svg> into a <symbol>-free embeddable group placed/scaled at (x,y)
function placeIcon(svg, x, y, size, opacity) {
  const vb = (svg.match(/viewBox="([^"]+)"/) || [])[1] || `0 0 24 24`
  const [, , vw, vh] = vb.split(/\s+/).map(Number)
  const inner = svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
  const scale = size / Math.max(vw, vh)
  const tx = x - (vw * scale) / 2, ty = y - (vh * scale) / 2
  return `<g transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${scale.toFixed(3)})" opacity="${opacity}">${inner}</g>`
}

// ── seeded random-character texture ────────────────────────────────────────
const GLYPHS = '01<>/{}[]()=+*#$%&;:アイウエオカキクケコ⟶◇△○∑λ→'.split('')
function glyphField(seed, color) {
  const r = rand(seed + '::glyphs')
  let s = ''
  for (let i = 0; i < 120; i++) {
    const g = GLYPHS[Math.floor(r() * GLYPHS.length)]
    const x = (r() * W).toFixed(0), y = (r() * H).toFixed(0)
    const sz = (10 + r() * 18).toFixed(0), op = (0.03 + r() * 0.09).toFixed(3)
    s += `<text x="${x}" y="${y}" font-size="${sz}" fill="${color}" opacity="${op}" font-family="ui-monospace, monospace">${esc(g)}</text>`
  }
  return s
}

// ── text helpers ───────────────────────────────────────────────────────────
function wrap(str, max) {
  const words = str.split(/\s+/), lines = []; let cur = ''
  for (const w of words) { if ((cur + ' ' + w).trim().length > max) { if (cur) lines.push(cur); cur = w } else cur = (cur + ' ' + w).trim() }
  if (cur) lines.push(cur); return lines
}
const firstSentence = (s) => { const m = String(s).match(/^[^.!?]*[.!?]/); return (m ? m[0] : String(s)).trim() }
const headlineFrom = (title) => {
  // take the punchy first clause, strip "Part N" tails, uppercase
  let h = String(title).split(/[:.?]/)[0].replace(/,?\s*Part\s*\d+.*$/i, '').trim()
  if (h.length > 34) h = h.slice(0, 34).replace(/\s+\S*$/, '') + '…'
  return h.toUpperCase()
}

const TYPE_LABEL = { technical: 'TECHNICAL DEEP DIVE', 'hot-take': 'ENGINEERING HOT TAKE' }

// constant MD. brand banner (top-right)
const banner = (k1, k2) => `<g font-family="Arial, Helvetica, sans-serif">
  <text x="${W - 60}" y="54" text-anchor="end" font-size="20" font-weight="700" letter-spacing="2" fill="#94a3b8">${esc(k1)}</text>
  <text x="${W - 60}" y="80" text-anchor="end" font-size="20" font-weight="700" letter-spacing="2" fill="#64748b">${esc(k2)}</text>
  <text x="${W - 60}" y="142" text-anchor="end" font-size="54" font-weight="900" letter-spacing="-1" fill="#f8fafc">MD<tspan fill="#22d3ee">.</tspan></text>
</g>`

// blog: { slug, title, tags:[], excerpt, type }
export async function composeCover(blog) {
  const accent = PALETTES[PAL_KEYS[hash(blog.slug) % PAL_KEYS.length]]
  const matchText = [blog.title, ...(blog.tags || [])].join(' ')
  const iconId = pickIcon(matchText)
  const iconSvg = await fetchIcon(iconId, accent[0])

  const headline = headlineFrom(blog.title)
  const descriptor = wrap(firstSentence(blog.excerpt || blog.title), 52).slice(0, 2)
  const k1 = (blog.tags?.[0] || 'ENGINEERING').toUpperCase()
  const k2 = TYPE_LABEL[blog.type] || 'ENGINEERING'
  const chip = (blog.tags?.[1] || blog.tags?.[0] || blog.type).toUpperCase()

  const illustration = iconSvg
    ? `<g>${placeIcon(iconSvg, 950, 320, 360, 0.9)}</g>`
    : `<circle cx="950" cy="320" r="150" fill="none" stroke="${accent[0]}" stroke-width="3" opacity="0.5"/>`

  let dy = 0
  const descLines = descriptor.map(l => `<text x="82" y="${430 + (dy++) * 34}" font-size="24" fill="#94a3b8" font-family="Arial, Helvetica, sans-serif">${esc(l)}</text>`).join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(headline)}">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b1120"/><stop offset="1" stop-color="#020617"/></linearGradient>
  <radialGradient id="glow" cx="0.78" cy="0.5" r="0.6"><stop offset="0" stop-color="${accent[0]}" stop-opacity="0.28"/><stop offset="1" stop-color="${accent[0]}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<g>${glyphField(blog.slug, accent[0])}</g>
<rect width="${W}" height="${H}" fill="url(#glow)"/>
${illustration}
<rect width="${W}" height="${H}" fill="#020617" opacity="0.18"/>
${banner(k1, k2)}
<g font-family="ui-monospace, SFMono-Regular, Menlo, monospace">
  <rect x="80" y="190" width="10" height="34" rx="3" fill="${accent[0]}"/>
  <text x="106" y="216" font-size="22" font-weight="700" letter-spacing="4" fill="${accent[0]}">${esc(chip)}</text>
</g>
<text x="80" y="300" font-family="Arial, Helvetica, sans-serif" font-size="62" font-weight="900" letter-spacing="-1" fill="#f8fafc">${esc(headline)}</text>
<rect x="82" y="350" width="120" height="5" rx="2.5" fill="${accent[0]}"/>
${descLines}
</svg>`
}

// minimal frontmatter reader for the fields covers need
export function readFrontmatter(path) {
  const raw = readFileSync(path, 'utf8')
  const fm = (raw.match(/^---\n([\s\S]*?)\n---/) || [])[1] || ''
  const get = (k) => { const m = fm.match(new RegExp(`^${k}:\\s*(.*)$`, 'm')); return m ? m[1].trim().replace(/^['"]|['"]$/g, '') : '' }
  const tagsRaw = get('tags')
  const tags = tagsRaw.replace(/^\[|\]$/g, '').split(',').map(t => t.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean)
  return { title: get('title'), excerpt: get('excerpt') || get('metaDescription'), type: get('type') || 'technical', tags }
}
