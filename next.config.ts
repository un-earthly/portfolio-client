import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // www redirect is handled at Vercel edge level (Domains settings)
  // No need to duplicate it here — removed to prevent double-redirect issues

  // Security + SEO headers
  async headers() {
    return [
      {
        // Apply security headers to all routes EXCEPT sitemap and robots
        // Google's fetcher can reject responses with X-Frame-Options set
        source: "/((?!sitemap.xml|robots.txt).*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      // Cache blog cover SVGs aggressively — they are deterministic
      {
        source: "/blog-covers/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
