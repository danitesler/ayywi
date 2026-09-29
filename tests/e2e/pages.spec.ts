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

const FOUNDATIONS = { colors: "Colors", typography: "Typography", spacing: "Spacing & sizing", elevation: "Radius & elevation", motion: "Motion" };

test("overview and foundation pages render", async ({ page }) => {
  const errors = await open(page, "");
  await expect(page.locator(".pv-card-link")).toHaveCount(slugs.length);
  for (const [route, title] of Object.entries(FOUNDATIONS)) {
    await page.goto(`/#/${route}`);
    await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
  }
  await page.goto("/#/colors");
  await expect(page.locator(".pv-theme")).toHaveCount(4);
  for (const category of manifest.tokens.map((t: { category?: string }) => t.category).filter(Boolean)) {
    await expect(page.getByRole("heading", { level: 2, name: category, exact: true })).toBeVisible();
  }
  await page.goto("/#/tokens"); // old link
  await expect(page.getByRole("heading", { level: 1, name: "Colors" })).toBeVisible();
  expect(errors).toEqual([]);
});

test("sidebar groups every component under its category", async ({ page }) => {
  await open(page, "");
  const nav = page.getByRole("navigation", { name: "Design system" });
  for (const title of Object.values(FOUNDATIONS)) {
    await expect(nav.getByRole("list", { name: "Foundations" }).getByRole("link", { name: title, exact: true })).toBeVisible();
  }
  const colorCategories = [...new Set(manifest.tokens.flatMap((t: { category?: string }) => (t.category ? [t.category] : [])))];
  await expect(nav.getByRole("list", { name: "Colors sections" }).getByRole("link")).toHaveText(["Themes", ...colorCategories, "Accents", "Palette"]);
  for (const c of manifest.components as { name: string; category: string }[]) {
    await expect(nav.getByRole("list", { name: c.category, exact: true }).getByRole("link", { name: c.name, exact: true })).toBeVisible();
  }
});

test("colour categories in the sidebar jump to their section", async ({ page }) => {
  await open(page, "");
  const nav = page.getByRole("navigation", { name: "Design system" });
  await nav.getByRole("link", { name: "Status", exact: true }).click();
  await expect(page).toHaveURL(/#\/colors\/status$/);
  const heading = page.getByRole("heading", { level: 2, name: "Status", exact: true });
  await expect(heading).toBeInViewport();
  await expect(nav.getByRole("link", { name: "Status", exact: true })).toHaveAttribute("aria-current", "location");
  await expect(nav.getByRole("link", { name: "Colors", exact: true })).toHaveAttribute("aria-current", "page");
  // The heading clears the sticky toolbar.
  const toolbar = (await page.locator(".pv-toolbar").boundingBox())!;
  expect((await heading.boundingBox())!.y).toBeGreaterThanOrEqual(toolbar.y + toolbar.height);
});

test("search filters the sidebar and jumps to a result", async ({ page }) => {
  await open(page, "");
  const nav = page.getByRole("navigation", { name: "Design system" });
  const box = page.getByRole("searchbox", { name: "Search components and foundations" });

  await page.locator("body").press("/");
  await expect(box).toBeFocused();

  await box.fill("ayy-menu__item"); // class names match
  await expect(nav.getByRole("link")).toHaveText(["Dropdown menu"]);
  await expect(page.getByRole("status")).toHaveText("1 result");

  await box.fill("surface-raised"); // token names match, down to the colour category
  await expect(nav.getByRole("link")).toHaveText(["Colors", "Surfaces"]);

  await box.fill("forms"); // categories match
  await expect(nav.getByRole("link")).toHaveCount(7);

  await box.fill("zzzz");
  await expect(nav).toContainText("No matches");

  await box.fill("dialog");
  await box.press("Enter");
  await expect(page).toHaveURL(/#\/dialog$/);
  await expect(page.getByRole("heading", { level: 1, name: "Dialog" })).toBeVisible();

  await box.press("Escape");
  await expect(box).toHaveValue("");
  await expect(nav.getByRole("link", { name: "Button", exact: true })).toBeVisible();
});

test("nothing overflows horizontally on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["", "colors", "button", "table", "dialog", "navbar", "section", "toc", "carousel", "chat", "data-list"]) {
    await open(page, route);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `/#/${route}`).toBeLessThanOrEqual(0);
  }
});
