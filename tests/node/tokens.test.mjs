import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import * as sass from "sass";

const dist = (p) => fileURLToPath(new URL(`../../dist/${p}`, import.meta.url));

const THEMES = ["dark", "light", "dark-soft", "light-gray"];

test("platform token files exist and agree", { skip: !existsSync(dist("tokens")) && "run pnpm build first" }, () => {
  const [dark, ...others] = THEMES.map((t) => JSON.parse(readFileSync(dist(`tokens/${t}.json`), "utf8")));
  for (const other of others) {
    assert.deepEqual(Object.keys(other).sort(), Object.keys(dark).sort());
    assert.notEqual(JSON.stringify(other), JSON.stringify(dark));
  }
  assert.equal(others[1].color.bg.$value, "#0a0a0a"); // dark-soft
  assert.equal(others[2].color.bg.$value, "#ebebeb"); // light-gray
  assert.equal(others[2].color.surface.$value, "#ffffff");
  const swift = readFileSync(dist("tokens/Ayywi.swift"), "utf8");
  assert.match(swift, /static let darkSoft = AyywiColors/);
  assert.match(swift, /static let `switch`: CGFloat/, "Swift keywords are escaped");
  assert.match(readFileSync(dist("tokens/Ayywi.kt"), "utf8"), /val AyywiLightGrayColors = AyywiColors/);
  for (const f of ["tokens/density/comfortable.json", "tokens/density/touch.json", "tokens/Ayywi.swift", "tokens/Ayywi.kt"]) {
    assert.ok(existsSync(dist(f)), f);
  }
});

test("SCSS tokens compile", { skip: !existsSync(dist("tokens")) && "run pnpm build first" }, () => {
  const src = `@use "ayywi" as ayy;\n@use "sass:map";\n.x { color: ayy.$ayy-color-text; background: map.get(ayy.$ayy-dark, "color-bg"); }\n.y { background: map.get(ayy.$ayy-dark-soft, "color-bg"); }`;
  const { css } = sass.compileString(src, { loadPaths: [dist("tokens")] });
  assert.match(css, /color: var\(--ayy-color-text\)/);
  assert.match(css, /background: #000/);
  assert.match(css, /background: #0a0a0a/);
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
  assert.match(layered, /@layer ayywi\.tokens, ayywi\.base, ayywi\.components, ayywi\.brand;/);
  assert.doesNotMatch(unlayered, /@layer/);
  assert.match(readFileSync(dist("react.js"), "utf8"), /^"use client";/);
  assert.match(readFileSync(dist("react.cjs"), "utf8"), /^"use client";/);
  assert.doesNotMatch(readFileSync(dist("index.js"), "utf8"), /use client/);
});
