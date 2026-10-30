import { expect, test } from "@playwright/test";
import manifest from "../../manifest/components.json" with { type: "json" };
import { examplesLoaded, open } from "./helpers";

const slugs = manifest.components.map((c: { slug: string }) => c.slug);

for (const renderer of ["react", "html"] as const) {
  test(`every component page renders without errors (${renderer})`, async ({ page }) => {
    const errors = await open(page, "", { renderer });
    for (const slug of slugs) {
      await page.goto(`/#/components/${slug}`);
      await expect(page.locator(".pv-page__header h1")).toBeVisible();
      await examplesLoaded(page);
      const stages = page.locator(":is(.pv-stage, .ayy-showcase__stage)");
      expect(await stages.count(), slug).toBeGreaterThan(0);
      for (const s of await stages.all()) {
        expect(await s.locator(":is(.pv-stage__inner, .ayy-showcase__body) > *").count(), `${slug} stage is empty`).toBeGreaterThan(0);
      }
    }
    expect(errors).toEqual([]);
  });
}

const FOUNDATIONS = { density: "Density", colors: "Colors", typography: "Typography", spacing: "Spacing & sizing", elevation: "Radius & elevation", motion: "Motion", illustration: "Illustration", icons: "Icons" };

test("get started and foundation pages render under Docs", async ({ page }) => {
  const errors = await open(page, "docs/get-started");
  // One flow: the quick-start prompt; the codebase setup sits under it.
  await expect(page.getByRole("button", { name: "Copy prompt", exact: true })).toBeVisible();
  await page.getByRole("tab", { name: "No build (CDN)" }).click();
  await expect(page.getByRole("button", { name: "Copy setup prompt" })).toBeVisible();
  for (const [route, title] of Object.entries(FOUNDATIONS)) {
    await page.goto(`/#/docs/${route}`);
    await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
  }
  await page.goto("/#/docs/colors");
  await expect(page.locator(".pv-theme")).toHaveCount(4);
  for (const category of manifest.tokens.map((t: { category?: string }) => t.category).filter(Boolean)) {
    await expect(page.getByRole("heading", { level: 2, name: category, exact: true })).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test("the home page's agent setup switches between the four ways in, at one height", async ({ page }) => {
  const errors = await open(page, "");
  const block = page.locator(".pv-agent-setup");
  await expect(block.getByRole("tab", { name: "Quick start" })).toHaveAttribute("aria-selected", "true");
  const height = () => block.locator(".pv-code").evaluate((el) => el.getBoundingClientRect().height);
  expect(await height()).toBe(320);
  for (const [name, copy] of [
    ["npm package", "Copy prompt"],
    ["No build", "Copy prompt"],
    ["By hand", "Copy"],
  ]) {
    await block.getByRole("tab", { name, exact: true }).click();
    await expect(block.getByRole("tab", { name, exact: true })).toHaveAttribute("aria-selected", "true");
    await expect(block.getByRole("button", { name: copy, exact: true })).toBeVisible();
    expect(await height(), name).toBe(320);
  }
  expect(errors).toEqual([]);
});

test("links from before the header tabs land on the same page", async ({ page }) => {
  await open(page, "");
  for (const [old, now, title] of [
    ["tokens", "docs/colors", "Colors"],
    ["colors", "docs/colors", "Colors"],
    ["get-started", "docs/get-started", "Get started"],
    ["changelog", "docs/changelog", "Changelog"],
    ["principles", "docs/principles", "Principles"],
    ["button", "components/button", "Button"],
    ["dialog", "components/dialog", "Dialog"],
    ["brand", "themes", "Themes"],
    ["apps", "examples", "Examples"],
    ["apps/inbox", "examples/dating", "Dating app"],
    ["examples/inbox", "examples/dating", "Dating app"],
    ["showcase", "examples", "Examples"],
  ]) {
    await page.goto(`/#/${old}`);
    await expect(page, old).toHaveURL(new RegExp(`#/${now}$`));
    await expect(page.getByRole("heading", { level: 1, name: title, exact: true }), old).toBeVisible();
  }
  await page.goto("/#/no-such-page");
  await expect(page.getByRole("heading", { level: 1, name: "This page doesn't exist" })).toBeVisible();
});

test("the header's tabs mark where you are; Docs and Components have their own sidebar", async ({ page }) => {
  await open(page, "");
  const tabs = page.getByRole("navigation", { name: "Site" });
  await expect(page.locator(".pv-sidebar")).toHaveCount(0);
  for (const [name, path, nav] of [
    ["Docs", "docs/get-started", "Docs"],
    ["Components", "components", "Components"],
    ["Examples", "examples", null],
    ["Themes", "themes", null],
  ] as const) {
    await tabs.getByRole("link", { name, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`#/${path}$`));
    await expect(tabs.getByRole("link", { name, exact: true })).toHaveAttribute("aria-current", "page");
    await expect(tabs.locator('[aria-current="page"]')).toHaveCount(1);
    if (nav) await expect(page.getByRole("navigation", { name: nav, exact: true })).toBeVisible();
    else await expect(page.locator(".pv-sidebar")).toHaveCount(0);
  }
  await page.getByRole("link", { name: "ayywi", exact: true }).first().click();
  await expect(page).toHaveURL(/#\/$/);
  await expect(tabs.locator('[aria-current="page"]')).toHaveCount(0);
});

test("the components sidebar lists every component A–Z, with families nested and a filter", async ({ page }) => {
  await open(page, "components");
  const nav = page.getByRole("navigation", { name: "Components", exact: true });
  for (const c of manifest.components as { name: string; slug: string }[]) {
    await expect(nav.locator(`[data-route="components/${c.slug}"]`), c.slug).toHaveText(c.name);
  }
  // A family opens to its members: Input holds Textarea, Number field…
  const input = nav.locator("details", { has: page.locator("summary", { hasText: /^Input$/ }) });
  await expect(input.getByRole("link", { name: "Textarea", exact: true })).toBeHidden();
  await input.locator("summary").click();
  await expect(input.getByRole("link", { name: "Textarea", exact: true })).toBeVisible();
  // The family holding the current page is open.
  await page.goto("/#/components/combobox");
  await examplesLoaded(page);
  await expect(nav.locator("details", { has: page.locator("summary", { hasText: /^Select$/ }) })).toHaveAttribute("open", "");
  await expect(nav.getByRole("link", { name: "Combobox", exact: true })).toHaveAttribute("aria-current", "page");

  const filter = page.getByRole("searchbox", { name: "Filter components" });
  await filter.fill("area");
  const textarea = nav.getByRole("link", { name: "Textarea", exact: true });
  await expect(textarea).toBeVisible();
  await expect(textarea).toHaveAttribute("data-active", "true");
  await expect(nav.getByRole("link", { name: "Button", exact: true })).toHaveCount(0);
  await expect(filter).toBeFocused();

  // Enter navigates to the preselected option while search box keeps focus
  await filter.press("Enter");
  await expect(page).toHaveURL(/#\/components\/textarea$/);
  await expect(filter).toBeFocused();

  // Arrow keys navigate options without losing search box focus
  await filter.fill("card");
  const card = nav.getByRole("link", { name: "Card", exact: true });
  const choiceCard = nav.getByRole("link", { name: "Choice card", exact: true });
  await expect(card).toHaveAttribute("data-active", "true");
  await filter.press("ArrowDown");
  await expect(choiceCard).toHaveAttribute("data-active", "true");
  await expect(card).not.toHaveAttribute("data-active", "true");
  await filter.press("ArrowUp");
  await expect(card).toHaveAttribute("data-active", "true");
  await expect(filter).toBeFocused();

  await filter.fill("zzzz");
  await expect(nav).toContainText("No component called");
});

test("a component page has Overview, Properties and Accessibility tabs, each with its own address", async ({ page }) => {
  await open(page, "components/tabs");
  const tablist = page.getByRole("tablist", { name: "Tabs documentation" });
  await expect(tablist.getByRole("tab", { name: "Overview" })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator(".ayy-showcase").first()).toBeVisible();

  await tablist.getByRole("tab", { name: "Properties" }).click();
  await expect(page).toHaveURL(/#\/components\/tabs\/properties$/);
  await expect(page.getByRole("heading", { level: 2, name: "<Tabs> renders <div>" })).toBeVisible();
  await expect(page.getByRole("table", { name: "CSS classes" })).toContainText(".ayy-tabs");
  await expect(page.getByRole("heading", { level: 2, name: /<ayy-tabs>/ })).toBeVisible();

  await tablist.getByRole("tab", { name: "Accessibility" }).click();
  await expect(page).toHaveURL(/#\/components\/tabs\/accessibility$/);
  await expect(page.locator(".pv-a11y li").first()).toBeVisible();

  await page.reload();
  await expect(tablist.getByRole("tab", { name: "Accessibility" })).toHaveAttribute("aria-selected", "true");
});

test("the components overview shows every component as a live card", async ({ page }) => {
  const errors = await open(page, "components");
  await expect(page.getByRole("heading", { level: 1, name: "Browse the library" })).toBeVisible();
  await expect(page.locator(".pv-comp-card")).toHaveCount(manifest.components.length);
  // Thumbnails are drawn as they near the viewport, and are decorative.
  const first = page.locator(".pv-comp-card .pv-thumb").first();
  await expect(first.locator(".pv-thumb__inner > *")).not.toHaveCount(0);
  await expect(first).toHaveAttribute("aria-hidden", "true");
  await page.locator(".pv-comp-card").filter({ hasText: "Dialog" }).getByRole("link").click();
  await expect(page).toHaveURL(/#\/components\/dialog$/);
  expect(errors).toEqual([]);
});

test("a section link opens the page scrolled to that section", async ({ page }) => {
  await open(page, "docs/colors/status");
  await expect(page.getByRole("heading", { level: 2, name: "Status", exact: true })).toBeInViewport();
  const nav = page.getByRole("navigation", { name: "Docs", exact: true });
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

test("component variations copy the same general prompt", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await open(page, "components/button");
  await examplesLoaded(page);
  const examples = page.locator(".pv-example");
  expect(await examples.count()).toBeGreaterThan(1);
  const prompts: string[] = [];
  for (const example of (await examples.all()).slice(0, 2)) {
    await example.getByRole("button", { name: "Copy for..." }).click();
    const popover = page.getByRole("dialog", { name: /^Copy for / });
    await popover.getByRole("button", { name: "Copy prompt" }).click();
    prompts.push(await page.evaluate(() => navigator.clipboard.readText()));
    await expect(popover.getByRole("tab", { name: "React" })).toBeVisible();
    await expect(popover.getByRole("tab", { name: "HTML" })).toBeVisible();
    await page.keyboard.press("Escape");
  }
  expect(prompts[0]).toBe(prompts[1]);
  expect(prompts[0]).toContain("Build a Button component using the ayywi design system.");
  expect(prompts[0]).toContain("@danitesler/ayywi/react");
  expect(prompts[0]).not.toContain("Reference code:");
});

test("get started's quick-start prompt asks first, brand included, then loads ayywi", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await open(page, "docs/get-started");
  await page.getByRole("button", { name: "Copy prompt", exact: true }).click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toMatch(/^Build me an app with the ayywi design system\. Before you start, ask me/);
  expect(copied).toContain("Which brand colour and corners");
  expect(copied).toContain("ayywi.setBrand(");
  expect(copied).toContain("dist/ayywi.min.css");
  // The fonts and the saved theme come along, so the app looks like the examples from the first paint.
  expect(copied).toContain("dist/fonts.css");
  expect(copied).toContain("dist/theme-init.js");
  expect(copied).toContain("llms.txt");
  expect(copied).not.toMatch(/127\.0\.0\.1|localhost/);
});

test("the site hosts each release's runtime files under v/<release>/; prompts from a local preview use the public site", async ({ page, context, baseURL }) => {
  // Served from a real host name (not localhost), the prompts point at this build's own v/<release>/ copies.
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await open(page, "docs/get-started");
  await page.getByRole("button", { name: "Copy prompt", exact: true }).click();
  const local = await page.evaluate(() => navigator.clipboard.readText());
  expect(local).not.toContain("/v/");
  const versions = await (await page.request.get(`${baseURL}/versions.json`)).json();
  const css = await page.request.get(`${baseURL}/v/${versions.latest}/dist/ayywi.min.css`);
  expect(css.ok()).toBe(true);
  expect(await css.text()).toContain(".ayy-button");
  for (const file of versions.versions[0].files) expect((await page.request.get(`${baseURL}/v/${versions.latest}/${file}`)).ok(), file).toBe(true);
});

test("the header's search finds components, docs and examples and jumps to them", async ({ page }) => {
  await open(page, "components");
  const dialog = page.locator(".ayy-dialog.ayy-command");
  const box = dialog.getByRole("combobox", { name: "Search the docs" });

  // Mod+E opens command palette
  const isMac = await page.evaluate(() => /mac|iphone|ipad|ipod/i.test(navigator.userAgent));
  await page.keyboard.press(isMac ? "Meta+e" : "Control+e");
  await expect(dialog).toBeVisible();
  // Initial state has NO descriptions visible
  await expect(dialog.locator(".ayy-command__description")).toHaveCount(0);

  // Search "input": title match (Input) appears with highlight and no description;
  // secondary matches (Slider) show description with highlight
  await box.fill("input");
  const inputOption = dialog.locator('.ayy-command__item[data-value="components/input"]');
  await expect(inputOption).toBeVisible();
  await expect(inputOption.locator(".ayy-command__description")).toHaveCount(0);
  const mark = inputOption.locator("mark.ayy-text-highlight");
  await expect(mark).toHaveText("Input");
  await expect(mark).toHaveCSS("text-decoration-line", "underline");
  await expect(mark).toHaveCSS("padding-inline-start", "0px");

  // Secondary match has description visible with highlighted term
  const sliderOption = dialog.locator('.ayy-command__item[data-value="components/slider"]');
  await expect(sliderOption).toBeVisible();
  const sliderDesc = sliderOption.locator(".ayy-command__description");
  await expect(sliderDesc).toBeVisible();
  await expect(sliderDesc.locator("mark.ayy-text-highlight").first()).toHaveText("input");

  await box.fill("ayy-menu__item"); // class names match via keywords
  await expect(dialog.getByRole("option", { name: /Dropdown menu/ })).toBeVisible();

  await box.fill("table");
  const visibleOptions = dialog.locator('.ayy-command__item:not([hidden])');
  await expect(visibleOptions.first()).toHaveAttribute("data-value", "components/table");

  await box.fill("button");
  await expect(visibleOptions.first()).toHaveAttribute("data-value", "components/button");

  await box.fill("surface-raised"); // token names match via keywords
  await expect(dialog.getByRole("option", { name: /Colors/ })).toBeVisible();

  await box.fill("dating"); // showcase apps
  await expect(dialog.getByRole("option", { name: /Dating app/ })).toBeVisible();

  await box.fill("dialog");
  await dialog.getByRole("option", { name: /^Dialog/ }).click();
  await expect(page).toHaveURL(/#\/components\/dialog$/);
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("heading", { level: 1, name: "Dialog" })).toBeVisible();

  // The sidebar scrolls to the page it opened.
  const sidebar = page.locator(".pv-sidebar");
  const inView = async (route: string) => {
    const link = page.locator(`#pv-nav [data-route="${route}"]`);
    await expect(link).toHaveAttribute("aria-current", "page");
    await expect(async () => {
      const linkBox = (await link.boundingBox())!;
      const sidebarBox = (await sidebar.boundingBox())!;
      expect(linkBox.y).toBeGreaterThanOrEqual(sidebarBox.y);
      expect(linkBox.y + linkBox.height).toBeLessThanOrEqual(sidebarBox.y + sidebarBox.height);
    }).toPass();
  };
  await inView("components/dialog");

  // The header's search button opens it too.
  const search = page.locator(".pv-header").getByRole("button", { name: "Search", exact: true });
  await search.click();
  await expect(dialog).toBeVisible();
  await box.fill("tooltip");
  await dialog.getByRole("option", { name: /^Tooltip/ }).click();
  await expect(page).toHaveURL(/#\/components\/tooltip$/);
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("heading", { level: 1, name: "Tooltip" })).toBeVisible();
  await inView("components/tooltip");

  // Pressing Escape closes command palette
  await search.click();
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("nothing overflows horizontally on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const components = ["button", "table", "dialog", "navbar", "app-shell", "bottom-nav", "footer", "pagination", "steps", "page-header", "input", "segmented-control", "list", "empty-state", "accordion", "toc", "carousel", "chat"];
  for (const route of ["", "docs/get-started", "docs/colors", "docs/typography", "docs/spacing", "docs/icons", "examples", "examples/dashboard", "themes", "components", "components/table/properties", ...components.map((c) => `components/${c}`)]) {
    // Keep the pointer off the header: in RTL its buttons sit where the pointer rests, and a tooltip fading in or out
    // isn't layout.
    await page.mouse.move(195, 700);
    await open(page, route);
    for (const dir of ["ltr", "rtl"]) {
      await page.evaluate((d) => document.documentElement.setAttribute("dir", d), dir);
      // Measure at rest: flipping the direction can start transitions (a drawer moving to the other edge).
      await page.evaluate(() =>
        Promise.race([
          Promise.all(document.getAnimations().filter((a) => a.effect?.getComputedTiming().endTime !== Infinity).map((a) => a.finished.catch(() => undefined))),
          new Promise((resolve) => setTimeout(resolve, 2000)),
        ]),
      );
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `/#/${route} (${dir})`).toBeLessThanOrEqual(0);
    }
  }
});

test("on a phone the header's tabs fold into a menu and the sidebar is a drawer", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page, "components/button");
  const tabs = page.getByRole("navigation", { name: "Site" });
  await expect(tabs).toBeHidden();
  await page.locator(".pv-header").getByRole("button", { name: "Menu" }).click();
  await expect(tabs.getByRole("link", { name: "Components", exact: true })).toBeVisible();
  await page.locator(".pv-header").getByRole("button", { name: "Menu" }).click();
  await expect(tabs).toBeHidden();

  const toggle = page.getByRole("button", { name: "Open navigation" });
  const nav = page.getByRole("navigation", { name: "Components", exact: true });
  await expect(nav).toBeHidden();
  await toggle.click();
  await expect(nav).toBeVisible();
  await nav.getByRole("link", { name: "Dialog", exact: true }).click();
  await expect(page).toHaveURL(/#\/components\/dialog$/);
  await expect(nav).toBeHidden();
  await expect(page.locator(".pv-page h1")).toHaveText("Dialog");
  await expect(page.locator(".pv-shell-bar")).toContainText("Dialog");
});

const SHOWCASE = [
  { id: "dashboard", kind: "Analytics dashboard", preset: "arctic", theme: "dark", density: "compact" },
  { id: "landing", kind: "Marketing site", preset: "twilight", theme: "dark", density: "comfortable" },
  { id: "dating", kind: "Dating app", preset: "wine", theme: "light", density: "comfortable" },
  { id: "tracker", kind: "Project tracker", preset: "default", theme: "light", density: "compact" },
  { id: "store", kind: "Online store", preset: "ember", theme: "dark", density: "comfortable" },
  { id: "booking", kind: "Booking app", preset: "forest", theme: "light", density: "touch" },
];

test("examples: cards open a device preview", async ({ page }) => {
  const errors = await open(page, "examples");
  await expect(page.getByRole("heading", { level: 1, name: "Examples" })).toBeVisible();
  const cards = page.locator(".pv-showcase__card");
  await expect(cards).toHaveCount(SHOWCASE.length);

  // A card is the kind of app, and nothing else: no theme or density tags.
  await expect(cards.locator(".ayy-badge")).toHaveCount(0);
  await cards.filter({ hasText: "Dating app" }).click();
  await expect(page).toHaveURL(/#\/examples\/dating$/);
  await expect(page.getByRole("heading", { level: 1, name: "Dating app" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Built with" })).toHaveCount(0);
  // Previous, All examples and Next sit together above the preview.
  const nav = page.getByRole("navigation", { name: "Examples" });
  await expect(nav.getByRole("link")).toHaveText(["Marketing site", "All examples", "Project tracker"]);
  await expect(nav.getByRole("link", { name: "Previous: Marketing site" })).toBeVisible();
  await nav.getByRole("link", { name: /Next/ }).click();
  await expect(page).toHaveURL(/#\/examples\/tracker$/);
  await nav.getByRole("link", { name: /Previous/ }).click();
  await expect(page).toHaveURL(/#\/examples\/dating$/);

  const frame = page.locator(".pv-device iframe");
  const device = page.getByRole("radiogroup", { name: "Device" });
  for (const [label, width] of [["Tablet", 834], ["Mobile", 390], ["Desktop", 1280]] as const) {
    await device.getByText(label, { exact: true }).click();
    await expect(device.getByRole("radio", { name: label })).toBeChecked();
    await expect(frame).toHaveCSS("width", `${width}px`);
  }
  expect(errors).toEqual([]);
});

test("each showcase app renders in its own theme preset and density, and fits a phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const app of SHOWCASE) {
    await page.goto(`/?app=${app.id}`);
    await expect(page.locator(".pv-frame .pv-app")).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("data-theme", app.theme);
    await expect(page.locator("html")).toHaveAttribute("data-density", app.density);
    if (app.preset === "default") await expect(page.locator("html")).not.toHaveAttribute("data-brand", /.+/);
    else await expect(page.locator("html")).toHaveAttribute("data-brand", app.preset);
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
      await expect(page.locator(".ayy-page-header"), app.id).not.toHaveCount(0);
    }
  }
});

test("each app opens its own settings in a near-full-screen dialog", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  for (const app of SHOWCASE.filter((a) => a.id !== "landing" && a.id !== "store")) {
    await page.goto(`/?app=${app.id}`);
    await expect(page.locator(".pv-frame .pv-app")).toBeVisible();
    const dialog = page.getByRole("dialog", { name: "Settings" });
    await expect(dialog).toBeHidden();
    await page.locator(".pv-app > .ayy-app-shell__sidebar").getByRole("link", { name: "Settings" }).click();
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
  await page.goto("/?app=dating");
  await page.locator(".ayy-app-shell__bar").getByRole("button", { name: "Settings" }).click();
  const dialog = page.getByRole("dialog", { name: "Settings" });
  await expect(dialog).toBeVisible();
  await expect.poll(() => dialog.evaluate((el) => getComputedStyle(el).transform)).toBe("none");
  expect(Math.round((await dialog.boundingBox())!.width)).toBe(390);
  const list = dialog.locator(".ayy-app-shell__sidebar");
  await expect(list).toBeVisible();
  await list.getByRole("link", { name: "Privacy" }).click();
  await expect(list).toBeHidden();
  await expect(dialog.getByRole("heading", { level: 1, name: "Privacy" })).toBeVisible();
  await dialog.getByRole("button", { name: "Settings" }).click();
  await expect(list).toBeVisible();
  await expect(list.getByRole("link", { name: "Privacy" })).toBeFocused();
});

test("page titles stay at the same height without category labels or component import blocks", async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  let top: number | undefined;
  for (const route of ["docs/spacing", "docs/icons", "docs/get-started", "components/button", "components/dialog", "components", "examples", "examples/dating"]) {
    await open(page, route);
    const header = page.locator(".pv-page__header");
    await expect(header.locator(".ayy-eyebrow"), route).toHaveCount(0);
    const offset = await header.locator("h1").evaluate((el) => el.getBoundingClientRect().top - el.closest("main")!.getBoundingClientRect().top);
    top ??= offset;
    expect(Math.abs(offset - top), route).toBeLessThanOrEqual(1);
    if (route.startsWith("components/")) {
      await expect(page.locator(".pv-comp-tabs__panel > .pv-code"), route).toHaveCount(0);
    }
  }
});

test.describe("Components and Docs pages are centred like Examples", () => {
  const measure = (page: import("@playwright/test").Page, selector: string) =>
    page.locator(selector).evaluate((el) => {
      const box = el.getBoundingClientRect();
      const area = (el.closest(".ayy-app-shell__main") ?? el.parentElement!).getBoundingClientRect();
      return { width: box.width, start: box.left - area.left, end: area.right - box.right };
    });

  test("at 1600px the page content sits in the middle of its area and is as wide as Examples", async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 900 });
    await open(page, "examples");
    const examples = await measure(page, "main.pv-wide");
    expect(examples.width).toBe(1200);
    for (const route of ["components/button", "components", "docs/get-started", "docs/colors"]) {
      await page.goto(`/#/${route}`);
      await expect(page.locator(".pv-content")).toBeVisible();
      const box = await measure(page, ".pv-content");
      expect(box.width, route).toBe(examples.width);
      expect(Math.abs(box.start - box.end), route).toBeLessThanOrEqual(1);
      expect(box.start, route).toBeGreaterThan(0);
    }
  });

  for (const dir of ["ltr", "rtl"] as const) {
    test(`centring holds with dir=${dir}`, async ({ page }) => {
      await page.setViewportSize({ width: 1600, height: 900 });
      await open(page, "components/button");
      await page.evaluate((d) => document.documentElement.setAttribute("dir", d), dir);
      const box = await measure(page, ".pv-content");
      expect(Math.abs(box.start - box.end)).toBeLessThanOrEqual(1);
    });
  }

  for (const dir of ["ltr", "rtl"] as const) {
    test(`page headers on Components and Docs pages are centred like Examples' (dir=${dir})`, async ({ page }) => {
      await page.setViewportSize({ width: 1600, height: 900 });
      await open(page, "examples");
      const lede = (await page.locator(".pv-page__header .ayy-lede").first().evaluate((el) => el.getBoundingClientRect().width));
      for (const route of ["components/button", "docs/get-started", "docs/colors", "docs/icons", "docs/changelog", "docs/principles"]) {
        await page.goto(`/#/${route}`);
        await page.evaluate((d) => document.documentElement.setAttribute("dir", d), dir);
        const header = page.locator(".pv-content .pv-page__header").first();
        await expect(header).toBeVisible();
        for (const part of ["h1", ".ayy-lede"]) {
          expect(await header.locator(part).first().evaluate((el) => getComputedStyle(el).textAlign), `${route} ${part}`).toBe("center");
        }
        // The header block sits in the middle of the content, and its text never runs wider than Examples' lede.
        const box = await header.evaluate((el) => {
          const h = el.getBoundingClientRect();
          const c = el.closest(".pv-content")!.getBoundingClientRect();
          return { start: h.left - c.left, end: c.right - h.right, lede: el.querySelector(".ayy-lede")!.getBoundingClientRect().width };
        });
        expect(Math.abs(box.start - box.end), route).toBeLessThanOrEqual(1);
        expect(box.lede, route).toBeLessThanOrEqual(lede + 1);
      }
    });
  }

  test("at 375px nothing on a component or docs page scrolls sideways", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    for (const route of ["components/button", "components", "docs/get-started", "docs/colors"]) {
      await open(page, route);
      // The page's own box, not the document: the header's hidden tooltips are a separate, known overflow.
      const fit = await page.locator(".pv-content").evaluate((el) => ({ right: el.getBoundingClientRect().right, left: el.getBoundingClientRect().left, over: el.scrollWidth - el.clientWidth, vw: document.documentElement.clientWidth }));
      expect(fit.right, route).toBeLessThanOrEqual(fit.vw);
      expect(fit.left, route).toBeGreaterThanOrEqual(0);
      expect(fit.over, route).toBeLessThanOrEqual(0);
    }
  });
});
