import { marked, Renderer } from "marked";

const renderer = new Renderer();

const originalCode = renderer.code.bind(renderer);
renderer.code = function ({ text, lang }) {
  if (lang === "mermaid") {
    return `<div class="mermaid">${text}</div>`;
  }
  const langLabel = lang
    ? `<span class="code-lang-label">${lang}</span>`
    : "";
  return `<div class="code-block-wrapper">${langLabel}<pre class="code-pre"><code class="language-${lang || "text"}">${text}</code></pre></div>`;
};

renderer.blockquote = function ({ text }) {
  return `<blockquote class="blog-blockquote">${text}</blockquote>`;
};

renderer.heading = function ({ text, depth }) {
  return `<h${depth} class="blog-h${depth}">${text}</h${depth}>`;
};

renderer.paragraph = function ({ text }) {
  // pass SVG blocks through unwrapped
  if (text.trimStart().startsWith("<svg")) return text;
  return `<p class="blog-p">${text}</p>`;
};

renderer.list = function ({ items, ordered }) {
  const tag = ordered ? "ol" : "ul";
  const cls = ordered ? "blog-ol" : "blog-ul";
  const inner = items.map((item) => `<li>${item.text}</li>`).join("");
  return `<${tag} class="${cls}">${inner}</${tag}>`;
};

renderer.hr = function () {
  return `<hr class="blog-hr" />`;
};

renderer.link = function ({ href, title, text }) {
  const t = title ? ` title="${title}"` : "";
  return `<a href="${href}"${t} target="_blank" rel="noopener noreferrer" class="blog-link">${text}</a>`;
};

renderer.codespan = function ({ text }) {
  return `<code class="inline-code">${text}</code>`;
};

marked.use({ renderer });

export function parseMarkdown(markdown: string): string {
  return marked.parse(markdown) as string;
}
