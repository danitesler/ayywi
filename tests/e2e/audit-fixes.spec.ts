import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

// Regressions from the 2026-10-28 component audit, on a plain HTML page with only the two dist files
// (the framework-free helpers and the custom elements). Run `pnpm build` first.
const read = (p: string) => readFileSync(new URL(`../../dist/${p}`, import.meta.url), "utf8");

async function load(page: Page, body: string) {
  await page.route("**/smoke/**", (r) => {
    const file = new URL(r.request().url()).pathname.replace("/smoke/", "");
    if (file === "index.html") {
      return r.fulfill({
        contentType: "text/html",
        body: `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>t</title>
<link rel="stylesheet" href="/smoke/ayywi.min.css"><script src="/smoke/elements.global.js" defer></script></head><body>${body}</body></html>`,
      });
    }
    return r.fulfill({ contentType: file.endsWith(".css") ? "text/css" : "text/javascript", body: read(file) });
  });
  await page.goto("/smoke/index.html");
}

const formEntries = (page: Page, selector = "form") =>
  page.evaluate((s) => Array.from(new FormData(document.querySelector<HTMLFormElement>(s)!).entries()), selector);

test("block editor: a value set from code keeps its edits when the element moves", async ({ page }) => {
  await load(page, `<div id="a"></div><div id="b"></div>`);
  await page.evaluate(() => {
    const el = document.createElement("ayy-block-editor") as HTMLElement & { value: unknown };
    el.id = "editor";
    el.setAttribute("label", "Notes");
    el.innerHTML = `<div class="ayy-block-editor"></div>`;
    el.value = [{ id: "one", type: "text", html: "Initial" }];
    document.getElementById("a")!.append(el);
  });
  const text = page.locator("#editor .ayy-block-editor__text").first();
  await expect(text).toHaveText("Initial");
  await text.click();
  await page.keyboard.press("End");
  await page.keyboard.type(" and more");
  await expect(text).toHaveText("Initial and more");

  await page.evaluate(() => document.getElementById("b")!.append(document.getElementById("editor")!));
  await expect(page.locator("#editor .ayy-block-editor__text").first()).toHaveText("Initial and more");
  const html = await page.evaluate(() => (document.getElementById("editor") as unknown as { value: { html: string }[] }).value[0]!.html);
  expect(html).toBe("Initial and more");
});

test("menu: arrow keys move inside an open submenu instead of closing it", async ({ page }) => {
  await load(
    page,
    `<ayy-menu>
  <button type="button" class="ayy-button" id="open">Open</button>
  <div class="ayy-menu" role="menu" popover="auto" aria-label="Main">
    <button type="button" role="menuitem" class="ayy-menu__item">Before</button>
    <button type="button" role="menuitem" class="ayy-menu__item ayy-menu__item--sub" aria-haspopup="menu" aria-controls="child">Child<span class="ayy-menu__chevron" aria-hidden="true"></span></button>
    <div id="child" role="menu" popover="auto" class="ayy-menu ayy-menu--sub" aria-label="Child">
      <button type="button" role="menuitem" class="ayy-menu__item">One</button>
      <button type="button" role="menuitem" class="ayy-menu__item">Two</button>
      <button type="button" role="menuitem" class="ayy-menu__item">Three</button>
    </div>
    <button type="button" role="menuitem" class="ayy-menu__item">After</button>
  </div>
</ayy-menu>`,
  );
  await page.getByRole("button", { name: "Open" }).click();
  const child = page.locator("#child");
  await page.getByRole("menuitem", { name: "Child" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(child).toBeVisible();
  await expect(page.getByRole("menuitem", { name: "One" })).toBeFocused();

  for (const [key, focused] of [["ArrowDown", "Two"], ["End", "Three"], ["ArrowUp", "Two"], ["Home", "One"]] as const) {
    await page.keyboard.press(key);
    await expect(child).toBeVisible();
    await expect(page.getByRole("menuitem", { name: focused })).toBeFocused();
  }
});

test("search bar: the clear button leaves a disabled or read-only field alone", async ({ page }) => {
  const bar = (id: string, attr: string) => `<form class="ayy-search-bar" role="search"><div class="ayy-search-bar__field">
    <input id="${id}" type="search" class="ayy-search-bar__input" placeholder="Search" value="kept" ${attr}>
    <button type="button" class="ayy-search-bar__clear" aria-label="Clear ${id}"><svg class="ayy-icon" viewBox="0 0 24 24"></svg></button></div></form>`;
  await load(page, bar("locked", "disabled") + bar("readonly", "readonly") + bar("open", ""));
  await page.evaluate(() => {
    (window as unknown as { inputs: number }).inputs = 0;
    document.addEventListener("input", () => (window as unknown as { inputs: number }).inputs++);
  });
  await page.getByRole("button", { name: "Clear locked" }).dispatchEvent("click");
  await page.getByRole("button", { name: "Clear readonly" }).click();
  await expect(page.locator("#locked")).toHaveValue("kept");
  await expect(page.locator("#readonly")).toHaveValue("kept");
  expect(await page.evaluate(() => (window as unknown as { inputs: number }).inputs)).toBe(0);

  await page.getByRole("button", { name: "Clear open" }).click();
  await expect(page.locator("#open")).toHaveValue("");
});

test("select: a hidden optgroup's options stay out of the list", async ({ page }) => {
  await load(
    page,
    `<div class="ayy-select"><select class="ayy-select__control" aria-label="Region">
      <option value="eu">Europe</option>
      <optgroup label="Secret" hidden><option value="hidden">Hidden choice</option></optgroup>
      <optgroup label="Shown"><option value="us">Americas</option></optgroup>
    </select></div>`,
  );
  await page.getByLabel("Region").click();
  const list = page.getByRole("listbox", { name: "Region" });
  await expect(list.getByRole("option", { name: "Americas" })).toBeVisible();
  await expect(list.getByRole("option", { name: "Hidden choice" })).toHaveCount(0);
  await expect(list).not.toContainText("Secret");
});

test("toast: the copy button says Copied only after the clipboard accepted the text", async ({ page }) => {
  await load(page, ``);
  await page.evaluate(() => {
    const w = window as unknown as { settle: ((ok: boolean) => void) | null };
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: () => new Promise<void>((resolve, reject) => (w.settle = (ok) => (ok ? resolve() : reject(new Error("denied"))))) },
    });
    (window as unknown as { ayywi: { toast: { long: (m: string) => void } } }).ayywi.toast.long("Build log");
  });
  const copy = page.locator(".ayy-toast__copy");
  // Read once, not with a retrying expect: the Copied state resets itself after 1.5 s, which would let a wrong one pass.
  const label = () => copy.getAttribute("aria-label");
  const tick = () => page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 50)));
  expect(await label()).toBe("Copy");
  await copy.click();
  // Still waiting on the clipboard.
  expect(await label()).toBe("Copy");
  await page.evaluate(() => (window as unknown as { settle: (ok: boolean) => void }).settle(false));
  await tick();
  expect(await label()).toBe("Copy");

  await copy.click();
  await page.evaluate(() => (window as unknown as { settle: (ok: boolean) => void }).settle(true));
  await tick();
  expect(await label()).toBe("Copied");
});

test("date picker: Today and presets outside min / max select nothing", async ({ page }) => {
  await load(
    page,
    `<ayy-date-picker id="picker" value="2030-01-10" min="2030-01-02" max="2030-01-20" show-actions>
      <div class="ayy-date-picker-grid">
        <div class="ayy-date-picker-grid__presets" role="group" aria-label="Presets">
          <button type="button" class="ayy-date-picker-grid__preset" data-date="2030-01-01">Too early</button>
          <button type="button" class="ayy-date-picker-grid__preset" data-date="2030-01-15">In range</button>
        </div>
      </div>
    </ayy-date-picker>`,
  );
  const picks: string[] = [];
  await page.exposeFunction("recordPick", (v: string) => picks.push(v));
  await page.evaluate(() => document.getElementById("picker")!.addEventListener("ayy-select", (e) => (window as any).recordPick((e as CustomEvent).detail.value)));
  // Today is real time, so whatever it is, it is outside 2030-01-02..20.
  await page.getByRole("button", { name: "Today" }).click();
  // Playwright treats aria-disabled as not clickable; a real click still lands.
  await page.getByRole("button", { name: "Too early" }).click({ force: true });
  await expect(page.getByRole("button", { name: "Too early" })).toHaveAttribute("aria-disabled", "true");
  expect(picks).toEqual([]);
  expect(await page.evaluate(() => (document.getElementById("picker") as HTMLElement & { value: string }).value)).toBe("2030-01-10");

  await page.getByRole("button", { name: "In range" }).click();
  await expect.poll(() => picks).toEqual(["2030-01-15"]);
});

test("composite fields: hidden inputs of a disabled control stay out of the form", async ({ page }) => {
  await load(
    page,
    `<form>
      <ayy-pin-input name="pin"><div role="group" class="ayy-pin-input">
        ${[1, 2, 3, 4].map((i) => `<input class="ayy-pin-input__slot" aria-label="Digit ${i}" value="${i}" disabled>`).join("")}
      </div></ayy-pin-input>
      <ayy-tag-input name="tags"><div class="ayy-tag-input">
        <span class="ayy-chip ayy-chip--removable ayy-tag-input__tag" data-value="secret">secret</span>
        <input type="text" class="ayy-tag-input__input" aria-label="Tags" disabled>
      </div></ayy-tag-input>
      <ayy-pin-input name="open-pin"><div role="group" class="ayy-pin-input">
        ${[1, 2].map((i) => `<input class="ayy-pin-input__slot" aria-label="Open ${i}" value="${i}">`).join("")}
      </div></ayy-pin-input>
    </form>`,
  );
  expect(await formEntries(page)).toEqual([["open-pin", "12"]]);
});
