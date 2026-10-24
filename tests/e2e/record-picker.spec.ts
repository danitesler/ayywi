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

    test("keyboard create: the active create row is visible, Enter creates", async ({ page }) => {
      await open(page, "record-picker", { renderer });
      const ex = example(page, "labels");
      const input = ex.getByRole("combobox", { name: "Labels" });
      await input.click();
      await input.pressSequentially("Maya");
      const create = ex.getByRole("option", { name: "Create “Maya”" });
      await expect(create).toBeVisible();
      await expect(create).toHaveAttribute("data-active", "true");
      expect(await create.evaluate((el) => getComputedStyle(el).backgroundColor)).not.toBe("rgba(0, 0, 0, 0)");
      await input.press("Enter");
      await expect(ex.locator(".ayy-record-picker__tag")).toHaveText(["Maya"]);
    });

    test("the field keeps its md height token at every density", async ({ page }) => {
      const probe = (token: string) =>
        page.evaluate((name) => {
          const el = document.createElement("div");
          el.style.blockSize = `var(${name})`;
          el.style.inlineSize = "0";
          document.body.append(el);
          const height = el.getBoundingClientRect().height;
          el.remove();
          return height;
        }, token);
      for (const density of ["compact", "comfortable", "touch"] as const) {
        await open(page, "record-picker", { renderer, density });
        const field = example(page, "people").locator(".ayy-record-picker");
        await expect(field).toBeVisible();
        expect(Math.abs((await field.boundingBox())!.height - (await probe("--ayy-size-control-md"))), density).toBeLessThan(1);
      }
    });

    test("the clear button never makes the field taller, at any size", async ({ page }) => {
      await open(page, "record-picker", { renderer });
      const ex = example(page, "people");
      const input = ex.getByRole("combobox", { name: "Assignee" });
      await input.click();
      await input.pressSequentially("ada");
      await input.press("Enter");
      const field = ex.locator(".ayy-record-picker");
      const clear = ex.getByRole("button", { name: "Clear" });
      for (const size of ["md", "sm", "lg"] as const) {
        if (size !== "md") await field.evaluate((el, name) => el.classList.add(`ayy-tag-input--${name}`), size);
        const clearHeight = (await clear.boundingBox())!.height;
        const inputHeight = (await input.boundingBox())!.height;
        expect(clearHeight, size).toBeLessThanOrEqual(inputHeight + 0.5);
        if (size !== "md") await field.evaluate((el, name) => el.classList.remove(`ayy-tag-input--${name}`), size);
      }
    });

    test("a long unbroken record keeps its remove button inside the chip", async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 800 });
      await open(page, "record-picker", { renderer });
      const ex = example(page, "labels");
      const input = ex.getByRole("combobox", { name: "Labels" });
      await input.click();
      await input.pressSequentially("Averyveryverylongunbrokenrecordlabelwithoutspaces");
      await input.press("Enter");
      const chip = ex.locator(".ayy-record-picker__tag").first();
      const remove = chip.locator(".ayy-chip__remove");
      const chipBox = (await chip.boundingBox())!;
      const removeBox = (await remove.boundingBox())!;
      expect(removeBox.x).toBeGreaterThanOrEqual(chipBox.x - 0.5);
      expect(removeBox.x + removeBox.width).toBeLessThanOrEqual(chipBox.x + chipBox.width + 0.5);
      await remove.click();
      await expect(ex.locator(".ayy-record-picker__tag")).toHaveCount(0);
    });

    test("clicking a chip's body puts focus back in the input", async ({ page }) => {
      await open(page, "record-picker", { renderer });
      const ex = example(page, "people");
      const input = ex.getByRole("combobox", { name: "Assignee" });
      await input.click();
      await input.pressSequentially("ada");
      await input.press("Enter");
      await ex.locator(".ayy-record-picker__tag-label").click();
      await expect(input).toBeFocused();
    });

    test("a disabled option can't be picked", async ({ page }) => {
      await open(page, "record-picker", { renderer });
      const ex = example(page, "people");
      const input = ex.getByRole("combobox", { name: "Assignee" });
      await ex.locator('.ayy-record-picker__option[data-value="ada"]').evaluate((el) => el.setAttribute("aria-disabled", "true"));
      await input.click();
      await input.pressSequentially("ada");
      const list = ex.getByRole("listbox", { name: "Assignee" });
      await expect(list.getByRole("option", { name: /Ada Lovelace/ })).toHaveAttribute("aria-disabled", "true");
      await input.press("Enter");
      await expect(ex.locator(".ayy-record-picker__tag")).toHaveCount(0);
    });
  });
}

test.describe("record picker element", () => {
  test("refresh re-reads replaced options and keeps the picked row selected", async ({ page }) => {
    await open(page, "record-picker", { renderer: "html" });
    const ex = example(page, "people");
    const input = ex.getByRole("combobox", { name: "Assignee" });
    await input.click();
    await input.pressSequentially("ada");
    await input.press("Enter");
    await ex.locator("ayy-record-picker").evaluate((el) => {
      el.querySelector(".ayy-record-picker__listbox")!.innerHTML = `
        <li role="option" class="ayy-combobox__option ayy-record-picker__option" data-value="ada" data-label="Ada Lovelace" data-active="false" aria-selected="false">Ada Lovelace</li>
        <li role="option" class="ayy-combobox__option ayy-record-picker__option" data-value="grace" data-label="Grace Hopper" data-active="false" aria-selected="false">Grace Hopper</li>`;
      (el as unknown as { refresh(): void }).refresh();
    });
    await expect(ex.locator('.ayy-record-picker__option[data-value="ada"]')).toHaveAttribute("aria-selected", "true");
    await expect(ex.locator('.ayy-record-picker__option[data-value="grace"]')).toHaveAttribute("aria-selected", "false");
    await expect(ex.locator(".ayy-record-picker__tag")).toHaveText(["Ada Lovelace"]);
  });

  test("a disabled input keeps its chip, disables its buttons and fires no change", async ({ page }) => {
    await open(page, "record-picker", { renderer: "html" });
    const ex = example(page, "labels");
    const input = ex.getByRole("combobox", { name: "Labels" });
    await input.click();
    await input.pressSequentially("des");
    await input.press("Enter");
    await expect(ex.locator(".ayy-record-picker__tag")).toHaveText(["Design"]);
    await ex.locator("ayy-record-picker").evaluate((el) => {
      (window as unknown as { __changes?: unknown[] }).__changes = [];
      el.addEventListener("ayy-change", (event) => (window as unknown as { __changes?: unknown[] }).__changes!.push((event as CustomEvent).detail));
      (el.querySelector("input.ayy-record-picker__input") as HTMLInputElement).disabled = true;
      (el as unknown as { refresh(): void }).refresh();
    });
    const remove = ex.locator(".ayy-record-picker__tag .ayy-chip__remove");
    await expect(remove).toBeDisabled();
    await expect(ex.getByRole("button", { name: "Clear" })).toBeDisabled();
    await remove.evaluate((el) => (el as HTMLButtonElement).click());
    await remove.evaluate((el) => {
      const button = el as HTMLButtonElement;
      button.disabled = false;
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await expect(ex.locator(".ayy-record-picker__tag")).toHaveText(["Design"]);
    expect(await page.evaluate(() => (window as unknown as { __changes?: unknown[] }).__changes)).toEqual([]);
  });

  test("ayy-change carries ids and options; a chip's × removes one", async ({ page }) => {
    await open(page, "record-picker", { renderer: "html" });
    const ex = example(page, "labels");
    const input = ex.getByRole("combobox", { name: "Labels" });
    await input.click();
    await input.pressSequentially("des");
    await input.press("Enter");
    await input.pressSequentially("eng");
    await input.press("Enter");
    await ex.locator("ayy-record-picker").evaluate((el) => {
      (window as unknown as { __changes?: unknown[] }).__changes = [];
      el.addEventListener("ayy-change", (event) => (window as unknown as { __changes?: unknown[] }).__changes!.push((event as CustomEvent).detail));
    });
    await expect(ex.locator('input[type="hidden"][name="labels"]')).toHaveCount(2);
    await ex.locator(".ayy-record-picker__tag").first().getByRole("button").click();
    await expect(ex.locator(".ayy-record-picker__tag")).toHaveText(["Engineering"]);
    expect(await page.evaluate(() => (window as unknown as { __changes?: unknown[] }).__changes)).toEqual([
      { ids: ["engineering"], options: [{ id: "engineering", label: "Engineering" }] },
    ]);
    await expect(ex.locator('input[type="hidden"][name="labels"]')).toHaveCount(1);
    await expect(ex.locator('input[type="hidden"][name="labels"]')).toHaveValue("engineering");
  });
});
