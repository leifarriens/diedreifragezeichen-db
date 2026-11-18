import { defineConfig } from "@playwright/test";

export default defineConfig({
  forbidOnly: !!process.env.CI,
  fullyParallel: true,
  projects: [
    {
      name: "api",
      retries: process.env.CI ? 1 : 0,
      testMatch: "api/**/*.spec.ts",
    },
  ],
  reporter: [["list"], ["html", { open: "never" }]],
  retries: process.env.CI ? 2 : 0,
  testDir: "./tests",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    extraHTTPHeaders: process.env.VERCEL_AUTOMATION_BYPASS_SECRET
      ? {
          "x-vercel-protection-bypass":
            process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
        }
      : {},
  },
  workers: process.env.CI ? 1 : "50%",
});
