import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon";
import Menu01Icon from "@hugeicons/core-free-icons/Menu01Icon";
import ArrowLeft01Icon from "@hugeicons/core-free-icons/ArrowLeft01Icon";
import ArrowRight01Icon from "@hugeicons/core-free-icons/ArrowRight01Icon";
import ArrowLeft02Icon from "@hugeicons/core-free-icons/ArrowLeft02Icon";
import ArrowRight02Icon from "@hugeicons/core-free-icons/ArrowRight02Icon";
import GitBranchIcon from "@hugeicons/core-free-icons/GitBranchIcon";
import ArrowDown01Icon from "@hugeicons/core-free-icons/ArrowDown01Icon";
import CloudUploadIcon from "@hugeicons/core-free-icons/CloudUploadIcon";
import MinusSignIcon from "@hugeicons/core-free-icons/MinusSignIcon";
import PlusSignIcon from "@hugeicons/core-free-icons/PlusSignIcon";
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

test("the app shell's menu button draws Hugeicons' Menu01Icon (vendored copy matches the package)", { skip }, async () => {
  const { appShellMenuIcon, iconSvg } = await import(dist("index.js"));
  assert.equal(appShellMenuIcon, iconSvg(Menu01Icon));
});

test("the navbar's menu button, pagination and carousel arrows draw the Hugeicons glyphs (vendored copies match the package)", { skip }, async () => {
  const { navbarMenuIcon, iconSvg, Pagination, Carousel } = await import(dist("react.js"));
  assert.equal(navbarMenuIcon, iconSvg(Menu01Icon));
  const selfClose = (html) => html.replace(/<(\w+)([^>]*)><\/\1>/g, "<$1$2/>");
  const pagination = selfClose(renderToStaticMarkup(createElement(Pagination, { page: 2, count: 3, href: (p) => `#${p}` })));
  assert.ok(pagination.includes(iconSvg(ArrowLeft01Icon, { directional: true })), "previous arrow");
  assert.ok(pagination.includes(iconSvg(ArrowRight01Icon, { directional: true })), "next arrow");
  const carousel = selfClose(renderToStaticMarkup(createElement(Carousel, { label: "Quotes" })));
  assert.ok(carousel.includes(iconSvg(ArrowLeft02Icon, { directional: true })), "carousel previous");
  assert.ok(carousel.includes(iconSvg(ArrowRight02Icon, { directional: true })), "carousel next");
});

test("the combobox chevron, number field steps, drop zone and chip remove draw the Hugeicons glyphs (vendored copies match the package)", { skip }, async () => {
  const { comboboxChevronIcon, numberFieldMinusIcon, numberFieldPlusIcon, dropzoneIcon, chipRemoveIcon, iconSvg } = await import(dist("index.js"));
  assert.equal(comboboxChevronIcon, iconSvg(ArrowDown01Icon));
  assert.equal(numberFieldMinusIcon, iconSvg(MinusSignIcon));
  assert.equal(numberFieldPlusIcon, iconSvg(PlusSignIcon));
  assert.equal(dropzoneIcon, iconSvg(CloudUploadIcon));
  assert.equal(chipRemoveIcon, iconSvg(Cancel01Icon));
});
