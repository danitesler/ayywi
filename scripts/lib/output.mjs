// Generators write through this. With AYYWI_CHECK=1 they only compare, so `pnpm check` can detect stale generated files.
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, relative } from "node:path";

export const checkMode = process.env.AYYWI_CHECK === "1";
const stale = [];

export function output(path, content) {
  if (checkMode) {
    if (!existsSync(path) || readFileSync(path, "utf8") !== content) stale.push(relative(process.cwd(), path));
    return;
  }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

/** A generated file that shouldn't exist any more: deleted, or reported as stale under AYYWI_CHECK. */
export function remove(path) {
  if (checkMode) stale.push(`${relative(process.cwd(), path)} (delete it)`);
  else rmSync(path, { force: true });
}

export function finish(label) {
  if (!checkMode) return;
  if (stale.length) {
    console.error(`${label}: generated files are stale — run \`pnpm generate\`:\n  ${stale.join("\n  ")}`);
    process.exit(1);
  }
}
