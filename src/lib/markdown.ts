import { marked, Renderer } from "marked";

const renderer = new Renderer();

// Escape HTML-significant characters so code containing angle brackets or
// ampersands (e.g. Rust generics like Arc<Mutex<T>> or `&str`) renders as
// literal text instead of being parsed as markup by the browser.
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const originalCode = renderer.code.bind(renderer);
renderer.code = function ({ text, lang }) {
  if (lang === "mermaid") {
    // Mermaid parses its own source (arrows like `-->`); keep it raw.
    return `<div class="mermaid">${text}</div>`;
  }
  const langLabel = lang
    ? `<span class="code-lang-label">${lang}</span>`
    : "";
  return `<div class="code-block-wrapper">${langLabel}<pre class="code-pre"><code class="language-${lang || "text"}">${escapeHtml(text)}</code></pre></div>`;
};

renderer.blockquote = function ({ tokens }) {
  return `<blockquote class="blog-blockquote">${this.parser.parse(tokens)}</blockquote>`;
};

export type TocItem = { id: string; text: string; depth: number };

/** Extract h2/h3 headings from raw markdown for a table of contents. */
export function extractToc(markdown: string): TocItem[] {
  const out: TocItem[] = [];
  let inFence = false;
  for (const line of markdown.split("\n")) {
    if (/^```/.test(line.trim())) { inFence = !inFence; continue; }
    if (inFence) continue;
    const m = line.match(/^(#{2,3})\s+(.+?)\s*#*$/);
    if (m) out.push({ depth: m[1].length, text: m[2].trim(), id: slugifyHeading(m[2]) });
  }
  return out;
}

export function slugifyHeading(text: string): string {
  return text
    .replace(/<[^>]+>/g, "")          // strip inline tags
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

renderer.heading = function ({ tokens, depth }) {
  const text = this.parser.parseInline(tokens);
  const id = slugifyHeading(text);
  return `<h${depth} id="${id}" class="blog-h${depth}">${text}</h${depth}>`;
};

renderer.paragraph = function ({ tokens, text }) {
  // pass SVG blocks through unwrapped (raw HTML paragraphs carry no inline tokens)
  if (text.trimStart().startsWith("<svg")) return text;
  return `<p class="blog-p">${this.parser.parseInline(tokens)}</p>`;
};

renderer.list = function (token) {
  const tag = token.ordered ? "ol" : "ul";
  const cls = token.ordered ? "blog-ol" : "blog-ul";
  const inner = token.items
    .map((item) => `<li>${this.parser.parse(item.tokens)}</li>`)
    .join("");
  return `<${tag} class="${cls}">${inner}</${tag}>`;
};

renderer.hr = function () {
  return `<hr class="blog-hr" />`;
};

renderer.link = function ({ href, title, text }) {
  const t = title ? ` title="${title}"` : "";
  // Internal links (site-relative paths or in-page anchors) navigate in the
  // same tab; only external links open in a new tab.
  const isInternal = /^(\/|#)/.test(href);
  const target = isInternal ? "" : ` target="_blank" rel="noopener noreferrer"`;
  return `<a href="${href}"${t}${target} class="blog-link">${text}</a>`;
};

renderer.codespan = function ({ text }) {
  return `<code class="inline-code">${escapeHtml(text)}</code>`;
};

marked.use({ renderer });

export function parseMarkdown(markdown: string): string {
  return marked.parse(markdown) as string;
}
