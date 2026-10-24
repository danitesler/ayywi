import { expect, test } from "@playwright/test";
import { example, open } from "./helpers";

for (const renderer of ["react", "html"] as const) {
  test.describe(`property list (${renderer})`, () => {
    test("rows are a definition list with one term and one value", async ({ page }) => {
      await open(page, "property-list", { renderer });
      await expect(example(page, "record").locator("dl.ayy-property-list")).toHaveCount(1);
      const rows = example(page, "record").locator(".ayy-property-list__row");
      await expect(rows).toHaveCount(6);
      for (const row of await rows.all()) {
        await expect(row.locator("dt")).toHaveCount(1);
        await expect(row.locator("dd")).toHaveCount(1);
      }
    });

    test("empty values read Not set and compact rows are tighter", async ({ page }) => {
      await open(page, "property-list", { renderer });
      const empty = example(page, "compact").getByText("Not set").first();
      await expect(empty).toBeVisible();
      await expect(example(page, "compact").locator(".ayy-property-list__empty").filter({ hasText: "Unassigned" })).toHaveText("Unassigned");
      const color = await empty.evaluate((el) => getComputedStyle(el).color);
      const muted = await example(page, "compact").locator(".ayy-property-list__label").first().evaluate((el) => getComputedStyle(el).color);
      expect(color).toBe(muted);
      const padding = (id: string) => example(page, id).locator(".ayy-property-list__row").first().evaluate((el) => parseFloat(getComputedStyle(el).paddingBlockStart));
      expect(await padding("compact")).toBeLessThan(await padding("record"));
    });

    test("a long value wraps at phone width", async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 800 });
      await open(page, "property-list", { renderer });
      const row = example(page, "record").locator(".ayy-property-list__row").filter({ hasText: "Averyveryvery" });
      const value = row.locator(".ayy-property-list__value");
      await expect(value).toBeVisible();
      expect(await value.evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
      const term = await row.locator(".ayy-property-list__term").boundingBox();
      const box = await value.boundingBox();
      expect(box!.y).toBeGreaterThanOrEqual(term!.y + term!.height - 1);
    });

    test("an editable value uses InlineEdit and commits in place", async ({ page }) => {
      await open(page, "property-list", { renderer });
      const display = example(page, "record").getByRole("button", { name: "Change the version" });
      await expect(display).toHaveText("1.4.0");
      await display.click();
      const input = example(page, "record").getByRole("textbox", { name: "Change the version" });
      await input.fill("1.4.1");
      await input.press("Enter");
      await expect(display).toHaveText("1.4.1");
    });
  });
}
