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
    images: {
      formats: ["image/avif", "image/webp"],
    },
    transpilePackages: ["three"],
  };
}
