// Generates branded SVG blog covers into public/blog-covers/.
// No AI: keywords are extracted from the actual markdown via TF-IDF, resolved to
// illustrations through a curated override + Iconify search; text is templated
// from frontmatter. See scripts/COVER-PIPELINE.md for the algorithms used.
//
// Run:
//   node scripts/gen-covers.mjs           — only generate missing covers
//   node scripts/gen-covers.mjs --force   — regenerate all covers
import { writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { composeCover, readFrontmatter, tokenize, buildIdf, extractKeywords } from './lib/cover-kit.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(ROOT, 'src', 'content', 'blogs')
const OUT = join(ROOT, 'public', 'blog-covers')
mkdirSync(OUT, { recursive: true })

const FORCE = process.argv.includes('--force')

const files = readdirSync(SRC).filter(f => f.endsWith('.md'))

// 1) read every post, weighting title/tags higher than body for keyword scoring
const entries = files.map(f => {
  const slug = f.replace(/\.md$/, '')
  const fm = readFrontmatter(join(SRC, f))
  const weighted = `${fm.title} ${fm.title} ${fm.title} ${fm.tags.join(' ')} ${fm.tags.join(' ')} ${fm.body}`
  return { slug, fm, tokens: tokenize(weighted), weighted }
})

// 2) build the corpus IDF across all posts (rarer terms score higher)
// IDF is built from ALL posts regardless of skip — corpus must stay consistent
const idf = buildIdf(entries.map(e => e.tokens))

// 3) per post: skip if cover already exists (unless --force)
let generated = 0
let skipped = 0

for (const e of entries) {
  const outPath = join(OUT, `${e.slug}.svg`)

  if (!FORCE && existsSync(outPath)) {
    skipped++
    continue
  }

  const keywords = extractKeywords(e.weighted, idf, 6)
  const svg = await composeCover({ slug: e.slug, ...e.fm, keywords })
  writeFileSync(outPath, svg)
  generated++
  console.log(`✓ ${e.slug}  ←  [${keywords.slice(0, 4).join(', ')}]`)
}

if (skipped > 0) console.log(`↷ skipped ${skipped} existing covers`)
console.log(`\nDone — generated ${generated}, skipped ${skipped}`)
