#!/usr/bin/env node
// Takes desktop screenshots of each showcase app (?app=<id>) for thumbnail cards in What you can build and Get started.
//
//   node scripts/capture-showcase-screenshots.mjs
//
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { createServer } from "vite";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "preview/src/showcase/screenshots");
mkdirSync(outDir, { recursive: true });

const APPS = ["dashboard", "landing", "inbox", "settings", "tracker", "store", "booking"];

const CANDIDATES = [
  process.env.CHROME_BIN,
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
];
const executablePath = CANDIDATES.find((p) => p && existsSync(p));

const server = await createServer({
  configFile: resolve(root, "preview/vite.config.ts"),
  server: { port: 5198 },
});
await server.listen();

const browser = await chromium.launch({ executablePath });

try {
  for (const id of APPS) {
    const page = await browser.newPage({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 2,
    });
    await page.goto(`http://localhost:5198/?app=${id}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    const dest = join(outDir, `${id}.png`);
    await page.screenshot({ path: dest });
    console.log(`✓ captured ${id}.png`);
    await page.close();
  }
} finally {
  await browser.close();
  await server.close();
}

console.log("All showcase screenshots updated.");
