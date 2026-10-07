import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const dist = (p) => fileURLToPath(new URL(`../../dist/${p}`, import.meta.url));
const cli = fileURLToPath(new URL("../../cli/index.mjs", import.meta.url));
const skip = !existsSync(dist("index.js")) && "run pnpm build first";

// Seeds across the wheel and the awkward ones: near white, near black, grey, a yellow that fails on white.
const SEEDS = ["#7c3aed", "#facc15", "#1e3a8a", "#808080", "#dc2626", "#fde7f3", "#000000", "#ffffff", "#0ea5e9", "#16a34a", "#f97316", "#123"];

test("every seed gives a brand whose every contrast check passes", { skip }, async () => {
  const { createBrand, contrastRatio, themes, BRAND_STEPS } = await import(dist("index.js"));
  for (const color of SEEDS) {
    const b = createBrand({ name: "x", color });
    assert.equal(Object.keys(b.scale).length, BRAND_STEPS.length, color);
    // 4 themes × (text on primary + primary/ring on 3 surfaces)
    assert.equal(b.checks.length, themes.length * 4, color);
    for (const c of b.checks) assert.ok(c.pass, `${color} ${c.theme} ${c.pair} ${c.ratio}`);
    assert.ok(contrastRatio(b.dark.primaryFg, b.dark.primary) >= 4.5, color);
    assert.ok(contrastRatio(b.light.primaryFg, b.light.primary) >= 4.5, color);
  }
});

test("the scale runs light to dark and holds the seed exactly", { skip }, async () => {
  const { createBrand, contrastRatio } = await import(dist("index.js"));
  for (const color of SEEDS) {
    const b = createBrand({ name: "x", color });
    const hex = color.length === 4 ? `#${[...color.slice(1)].map((c) => c + c).join("")}` : color;
    assert.equal(b.scale[b.seedStep], hex, color);
    const steps = Object.values(b.scale);
    // Each step is no lighter than the one before (contrast against white rises).
    for (let i = 1; i < steps.length; i++) assert.ok(contrastRatio(steps[i], "#ffffff") >= contrastRatio(steps[i - 1], "#ffffff") - 0.01, `${color} ${steps[i - 1]} → ${steps[i]}`);
  }
});

test("a seed that already works is used as is; one that doesn't says why", { skip }, async () => {
  const { createBrand } = await import(dist("index.js"));
  const red = createBrand({ name: "red", color: "#dc2626" });
  assert.equal(red.light.primary, "#dc2626");
  assert.equal(red.dark.primary, "#dc2626");
  assert.deepEqual(red.notes, []);
  const yellow = createBrand({ name: "yellow", color: "#facc15" });
  assert.equal(yellow.dark.primary, "#facc15");
  assert.notEqual(yellow.light.primary, "#facc15");
  assert.equal(yellow.light.primaryFg, "#ffffff");
  assert.match(yellow.notes.join(" "), /light themes/);
});

test("fonts keep ayywi's fallbacks, shapes set the corners, bad input throws", { skip }, async () => {
  const { createBrand } = await import(dist("index.js"));
  const b = createBrand({ name: "acme", color: "#0ea5e9", font: { body: "Inter", heading: ["Inter Display", "Inter"] }, shape: "sharp", radius: { card: "20px" } });
  assert.match(b.font.body, /^Inter, system-ui,/);
  assert.match(b.font.body, /sans-serif$/);
  assert.match(b.font.heading, /^"Inter Display", Inter, system-ui/);
  assert.deepEqual(b.radius, { control: "var(--ayy-radius-sm)", card: "20px", button: "var(--ayy-radius-sm)" });
  assert.throws(() => createBrand({ name: "Acme", color: "#000" }), /kebab-case/);
  assert.throws(() => createBrand({ name: "a", color: "blue" }), /isn't a colour/);
  assert.throws(() => createBrand({ name: "a", color: "#000", shape: "blob" }), /shape/);
  assert.throws(() => createBrand({ name: "a", color: "#000", radius: { button: "1px; color: red" } }), /length/);
  assert.throws(() => createBrand({ name: "a", color: "#000", font: { body: "x}body{color:red" } }), /family name/);
});

test("brandCss: layered for [data-brand], repeated on nested themes, unlayered on request", { skip }, async () => {
  const { brandCss } = await import(dist("index.js"));
  const css = brandCss({ name: "acme", color: "#7c3aed" });
  assert.match(css, /@layer ayywi\.tokens, ayywi\.base, ayywi\.components, ayywi\.brand;/);
  assert.match(css, /\[data-brand="acme"\] :is\(\[data-theme\], \.dark, \.light\)/);
  assert.match(css, /--ayy-color-primary: light-dark\(#7c3aed, #[0-9a-f]{6}\);/);
  assert.match(css, /--ayy-brand-950: #[0-9a-f]{6};/);
  const root = brandCss({ name: "acme", color: "#7c3aed" }, { selector: ":root", layer: false });
  assert.doesNotMatch(root, /@layer/);
  assert.match(root, /^:root,$/m);
});

test("brands/violet.css ships, so setBrand(\"violet\") apps keep working", { skip: !existsSync(dist("brands")) && "run pnpm build first" }, async () => {
  const { brands, brandPresets, brandCss } = await import(dist("index.js"));
  assert.ok(brands.includes("violet"));
  const css = readFileSync(dist("brands/violet.css"), "utf8");
  assert.equal(css, brandCss(brandPresets.violet));
  assert.match(css, /\[data-brand="violet"\]/);
  assert.match(css, /--ayy-radius-button: 10px;/);
  const tokens = readFileSync(dist("css/tokens.css"), "utf8");
  assert.match(tokens, /\[data-brand\],/, "derived tokens (the glow shadow) recompute under a brand");
});

test("brand tokens for other platforms: concrete DTCG per theme, shipped for violet", { skip: !existsSync(dist("tokens/brands")) && "run pnpm build first" }, async () => {
  const { brandTokens, createBrand, themes } = await import(dist("index.js"));
  const b = createBrand({ name: "acme", color: "#facc15", shape: "soft", font: { body: "Inter" } });
  const light = brandTokens(b, "light-gray");
  assert.equal(light.color.primary.$value, b.light.primary);
  assert.equal(brandTokens(b, "dark-soft").color.primary.$value, b.dark.primary);
  assert.equal(light.radius.button.$value, "8px", "radius references resolve to values");
  assert.match(light.font.body.$value, /^Inter, system-ui/);
  assert.equal(light.brand["950"].$type, "color");
  for (const theme of themes) {
    const shipped = JSON.parse(readFileSync(dist(`tokens/brands/violet/${theme}.json`), "utf8"));
    assert.equal(shipped.radius.button.$value, "10px");
    assert.match(shipped.color.ring.$value, /^#[0-9a-f]{6}$/);
  }
});

test("ayywi brand CLI prints CSS and the report, and fails on bad input", { skip }, () => {
  const out = execFileSync(process.execPath, [cli, "brand", "0ea5e9", "--name=sky", "--shape", "round"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  assert.match(out, /\[data-brand="sky"\]/);
  assert.match(out, /--ayy-radius-button: var\(--ayy-radius-xl\)/);
  const json = JSON.parse(execFileSync(process.execPath, [cli, "brand", "#0ea5e9", "--json"], { encoding: "utf8" }));
  assert.equal(json.name, "brand");
  assert.ok(json.checks.every((c) => c.pass));
  assert.throws(() => execFileSync(process.execPath, [cli, "brand", "teal"], { stdio: "pipe" }));
});
