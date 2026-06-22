// Generates branded SVG blog covers into public/blog-covers/.
// No AI: keywords are extracted from the actual markdown via TF-IDF, resolved to
// illustrations through a curated override + Iconify search; text is templated
// from frontmatter. See scripts/COVER-PIPELINE.md for the algorithms used.
// Run: node scripts/gen-covers.mjs
import { writeFileSync, mkdirSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { composeCover, readFrontmatter, tokenize, buildIdf, extractKeywords } from './lib/cover-kit.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(ROOT, 'src', 'content', 'blogs')
const OUT = join(ROOT, 'public', 'blog-covers')
mkdirSync(OUT, { recursive: true })

const files = readdirSync(SRC).filter(f => f.endsWith('.md'))

// 1) read every post, weighting title/tags higher than body for keyword scoring
const entries = files.map(f => {
  const slug = f.replace(/\.md$/, '')
  const fm = readFrontmatter(join(SRC, f))
  const weighted = `${fm.title} ${fm.title} ${fm.title} ${fm.tags.join(' ')} ${fm.tags.join(' ')} ${fm.body}`
  return { slug, fm, tokens: tokenize(weighted), weighted }
})

// 2) build the corpus IDF across all posts (rarer terms score higher)
const idf = buildIdf(entries.map(e => e.tokens))

// 3) per post: extract distinctive keywords → compose cover
let n = 0
for (const e of entries) {
  const keywords = extractKeywords(e.weighted, idf, 6)
  const svg = await composeCover({ slug: e.slug, ...e.fm, keywords })
  writeFileSync(join(OUT, `${e.slug}.svg`), svg)
  n++
  console.log(`✓ ${e.slug}  ←  [${keywords.slice(0, 4).join(', ')}]`)
}
console.log(`\nGenerated ${n} covers in ${OUT}`)
