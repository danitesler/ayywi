// Generators write through this. With AYYWI_CHECK=1 they only compare, so `pnpm check` can detect stale generated files.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
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

export function finish(label) {
  if (!checkMode) return;
  if (stale.length) {
    console.error(`${label}: generated files are stale — run \`pnpm generate\`:\n  ${stale.join("\n  ")}`);
    process.exit(1);
  }
}
