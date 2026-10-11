// The README's quick-start links ayywi's runtime files on jsDelivr, pinned to one release with SRI hashes.
// scripts/pin-readme.mjs rewrites them for a release; scripts/check.mjs makes sure they name the current version.
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const CDN = "https://cdn.jsdelivr.net/npm/@danitesler/ayywi@";
/** Files the README's <head> tags load, so each needs an integrity hash. */
export const PINNED = ["dist/theme-init.js", "dist/fonts.css", "dist/ayywi.min.css", "dist/elements.global.js"];

const LINK = /https:\/\/cdn\.jsdelivr\.net\/npm\/@danitesler\/ayywi@([^/\s"'`)]+)\/([^\s"'`)]+)/g;
const TAG = /<(?:script|link)\b[^>]*>/g;

export const sri = (content) => `sha384-${createHash("sha384").update(content).digest("base64")}`;

/** Every jsDelivr link in the text: { version, file }. */
export const links = (text) => [...text.matchAll(LINK)].map((m) => ({ version: m[1], file: m[2] }));

/** Each <script>/<link> tag that loads a pinned file: { file, integrity } (integrity null when missing). */
export function tags(text) {
  const out = [];
  for (const [tag] of text.matchAll(TAG)) {
    const link = links(tag)[0];
    if (link && PINNED.includes(link.file)) out.push({ file: link.file, integrity: tag.match(/integrity="([^"]+)"/)?.[1] ?? null });
  }
  return out;
}

/** The text with every link moved to `version` and every pinned tag's integrity taken from `root`/dist. */
export function pin(text, version, root) {
  const moved = text.replace(LINK, (_, _old, file) => `${CDN}${version}/${file}`);
  return moved.replace(TAG, (tag) => {
    const link = links(tag)[0];
    if (!link || !PINNED.includes(link.file)) return tag;
    const hash = sri(readFileSync(join(root, link.file)));
    const attrs = `integrity="${hash}" crossorigin="anonymous"`;
    if (/integrity="[^"]*"/.test(tag)) return tag.replace(/integrity="[^"]*"/, `integrity="${hash}"`);
    return tag.replace(/(\s*(?:defer\s*)?\/?>)$/, ` ${attrs}$1`);
  });
}
