import assert from "node:assert/strict";
import { test } from "node:test";
import { loadContract, lintText } from "../../cli/lint.mjs";

const contract = loadContract();
const rules = (text, file) => lintText(text, file, contract).map((f) => f.rule);

test("clean markup passes", () => {
  const html = `<button class="ayy-button ayy-button--outline ayy-button--sm">Save</button>
<button class="ayy-button ayy-button--icon" aria-label="Close"><svg aria-hidden="true"></svg></button>
<ayy-tooltip class="ayy-tooltip" side="bottom"><button class="ayy-button">?</button></ayy-tooltip>`;
  assert.deepEqual(rules(html, "a.html"), []);
});

test("unknown class, with a suggestion", () => {
  const [f] = lintText(`<button class="ayy-buton">x</button>`, "a.html", contract);
  assert.equal(f.rule, "unknown-class");
  assert.match(f.message, /ayy-button/);
});

test("unknown React variant and unlabeled icon button", () => {
  const tsx = `<Button variant="danger">Go</Button>
<button className="ayy-button ayy-button--icon"><svg /></button>`;
  assert.deepEqual(rules(tsx, "a.tsx"), ["unknown-variant", "icon-button-label"]);
});

test("unknown element attribute value", () => {
  assert.deepEqual(rules(`<ayy-tooltip class="ayy-tooltip" side="left"></ayy-tooltip>`, "a.html"), ["unknown-attribute-value"]);
});

test("data-theme and data-density values", () => {
  assert.deepEqual(rules(`<html data-theme="dark-soft" data-density="touch"><section data-theme="light-gray"></section></html>`, "a.html"), []);
  assert.deepEqual(rules(`<html data-theme="dim"><div data-density="cozy"></div></html>`, "a.html"), ["unknown-attribute-value", "unknown-attribute-value"]);
  assert.deepEqual(rules(`<div :data-theme="mode" data-theme={mode}></div>`, "a.vue"), [], "bound values are skipped");
  const [f] = lintText(`<html data-theme="soft">`, "a.html", contract);
  assert.match(f.message, /dark-soft/);
});

test("CSS: raw colours, unknown tokens, physical properties, :dir()", () => {
  const css = `.x { color: #fff; margin-left: 4px; background: var(--ayy-color-nope); }
.y:dir(rtl) { padding-inline-start: var(--ayy-space-2); }`;
  assert.deepEqual(rules(css, "a.css").sort(), ["dir-selector", "hardcoded-color", "physical-property", "unknown-token"].sort());
});

test("images need width and height (warning)", () => {
  const found = lintText(`<img src="a.webp" alt="">\n<img src="b.webp" width="1024" height="798" alt="">\n<Image {...props} />`, "a.tsx", contract);
  assert.deepEqual(found.map((f) => [f.rule, f.severity, f.line]), [["img-size", "warn", 1]]);
});

test("disable comments", () => {
  const css = `.x { color: #fff; } /* ayywi-lint-disable-line */
/* ayywi-lint-disable-next-line */
.y { color: #000; }`;
  assert.deepEqual(rules(css, "a.css"), []);
});

test("config can turn a rule off", () => {
  const found = lintText(`.x { margin-left: 4px; }`, "a.css", contract, { rules: { "physical-property": "off" } });
  assert.deepEqual(found, []);
});

test("icons: another icon set warns, a pasted colour errors, variants are checked", () => {
  const imports = `import { Search } from "lucide-react";
import { Search01Icon } from "@hugeicons/core-free-icons";
const fa = require("react-icons/fa");`;
  assert.deepEqual(
    lintText(imports, "a.tsx", contract).map((f) => [f.rule, f.severity, f.line]),
    [["icon-library", "warn", 1], ["icon-library", "warn", 3]],
  );
  assert.deepEqual(rules(`<svg class="ayy-icon" viewBox="0 0 24 24" color="#000000" fill="none"></svg>`, "a.html"), ["hardcoded-color"]);
  assert.deepEqual(rules(`<svg class="ayy-icon ayy-icon--lg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path stroke="currentColor" /></svg>`, "a.html"), []);
  assert.deepEqual(rules(`<Icon icon={Search01Icon} size="huge" />\n<DialogContent side="left" />`, "a.tsx"), ["unknown-variant", "unknown-variant"]);
  assert.deepEqual(rules(`<Icon icon={Search01Icon} size="lg" label="Search" />\n<DialogContent side="end" />`, "a.tsx"), []);
});

test("named colours and physical corners in CSS; system colours and masks are fine", () => {
  assert.deepEqual(rules(`.x { color: tomato; border: 1px solid white; }`, "a.css"), ["hardcoded-color", "hardcoded-color"]);
  assert.deepEqual(rules(`.x { border-top-left-radius: 4px; }`, "a.css"), ["physical-property"]);
  const fine = `.x { color: var(--ayy-color-text); background: color-mix(in srgb, currentColor 8%, transparent); mask-image: linear-gradient(black 0 0); }
@media (forced-colors: active) { .x { color: CanvasText; background-color: Highlight; } }`;
  assert.deepEqual(rules(fine, "a.css"), []);
});

test("inline styles get the colour and direction rules: style=\"\" and style={{}}", () => {
  assert.deepEqual(rules(`<div style="color: #ff0000; margin-left: 4px">x</div>`, "a.html"), ["hardcoded-color", "physical-property"]);
  assert.deepEqual(rules(`<div style={{ marginLeft: 4, color: "red", textAlign: "left" }} />`, "a.tsx"), ["hardcoded-color", "physical-property", "physical-property"]);
  const fine = `<div style="inline-size: 100%; --ayy-gap: var(--ayy-space-2)"></div>
<div style={{ inlineSize: "100%", background: "color-mix(in srgb, var(--ayy-color-text) 5%, transparent)", "--ayy-gap": \`var(--ayy-space-\${n})\` }} />`;
  assert.deepEqual(rules(fine, "a.tsx"), []);
});
