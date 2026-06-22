# Blog cover generation pipeline

Branded SVG covers in `public/blog-covers/<slug>.svg` are **generated** (one per
post) by `node scripts/gen-covers.mjs`. No AI/LLM is used — everything is
classic, deterministic algorithms over the actual markdown. Don't hand-edit the
SVGs; edit the generator and re-run.

```
markdown ──▶ TF-IDF keywords ──▶ icon resolution ──▶ SVG compose
                                  (override → search → fallback)
```

## Algorithms used

### 1. TF-IDF keyword extraction
Picks each post's *distinctive* terms from the real markdown body (not a
hand-written list).

- **TF (term frequency):** count each token within the post. Title + tags are
  concatenated 2–3× so they outweigh body prose.
- **IDF (inverse document frequency):** `log(N+1) / log(df+1)` over the whole
  corpus of posts (`N` = post count, `df` = posts containing the term). Terms
  common to every post (e.g. "code", "system") are damped; rare, on-topic terms
  (e.g. `hyperloglog`, `ratatui`, `strangler`) rise.
- Score = `TF × IDF`; top 6 terms are kept.
- Preprocessing strips frontmatter, fenced/inline code, links, and HTML/SVG tags
  so we score language, not syntax; a stopword set removes function words and
  markdown/entity leakage (`amp`, `font`, …).

> Why not a dictionary/Wikipedia? A real dictionary rejects exactly the jargon
> that best identifies a post (`tokio`, `nuxt`, `hll`). TF-IDF surfaces those for
> free, so it's both simpler and more accurate here.

### 2. Sørensen–Dice fuzzy matching (curated override)
Top keywords are first matched against a small curated `keyword → Iconify id`
map using the **Sørensen–Dice coefficient** over character bigrams
(`2·|A∩B| / (|A|+|B|)`). A threshold of `0.62` lets near-misses match
(`borrowed` → `borrow`) while avoiding false hits. This guarantees clean icons
for coined/brand terms that search engines handle poorly.

### 3. Iconify search resolution
If no curated override matches, each keyword is resolved live via the **Iconify
search API** (`/search?query=…`), filtered to monochrome icon sets
(`tabler`, `ph`, `lucide`, `solar`, `mdi`, …) so the result recolors cleanly to
the post's accent. Results are disk-cached under `scripts/lib/.cache/`. If
nothing resolves, a deterministic hashed fallback is used.

### 4. FNV-1a hashing → deterministic styling
A 32-bit **FNV-1a** hash of the slug selects the accent palette and seeds a
**mulberry32-style PRNG**, so each post gets a stable, unique look (the
random-character "glyph field" texture and accent never change between runs).

### 5. Greedy word-wrap + font auto-fit
Headlines are wrapped with a **greedy line-breaking** algorithm on word
boundaries (a word is hyphen-split only if it alone exceeds a line, so real words
never break mid-token). `layoutHeadline` then **auto-fits** the font size
(64 → 40px), choosing the largest size whose wrapped result fits in ≤3 lines
within the left text column; overflow is ellipsized at a word boundary.

## Files
- `scripts/gen-covers.mjs` — orchestrates: read posts → build IDF → per-post keywords → compose.
- `scripts/lib/cover-kit.mjs` — the library: `stripMarkdown`, `buildIdf`,
  `extractKeywords`, `dice`, `resolveIcon`/`searchIcon`, `fetchIcon`, `rand`/`hash`,
  `wrap`/`layoutHeadline`, `composeCover`, `readFrontmatter`.

## Notes
- Covers are served via `next/image`/`<img>`; `next.config.ts` sets
  `images.dangerouslyAllowSVG` (our own static SVGs).
- Always escape dynamic text with `esc()` — raw `&`/`<`/`>` break the SVG XML.
- The icon/search cache (`scripts/lib/.cache/`) is gitignored; delete it to force
  re-resolution.
