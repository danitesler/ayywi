import { expect, test } from "@playwright/test";
import { example, open } from "./helpers";

for (const renderer of ["react", "html"] as const) {
  test(`${renderer}: icon-only trigger and subtoolbar preserve tooltips, selection and keyboard navigation`, async ({ page }) => {
    await open(page, "toolbar", { renderer });
    const demo = example(page, "rail");
    const trigger = demo.getByRole("button", { name: "Shape options", exact: true });
    await expect(trigger.locator("svg")).toHaveCount(1);
    await expect(trigger).toHaveText("");
    await trigger.hover();
    await expect(demo.getByRole("tooltip", { name: "Shape options", exact: true })).toBeVisible();
    await trigger.focus();
    await page.keyboard.press("Enter");
    const bar = demo.getByRole("toolbar", { name: "Shapes", exact: true });
    await expect(bar).toBeVisible();
    const rectangleBox = await bar.getByRole("button", { name: "Rectangle", exact: true }).boundingBox();
    const ellipseBox = await bar.getByRole("button", { name: "Ellipse", exact: true }).boundingBox();
    expect(Math.abs(rectangleBox!.y - ellipseBox!.y)).toBeLessThan(1);
    await page.keyboard.press("Tab");
    await expect(bar.getByRole("button", { name: "Rectangle", exact: true })).toBeFocused();
    await page.keyboard.press("ArrowRight");
    const ellipse = bar.getByRole("button", { name: "Ellipse", exact: true });
    await expect(ellipse).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(ellipse).toHaveAttribute("aria-pressed", "true");
    await expect(bar.getByRole("button", { name: "Rectangle", exact: true })).toHaveAttribute("aria-pressed", "false");
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
    await expect(bar).toBeHidden();
  });

  test(`${renderer}: toolbar dropdown opens hoverable submenus and supports keyboard selection`, async ({ page }) => {
    await open(page, "toolbar", { renderer });
    const demo = example(page, "editor");
    await demo.getByRole("button", { name: "Insert", exact: true }).click();
    await demo.getByRole("menuitem", { name: "Shapes", exact: true }).hover();
    await expect(demo.getByRole("menuitem", { name: "Ellipse", exact: true })).toBeVisible();
    await demo.getByRole("menuitem", { name: "Ellipse", exact: true }).click();
    await expect(demo.locator(".ayy-menu:popover-open")).toHaveCount(0);
    await demo.getByRole("button", { name: "Insert", exact: true }).focus();
    await page.keyboard.press("ArrowDown");
    await expect(demo.getByRole("menuitem", { name: "Shapes", exact: true })).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(demo.getByRole("menuitem", { name: "Rectangle", exact: true })).toBeFocused();
    await page.keyboard.press("Escape");
    await page.keyboard.press("Escape");
    await expect(demo.getByRole("button", { name: "Insert", exact: true })).toBeFocused();
  });

  test(`${renderer}: popup subtoolbar has its own tab stop, arrows and pressed state`, async ({ page }) => {
    await open(page, "toolbar", { renderer });
    const demo = example(page, "formatting");
    const trigger = demo.getByRole("button", { name: "Text options", exact: true });
    await trigger.click();
    const bar = demo.getByRole("toolbar", { name: "Text style" });
    await expect(bar).toBeVisible();
    await expect(bar.locator('button[tabindex="0"]')).toHaveCount(1);
    await bar.getByRole("button", { name: "Normal", exact: true }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(bar.getByRole("button", { name: "Code", exact: true })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(bar.getByRole("button", { name: "Code", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(bar.getByRole("button", { name: "Normal", exact: true })).toHaveAttribute("aria-pressed", "false");
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
    await expect(bar).toBeHidden();
  });
}
