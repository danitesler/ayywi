import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { BODY_FONT_ADJUST, brandCss, contrastRatio, createBrand, createThemeCustomization, createThemeText, surfaceStrength, THEME_FONTS, THEME_PRESETS, themeFontsUrl, tokens } from "../../dist/index.js";

const colors = ["#000000", "#ffffff", "#facc15", "#7c3aed", "#dc2626", "#0ea5e9", "#16a34a"];
const fg = ["text", "text-soft", "muted", "destructive", "success", "warning", "info", "ai", "ai-active"];
const get = (name, mode) => mode === "light" ? tokens[`color.${name}`].light : tokens[`color.${name}`].value;

test("custom surfaces keep text and primary controls readable across modes, colors and contrast", () => {
  for (const color of colors) for (const surface of ["neutral", "subtle"]) for (const contrast of [0, 25, 50, 75, 100]) {
    const palette = createThemeCustomization({ color, surface, contrast });
    const brand = createBrand({ name: "test", color });
    for (const mode of ["light", "dark"]) for (const bg of Object.values(palette[mode])) {
      for (const name of fg) assert.ok(contrastRatio(get(name, mode), bg) >= 4.5, `${color} ${surface} ${contrast} ${mode} ${name} ${bg}`);
      assert.ok(contrastRatio(brand[mode].primary, bg) >= 3, `${color} ${surface} ${contrast} ${mode} primary ${bg}`);
    }
  }
});

test("contrast reaches a black page, tint changes surfaces, and invalid values fail", () => {
  const options = { color: "#7c3aed", surface: "neutral", contrast: 100 };
  assert.equal(createThemeCustomization(options).dark.bg, "#000000");
  assert.notEqual(createThemeCustomization({ ...options, surface: "subtle" }).dark.bg, "#000000");
  assert.throws(() => createThemeCustomization({ ...options, color: "red" }));
  assert.throws(() => createThemeCustomization({ ...options, contrast: 101 }));
});

test("Surface is Neutral or Subtle: vivid and numeric strengths are rejected", () => {
  assert.equal(surfaceStrength("neutral"), 0);
  assert.equal(surfaceStrength("subtle"), 37.5);
  const options = { color: "#7c3aed", surface: "neutral", contrast: 0 };
  for (const surface of ["vivid", 0, 37.5, 60, 100, -1]) {
    assert.throws(() => surfaceStrength(surface), String(surface));
    assert.throws(() => createThemeCustomization({ ...options, surface }), String(surface));
  }
});

test("every ready-made theme with a colour uses Subtle surfaces; the defaults stay Neutral", () => {
  for (const preset of THEME_PRESETS) assert.equal(preset.customization.surface, preset.brand ? "subtle" : "neutral", preset.id);
});

test("ready-made themes run Default, then warm, green, blue, purple, pink, and each works in light and dark", () => {
  assert.deepEqual(THEME_PRESETS.map((preset) => preset.id), ["default", "ember", "forest", "arctic", "twilight", "wine"]);
  for (const preset of THEME_PRESETS) {
    assert.equal("theme" in preset, false, preset.id);
    if (preset.brand) for (const mode of ["light", "dark"]) assert.ok(createBrand(preset.brand)[mode].primary, `${preset.id} ${mode}`);
  }
});

test("preset and custom text colors remain readable on all generated surfaces", () => {
  assert.equal(THEME_PRESETS.length, 6);
  for (const preset of THEME_PRESETS) for (const textColor of [preset.customization.textColor, "#000000", "#ffffff", "#ff0000", "#777777"]) {
    const input = { ...preset.customization, textColor };
    const palette = createThemeCustomization(input, preset.brand?.color ?? null);
    const text = createThemeText(input, palette);
    for (const mode of ["dark", "light"]) for (const bg of Object.values(palette[mode])) {
      assert.ok(contrastRatio(text[mode], bg) >= 4.5, `${preset.id} ${textColor} ${mode} ${bg}`);
    }
  }
  assert.doesNotThrow(() => createThemeText({ color: "#000000", surface: "neutral", contrast: 0, textColor: "#ffffff" }));
  assert.throws(() => createThemeText({ color: "#000000", surface: "neutral", contrast: 0, textColor: "red" }), /Text color/);
});

test("font pairings are valid brand fonts, presets use them, and the preview loads every family", () => {
  assert.equal(new Set(THEME_FONTS.map((set) => set.id)).size, THEME_FONTS.length);
  for (const set of THEME_FONTS) createBrand({ name: "fonts", color: "#0ea5e9", font: set.font });
  for (const preset of THEME_PRESETS) if (preset.brand?.font) assert.ok(THEME_FONTS.some((set) => JSON.stringify(set.font) === JSON.stringify(preset.brand.font)), preset.id);
  const url = themeFontsUrl();
  assert.match(url, /^https:\/\/fonts\.googleapis\.com\/css2\?family=/);
  // The preview page's own link must cover every family a pairing needs (it renders them for real).
  const page = readFileSync(new URL("../../preview/index.html", import.meta.url), "utf8");
  for (const family of THEME_FONTS.flatMap((set) => set.google)) assert.ok(page.includes(`family=${family}`), family);
  assert.equal(themeFontsUrl([]), "");
});

test("a theme's own body font is scaled to Sora's x-height; Sora and heading-only fonts are not", () => {
  const adjust = (font) => /--ayy-font-body-adjust: ([^;]+);/.exec(brandCss({ name: "t", color: "#0ea5e9", font }))?.[1];
  assert.equal(adjust({ body: "DM Sans" }), String(BODY_FONT_ADJUST));
  assert.equal(adjust({ body: "Sora" }), "none");
  assert.equal(adjust({ heading: "Fraunces" }), undefined);
});
