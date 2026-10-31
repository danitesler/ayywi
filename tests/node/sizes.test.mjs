import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const dist = (p) => fileURLToPath(new URL(`../../dist/${p}`, import.meta.url));
const skip = !existsSync(dist("index.js")) && "run pnpm build first";

// The helpers that gained a size, each with the class it returns for "sm" and "lg" ("md" is the default and adds none).
const SIZED = [
  ["checkboxSizeClass", "ayy-checkbox"],
  ["radioSizeClass", "ayy-radio"],
  ["switchSizeClass", "ayy-switch"],
  ["kbdSizeClass", "ayy-kbd"],
  ["tabsSizeClass", "ayy-tabs"],
  ["paginationRootSizeClass", "ayy-pagination"],
  ["accordionSizeClass", "ayy-accordion"],
  ["sliderSizeClass", "ayy-slider"],
  ["menuSizeClass", "ayy-menu"],
  ["popoverSizeClass", "ayy-popover"],
];

const CLASS_OPTIONS = [
  ["textareaClass", "ayy-textarea"],
  ["badgeClass", "ayy-badge"],
  ["chipClass", "ayy-chip"],
  ["breadcrumbClass", "ayy-breadcrumb"],
  ["stepsClass", "ayy-steps"],
  ["alertClass", "ayy-alert"],
  ["cardClass", "ayy-card"],
  ["searchBarClass", "ayy-search-bar"],
  ["treeClass", "ayy-tree"],
  ["emptyStateClass", "ayy-empty-state"],
  ["propertyListClass", "ayy-property-list"],
  ["choiceCardClass", "ayy-choice-card"],
  ["codeBlockClass", "ayy-code-block"],
];

test("size helpers add --sm and --lg, and nothing for md", { skip }, async () => {
  const lib = await import(dist("index.js"));
  for (const [name, root] of SIZED) {
    assert.equal(lib[name]("sm"), `${root}--sm`, name);
    assert.equal(lib[name]("lg"), `${root}--lg`, name);
    assert.equal(lib[name]("md"), undefined, name);
    assert.equal(lib[name](), undefined, name);
  }
  assert.equal(lib.sliderSizeClass("lg", true), "ayy-slider-range--lg");
  for (const [name, root] of CLASS_OPTIONS) {
    assert.match(lib[name]({ size: "sm" }), new RegExp(`(^| )${root}--sm( |$)`), name);
    assert.match(lib[name]({ size: "lg" }), new RegExp(`(^| )${root}--lg( |$)`), name);
    assert.doesNotMatch(lib[name]({ size: "md" }), /--(sm|md|lg)\b/, name);
  }
  assert.equal(lib.radioGroupClass({ size: "lg", orientation: "horizontal" }), "ayy-radio-group ayy-radio-group--horizontal ayy-radio-group--lg");
  assert.equal(lib.choiceGroupClass({ size: "lg" }), "ayy-choice-group ayy-choice-group--lg");
  assert.deepEqual(lib.avatarSizes, ["xs", "sm", "md", "lg", "xl", "2xl"]);
  assert.deepEqual(lib.buttonSizes.filter((x) => /^(xs|xl|icon-xs|icon-xl)$/.test(x)).sort(), ["icon-xl", "icon-xs", "xl", "xs"]);
  assert.equal(lib.buttonClass({ size: "xs" }), "ayy-button ayy-button--xs");
  assert.equal(lib.buttonClass({ size: "icon-xl" }), "ayy-button ayy-button--icon-xl");
  for (const name of ["segmentedControlSizes", "numberFieldSizes", "fabSizes"]) assert.ok(lib[name].includes("lg"), name);
  assert.ok(lib.searchBarSizes.includes("sm"));
});

test("every size class a helper can return is defined in the built CSS", { skip }, async () => {
  const lib = await import(dist("index.js"));
  const css = readFileSync(dist("ayywi.css"), "utf8");
  const defined = (cls) => new RegExp(`\\.${cls.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&")}(?![\\w-])`).test(css);
  const emitted = [
    ...SIZED.flatMap(([name]) => ["sm", "lg"].map((s) => lib[name](s))),
    lib.sliderSizeClass("sm", true),
    lib.sliderSizeClass("lg", true),
    ...CLASS_OPTIONS.flatMap(([name]) => ["sm", "lg"].map((s) => lib[name]({ size: s }))),
    lib.radioGroupClass({ size: "sm" }),
    lib.radioGroupClass({ size: "lg" }),
    ...["segmentedControlClass", "numberFieldClass", "fabClass"].map((name) => lib[name]({ size: "lg" })),
    lib.choiceGroupClass({ size: "sm" }),
    lib.choiceGroupClass({ size: "lg" }),
    ...["xs", "xl", "icon-xs", "icon-xl"].map((size) => lib.buttonClass({ size })),
    ...lib.avatarSizes.map((s) => lib.avatarClass({ size: s })),
  ];
  for (const cls of emitted.flatMap((s) => s.split(" ")).filter((c) => /--(xs|sm|lg|xl|2xl|icon-xs|icon-xl)$/.test(c))) {
    assert.ok(defined(cls), `.${cls} is returned by a helper but the CSS doesn't define it`);
  }
});

test("React components pass size through to the markup", { skip }, async () => {
  const ui = await import(dist("react.js"));
  const html = (el) => renderToStaticMarkup(el);
  assert.match(html(createElement(ui.Checkbox, { size: "lg" })), /class="ayy-checkbox ayy-checkbox--lg"/);
  assert.match(html(createElement(ui.Switch, { size: "sm" })), /class="ayy-switch ayy-switch--sm"/);
  assert.match(html(createElement(ui.Radio, { value: "a", size: "lg" })), /ayy-radio--lg/);
  assert.match(html(createElement(ui.RadioGroup, { size: "sm" })), /ayy-radio-group--sm/);
  assert.match(html(createElement(ui.Textarea, { size: "lg" })), /ayy-textarea--lg/);
  assert.match(html(createElement(ui.Badge, { size: "sm" }, "New")), /ayy-badge--sm/);
  assert.match(html(createElement(ui.Alert, { size: "lg" })), /ayy-alert--lg/);
  assert.match(html(createElement(ui.Card, { size: "sm" })), /ayy-card--sm/);
  assert.match(html(createElement(ui.Accordion, { size: "lg" })), /ayy-accordion--lg/);
  assert.match(html(createElement(ui.Tabs, { size: "sm" })), /ayy-tabs--sm/);
  assert.match(html(createElement(ui.Steps, { size: "lg", steps: ["a", "b"], current: 0 })), /ayy-steps--lg/);
  assert.match(html(createElement(ui.Pagination, { size: "sm", page: 1, count: 3 })), /ayy-pagination--sm/);
  assert.match(html(createElement(ui.SliderRange, { size: "lg", labels: ["from", "to"] })), /ayy-slider-range--lg/);
  assert.match(html(createElement(ui.Slider, { size: "sm" })), /ayy-slider--sm/);
  assert.match(html(createElement(ui.ChipRemovable, { size: "sm", onRemove() {} }, "Mira")), /ayy-chip--sm/);
  assert.match(html(createElement(ui.Kbd, { size: "lg" }, "K")), /ayy-kbd--lg/);
  assert.match(html(createElement(ui.Tree, { size: "lg", label: "Folders", nodes: [{ id: "a", label: "A" }] })), /ayy-tree--lg/);
  assert.match(html(createElement(ui.EmptyState, { size: "sm" })), /ayy-empty-state--sm/);
  assert.match(html(createElement(ui.PropertyList, { size: "lg" })), /ayy-property-list--lg/);
  assert.match(html(createElement(ui.ChoiceGroup, { size: "sm" })), /ayy-choice-group--sm/);
  assert.match(html(createElement(ui.ChoiceCard, { size: "lg", title: "Pro", type: "radio" })), /ayy-choice-card--lg/);
  assert.match(html(createElement(ui.CodeBlock, { size: "sm" })), /ayy-code-block--sm/);
  assert.match(html(createElement(ui.Popover, null, createElement(ui.PopoverContent, { size: "lg" }))), /ayy-popover--lg/);
  // Menu: the size set on DropdownMenu reaches its panel; a panel's own size wins.
  const menu = (root, panel) => html(createElement(ui.DropdownMenu, { size: root }, createElement(ui.DropdownMenuContent, { static: true, size: panel })));
  assert.match(menu("lg"), /ayy-menu ayy-menu--lg/);
  assert.match(menu("lg", "sm"), /ayy-menu--sm/);
  assert.doesNotMatch(menu(undefined), /ayy-menu--(sm|lg)/);
  // Icon-only buttons of the new sizes still get the automatic tooltip, like the older ones.
  for (const size of ["icon-xs", "icon-sm", "icon", "icon-lg", "icon-xl"]) {
    assert.match(html(createElement(ui.Button, { size, "aria-label": "Add" })), /ayy-tooltip/, `${size} gets a tooltip`);
  }
  assert.doesNotMatch(html(createElement(ui.Button, { size: "xl" }, "Go")), /ayy-tooltip/);
  // The native `size` attribute (width in characters) must not leak onto inputs that now take a visual size.
  assert.doesNotMatch(html(createElement(ui.Checkbox, { size: "lg" })), / size="/);
  assert.doesNotMatch(html(createElement(ui.Slider, { size: "lg" })), / size="/);
});
