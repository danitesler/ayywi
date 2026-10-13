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
  // One flow: the sentence, the tool, the prompt; the codebase setup sits under it.
  await expect(page.getByRole("button", { name: "Copy prompt", exact: true })).toBeVisible();
  await page.getByRole("radiogroup", { name: "Pick your AI tool:" }).getByText("Cursor", { exact: true }).click();
  await expect(page.getByRole("radio", { name: "Cursor" })).toBeChecked();
  await expect(page.getByText(".cursor/rules/ayywi.mdc")).toBeVisible();
  await page.getByRole("tab", { name: "No build (CDN)" }).click();
  await expect(page.getByRole("button", { name: "Copy setup prompt" })).toBeVisible();
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
  await page.locator(".pv-example").first().getByRole("button", { name: "Copy for..." }).click();
  await expect(code).toBeVisible();
  await expect(page.getByRole("tab", { name: "AI prompt" })).toHaveAttribute("aria-selected", "true");
  await expect(code).toContainText("Build a Button component");
});

test("get started builds the prompt from the sentence and the tool", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await open(page, "");
  // A Select: ayywi's own options list opens under it.
  await page.getByLabel("What you're building").click();
  await page.getByRole("listbox", { name: "What you're building" }).getByRole("option", { name: "online store" }).click();
  await expect(page.locator(".pv-madlib")).toContainText("Build me an");
  await page.getByRole("combobox", { name: "Who it's for" }).fill("a bakery in Lisbon");
  await page.getByRole("button", { name: "Copy prompt", exact: true }).click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toMatch(/^Build me an online store for a bakery in Lisbon\./);
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
  await page.getByRole("radio", { name: "ChatGPT" }).check();
  await page.getByRole("button", { name: "Copy prompt", exact: true }).click();
  const local = await page.evaluate(() => navigator.clipboard.readText());
  expect(local).not.toContain("/v/");
  const versions = await (await page.request.get(`${baseURL}/versions.json`)).json();
  const css = await page.request.get(`${baseURL}/v/${versions.latest}/dist/ayywi.min.css`);
  expect(css.ok()).toBe(true);
  expect(await css.text()).toContain(".ayy-button");
  for (const file of versions.versions[0].files) expect((await page.request.get(`${baseURL}/v/${versions.latest}/${file}`)).ok(), file).toBe(true);
});

test("search bar opens command palette, filters results and jumps to a page", async ({ page }) => {
  await open(page, "");
  const dialog = page.locator(".ayy-dialog.ayy-command");
  const box = dialog.getByRole("combobox", { name: "Search components and foundations" });

  // Mod+E opens command palette
  const isMac = await page.evaluate(() => /mac|iphone|ipad|ipod/i.test(navigator.userAgent));
  await page.keyboard.press(isMac ? "Meta+e" : "Control+e");
  await expect(dialog).toBeVisible();
  await expect(box).toBeFocused();

  await box.fill("ayy-menu__item"); // class names match via keywords
  await expect(dialog.getByRole("option", { name: /Dropdown menu/ })).toBeVisible();

  await box.fill("surface-raised"); // token names match via keywords
  await expect(dialog.getByRole("option", { name: /Colors/ })).toBeVisible();

  await box.fill("dialog");
  await dialog.getByRole("option", { name: /^Dialog/ }).click();
  await expect(page).toHaveURL(/#\/dialog$/);
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("heading", { level: 1, name: "Dialog" })).toBeVisible();

  // Sidebar automatically scrolled to Dialog
  const sidebar = page.locator(".pv-sidebar");
  const dialogLink = page.locator('#pv-nav [data-route="dialog"]');
  await expect(dialogLink).toHaveAttribute("aria-current", "page");
  await expect(async () => {
    const linkBox = (await dialogLink.boundingBox())!;
    const sidebarBox = (await sidebar.boundingBox())!;
    expect(linkBox.y).toBeGreaterThanOrEqual(sidebarBox.y);
    expect(linkBox.y + linkBox.height).toBeLessThanOrEqual(sidebarBox.y + sidebarBox.height);
  }).toPass();

  // Clicking search bar in sidebar opens command palette
  await page.locator(".pv-sidebar__top .ayy-search-bar").click();
  await expect(dialog).toBeVisible();
  await box.fill("tooltip");
  await dialog.getByRole("option", { name: /^Tooltip/ }).click();
  await expect(page).toHaveURL(/#\/tooltip$/);
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("heading", { level: 1, name: "Tooltip" })).toBeVisible();

  const tooltipLink = page.locator('#pv-nav [data-route="tooltip"]');
  await expect(tooltipLink).toHaveAttribute("aria-current", "page");
  await expect(async () => {
    const linkBox = (await tooltipLink.boundingBox())!;
    const sidebarBox = (await sidebar.boundingBox())!;
    expect(linkBox.y).toBeGreaterThanOrEqual(sidebarBox.y);
    expect(linkBox.y + linkBox.height).toBeLessThanOrEqual(sidebarBox.y + sidebarBox.height);
  }).toPass();

  // Pressing Escape closes command palette
  await page.locator(".pv-sidebar__top .ayy-search-bar").click();
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("nothing overflows horizontally on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["", "get-started", "showcase", "showcase/dashboard", "colors", "typography", "spacing", "button", "table", "dialog", "navbar", "app-shell", "bottom-nav", "footer", "pagination", "steps", "page-header", "input-group", "segmented-control", "list", "empty-state", "accordion", "toc", "carousel", "chat"]) {
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
  { id: "inbox", name: "Relay", theme: "dark-contrast", density: "comfortable" },
  { id: "settings", name: "Ledger", theme: "light-gray", density: "touch" },
  { id: "tracker", name: "Orbit", theme: "light", density: "compact" },
  { id: "store", name: "Ember", theme: "dark", density: "comfortable" },
  { id: "booking", name: "Haven", theme: "light", density: "touch" },
];

test("the docs sidebar collapses to a rail, previews on hover, and remembers it", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await open(page, "app-shell");
  const shell = page.locator(".pv-shell");
  const sidebar = page.locator(".pv-sidebar");
  await page.locator(".pv-sidebar__toggle").click();
  await expect(shell).toHaveClass(/ayy-app-shell--collapsed/);
  await page.locator(".pv-content").hover();
  await expect.poll(async () => Math.round((await sidebar.boundingBox())!.width)).toBeLessThan(70);
  // The rail: the toggle and a search button. The nav's links (no icons) are out of the way.
  await expect(sidebar.getByRole("button", { name: "Search", exact: true })).toBeVisible();
  await expect(sidebar.getByRole("link", { name: "Button", exact: true })).toBeHidden();
  // The App shell examples on the page keep their own sidebars.
  expect(Math.round((await page.locator(".pv-content .ayy-app-shell:not(.ayy-app-shell--collapsed) > .ayy-app-shell__sidebar").first().boundingBox())!.width)).toBe(240);

  await sidebar.hover({ position: { x: 30, y: 400 } });
  await expect.poll(async () => Math.round((await sidebar.boundingBox())!.width)).toBe(256);
  await expect(sidebar.getByRole("link", { name: "Button", exact: true })).toBeVisible();
  await page.locator(".pv-content").hover({ position: { x: 600, y: 300 } });
  await expect.poll(async () => Math.round((await sidebar.boundingBox())!.width)).toBeLessThan(70);

  await page.reload();
  await expect(shell).toHaveClass(/ayy-app-shell--collapsed/);
  await page.locator(".pv-sidebar__toggle").click();
  await expect(shell).not.toHaveClass(/ayy-app-shell--collapsed/);
});

test("the docs sidebar's preview stays on top of the page while it closes, and its rail has no dividers", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await open(page, "");
  await page.locator(".pv-sidebar__toggle").click();
  const sidebar = page.locator(".pv-sidebar");
  await page.locator(".pv-content").hover({ position: { x: 600, y: 300 } });
  await expect.poll(async () => Math.round((await sidebar.boundingBox())!.width)).toBeLessThan(70);
  // In the rail, the groups' dividers are gone with their labels.
  const dividers = await sidebar.locator(".ayy-app-shell__group + .ayy-app-shell__group").evaluateAll((els) => els.map((el) => getComputedStyle(el).borderBlockStartColor));
  expect(dividers.every((c) => c === "rgba(0, 0, 0, 0)")).toBe(true);

  // The example app cards (a carousel of positioned, spotlit cards) in view, beside the sidebar.
  await page.locator(".pv-examples").scrollIntoViewIfNeeded();
  const cards = (await page.locator(".pv-examples").boundingBox())!;
  await sidebar.hover({ position: { x: 30, y: Math.round(cards.y + cards.height / 2) } });
  await expect.poll(async () => Math.round((await sidebar.boundingBox())!.width)).toBe(256);
  // A long transition, so a busy machine still samples it mid-way.
  await page.locator(".pv-shell").evaluate((el) => el.style.setProperty("--ayy-duration-base", "1500ms"));
  await page.mouse.move(1200, Math.round(cards.y + cards.height / 2));
  // Sample while it narrows: it keeps the overlay's z-index (so the cards never paint over it), and what's painted just
  // inside its edge is the sidebar.
  const samples = await sidebar.evaluate(async (el) => {
    const seen: { width: number; z: string; onTop: boolean }[] = [];
    const start = performance.now();
    while (performance.now() - start < 2500) {
      const r = el.getBoundingClientRect();
      seen.push({ width: r.width, z: getComputedStyle(el).zIndex, onTop: el.contains(document.elementFromPoint(r.right - 6, r.top + r.height / 2)) });
      await new Promise((done) => requestAnimationFrame(done));
    }
    return seen;
  });
  const narrowing = samples.filter((s) => s.width > 70 && s.width < 250);
  expect(narrowing.length).toBeGreaterThan(2);
  expect(narrowing.every((s) => Number(s.z) > 0 && s.onTop)).toBe(true);
  expect(samples.at(-1)!.width).toBeLessThan(70);
});

test("what you can build: cards open a device preview", async ({ page }) => {
  const errors = await open(page, "showcase");
  await expect(page.getByRole("heading", { level: 1, name: "What you can build" })).toBeVisible();
  const cards = page.locator(".pv-showcase__card");
  await expect(cards).toHaveCount(SHOWCASE.length);

  await cards.filter({ hasText: "Relay" }).click();
  await expect(page).toHaveURL(/#\/showcase\/inbox$/);
  await expect(page.getByRole("heading", { level: 1, name: "Relay" })).toBeVisible();

  const frame = page.locator(".pv-device iframe");
  const device = page.getByRole("radiogroup", { name: "Device" });
  for (const [label, width] of [["Tablet", 834], ["Mobile", 390], ["Desktop", 1280]] as const) {
    await device.getByText(label, { exact: true }).click();
    await expect(device.getByRole("radio", { name: label })).toBeChecked();
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
      await expect(page.locator(".pv-app > .ayy-app-shell__sidebar"), app.id).toBeHidden();
      await expect(page.locator(".ayy-navbar"), app.id).toHaveCount(0);
      await expect(page.locator(".ayy-page-header, .pv-app-inbox"), app.id).not.toHaveCount(0);
    }
  }
});

test("each app opens its own settings in a near-full-screen dialog", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  for (const app of SHOWCASE.filter((a) => a.id !== "landing" && a.id !== "store")) {
    await page.goto(`/?app=${app.id}`);
    await expect(page.locator(".pv-frame .pv-app")).toBeVisible();
    const dialog = page.getByRole("dialog", { name: "Settings" });
    // Ledger is about its settings, so they're open on load.
    if (app.id !== "settings") {
      await expect(dialog).toBeHidden();
      await page.locator(".pv-app > .ayy-app-shell__sidebar").getByRole("link", { name: "Settings" }).click();
    }
    await expect(dialog, app.id).toBeVisible();
    await expect(dialog).toHaveClass(/ayy-dialog--full/);
    const links = dialog.getByRole("navigation", { name: "Settings" }).getByRole("link");
    expect(await links.count(), app.id).toBeGreaterThanOrEqual(4);
    await expect(links.first()).toHaveAttribute("aria-current", "page");
    await expect(dialog.getByRole("heading", { level: 1 })).toHaveText(await links.first().innerText());
    await links.nth(1).click();
    await expect(links.nth(1)).toHaveAttribute("aria-current", "page");
    await expect(dialog.getByRole("heading", { level: 1 })).toHaveText(await links.nth(1).innerText());
    await page.keyboard.press("Escape");
    await expect(dialog, app.id).toBeHidden();
  }
});

test("on a phone, an app's settings fill the screen: the section list, then a section", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?app=inbox");
  await page.locator(".ayy-app-shell__bar").getByRole("button", { name: "Settings" }).click();
  const dialog = page.getByRole("dialog", { name: "Settings" });
  await expect(dialog).toBeVisible();
  await expect.poll(() => dialog.evaluate((el) => getComputedStyle(el).transform)).toBe("none");
  expect(Math.round((await dialog.boundingBox())!.width)).toBe(390);
  const list = dialog.locator(".ayy-app-shell__sidebar");
  await expect(list).toBeVisible();
  await list.getByRole("link", { name: "AI assistant" }).click();
  await expect(list).toBeHidden();
  await expect(dialog.getByRole("heading", { level: 1, name: "AI assistant" })).toBeVisible();
  await dialog.getByRole("button", { name: "Settings" }).click();
  await expect(list).toBeVisible();
  await expect(list.getByRole("link", { name: "AI assistant" })).toBeFocused();
});
