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
  });
});

test("soft themes lift the background and soften text", async ({ page }) => {
  const read = () =>
    page.evaluate(() => {
      const s = getComputedStyle(document.body);
      return { bg: s.backgroundColor, text: s.color, scheme: getComputedStyle(document.documentElement).colorScheme };
    });
  await open(page, "", { theme: "dark-soft" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark-soft");
  expect(await read()).toEqual({ bg: "rgb(30, 30, 30)", text: "rgb(229, 229, 229)", scheme: "dark" });
  await open(page, "", { theme: "light-soft" });
  expect(await read()).toEqual({ bg: "rgb(242, 242, 242)", text: "rgb(38, 38, 38)", scheme: "light" });
  await open(page, "", { theme: "dark" });
  expect(await read()).toEqual({ bg: "rgb(0, 0, 0)", text: "rgb(255, 255, 255)", scheme: "dark" });
});

test("a themed section inside another theme gets its own colours", async ({ page }) => {
  await open(page, "colors", { theme: "dark" });
  const bg = (name: string) => page.locator(`.pv-theme[data-theme="${name}"]`).evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(await bg("light-soft")).toBe("rgb(242, 242, 242)");
  expect(await bg("dark-soft")).toBe("rgb(30, 30, 30)");
  expect(await bg("light")).toBe("rgb(255, 255, 255)");
});

for (const theme of ["dark", "light", "dark-soft", "light-soft"] as const) {
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
