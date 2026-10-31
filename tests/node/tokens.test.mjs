import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import * as sass from "sass";
import { loadTokens } from "../../scripts/lib/tokens.mjs";

const dist = (p) => fileURLToPath(new URL(`../../dist/${p}`, import.meta.url));

const THEMES = ["dark", "light", "dark-contrast", "light-gray"];

test("platform token files exist and agree", { skip: !existsSync(dist("tokens")) && "run pnpm build first" }, () => {
  const [dark, ...others] = THEMES.map((t) => JSON.parse(readFileSync(dist(`tokens/${t}.json`), "utf8")));
  for (const other of others) {
    assert.deepEqual(Object.keys(other).sort(), Object.keys(dark).sort());
    assert.notEqual(JSON.stringify(other), JSON.stringify(dark));
  }
  assert.equal(dark.color.bg.$value, "#0a0a0a");
  assert.equal(others[1].color.bg.$value, "#000000"); // dark-contrast
  assert.equal(others[2].color.bg.$value, "#ebebeb"); // light-gray
  assert.equal(others[2].color.surface.$value, "#ffffff");
  const swift = readFileSync(dist("tokens/Ayywi.swift"), "utf8");
  assert.match(swift, /static let darkContrast = AyywiColors/);
  assert.match(swift, /static let `switch`: CGFloat/, "Swift keywords are escaped");
  assert.match(readFileSync(dist("tokens/Ayywi.kt"), "utf8"), /val AyywiLightGrayColors = AyywiColors/);
  for (const f of ["tokens/density/comfortable.json", "tokens/density/touch.json", "tokens/Ayywi.swift", "tokens/Ayywi.kt"]) {
    assert.ok(existsSync(dist(f)), f);
  }
});

test("SCSS tokens compile", { skip: !existsSync(dist("tokens")) && "run pnpm build first" }, () => {
  const src = `@use "ayywi" as ayy;\n@use "sass:map";\n.x { color: ayy.$ayy-color-text; background: map.get(ayy.$ayy-dark, "color-bg"); }\n.y { background: map.get(ayy.$ayy-dark-contrast, "color-bg"); }`;
  const { css } = sass.compileString(src, { loadPaths: [dist("tokens")] });
  assert.match(css, /color: var\(--ayy-color-text\)/);
  assert.match(css, /background: #0a0a0a/);
  assert.match(css, /background: #000/);
});

test("themeInitScript applies every stored theme before paint", { skip: !existsSync(dist("index.js")) && "run pnpm build first" }, async () => {
  const { themeInitScript, themes } = await import(dist("index.js"));
  assert.deepEqual([...themes], THEMES);
  for (const stored of [...THEMES, "bogus"]) {
    const attrs = {};
    const run = new Function("localStorage", "document", themeInitScript);
    run({ getItem: (k) => (k === "ayy-theme" ? stored : null) }, { documentElement: { setAttribute: (k, v) => (attrs[k] = v) } });
    assert.equal(attrs["data-theme"], stored === "bogus" ? undefined : stored);
  }
});

test("CSS bundles: layered and unlayered, React build marked use client", { skip: !existsSync(dist("ayywi.css")) && "run pnpm build first" }, () => {
  const layered = readFileSync(dist("ayywi.css"), "utf8");
  const unlayered = readFileSync(dist("ayywi.unlayered.css"), "utf8");
  assert.match(layered, /@layer ayywi\.tokens, ayywi\.base, ayywi\.components, ayywi\.utilities, ayywi\.brand;/);
  assert.doesNotMatch(unlayered, /@layer/);
  assert.match(readFileSync(dist("react.js"), "utf8"), /^"use client";/);
  assert.match(readFileSync(dist("react.cjs"), "utf8"), /^"use client";/);
  assert.doesNotMatch(readFileSync(dist("index.js"), "utf8"), /use client/);
});

test("require() gets one copy of stateful modules across entries", { skip: !existsSync(dist("index.cjs")) && "run pnpm build first" }, () => {
  const require = createRequire(import.meta.url);
  const main = require(dist("index.cjs"));
  const react = require(dist("react.cjs"));
  assert.equal(typeof main.toast, "function");
  assert.equal(react.toast, main.toast, "one toast queue, whichever entry a CJS app requires");
  assert.equal(typeof react.Toaster, "function");
});

// ---- Size scope (data-size) ----

const tokensCss = readFileSync(fileURLToPath(new URL("../../src/css/tokens.css", import.meta.url)), "utf8");
const blockOf = (selector) => tokensCss.match(new RegExp(`\\n${selector.replace(/[[\]"]/g, "\\$&")},\\n:root${selector.replace(/[[\]"]/g, "\\$&")} \\{([^}]*)\\}`))?.[1] ?? "";

test("size scope: a block per scope, after the density blocks, listing :root so it out-ranks the touch rule", () => {
  const lastDensity = tokensCss.lastIndexOf('[data-density="touch"] {');
  for (const scope of ["sm", "md", "lg"]) {
    const at = tokensCss.indexOf(`[data-size="${scope}"],\n:root[data-size="${scope}"] {`);
    assert.ok(at > lastDensity, `[data-size="${scope}"] comes after every density block`);
    assert.ok(blockOf(`[data-size="${scope}"]`).includes("--ayy-size-control-md:"), `${scope} sets the default control height`);
  }
});

test("size scope: md restores every scoped token from its pristine copy, which every density block also sets", () => {
  const md = blockOf('[data-size="md"]');
  const scoped = [...md.matchAll(/(--ayy-[\w-]+): var\((--_ayy-[\w-]+)\)/g)];
  assert.ok(scoped.length >= 6, "size, check, switch, text, field text and padding, at least");
  for (const [, pub, pristine] of scoped) {
    assert.equal(pristine, pub.replace("--", "--_"), `${pub} restores from ${pristine}`);
    // :root, the touch-device rule and the three density blocks: five places a pristine copy has to exist.
    assert.equal(tokensCss.split(`${pristine}:`).length - 1, 5, `${pristine} is declared once in each of the five density places`);
  }
});

test("size scope: a step that is itself scoped points at its pristine copy, never at its public name", () => {
  const scopedNames = new Set([...blockOf('[data-size="md"]').matchAll(/(--ayy-[\w-]+):/g)].map((m) => m[1]));
  for (const scope of ["sm", "lg"]) {
    for (const [, name, ref] of blockOf(`[data-size="${scope}"]`).matchAll(/(--ayy-[\w-]+): var\((--[\w-]+)\)/g)) {
      // The scope rule remaps these in the same breath, so their public names would resolve to the scope's own step.
      assert.ok(!scopedNames.has(ref), `${scope}: ${name} reads ${ref}, which this block is also remapping`);
    }
  }
  assert.match(blockOf('[data-size="lg"]'), /--ayy-size-control-dense: var\(--_ayy-size-control-md\)/, "lg: chips and pagination go to the pristine medium step");
  assert.match(blockOf('[data-size="sm"]'), /--ayy-size-control-dense: var\(--ayy-size-control-xs\)/);
});

test("size scope: a token with no entry for a scope stays at its default there, and field text never shrinks", () => {
  // control.text-field only has an lg entry: sm leaves it (iOS zooms into focused fields under 16px on touch).
  assert.match(blockOf('[data-size="sm"]'), /--ayy-control-text-field: var\(--_ayy-control-text-field\)/);
  assert.match(blockOf('[data-size="lg"]'), /--ayy-control-text-field: var\(--ayy-control-text-lg\)/);
});

test("size scope: the token source is validated", () => {
  const load = (size, extra = {}) => {
    const root = mkdtempSync(join(tmpdir(), "ayywi-tokens-"));
    mkdirSync(join(root, "tokens"));
    const dense = { comfortable: "2rem", touch: "3rem" };
    const token = (ayywi) => ({ $type: "dimension", $value: "1rem", $extensions: { ayywi } });
    writeFileSync(
      join(root, "tokens/tokens.json"),
      JSON.stringify({ size: { a: token({ density: dense, size }), b: token({ density: dense }), c: token({}), ...extra } }),
    );
    return () => loadTokens(root);
  };
  assert.doesNotThrow(load({ sm: "{size.b}" }));
  assert.throws(load({ sm: "{size.b}" }, { a: { $type: "dimension", $value: "1rem", $extensions: { ayywi: { size: { sm: "{size.b}" } } } } }), /needs density/);
  assert.throws(load({ md: "{size.b}" }), /"md" is the default/);
  assert.throws(load({ xl: "{size.b}" }), /size scope "xl"/);
  assert.throws(load({ sm: "{size.c}" }), /isn't density-aware/);
  assert.throws(load({ sm: "1rem" }), /must be a \{reference\}/);
  assert.throws(load({ sm: "{size.nope}" }), /must be a \{reference\}/);
});
