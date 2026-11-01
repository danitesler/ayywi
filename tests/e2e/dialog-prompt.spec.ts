import { expect, test, type Page } from "@playwright/test";
import { open } from "./helpers";

type W = { ayywi: Record<string, (o: object) => Promise<unknown>>; __p: Promise<unknown> };
const call = (page: Page, fn: string, options: object) =>
  page.evaluate(([fn, options]) => { const w = window as unknown as W; w.__p = w.ayywi[fn](options); }, [fn, options] as const);
const result = (page: Page) => page.evaluate(() => (window as unknown as W).__p);

test("confirmDialog resolves true on confirm, false on Esc, and gives focus back", async ({ page }) => {
  await open(page, "dialog");
  await page.evaluate(() => { const b = document.createElement("button"); b.id = "opener"; b.textContent = "Opener"; document.body.append(b); b.focus(); });
  await call(page, "confirmDialog", { title: "Delete Marketing site?", description: "This can't be undone.", confirmLabel: "Delete", destructive: true });
  const dialog = page.getByRole("dialog", { name: "Delete Marketing site?" });
  await expect(dialog).toHaveAccessibleDescription("This can't be undone.");
  const del = dialog.getByRole("button", { name: "Delete" });
  await expect(del).toBeFocused();
  await expect(del).toHaveClass(/ayy-button--destructive/);
  await del.click();
  expect(await result(page)).toBe(true);
  await expect(page.locator("dialog[data-ayy-prompt]")).toHaveCount(0);
  await expect(page.locator("#opener")).toBeFocused();

  await call(page, "confirmDialog", { title: "Leave without saving?" });
  await expect(page.getByRole("dialog", { name: "Leave without saving?" }).getByRole("button", { name: "OK" })).toBeFocused();
  await page.keyboard.press("Escape");
  expect(await result(page)).toBe(false);
});

test("choiceDialog focuses the last choice, resolves a value, and null on a backdrop click", async ({ page }) => {
  await open(page, "dialog");
  const choices = [{ value: "discard", label: "Discard", variant: "destructive" }, { value: "save", label: "Save" }];
  await call(page, "choiceDialog", { title: "Save changes to Q4 plan?", choices });
  const dialog = page.getByRole("dialog", { name: "Save changes to Q4 plan?" });
  await expect(dialog.getByRole("button", { name: "Save" })).toBeFocused();
  await expect(dialog.getByRole("button", { name: "Save" })).toHaveClass("ayy-button");
  await dialog.getByRole("button", { name: "Discard" }).click();
  expect(await result(page)).toBe("discard");
  await call(page, "choiceDialog", { title: "Save changes to Q4 plan?", choices });
  await page.mouse.click(5, 5);
  expect(await result(page)).toBeNull();
});

test("promptDialog selects the value, validates, ignores IME Enter, and resolves trimmed text", async ({ page }) => {
  await open(page, "dialog");
  await page.evaluate(() => {
    const w = window as unknown as W & { ayywi: { promptDialog: (o: object) => Promise<unknown> } };
    w.__p = w.ayywi.promptDialog({ title: "Rename folder", label: "Name", value: "Q4 launch", validate: (v: string) => (v.length > 20 ? "Keep it under 20 characters" : null) });
  });
  const dialog = page.getByRole("dialog", { name: "Rename folder" });
  const input = dialog.getByRole("textbox", { name: "Name" });
  await expect(input).toBeFocused();
  expect(await input.evaluate((el: HTMLInputElement) => [el.selectionStart, el.selectionEnd])).toEqual([0, 9]);
  await input.fill("");
  await expect(dialog.getByRole("button", { name: "Save" })).toBeDisabled();
  await input.fill("A folder name that is far too long");
  await dialog.getByRole("button", { name: "Save" }).click();
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await expect(dialog.locator(".ayy-field__error")).toHaveText("Keep it under 20 characters");
  await expect(input).toHaveAccessibleDescription("Keep it under 20 characters");
  await input.fill("  Q4 plan  ");
  await expect(input).not.toHaveAttribute("aria-invalid", "true");
  await input.dispatchEvent("keydown", { key: "Enter", isComposing: true });
  await expect(dialog).toBeVisible();
  await input.press("Enter");
  expect(await result(page)).toBe("Q4 plan");
});

test("a second prompt cancels the first; secret prompts hide what is typed", async ({ page }) => {
  await open(page, "dialog");
  await page.evaluate(() => {
    const w = window as unknown as W & { __first: Promise<unknown> };
    w.__first = w.ayywi.confirmDialog({ title: "First" });
    w.__p = w.ayywi.promptDialog({ title: "Unlock vault", label: "Password", secret: true });
  });
  expect(await page.evaluate(() => (window as unknown as { __first: Promise<unknown> }).__first)).toBe(false);
  await expect(page.locator("dialog[data-ayy-prompt]")).toHaveCount(1);
  await expect(page.getByRole("dialog", { name: "Unlock vault" }).locator("input")).toHaveAttribute("type", "password");
  await page.keyboard.press("Escape");
  expect(await result(page)).toBeNull();
});
