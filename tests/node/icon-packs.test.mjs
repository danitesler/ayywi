import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import * as hugeiconsPackage from "@hugeicons/core-free-icons";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { iconSvg } from "../../dist/index.js";
import { glyphSvg, iconNames, loadPacks, packCss, toDataUri, validatePack } from "../../scripts/lib/icon-packs.mjs";

const root = fileURLToPath(new URL("../..", import.meta.url));

test("every glyph in src/lib/icons.ts has exactly one name", () => {
  const exports = [...readFileSync(join(root, "src/lib/icons.ts"), "utf8").matchAll(/^export const (\w+)/gm)].map((m) => m[1]);
  const hugeicons = loadPacks(root)[0];
  assert.equal(hugeicons.id, "hugeicons");
  const values = Object.values(hugeicons.glyphs);
  for (const e of exports) assert.equal(values.filter((v) => v === e).length, 1, e);
});

test("every hugeicons name is a real @hugeicons/core-free-icons export, and no export has two names", () => {
  const values = Object.values(loadPacks(root)[0].glyphs);
  assert.equal(new Set(values).size, values.length);
  for (const v of values) assert.ok(Array.isArray(hugeiconsPackage[v]), v);
});

test("names are kebab-case and hugeicons maps every one", () => {
  const packs = loadPacks(root);
  for (const n of iconNames(packs)) assert.match(n, /^[a-z0-9]+(-[a-z0-9]+)*$/);
  assert.deepEqual(validatePack(packs[0], iconNames(packs)), []);
});

test("validatePack reports missing, unknown and null-in-default names", () => {
  const names = ["x", "menu"];
  const info = { label: "P", license: "MIT", copyright: "© P", package: "p", source: { svg: "{name}.svg" } };
  assert.deepEqual(validatePack({ id: "p", ...info, glyphs: { x: "x", extra: "y" } }, names), ['p: missing "menu"', 'p: unknown "extra"']);
  assert.deepEqual(validatePack({ id: "hugeicons", ...info, glyphs: { x: null, menu: "Menu01Icon" } }, names), ['hugeicons: the default pack can\'t leave "x" empty']);
});

test("validatePack reports the pack fields packCss reads", () => {
  assert.deepEqual(validatePack({ id: "p", glyphs: { x: "x" } }, ["x"]), [
    "p: missing label", "p: missing license", "p: missing copyright", "p: missing package", "p: missing source",
  ]);
});

test("toDataUri makes a mask-ready data URI", () => {
  const uri = toDataUri('<svg width="24" height="24" class="i" viewBox="0 0 24 24"><path d="M1 1" stroke="currentColor" fill="none"/><circle fill="#333"/></svg>');
  assert.match(uri, /^url\("data:image\/svg\+xml,%3Csvg viewBox='0 0 24 24'%3E/);
  assert.match(uri, /stroke='black' fill='none'/);
  assert.match(uri, /%3Ccircle fill='black'\/%3E/);
  assert.doesNotMatch(uri, /width=|class=|#|currentColor/);
});

test("toDataUri keeps inner sizes and drops comments and line breaks", () => {
  const uri = toDataUri('<!-- licence -->\n<svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24">\n  <rect width="10" height="4" fill="red"/>\n</svg>\n');
  assert.equal(uri, `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect width='10' height='4' fill='black'/%3E%3C/svg%3E")`);
});

test("toDataUri keeps a negative-origin viewBox and unpainted filled paths as they are", () => {
  // Material Symbols: viewBox="0 -960 960 960", filled shapes with no fill attribute (a mask reads them as opaque).
  const uri = toDataUri('<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 -960 960 960"><path d="m249-207-42-42 231-231Z"/></svg>');
  assert.equal(uri, `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 -960 960 960'%3E%3Cpath d='m249-207-42-42 231-231Z'/%3E%3C/svg%3E")`);
});

test("glyphSvg draws a data glyph exactly as iconSvg does, as a standalone SVG", () => {
  const hugeicons = loadPacks(root)[0];
  const inline = iconSvg(Cancel01Icon).replace(/ class="[^"]*"/, "").replace(' aria-hidden="true"', "");
  assert.equal(glyphSvg(hugeicons, "x", root), inline.replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" '));
});

test("glyphSvg reads svg sources from the package, and falls back to hugeicons for null", () => {
  const tmp = mkdtempSync(join(tmpdir(), "ayy-pack-"));
  mkdirSync(join(tmp, "node_modules/fake/icons"), { recursive: true });
  writeFileSync(join(tmp, "node_modules/fake/icons/close.svg"), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M1 1"/></svg>\n');
  const pack = { id: "fake", package: "fake", source: { svg: "icons/{name}.svg" }, glyphs: { x: "close", menu: null } };
  assert.equal(glyphSvg(pack, "x", tmp), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M1 1"/></svg>\n');
  // null: the default pack's glyph, read from root's tokens/icon-packs and node_modules.
  assert.equal(glyphSvg(pack, "menu", root), glyphSvg(loadPacks(root)[0], "menu", root));
});

test("packCss defines every name for its pack", () => {
  const packs = loadPacks(root);
  const css = packCss(packs[0], iconNames(packs), root);
  assert.match(css, /^\/\*! Hugeicons icons for ayywi — MIT, © Hugeicons\./);
  for (const n of iconNames(packs)) {
    assert.ok(css.includes(`--_ayy-glyph-${n}: url("data:image/svg+xml,`), n);
    assert.ok(css.includes(`.ayy-icon[data-ayy-icon="${n}"] { --_ayy-glyph: var(--_ayy-glyph-${n}); }`), n);
  }
});

test("packCss masks known names only, keeps colour in print, and names Tabler Icons once", () => {
  const packs = loadPacks(root);
  const names = iconNames(packs);
  const css = packCss(packs[0], names, root);
  // An unknown data-ayy-icon has no glyph to mask with: it must keep its inline paths, not take the filled background.
  assert.doesNotMatch(css, /\.ayy-icon\[data-ayy-icon\]\s*(>\s*\*\s*)?\{/);
  const known = `:is(${names.map((n) => `[data-ayy-icon="${n}"]`).join(", ")})`;
  assert.ok(css.includes(`[data-ayy-icons="hugeicons"] .ayy-icon${known} {`));
  assert.ok(css.includes(`[data-ayy-icons="hugeicons"] .ayy-icon${known} > * { display: none; }`));
  // The fill is a background, which browsers drop when printing unless asked to keep it.
  assert.match(css, /-webkit-print-color-adjust: exact; print-color-adjust: exact;/);
  const tabler = packCss(packs.find((p) => p.id === "tabler"), names, root);
  assert.match(tabler, /^\/\*! Tabler Icons for ayywi — MIT, /);
  const material = packCss(packs.find((p) => p.id === "material-symbols"), names, root);
  assert.match(material, /^\/\*! Material Symbols icons for ayywi — /);
});
