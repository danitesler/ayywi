import { expect, test } from "@playwright/test";
import manifest from "../../manifest/components.json" with { type: "json" };
import { open } from "./helpers";

const slugs = manifest.components.map((c: { slug: string }) => c.slug);

for (const renderer of ["react", "html"] as const) {
  test(`every component page renders without errors (${renderer})`, async ({ page }) => {
    const errors = await open(page, "", { renderer });
    for (const slug of slugs) {
      await page.goto(`/#/${slug}`);
      await expect(page.locator(".pv-page__header h1")).toBeVisible();
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
  // The page opens on the no-code guide; the developer guide lists every component.
  await expect(page.getByRole("radio", { name: "I build with AI tools" })).toBeChecked();
  await expect(page.getByRole("button", { name: "Copy prompt", exact: true })).toBeVisible();
  await page.getByText("I'm a developer").click();
  await expect(page.locator(".pv-chip")).toHaveCount(slugs.length);
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
  for (const c of manifest.components as { name: string; category: string }[]) {
    await expect(nav.getByRole("list", { name: c.category, exact: true }).getByRole("link", { name: c.name, exact: true })).toBeVisible();
  }
});

test("a section link opens the page scrolled to that section", async ({ page }) => {
  await open(page, "colors/status");
  await expect(page.getByRole("heading", { level: 2, name: "Status", exact: true })).toBeInViewport();
  const nav = page.getByRole("navigation", { name: "Design system" });
  await expect(nav.getByRole("link", { name: "Colors", exact: true })).toHaveAttribute("aria-current", "page");
});

test("example code is one click away", async ({ page }) => {
  await open(page, "button");
  const code = page.locator(".pv-example").first().locator(".pv-code");
  await expect(code).toBeHidden();
  await page.locator(".pv-source__toggle").first().click();
  await expect(code).toBeVisible();
});

test("get started builds the prompt from the sentence and the tool", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await open(page, "");
  await page.getByText("Online store", { exact: true }).click();
  await expect(page.getByRole("textbox", { name: "What you're building" })).toHaveValue("online store");
  await page.getByRole("textbox", { name: "Who it's for" }).fill("a bakery in Lisbon");
  await page.getByText("ChatGPT or Claude").click();
  await page.getByRole("button", { name: "Copy prompt", exact: true }).click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toMatch(/^Build me an online store for a bakery in Lisbon\./);
  expect(copied).toContain("one self-contained HTML file");
  expect(copied).toContain("dist/ayywi.min.css");
  // The fonts and the saved theme come along, so the app looks like the examples from the first paint.
  expect(copied).toContain("dist/fonts.css");
  expect(copied).toContain("dist/theme-init.js");
  expect(copied).toContain("llms/table.md");
  expect(copied).not.toMatch(/127\.0\.0\.1|localhost/);
});

test("the site hosts each release's runtime files under v/<release>/; prompts from a local preview use the public site", async ({ page, context, baseURL }) => {
  // Served from a real host name (not localhost), the prompts point at this build's own v/<release>/ copies.
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await open(page, "");
  await page.getByText("ChatGPT or Claude").click();
  await page.getByRole("button", { name: "Copy prompt", exact: true }).click();
  const local = await page.evaluate(() => navigator.clipboard.readText());
  expect(local).not.toContain("/v/");
  const versions = await (await page.request.get(`${baseURL}/versions.json`)).json();
  const css = await page.request.get(`${baseURL}/v/${versions.latest}/dist/ayywi.min.css`);
  expect(css.ok()).toBe(true);
  expect(await css.text()).toContain(".ayy-button");
  for (const file of versions.versions[0].files) expect((await page.request.get(`${baseURL}/v/${versions.latest}/${file}`)).ok(), file).toBe(true);
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

  await box.fill("surface-raised"); // token names match
  await expect(nav.getByRole("link")).toHaveText(["Colors"]);

  await box.fill("forms"); // categories match
  await expect(nav.getByRole("link")).toHaveCount(manifest.components.filter((c: { category: string }) => c.category === "Forms").length);

  await box.fill("drawer"); // the side modal is a Dialog; the app shell opens its sidebar as one
  await expect(nav.getByRole("link")).toHaveText(["App shell", "Dialog"]);

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
  for (const route of ["", "get-started", "showcase", "showcase/dashboard", "colors", "typography", "spacing", "button", "table", "dialog", "navbar", "app-shell", "bottom-nav", "footer", "pagination", "steps", "page-header", "input-group", "segmented-control", "list", "empty-state", "accordion", "section", "toc", "carousel", "chat", "data-list"]) {
    await open(page, route);
    for (const dir of ["ltr", "rtl"]) {
      await page.evaluate((d) => document.documentElement.setAttribute("dir", d), dir);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `/#/${route} (${dir})`).toBeLessThanOrEqual(0);
    }
  }
});

test("on a phone the preview's sidebar is a drawer opened from the top bar", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page, "button");
  const toggle = page.getByRole("button", { name: "Open navigation" });
  const nav = page.getByRole("navigation", { name: "Design system" });
  await expect(nav).toBeHidden();
  await toggle.click();
  await expect(nav).toBeVisible();
  await nav.getByRole("link", { name: "Dialog", exact: true }).click();
  await expect(page).toHaveURL(/#\/dialog$/);
  await expect(nav).toBeHidden();
  await expect(page.locator(".pv-page h1")).toHaveText("Dialog");
});

const SHOWCASE = [
  { id: "dashboard", name: "Pulse", theme: "dark", density: "compact" },
  { id: "landing", name: "Northwind", theme: "light", density: "comfortable" },
  { id: "inbox", name: "Relay", theme: "dark-soft", density: "comfortable" },
  { id: "settings", name: "Ledger", theme: "light-gray", density: "touch" },
  { id: "tracker", name: "Orbit", theme: "light", density: "compact" },
  { id: "store", name: "Ember", theme: "dark", density: "comfortable" },
  { id: "booking", name: "Haven", theme: "light", density: "touch" },
];

test("what you can build: cards open a device preview", async ({ page }) => {
  const errors = await open(page, "showcase");
  await expect(page.getByRole("heading", { level: 1, name: "What you can build" })).toBeVisible();
  const cards = page.locator(".pv-showcase__card");
  await expect(cards).toHaveCount(SHOWCASE.length);

  await cards.filter({ hasText: "Relay" }).click();
  await expect(page).toHaveURL(/#\/showcase\/inbox$/);
  await expect(page.getByRole("heading", { level: 1, name: "Relay" })).toBeVisible();

  const frame = page.locator(".pv-device iframe");
  const device = page.getByRole("group", { name: "Device" });
  for (const [label, width] of [["Tablet", 834], ["Mobile", 390], ["Desktop", 1280]] as const) {
    await device.getByRole("button", { name: label }).click();
    await expect(device.getByRole("button", { name: label })).toHaveAttribute("aria-pressed", "true");
    await expect(frame).toHaveCSS("width", `${width}px`);
  }
  expect(errors).toEqual([]);
});

test("each showcase app renders in its own theme and density, and fits a phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const app of SHOWCASE) {
    await page.goto(`/?app=${app.id}`);
    await expect(page.locator(".pv-frame .pv-app")).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("data-theme", app.theme);
    await expect(page.locator("html")).toHaveAttribute("data-density", app.density);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, app.id).toBeLessThanOrEqual(0);
    if (app.id === "landing" || app.id === "store") {
      // A website: the navbar's links fold into a menu.
      await expect(page.getByRole("button", { name: "Menu" })).toBeVisible();
    } else {
      // An app: the same frame everywhere — tabs at the bottom, no navbar, the sidebar tucked away.
      await expect(page.locator(".ayy-bottom-nav"), app.id).toBeVisible();
      await expect(page.locator(".ayy-app-shell__sidebar"), app.id).toBeHidden();
      await expect(page.locator(".ayy-navbar"), app.id).toHaveCount(0);
      await expect(page.locator(".ayy-page-header, .pv-app-inbox"), app.id).not.toHaveCount(0);
    }
  }
});
