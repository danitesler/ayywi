// The preview the Playwright tests run against (playwright.config.ts starts it): built once per state of the sources,
// into a folder of its own, and served from there.
//
// Every session in this checkout shares dist/ and preview/dist/, and any build empties them. A run serving them
// directly loses its files when another session builds halfway through it. A folder named after a hash of the sources
// is written once and never again, so overlapping runs keep their files, and a run whose sources match an earlier
// build (from any session) starts without building.
//
//   E2E_PORT=4321 node scripts/e2e-server.mjs
import { execFileSync, spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { cpSync, existsSync, readdirSync, readFileSync, rmSync, statSync, utimesSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { run, withBuildLock } from "./build-lock.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const cache = `${root}node_modules/.cache/ayywi-e2e`;
const port = process.env.E2E_PORT ?? "4173";
/** Builds unused for this long go, keeping the newest few. A run touches its build when it starts. */
const KEEP_MS = 2 * 60 * 60_000;
const KEEP_NEWEST = 3;

/** Inputs that don't change the built site: tests, evals, agent settings, and what `pnpm build` generates from sources. */
const IGNORED = /^(tests|evals|\.claude|manifest|llms)\/|^(scripts\/e2e-server\.mjs|playwright\.config\.ts|src\/css\/tokens\.css|src\/tokens\.ts|src\/icon-packs\.ts|llms(-full)?\.txt|ai\/AGENTS\.snippet\.md|ai\/cursor\/ayywi\.mdc|ai\/skills\/ayywi\/reference\.md)$|^src\/css\/icon-packs\//;

function fingerprint() {
  const files = execFileSync("git", ["ls-files", "-z", "--cached", "--others", "--exclude-standard"], { cwd: root, encoding: "utf8", maxBuffer: 64 << 20 })
    .split("\0")
    .filter((file) => file && !IGNORED.test(file))
    .sort();
  const hash = createHash("sha256");
  for (const file of new Set(files)) {
    if (!existsSync(root + file) || !statSync(root + file).isFile()) continue;
    hash.update(`${file}\0`);
    hash.update(readFileSync(root + file));
  }
  return hash.digest("hex").slice(0, 16);
}

function prune(current) {
  if (!existsSync(cache)) return;
  const builds = readdirSync(cache, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== current)
    .map((entry) => ({ path: `${cache}/${entry.name}`, used: statSync(`${cache}/${entry.name}`).mtimeMs }))
    .sort((a, b) => b.used - a.used);
  for (const build of builds.slice(KEEP_NEWEST - 1)) {
    if (Date.now() - build.used > KEEP_MS) rmSync(build.path, { recursive: true, force: true });
  }
}

const key = fingerprint();
const dir = `${cache}/${key}`;
await withBuildLock(async () => {
  if (existsSync(`${dir}/.complete`)) {
    console.log(`e2e: the sources match build ${key}; serving it without building`);
  } else {
    console.log(`e2e: building ${key}`);
    rmSync(dir, { recursive: true, force: true });
    if ((await run("pnpm -s build")) !== 0) process.exit(1);
    if ((await run(`pnpm exec vite build --config preview/vite.config.ts --outDir "${dir}/site" --emptyOutDir --logLevel warn`)) !== 0) process.exit(1);
    cpSync(`${root}dist`, `${dir}/dist`, { recursive: true });
    writeFileSync(`${dir}/.complete`, "");
  }
  const now = new Date();
  utimesSync(dir, now, now);
  prune(key);
});

// The tests read dist/ files from the same build they test (tests/e2e/helpers.ts → distFile).
const served = `${cache}/port-${port}.json`;
writeFileSync(served, JSON.stringify({ pid: process.pid, dir }));
// Vite itself, not through pnpm, so stopping this script stops the server too.
const vite = `${root}node_modules/vite/bin/vite.js`;
const server = spawn(process.execPath, [vite, "preview", "--config", "preview/vite.config.ts", "--outDir", `${dir}/site`, "--port", port, "--strictPort", "--host", "127.0.0.1"], { cwd: root, stdio: "inherit" });
const stop = () => server.kill("SIGTERM");
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
server.on("exit", (code) => {
  rmSync(served, { force: true });
  process.exit(code ?? 0);
});
