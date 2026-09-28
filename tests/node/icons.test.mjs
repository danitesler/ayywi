import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon";
import GitBranchIcon from "@hugeicons/core-free-icons/GitBranchIcon";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const dist = (p) => fileURLToPath(new URL(`../../dist/${p}`, import.meta.url));
const skip = !existsSync(dist("react.js")) && "run pnpm build first";

test("iconSvg renders Hugeicons data as inline SVG", { skip }, async () => {
  const { iconSvg } = await import(dist("index.js"));
  assert.equal(
    iconSvg(Cancel01Icon),
    '<svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>',
  );
});

test("iconSvg options: size, label, stroke width on strokes only, escaping", { skip }, async () => {
  const { iconSvg } = await import(dist("index.js"));
  const icon = [
    ["circle", { cx: 12, cy: 12, r: 3, fill: "currentColor", key: "0" }],
    ["path", { d: "M4 4H20", stroke: "currentColor", strokeWidth: "1.5", key: "1" }],
    ["rect", { width: 4, height: 4, gradientTransform: "rotate(45)" }],
  ];
  const svg = iconSvg(icon, { size: "lg", className: "nav-icon", label: 'Say "hi" & <go>', strokeWidth: 2 });
  assert.match(svg, /^<svg class="ayy-icon ayy-icon--lg nav-icon" viewBox="0 0 24 24" fill="none" role="img" aria-label="Say &quot;hi&quot; &amp; &lt;go>">/);
  assert.match(svg, /<circle cx="12" cy="12" r="3" fill="currentColor"\/>/, "filled shapes keep their look, key is dropped");
  assert.match(svg, /<path d="M4 4H20" stroke="currentColor" stroke-width="2"\/>/);
  assert.match(svg, /<rect width="4" height="4" gradientTransform="rotate\(45\)"\/>/, "real camelCase SVG attributes stay camelCase");
  assert.doesNotMatch(svg, /aria-hidden/);
  assert.match(iconSvg(icon, { directional: true }), /^<svg class="ayy-icon ayy-icon--directional"/);
});

test("React <Icon> renders the same markup as iconSvg()", { skip }, async () => {
  const { Icon, iconSvg } = await import(dist("react.js"));
  const selfClose = (html) => html.replace(/<(\w+)([^>]*)><\/\1>/g, "<$1$2/>");
  for (const [props, options] of [
    [{}, {}],
    [{ size: "sm" }, { size: "sm" }],
    [{ label: "Branch", strokeWidth: 2 }, { label: "Branch", strokeWidth: 2 }],
    [{ directional: true, size: "lg" }, { directional: true, size: "lg" }],
  ]) {
    const react = renderToStaticMarkup(createElement(Icon, { icon: GitBranchIcon, ...props }));
    assert.equal(selfClose(react), iconSvg(GitBranchIcon, options));
  }
});

test("ayywi's close buttons draw Hugeicons' Cancel01Icon (vendored copy matches the package)", { skip }, async () => {
  const { dialogCloseIcon, iconSvg } = await import(dist("index.js"));
  assert.equal(dialogCloseIcon, iconSvg(Cancel01Icon));
});
