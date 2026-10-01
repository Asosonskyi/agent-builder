/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react"
import path from "node:path"
import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves the app from /<repo-name>/. CI passes VITE_BASE from the repo name.
  base: process.env.VITE_BASE ?? "/agent-builder/",
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "./src") } },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    env: { VITE_API_MODE: "mock" },
  },
})
