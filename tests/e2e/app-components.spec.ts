import { expect, test } from "@playwright/test";
import { example, open, rtl, stage } from "./helpers";

// The components Teyykit and Dooduu had built for themselves, and the phone basics.
for (const renderer of ["react", "html"] as const) {
  test.describe(renderer, () => {
    test("date picker: one Tab stop, arrows move the day (mirrored in RTL), Enter picks, PageDown turns the month", async ({ page }) => {
      await open(page, "date-time-picker", { renderer });
      const cal = example(page, "presets").locator(".ayy-date-picker-grid");
      const grid = cal.locator(".ayy-date-picker-grid__grid");
      await expect(grid.locator('[tabindex="0"]')).toHaveCount(1);
      await expect(cal.locator('.ayy-date-picker-grid__day[data-date="2026-10-09"]')).toHaveAttribute("aria-pressed", "true");
      await cal.locator('[data-date="2026-10-09"]').focus();
      await page.keyboard.press("ArrowRight");
      await expect(cal.locator('[data-date="2026-10-10"]')).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(cal.locator('[data-date="2026-10-10"]')).toHaveAttribute("aria-pressed", "true");
      await expect(cal.locator('[data-date="2026-10-09"]')).toHaveAttribute("aria-pressed", "false");
      await page.keyboard.press("ArrowDown");
      await expect(cal.locator('[data-date="2026-10-17"]')).toBeFocused();

      await rtl(cal);
      await page.keyboard.press("ArrowRight");
      await expect(cal.locator('[data-date="2026-10-16"]')).toBeFocused();

      const title = cal.locator(".ayy-date-picker-grid__title");
      const before = await title.textContent();
      await page.keyboard.press("PageDown");
      await expect(cal.locator('[data-date="2026-11-16"]')).toBeFocused();
      await expect(title).not.toHaveText(before!);

      // Click year to swap to 3x4 year grid, pick 2028; click month to swap to 3x4 month grid, pick March.
      const daysWidth = (await cal.boundingBox())!.width;
      await title.locator('[data-view="years"]').click();
      await expect(cal.locator(".ayy-date-picker-grid__years")).toBeVisible();
      expect((await cal.boundingBox())!.width).toBe(daysWidth);
      await cal.locator('.ayy-date-picker-grid__cell[data-year="2028"]').click();
      await expect(cal.locator(".ayy-date-picker-grid__grid")).toBeVisible();
      await expect(title).toContainText("2028");

      await title.locator('[data-view="months"]').click();
      await expect(cal.locator(".ayy-date-picker-grid__months")).toBeVisible();
      expect((await cal.boundingBox())!.width).toBe(daysWidth);
      await cal.locator('.ayy-date-picker-grid__cell[data-month="2028-03-01"]').click();
      await expect(cal.locator('.ayy-date-picker-grid__day[data-date="2028-03-01"]')).toBeVisible();
      expect((await cal.boundingBox())!.width).toBe(daysWidth);
    });

    test("date picker opens a month in a popover, a pick fills the field and closes it", async ({ page }) => {
      await open(page, "date-time-picker", { renderer });
      const field = example(page, "basic");
      const trigger = field.getByRole("button", { name: "Check-in" });
      await expect(field.locator(".ayy-date-picker__value")).toHaveText("");
      await trigger.click();
      const popover = page.locator(".ayy-popover:popover-open");
      await expect(popover).toBeVisible();
      await expect(popover.locator(".ayy-date-picker-grid__day:focus")).toHaveCount(1);
      // A month after today is all after min.
      await page.keyboard.press("PageDown");
      await page.keyboard.press("Enter");
      await expect(popover).toHaveCount(0);
      await expect(field.locator(".ayy-popover .ayy-date-picker-grid")).toHaveCount(1);
      await expect(field.locator(".ayy-date-picker__value")).not.toHaveText("");
      await expect(trigger).toBeFocused();
    });

    test("toolbar: one Tab stop, arrows move, an exclusive group keeps one tool pressed", async ({ page }) => {
      await open(page, "toolbar", { renderer });
      const bar = stage(page).getByRole("toolbar", { name: "Annotate" });
      await expect(bar.locator('[tabindex="0"]')).toHaveCount(1);
      const arrow = bar.getByRole("button", { name: "Arrow" });
      const rectangle = bar.getByRole("button", { name: "Rectangle" });
      await expect(arrow).toHaveAttribute("aria-pressed", "true");
      await arrow.focus();
      await page.keyboard.press("ArrowRight");
      await expect(rectangle).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(rectangle).toHaveAttribute("aria-pressed", "true");
      await expect(arrow).toHaveAttribute("aria-pressed", "false");
      await page.keyboard.press("End");
      await expect(bar.getByRole("button", { name: "Copy" })).toBeFocused();
    });

    test("swatches are radios: a click picks one colour", async ({ page }) => {
      await open(page, "swatch", { renderer });
      const group = stage(page).getByRole("radiogroup");
      await expect(group.getByRole("radio", { name: "Green" })).toBeChecked();
      await group.locator(".ayy-swatch", { has: page.getByRole("radio", { name: "Violet" }) }).click();
      await expect(group.getByRole("radio", { name: "Violet" })).toBeChecked();
      await expect(group.getByRole("radio", { name: "Green" })).not.toBeChecked();
    });

    test("shortcut recorder: records keys, Esc cancels, Backspace clears", async ({ page }) => {
      await open(page, "shortcut", { renderer });
      const recorder = stage(page).getByRole("button", { name: /^Record screen/ });
      await expect(recorder).toHaveAttribute("aria-label", "Record screen: not set");
      await recorder.click();
      await expect(recorder).toHaveAttribute("aria-pressed", "true");
      await page.keyboard.press("Control+Shift+KeyR");
      await expect(recorder).toHaveAttribute("aria-pressed", "false");
      await expect(recorder).toHaveAttribute("aria-label", "Record screen: Ctrl Shift R");
      await expect(recorder.locator("kbd")).toHaveText(["Ctrl", "Shift", "R"]);
      await recorder.click();
      await page.keyboard.press("Escape");
      await expect(recorder).toHaveAttribute("aria-label", "Record screen: Ctrl Shift R");
      await recorder.click();
      await page.keyboard.press("Backspace");
      await expect(recorder).toHaveAttribute("aria-label", "Record screen: not set");
    });

    test("command palette: filters as you type, Enter runs, the dialog opens on Ctrl+K and Esc clears then closes", async ({ page }) => {
      await open(page, "command", { renderer });
      const inline = stage(page);
      const input = inline.getByRole("combobox", { name: "Search commands" });
      await input.fill("pref");
      const shown = inline.locator(".ayy-command__item:not([hidden])");
      await expect(shown).toHaveCount(1);
      await expect(shown).toHaveText(/Settings/);
      await expect(shown).toHaveAttribute("aria-selected", "true");
      await expect(input).toHaveAttribute("aria-activedescendant", (await shown.getAttribute("id"))!);
      await input.fill("zzz");
      await expect(inline.locator(".ayy-command__empty")).toBeVisible();

      await page.keyboard.press("Control+k");
      const dialog = page.getByRole("dialog", { name: "Search commands" });
      await expect(dialog).toBeVisible();
      const search = dialog.getByRole("combobox");
      await expect(search).toBeFocused();
      await search.pressSequentially("inb");
      await page.keyboard.press("Escape");
      await expect(search).toHaveValue("");
      await expect(dialog).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
      await stage(page, 1).getByRole("button", { name: /Search/ }).click();
      await expect(dialog).toBeVisible();
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");
      await expect(dialog).toBeHidden();
    });

    test("tag input: Enter and commas add tags, Backspace and × remove them, suggestions add with Enter", async ({ page }) => {
      await open(page, "tag-input", { renderer });
      const field = stage(page);
      const input = field.getByRole("combobox", { name: "Tags" });
      const tags = () => field.locator(".ayy-tag-input__tag").evaluateAll((els) => els.map((el) => (el as HTMLElement).dataset.value));
      await input.click();
      await input.pressSequentially("travel");
      await page.keyboard.press("Enter");
      await input.pressSequentially("home, Design,");
      expect(await tags()).toEqual(["design", "q4", "travel", "home"]);
      await expect(field.getByRole("status")).toHaveText("home added");
      await page.keyboard.press("Backspace");
      expect(await tags()).toEqual(["design", "q4", "travel"]);
      await field.getByRole("button", { name: "Remove q4" }).click();
      expect(await tags()).toEqual(["design", "travel"]);
      await expect(input).toBeFocused();
      await input.pressSequentially("wri");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");
      expect(await tags()).toEqual(["design", "travel", "writing"]);
      await expect(input).toHaveValue("");
      await expect(field.locator('input[type="hidden"][name="tags"]')).toHaveCount(3);
    });

    test("search bar: the clear button shows with text and empties the field", async ({ page }) => {
      await open(page, "search-bar", { renderer });
      const bars = stage(page).getByRole("search");
      const empty = bars.nth(0);
      const full = bars.nth(1);
      await expect(empty.getByRole("button", { name: "Clear search" })).toBeHidden();
      await full.getByRole("button", { name: "Clear search" }).click();
      await expect(full.getByRole("searchbox")).toHaveValue("");
      await expect(full.getByRole("searchbox")).toBeFocused();
      await expect(full.getByRole("button", { name: "Clear search" })).toBeHidden();
      await empty.getByRole("searchbox").fill("milk");
      await expect(empty.getByRole("button", { name: "Clear search" })).toBeVisible();
    });

    test("swipe actions: a drag opens a tray and a tap closes it, mirrored in RTL; Tab shows a tray", async ({ page }) => {
      await open(page, "swipe", { renderer });
      const row = stage(page).locator(".ayy-swipe").first();
      const content = row.locator(".ayy-swipe__content");
      const drag = async (dx: number) => {
        const box = (await content.boundingBox())!;
        const y = box.y + box.height / 2;
        const x = box.x + box.width / 2;
        await page.mouse.move(x, y);
        await page.mouse.down();
        for (let i = 1; i <= 8; i++) await page.mouse.move(x + (dx * i) / 8, y);
        await page.mouse.up();
      };
      await drag(-160);
      await expect(row).toHaveAttribute("data-open", "end");
      const tray = row.locator(".ayy-swipe__actions--end");
      expect((await content.boundingBox())!.x + (await content.boundingBox())!.width).toBeLessThanOrEqual((await tray.boundingBox())!.x + 1);
      // A tap on the part of the row still showing closes it.
      const rowBox = (await row.boundingBox())!;
      await page.mouse.click(rowBox.x + 20, rowBox.y + rowBox.height / 2);
      await expect(row).not.toHaveAttribute("data-open");
      await drag(-20);
      await expect(row).not.toHaveAttribute("data-open");

      await rtl(stage(page));
      await drag(-120);
      await expect(row).toHaveAttribute("data-open", "start");
      await page.mouse.click(5, 5);
      await expect(row).not.toHaveAttribute("data-open");

      const done = row.getByRole("button", { name: "Done" });
      await done.focus();
      await expect(done).toBeInViewport();
      expect(await row.locator(".ayy-swipe__actions--start").evaluate((el) => getComputedStyle(el).zIndex)).toBe("2");
    });

    test("progress ring: a progressbar whose fill follows the value", async ({ page }) => {
      await open(page, "progress-ring", { renderer });
      const ring = stage(page).getByRole("progressbar", { name: /Habit/ });
      await expect(ring).toHaveAttribute("aria-valuenow", "60");
      const dash = await ring.locator(".ayy-progress-ring__bar").evaluate((el) => getComputedStyle(el).strokeDasharray);
      expect(dash.replace(/px|calc\(|\)/g, "")).toMatch(/^60,? 100$/);
    });

    test("swatch: custom swatch opens ColorPicker popover, updates input and color dot, closes on Escape", async ({ page }) => {
      await open(page, "swatch", { renderer });
      const pen = example(page, "pen");
      const customInput = pen.locator(".ayy-swatch--custom > input[type='color']");
      const customSwatch = pen.locator(".ayy-swatch--custom");

      await expect(customInput).toHaveValue("#7c5cff");
      await expect(customSwatch).toHaveCSS("--ayy-swatch", "#7c5cff");

      await customSwatch.click();
      const popover = page.locator(".ayy-swatch-popover:popover-open");
      await expect(popover).toBeVisible();
      await expect(customSwatch).toHaveAttribute("aria-expanded", "true");

      const picker = popover.locator(".ayy-color-picker");
      await expect(picker).toBeVisible();
      const hexInput = picker.locator(".ayy-color-picker__inputs input");
      await expect(hexInput).toHaveValue("#7c5cff");

      await hexInput.fill("#ff0055");
      await hexInput.dispatchEvent("input");
      await expect(customInput).toHaveValue("#ff0055");
      await expect(customSwatch).toHaveCSS("--ayy-swatch", "#ff0055");

      await page.keyboard.press("Escape");
      await expect(popover).toHaveCount(0);
      await expect(customSwatch).not.toHaveAttribute("aria-expanded");
      await expect(customInput).toBeFocused();

      // Clicking the swatch while open closes it, and clicking again re-opens
      await customSwatch.click();
      await expect(popover).toBeVisible();
      await customSwatch.click();
      await expect(popover).toHaveCount(0);
      await expect(customSwatch).not.toHaveAttribute("aria-expanded");
      await customSwatch.click();
      await expect(popover).toBeVisible();
      await page.keyboard.press("Escape");
    });
  });
}

test("FAB sits above the bottom nav on phones and in the shell's corner on wide screens", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await open(page, "fab");
  const shell = stage(page, 1);
  const fab = shell.getByRole("button", { name: "New task" });
  const nav = shell.locator(".ayy-bottom-nav");
  // The page above the example still settles after it opens and moves both, so two separate reads can straddle the
  // shift: measure both in the same frame.
  const gap = () =>
    fab.evaluate((el) => {
      const n = el.closest(".ayy-app-shell")!.querySelector(".ayy-bottom-nav")!.getBoundingClientRect();
      return n.top - el.getBoundingClientRect().bottom;
    });
  await expect.poll(gap).toBeGreaterThanOrEqual(0);
  const fabBox = (await fab.boundingBox())!;
  const navBox = (await nav.boundingBox())!;
  expect(navBox.x + navBox.width - (fabBox.x + fabBox.width)).toBeLessThan(40);

  await rtl(shell);
  const mirrored = (await fab.boundingBox())!;
  expect(mirrored.x - navBox.x).toBeLessThan(40);

  await page.setViewportSize({ width: 1280, height: 800 });
  await shell.evaluate((el) => el.removeAttribute("dir"));
  await expect(nav).toBeHidden();
  const main = (await shell.locator(".ayy-app-shell__main").boundingBox())!;
  const wide = (await fab.boundingBox())!;
  expect(main.y + main.height - (wide.y + wide.height)).toBeLessThan(40);
  expect(main.x + main.width - (wide.x + wide.width)).toBeLessThan(40);
});

test("top bar: the back chevron points back in both directions, the title is the page's h1", async ({ page }) => {
  await open(page, "top-bar");
  const bar = stage(page).locator(".ayy-top-bar");
  await expect(bar.getByRole("heading", { level: 1, name: "Groceries" })).toBeVisible();
  const back = bar.getByRole("link", { name: "Back" });
  const title = bar.locator(".ayy-top-bar__heading");
  expect((await back.boundingBox())!.x).toBeLessThan((await title.boundingBox())!.x);
  const flip = () => back.locator("svg").evaluate((el) => getComputedStyle(el).scale.split(" ")[0]);
  expect(await flip()).toBe("1");
  await rtl(stage(page));
  expect((await back.boundingBox())!.x).toBeGreaterThan((await title.boundingBox())!.x);
  expect(await flip()).toBe("-1");
});

test("app shell sizes: Small and Medium rows are denser than Big, and the docs' Small sidebar doesn't leak into examples", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await open(page, "app-shell");
  const demo = example(page, "playground");
  const link = demo.locator(".ayy-app-shell").first().getByRole("link", { name: "Spacing" });
  const height = () => link.evaluate((el) => (el as HTMLElement).offsetHeight);
  const radius = () => link.evaluate((el) => getComputedStyle(el).borderTopLeftRadius);
  const big = await height();
  const bigRadius = await radius();
  const ex = page.locator('.pv-example[aria-labelledby="ex-playground"]');
  const propsBtn = ex.getByRole("button", { name: "Props" });
  if (await propsBtn.isVisible()) {
    await propsBtn.hover();
    await expect(page.getByRole("tooltip", { name: "Props" })).toBeVisible();
    await page.mouse.move(0, 0);
  }
  const setSize = async (size: "sm" | "md" | "lg") => {
    if (await propsBtn.isVisible()) {
      const popover = ex.locator(".pv-props-popover");
      if (!(await popover.isVisible())) await propsBtn.click();
      await popover.locator("#pg-size").selectOption(size);
    } else {
      await demo.locator("#pg-size").selectOption(size);
    }
  };
  await setSize("md");
  await expect.poll(height).toBeLessThan(big);
  const med = await height();
  await setSize("sm");
  await expect.poll(height).toBeLessThan(med);
  expect(await radius()).not.toBe(bigRadius);
  // The docs page's own shell is Small; flipping back proves the example keeps its own size.
  await expect(page.locator(".pv-shell")).toHaveClass(/ayy-app-shell--sm/);
  await setSize("lg");
  await expect.poll(height).toBe(big);
});
