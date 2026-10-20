#!/usr/bin/env node
// Run before each Pages deploy, after `pnpm preview:build`. A deploy replaces the whole site, so this copies the
// runtime files of every earlier release (v/<release>/dist/…) from the live site into preview/dist, and merges their
// entries into versions.json. Apps and prompts that link a release keep working after later deploys.
//
//   AYYWI_SITE=https://<user>.github.io/ayywi/ node scripts/keep-versions.mjs
//
// The first deploy has no versions.json yet (404): nothing to keep. Any other failure stops the deploy, because
// going ahead would silently break every app linked to an older release.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = process.env.AYYWI_OUT ?? join(root, "preview/dist");
const site = process.env.AYYWI_SITE;
if (!site) {
  console.error("Set AYYWI_SITE to the live site's URL, ending in /");
  process.exit(2);
}
const base = site.endsWith("/") ? site : `${site}/`;

const current = JSON.parse(readFileSync(join(out, "versions.json"), "utf8"));
const response = await fetch(new URL("versions.json", base));
if (response.status === 404) {
  console.log("keep-versions: no versions.json on the live site yet; nothing to keep");
  process.exit(0);
}
if (!response.ok) throw new Error(`keep-versions: ${response.status} fetching ${base}versions.json`);
const live = await response.json();

// versions.json comes over the network, so every path it names has to stay inside v/<release>/.
const inside = (dir, path) => {
  const rel = relative(dir, path);
  return rel !== "" && !rel.startsWith("..") && !isAbsolute(rel);
};

let kept = 0;
for (const release of live.versions ?? []) {
  if (current.versions.some((v) => v.id === release.id)) continue;
  const dir = join(out, "v", String(release.id));
  const files = (release.files ?? []).map(String);
  const targets = files.map((file) => join(dir, file));
  if (!/^[\w.+-]+$/.test(release.id) || !inside(join(out, "v"), dir) || !targets.every((target) => inside(dir, target))) {
    throw new Error(`keep-versions: release ${JSON.stringify(release.id)} names a path outside v/<release>/`);
  }
  for (const [i, file] of files.entries()) {
    const url = new URL(`v/${release.id}/${file}`, base);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`keep-versions: ${res.status} fetching ${url}`);
    const target = targets[i];
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, Buffer.from(await res.arrayBuffer()));
  }
  current.versions.push(release);
  kept++;
}
writeFileSync(join(out, "versions.json"), `${JSON.stringify(current, null, 2)}\n`);
console.log(`keep-versions: kept ${kept} earlier release(s); ${current.versions.length} in versions.json, latest ${current.latest}`);
