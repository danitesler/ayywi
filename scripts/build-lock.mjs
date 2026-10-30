// One build at a time in this checkout. `pnpm build`, `pnpm preview:build` and the e2e server's build all empty and
// rewrite dist/ (and preview/dist/), so two sessions building at once delete files from under each other.
//
//   node scripts/build-lock.mjs "<shell command>"   runs the command once no other build is running
//   withBuildLock(fn)                               the same from a script
//
// A command run inside a locked one (the e2e server running `pnpm build`) inherits the lock through AYYWI_BUILD_LOCK.
import { spawn } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const lock = fileURLToPath(new URL("../node_modules/.cache/ayywi/build.lock", import.meta.url));
/** A build holding the lock longer than this has hung; the next one takes over. */
const STALE_MS = 20 * 60_000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const alive = (pid) => {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error.code === "EPERM";
  }
};

/** Whether the current holder is gone: its process ended, it hung, or it died before saying who it was. */
function abandoned() {
  try {
    const { pid, since } = JSON.parse(readFileSync(`${lock}/owner.json`, "utf8"));
    return !alive(pid) || Date.now() - since > STALE_MS;
  } catch {
    try {
      return Date.now() - statSync(lock).mtimeMs > 10_000;
    } catch {
      return true;
    }
  }
}

function owner() {
  try {
    return JSON.parse(readFileSync(`${lock}/owner.json`, "utf8")).pid;
  } catch {
    return "?";
  }
}

export async function withBuildLock(fn) {
  if (process.env.AYYWI_BUILD_LOCK === lock) return fn();
  mkdirSync(dirname(lock), { recursive: true });
  let told = false;
  for (;;) {
    try {
      mkdirSync(lock);
      break;
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
    }
    if (abandoned()) {
      rmSync(lock, { recursive: true, force: true });
      continue;
    }
    if (!told) console.error(`Waiting for another build in this checkout to finish (pid ${owner()})…`);
    told = true;
    await sleep(500);
  }
  writeFileSync(`${lock}/owner.json`, JSON.stringify({ pid: process.pid, since: Date.now() }));
  const release = () => rmSync(lock, { recursive: true, force: true });
  const interrupted = (signal) => {
    release();
    process.exit(signal === "SIGINT" ? 130 : 143);
  };
  process.on("SIGINT", interrupted);
  process.on("SIGTERM", interrupted);
  process.env.AYYWI_BUILD_LOCK = lock;
  try {
    return await fn();
  } finally {
    delete process.env.AYYWI_BUILD_LOCK;
    process.off("SIGINT", interrupted);
    process.off("SIGTERM", interrupted);
    release();
  }
}

/** Run a shell command to the end; resolves with its exit code. */
export const run = (command) =>
  new Promise((resolve) => {
    const child = spawn(command, { shell: true, stdio: "inherit" });
    child.on("exit", (code, signal) => resolve(code ?? (signal ? 1 : 0)));
  });

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const command = process.argv.slice(2).join(" ");
  if (!command) {
    console.error('usage: node scripts/build-lock.mjs "<command>"');
    process.exit(2);
  }
  process.exitCode = await withBuildLock(() => run(command));
}
