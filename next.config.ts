import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Our own static, authored SVG blog covers — safe to allow.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
