import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const dist = (p) => fileURLToPath(new URL(`../../dist/${p}`, import.meta.url));
const skip = !existsSync(dist("index.js")) && "run pnpm build first";

function el(parent = null) {
  const attrs = {};
  return {
    parentElement: parent,
    setAttribute: (k, v) => (attrs[k] = String(v)),
    removeAttribute: (k) => delete attrs[k],
    getAttribute: (k) => (k in attrs ? attrs[k] : null),
    hasAttribute: (k) => k in attrs,
    closest(sel) {
      const attr = /^\[(.+)\]$/.exec(sel)[1];
      for (let n = this; n; n = n.parentElement) if (n.hasAttribute(attr)) return n;
      return null;
    },
  };
}

function stub() {
  const html = el();
  const data = new Map();
  globalThis.document = { documentElement: html };
  globalThis.localStorage = { getItem: (k) => (data.has(k) ? data.get(k) : null), setItem: (k, v) => data.set(k, String(v)) };
  return html;
}

test("setIconPack sets, clears and persists the pack", { skip }, async () => {
  const { setIconPack, getIconPack } = await import(dist("index.js"));
  const html = stub();
  setIconPack("lucide");
  assert.equal(html.getAttribute("data-ayy-icons"), "lucide");
  assert.equal(getIconPack(), "lucide");
  setIconPack("hugeicons");
  assert.equal(html.hasAttribute("data-ayy-icons"), false);
  assert.equal(getIconPack(), "hugeicons");
});

test("a pack set on another element isn't persisted unless asked", { skip }, async () => {
  const { setIconPack, getIconPack } = await import(dist("index.js"));
  const html = stub();
  const section = el(html);
  setIconPack("tabler", section);
  assert.equal(section.getAttribute("data-ayy-icons"), "tabler");
  assert.equal(getIconPack(), "hugeicons");
  setIconPack("feather", section, { persist: true });
  assert.equal(getIconPack(), "feather");
});

test("hugeicons resets a subtree inside another pack", { skip }, async () => {
  const { setIconPack } = await import(dist("index.js"));
  const html = stub();
  const child = el(html);
  setIconPack("tabler");
  setIconPack("hugeicons", child);
  assert.equal(child.getAttribute("data-ayy-icons"), "hugeicons");
  setIconPack("hugeicons");
  const other = el(html);
  setIconPack("hugeicons", other);
  assert.equal(other.hasAttribute("data-ayy-icons"), false, "nothing to reset outside a pack");
});

test("getIconPack ignores unknown stored values", { skip }, async () => {
  const { getIconPack } = await import(dist("index.js"));
  stub();
  localStorage.setItem("ayy-icons", "nope");
  assert.equal(getIconPack(), "hugeicons");
  localStorage.setItem("ayy-icons", "feather");
  assert.equal(getIconPack(), "feather");
});

test("themeInitScript restores a stored pack", { skip }, async () => {
  const { themeInitScript } = await import(dist("index.js"));
  for (const [stored, expected] of [["tabler", "tabler"], ["hugeicons", undefined], ["nope", undefined], [null, undefined]]) {
    const attrs = {};
    const run = new Function("localStorage", "document", themeInitScript);
    run({ getItem: (k) => (k === "ayy-icons" ? stored : null) }, { documentElement: { setAttribute: (k, v) => (attrs[k] = v) } });
    assert.equal(attrs["data-ayy-icons"], expected, String(stored));
  }
});

test("presets and the stored customization name only known packs", { skip }, async () => {
  const { THEME_PRESETS, iconPacks } = await import(dist("index.js"));
  const named = Object.fromEntries(THEME_PRESETS.filter((p) => p.icons).map((p) => [p.id, p.icons]));
  assert.deepEqual(named, { arctic: "tabler", forest: "feather", paper: "material-symbols", lagoon: "lucide" });
  for (const pack of Object.values(named)) assert.ok(iconPacks.includes(pack));
});

test("setThemeCustomization doesn't apply the icons field", { skip }, async () => {
  const { setThemeCustomization } = await import(dist("index.js"));
  const html = stub();
  html.ownerDocument = { createElement: () => ({ dataset: {}, remove() {} }), head: { append() {} } };
  setThemeCustomization({ color: "#0ea5e9", surface: "neutral", contrast: 0, icons: "tabler" });
  assert.equal(html.hasAttribute("data-ayy-icons"), false);
});
