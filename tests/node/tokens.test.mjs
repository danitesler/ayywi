import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import * as sass from "sass";

const dist = (p) => fileURLToPath(new URL(`../../dist/${p}`, import.meta.url));

test("platform token files exist and agree", { skip: !existsSync(dist("tokens")) && "run pnpm build first" }, () => {
  const dark = JSON.parse(readFileSync(dist("tokens/dark.json"), "utf8"));
  const light = JSON.parse(readFileSync(dist("tokens/light.json"), "utf8"));
  assert.deepEqual(Object.keys(dark).sort(), Object.keys(light).sort());
  assert.notEqual(JSON.stringify(dark), JSON.stringify(light));
  for (const f of ["tokens/density/comfortable.json", "tokens/density/touch.json", "tokens/Ayywi.swift", "tokens/Ayywi.kt"]) {
    assert.ok(existsSync(dist(f)), f);
  }
});

test("SCSS tokens compile", { skip: !existsSync(dist("tokens")) && "run pnpm build first" }, () => {
  const src = `@use "ayywi" as ayy;\n@use "sass:map";\n.x { color: ayy.$ayy-color-text; background: map.get(ayy.$ayy-dark, "color-bg"); }`;
  const { css } = sass.compileString(src, { loadPaths: [dist("tokens")] });
  assert.match(css, /color: var\(--ayy-color-text\)/);
  assert.match(css, /background: #/);
});

test("CSS bundles: layered and unlayered, React build marked use client", { skip: !existsSync(dist("ayywi.css")) && "run pnpm build first" }, () => {
  const layered = readFileSync(dist("ayywi.css"), "utf8");
  const unlayered = readFileSync(dist("ayywi.unlayered.css"), "utf8");
  assert.match(layered, /@layer ayywi\.tokens, ayywi\.base, ayywi\.components, ayywi\.brand/);
  assert.doesNotMatch(unlayered, /@layer/);
  assert.match(readFileSync(dist("react.js"), "utf8"), /^"use client";/);
  assert.match(readFileSync(dist("react.cjs"), "utf8"), /^"use client";/);
  assert.doesNotMatch(readFileSync(dist("index.js"), "utf8"), /use client/);
});
