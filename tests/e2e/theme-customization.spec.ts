import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/** Selects Custom and opens its settings: the cog on the Custom picture. */
async function openCustom(page: Page) {
  await page.getByRole("button", { name: "Customize theme", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Custom theme" })).toBeVisible();
}
/** A choice in the dialog's segmented controls (Mode, Surface, Corners): pick it by its label. */
const choose = (page: Page, name: string) => page.getByRole("dialog", { name: "Custom theme" }).locator("label", { hasText: new RegExp(`^${name}$`) }).click();
async function closeCustom(page: Page) {
  await page.getByRole("dialog", { name: "Custom theme" }).getByRole("button", { name: "Done" }).click();
  await expect(page.getByRole("dialog", { name: "Custom theme" })).toBeHidden();
}

test("theme customization previews, applies and survives reload in both modes", async ({ page }) => {
  await page.goto("/#/themes");
  await openCustom(page);
  const dialog = page.getByRole("dialog", { name: "Custom theme" });
  await choose(page, "Subtle");
  await choose(page, "Dark");
  const sample = page.locator(".pv-themer__sample");
  const violations = async () => {
    await page.evaluate(() => Promise.all(document.getAnimations().filter((a) => a.effect?.getComputedTiming().endTime !== Infinity).map((a) => a.finished.catch(() => undefined))));
    return (await new AxeBuilder({ page }).include(".pv-themer").disableRules(["region"]).analyze()).violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  };
  const dark = await sample.evaluate((el) => getComputedStyle(el).backgroundColor);
  await closeCustom(page);
  expect(await violations()).toEqual([]);
  await openCustom(page);
  await choose(page, "Light");
  const light = await sample.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(light).not.toEqual(dark);
  await closeCustom(page);
  expect(await violations()).toEqual([]);
  await page.getByRole("button", { name: "Use this theme" }).click();
  await page.reload();
  await openCustom(page);
  await expect(dialog.getByRole("radio", { name: "Subtle" })).toBeChecked();
  await expect(dialog.getByRole("radio", { name: "Light" })).toBeChecked();
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
  await page.goto("/#/themes");
  await openCustom(page);
  await page.getByRole("dialog", { name: "Custom theme" }).getByRole("button", { name: "Violet" }).click();
  await choose(page, "Subtle");
  await choose(page, scheme === "dark" ? "Dark" : "Light");
  await closeCustom(page);
  await page.getByRole("button", { name: "Use this theme" }).click();
  await page.goto("/#/components/top-bar");
  await expect.poll(() => background(navbar)).not.toBe(originalNav);
  await expect.poll(() => background(topbar)).not.toBe(originalTop);
  const tintedTop = await background(topbar);
  const example = page.locator('[aria-labelledby="ex-detail"]');
  await example.getByRole("radio", { name: "Mobile" }).click();
  const mobileTop = example.frameLocator(".pv-stage__iframe").locator(".ayy-top-bar").first();
  await expect(mobileTop).toBeVisible();
  await expect.poll(() => mobileTop.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(tintedTop);
});

test("twelve presets in Dark and Light, six each with a Default first, and Custom opens its settings in a dialog", async ({ page }) => {
  await page.goto("/#/themes");
  const picker = page.locator(".pv-themer");
  await expect(picker.getByRole("radio")).toHaveCount(14);
  await expect(picker.getByRole("radio", { name: "Midnight" })).toHaveCount(0);
  for (const [group, names] of [
    ["Default", ["Auto", "Custom"]],
    ["Dark", ["Default dark", "Ember", "Forest", "Arctic", "Twilight", "Wine"]],
    ["Light", ["Default light", "Sunlit", "Lagoon", "Paper", "Lavender", "Blush"]],
  ] as const) {
    const radios = picker.getByRole("radiogroup", { name: group }).getByRole("radio");
    await expect(radios).toHaveCount(names.length);
    for (const [i, name] of names.entries()) await expect(radios.nth(i)).toHaveAccessibleName(name);
  }
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await picker.getByRole("radio", { name: "Arctic", exact: true }).locator("xpath=..").click();
  await expect(page.locator(".pv-themer__sample")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Use this theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-brand", "arctic");
  await page.reload();
  await expect(picker.getByRole("radio", { name: "Arctic", exact: true })).toBeChecked();
  await picker.getByRole("radio", { name: "Custom", exact: true }).locator("xpath=..").click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await openCustom(page);
  const settings = page.getByRole("dialog", { name: "Custom theme" });
  for (const name of ["Mode", "Accent colour", "Surface", "Corners"]) await expect(settings.getByText(name, { exact: true })).toBeVisible();
  await expect(settings.getByLabel("Font")).toBeVisible();
  await expect(settings.getByLabel("Density")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Custom theme" })).toBeHidden();
});

for (const scheme of ["dark", "light"] as const) test(`a Default ${scheme} theme is monochrome, even while the site wears another theme`, async ({ page }) => {
  await page.goto("/#/themes");
  const picker = page.locator(".pv-themer");
  await picker.getByRole("radio", { name: scheme === "dark" ? "Wine" : "Lavender", exact: true }).locator("xpath=..").click();
  await page.getByRole("button", { name: "Use this theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-brand", /.+/);
  const primary = (selector: string) => page.locator(selector).evaluate((el) => getComputedStyle(el).getPropertyValue("--ayy-color-primary").trim());
  const siteAccent = await primary("html");
  await picker.getByRole("radio", { name: `Default ${scheme}`, exact: true }).locator("xpath=..").click();
  // The preview shows the default's own colours, not the ones the site wears.
  const mono = scheme === "dark" ? "#ffffff" : "#0a0a0a";
  await expect(page.getByRole("button", { name: "Send report" })).toHaveCSS("background-color", scheme === "dark" ? "rgb(255, 255, 255)" : "rgb(10, 10, 10)");
  expect(await primary(".pv-themer__sample")).toContain(mono);
  expect(await primary("html")).toBe(siteAccent);
  await page.getByRole("button", { name: "Use this theme" }).click();
  await expect(page.locator("html")).not.toHaveAttribute("data-brand", /.+/);
  expect(await primary("html")).toMatch(scheme === "dark" ? /^#(fff|ffffff)$/i : /^#0a0a0a$/i);
});

test("the preview is the chosen theme all the way through, whatever the site wears, and sits centred", async ({ page }) => {
  await page.goto("/#/themes");
  const picker = page.locator(".pv-themer");
  await picker.getByRole("radio", { name: "Ember", exact: true }).locator("xpath=..").click();
  await page.getByRole("button", { name: "Use this theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-brand", "ember");
  await picker.getByRole("radio", { name: "Paper", exact: true }).locator("xpath=..").click();
  const stage = page.locator(".pv-themer__stage");
  const sample = page.locator(".pv-themer__sample");
  // Paper is light, with Literata for body text; the site is a dark theme with its own colours.
  await expect(stage).toHaveAttribute("data-theme", "light");
  await expect(sample.getByText("Revenue", { exact: true })).toHaveCSS("font-family", /Literata/);
  const luminance = (rgb: string) => rgb.match(/\d+/g)!.slice(0, 3).map(Number).reduce((a, b) => a + b, 0) / 3;
  expect(luminance(await stage.evaluate((el) => getComputedStyle(el).backgroundColor))).toBeGreaterThan(200);
  expect(luminance(await stage.getByRole("heading", { level: 2 }).evaluate((el) => getComputedStyle(el).color))).toBeLessThan(100);
  // Centred in the preview, both ways.
  const [box, inner] = [await stage.boundingBox(), await sample.boundingBox()];
  expect(Math.abs(box!.x + box!.width / 2 - (inner!.x + inner!.width / 2))).toBeLessThan(2);
  const header = await stage.locator(".pv-themer__stage-header").boundingBox();
  const free = { top: header!.y + header!.height, bottom: box!.y + box!.height };
  expect(Math.abs((free.top + free.bottom) / 2 - (inner!.y + inner!.height / 2))).toBeLessThan(24);
});

test("Customize theme is a centred dialog with the live preview on its end side", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/#/themes");
  await openCustom(page);
  const dialog = page.getByRole("dialog", { name: "Custom theme" });
  // Its opening animation scales it, so measure once it has settled.
  await page.evaluate(() => Promise.all(document.getAnimations().filter((a) => a.effect?.getComputedTiming().endTime !== Infinity).map((a) => a.finished.catch(() => undefined))));
  const box = (await dialog.boundingBox())!;
  expect(Math.abs(box.x + box.width / 2 - 640)).toBeLessThan(2);
  expect(Math.abs(box.y + box.height / 2 - 400)).toBeLessThan(2);
  const controls = (await dialog.getByLabel("Font").boundingBox())!;
  const preview = (await dialog.locator(".pv-themer__sample").boundingBox())!;
  expect(preview.x).toBeGreaterThan(controls.x + controls.width);
  await expect(page.locator(".pv-themer__sample")).toHaveCount(1);
  const stage = (await dialog.locator(".pv-themer__stage").boundingBox())!;
  expect(Math.abs(stage.x + stage.width / 2 - (preview.x + preview.width / 2))).toBeLessThan(2);
  await closeCustom(page);
  await expect(page.locator(".pv-themer__sample")).toHaveCount(1);
});

test("Ember brings its own corners and heading font to the site, and survives a reload", async ({ page }) => {
  await page.goto("/#/themes");
  const picker = page.locator(".pv-themer");
  await picker.getByRole("radio", { name: "Ember", exact: true }).locator("xpath=..").click();
  const corners = () => page.locator("html").evaluate((el) => getComputedStyle(el).getPropertyValue("--ayy-radius-button").trim());
  const before = await corners();
  await page.getByRole("button", { name: "Use this theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-brand", "ember");
  await expect.poll(corners).not.toBe(before);
  await page.reload();
  await expect(picker.getByRole("radio", { name: "Ember", exact: true })).toBeChecked();
});

test("Auto follows the device's colour scheme and applies as the system theme", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/#/themes");
  await openCustom(page);
  await choose(page, "Subtle");
  await choose(page, "Auto");
  const stage = page.getByRole("dialog", { name: "Custom theme" }).locator(".pv-themer__stage");
  await expect(stage).toHaveAttribute("data-theme", "dark");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(stage).toHaveAttribute("data-theme", "light");
  await closeCustom(page);
  await page.getByRole("button", { name: "Use this theme" }).click();
  expect(await page.evaluate(() => localStorage.getItem("ayy-theme"))).toBe("system");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator(".pv-themer__sample")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await openCustom(page);
  await expect(page.getByRole("dialog", { name: "Custom theme" }).getByRole("radio", { name: "Auto" })).toBeChecked();
});

test("Density resizes the preview, applies to the site and survives a reload", async ({ page }) => {
  await page.goto("/#/themes");
  await openCustom(page);
  const dialog = page.getByRole("dialog", { name: "Custom theme" });
  const send = dialog.getByRole("button", { name: "Send report" });
  await dialog.getByLabel("Density").selectOption("compact");
  const compact = (await send.boundingBox())!.height;
  await dialog.getByLabel("Density").selectOption("touch");
  await expect(dialog.locator(".pv-themer__stage")).toHaveAttribute("data-density", "touch");
  expect((await send.boundingBox())!.height).toBeGreaterThan(compact);
  await closeCustom(page);
  await page.getByRole("button", { name: "Use this theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-density", "touch");
  await page.reload();
  await openCustom(page);
  await expect(page.getByLabel("Density")).toHaveValue("touch");
  // A preset leaves the site's density alone.
  await closeCustom(page);
  await page.locator(".pv-themer").getByRole("radio", { name: "Arctic", exact: true }).locator("xpath=..").click();
  await page.getByRole("button", { name: "Use this theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-density", "touch");
});

test("Auto in Default picks the default dark or light from the device", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/#/themes");
  const picker = page.locator(".pv-themer");
  // A site that has never been themed follows the device, so Auto is what it uses.
  await expect(picker.getByRole("radio", { name: "Auto", exact: true })).toBeChecked();
  await picker.getByRole("radio", { name: "Arctic", exact: true }).locator("xpath=..").click();
  await page.getByRole("button", { name: "Use this theme" }).click();
  await picker.getByRole("radio", { name: "Auto", exact: true }).locator("xpath=..").click();
  const stage = page.locator(".pv-themer__stage");
  await expect(stage).toHaveAttribute("data-theme", "dark");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(stage).toHaveAttribute("data-theme", "light");
  await expect(page.getByRole("button", { name: "Send report" })).toHaveCSS("background-color", "rgb(10, 10, 10)");
  await page.getByRole("button", { name: "Use this theme" }).click();
  await expect(page.locator("html")).not.toHaveAttribute("data-brand", /.+/);
  expect(await page.evaluate(() => localStorage.getItem("ayy-theme"))).toBe("system");
  await page.reload();
  await expect(picker.getByRole("radio", { name: "Auto", exact: true })).toBeChecked();
});

test("with Mono, Subtle takes the page deeper; with an accent it tints it", async ({ page }) => {
  await page.goto("/#/themes");
  await openCustom(page);
  const dialog = page.getByRole("dialog", { name: "Custom theme" });
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

test("Surface offers only Neutral and Subtle, and an older stored strength loads as Subtle", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("ayy-preview-brand", JSON.stringify({ name: "acme", color: "#7c3aed" }));
    localStorage.setItem("ayy-preview-theme-customization", JSON.stringify({ color: "#7c3aed", surface: 60, contrast: 0 }));
  });
  await page.goto("/#/themes");
  await openCustom(page);
  const dialog = page.getByRole("dialog", { name: "Custom theme" });
  const surface = dialog.getByRole("radiogroup", { name: "Surface" });
  await expect(surface.getByRole("radio")).toHaveCount(2);
  await expect(surface.getByRole("radio", { name: "Subtle" })).toBeChecked();
  await expect(dialog.getByRole("radio", { name: "Rich" })).toHaveCount(0);
});

test("the preview app is named after the theme and has its own icon", async ({ page }) => {
  await page.goto("/#/themes");
  const picker = page.locator(".pv-themer");
  const sample = page.locator(".pv-themer__sample");
  const paths: string[] = [];
  for (const name of ["Ember", "Wine", "Paper"]) {
    await picker.getByRole("radio", { name, exact: true }).locator("xpath=..").click();
    await expect(sample.getByText(name, { exact: true })).toBeVisible();
    await expect(sample.getByText("Acme")).toHaveCount(0);
    paths.push(await sample.locator("svg.ayy-icon").first().evaluate((el) => el.innerHTML));
  }
  expect(new Set(paths).size).toBe(3);
});

test("Reset theme sits at the footer's start and puts Custom back to its defaults", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/#/themes");
  await openCustom(page);
  const dialog = page.getByRole("dialog", { name: "Custom theme" });
  const reset = dialog.getByRole("button", { name: "Reset theme" });
  await expect(reset).toBeDisabled();
  await choose(page, "Subtle");
  await choose(page, "Sharp");
  await choose(page, "Dark");
  await dialog.getByLabel("Font").selectOption("serif");
  await dialog.getByLabel("Density").selectOption("touch");
  await expect(reset).toBeEnabled();
  const [r, d, box] = [(await reset.boundingBox())!, (await dialog.getByRole("button", { name: "Done" }).boundingBox())!, (await dialog.boundingBox())!];
  expect(r.x).toBeLessThan(box.x + 64);
  expect(d.x).toBeGreaterThan(box.x + box.width - 160);
  await reset.click();
  for (const name of ["Neutral", "Pill", "Auto"]) await expect(dialog.getByRole("radio", { name })).toBeChecked();
  await expect(dialog.getByLabel("Font")).toHaveValue("default");
  await expect(dialog.getByLabel("Density")).toHaveValue("auto");
  await expect(reset).toBeDisabled();
});

test("Using themes gives a prompt for the picked theme, with the code in a tab", async ({ page }) => {
  await page.goto("/#/themes");
  await page.locator(".pv-themer").getByRole("radio", { name: "Arctic", exact: true }).locator("xpath=..").click();
  const guide = page.locator(".pv-themer__guide");
  await expect(guide.getByRole("tab", { name: "Prompt" })).toHaveAttribute("aria-selected", "true");
  const panel = guide.getByRole("tabpanel");
  await expect(panel).toContainText('Use the ayywi "Arctic" theme');
  await expect(panel).toContainText("#5e81ac");
  await expect(panel).toContainText("fonts.googleapis.com/css2?family=Space+Mono");
  await expect(panel).toContainText('ayywi.setTheme("dark")');
  await guide.getByRole("tab", { name: "Code" }).click();
  await expect(guide.getByRole("tabpanel")).toContainText('ayywi.setBrand({ name: "arctic"');
  await expect(guide.getByRole("tabpanel")).not.toContainText("Use the ayywi");
});

test("every font pairing reaches the preview's headings and text", async ({ page }) => {
  await page.goto("/#/themes");
  await openCustom(page);
  const dialog = page.getByRole("dialog", { name: "Custom theme" });
  const options = await dialog.getByLabel("Font").locator("option").evaluateAll((list) => list.map((o) => [(o as HTMLOptionElement).value, o.textContent ?? ""]));
  expect(options.length).toBe(10);
  const heading = dialog.locator(".pv-themer__sample").getByText("Custom", { exact: true });
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

test("a custom font survives applying and reloading", async ({ page }) => {
  await page.goto("/#/themes");
  await openCustom(page);
  await page.getByLabel("Font").selectOption("serif");
  await closeCustom(page);
  await page.evaluate(() => Promise.all(document.getAnimations().filter((a) => a.effect?.getComputedTiming().endTime !== Infinity).map((a) => a.finished.catch(() => undefined))));
  const result = await new AxeBuilder({ page }).include(".pv-themer__sample").disableRules(["region"]).analyze();
  expect(result.violations.filter((v) => v.impact === "serious" || v.impact === "critical")).toEqual([]);
  await page.getByRole("button", { name: "Use this theme" }).click();
  await expect(page.locator("body")).toHaveCSS("font-family", /Literata/);
  await page.reload();
  await openCustom(page);
  await expect(page.getByLabel("Font")).toHaveValue("serif");
  await closeCustom(page);
  await page.getByRole("radio", { name: "Arctic", exact: true }).locator("xpath=..").click();
  await page.getByRole("button", { name: "Use this theme" }).click();
  await page.reload();
  await openCustom(page);
  await expect(page.getByLabel("Font")).toHaveValue("serif");
});

test("all twelve preset previews pass accessibility checks", async ({ page }) => {
  test.setTimeout(90_000); // twelve axe runs
  await page.goto("/#/themes");
  const picker = page.locator(".pv-themer");
  for (const name of ["Default light", "Default dark", "Arctic", "Twilight", "Forest", "Ember", "Wine", "Sunlit", "Blush", "Lagoon", "Lavender", "Paper"]) {
    await picker.getByRole("radio", { name, exact: true }).locator("xpath=..").click();
    await page.evaluate(() => Promise.all(document.getAnimations().filter((a) => a.effect?.getComputedTiming().endTime !== Infinity).map((a) => a.finished.catch(() => undefined))));
    const result = await new AxeBuilder({ page }).include(".pv-themer__sample").disableRules(["region"]).analyze();
    expect(result.violations.filter((v) => v.impact === "serious" || v.impact === "critical"), name).toEqual([]);
  }
});
