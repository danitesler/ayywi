import { existsSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";

// Cloud sandboxes ship a pinned Chromium; CI uses the one `playwright install` puts in place.
const bundled = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const executablePath = !process.env.CI && existsSync(bundled) ? bundled : undefined;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    launchOptions: { executablePath },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"], launchOptions: { executablePath } } }],
  webServer: {
    command: "pnpm preview:build && pnpm preview:serve --port 4173 --strictPort --host 127.0.0.1",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
