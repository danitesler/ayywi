import { expect, test } from "@playwright/test";
import { example, keyboardFocus, open, rtl } from "./helpers";

test("Enter and Shift+Enter step, IME Enter doesn't, Esc closes", async ({ page }) => {
  await open(page, "find-bar", { renderer: "react" });
  const bar = example(page, "document").locator(".ayy-find-bar");
  const query = bar.getByRole("textbox", { name: "Find" });
  await keyboardFocus(query);
  await query.fill("launch");
  const count = bar.locator(".ayy-find-bar__count");
  await expect(count).toHaveText("1 of 3");
  await query.press("Enter");
  await query.dispatchEvent("keydown", { key: "Enter", isComposing: true });
  await query.press("Shift+Enter");
  await query.press("Shift+Enter");
  await expect(count).toHaveText("3 of 3");
  await query.press("Escape");
  await expect(bar).toBeHidden();
});

test("fits a phone and mirrors in RTL", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await open(page, "find-bar", { renderer: "react" });
  const stageEl = example(page, "document");
  const bar = stageEl.locator(".ayy-find-bar");
  expect(await bar.evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
  expect((await bar.getByRole("textbox", { name: "Replace with" }).boundingBox())!.width).toBeGreaterThan(150);
  await rtl(stageEl);
  const close = await bar.getByRole("button", { name: "Close" }).boundingBox();
  const query = await bar.getByRole("textbox", { name: "Find" }).boundingBox();
  expect(close!.x).toBeLessThan(query!.x);
});

test("no results, match case and replace all", async ({ page }) => {
  await open(page, "find-bar", { renderer: "react" });
  const ex = example(page, "document");
  const bar = ex.locator(".ayy-find-bar");
  const query = bar.getByRole("textbox", { name: "Find" });
  await query.fill("zzz");
  await expect(bar.locator(".ayy-find-bar__count")).toHaveText("No results");
  await expect(query).toHaveAttribute("aria-invalid", "true");
  await expect(bar.getByRole("button", { name: "Next match" })).toBeDisabled();
  await query.fill("Launch");
  await bar.getByRole("button", { name: "Match case" }).click();
  await expect(bar.getByRole("button", { name: "Match case" })).toHaveAttribute("aria-pressed", "true");
  await expect(bar.locator(".ayy-find-bar__count")).toHaveText("1 of 1");
  await bar.getByRole("button", { name: "Match case" }).click();
  await bar.getByRole("textbox", { name: "Replace with" }).fill("rollout");
  await bar.getByRole("button", { name: "Replace all" }).click();
  await expect(bar.locator(".ayy-find-bar__count")).toHaveText("No results");
  await expect(ex).toContainText("Before the rollout, freeze the release branch.");
});
