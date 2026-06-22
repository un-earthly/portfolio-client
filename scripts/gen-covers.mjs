// Generates branded SVG blog covers into public/blog-covers/.
// No AI: fuzzy-matched illustrations (Iconify) + template text from frontmatter.
// Run: node scripts/gen-covers.mjs
import { writeFileSync, mkdirSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { composeCover, readFrontmatter } from './lib/cover-kit.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(ROOT, 'src', 'content', 'blogs')
const OUT = join(ROOT, 'public', 'blog-covers')
mkdirSync(OUT, { recursive: true })

const files = readdirSync(SRC).filter(f => f.endsWith('.md'))
let n = 0
for (const f of files) {
  const slug = f.replace(/\.md$/, '')
  const fm = readFrontmatter(join(SRC, f))
  const svg = await composeCover({ slug, ...fm })
  writeFileSync(join(OUT, `${slug}.svg`), svg)
  n++
  console.log(`✓ ${slug}`)
}
console.log(`\nGenerated ${n} covers in ${OUT}`)
