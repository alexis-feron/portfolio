import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  // The automatic runtime, as in the app - components under test never
  // import React themselves.
  esbuild: { jsx: "automatic" },
  // No stylesheet is under test; an inline config keeps Vite from loading the
  // Tailwind PostCSS plugin, which only Next knows how to run.
  css: { postcss: {} },
  test: {
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
