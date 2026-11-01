import { expect, test, type Locator } from "@playwright/test";
import { example, keyboardFocus, open, rtl } from "./helpers";
const counts = (ex: Locator) => ex.locator(".ayy-board__count").allTextContents();

test("columns, counts and the empty column", async ({ page }) => {
  await open(page, "board", { renderer: "react" });
  const ex = example(page, "release");
  await expect(ex.getByRole("heading", { level: 3 })).toHaveText(["To do", "In progress", "Done"]);
  expect(await counts(ex)).toEqual(["3", "1", "0"]);
  await expect(ex.locator('[data-id="done"] .ayy-board__empty')).toHaveText("Drop cards here");
});
test("Alt+ArrowRight moves a focused card to the next column", async ({ page }) => {
  await open(page, "board", { renderer: "react" });
  const ex = example(page, "release");
  const card = ex.locator('[data-id="c-2"]');
  await keyboardFocus(card);
  await page.keyboard.press("Alt+ArrowRight");
  await expect(ex.locator('[data-id="doing"] [data-id="c-2"]')).toHaveCount(1);
  expect(await counts(ex)).toEqual(["2", "2", "0"]);
});
test("scrolls sideways on a phone without scrolling the page; RTL starts on the right", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await open(page, "board", { renderer: "react" });
  const ex = example(page, "release");
  const board = ex.locator(".ayy-board");
  expect(await board.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await rtl(ex);
  const first = await ex.locator(".ayy-board__column").first().boundingBox();
  const second = await ex.locator(".ayy-board__column").nth(1).boundingBox();
  expect(first!.x).toBeGreaterThan(second!.x);
});
test("Add card appends to that column", async ({ page }) => {
  await open(page, "board", { renderer: "react" });
  const ex = example(page, "release");
  await ex.locator('section:has([data-id="done"])').getByRole("button", { name: "Add card" }).click();
  expect(await counts(ex)).toEqual(["3", "1", "1"]);
  await expect(ex.locator('[data-id="done"] .ayy-board__empty')).toHaveCount(0);
});
