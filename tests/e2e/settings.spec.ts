import { expect, test } from "@playwright/test";
import { open, rtl, stage } from "./helpers";

// The Settings pattern: the App shell in settings mode. Fifth example on the App shell page.
const SETTINGS = 4;

for (const renderer of ["react", "html"] as const) {
  test.describe(renderer, () => {
    test("settings shell: wide screens show the sections beside the open one, the top bar's back is for phones", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await open(page, "app-shell", { renderer });
      const shell = stage(page, SETTINGS).locator(".ayy-app-shell--settings");
      const sidebar = shell.locator(".ayy-app-shell__sidebar");
      const main = shell.locator(".ayy-app-shell__main");

      await expect(sidebar.getByRole("link", { name: "Back to Northwind" })).toBeVisible();
      await expect(sidebar.getByRole("heading", { level: 2, name: "Settings" })).toBeVisible();
      await expect(sidebar.getByRole("navigation", { name: "Settings" }).getByRole("link", { name: "Preferences" })).toHaveAttribute("aria-current", "page");
      await expect(main.getByRole("heading", { level: 1, name: "Preferences" })).toBeVisible();
      await expect(main.locator(".ayy-top-bar__back")).toBeHidden();

      // The section reads in a centred column, and the top bar's title lines up with it.
      const mainBox = (await main.boundingBox())!;
      const group = (await main.locator(".ayy-settings").first().boundingBox())!;
      expect(Math.abs(group.x - mainBox.x - (mainBox.x + mainBox.width - (group.x + group.width)))).toBeLessThan(2);
      const textStart = (selector: string) =>
        main.locator(selector).first().evaluate((el) => {
          const range = document.createRange();
          range.selectNodeContents(el);
          return range.getBoundingClientRect().x;
        });
      expect(Math.abs((await textStart(".ayy-top-bar__title")) - (await textStart(".ayy-settings__title")))).toBeLessThan(1);
      // Wider than the column: it centres, and the title follows it.
      await page.setViewportSize({ width: 1800, height: 800 });
      // The preview's column is narrower than that; let the example take the window, as an app would.
      await stage(page, SETTINGS).evaluate((el) => el.setAttribute("style", "position: fixed; inset: 0; z-index: 1000; padding: 0"));
      const wideMain = (await main.boundingBox())!;
      const wideGroup = (await main.locator(".ayy-settings").first().boundingBox())!;
      expect(wideGroup.x - wideMain.x).toBeGreaterThan(48);
      expect(Math.abs(wideGroup.x - wideMain.x - (wideMain.x + wideMain.width - (wideGroup.x + wideGroup.width)))).toBeLessThan(2);
      expect(Math.abs((await textStart(".ayy-top-bar__title")) - (await textStart(".ayy-settings__title")))).toBeLessThan(1);
    });

    test("settings shell on phones: the section list and a section are two screens", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 800 });
      await open(page, "app-shell", { renderer });
      const box = stage(page, SETTINGS);
      const shell = box.locator(".ayy-app-shell--settings");
      const sidebar = shell.locator(".ayy-app-shell__sidebar");
      const main = shell.locator(".ayy-app-shell__main");

      // A section is current: it fills the screen, and its top bar leads back to the list.
      await expect(sidebar).toBeHidden();
      await expect(main).toBeVisible();
      await expect(main.getByRole("link", { name: "Settings" })).toBeVisible();
      expect(Math.round((await main.boundingBox())!.width)).toBe(Math.round((await shell.boundingBox())!.width));

      // None is: the list is the screen, each section a row with a chevron.
      await sidebar.locator("[aria-current]").evaluate((el) => el.removeAttribute("aria-current"));
      await expect(main).toBeHidden();
      await expect(sidebar).toBeVisible();
      await expect(sidebar.getByRole("link", { name: "Back to Northwind" })).toBeVisible();
      const row = sidebar.getByRole("link", { name: "Members" });
      const chevron = () => row.evaluate((el) => getComputedStyle(el, "::after").transform);
      expect(await chevron()).not.toBe("none");
      const ltr = await chevron();
      await rtl(box);
      expect(await chevron()).not.toBe(ltr);
    });

    test("settings shell: Esc follows Back, except from a field that keeps it", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await open(page, "app-shell", { renderer });
      const shell = stage(page, SETTINGS).locator(".ayy-app-shell--settings");
      await shell.locator(".ayy-app-shell__back").evaluate((el) => {
        el.addEventListener("click", () => el.setAttribute("data-followed", String(Number(el.getAttribute("data-followed") ?? 0) + 1)));
      });
      const back = shell.locator(".ayy-app-shell__back");

      // A select keeps Esc to itself.
      await shell.getByLabel("Theme").focus();
      await page.keyboard.press("Escape");
      await expect(back).not.toHaveAttribute("data-followed");

      // A switch doesn't.
      await shell.getByRole("switch", { name: "Open at login" }).focus();
      await page.keyboard.press("Escape");
      await expect(back).toHaveAttribute("data-followed", "1");
    });
  });
}

test("a top bar first in an app shell's main stays at the very top, edge to edge, and scrolls nothing under it at rest", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await open(page, "app-shell");
  const main = stage(page, SETTINGS).locator(".ayy-app-shell__main");
  const bar = (await main.locator(".ayy-top-bar").boundingBox())!;
  const box = (await main.boundingBox())!;
  const first = (await main.locator(".ayy-settings").first().boundingBox())!;
  expect(Math.round(bar.y)).toBe(Math.round(box.y));
  expect(first.y).toBeGreaterThanOrEqual(bar.y + bar.height);

  // Scrolled: it stays put at the top.
  await main.evaluate((el) => el.scrollBy(0, 200));
  expect(Math.round((await main.locator(".ayy-top-bar").boundingBox())!.y)).toBe(Math.round(box.y));
});
