import type { NextConfig } from "next";

// Every page is prerendered to plain HTML at build time (`out/`), then served from Cloudflare Pages' CDN.
const nextConfig: NextConfig = {
  output: "export",
  // Static hosting has no image optimizer; photos are served as they are.
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
