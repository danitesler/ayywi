import { expect, test } from "@playwright/test";
import manifest from "../../manifest/components.json" with { type: "json" };
import { open } from "./helpers";

const slugs = manifest.components.map((c: { slug: string }) => c.slug);

for (const renderer of ["react", "html"] as const) {
  test(`every component page renders without errors (${renderer})`, async ({ page }) => {
    const errors = await open(page, "", { renderer });
    for (const slug of slugs) {
      await page.goto(`/#/${slug}`);
      await expect(page.locator("h1")).toBeVisible();
      const stages = page.locator(".pv-stage");
      expect(await stages.count(), slug).toBeGreaterThan(0);
      for (const s of await stages.all()) {
        expect(await s.locator(".pv-stage__inner > *").count(), `${slug} stage is empty`).toBeGreaterThan(0);
      }
    }
    expect(errors).toEqual([]);
  });
}

test("overview and tokens pages render", async ({ page }) => {
  const errors = await open(page, "");
  await expect(page.locator(".pv-card-link")).toHaveCount(slugs.length);
  await page.goto("/#/tokens");
  await expect(page.getByRole("heading", { name: "Palette" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Density" })).toBeVisible();
  expect(errors).toEqual([]);
});

test("nothing overflows horizontally on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["", "tokens", "button", "table", "dialog"]) {
    await open(page, route);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `/#/${route}`).toBeLessThanOrEqual(0);
  }
});
