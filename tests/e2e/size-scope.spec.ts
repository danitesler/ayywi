import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { distFile } from "./helpers";

// data-size="sm" | "md" | "lg": the size controls use when they don't name one. Heights are asserted in px at each
// density (compact: control sm 28, md 32, lg 36; touch: 40, 44, 48), against both builds: the layered CSS and the
// unlayered one, where a touch device's `:root:not([data-density])` rule has to be out-ranked rather than out-layered.
const read = (p: string) => readFileSync(distFile(p), "utf8");

const CONTROLS = `
  <input class="ayy-input" aria-label="input">
  <input class="ayy-input ayy-input--lg" aria-label="large input">
  <button class="ayy-button">Save</button>
  <label class="ayy-chip"><input type="checkbox">Open</label>
  <a class="ayy-pagination__link" href="#1">1</a>
  <input type="checkbox" class="ayy-checkbox" aria-label="check">
  <input type="checkbox" role="switch" class="ayy-switch" aria-label="switch">`;

const page = (body: string, htmlAttrs = "") => `<!doctype html><html lang="en" ${htmlAttrs}><head><meta charset="utf-8"><title>scope</title>
<link rel="stylesheet" href="/scope/ayywi.css"></head><body>${body}</body></html>`;

async function load(p: Page, build: string, body: string, htmlAttrs = "") {
  await p.route("**/scope/**", (route) => {
    const file = new URL(route.request().url()).pathname.replace("/scope/", "");
    if (file === "index.html") return route.fulfill({ contentType: "text/html", body: page(body, htmlAttrs) });
    return route.fulfill({ contentType: "text/css", body: read(build) });
  });
  await p.goto("/scope/index.html");
}

/** Heights of the seven controls inside a scope (by position), in px. */
const sizes = (p: Page, scope: string) =>
  p.evaluate((scope) => {
    const root = document.querySelector(scope)!;
    const h = (sel: string) => Math.round(root.querySelector(sel)!.getBoundingClientRect().height * 10) / 10;
    return {
      input: h("input.ayy-input:not(.ayy-input--lg)"),
      largeInput: h(".ayy-input--lg"),
      button: h(".ayy-button"),
      chip: h(".ayy-chip"),
      page: h(".ayy-pagination__link"),
      check: h(".ayy-checkbox"),
      toggle: h(".ayy-switch"),
      fieldText: getComputedStyle(root.querySelector("input.ayy-input:not(.ayy-input--lg)")!).fontSize,
    };
  }, scope);

for (const build of ["ayywi.css", "ayywi.unlayered.css"]) {
  test.describe(`size scope (${build})`, () => {
    test("sm and lg move the default step; explicit sizes keep theirs; md restores the default", async ({ page: p }) => {
      await load(
        p,
        build,
        `<div id="plain">${CONTROLS}</div>
         <div id="sm" data-size="sm">${CONTROLS}<div id="md-in-sm" data-size="md">${CONTROLS}</div></div>
         <div id="lg" data-size="lg">${CONTROLS}<div id="sm-in-lg" data-size="sm">${CONTROLS}</div></div>`,
        'data-density="compact"',
      );
      // No scope: the ladder as it always was.
      expect(await sizes(p, "#plain")).toMatchObject({ input: 32, largeInput: 36, button: 32, chip: 28, page: 28, check: 16, toggle: 20 });
      // Small: inputs, buttons and the small controls step down together; the explicit large input does not move.
      expect(await sizes(p, "#sm")).toMatchObject({ input: 28, largeInput: 36, button: 28, chip: 24, page: 24, check: 14, toggle: 16 });
      // Large: chips and pagination go to the medium step (they are one step under inputs, as at the default), not the large one.
      expect(await sizes(p, "#lg")).toMatchObject({ input: 36, largeInput: 36, button: 36, chip: 32, page: 32, check: 20, toggle: 24 });
      // Nested scopes: the nearest wins, and md puts the default back even inside a small or large one.
      expect(await sizes(p, "#md-in-sm")).toMatchObject({ input: 32, button: 32, chip: 28, page: 28, check: 16, toggle: 20 });
      expect(await sizes(p, "#sm-in-lg")).toMatchObject({ input: 28, button: 28, chip: 24, page: 24, check: 14, toggle: 16 });
    });

    test("it stacks with data-density, on an ancestor or on the same element", async ({ page: p }) => {
      await load(
        p,
        build,
        `<div data-density="touch"><div id="outer" data-size="sm">${CONTROLS}</div></div>
         <div id="same" data-density="comfortable" data-size="lg">${CONTROLS}</div>`,
        'data-density="compact"',
      );
      // Small at touch density: the touch small step (40), not the compact one.
      expect(await sizes(p, "#outer")).toMatchObject({ input: 40, button: 40, chip: 36, check: 18 });
      // Large at comfortable density, both on one element: comfortable large (44), chips at comfortable medium (40).
      expect(await sizes(p, "#same")).toMatchObject({ input: 44, button: 44, chip: 40, check: 22 });
    });

    test("a data-density on a descendant starts over (documented: put data-density outside a scope)", async ({ page: p }) => {
      await load(p, build, `<div data-size="sm"><div id="inner" data-density="touch">${CONTROLS}</div></div>`, 'data-density="compact"');
      // Touch redefines the default step on that element, so the scope above it no longer applies there.
      expect(await sizes(p, "#inner")).toMatchObject({ input: 44, button: 44 });
    });

    test("field text keeps its size on touch, so iOS doesn't zoom when a small scope is focused", async ({ page: p }) => {
      await load(p, build, `<div id="sm" data-size="sm">${CONTROLS}</div><div id="lg" data-size="lg">${CONTROLS}</div>`, 'data-density="touch"');
      expect((await sizes(p, "#sm")).fieldText).toBe("16px");
      expect((await sizes(p, "#lg")).fieldText).toBe("16px");
    });

    test("without a scope nothing about the default ladder changes at any density", async ({ page: p }) => {
      for (const [density, input, button, chip, check] of [["compact", 32, 32, 28, 16], ["comfortable", 40, 40, 32, 18], ["touch", 44, 44, 40, 20]] as const) {
        await load(p, build, `<div id="plain">${CONTROLS}</div>`, `data-density="${density}"`);
        expect(await sizes(p, "#plain"), density).toMatchObject({ input, button, chip, check });
        await p.unroute("**/scope/**");
      }
    });
  });

  // A touch device with no data-density set gets the touch ladder from `:root:not([data-density])` (0,2,0). A scope on <html>
  // must still win over it, in the unlayered build too.
  test.describe(`size scope on <html> on a touch device (${build})`, () => {
    test.use({ hasTouch: true });

    test("data-size on the root out-ranks the automatic touch density", async ({ page: p }) => {
      await load(p, build, `<div id="all">${CONTROLS}</div>`, 'data-size="sm"');
      expect(await p.evaluate(() => matchMedia("(pointer: coarse)").matches)).toBe(true);
      // Small at the (automatic) touch density: 40, not the touch default 44.
      expect(await sizes(p, "#all")).toMatchObject({ input: 40, button: 40, chip: 36, check: 18 });
    });

    test("and a scope inside still reads the automatic touch density", async ({ page: p }) => {
      await load(p, build, `<div id="lg" data-size="lg">${CONTROLS}</div>`);
      expect(await sizes(p, "#lg")).toMatchObject({ input: 48, button: 48, chip: 44, check: 24 });
    });
  });
}
