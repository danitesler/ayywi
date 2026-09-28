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
  assert.deepEqual(rules(`<html data-theme="dark-soft" data-density="touch"><section data-theme="light-soft"></section></html>`, "a.html"), []);
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
