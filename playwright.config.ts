import { existsSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";

// E2E_PORT keeps two sessions off each other's port (and off another app's preview server): the preview and
// Playwright's baseURL both read it. A busy port is an error, never a silent reuse of whatever is answering there —
// E2E_REUSE=1 opts in when you know the running server serves this tree.
const port = Number(process.env.E2E_PORT ?? 4173);

// Playwright's own Chromium (`pnpm exec playwright install chromium`), pinned to its version, so results don't
// depend on the machine; cloud sandboxes ship that build at a fixed path. E2E_CHROME=1 uses the installed Google Chrome.
const bundled = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const channel = process.env.E2E_CHROME ? "chrome" : undefined;
const executablePath = !channel && !process.env.CI && existsSync(bundled) ? bundled : undefined;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: "list",
  use: {
    baseURL: `http://127.0.0.1:${port}`,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"], channel, launchOptions: { executablePath } } }],
  // Builds the preview into a folder of its own, or reuses the build of identical sources, so another session building
  // in this checkout can't change the files mid-run (scripts/e2e-server.mjs). It may first wait for that build.
  webServer: {
    command: "node scripts/e2e-server.mjs",
    env: { E2E_PORT: String(port) },
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: Boolean(process.env.E2E_REUSE),
    timeout: 600_000,
  },
});
