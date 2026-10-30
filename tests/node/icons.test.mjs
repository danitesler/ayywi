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
import Calendar03Icon from "@hugeicons/core-free-icons/Calendar03Icon";
import Search01Icon from "@hugeicons/core-free-icons/Search01Icon";
import Clock01Icon from "@hugeicons/core-free-icons/Clock01Icon";
import Copy01Icon from "@hugeicons/core-free-icons/Copy01Icon";
import Tick02Icon from "@hugeicons/core-free-icons/Tick02Icon";
import CheckmarkCircle02Icon from "@hugeicons/core-free-icons/CheckmarkCircle02Icon";
import Alert02Icon from "@hugeicons/core-free-icons/Alert02Icon";
import InformationCircleIcon from "@hugeicons/core-free-icons/InformationCircleIcon";
import CancelCircleIcon from "@hugeicons/core-free-icons/CancelCircleIcon";
import ArrowLeftDoubleIcon from "@hugeicons/core-free-icons/ArrowLeftDoubleIcon";
import ArrowRightDoubleIcon from "@hugeicons/core-free-icons/ArrowRightDoubleIcon";
import StarIcon from "@hugeicons/core-free-icons/StarIcon";
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
    [{ name: "x", label: "Branch", size: "sm" }, { name: "x", label: "Branch", size: "sm" }],
  ]) {
    const react = renderToStaticMarkup(createElement(Icon, { icon: GitBranchIcon, ...props }));
    assert.equal(selfClose(react), iconSvg(GitBranchIcon, options));
  }
});

test("iconSvg and <Icon> mark a named glyph", { skip }, async () => {
  const { iconSvg } = await import(dist("index.js"));
  const { Icon } = await import(dist("react.js"));
  assert.match(iconSvg(Cancel01Icon, { name: "x" }), /^<svg class="ayy-icon" data-ayy-icon="x" viewBox="0 0 24 24"/);
  assert.match(renderToStaticMarkup(createElement(Icon, { icon: Cancel01Icon, name: "x" })), /^<svg class="ayy-icon" data-ayy-icon="x" viewBox="0 0 24 24"/);
  assert.doesNotMatch(iconSvg(Cancel01Icon), /data-ayy-icon/);
  assert.doesNotMatch(renderToStaticMarkup(createElement(Icon, { icon: Cancel01Icon })), /data-ayy-icon/);
});

test("ayywi's close buttons draw Hugeicons' Cancel01Icon (vendored copy matches the package)", { skip }, async () => {
  const { dialogCloseIcon, iconSvg } = await import(dist("index.js"));
  assert.equal(dialogCloseIcon, iconSvg(Cancel01Icon, { name: "x" }));
});

test("the app shell's menu button draws Hugeicons' Menu01Icon (vendored copy matches the package)", { skip }, async () => {
  const { appShellMenuIcon, iconSvg } = await import(dist("index.js"));
  assert.equal(appShellMenuIcon, iconSvg(Menu01Icon, { name: "menu" }));
});

test("the navbar's menu button, pagination and carousel arrows draw the Hugeicons glyphs (vendored copies match the package)", { skip }, async () => {
  const { navbarMenuIcon, iconSvg, Pagination, Carousel } = await import(dist("react.js"));
  assert.equal(navbarMenuIcon, iconSvg(Menu01Icon, { name: "menu" }));
  const selfClose = (html) => html.replace(/<(\w+)([^>]*)><\/\1>/g, "<$1$2/>");
  const pagination = selfClose(renderToStaticMarkup(createElement(Pagination, { page: 2, count: 3, href: (p) => `#${p}` })));
  assert.ok(pagination.includes(iconSvg(ArrowLeft01Icon, { name: "chevron-left", directional: true })), "previous arrow");
  assert.ok(pagination.includes(iconSvg(ArrowRight01Icon, { name: "chevron-right", directional: true })), "next arrow");
  const carousel = selfClose(renderToStaticMarkup(createElement(Carousel, { label: "Quotes" })));
  assert.ok(carousel.includes(iconSvg(ArrowLeft02Icon, { name: "arrow-left", directional: true })), "carousel previous");
  assert.ok(carousel.includes(iconSvg(ArrowRight02Icon, { name: "arrow-right", directional: true })), "carousel next");
});

test("the combobox chevron, number field steps, drop zone and chip remove draw the Hugeicons glyphs (vendored copies match the package)", { skip }, async () => {
  const { comboboxChevronIcon, numberFieldMinusIcon, numberFieldPlusIcon, dropzoneIcon, chipRemoveIcon, iconSvg } = await import(dist("index.js"));
  assert.equal(comboboxChevronIcon, iconSvg(ArrowDown01Icon, { name: "chevron-down" }));
  assert.equal(numberFieldMinusIcon, iconSvg(MinusSignIcon, { name: "minus" }));
  assert.equal(numberFieldPlusIcon, iconSvg(PlusSignIcon, { name: "plus" }));
  assert.equal(dropzoneIcon, iconSvg(CloudUploadIcon, { name: "cloud-upload" }));
  assert.equal(chipRemoveIcon, iconSvg(Cancel01Icon, { name: "x" }));
});

test("the date picker, date range, time picker, settings, top bar, command palette, search bar and tag input draw the Hugeicons glyphs (vendored copies match the package)", { skip }, async () => {
  const m = await import(dist("index.js"));
  assert.equal(m.datePickerPreviousIcon, m.iconSvg(ArrowLeft01Icon, { name: "chevron-left", directional: true }));
  assert.equal(m.datePickerNextIcon, m.iconSvg(ArrowRight01Icon, { name: "chevron-right", directional: true }));
  assert.equal(m.datePickerIcon, m.iconSvg(Calendar03Icon, { name: "calendar" }));
  assert.equal(m.dateRangePreviousIcon, m.iconSvg(ArrowLeft01Icon, { name: "chevron-left", directional: true }));
  assert.equal(m.dateRangeNextIcon, m.iconSvg(ArrowRight01Icon, { name: "chevron-right", directional: true }));
  assert.equal(m.dateRangePickerIcon, m.iconSvg(Calendar03Icon, { name: "calendar" }));
  assert.equal(m.timePickerClockIcon, m.iconSvg(Clock01Icon, { name: "clock" }));
  assert.equal(m.codeBlockCopyIcon, m.iconSvg(Copy01Icon, { name: "copy" }));
  assert.equal(m.codeBlockCheckIcon, m.iconSvg(Tick02Icon, { name: "check" }));
  assert.equal(m.settingsChevronIcon, m.iconSvg(ArrowRight01Icon, { name: "chevron-right", directional: true }));
  assert.equal(m.topBarBackIcon, m.iconSvg(ArrowLeft01Icon, { name: "chevron-left", directional: true }));
  assert.equal(m.commandSearchIcon, m.iconSvg(Search01Icon, { name: "search" }));
  assert.equal(m.searchBarIcon, m.iconSvg(Search01Icon, { name: "search" }));
  assert.equal(m.searchBarClearIcon, m.iconSvg(Cancel01Icon, { name: "x" }));
  assert.equal(m.tagRemoveIcon, m.iconSvg(Cancel01Icon, { name: "x" }));
  assert.equal(m.toastSuccessIcon, m.iconSvg(CheckmarkCircle02Icon, { name: "circle-check" }));
  assert.equal(m.toastWarningIcon, m.iconSvg(Alert02Icon, { name: "triangle-alert" }));
  assert.equal(m.toastInfoIcon, m.iconSvg(InformationCircleIcon, { name: "info" }));
  assert.equal(m.toastErrorIcon, m.iconSvg(CancelCircleIcon, { name: "circle-x" }));
  assert.equal(m.toastCopyIcon, m.iconSvg(Copy01Icon, { name: "copy" }));
  assert.equal(m.toastCopiedIcon, m.iconSvg(Tick02Icon, { name: "check" }));
  assert.equal(m.ratingStarIcon, m.iconSvg(StarIcon, { name: "star" }));
  assert.equal(m.transferListSearchIcon, m.iconSvg(Search01Icon, { name: "search" }));
  assert.equal(m.transferListAddIcon, m.iconSvg(ArrowRight01Icon, { name: "chevron-right", directional: true }));
  assert.equal(m.transferListAddAllIcon, m.iconSvg(ArrowRightDoubleIcon, { name: "chevrons-right", directional: true }));
  assert.equal(m.transferListRemoveIcon, m.iconSvg(ArrowLeft01Icon, { name: "chevron-left", directional: true }));
  assert.equal(m.transferListRemoveAllIcon, m.iconSvg(ArrowLeftDoubleIcon, { name: "chevrons-left", directional: true }));
});
