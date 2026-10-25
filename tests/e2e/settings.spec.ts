import { expect, test, type Page } from "@playwright/test";
import { example, open, rtl } from "./helpers";

// The Settings pattern: the App shell in settings mode, in a near-full-screen dialog (the playground's settings demo).
const SETTINGS = "playground";

async function openSettings(page: Page) {
  await example(page, SETTINGS).getByRole("button", { name: "Settings", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Settings" });
  await expect(dialog).toBeVisible();
  // It scales in as it opens: measure once it's settled.
  await expect.poll(() => dialog.evaluate((el) => getComputedStyle(el).transform)).toBe("none");
  return dialog;
}

for (const renderer of ["react", "html"] as const) {
  test.describe(renderer, () => {
    test("settings dialog: a select opens ayywi's list inside the modal, and choosing works", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await open(page, "app-shell", { renderer });
      const dialog = await openSettings(page);
      const theme = dialog.getByLabel("Theme");
      await theme.click();
      // Inside the dialog, or the modal would make it inert.
      const list = dialog.getByRole("listbox", { name: "Theme" });
      await expect(list).toBeVisible();
      await list.getByRole("option", { name: "Dark" }).click();
      await expect(theme).toHaveValue("dark");
      await expect(list).toBeHidden();
      await expect(dialog).toBeVisible();
    });

    test("settings dialog: near full screen, the sections beside the open one, the top bar's back is for phones", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await open(page, "app-shell", { renderer });
      const dialog = await openSettings(page);
      const shell = dialog.locator(".ayy-app-shell--settings");
      const sidebar = shell.locator(".ayy-app-shell__sidebar");
      const main = shell.locator(".ayy-app-shell__main");

      // 72rem wide at most, 4rem clear of the viewport; the shell fills it.
      const box = (await dialog.boundingBox())!;
      expect(Math.round(box.width)).toBe(1152);
      expect(Math.round(box.height)).toBe(736);
      const shellBox = (await shell.boundingBox())!;
      expect(Math.abs(shellBox.height - box.height)).toBeLessThan(3);

      await expect(sidebar.getByRole("heading", { level: 2, name: "Settings" })).toBeVisible();
      await expect(sidebar.getByRole("navigation", { name: "Settings" }).getByRole("link", { name: "Preferences" })).toHaveAttribute("aria-current", "page");
      await expect(main.getByRole("heading", { level: 1, name: "Preferences" })).toBeVisible();
      await expect(main.locator(".ayy-top-bar__back")).toBeHidden();
      // The page keeps its one <main>.
      await expect(dialog.locator("main")).toHaveCount(0);

      // The section reads in a centred column, and the top bar's title lines up with it.
      const mainBox = (await main.boundingBox())!;
      const group = (await main.locator(".ayy-settings").first().boundingBox())!;
      expect(group.x - mainBox.x).toBeGreaterThan(48);
      expect(Math.abs(group.x - mainBox.x - (mainBox.x + mainBox.width - (group.x + group.width)))).toBeLessThan(2);
      const textStart = (selector: string) =>
        main.locator(selector).first().evaluate((el) => {
          const range = document.createRange();
          range.selectNodeContents(el);
          return range.getBoundingClientRect().x;
        });
      expect(Math.abs((await textStart(".ayy-top-bar__title")) - (await textStart(".ayy-settings__title")))).toBeLessThan(1);

      // The close button stays clickable over the sticky top bar.
      await dialog.getByRole("button", { name: "Close" }).click();
      await expect(dialog).toBeHidden();
    });

    test("settings dialog on phones: full screen, the section list and a section are two screens", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 800 });
      await open(page, "app-shell", { renderer });
      const dialog = await openSettings(page);
      const shell = dialog.locator(".ayy-app-shell--settings");
      const sidebar = shell.locator(".ayy-app-shell__sidebar");
      const main = shell.locator(".ayy-app-shell__main");

      const box = (await dialog.boundingBox())!;
      expect(Math.round(box.width)).toBe(390);
      expect(Math.round(box.height)).toBe(800);

      // A section is current: it fills the screen, and its top bar leads back to the list.
      await expect(sidebar).toBeHidden();
      await expect(main).toBeVisible();
      await expect(main.getByRole("link", { name: "Settings" })).toBeVisible();
      expect(Math.round((await main.boundingBox())!.width)).toBe(390);

      // None is: the list is the screen, each section a row with a chevron.
      await sidebar.locator("[aria-current]").evaluate((el) => el.removeAttribute("aria-current"));
      await expect(main).toBeHidden();
      await expect(sidebar).toBeVisible();
      await expect(sidebar.getByRole("heading", { level: 2, name: "Settings" })).toBeVisible();
      const row = sidebar.getByRole("link", { name: "Members" });
      const chevron = () => row.evaluate((el) => getComputedStyle(el, "::after").transform);
      expect(await chevron()).not.toBe("none");
      const ltr = await chevron();
      await rtl(example(page, SETTINGS));
      expect(await chevron()).not.toBe(ltr);
    });

    test("settings dialog: Esc closes it and focus goes back to the Settings button", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await open(page, "app-shell", { renderer });
      const dialog = await openSettings(page);
      await dialog.getByRole("switch", { name: "Open at login" }).focus();
      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
      await expect(example(page, SETTINGS).getByRole("button", { name: "Settings", exact: true })).toBeFocused();
    });
  });
}

test("a top bar first in an app shell's main stays at the very top, edge to edge, and scrolls nothing under it at rest", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 600 });
  await open(page, "app-shell");
  const dialog = await openSettings(page);
  const main = dialog.locator(".ayy-app-shell__main");
  const bar = (await main.locator(".ayy-top-bar").boundingBox())!;
  const box = (await main.boundingBox())!;
  const first = (await main.locator(".ayy-settings").first().boundingBox())!;
  expect(Math.round(bar.y)).toBe(Math.round(box.y));
  expect(Math.round(bar.width)).toBe(Math.round(box.width));
  expect(first.y).toBeGreaterThanOrEqual(bar.y + bar.height);

  // Scrolled: it stays put at the top.
  await main.evaluate((el) => el.scrollBy(0, 200));
  expect(Math.round((await main.locator(".ayy-top-bar").boundingBox())!.y)).toBe(Math.round(box.y));
});

test("appearance settings: pickers open in popovers as lists of pictures, and picking updates the container", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await open(page, "settings", { renderer: "react" });
  const app = example(page, "appearance");
  const themeTrigger = app.getByRole("button", { name: "Theme", exact: true });
  await expect(themeTrigger.locator(".ayy-settings__preview")).toBeVisible();
  await themeTrigger.click();
  const themeGroup = app.getByRole("radiogroup", { name: "Theme" });
  await expect(themeGroup).toBeVisible();
  const themeOptions = themeGroup.locator(".ayy-settings__option");
  await expect(themeOptions).toHaveCount(5);

  const systemScreens = themeOptions.first().locator(".ayy-settings__screen");
  await expect(systemScreens).toHaveCount(2);
  await expect(systemScreens.nth(0)).toHaveAttribute("data-theme", "light");
  await expect(systemScreens.nth(1)).toHaveAttribute("data-theme", "dark");

  // Picking Light updates data-theme on the example root and closes the popover.
  await themeOptions.filter({ hasText: "Light" }).first().click();
  await expect(app.locator("[data-theme='light']").first()).toBeVisible();
  await expect(themeGroup).toBeHidden();

  // Density opens in a popover with an inline preview on its trigger and updates data-density.
  const densityTrigger = app.getByRole("button", { name: "Density", exact: true });
  await expect(densityTrigger.locator(".ayy-settings__preview")).toBeVisible();
  await densityTrigger.click();
  const densityGroup = app.getByRole("radiogroup", { name: "Density" });
  await expect(densityGroup).toBeVisible();
  await densityGroup.locator(".ayy-settings__option", { hasText: "Comfortable" }).click();
  await expect(app.locator("[data-density='comfortable']").first()).toBeVisible();
  await expect(densityGroup).toBeHidden();

  // Density options draw rows; the pickers in popovers are lists, one option per row.
  await densityTrigger.click();
  await expect(densityGroup.locator(".ayy-settings__screen--rows").first()).toBeVisible();
  expect(await densityGroup.evaluate((el) => getComputedStyle(el).flexDirection)).toBe("column");
  await page.keyboard.press("Escape");

  // Text size opens in a popover of "Aa" samples.
  await app.getByRole("button", { name: "Text size", exact: true }).click();
  const sizeGroup = app.getByRole("radiogroup", { name: "Text size" });
  await sizeGroup.locator(".ayy-settings__option", { hasText: "125%" }).click();
  await expect(sizeGroup).toBeHidden();
  await expect(app.getByRole("button", { name: "Text size", exact: true })).toContainText("125%");

  // Picking Violet in the Brand colour popover sets data-brand, and its options draw the brand screen.
  await app.getByRole("button", { name: "Brand colour", exact: true }).click();
  const colourGroup = app.getByRole("radiogroup", { name: "Brand colour" });
  await expect(colourGroup.locator(".ayy-settings__screen--brand")).toHaveCount(7);
  await colourGroup.locator(".ayy-settings__option", { hasText: "Violet" }).click();
  await expect(colourGroup).toBeHidden();
  await expect(app.locator("[data-brand='settings-example']")).toBeVisible();

  // Text direction: Right to left sets dir on the example.
  await app.getByRole("button", { name: "Text direction", exact: true }).click();
  const directionGroup = app.getByRole("radiogroup", { name: "Text direction" });
  await directionGroup.locator(".ayy-settings__option", { hasText: "Right to left" }).click();
  await expect(app.locator("[data-brand='settings-example']")).toHaveAttribute("dir", "rtl");

  // Picking Sharp in the Corners popover updates corners.
  const cornersTrigger = app.getByRole("button", { name: "Corners", exact: true });
  await expect(cornersTrigger.locator(".ayy-settings__preview")).toBeVisible();
  await cornersTrigger.click();
  const cornersGroup = app.getByRole("radiogroup", { name: "Corners" });
  await expect(cornersGroup).toBeVisible();
  await cornersGroup.locator(".ayy-settings__option", { hasText: "Sharp" }).click();
  expect(await app.locator("[data-brand='settings-example']").evaluate((el) => (el as HTMLElement).style.getPropertyValue("--ayy-radius-button"))).toBe("var(--ayy-radius-sm)");
  await expect(cornersGroup).toBeHidden();

  // Reduce motion sets data-motion="reduce", and reset clears it.
  await app.getByRole("switch", { name: "Reduce motion" }).click();
  await expect(app.locator("[data-motion='reduce']")).toBeVisible();
  await app.getByRole("button", { name: /Reset appearance/ }).click();
  await expect(app.locator("[data-motion='reduce']")).toHaveCount(0);
});
