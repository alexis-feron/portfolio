import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

/**
 * `next dev` and `next build` both write to `.next` by default, so running a
 * build while the dev server is up overwrites the manifests it is serving from
 * — routes then 404 until Turbopack recompiles them. Giving dev its own
 * directory makes the two independent.
 *
 * Build and `next start` keep `.next`, so deployments are unaffected.
 */
export default function config(phase: string): NextConfig {
  return {
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
    reactStrictMode: true,
    poweredByHeader: false,
    images: {
      formats: ["image/avif", "image/webp"],
      // The covers are the only bitmaps on the site and none of them is ever
      // rendered wider than the viewport.
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
      minimumCacheTTL: 31536000,
    },
    async headers() {
      return [
        {
          source: "/:path*",
          headers: [
            { key: "X-Content-Type-Options", value: "nosniff" },
            { key: "X-Frame-Options", value: "SAMEORIGIN" },
            {
              key: "Referrer-Policy",
              value: "strict-origin-when-cross-origin",
            },
            {
              key: "Permissions-Policy",
              value: "camera=(), microphone=(), geolocation=(), payment=()",
            },
            {
              key: "Strict-Transport-Security",
              value: "max-age=63072000; includeSubDomains; preload",
            },
          ],
        },
        {
          // Hashed build output and the self-hosted fonts never change.
          source: "/fonts/:path*",
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
}
