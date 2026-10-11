#!/usr/bin/env node
// Points the README's jsDelivr links at package.json's version, with SRI hashes from the built dist/. Part of a release.
//
//   pnpm build && node scripts/pin-readme.mjs     rewrite README.md
//   node scripts/pin-readme.mjs --verify          after `npm publish`: jsDelivr serves each file, matching its hash
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { CDN, links, pin, sri, tags } from "./lib/readme-pins.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { version } = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const readme = readFileSync(join(root, "README.md"), "utf8");

if (process.argv.includes("--verify")) {
  const hashes = new Map(tags(readme).map((t) => [t.file, t.integrity]));
  let bad = 0;
  for (const file of new Set(links(readme).map((l) => l.file))) {
    const res = await fetch(`${CDN}${version}/${file}`);
    const body = Buffer.from(await res.arrayBuffer());
    const want = hashes.get(file);
    const ok = res.ok && (!want || sri(body) === want);
    if (!ok) bad++;
    console.log(`${ok ? "✓" : "✗"} ${res.status} ${file}${want ? (sri(body) === want ? " (hash matches)" : " (HASH DIFFERS)") : ""}`);
  }
  if (bad) {
    console.error(`${bad} file(s) not served as pinned. A new release can take a few minutes to reach jsDelivr; try again.`);
    process.exit(1);
  }
} else {
  writeFileSync(join(root, "README.md"), pin(readme, version, root));
  console.log(`README pinned to ${version}`);
}
