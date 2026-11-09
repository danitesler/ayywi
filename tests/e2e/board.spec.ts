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

test("a dragged card preview starts at the pointer and follows it without animating from the corner", async ({ page }) => {
  await open(page, "board", { renderer: "react" });
  const card = example(page, "release").locator('[data-id="c-1"]');
  const error = await card.evaluate(async (item) => {
    const box = item.getBoundingClientRect();
    const x = box.left + 30;
    const y = box.top + 20;
    const fire = (type: string, px: number, py: number, target: EventTarget) => target.dispatchEvent(new PointerEvent(type, { bubbles: true, button: 0, buttons: 1, isPrimary: true, clientX: px, clientY: py }));
    fire("pointerdown", x, y, item);
    fire("pointermove", x + 12, y + 12, window);
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    const preview = document.querySelector<HTMLElement>(".ayy-drag-preview")!;
    const rect = preview.getBoundingClientRect();
    const delta = Math.hypot(rect.left - (x + 12 - 30), rect.top - (y + 12 - 20));
    fire("pointercancel", x + 12, y + 12, window);
    return delta;
  });
  expect(error).toBeLessThan(12);
});

test("column handles reorder columns using the keyboard", async ({ page }) => {
  await open(page, "board", { renderer: "react" });
  const ex = example(page, "release");
  await keyboardFocus(ex.getByRole("button", { name: "Move To do column" }));
  await page.keyboard.press("ArrowRight");
  await expect(ex.getByRole("heading", { level: 3 })).toHaveText(["In progress", "To do", "Done"]);
});

test("column handles reorder columns by pointer", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await open(page, "board", { renderer: "react" });
  const ex = example(page, "release");
  const from = (await ex.getByRole("button", { name: "Move To do column" }).boundingBox())!;
  const to = (await ex.locator(".ayy-board__column").nth(1).boundingBox())!;
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(to.x + to.width - 15, to.y + 20, { steps: 12 });
  await page.mouse.up();
  await expect(ex.getByRole("heading", { level: 3 })).toHaveText(["In progress", "To do", "Done"]);
});

test("dragged cards keep their card shape and drop targets avoid an extra ring", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await open(page, "board", { renderer: "react" });
  const ex = example(page, "release");
  const card = ex.locator('[data-id="c-1"]');
  const target = ex.locator('.ayy-board__cards[data-id="doing"]');
  const padding = await target.evaluate((el) => { const css = getComputedStyle(el); return [css.paddingBlockStart, css.paddingBlockEnd, css.paddingInlineStart, css.paddingInlineEnd]; });
  expect(new Set(padding).size).toBe(1);
  const original = await card.evaluate((el) => { const style = getComputedStyle(el); return { radius: style.borderRadius, padding: style.padding }; });
  const from = (await card.boundingBox())!;
  const to = (await target.boundingBox())!;
  await page.mouse.move(from.x + 30, from.y + 20);
  await page.mouse.down();
  await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 8 });
  const preview = page.locator('.ayy-drag-preview.ayy-board__card');
  await expect(preview).toBeVisible();
  const appearance = await preview.evaluate((el) => { const style = getComputedStyle(el); return { radius: style.borderRadius, padding: style.padding }; });
  expect(appearance).toEqual(original);
  await expect(target).toHaveAttribute("data-drop", "over");
  expect(await target.evaluate((el) => { const css = getComputedStyle(el); return [css.paddingBlockStart, css.paddingBlockEnd, css.paddingInlineStart, css.paddingInlineEnd]; })).toEqual(padding);
  expect(await target.evaluate((el) => getComputedStyle(el).boxShadow)).toBe("none");
  await page.mouse.up();
});

test("card actions appear on hover and focus and can duplicate or delete a card", async ({ page }) => {
  await open(page, "board", { renderer: "react" });
  const ex = example(page, "release");
  const card = ex.locator('[data-id="c-1"]');
  const actions = card.locator(".ayy-hover-actions");
  await expect(actions).toHaveCSS("opacity", "0");
  await card.hover();
  await expect(actions).toHaveCSS("opacity", "1");
  await card.getByRole("button", { name: "Duplicate" }).hover();
  await expect(page.getByRole("tooltip", { name: "Duplicate", exact: true })).toBeVisible();
  await card.getByRole("button", { name: "Duplicate" }).click();
  expect(await counts(ex)).toEqual(["4", "1", "0"]);
  await keyboardFocus(card.getByRole("button", { name: "Delete" }));
  await expect(actions).toHaveCSS("opacity", "1");
  await page.keyboard.press("Enter");
  await expect(card).toHaveCount(0);
  expect(await counts(ex)).toEqual(["3", "1", "0"]);
});

test("card actions do not start a card drag", async ({ page }) => {
  await open(page, "board", { renderer: "react" });
  const card = example(page, "release").locator('[data-id="c-1"]');
  await card.hover();
  const button = card.getByRole("button", { name: "Duplicate" });
  const box = (await button.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 20, box.y + box.height / 2 + 20, { steps: 4 });
  await expect(page.locator(".ayy-drag-preview")).toHaveCount(0);
  await page.mouse.up();
});

test.describe("on touch devices", () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
  test("card actions are visible without hovering", async ({ page }) => {
    await open(page, "board", { renderer: "react" });
    const card = example(page, "release").locator('[data-id="c-1"]');
    await expect(card.locator(".ayy-hover-actions")).toHaveCSS("opacity", "1");
    await card.getByRole("button", { name: "Duplicate" }).tap();
    await expect(example(page, "release").locator(".ayy-board__count").first()).toHaveText("4");
  });
});
