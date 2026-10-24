import { expect, test } from "@playwright/test";
import { example, open } from "./helpers";

for (const renderer of ["react", "html"] as const) {
  test.describe(`record picker (${renderer})`, () => {
    test("single pick: type, filter, Enter, clear", async ({ page }) => {
      await open(page, "record-picker", { renderer });
      const ex = example(page, "people");
      const input = ex.getByRole("combobox", { name: "Assignee" });
      await input.click();
      await input.pressSequentially("gra");
      const list = ex.getByRole("listbox", { name: "Assignee" });
      await expect(list.getByRole("option")).toHaveCount(1);
      await expect(list.getByRole("option", { name: /Grace Hopper/ })).toBeVisible();
      await input.press("Enter");
      await expect(ex.locator(".ayy-record-picker__tag")).toHaveText(["Grace Hopper"]);
      await expect(input).toHaveValue("");
      await expect(list).toBeHidden();
      await ex.getByRole("button", { name: "Clear" }).click();
      await expect(ex.locator(".ayy-record-picker__tag")).toHaveCount(0);
      await expect(input).toBeFocused();
    });

    test("multiple picks: chips in order, toggle off, Backspace, hidden inputs", async ({ page }) => {
      await open(page, "record-picker", { renderer });
      const ex = example(page, "labels");
      const input = ex.getByRole("combobox", { name: "Labels" });
      const chips = ex.locator(".ayy-record-picker__tag");
      await input.click();
      await input.pressSequentially("des");
      await input.press("Enter");
      await input.pressSequentially("eng");
      await input.press("Enter");
      await expect(chips).toHaveText(["Design", "Engineering"]);
      const list = ex.getByRole("listbox", { name: "Labels" });
      await expect(list).toBeVisible();
      await list.getByRole("option", { name: "Design" }).click();
      await expect(chips).toHaveText(["Engineering"]);
      await page.keyboard.press("Backspace");
      await expect(chips).toHaveCount(0);
      await expect(ex.locator('input[type="hidden"][name="labels"]')).toHaveCount(0);
    });

    test("create: choose the create row, then the new record is selected", async ({ page }) => {
      await open(page, "record-picker", { renderer });
      const ex = example(page, "labels");
      const input = ex.getByRole("combobox", { name: "Labels" });
      await input.click();
      await input.pressSequentially("Maya");
      const create = ex.getByRole("option", { name: "Create “Maya”" });
      await expect(create).toBeVisible();
      if (renderer === "html") {
        await page.evaluate(() => {
          (window as unknown as { __created: unknown[] }).__created = [];
          document.addEventListener("ayy-create", (event) => (window as unknown as { __created: unknown[] }).__created.push((event as CustomEvent).detail));
        });
      }
      await create.click();
      await expect(ex.locator(".ayy-record-picker__tag")).toHaveText(["Maya"]);
      if (renderer === "html") {
        expect(await page.evaluate(() => (window as unknown as { __created: unknown[] }).__created)).toEqual([{ id: "maya", label: "Maya" }]);
      }
    });

    test("keyboard: arrows move the active option, Escape closes and clears the query", async ({ page }) => {
      await open(page, "record-picker", { renderer });
      const ex = example(page, "labels");
      const input = ex.getByRole("combobox", { name: "Labels" });
      await input.click();
      await input.pressSequentially("e");
      const list = ex.getByRole("listbox", { name: "Labels" });
      const active = list.locator('[role="option"][data-active="true"]');
      await expect(active).toHaveCount(1);
      const first = await active.textContent();
      await input.press("ArrowDown");
      expect(await active.textContent()).not.toBe(first);
      await input.press("Escape");
      await expect(list).toBeHidden();
      await expect(input).toHaveValue("");
      await expect(input).toBeFocused();
    });

    test("an IME Enter does not select", async ({ page }) => {
      await open(page, "record-picker", { renderer });
      const ex = example(page, "people");
      const input = ex.getByRole("combobox", { name: "Assignee" });
      await input.click();
      await input.pressSequentially("ada");
      await input.evaluate((el) => {
        el.dispatchEvent(new CompositionEvent("compositionstart", { bubbles: true }));
        el.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, isComposing: true } as KeyboardEventInit));
      });
      await expect(ex.locator(".ayy-record-picker__tag")).toHaveCount(0);
    });

    test("a long name stays inside the field at phone width", async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 800 });
      await open(page, "record-picker", { renderer });
      const ex = example(page, "people");
      const input = ex.getByRole("combobox", { name: "Assignee" });
      await input.click();
      await input.pressSequentially("Alexandria");
      await input.press("Enter");
      const field = ex.locator(".ayy-record-picker");
      expect(await field.evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
    });
  });
}
