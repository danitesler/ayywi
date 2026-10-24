import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { example, open, rtl } from "./helpers";

for (const renderer of ["react", "html"] as const) {
  test.describe(`table columns (${renderer})`, () => {
    test("column menus freeze, wrap, choose icons and insert editable columns", async ({ page }) => {
      await open(page, "table", { renderer });
      const demo = example(page, "playground");
      const table = demo.getByRole("table", { name: "Accounts" });
      const plan = table.locator('thead th[data-key="plan"]');
      await plan.getByRole("button", { name: "Column options for Plan" }).click();
      await demo.getByRole("menuitemcheckbox", { name: "Freeze", exact: true }).click();
      await expect(plan).toHaveClass(/ayy-table__pin/);
      const offsets = await table.locator('thead .ayy-table__pin').evaluateAll((cells) => cells.map((c) => parseFloat(getComputedStyle(c).insetInlineStart)));
      expect(offsets.length).toBeGreaterThan(1);
      expect(offsets[1]).toBeGreaterThan(0);
      await demo.getByRole("menuitemcheckbox", { name: "Wrap content", exact: true }).click();
      await expect(table.locator('tbody tr:not(.ayy-table__detail) td[data-key="plan"]').first()).toHaveClass(/ayy-table__wrap/);
      await expect(table.getByRole("textbox", { name: "Plan for Brightside Health" })).toHaveJSProperty("tagName", "TEXTAREA");
      await demo.getByRole("menuitem", { name: "Add icon", exact: true }).click();
      await page.keyboard.press("ArrowRight");
      await expect(demo.getByRole("menuitem", { name: "Star", exact: true })).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(plan.locator('.ayy-table__column-icon svg')).toHaveCount(1);
      await plan.getByRole("button", { name: "Column options for Plan" }).click();
      await demo.getByRole("menuitem", { name: "Insert right", exact: true }).click();
      const inserted = table.locator('thead th[data-key^="column-"]');
      await expect(inserted).toHaveCount(1);
      expect(await inserted.evaluate((el) => el.previousElementSibling?.getAttribute("data-key"))).toBe("plan");
      await table.getByRole("textbox", { name: /Column 1 for Brightside Health/ }).fill("New value");
      await page.keyboard.press("Enter");
      await expect(table.getByRole("textbox", { name: /Column 1 for Brightside Health/ })).toHaveValue("New value");
      await inserted.getByRole("button", { name: "Column options for Column 1", exact: true }).click();
      await inserted.getByRole("menuitemcheckbox", { name: "Freeze", exact: true }).click();
      await expect(inserted).toHaveClass(/ayy-table__pin/);
      await page.keyboard.press("Escape");
      const add = demo.getByRole("button", { name: "Add column", exact: true });
      const order = await table.locator("thead th").evaluateAll((cells) => cells.map((c) => c.getAttribute("data-key")));
      await add.focus();
      await page.keyboard.press("Alt+ArrowLeft");
      expect(await table.locator("thead th").evaluateAll((cells) => cells.map((c) => c.getAttribute("data-key")))).toEqual(order);
      await add.click();
      await expect(table.locator('thead th[data-key^="column-"]')).toHaveCount(2);
      await table.getByRole("button", { name: "Column options for Account" }).click();
      await table.locator('thead th[data-key="name"]').getByRole("menuitem", { name: "Insert left", exact: true }).click();
      await expect(table.locator('thead th[data-key="column-3"]')).toHaveCount(1);
      expect(await table.locator('thead th[data-key="name"]').evaluate((el) => el.previousElementSibling?.getAttribute("data-key"))).toBe("column-3");
      await expect(demo.locator('.ayy-menu:popover-open')).toHaveCount(0);
      const rowCounts = await table.locator('tbody tr:not(.ayy-table__detail, .ayy-table__group)').evaluateAll((rows) => rows.map((row) => (row as HTMLTableRowElement).cells.length));
      const headerCount = await table.locator("thead th").count();
      expect(rowCounts.every((count) => count === headerCount)).toBe(true);
    });

    test("status badges stay inside their pills with column wrapping on or off", async ({ page }, testInfo) => {
      await open(page, "table", { renderer });
      const table = example(page, "playground").getByRole("table", { name: "Accounts" });
      const badge = table.locator('tbody td[data-key="status"] .ayy-badge').first();
      const fullHeight = await badge.evaluate((el) => el.getBoundingClientRect().height);
      await table.getByRole("separator", { name: "Resize Status" }).focus();
      await page.keyboard.press("Home");
      await page.keyboard.press("ArrowRight");
      await expect(badge).toHaveCSS("text-overflow", "ellipsis");
      await expect(badge).toHaveCSS("overflow-x", "hidden");
      await badge.locator("..").screenshot({ path: testInfo.outputPath("status-nowrap.png") });
      expect(await badge.evaluate((el) => el.getBoundingClientRect().height)).toBeCloseTo(fullHeight, 0);
      await table.getByRole("button", { name: "Column options for Status" }).click();
      await table.getByRole("menuitemcheckbox", { name: "Wrap content", exact: true }).click();
      await page.keyboard.press("Escape");
      await expect(badge).toHaveCSS("white-space", "nowrap");
      await expect(badge).toHaveCSS("text-overflow", "ellipsis");
      await expect(badge).toHaveCSS("overflow-x", "hidden");
      expect(await badge.evaluate((el) => el.getBoundingClientRect().height)).toBeCloseTo(fullHeight, 0);
      await badge.locator("..").screenshot({ path: testInfo.outputPath("status-wrap.png") });
      await table.getByRole("button", { name: "Column options for Status" }).click();
      await table.getByRole("menuitemcheckbox", { name: "Wrap content", exact: true }).click();
      await page.keyboard.press("Escape");
      await expect(badge).toHaveCSS("white-space", "nowrap");
      expect(await badge.evaluate((el) => el.getBoundingClientRect().height)).toBeCloseTo(fullHeight, 0);
    });

    test("column filters and groups open shared table controls", async ({ page }) => {
      await open(page, "table", { renderer });
      const demo = example(page, "playground");
      const table = demo.getByRole("table", { name: "Accounts" });
      const options = table.getByRole("button", { name: "Column options for Status" });
      await options.click();
      await demo.getByRole("menuitem", { name: "Filter", exact: true }).click();
      await expect(demo.getByRole("button", { name: "Filters", exact: true })).toHaveAttribute("aria-expanded", "true");
      await page.keyboard.press("Escape");
      await options.click();
      await demo.getByRole("menuitem", { name: "Group", exact: true }).click();
      await expect(demo.getByRole("button", { name: "Groups", exact: true })).toHaveAttribute("aria-expanded", "true");
      await demo.getByRole("menuitemradio", { name: "Status", exact: true }).click();
      await expect(table.locator('.ayy-table__group')).toHaveCount(2);
      await demo.getByRole("menuitemradio", { name: "MRR", exact: true }).click();
      await expect(table.locator('.ayy-table__group').filter({ hasText: /^36000 · 1$/ })).toHaveCount(1);
      await demo.getByRole("menuitemradio", { name: "No groups", exact: true }).click();
      await expect(table.locator('.ayy-table__group')).toHaveCount(0);
    });

    test("left and right insertion follows the visible direction in RTL", async ({ page }) => {
      await open(page, "table", { renderer });
      const demo = example(page, "playground");
      await rtl(demo);
      const table = demo.getByRole("table", { name: "Accounts" });
      const plan = table.locator('thead th[data-key="plan"]');
      await plan.getByRole("button", { name: "Column options for Plan" }).click();
      await demo.getByRole("menuitem", { name: "Insert left", exact: true }).click();
      expect(await plan.evaluate((el) => el.nextElementSibling?.getAttribute("data-key"))).toBe("column-1");
      await plan.getByRole("button", { name: "Column options for Plan" }).click();
      await demo.getByRole("menuitem", { name: "Insert right", exact: true }).click();
      expect(await plan.evaluate((el) => el.previousElementSibling?.getAttribute("data-key"))).toBe("column-2");
    });
  });
}

test("a table fills its container with no visible columns and after resizing", async ({ page }) => {
  await open(page, "table", { renderer: "react" });
  const demo = example(page, "playground");
  const table = demo.getByRole("table", { name: "Accounts" });
  await demo.getByRole("button", { name: "Columns", exact: true }).click();
  for (const label of ["Account", "Plan", "Status", "Seats", "MRR", "Renews", "Last note"]) {
    await demo.getByRole("menuitemcheckbox", { name: label, exact: true }).click();
  }
  await page.keyboard.press("Escape");
  await expect(table.locator('.ayy-table__empty')).toContainText("No columns");
  const sizes = await table.evaluate((el) => ({ table: el.getBoundingClientRect().width, wrap: el.parentElement!.clientWidth }));
  expect(sizes.table).toBeGreaterThanOrEqual(sizes.wrap - 1);
  await demo.getByRole("button", { name: "Add column", exact: true }).click();
  await expect(table.locator('thead th[data-key^="column-"]')).toHaveCount(1);
  const resize = table.getByRole("separator", { name: "Resize Column 1" });
  await resize.focus();
  await page.keyboard.press("Home");
  const resized = await table.evaluate((el) => ({ table: el.getBoundingClientRect().width, wrap: el.parentElement!.clientWidth }));
  expect(resized.table).toBeGreaterThanOrEqual(resized.wrap - 1);
  await demo.getByRole("button", { name: "Add column", exact: true }).click();
  expect(await table.locator('thead th[data-key="column-2"]').evaluate((el) => (el as HTMLElement).offsetWidth)).toBeGreaterThan(48);
});

test("a narrow column keeps its content inside and ends text in an ellipsis", async ({ page }) => {
  await open(page, "table", { renderer: "react" });
  const demo = example(page, "playground");
  const table = demo.getByRole("table", { name: "Accounts" });
  const plan = table.locator('thead th[data-key="plan"]');
  await table.getByRole("separator", { name: "Resize Plan" }).focus();
  await page.keyboard.press("Home");
  await expect(plan.locator(".ayy-table__column-label")).toHaveCSS("text-overflow", "ellipsis");
  const cells = table.locator('thead th[data-key="plan"], tbody td[data-key="plan"]');
  const sizes = await cells.evaluateAll((list) => list.map((el) => ({ client: el.clientWidth, scroll: el.scrollWidth })));
  for (const { client, scroll } of sizes) expect(scroll, "cell content stays inside its column").toBeLessThanOrEqual(client);
  await plan.getByRole("button", { name: "Column options for Plan" }).click();
  await demo.getByRole("menuitemcheckbox", { name: "Wrap content", exact: true }).click();
  await expect(table.locator('tbody td[data-key="plan"]').first()).toHaveCSS("white-space", "normal");
});

test("column menu is accessible and table stays contained at each viewport", async ({ page }) => {
  const errors = await open(page, "table", { renderer: "react", theme: "dark" });
  const demo = example(page, "playground");
  for (const width of [320, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `${width}px`).toBeLessThanOrEqual(0);
    await demo.screenshot({ path: `test-results/table-${width}.png` });
  }
  await demo.getByRole("button", { name: "Column options for Plan" }).click();
  const results = await new AxeBuilder({ page }).include('.ayy-table-container').analyze();
  expect(results.violations).toEqual([]);
  await page.screenshot({ path: 'test-results/table-menu-dark.png' });
  await page.keyboard.press("Escape");
  await expect(demo.getByRole("button", { name: "Column options for Plan" })).toBeFocused();
  expect(errors).toEqual([]);
});
