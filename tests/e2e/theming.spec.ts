import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import manifest from "../../manifest/components.json" with { type: "json" };
import { open, rtl, settle, stage } from "./helpers";

const slugs = manifest.components.map((c: { slug: string }) => c.slug);

test("density changes control heights", async ({ page }) => {
  const heights: Record<string, number> = {};
  for (const density of ["compact", "comfortable", "touch"] as const) {
    await open(page, "button", { density });
    await expect(page.locator("html")).toHaveAttribute("data-density", density);
    heights[density] = (await stage(page).locator(".ayy-button").first().boundingBox())!.height;
  }
  expect(heights.compact).toBeLessThan(heights.comfortable);
  expect(heights.comfortable).toBeLessThan(heights.touch);
  expect(heights.touch).toBeGreaterThanOrEqual(40);
});

test("coarse pointers get touch sizes when density is unset", async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await open(page, "button");
  const h = (await stage(page).locator(".ayy-button").first().boundingBox())!.height;
  expect(h).toBeGreaterThanOrEqual(40);
  await context.close();
});

test("brand swaps the primary colour in both themes", async ({ page }) => {
  const primary = () => stage(page).locator(".ayy-button").first().evaluate((el) => getComputedStyle(el).backgroundColor);
  await open(page, "button", { theme: "dark" });
  const plainDark = await primary();
  await open(page, "button", { theme: "dark", brand: "violet" });
  const violetDark = await primary();
  await open(page, "button", { theme: "light", brand: "violet" });
  const violetLight = await primary();
  expect(violetDark).not.toBe(plainDark);
  expect(violetLight).not.toBe(violetDark);
});

test("RTL flips logical layout", async ({ page }) => {
  await open(page, "popover", { renderer: "html" });
  await rtl(stage(page));
  const trigger = stage(page).getByRole("button", { name: "Share" });
  await trigger.click();
  const pop = page.getByRole("dialog", { name: "Share this project" });
  await expect(pop).toBeVisible();
  await settle(pop);
  const t = (await trigger.boundingBox())!;
  const p = (await pop.boundingBox())!;
  // align="start" in RTL: right edges line up.
  expect(Math.abs(p.x + p.width - (t.x + t.width))).toBeLessThan(2);

  await open(page, "switch");
  await rtl(stage(page));
  const sw = stage(page).getByRole("switch", { name: "Sync on save" });
  const label = stage(page).getByText("Sync on save");
  expect((await label.boundingBox())!.x).toBeLessThan((await sw.boundingBox())!.x);
});

test("carousel pages towards the inline end in RTL", async ({ page }) => {
  await open(page, "carousel", { renderer: "html" });
  await rtl(stage(page));
  const track = stage(page).locator(".ayy-carousel__track");
  await stage(page).getByRole("button", { name: "Next" }).click();
  await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeLessThan(-100);
});

test("app shell: sidebar and main scroll on their own, the sidebar follows the inline start and stacks on phones", async ({ page }) => {
  for (const renderer of ["react", "html"] as const) {
    await open(page, "app-shell", { renderer });
    const shell = stage(page).locator(".ayy-app-shell");
    const sidebar = shell.locator(".ayy-app-shell__sidebar");
    const main = shell.locator(".ayy-app-shell__main");
    const footer = shell.locator(".ayy-app-shell__footer");
    const box = async (l: typeof shell) => (await l.boundingBox())!;

    // Tall content scrolls inside main; the shell keeps its height and the sidebar stays put.
    const shellHeight = (await box(shell)).height;
    await main.evaluate((el) => el.append(Object.assign(document.createElement("div"), { style: "block-size: 1200px" })));
    expect(await main.evaluate((el) => el.scrollHeight > el.clientHeight)).toBe(true);
    expect((await box(shell)).height).toBe(shellHeight);
    expect((await box(sidebar)).height).toBe(shellHeight);
    // The footer is pinned to the bottom of the sidebar.
    expect((await box(sidebar)).y + (await box(sidebar)).height - ((await box(footer)).y + (await box(footer)).height)).toBeLessThan(16);

    // The current link is marked by more than colour: weight, and an accent bar.
    const current = shell.locator('.ayy-app-shell__link[aria-current="page"]');
    const other = shell.locator(".ayy-app-shell__nav .ayy-app-shell__link:not([aria-current])").first();
    const weight = (l: typeof current) => l.evaluate((el) => Number(getComputedStyle(el).fontWeight));
    expect(await weight(current)).toBeGreaterThan(await weight(other));
    expect(await current.evaluate((el) => getComputedStyle(el, "::before").content)).toBe('""');

    // Sidebar at the inline start: left in LTR, right in RTL.
    expect((await box(sidebar)).x).toBeLessThan((await box(main)).x);
    await rtl(stage(page));
    expect((await box(sidebar)).x).toBeGreaterThan((await box(main)).x);
    await stage(page).evaluate((el) => el.removeAttribute("dir"));

    // On a phone the sidebar stacks above main, and the nav becomes a row.
    await page.setViewportSize({ width: 390, height: 800 });
    expect((await box(sidebar)).y + (await box(sidebar)).height).toBeLessThanOrEqual((await box(main)).y + 1);
    expect((await box(sidebar)).width).toBeCloseTo((await box(shell)).width, 0);
    const links = await shell.locator(".ayy-app-shell__nav .ayy-app-shell__link").all();
    expect((await box(links[0])).y).toBe((await box(links[1])).y);
    await page.setViewportSize({ width: 1280, height: 720 });
  }
});

test("accent text is darker on light themes than the raw accent", async ({ page }) => {
  const colors = async () =>
    stage(page, 1)
      .locator(".ayy-section__number")
      .evaluate((el) => [getComputedStyle(el).color, getComputedStyle(el.closest(".ayy-section")!).getPropertyValue("--ayy-spot")]);
  await open(page, "section", { renderer: "html", theme: "dark" });
  const [dark] = await colors();
  await open(page, "section", { renderer: "html", theme: "light" });
  const [light] = await colors();
  expect(dark).toBe("rgb(91, 157, 255)"); // --ayy-accent-product, raw
  expect(light).not.toBe(dark);
});

test.describe("forced colors (Windows High Contrast)", () => {

  test("stateful parts keep a visible state", async ({ page }) => {
    await page.emulateMedia({ forcedColors: "active" });
    await open(page, "switch");
    const on = stage(page).getByRole("switch", { name: "Sync on save" });
    const off = stage(page).getByRole("switch", { name: "Share anonymous usage" });
    const bg = (l: typeof on) => l.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(await bg(on)).not.toBe(await bg(off));

    await page.goto("/#/progress");
    const bar = stage(page).locator(".ayy-progress__bar").first();
    const track = stage(page).locator(".ayy-progress").first();
    expect(await bar.evaluate((el) => getComputedStyle(el).backgroundColor)).not.toBe(
      await track.evaluate((el) => getComputedStyle(el).backgroundColor),
    );

    await page.goto("/#/tabs");
    const selected = stage(page).getByRole("tab", { selected: true });
    const other = stage(page).getByRole("tab", { name: "Activity" });
    const look = (l: typeof selected) =>
      l.evaluate((el) => {
        const s = getComputedStyle(el);
        return `${s.backgroundColor}|${s.color}|${s.borderBlockEndColor}|${s.outlineStyle}`;
      });
    expect(await look(selected)).not.toBe(await look(other));

    // The current app shell link is filled with the system highlight; the others stay transparent.
    await page.goto("/#/app-shell");
    const current = stage(page).locator('.ayy-app-shell__link[aria-current="page"]');
    const plain = stage(page).locator(".ayy-app-shell__nav .ayy-app-shell__link:not([aria-current])").first();
    const fill = (l: typeof current) => l.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(await fill(current)).not.toBe(await fill(plain));

    // Only one of the theme toggle's two stacked icons shows.
    await page.goto("/#/theme-toggle");
    const icons = await stage(page)
      .locator(".ayy-theme-toggle svg")
      .evaluateAll((svgs) => svgs.map((s) => getComputedStyle(s).color === "rgba(0, 0, 0, 0)"));
    expect(icons.sort()).toEqual([false, true]);
  });
});

test("dark-soft softens the contrast, light-gray greys the page under white cards", async ({ page }) => {
  const read = () =>
    page.evaluate(() => {
      const s = getComputedStyle(document.body);
      return { bg: s.backgroundColor, text: s.color, scheme: getComputedStyle(document.documentElement).colorScheme };
    });
  await open(page, "", { theme: "dark-soft" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark-soft");
  expect(await read()).toEqual({ bg: "rgb(30, 30, 30)", text: "rgb(229, 229, 229)", scheme: "dark" });
  await open(page, "", { theme: "light-gray" });
  expect(await read()).toEqual({ bg: "rgb(235, 235, 235)", text: "rgb(10, 10, 10)", scheme: "light" });
  expect(await page.locator(".ayy-card").first().evaluate((el) => getComputedStyle(el).backgroundColor)).toBe("rgb(255, 255, 255)");
  await open(page, "", { theme: "dark" });
  expect(await read()).toEqual({ bg: "rgb(0, 0, 0)", text: "rgb(255, 255, 255)", scheme: "dark" });
});

test("a themed section inside another theme gets its own colours", async ({ page }) => {
  await open(page, "colors", { theme: "dark" });
  const bg = (name: string) => page.locator(`.pv-theme[data-theme="${name}"]`).evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(await bg("light-gray")).toBe("rgb(235, 235, 235)");
  expect(await bg("dark-soft")).toBe("rgb(30, 30, 30)");
  expect(await bg("light")).toBe("rgb(255, 255, 255)");
});

for (const theme of ["dark", "light", "dark-soft", "light-gray"] as const) {
  test(`axe: no serious violations on any page (${theme})`, async ({ page }) => {
    test.setTimeout(180_000);
    await open(page, "", { theme });
    const failures: string[] = [];
    // Component examples, then whole pages (sidebar, search, toolbar and the foundation pages' theme tables).
    const targets: [string, string][] = [
      ...slugs.map((slug: string): [string, string] => [slug, ".pv-stage"]),
      ...["", "colors", "typography", "spacing", "elevation", "motion"].map((r): [string, string] => [r, ".pv-shell"]),
    ];
    for (const [route, scope] of targets) {
      await page.goto(`/#/${route}`);
      await expect(page.locator("h1")).toBeVisible();
      const results = await new AxeBuilder({ page })
        .include(scope)
        .disableRules(["region"]) // examples are fragments, not full pages
        .analyze();
      for (const v of results.violations.filter((v) => v.impact === "serious" || v.impact === "critical")) {
        failures.push(`${route || "overview"}: ${v.id} — ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
      }
    }
    expect(failures).toEqual([]);
  });
}
