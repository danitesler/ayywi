import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/** The settings dialog, whichever theme it was opened on. */
const settings = (page: Page) => page.locator("dialog.pv-themer__dialog");
/** Opens a theme's settings with the cog beside it in the list. */
async function openCustom(page: Page, theme = "Default") {
  await page.getByRole("button", { name: `Customize ${theme}`, exact: true }).click();
  await expect(page.getByRole("dialog", { name: `Customize ${theme}` })).toBeVisible();
}
/** A choice in the dialog's segmented controls (Mode, Surface, Corners): pick it by its label. */
const choose = (page: Page, name: string) => settings(page).locator("label", { hasText: new RegExp(`^${name}$`) }).click();
/** The page's own Mode control, above the list of themes. */
const pageMode = (page: Page, name: string) => page.locator(".pv-themer__panel label", { hasText: new RegExp(`^${name}$`) }).click();
/** A theme in the list: picking it applies it to the site. */
const pick = (page: Page, name: string) => page.locator(".pv-themer").getByRole("radio", { name, exact: true }).locator("xpath=..").click();
const checked = (page: Page) => page.locator(".pv-themer input[name='pv-theme-preset']:checked");
async function save(page: Page) {
  await settings(page).getByRole("button", { name: "Save" }).click();
  await expect(settings(page)).toBeHidden();
}
const settle = (page: Page) => page.evaluate(() => Promise.all(document.getAnimations().filter((a) => a.effect?.getComputedTiming().endTime !== Infinity).map((a) => a.finished.catch(() => undefined))));

test("six themes and Custom in one list, each in light and dark, picked by a click that applies at once", async ({ page }) => {
  await page.goto("/#/themes");
  const picker = page.locator(".pv-themer");
  const radios = picker.getByRole("radiogroup", { name: "Themes" }).getByRole("radio");
  const names = ["Default", "Ember", "Forest", "Arctic", "Twilight", "Wine", "Custom"];
  await expect(radios).toHaveCount(names.length);
  for (const [i, name] of names.entries()) {
    await expect(radios.nth(i)).toHaveAccessibleName(name);
    await expect(picker.getByRole("button", { name: `Customize ${name}`, exact: true })).toBeAttached();
  }
  await expect(page.getByRole("button", { name: "Use this theme" })).toHaveCount(0);
  // Each picture is one screen in the chosen mode, and the cog shows on the chosen theme and on hover.
  const screen = picker.locator(".pv-themer__list .ayy-settings__preview").nth(1).locator(".ayy-settings__screen");
  await expect(screen).toHaveCount(1);
  const cog = (name: string) => picker.locator(".pv-themer__item", { has: page.getByRole("button", { name: `Customize ${name}`, exact: true }) }).locator(".pv-themer__cog");
  await expect(cog("Default")).toHaveCSS("opacity", "1");
  await expect(cog("Ember")).toHaveCSS("opacity", "0");
  await cog("Ember").locator("xpath=..").hover();
  await expect(cog("Ember")).toHaveCSS("opacity", "1");
  await pageMode(page, "Light");
  await expect(screen).toHaveAttribute("data-theme", "light");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await pick(page, "Arctic");
  await expect(page.locator("html")).toHaveAttribute("data-brand", "arctic");
  await expect(page.locator(".pv-themer__sample")).toHaveAttribute("data-theme", "light");
  await pageMode(page, "Dark");
  await expect(page.locator(".pv-themer__sample")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("a picked theme lasts for the tab only: a reload or a new tab starts from Default", async ({ page, context }) => {
  await page.goto("/#/themes");
  await pick(page, "Ember");
  await expect(page.locator("html")).toHaveAttribute("data-brand", "ember");
  await expect(page.locator("html")).toHaveAttribute("data-ayy-icons", "lucide");
  // Moving around the site keeps it.
  await page.evaluate(() => (location.hash = "#/components/button"));
  await expect(page.locator("html")).toHaveAttribute("data-brand", "ember");
  const other = await context.newPage();
  await other.goto("/#/themes");
  await expect(other.locator("html")).not.toHaveAttribute("data-brand", /.+/);
  await expect(other.locator("html")).not.toHaveAttribute("data-ayy-icons", /.+/);
  await page.reload();
  await expect(page.locator("html")).not.toHaveAttribute("data-brand", /.+/);
  await page.evaluate(() => (location.hash = "#/themes"));
  await expect(checked(page)).toHaveValue("default");
  expect(await page.evaluate(() => Object.keys(localStorage).filter((key) => /brand|customization|custom-theme|ayy-icons/.test(key)))).toEqual([]);
});

test("the cog opens a theme's settings filled in with it; Save unchanged keeps it, a change makes it Custom, Cancel undoes", async ({ page }) => {
  await page.goto("/#/themes");
  await openCustom(page, "Ember");
  const dialog = settings(page);
  await expect(dialog.getByRole("radio", { name: "Sharp" })).toBeChecked();
  await expect(dialog.getByLabel("Font")).toHaveValue("grotesk");
  await expect(dialog.getByLabel("Icons")).toHaveValue("lucide");
  // Nothing reaches the site until Save.
  await expect(page.locator("html")).not.toHaveAttribute("data-brand", /.+/);
  await save(page);
  await expect(checked(page)).toHaveValue("ember");
  await expect(page.locator("html")).toHaveAttribute("data-brand", "ember");

  const corners = () => page.locator("html").evaluate((el) => getComputedStyle(el).getPropertyValue("--ayy-radius-button").trim());
  const sharp = await corners();
  await openCustom(page, "Ember");
  await choose(page, "Round");
  expect(await corners()).toBe(sharp);
  await save(page);
  await expect(checked(page)).toHaveValue("custom");
  await expect.poll(corners).not.toBe(sharp);
  const round = await corners();

  await openCustom(page, "Wine");
  await choose(page, "Sharp");
  await settings(page).getByRole("button", { name: "Cancel" }).click();
  await expect(settings(page)).toBeHidden();
  await expect(checked(page)).toHaveValue("custom");
  expect(await corners()).toBe(round);
  // Custom's cog opens the saved custom theme.
  await openCustom(page, "Custom");
  await expect(settings(page).getByRole("radio", { name: "Round" })).toBeChecked();
  await page.keyboard.press("Escape");
  await expect(settings(page)).toBeHidden();
  await expect(checked(page)).toHaveValue("custom");
});

test("custom settings preview in both modes and pass axe", async ({ page }) => {
  await page.goto("/#/themes");
  await openCustom(page);
  await choose(page, "Subtle");
  await choose(page, "Dark");
  const sample = page.locator(".pv-themer__sample");
  const violations = async () => {
    await settle(page);
    return (await new AxeBuilder({ page }).include(".pv-themer").disableRules(["region"]).analyze()).violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  };
  const dark = await sample.evaluate((el) => getComputedStyle(el).backgroundColor);
  await choose(page, "Light");
  expect(await sample.evaluate((el) => getComputedStyle(el).backgroundColor)).not.toEqual(dark);
  await save(page);
  expect(await violations()).toEqual([]);
  await expect(checked(page)).toHaveValue("custom");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

for (const scheme of ["dark", "light"] as const) test(`custom tint reaches the navbar and component surfaces (${scheme})`, async ({ page }) => {
  await page.addInitScript((theme) => localStorage.setItem("ayy-theme", theme), scheme);
  await page.goto("/#/components/top-bar");
  const navbar = page.locator(".ayy-navbar").first();
  const topbar = page.locator(".ayy-top-bar").first();
  await expect(topbar).toBeVisible();
  const background = (selector: typeof navbar) => selector.evaluate((el) => getComputedStyle(el).backgroundColor);
  const originalNav = await background(navbar);
  const originalTop = await background(topbar);
  await page.evaluate(() => (location.hash = "#/themes"));
  await openCustom(page);
  await settings(page).getByRole("button", { name: "Violet" }).click();
  await choose(page, "Subtle");
  await choose(page, scheme === "dark" ? "Dark" : "Light");
  await save(page);
  await page.evaluate(() => (location.hash = "#/components/top-bar"));
  await expect.poll(() => background(navbar)).not.toBe(originalNav);
  await expect.poll(() => background(topbar)).not.toBe(originalTop);
  const tintedTop = await background(topbar);
  const example = page.locator('[aria-labelledby="ex-detail"]');
  await example.getByRole("radio", { name: "Mobile" }).click();
  const mobileTop = example.frameLocator(".pv-stage__iframe").locator(".ayy-top-bar").first();
  await expect(mobileTop).toBeVisible();
  await expect.poll(() => mobileTop.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(tintedTop);
});

for (const scheme of ["dark", "light"] as const) test(`Default is monochrome in ${scheme}, in the preview and on the site`, async ({ page }) => {
  await page.goto("/#/themes");
  await pageMode(page, scheme === "dark" ? "Dark" : "Light");
  await pick(page, "Wine");
  await expect(page.locator("html")).toHaveAttribute("data-brand", "wine");
  const primary = (selector: string) => page.locator(selector).evaluate((el) => getComputedStyle(el).getPropertyValue("--ayy-color-primary").trim());
  await pick(page, "Default");
  const mono = scheme === "dark" ? "#ffffff" : "#0a0a0a";
  await expect(page.getByRole("button", { name: "Send report" })).toHaveCSS("background-color", scheme === "dark" ? "rgb(255, 255, 255)" : "rgb(10, 10, 10)");
  expect(await primary(".pv-themer__sample")).toContain(mono);
  await expect(page.locator("html")).not.toHaveAttribute("data-brand", /.+/);
  expect(await primary("html")).toMatch(scheme === "dark" ? /^#(fff|ffffff)$/i : /^#0a0a0a$/i);
});

test("the preview wears the theme all the way through, with its name and Copy for... above it", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/#/themes");
  await pageMode(page, "Light");
  await pick(page, "Arctic");
  const stage = page.locator(".pv-themer__stage");
  const sample = page.locator(".pv-themer__sample");
  await expect(stage).toHaveAttribute("data-theme", "light");
  await expect(sample.getByText("Revenue", { exact: true })).toHaveCSS("font-family", /IBM Plex Sans/);
  const luminance = (rgb: string) => rgb.match(/\d+/g)!.slice(0, 3).map(Number).reduce((a, b) => a + b, 0) / 3;
  expect(luminance(await stage.evaluate((el) => getComputedStyle(el).backgroundColor))).toBeGreaterThan(200);
  // The name and Copy for... sit above the preview, outside it; the list is on the start side.
  const heading = page.getByRole("heading", { level: 2, name: "Arctic · Light" });
  const copy = page.getByRole("button", { name: "Copy for...", exact: true });
  const [panel, box, title, button] = [await page.locator(".pv-themer__panel").boundingBox(), await stage.boundingBox(), await heading.boundingBox(), await copy.boundingBox()];
  expect(panel!.x + panel!.width).toBeLessThan(box!.x);
  for (const above of [title!, button!]) expect(above.y + above.height).toBeLessThanOrEqual(box!.y);
  expect(Math.abs(box!.x + box!.width - (button!.x + button!.width))).toBeLessThan(2);
  await expect(stage.getByRole("button", { name: "Copy for...", exact: true })).toHaveCount(0);
});

test("Copy for... shows the theme's prompt and code in a popover, like a component's", async ({ page }) => {
  await page.goto("/#/themes");
  await pageMode(page, "Dark");
  await pick(page, "Arctic");
  await page.getByRole("button", { name: "Copy for...", exact: true }).click();
  const popover = page.getByRole("dialog", { name: "Copy for Arctic" });
  await expect(popover.getByRole("tab", { name: "AI prompt" })).toHaveAttribute("aria-selected", "true");
  const panel = popover.getByRole("tabpanel");
  await expect(panel).toContainText('Use the ayywi "Arctic" theme');
  await expect(panel).toContainText("#5e81ac");
  await expect(panel).toContainText("fonts.googleapis.com/css2?family=Space+Mono");
  await expect(panel).toContainText('ayywi.setTheme("dark")');
  await expect(popover.getByRole("button", { name: "Copy prompt" })).toBeVisible();
  await popover.getByRole("tab", { name: "Code" }).click();
  await expect(popover.getByRole("tabpanel")).toContainText('ayywi.setBrand({ name: "arctic"');
  await expect(popover.getByRole("tabpanel")).not.toContainText("Use the ayywi");
});

test("the settings dialog is centred with the live preview on its end side", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/#/themes");
  await openCustom(page);
  const dialog = settings(page);
  // Its opening animation scales it, so measure once it has settled.
  await settle(page);
  const box = (await dialog.boundingBox())!;
  expect(Math.abs(box.x + box.width / 2 - 640)).toBeLessThan(2);
  expect(Math.abs(box.y + box.height / 2 - 400)).toBeLessThan(2);
  const controls = (await dialog.getByLabel("Font").boundingBox())!;
  const preview = (await dialog.locator(".pv-themer__sample").boundingBox())!;
  expect(preview.x).toBeGreaterThan(controls.x + controls.width);
  await expect(page.locator(".pv-themer__sample")).toHaveCount(1);
  await save(page);
  await expect(page.locator(".pv-themer__sample")).toHaveCount(1);
});

test("Ember brings its own corners and heading font to the site", async ({ page }) => {
  await page.goto("/#/themes");
  const corners = () => page.locator("html").evaluate((el) => getComputedStyle(el).getPropertyValue("--ayy-radius-button").trim());
  const before = await corners();
  await pick(page, "Ember");
  await expect(page.locator("html")).toHaveAttribute("data-brand", "ember");
  await expect.poll(corners).not.toBe(before);
});

test("Auto mode follows the device for any theme and applies as the system theme", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/#/themes");
  const picker = page.locator(".pv-themer");
  await expect(picker.getByRole("radiogroup", { name: "Mode" }).getByRole("radio", { name: "Auto" })).toBeChecked();
  await expect(checked(page)).toHaveValue("default");
  await pick(page, "Arctic");
  const stage = page.locator(".pv-themer__stage");
  await expect(stage).toHaveAttribute("data-theme", "dark");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(stage).toHaveAttribute("data-theme", "light");
  expect(await page.evaluate(() => localStorage.getItem("ayy-theme"))).toBe("system");
  await pageMode(page, "Dark");
  expect(await page.evaluate(() => localStorage.getItem("ayy-theme"))).toBe("dark");
});

test("Density resizes the preview and applies with a saved custom theme; a preset leaves it alone", async ({ page }) => {
  await page.goto("/#/themes");
  await openCustom(page);
  const dialog = settings(page);
  const send = dialog.getByRole("button", { name: "Send report" });
  await dialog.getByLabel("Density").selectOption("compact");
  const compact = (await send.boundingBox())!.height;
  await dialog.getByLabel("Density").selectOption("touch");
  await expect(dialog.locator(".pv-themer__stage")).toHaveAttribute("data-density", "touch");
  expect((await send.boundingBox())!.height).toBeGreaterThan(compact);
  await save(page);
  await expect(checked(page)).toHaveValue("custom");
  await expect(page.locator("html")).toHaveAttribute("data-density", "touch");
  await pick(page, "Arctic");
  await expect(page.locator("html")).toHaveAttribute("data-density", "touch");
});

test("with Mono, Subtle takes the page deeper; with an accent it tints it", async ({ page }) => {
  await page.goto("/#/themes");
  await openCustom(page);
  const dialog = settings(page);
  await choose(page, "Dark");
  const sample = dialog.locator(".pv-themer__sample");
  const bg = async () => (await sample.evaluate((el) => getComputedStyle(el).backgroundColor)).match(/\d+/g)!.slice(0, 3).map(Number);
  await choose(page, "Neutral");
  const neutral = await bg();
  await choose(page, "Subtle");
  const subtle = await bg();
  // Still neutral grey, only blacker.
  for (const [r, g, b] of [neutral, subtle]) expect([r, b]).toEqual([g, g]);
  expect(subtle[0]).toBeLessThan(neutral[0]);
  await dialog.getByRole("button", { name: "Violet" }).click();
  const [r, g, b] = await bg();
  expect(b).toBeGreaterThan(g);
  expect(Math.max(r, g, b)).toBeGreaterThan(subtle[0]);
});

test("Surface offers only Neutral and Subtle", async ({ page }) => {
  await page.goto("/#/themes");
  await openCustom(page, "Forest");
  const surface = settings(page).getByRole("radiogroup", { name: "Surface" });
  await expect(surface.getByRole("radio")).toHaveCount(2);
  await expect(surface.getByRole("radio", { name: "Subtle" })).toBeChecked();
  await expect(settings(page).getByRole("radio", { name: "Rich" })).toHaveCount(0);
});

test("the preview site is named after the theme and has its own icon", async ({ page }) => {
  await page.goto("/#/themes");
  const sample = page.locator(".pv-themer__sample");
  const paths: string[] = [];
  for (const name of ["Ember", "Wine", "Arctic"]) {
    await pick(page, name);
    await expect(sample.getByText(name, { exact: true })).toBeVisible();
    await expect(sample.getByText("Acme")).toHaveCount(0);
    paths.push(await sample.locator("svg.ayy-icon").first().evaluate((el) => el.innerHTML));
  }
  expect(new Set(paths).size).toBe(3);
});

test("Reset theme sits at the footer's start and puts the settings back to Default's", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/#/themes");
  await openCustom(page);
  const dialog = settings(page);
  const reset = dialog.getByRole("button", { name: "Reset theme" });
  await expect(reset).toBeDisabled();
  await choose(page, "Subtle");
  await choose(page, "Sharp");
  await dialog.getByLabel("Font").selectOption("serif");
  await dialog.getByLabel("Density").selectOption("touch");
  await expect(reset).toBeEnabled();
  const [r, s, box] = [(await reset.boundingBox())!, (await dialog.getByRole("button", { name: "Save" }).boundingBox())!, (await dialog.boundingBox())!];
  expect(r.x).toBeLessThan(box.x + 64);
  expect(s.x).toBeGreaterThan(box.x + box.width - 160);
  await reset.click();
  for (const name of ["Neutral", "Pill"]) await expect(dialog.getByRole("radio", { name })).toBeChecked();
  await expect(dialog.getByLabel("Font")).toHaveValue("default");
  await expect(dialog.getByLabel("Density")).toHaveValue("auto");
  await expect(reset).toBeDisabled();
});

test("every font pairing reaches the preview's headings and text", async ({ page }) => {
  await page.goto("/#/themes");
  await openCustom(page);
  const dialog = settings(page);
  const options = await dialog.getByLabel("Font").locator("option").evaluateAll((list) => list.map((o) => [(o as HTMLOptionElement).value, o.textContent ?? ""]));
  expect(options.length).toBe(10);
  const heading = dialog.locator(".pv-themer__sample").getByText("Default", { exact: true });
  const text = dialog.locator(".pv-themer__sample").getByText("Revenue", { exact: true });
  const families: Record<string, [string, string]> = {
    editorial: ["Fraunces", "Sora"], serif: ["Literata", "Literata"], sans: ["Sora", "Sora"], system: ["system-ui", "system-ui"],
    grotesk: ["Space Grotesk", "DM Sans"], technical: ["Space Mono", "IBM Plex Sans"], friendly: ["Bricolage Grotesque", "Figtree"],
    display: ["Syne", "Manrope"], readable: ["Lexend", "Lexend"],
  };
  for (const [id, [h, b]] of Object.entries(families)) {
    await dialog.getByLabel("Font").selectOption(id);
    await expect(heading, id).toHaveCSS("font-family", new RegExp(h));
    await expect(text, id).toHaveCSS("font-family", new RegExp(b));
  }
});

test("a custom font reaches the site on Save and stays with Custom while another theme is picked", async ({ page }) => {
  await page.goto("/#/themes");
  await openCustom(page);
  await settings(page).getByLabel("Font").selectOption("serif");
  await save(page);
  await settle(page);
  const result = await new AxeBuilder({ page }).include(".pv-themer__sample").disableRules(["region"]).analyze();
  expect(result.violations.filter((v) => v.impact === "serious" || v.impact === "critical")).toEqual([]);
  await expect(page.locator("body")).toHaveCSS("font-family", /Literata/);
  await pick(page, "Arctic");
  await expect(page.locator("body")).not.toHaveCSS("font-family", /Literata/);
  await pick(page, "Custom");
  await expect(page.locator("body")).toHaveCSS("font-family", /Literata/);
});

test("every theme's preview passes accessibility checks in light and dark", async ({ page }) => {
  test.setTimeout(120_000); // twelve axe runs
  await page.goto("/#/themes");
  for (const mode of ["Light", "Dark"]) {
    await pageMode(page, mode);
    for (const name of ["Default", "Ember", "Forest", "Arctic", "Twilight", "Wine"]) {
      await pick(page, name);
      await settle(page);
      const result = await new AxeBuilder({ page }).include(".pv-themer__sample").disableRules(["region"]).analyze();
      expect(result.violations.filter((v) => v.impact === "serious" || v.impact === "critical"), `${name} ${mode}`).toEqual([]);
    }
  }
});
