import { expect, test, type Locator, type Page } from "@playwright/test";
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

test("appearance settings: Mode and Theme, selects with pictures, and picking updates the container", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await open(page, "settings", { renderer: "react" });
  const app = example(page, "appearance");
  const shownPicture = (select: Locator) => select.locator("xpath=..").locator(".ayy-select__picture:not([hidden])");

  // Only two settings in Appearance: the theme decides colour, surfaces, corners, fonts and icons.
  const appearance = app.locator(".ayy-settings").first();
  await expect(appearance.locator(".ayy-settings__row")).toHaveCount(2);
  for (const gone of ["Surface colour", "Contrast", "Density", "Text size", "Brand colour", "Corners", "Font", "Icons"]) await expect(app.getByLabel(gone, { exact: true })).toHaveCount(0);

  // Mode: the chosen option's picture shows in the select (System: a light and a dark screen), and the list shows one per option.
  const mode = app.getByLabel("Mode", { exact: true });
  await expect(shownPicture(mode).locator(".ayy-settings__screen")).toHaveCount(2);
  await mode.click();
  const modeList = page.getByRole("listbox", { name: "Mode" });
  await expect(modeList.locator(".ayy-select__picture")).toHaveCount(3);
  await modeList.getByRole("option", { name: "Light", exact: true }).click();
  await expect(modeList).toBeHidden();
  await expect(app.locator("[data-theme='light']").first()).toBeVisible();

  // Theme: one brand screen per ready-made theme; Ember brings its brand and icon pack.
  const theme = app.getByLabel("Theme", { exact: true });
  await theme.click();
  const themeList = page.getByRole("listbox", { name: "Theme" });
  await expect(themeList.locator(".ayy-settings__screen--brand")).toHaveCount(6);
  await themeList.getByRole("option", { name: "Ember", exact: true }).click();
  await expect(app.locator("[data-brand='ember']")).toBeVisible();
  await expect(app.locator("[data-brand='ember']")).toHaveAttribute("data-ayy-icons", "lucide");

  // Text direction: Right to left sets dir on the example.
  await app.getByLabel("Text direction", { exact: true }).selectOption("rtl");
  await expect(app.locator("[data-brand='ember']")).toHaveAttribute("dir", "rtl");

  // Reduce motion sets data-motion="reduce", and reset clears it and goes back to Default.
  await app.getByRole("switch", { name: "Reduce motion" }).click();
  await expect(app.locator("[data-motion='reduce']")).toBeVisible();
  await app.getByRole("button", { name: /Reset appearance/ }).click();
  await expect(app.locator("[data-motion='reduce']")).toHaveCount(0);
  await expect(app.locator("[data-brand='ember']")).toHaveCount(0);
  await expect(theme).toHaveValue("default");
});

test("appearance settings in plain HTML: pictures follow the choice", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await open(page, "settings", { renderer: "html" });
  const app = example(page, "appearance");
  const mode = app.getByLabel("Mode", { exact: true });
  await mode.click();
  await page.getByRole("listbox", { name: "Mode" }).getByRole("option", { name: "Dark", exact: true }).click();
  await expect(mode.locator("xpath=..").locator(".ayy-select__picture:not([hidden]) .ayy-settings__screen")).toHaveAttribute("data-theme", "dark");
  const theme = app.getByLabel("Theme", { exact: true });
  await theme.click();
  await page.getByRole("listbox", { name: "Theme" }).getByRole("option", { name: "Forest" }).click();
  await expect(theme).toHaveValue("forest");
  await expect(theme.locator("xpath=..").locator(".ayy-select__picture:not([hidden])")).toHaveAttribute("data-value", "forest");
});
