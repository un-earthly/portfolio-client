import type { MetadataRoute } from 'next'

// All current blog slugs -- update this list whenever a new post is published
const blogSlugs = [
  'scripts-part-4-beyond-the-toolchain',
  'scripts-part-3-system-coordination',
  'scripts-part-2-quality-gates',
  'scripts-part-1-what-are-scripts',
  'building-rust-tui-api-monitor-part-5-traits-performance-release',
  'building-rust-tui-api-monitor-part-4-ratatui-error-handling',
  'building-rust-tui-api-monitor-part-3-async-tokio-concurrency',
  'building-rust-tui-api-monitor-part-2-borrowing-lifetimes',
  'building-rust-tui-api-monitor-part-1-ownership',
  'bloom-filters-vs-hash-sets-deep-dive-benchmarks',
  'consistent-hashing-deep-dive-implementation-benchmarks',
  'hyperloglog-deep-dive-implementation-benchmarks',
  'comment-tracker-figma-comment-tracker-architecture',
  'ble-mesh-offline-event-platform-javascript',
  'ai-replacing-mid-level-developers-not-juniors',
  'legacy-system-modernization-vbnet-nuxtjs-case-study',
  'clean-code-overrated-pragmatic-engineering-productivity',
  'multi-agent-ai-system-openai-local-llm-business-automation',
  'developer-visibility-problem-portfolio-personal-brand',
  'offline-first-architecture-mobile-apps-design-decision',
  'full-stack-developer-myth-t-shaped-skills-specialization',
  'typescript-wrong-usage-type-safety-best-practices',
  'side-project-failure-reasons-product-market-fit-developer',
  'debugging-mental-models-software-engineering-skills',
  'ai-coding-tools-github-copilot-claude-engineering-quality',
  'freelance-developer-market-positioning-remote-work-strategy',
  'self-hosted-mcp-server-nextjs-portfolio',
]

const BASE_URL = 'https://alamin-md.xyz'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/experience`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
  ]

  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${BASE_URL}/blogs/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...blogPages]
}
