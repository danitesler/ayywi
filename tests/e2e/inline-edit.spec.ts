import { expect, test } from "@playwright/test";
import { example, open } from "./helpers";

declare global {
  interface Window {
    __editorLog: unknown[][];
  }
}

for (const renderer of ["react", "html"] as const) {
  test.describe(`inline edit (${renderer})`, () => {
    test("title: click edits, Enter commits, Esc cancels, blur commits and Tab moves on", async ({ page }) => {
      await open(page, "inline-edit", { renderer });
      const ex = example(page, "title");
      const display = ex.getByRole("button", { name: "Rename the project" });
      const input = ex.getByRole("textbox", { name: "Rename the project" });
      await expect(display).toHaveText("Q4 launch");
      await expect(input).toBeHidden();

      await display.click();
      await expect(input).toBeVisible();
      await expect(input).toBeFocused();
      await expect(input).toHaveValue("Q4 launch");
      await input.fill("Q1 launch");
      await input.press("Enter");
      await expect(display).toHaveText("Q1 launch");
      await expect(display).toBeFocused();

      await display.press("Enter");
      await input.fill("Throw this away");
      await input.press("Escape");
      await expect(display).toHaveText("Q1 launch");
      await expect(display).toBeFocused();

      await display.press("Enter");
      await input.fill("Q2 launch");
      await page.keyboard.press("Tab");
      await expect(display).toHaveText("Q2 launch");
      await expect(display).not.toBeFocused();
    });

    test("multiline grows, Enter adds a line and Mod+Enter commits", async ({ page }) => {
      await open(page, "inline-edit", { renderer });
      const ex = example(page, "description");
      const display = ex.getByRole("button", { name: "Edit the description" });
      const input = ex.getByRole("textbox", { name: "Edit the description" });
      await display.click();
      const height = async () => (await input.boundingBox())!.height;
      const before = await height();
      await input.evaluate((el) => {
        const field = el as HTMLTextAreaElement;
        field.setSelectionRange(field.value.length, field.value.length);
      });
      await input.press("Enter");
      await input.pressSequentially("A second line");
      await expect.poll(height).toBeGreaterThan(before);
      await expect(input).toHaveValue(/A second line$/);
      await input.press(process.platform === "darwin" ? "Meta+Enter" : "Control+Enter");
      await expect(display).toContainText("A second line");
    });

    test("Enter during IME composition does not commit", async ({ page }) => {
      await open(page, "inline-edit", { renderer });
      const ex = example(page, "title");
      const display = ex.getByRole("button", { name: "Rename the project" });
      await display.click();
      const input = ex.getByRole("textbox", { name: "Rename the project" });
      await input.fill("日本");
      await input.evaluate((el) => {
        el.dispatchEvent(new CompositionEvent("compositionstart", { bubbles: true }));
        el.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, isComposing: true } as KeyboardEventInit));
      });
      await expect(input).toBeVisible();
      await expect(display).toBeHidden();
    });

    test("a long title wraps at phone width", async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 800 });
      await open(page, "inline-edit", { renderer });
      const ex = example(page, "title");
      await ex.getByRole("button", { name: "Rename the project" }).click();
      const input = ex.getByRole("textbox", { name: "Rename the project" });
      await input.fill("Averyveryveryverylongunbrokenprojectnamewithoutspaces");
      await input.press("Enter");
      const text = ex.locator(".ayy-inline-edit__text");
      expect(await text.evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
    });
  });
}

test("RTL aligns the display text from the right", async ({ page }) => {
  await open(page, "inline-edit", { renderer: "react" });
  const ex = example(page, "title");
  const display = ex.getByRole("button", { name: "Rename the project" });
  const text = display.locator(".ayy-inline-edit__text");
  const left = async () => (await text.boundingBox())!.x;
  const right = async () => {
    const b = (await text.boundingBox())!;
    return b.x + b.width;
  };
  const displayBox = async () => (await display.boundingBox())!;
  const ltr = await displayBox();
  expect(await left() - ltr.x).toBeLessThan(ltr.x + ltr.width - (await right()));
  await ex.evaluate((el) => el.setAttribute("dir", "rtl"));
  const rtlBox = await displayBox();
  expect(await left() - rtlBox.x).toBeGreaterThan(rtlBox.x + rtlBox.width - (await right()));
});

test("element: ayy-edit and ayy-change payloads, startEditing, commit and cancel", async ({ page }) => {
  await open(page, "inline-edit", { renderer: "html" });
  const ex = example(page, "title");
  const editor = ex.locator("ayy-inline-edit");
  const display = ex.getByRole("button", { name: "Rename the project" });
  const input = ex.getByRole("textbox", { name: "Rename the project" });
  await editor.evaluate((el) => {
    window.__editorLog = [];
    el.addEventListener("ayy-edit", (event) => window.__editorLog.push(["edit", (event as CustomEvent<{ editing: boolean }>).detail.editing]));
    el.addEventListener("ayy-change", (event) => window.__editorLog.push(["change", (event as CustomEvent<{ value: string }>).detail.value]));
  });

  await editor.evaluate((el) => (el as unknown as { startEditing(): void }).startEditing());
  await expect(input).toBeVisible();
  await expect(input).toBeFocused();
  await expect(input).toHaveValue("Q4 launch");
  await input.fill("Q3 launch");
  await editor.evaluate((el) => (el as unknown as { commit(): void }).commit());
  await expect(display).toHaveText("Q3 launch");
  await expect(display).toBeFocused();
  expect(await editor.evaluate(() => window.__editorLog)).toEqual([["edit", true], ["change", "Q3 launch"], ["edit", false]]);

  await editor.evaluate((el) => (el as unknown as { startEditing(): void }).startEditing());
  await expect(input).toBeFocused();
  await input.fill("Throw this away");
  await editor.evaluate((el) => (el as unknown as { cancel(): void }).cancel());
  await expect(display).toHaveText("Q3 launch");
  await expect(display).toBeFocused();
  expect(await editor.evaluate(() => window.__editorLog)).toEqual([
    ["edit", true],
    ["change", "Q3 launch"],
    ["edit", false],
    ["edit", true],
    ["edit", false],
  ]);
});
