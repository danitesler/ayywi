import { existsSync, readFileSync } from "node:fs";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { expect, type Page, test } from "@playwright/test";
import { distFile as dist, open as openRoute } from "./helpers";

// Icon packs on a plain page: dist/ayywi.min.css plus an opt-in dist/icons/<pack>.css. Run `pnpm build` first.

// The inline glyph every built-in icon renders (iconSvg(Cancel01Icon, { name: "x" })).
const paths = Cancel01Icon.map(([tag, { key: _key, ...a }]) =>
  `<${tag} ${Object.entries(a).map(([k, v]) => `${k.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}="${v}"`).join(" ")}/>`,
).join("");
const icon = (cls = "") => `<svg class="ayy-icon ${cls}" data-ayy-icon="x" viewBox="0 0 24 24" fill="none" aria-hidden="true">${paths}</svg>`;

async function open(page: Page, { packs = ["hugeicons"], html = "", body = `<p style="color: rgb(200, 30, 60)">${icon()}</p>` } = {}) {
  const links = ["ayywi.min.css", ...packs.map((p) => `icons/${p}.css`)].map((f) => `<link rel="stylesheet" href="/smoke/${f}">`).join("");
  const doc = `<!doctype html><html lang="en" ${html}><head><meta charset="utf-8"><title>icons</title>${links}</head><body>${body}</body></html>`;
  await page.route("**/smoke/**", (r) => {
    const file = new URL(r.request().url()).pathname.replace("/smoke/", "");
    if (file === "index.html") return r.fulfill({ contentType: "text/html", body: doc });
    if (!existsSync(dist(file))) return r.fulfill({ status: 404, body: "" });
    return r.fulfill({ contentType: "text/css", body: readFileSync(dist(file), "utf8") });
  });
  await page.goto("/smoke/index.html");
  return page.locator("svg.ayy-icon").first();
}

const style = (el: import("@playwright/test").Locator, prop: string) => el.evaluate((e, p) => getComputedStyle(e).getPropertyValue(p), prop);

test("a pack masks built-in glyphs", async ({ page }) => {
  const svg = await open(page, { html: 'data-ayy-icons="hugeicons"' });
  expect(await style(svg, "mask-image")).toMatch(/^url\("data:image\/svg\+xml/);
  await expect(svg.locator("path")).toHaveCSS("display", "none");
  expect(await style(svg, "background-color")).toBe(await style(svg, "color"));
});

test("without the pack's CSS the inline glyph stays", async ({ page }) => {
  const svg = await open(page, { packs: [], html: 'data-ayy-icons="hugeicons"' });
  expect(await style(svg, "mask-image")).toBe("none");
  await expect(svg.locator("path")).not.toHaveCSS("display", "none");
});

test("masked icons follow forced colours", async ({ page }) => {
  await page.emulateMedia({ forcedColors: "active" });
  const svg = await open(page, { html: 'data-ayy-icons="hugeicons"' });
  const parent = await svg.evaluate((e) => getComputedStyle(e.parentElement!).color);
  expect(await style(svg, "background-color")).toBe(parent);
  // `none` would keep the author's red: currentColor under it isn't forced. preserve-parent-color takes the parent's forced colour.
  expect(await style(svg, "forced-color-adjust")).toBe("preserve-parent-color");
});

test("an unknown name under a pack keeps its inline glyph", async ({ page }) => {
  const body = `<p style="color: rgb(200, 30, 60)">${icon().replace('data-ayy-icon="x"', 'data-ayy-icon="not-a-glyph"')}</p>`;
  const svg = await open(page, { html: 'data-ayy-icons="hugeicons"', body });
  expect(await style(svg, "mask-image")).toBe("none");
  expect(await style(svg, "background-color")).toBe("rgba(0, 0, 0, 0)");
  await expect(svg.locator("path").first()).not.toHaveCSS("display", "none");
});

test("directional glyphs mirror under a pack", async ({ page }) => {
  const svg = await open(page, { html: 'dir="rtl" data-ayy-icons="hugeicons"', body: `<p>${icon("ayy-icon--directional")}</p>` });
  expect(await style(svg, "scale")).toBe("-1 1");
  expect(await style(svg, "mask-image")).toMatch(/^url\("data:image\/svg\+xml/);
});

test("the nearest data-ayy-icons wins", async ({ page }) => {
  const body = `<p>${icon()}</p><div data-ayy-icons="hugeicons"><p>${icon()}</p></div>`;
  const [outer, inner] = [page.locator("svg.ayy-icon").first(), page.locator("svg.ayy-icon").last()];
  await open(page, { packs: ["hugeicons", "lucide"], html: 'data-ayy-icons="lucide"', body });
  const [outerMask, innerMask] = [await style(outer, "mask-image"), await style(inner, "mask-image")];
  expect(outerMask).toMatch(/^url\("data:image\/svg\+xml/); // icons/lucide.css drew the outer icon
  expect(innerMask).toMatch(/^url\("data:image\/svg\+xml/);
  expect(innerMask).not.toBe(outerMask);
  // On a hugeicons-only page the same icon draws the same mask as the nested one.
  await open(page, { packs: ["hugeicons"], html: 'data-ayy-icons="hugeicons"' });
  expect(innerMask).toBe(await style(page.locator("svg.ayy-icon").first(), "mask-image"));
});

// The preview: the Themes page chooses the site's pack, and every built-in glyph follows it, even ones drawn later.
const masked = /^url\("data:image\/svg\+xml/;
const names = Object.keys(JSON.parse(readFileSync(new URL("../../tokens/icon-packs/hugeicons.json", import.meta.url), "utf8")).glyphs);
/** How many of the 194 names a pack leaves to Hugeicons. */
/** Gives the site a pack from the Themes page, for this tab: Default's settings with another pack, saved. */
async function sitePack(page: Page, pack: string) {
  await page.evaluate(() => (location.hash = "#/themes"));
  await page.getByRole("button", { name: "Customize Default", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Customize Default" });
  await dialog.getByLabel("Icons").selectOption(pack);
  await dialog.getByRole("button", { name: "Save" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-ayy-icons", pack);
}
const lacking = (pack: string) => Object.values(JSON.parse(readFileSync(new URL(`../../tokens/icon-packs/${pack}.json`, import.meta.url), "utf8")).glyphs).filter((v) => v === null).length;

test("choosing a pack on the Themes page switches every built-in icon, for this tab only", async ({ page }) => {
  await openRoute(page, "themes");
  await sitePack(page, "lucide");
  // The Icons page opens on the site's pack.
  await page.evaluate(() => (location.hash = "#/docs/icons"));
  await expect(page.getByRole("tablist", { name: "Pack" }).getByRole("tab", { name: "Lucide" })).toHaveAttribute("aria-selected", "true");
  const grid = page.locator(".pv-icon-packs__grid");
  await expect(grid.locator("[data-ayy-icon]")).toHaveCount(names.length);
  expect(await style(grid.locator('[data-ayy-icon="search"]'), "mask-image")).toMatch(masked);
  await page.reload();
  await expect(page.locator("html")).not.toHaveAttribute("data-ayy-icons", /.+/);
});

test("the Icons docs page shows every glyph in a pack, and marks the ones Hugeicons draws", async ({ page }) => {
  await openRoute(page, "docs/icons");
  await expect(page.getByRole("heading", { level: 1, name: "Icons", exact: true })).toBeVisible();
  const grid = page.locator(".pv-icon-packs__grid");
  await expect(grid.locator("[data-ayy-icon]")).toHaveCount(names.length);
  await page.getByRole("tablist", { name: "Pack" }).getByRole("tab", { name: "Feather" }).click();
  await expect(grid).toHaveAttribute("data-ayy-icons", "feather");
  expect(await style(grid.locator('[data-ayy-icon="search"]'), "mask-image")).toMatch(masked);
  expect(lacking("feather")).toBeGreaterThan(0);
  await expect(grid.locator(".ayy-badge")).toHaveCount(lacking("feather"));
  // Browsing a pack does not change the site's.
  await expect(page.locator("html")).not.toHaveAttribute("data-ayy-icons");
  // It is in the Docs sidebar, after Illustration.
  await expect(page.getByRole("navigation", { name: "Docs", exact: true }).getByRole("link", { name: "Icons", exact: true })).toHaveAttribute("aria-current", "page");
});

test("the settings dialog's live preview wears the pack being chosen, before Save", async ({ page }) => {
  await openRoute(page, "themes");
  await page.getByRole("button", { name: "Customize Default", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Customize Default" });
  const preview = dialog.locator(".pv-themer__stage");
  await expect(preview.locator("[data-ayy-icon]").first()).toBeVisible();
  await dialog.getByLabel("Icons").selectOption("feather");
  await expect(preview).toHaveAttribute("data-ayy-icons", "feather");
  // The small row of built-in icons, drawn by the pack.
  const row = preview.getByRole("group", { name: "Sample glyphs" }).locator("[data-ayy-icon]");
  expect(await row.count()).toBeGreaterThanOrEqual(4);
  for (const icon of await row.all()) expect(await style(icon, "mask-image")).toMatch(masked);
  const feather = await style(row.first(), "mask-image");
  // The site itself is untouched until Save.
  await expect(page.locator("html")).not.toHaveAttribute("data-ayy-icons");
  // Back to Hugeicons: the preview says so explicitly, and draws another mask.
  await dialog.getByLabel("Icons").selectOption("hugeicons");
  await expect(preview).toHaveAttribute("data-ayy-icons", "hugeicons");
  await expect.poll(() => style(row.first(), "mask-image")).not.toBe(feather);
});

test("icons drawn after load take the pack", async ({ page }) => {
  // The HTML renderer, so the chip below is drawn by <ayy-tag-input> (tagRemoveIcon), not React's <Icon name="x">.
  await openRoute(page, "components/toast", { renderer: "html" });
  await sitePack(page, "lucide");
  await page.evaluate(() => (location.hash = "#/components/toast"));
  await expect(page.locator("html")).toHaveAttribute("data-ayy-icons", "lucide");
  await page.evaluate(() => (window as unknown as { ayywi: { toast: { success: (m: string) => void } } }).ayywi.toast.success("Saved"));
  const check = page.locator(".ayy-toast", { hasText: "Saved" }).locator('[data-ayy-icon="circle-check"]');
  await expect(check).toBeVisible();
  expect(await style(check, "mask-image")).toMatch(masked);

  await page.evaluate(() => (location.hash = "#/components/tag-input"));
  await expect(page.locator("ayy-tag-input").first()).toBeAttached();
  const field = page.locator(":is(.pv-stage, .ayy-showcase__stage)").first();
  const input = field.getByRole("combobox", { name: "Tags" });
  await input.click();
  await input.pressSequentially("travel");
  await page.keyboard.press("Enter");
  const remove = field.locator('.ayy-tag-input__tag[data-value="travel"] [data-ayy-icon="x"]');
  await expect(remove).toHaveCount(1);
  expect(await style(remove, "mask-image")).toMatch(masked);
});

test("a preset that names a pack applies it, and Default puts Hugeicons back", async ({ page }) => {
  await openRoute(page, "themes");
  await page.locator(".pv-themer").getByRole("radio", { name: "Ember" }).check({ force: true });
  await expect(page.locator("html")).toHaveAttribute("data-ayy-icons", "lucide");
  await page.locator(".pv-themer").getByRole("radio", { name: "Default" }).check({ force: true });
  await expect(page.locator("html")).not.toHaveAttribute("data-ayy-icons", /.+/);
});

test("device-width examples take the pack inside their iframe", async ({ page }) => {
  await openRoute(page, "themes");
  await sitePack(page, "lucide");
  await page.evaluate(() => (location.hash = "#/components/top-bar"));
  const example = page.locator('[aria-labelledby="ex-detail"]');
  // The segment, not its radio: under a pack the masked device icon (a painted box) sits over the radio's centre.
  await example.locator("label", { has: page.getByRole("radio", { name: "Mobile" }) }).click();
  const frame = example.frameLocator(".pv-stage__iframe");
  await expect(frame.locator("html")).toHaveAttribute("data-ayy-icons", "lucide");
  const back = frame.locator('.ayy-top-bar [data-ayy-icon="chevron-left"]').first();
  await expect(back).toBeVisible();
  await expect.poll(() => style(back, "mask-image")).toMatch(masked);
});

// Every Hugeicons icon on the site carries a name, so app icons follow the pack too, not only the glyphs ayywi draws.
test("app icons in a component example follow the pack", async ({ page }) => {
  await openRoute(page, "themes");
  await sitePack(page, "feather");
  await page.evaluate(() => (location.hash = "#/components/list"));
  // The settings list draws its icons from data ({ icon: Notification01Icon, iconName: "bell" }).
  const bell = page.locator('.pv-stage [data-ayy-icon="bell"], .ayy-showcase__stage [data-ayy-icon="bell"]').first();
  await expect(bell).toBeVisible();
  expect(await style(bell, "mask-image")).toMatch(masked);
});
