import { defineConfig, devices } from "@playwright/test";

// Runs against the built static site (`pnpm build` first), served the way Cloudflare Pages serves it.
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  use: { baseURL: "http://localhost:4173", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "phone", use: { ...devices["Pixel 7"] } },
  ],
  webServer: { command: "pnpm preview", url: "http://localhost:4173", reuseExistingServer: !process.env.CI },
});
