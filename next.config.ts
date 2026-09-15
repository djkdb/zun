import type { NextConfig } from "next";

/**
 * Static export: every route is prerendered into ./out, so the site can be
 * served from Cloudflare Pages (or any static host) with no server runtime.
 */
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: false,
};

export default nextConfig;
