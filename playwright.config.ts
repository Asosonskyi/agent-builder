import { defineConfig, devices } from "@playwright/test"

const BASE = "/agent-builder/"

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: `http://localhost:4173${BASE}`,
    viewport: { width: 1440, height: 900 },
    locale: "en-US",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
  ],
  webServer: {
    command: `VITE_API_MODE=mock VITE_BASE=${BASE} pnpm build && pnpm preview --port 4173 --strictPort`,
    url: `http://localhost:4173${BASE}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
