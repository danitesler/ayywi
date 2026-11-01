import { expect, test, type Locator } from "@playwright/test";
import { example, keyboardFocus, open } from "./helpers";
const texts = (ex: Locator) => ex.locator(".ayy-checklist__item .ayy-checklist__text").evaluateAll((els) => els.map((e) => (e as HTMLInputElement).value));

test("Enter adds after, Backspace on empty removes, IME Enter does nothing", async ({ page }) => {
  await open(page, "checklist", { renderer: "react" });
  const ex = example(page, "packing");
  const charger = ex.locator('[data-id="charger"] .ayy-checklist__text');
  await keyboardFocus(charger);
  await charger.dispatchEvent("keydown", { key: "Enter", isComposing: true });
  expect(await texts(ex)).toEqual(["Passport", "Charger", "Rain jacket", "Travel adapter"]);
  await charger.press("Enter");
  await page.keyboard.type("Headphones");
  expect(await texts(ex)).toEqual(["Passport", "Charger", "Headphones", "Rain jacket", "Travel adapter"]);
  await expect(ex.locator(".ayy-checklist__count")).toHaveText("2 of 5 done");
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.press("Backspace");
  await page.keyboard.press("Backspace");
  expect(await texts(ex)).toEqual(["Passport", "Charger", "Rain jacket", "Travel adapter"]);
  await expect(charger).toBeFocused();
  expect(await charger.evaluate((el: HTMLInputElement) => el.selectionStart)).toBe(7);
});

test("the new-item field appends; ticking updates count and progress; Alt+ArrowUp moves", async ({ page }) => {
  await open(page, "checklist", { renderer: "react" });
  const ex = example(page, "packing");
  const add = ex.getByRole("textbox", { name: "Add an item" });
  await add.fill("Snacks"); await add.press("Enter");
  await expect(add).toHaveValue(""); await expect(add).toBeFocused();
  expect((await texts(ex)).at(-1)).toBe("Snacks");
  await ex.getByRole("checkbox", { name: "Rain jacket" }).check();
  await expect(ex.locator(".ayy-checklist__count")).toHaveText("3 of 5 done");
  await expect(ex.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "60");
  const jacket = ex.locator('[data-id="jacket"] .ayy-checklist__text');
  expect(await jacket.evaluate((el) => getComputedStyle(el).textDecorationLine)).toContain("line-through");
  await jacket.press("Alt+ArrowUp");
  expect((await texts(ex)).slice(0, 3)).toEqual(["Passport", "Rain jacket", "Charger"]);
  await expect(jacket).toBeFocused();
});

test("a long item fits a phone", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await open(page, "checklist", { renderer: "react" });
  const ex = example(page, "packing");
  const add = ex.getByRole("textbox", { name: "Add an item" });
  await add.fill("Universal travel adapter with two USB-C ports and a spare fuse for the hotel in Lisbon");
  await add.press("Enter");
  expect(await ex.locator(".ayy-checklist").evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
});
