function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function parseInline(text: string): string {
  return text
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(
      /`([^`]+)`/g,
      '<code class="inline-code">$1</code>'
    )
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="blog-link">$1</a>'
    );
}

export function parseMarkdown(markdown: string): string {
  const codeBlocks: string[] = [];

  let processed = markdown.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    (_, lang, code) => {
      const idx = codeBlocks.length;
      const escaped = escapeHtml(code.trimEnd());
      const langLabel = lang
        ? `<span class="code-lang-label">${lang}</span>`
        : "";
      codeBlocks.push(
        `<div class="code-block-wrapper">${langLabel}<pre class="code-pre"><code class="language-${lang || "text"}">${escaped}</code></pre></div>`
      );
      return `\n\nCODE_BLOCK_${idx}\n\n`;
    }
  );

  const blocks = processed
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  const html = blocks.map((block) => {
    const codeMatch = block.match(/^CODE_BLOCK_(\d+)$/);
    if (codeMatch) return codeBlocks[Number(codeMatch[1])];

    const h1m = block.match(/^# (.+)/);
    if (h1m) return `<h1 class="blog-h1">${parseInline(h1m[1].trim())}</h1>`;
    const h2m = block.match(/^## (.+)/);
    if (h2m) return `<h2 class="blog-h2">${parseInline(h2m[1].trim())}</h2>`;
    const h3m = block.match(/^### (.+)/);
    if (h3m) return `<h3 class="blog-h3">${parseInline(h3m[1].trim())}</h3>`;
    const h4m = block.match(/^#### (.+)/);
    if (h4m) return `<h4 class="blog-h4">${parseInline(h4m[1].trim())}</h4>`;

    if (/^-{3,}$/.test(block)) return '<hr class="blog-hr" />';

    if (block.startsWith("> ")) {
      const content = block.replace(/^> ?/gm, "");
      return `<blockquote class="blog-blockquote">${parseInline(content)}</blockquote>`;
    }

    const lines = block.split("\n");

    if (lines.every((l) => /^- /.test(l.trim()) || l.trim() === "")) {
      const items = lines
        .filter((l) => /^- /.test(l.trim()))
        .map((l) => `<li>${parseInline(l.trim().slice(2))}</li>`)
        .join("");
      return `<ul class="blog-ul">${items}</ul>`;
    }

    if (lines.some((l) => /^\d+\. /.test(l.trim()))) {
      const items = lines
        .filter((l) => /^\d+\. /.test(l.trim()))
        .map((l) => `<li>${parseInline(l.trim().replace(/^\d+\. /, ""))}</li>`)
        .join("");
      return `<ol class="blog-ol">${items}</ol>`;
    }

    return `<p class="blog-p">${parseInline(block.replace(/\n/g, " "))}</p>`;
  });

  return html.join("\n");
}
