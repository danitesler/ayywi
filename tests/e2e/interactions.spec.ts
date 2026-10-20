import { expect, test, type Page } from "@playwright/test";
import { example, open, rtl, settle, stage } from "./helpers";

/** The app shell playground's toolbar switch. Inert in the HTML renderer: use pgSetup() there instead. */
async function pgSwitch(page: Page, name: string, on: boolean) {
  const ex = page.locator('.pv-example[aria-labelledby="ex-playground"]');
  const propsBtn = ex.getByRole("button", { name: "Props" });
  if (await propsBtn.isVisible()) {
    const popover = ex.locator(".pv-props-popover");
    if (!(await popover.isVisible())) await propsBtn.click();
    const sw = popover.getByRole("switch", { name });
    if ((await sw.count()) > 0) {
      if ((await sw.isChecked()) !== on) await sw.click();
    }
    return;
  }
  const sw = example(page, "playground").getByRole("switch", { name });
  if ((await sw.count()) > 0) {
    if ((await sw.isChecked()) !== on) await sw.click();
  }
}

/** The playground shell both renderers show: grouped nav, phone bar and bottom nav, detail pane and resize handles. */
const pgShell = (page: Page) => example(page, "playground").locator(".ayy-app-shell").first();

for (const renderer of ["react", "html"] as const) {
  test.describe(renderer, () => {
    test("app shell collapse toggles with the keyboard, the sub-list indents, and phones drop nested items", async ({ page }) => {
      await open(page, "app-shell", { renderer });
      // The row layout needs no phone chrome: drop the bar and the bottom nav (switches in React, nodes in HTML).
      await pgShell(page).locator(":scope > .ayy-app-shell__bar").evaluate((el) => el.remove()).catch(() => {});
      await pgShell(page).locator(":scope > .ayy-bottom-nav").evaluate((el) => el.remove()).catch(() => {});
      const demo = example(page, "playground");
      const shell = pgShell(page);
      const typography = shell.locator("summary", { hasText: "Typography" });
      const scale = shell.getByRole("link", { name: "Scale" });
      const details = typography.locator("xpath=..");

      await expect(scale).toBeHidden();
      await typography.focus();
      await page.keyboard.press("Enter");
      await expect(details).toHaveJSProperty("open", true);
      await expect(scale).toBeVisible();
      await page.keyboard.press("Space");
      await expect(scale).toBeHidden();

      // Children sit further along the inline axis than their parent, in both directions.
      await page.keyboard.press("Enter");
      const x = async (l: typeof scale) => (await l.boundingBox())!.x;
      const end = async (l: typeof scale) => {
        const b = (await l.boundingBox())!;
        return b.x + b.width;
      };
      expect(await x(scale)).toBeGreaterThan(await x(typography));
      await rtl(demo);
      expect(await end(scale)).toBeLessThan(await end(typography));
      await demo.evaluate((el) => el.removeAttribute("dir"));

      // A closed group that holds the current page is drawn bolder than a plain one.
      const colors = shell.locator("summary", { hasText: "Colors" });
      await colors.click();
      await expect(shell.getByRole("link", { name: "Themes" })).toBeHidden();
      const weight = (l: typeof colors) => l.evaluate((el) => Number(getComputedStyle(el).fontWeight));
      await typography.click();
      expect(await weight(colors)).toBeGreaterThan(await weight(typography));

      // On a phone the row keeps top-level links only.
      await page.setViewportSize({ width: 390, height: 800 });
      await expect(shell.locator(".ayy-app-shell__group-label").first()).toBeHidden();
      await expect(typography).toBeHidden();
      await page.setViewportSize({ width: 1280, height: 720 });
    });

    test("app shell drawer: the bar's toggle opens the sidebar on phones, Esc and links close it", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 800 });
      await open(page, "app-shell", { renderer });
      const shell = pgShell(page);
      const toggle = shell.getByRole("button", { name: "Menu" });
      const sidebar = shell.locator(".ayy-app-shell__sidebar");
      const main = shell.locator(".ayy-app-shell__main");

      // Closed: the drawer is out of view and out of the tab order.
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      await expect(toggle).toHaveAttribute("aria-controls", (await sidebar.getAttribute("id"))!);
      await expect(sidebar).toBeHidden();

      // Open: groups survive (unlike the sideways row), focus moves in, the rest goes inert.
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      await expect(sidebar).toBeVisible();
      await expect(sidebar.getByText("Foundations")).toBeVisible();
      await expect(sidebar.locator("a").first()).toBeFocused();
      await expect(main).toHaveJSProperty("inert", true);
      await expect.poll(async () => Math.round((await sidebar.boundingBox())!.x - (await shell.boundingBox())!.x)).toBe(0);

      await page.keyboard.press("Escape");
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      await expect(toggle).toBeFocused();
      await expect(main).toHaveJSProperty("inert", false);

      // A link in the drawer closes it.
      await toggle.click();
      await sidebar.getByRole("link", { name: "Spacing" }).click();
      await expect(toggle).toHaveAttribute("aria-expanded", "false");

      // RTL: it comes from the right edge.
      await rtl(example(page, "playground"));
      await toggle.click();
      await expect
        .poll(async () => {
          const s = (await sidebar.boundingBox())!;
          const b = (await shell.boundingBox())!;
          return Math.round(b.x + b.width - (s.x + s.width));
        })
        .toBe(0);
      await page.keyboard.press("Escape");
      await example(page, "playground").evaluate((el) => el.removeAttribute("dir"));

      // Wider than a phone: no bar, the sidebar in place.
      await page.setViewportSize({ width: 1280, height: 720 });
      await expect(shell.locator(".ayy-app-shell__bar")).toBeHidden();
      await expect(sidebar).toBeVisible();
    });

    test("app shell with a bottom nav: tabs on phones, More opens the drawer, the sidebar from 48rem", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 800 });
      await open(page, "app-shell", { renderer });
      const shell = pgShell(page);
      const tabs = shell.locator(".ayy-bottom-nav");
      const sidebar = shell.locator(".ayy-app-shell__sidebar");
      const more = tabs.getByRole("button", { name: "More" });

      await expect(tabs).toBeVisible();
      await expect(sidebar).toBeHidden();
      await expect(tabs.locator('[aria-current="page"]')).toHaveText("Dashboard");
      // The tab bar sits at the bottom of the shell, the bar at the top.
      await expect.poll(async () => {
        const shellBox = (await shell.boundingBox())!;
        const tabsBox = (await tabs.boundingBox())!;
        return Math.round(tabsBox.y + tabsBox.height) - Math.round(shellBox.y + shellBox.height);
      }).toBe(0);
      await expect(shell.locator(".ayy-app-shell__bar")).toBeVisible();

      await expect(more).toHaveAttribute("aria-expanded", "false");
      await more.click();
      await expect(more).toHaveAttribute("aria-expanded", "true");
      await expect(sidebar).toBeVisible();
      await expect(sidebar.getByRole("link", { name: "Themes" })).toBeVisible();
      await expect(shell.locator(".ayy-app-shell__main")).toHaveJSProperty("inert", true);
      await page.keyboard.press("Escape");
      await expect(more).toHaveAttribute("aria-expanded", "false");
      await expect(more).toBeFocused();

      await page.setViewportSize({ width: 1280, height: 720 });
      await expect(tabs).toBeHidden();
      await expect(sidebar).toBeVisible();
    });

    test("app shell collapsible sidebar: rail when collapsed, hover preview overlays, toggle button expands", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await open(page, "app-shell", { renderer });
      if (renderer === "react") await pgSwitch(page, "Collapsed sidebar", true);
      else await pgShell(page).evaluate((el) => el.classList.add("ayy-app-shell--collapsed"));
      const shell = pgShell(page);
      const sidebar = shell.locator(".ayy-app-shell__sidebar");
      const main = shell.locator(".ayy-app-shell__main");
      const toggle = sidebar.locator(".ayy-app-shell__toggle");

      await expect(shell).toHaveClass(/ayy-app-shell--collapsed/);
      await expect(shell).toHaveClass(/ayy-app-shell--hover-preview/);
      await expect.poll(async () => Math.round((await sidebar.boundingBox())!.width)).toBeLessThan(70);

      // Collapsed: sidebar is icon rail width (~52px), text label is hidden
      const collapsedBox = (await sidebar.boundingBox())!;
      expect(Math.round(collapsedBox.width)).toBeLessThan(70);
      const mainBoxBefore = (await main.boundingBox())!;

      // Hover preview: hovering sidebar widens it over main without shifting main
      await sidebar.hover();
      await expect.poll(async () => Math.round((await sidebar.boundingBox())!.width)).toBeGreaterThan(200);
      const mainBoxDuringHover = (await main.boundingBox())!;
      expect(Math.round(mainBoxDuringHover.x)).toBe(Math.round(mainBoxBefore.x));

      // Moving away collapses it back
      await main.hover();
      await expect.poll(async () => Math.round((await sidebar.boundingBox())!.width)).toBeLessThan(70);

      // Toggle button expands sidebar
      await toggle.click();
      await expect(shell).not.toHaveClass(/ayy-app-shell--collapsed/);
      await expect.poll(async () => Math.round((await sidebar.boundingBox())!.width)).toBeGreaterThan(200);

      // Toggle again collapses it, and the preview stays shut while the pointer is still on the toggle.
      const icon = sidebar.locator(".ayy-app-shell__link:has(svg)").first().locator("svg");
      const iconXOpen = (await icon.boundingBox())!.x;
      await toggle.click();
      await expect(shell).toHaveClass(/ayy-app-shell--collapsed/);
      await expect(sidebar).toHaveAttribute("data-ayy-hold", "");
      await expect.poll(async () => Math.round((await sidebar.boundingBox())!.width)).toBeLessThan(70);
      // The icons barely move between the open sidebar and the rail: rows keep their place.
      expect(Math.abs((await icon.boundingBox())!.x - iconXOpen)).toBeLessThan(6);
      // Leaving lets it go; coming back previews again.
      await main.hover();
      await expect(sidebar).not.toHaveAttribute("data-ayy-hold");
      await sidebar.hover();
      await expect.poll(async () => Math.round((await sidebar.boundingBox())!.width)).toBeGreaterThan(200);
      await main.hover();
      await expect.poll(async () => Math.round((await sidebar.boundingBox())!.width)).toBeLessThan(70);
    });

    test("app shell workspace: drag and keys resize the sidebar, a double click resets", async ({ page }) => {
      await page.setViewportSize({ width: 1800, height: 900 });
      await open(page, "app-shell", { renderer });
      const shell = pgShell(page);
      const sidebar = shell.locator(".ayy-app-shell__sidebar");
      const main = shell.locator(".ayy-app-shell__main");
      const side = shell.getByRole("separator", { name: "Resize sidebar" });
      const width = async (l: typeof sidebar) => Math.round((await l.boundingBox())!.width);

      await expect.poll(() => width(sidebar)).toBe(240);
      await expect(side).toHaveAttribute("aria-valuenow", "240");
      await side.focus();
      await page.keyboard.press("End");
      await expect.poll(() => width(main)).toBeGreaterThanOrEqual(319);

      await side.dblclick();
      await expect.poll(() => width(sidebar)).toBe(240);

      // Drag the sidebar's edge 60px towards the inline end.
      const handle = (await side.boundingBox())!;
      await page.mouse.move(handle.x + handle.width / 2, handle.y + 100);
      await page.mouse.down();
      await page.mouse.move(handle.x + handle.width / 2 + 60, handle.y + 100, { steps: 5 });
      await page.mouse.up();
      await expect.poll(() => width(sidebar)).toBe(300);
      await expect(side).toHaveAttribute("aria-valuenow", "300");
      expect(await shell.evaluate((el) => el.style.getPropertyValue("--ayy-sidebar-w"))).toBe("300px");

      // Keys: arrows step 16px, Shift 64px, End goes to the upper limit, Home to the lower.
      await side.focus();
      await page.keyboard.press("ArrowLeft");
      await expect.poll(() => width(sidebar)).toBe(284);
      await page.keyboard.press("Shift+ArrowRight");
      await expect.poll(() => width(sidebar)).toBe(348);
      await page.keyboard.press("End");
      await expect.poll(() => width(sidebar)).toBe(384);
      await page.keyboard.press("Home");
      await expect.poll(() => width(sidebar)).toBe(192);
      await side.dblclick();
      await expect.poll(() => width(sidebar)).toBe(240);
    });

    test("app shell workspace in RTL: the keys follow the edge", async ({ page }) => {
      await page.setViewportSize({ width: 1800, height: 900 });
      await open(page, "app-shell", { renderer });
      const demo = example(page, "playground");
      await rtl(demo);
      const shell = demo.locator(".ayy-app-shell").first();
      const sidebar = shell.locator(".ayy-app-shell__sidebar");
      const side = shell.getByRole("separator", { name: "Resize sidebar" });

      await side.focus();
      await page.keyboard.press("ArrowLeft");
      await expect.poll(async () => Math.round((await sidebar.boundingBox())!.width)).toBe(256);
      await page.keyboard.press("ArrowRight");
      await page.keyboard.press("ArrowRight");
      await expect.poll(async () => Math.round((await sidebar.boundingBox())!.width)).toBe(224);
      const handle = (await side.boundingBox())!;
      const edgeX = (await sidebar.boundingBox())!.x;
      expect(Math.abs(handle.x + handle.width / 2 - edgeX)).toBeLessThan(2);
    });

    test("app shell workspace on phones: the sidebar is a drawer opened from the main area", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 800 });
      await open(page, "app-shell", { renderer });
      // A drawer with its toggle in the main area: no bar, no bottom nav, Drawer on phones.
      if (renderer === "react") {
        await pgSwitch(page, "Top bar", false);
        await pgSwitch(page, "Bottom nav", false);
        await pgSwitch(page, "Drawer on phones", true);
      } else {
        await pgShell(page).evaluate((el) => {
          const shell = el as HTMLElement;
          const toggle = shell.querySelector(":scope > .ayy-app-shell__bar .ayy-app-shell__toggle");
          const main = shell.querySelector(":scope > .ayy-app-shell__main");
          if (toggle && main) {
            const wrap = document.createElement("div");
            wrap.className = "ayy-cluster";
            wrap.append(toggle);
            main.prepend(wrap);
          }
          shell.querySelector(":scope > .ayy-app-shell__bar")?.remove();
          shell.querySelector(":scope > .ayy-bottom-nav")?.remove();
          shell.classList.add("ayy-app-shell--drawer");
        });
      }
      const shell = pgShell(page);
      const sidebar = shell.locator(".ayy-app-shell__sidebar");
      const toggle = shell.locator(".ayy-app-shell__main .ayy-app-shell__toggle");

      // No sideways row: the sidebar waits off-screen.
      expect(await sidebar.evaluate((el) => getComputedStyle(el).flexDirection)).toBe("column");
      await expect(sidebar).toBeHidden();
      await expect(shell.locator(".ayy-app-shell__resize").first()).toBeHidden();

      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      await expect(sidebar).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      await expect(sidebar).toBeHidden();
    });

    test("app shell collapsible sidebar: the width animates, and labels fade instead of jumping", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await open(page, "app-shell", { renderer });
      if (renderer === "react") await pgSwitch(page, "Collapsed sidebar", true);
      else await pgShell(page).evaluate((el) => el.classList.add("ayy-app-shell--collapsed"));
      const shell = pgShell(page);
      const sidebar = shell.locator(".ayy-app-shell__sidebar");
      const toggle = sidebar.locator(".ayy-app-shell__toggle");
      await expect.poll(async () => Math.round((await sidebar.boundingBox())!.width)).toBeLessThan(70);
      await shell.locator(".ayy-app-shell__main").hover();
      // A long transition, so a busy machine can't finish it before it's measured.
      await shell.evaluate((el) => el.style.setProperty("--ayy-duration-base", "10s"));
      await toggle.evaluate((el) => (el as HTMLElement).click());
      // Part-way through, the sidebar is between the rail and the full width, and the label is part-way faded in.
      const mid = await sidebar.evaluate((el) => {
        const label = el.querySelector(".ayy-app-shell__link > span")!;
        for (const a of [...el.getAnimations(), ...label.getAnimations()]) {
          a.pause();
          a.currentTime = 1000;
        }
        return { width: el.getBoundingClientRect().width, opacity: Number(getComputedStyle(label).opacity) };
      });
      expect(mid.width).toBeGreaterThan(70);
      expect(mid.width).toBeLessThan(230);
      expect(mid.opacity).toBeGreaterThan(0);
      expect(mid.opacity).toBeLessThan(1);
    });

    test("navbar folds its links into a menu on phones", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 800 });
      await open(page, "navbar", { renderer });
      const navbar = stage(page, 1).locator(".ayy-navbar");
      const toggle = navbar.getByRole("button", { name: "Menu" });
      const links = navbar.locator(".ayy-navbar__nav");

      await expect(links).toBeHidden();
      await expect(toggle).toHaveAttribute("aria-controls", (await links.getAttribute("id"))!);
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      await expect(links).toBeVisible();
      await expect(links.getByRole("link")).toHaveCount(4);
      await page.keyboard.press("Escape");
      await expect(links).toBeHidden();
      await expect(toggle).toBeFocused();

      await toggle.click();
      await links.getByRole("link", { name: "Pricing" }).click();
      await expect(links).toBeHidden();

      await page.setViewportSize({ width: 1280, height: 720 });
      await expect(toggle).toBeHidden();
      await expect(links).toBeVisible();
    });

    test("segmented control is a radio group: arrow keys move the choice", async ({ page }) => {
      await open(page, "segmented-control", { renderer });
      const group = stage(page).getByRole("radiogroup", { name: "Date range" });
      const radios = group.getByRole("radio");
      await expect(radios.nth(1)).toBeChecked();
      await radios.nth(1).focus();
      await page.keyboard.press("ArrowRight");
      await expect(radios.nth(2)).toBeChecked();
      await expect(radios.nth(1)).not.toBeChecked();
      // The checked segment is filled: its label's background differs from an unchecked one. The fill fades in, and its
      // first frame is still transparent, so wait for it rather than reading it once.
      const bg = (i: number) => group.locator(".ayy-segmented-control__option").nth(i).evaluate((el) => getComputedStyle(el).backgroundColor);
      const unchecked = await bg(0);
      await expect.poll(() => bg(2)).not.toBe(unchecked);
    });

    test("a loading button says so and stays focusable", async ({ page }) => {
      await open(page, "spinner", { renderer });
      const saving = stage(page).getByRole("button", { name: "Saving…" });
      await expect(saving).toHaveAttribute("aria-busy", "true");
      await expect(saving.locator(".ayy-spinner")).toHaveCount(1);
      expect(await saving.evaluate((el) => (el as HTMLButtonElement).disabled)).toBe(false);
      await saving.focus();
      await expect(saving).toBeFocused();
    });

    test("accordion opens one item at a time", async ({ page }) => {
      await open(page, "accordion", { renderer });
      const items = stage(page).locator("details");
      await expect(items.nth(0)).toHaveJSProperty("open", true);
      await items.nth(1).locator("summary").click();
      await expect(items.nth(1)).toHaveJSProperty("open", true);
      await expect(items.nth(0)).toHaveJSProperty("open", false);
    });

    test("bottom sheet sits on the bottom edge, full width on a phone", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 800 });
      await open(page, "dialog", { renderer });
      await stage(page, 3).getByRole("button", { name: "Sort projects" }).click();
      const sheet = page.getByRole("dialog", { name: "Sort projects" });
      await expect(sheet).toBeVisible();
      await expect.poll(async () => { const b = (await sheet.boundingBox())!; return Math.round(b.y + b.height); }).toBe(800);
      expect((await sheet.boundingBox())!.width).toBe(390);
      await sheet.getByRole("button", { name: "Name" }).click();
      await expect(sheet).toBeHidden();
      await page.setViewportSize({ width: 1280, height: 720 });
    });

    test("dialog opens, traps Esc, returns focus, closes on backdrop", async ({ page }) => {
      await open(page, "dialog", { renderer });
      const trigger = stage(page).getByRole("button", { name: "Delete project" });
      const dialog = page.getByRole("dialog", { name: "Delete Marketing site?" });

      await trigger.click();
      await expect(dialog).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
      await expect(trigger).toBeFocused();

      await trigger.click();
      await expect(dialog).toBeVisible();
      await page.mouse.click(5, 5); // backdrop
      await expect(dialog).toBeHidden();

      await trigger.click();
      await dialog.getByRole("button", { name: "Cancel" }).click();
      await expect(dialog).toBeHidden();
    });

    test("side modal fills the end edge, scrolls only its body, submits from the footer", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 480 }); // a short phone screen, so the body has to scroll
      await open(page, "dialog", { renderer });
      const trigger = stage(page, 2).getByRole("button", { name: "Project settings" });
      const dialog = page.getByRole("dialog", { name: "Project settings" });
      await trigger.click();
      await expect(dialog).toBeVisible();
      await settle(dialog);
      const box = (await dialog.boundingBox())!;
      expect(Math.abs(box.x + box.width - 390)).toBeLessThan(1);
      expect(Math.abs(box.height - 480)).toBeLessThan(1);
      expect(box.x).toBeGreaterThan(0); // a strip of backdrop stays visible

      const body = dialog.locator(".ayy-dialog__body");
      const header = dialog.locator(".ayy-dialog__header");
      const save = dialog.getByRole("button", { name: "Save changes" });
      expect(await body.evaluate((el) => el.scrollHeight > el.clientHeight)).toBe(true);
      const before = [(await header.boundingBox())!.y, (await save.boundingBox())!.y];
      await body.evaluate((el) => el.scrollTo(0, el.scrollHeight));
      expect([(await header.boundingBox())!.y, (await save.boundingBox())!.y]).toEqual(before);
      await expect(save).toBeInViewport();

      await save.click(); // a submit button in the footer, tied to the body's form with form="…"
      await expect(dialog).toBeHidden();
      await expect(trigger).toBeFocused();
    });

    test("tabs follow arrow keys and skip disabled tabs", async ({ page }) => {
      await open(page, "tabs", { renderer });
      const s = stage(page);
      const overview = s.getByRole("tab", { name: "Overview" });
      await overview.click();
      await page.keyboard.press("ArrowRight");
      await expect(s.getByRole("tab", { name: "Activity" })).toHaveAttribute("aria-selected", "true");
      await expect(s.getByRole("tabpanel")).toContainText("Latest changes");
      await page.keyboard.press("End");
      await expect(s.getByRole("tab", { name: "Members" })).toBeFocused();
      await page.keyboard.press("ArrowRight");
      await expect(overview).toBeFocused();
      const panel = s.getByRole("tabpanel");
      await expect(panel).toHaveCount(1);
      const tabId = await overview.getAttribute("id");
      await expect(panel).toHaveAttribute("aria-labelledby", tabId!);
    });

    test("tabs can have custom icons and support arrow navigation", async ({ page }) => {
      await open(page, "tabs", { renderer });
      const example = page.locator("#ex-icons").locator("xpath=ancestor::section");
      const code = example.getByRole("tab", { name: "Code" });
      await expect(code.locator("svg")).toBeVisible();
      await code.click();
      await page.keyboard.press("ArrowRight");
      const prs = example.getByRole("tab", { name: "Pull requests" });
      await expect(prs).toHaveAttribute("aria-selected", "true");
      await expect(prs.locator("svg")).toBeVisible();
      await expect(example.getByRole("tabpanel")).toContainText("Review open proposals");
    });

    test("switch toggles with Space", async ({ page }) => {
      await open(page, "switch", { renderer });
      const sw = stage(page).getByRole("switch", { name: "Share anonymous usage" });
      await sw.focus();
      await page.keyboard.press("Space");
      await expect(sw).toBeChecked();
    });

    test("tooltip shows on focus in the top layer and hides on Esc", async ({ page }) => {
      await open(page, "tooltip", { renderer });
      const trigger = stage(page).getByRole("button", { name: "Top" });
      await trigger.focus();
      const tip = page.getByRole("tooltip", { name: /Save changes/ });
      await expect(tip).toBeVisible();
      await expect(trigger).toHaveAttribute("aria-describedby", (await tip.getAttribute("id"))!);
      if (await tip.evaluate((el) => el.hasAttribute("popover"))) {
        expect(await tip.evaluate((el) => el.matches(":popover-open"))).toBe(true);
      }
      await page.keyboard.press("Escape");
      await expect(tip).toBeHidden();
    });

    test("popover opens next to its trigger and light-dismisses", async ({ page }) => {
      await open(page, "popover", { renderer });
      const trigger = stage(page).getByRole("button", { name: "Share" });
      await trigger.click();
      const pop = page.getByRole("dialog", { name: "Share this project" });
      await expect(pop).toBeVisible();
      await settle(pop);
      const t = (await trigger.boundingBox())!;
      const p = (await pop.boundingBox())!;
      expect(Math.abs(p.x - t.x)).toBeLessThan(2); // align="start"
      // Below the trigger, or flipped above it when there's no room: either way, right next to it.
      const gap = Math.min(Math.abs(p.y - (t.y + t.height)), Math.abs(t.y - (p.y + p.height)));
      expect(gap).toBeLessThan(20);
      await page.mouse.click(5, 5);
      await expect(pop).toBeHidden();
    });

    test("menu: keyboard model, disabled items skipped, select closes", async ({ page }) => {
      await open(page, "menu", { renderer });
      const trigger = stage(page).getByRole("button", { name: "Project actions" });
      await trigger.focus();
      await page.keyboard.press("Enter");
      const menu = page.getByRole("menu");
      await expect(menu).toBeVisible();
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expect(menu.getByRole("menuitem", { name: /Rename/ })).toBeFocused();
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await expect(menu.getByRole("menuitem", { name: "Delete project" })).toBeFocused();
      await page.keyboard.press("Home");
      await expect(menu.getByRole("menuitem", { name: /Rename/ })).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(menu).toBeHidden();
      await expect(trigger).toBeFocused();

      await trigger.click();
      await menu.getByRole("menuitem", { name: /Duplicate/ }).click();
      await expect(menu).toBeHidden();
    });

    test("menu: submenus, radio/check items, inline expand, keyboard flyout", async ({ page }) => {
      await open(page, "menu", { renderer });
      const captureTrigger = stage(page, 1).getByRole("button", { name: "Capture options" });
      await captureTrigger.click();

      const main = page.locator("#capture-menu-html, .ayy-menu").filter({ hasText: "Capture area" });
      await expect(main).toBeVisible();

      // Submenu trigger keyboard navigation
      const timerTrigger = main.getByRole("menuitem", { name: /Self-timer/ });
      await timerTrigger.focus();
      await page.keyboard.press("ArrowRight");

      const timerSub = page.locator("#submenu-timer, .ayy-menu--sub").filter({ hasText: "In 3 seconds" });
      await expect(timerSub).toBeVisible();
      await expect(timerTrigger).toHaveAttribute("aria-expanded", "true");

      // ArrowLeft closes submenu, leaves focus on parent trigger
      await page.keyboard.press("ArrowLeft");
      await expect(timerSub).toBeHidden();
      await expect(timerTrigger).toBeFocused();

      // Enter opens submenu and Esc closes only the submenu
      await page.keyboard.press("Enter");
      await expect(timerSub).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(timerSub).toBeHidden();
      await expect(main).toBeVisible();

      // Inline expandable group
      const advTrigger = main.getByRole("menuitem", { name: /Advanced options/ });
      await advTrigger.click();
      await expect(advTrigger).toHaveAttribute("aria-expanded", "true");
      const checkbox = main.getByRole("menuitemcheckbox", { name: "Include pointer" });
      await expect(checkbox).toBeVisible();

      // Radio selection checks item without closing by default
      await timerTrigger.click();
      await expect(timerSub).toBeVisible();
      const radio3s = timerSub.getByRole("menuitemradio", { name: "In 3 seconds" });
      await radio3s.click();
      await expect(radio3s).toHaveAttribute("aria-checked", "true");
      await expect(timerSub).toBeVisible();

      // Normal action item closes everything
      const fullScreen = main.getByRole("menuitem", { name: /Full screen/ });
      await fullScreen.click();
      await expect(main).toBeHidden();
      await expect(timerSub).toBeHidden();
    });

    test("menu: hovering the submenu panel keeps it open", async ({ page }) => {
      await open(page, "menu", { renderer });
      const captureTrigger = stage(page, 1).getByRole("button", { name: "Capture options" });
      await captureTrigger.click();

      const main = page.locator("#capture-menu-html, .ayy-menu").filter({ hasText: "Capture area" });
      const timerTrigger = main.getByRole("menuitem", { name: /Self-timer/ });
      await timerTrigger.hover();

      const timerSub = page.locator("#submenu-timer, .ayy-menu--sub").filter({ hasText: "In 3 seconds" });
      await expect(timerSub).toBeVisible();

      // Moving onto the panel itself must not close it (panel hover bubbles to the parent menu).
      await timerSub.getByRole("menuitemradio", { name: "In 5 seconds" }).hover();
      await expect(timerSub).toBeVisible();
      await page.waitForTimeout(300);
      await expect(timerSub).toBeVisible();
    });

    if (renderer === "react") {
      test("input group: password toggle and copy buttons reveal text, copy to clipboard and trigger toasts", async ({ page }) => {
        await open(page, "input", { renderer: "react" });
        const input = stage(page, 2).locator("#ig-password");
        const toggleBtn = stage(page, 2).getByRole("button", { name: "Show password" });
        await expect(input).toHaveAttribute("type", "password");
        await toggleBtn.focus();
        await expect(page.getByRole("tooltip", { name: "Show password" })).toBeVisible();
        await toggleBtn.click();
        await expect(input).toHaveAttribute("type", "text");
        await expect(page.locator(".ayy-toast").filter({ hasText: "Password revealed" })).toBeVisible();
        const hideBtn = stage(page, 2).getByRole("button", { name: "Hide password" });
        await expect(hideBtn).toBeVisible();
        await hideBtn.click();
        await expect(input).toHaveAttribute("type", "password");
        await expect(page.locator(".ayy-toast").filter({ hasText: "Password hidden" })).toBeVisible();

        const copyTokenBtn = stage(page, 2).getByRole("button", { name: "Copy token" });
        await copyTokenBtn.focus();
        await expect(page.getByRole("tooltip", { name: "Copy token" })).toBeVisible();
        await copyTokenBtn.click();
        await expect(page.locator(".ayy-toast").filter({ hasText: "Access token copied to clipboard" })).toBeVisible();

        const copyPasswordBtn = stage(page, 2).getByRole("button", { name: "Copy password" });
        await copyPasswordBtn.click();
        await expect(page.locator(".ayy-toast").filter({ hasText: "Password copied to clipboard" })).toBeVisible();
      });
    }

    test("select: a mouse opens ayywi's list, choosing fires change, the keyboard works", async ({ page }) => {
      await open(page, "select", { renderer });
      const select = stage(page).getByLabel("Region");
      await select.evaluate((el) => {
        (window as unknown as { changes: string[] }).changes = [];
        el.addEventListener("change", () => (window as unknown as { changes: string[] }).changes.push((el as HTMLSelectElement).value));
      });

      await select.click();
      const list = page.getByRole("listbox", { name: "Region" });
      await expect(list).toBeVisible();
      await expect(select).toHaveAttribute("aria-expanded", "true");
      await expect(list.getByRole("option", { name: "Europe" })).toHaveAttribute("aria-selected", "true");
      await expect(list.getByRole("option", { name: "Europe" })).toBeFocused();
      // Under the select, at least as wide.
      const s = (await select.boundingBox())!;
      const l = (await list.boundingBox())!;
      expect(Math.abs(l.y - (s.y + s.height))).toBeLessThan(12);
      // Layout width: the entry animation scales the box while it opens.
      expect(await list.evaluate((el) => (el as HTMLElement).offsetWidth)).toBeGreaterThanOrEqual(Math.floor(s.width));

      await list.getByRole("option", { name: "Asia Pacific" }).click();
      await expect(list).toBeHidden();
      await expect(select).toHaveValue("apac");
      await expect(select).toBeFocused();
      await expect(page.locator(".ayy-select__list")).toHaveCount(0);
      expect(await page.evaluate(() => (window as unknown as { changes: string[] }).changes)).toEqual(["apac"]);

      // Keyboard: Space opens on the chosen option, arrows move, Enter chooses; Esc closes without changing.
      await page.keyboard.press(" ");
      await expect(list.getByRole("option", { name: "Asia Pacific" })).toBeFocused();
      await page.keyboard.press("ArrowUp");
      await expect(list.getByRole("option", { name: "Europe" })).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(select).toHaveValue("eu");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("u");
      await expect(list.getByRole("option", { name: "United States" })).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(list).toBeHidden();
      await expect(select).toHaveValue("eu");
      await expect(select).toBeFocused();

      // Clicking the select while the list is open closes it.
      await select.click();
      await expect(list).toBeVisible();
      await select.click();
      await expect(list).toBeHidden();

      // Outside the stage, the list still takes its direction and theme.
      await stage(page).evaluate((el) => (el.setAttribute("dir", "rtl"), el.setAttribute("data-theme", "light")));
      await select.click();
      await expect(list).toHaveAttribute("dir", "rtl");
      await expect(list).toHaveAttribute("data-theme", "light");
      await page.keyboard.press("Escape");
      await stage(page).evaluate((el) => (el.removeAttribute("dir"), el.removeAttribute("data-theme")));

      // A disabled select opens nothing.
      await stage(page).getByLabel("Plan").click({ force: true });
      await expect(page.getByRole("listbox")).toHaveCount(0);
    });

    test("toast appears, runs its action, and sits above a modal dialog", async ({ page }) => {
      await open(page, "toast", { renderer });
      await page.evaluate(() => {
        (window as unknown as { ayywi: { toast: (m: string, o: object) => void } }).ayywi.toast("Project archived", {
          action: {
            label: "Undo",
            onClick: () => (window as unknown as { ayywi: { toast: (m: string) => void } }).ayywi.toast("Project restored"),
          },
        });
      });
      const toast = page.locator(".ayy-toaster .ayy-toast", { hasText: "Project archived" });
      await expect(toast).toBeVisible();
      // While the page is still busy loading, Chrome can hold the entry transition at its first frame, which passes
      // Playwright's stability check. The toast then lands between mousedown and mouseup, and the click is lost.
      await settle(toast);
      await toast.getByRole("button", { name: "Undo" }).click();
      await expect(page.locator(".ayy-toaster .ayy-toast", { hasText: "Project restored" })).toBeVisible();

      // Open a modal, then toast from inside it: the toast must still be clickable.
      await page.goto("/#/dialog");
      await stage(page).getByRole("button", { name: "Delete project" }).click();
      await page.evaluate(() => (window as unknown as { ayywi: { toast: (m: string, o: object) => void } }).ayywi.toast("Over modal", { action: { label: "Act", onClick: () => {} } }));
      const act = page.locator(".ayy-toast", { hasText: "Over modal" }).getByRole("button", { name: "Act" });
      await act.click(); // fails if the modal's inert backdrop covers it
      await expect(page.locator(".ayy-toast", { hasText: "Over modal" })).toBeHidden();

      // Basic stage single trigger button works
      await open(page, "toast", { renderer });
      const basicStage = stage(page, 0);
      await basicStage.getByRole("button", { name: "Trigger random toast" }).click();
      await expect(page.locator(".ayy-toaster .ayy-toast").first()).toBeVisible();

      // Stacking multiple text toasts: verify regular toasts maintain compact height and show all text on hover
      await page.evaluate(() => {
        document.querySelectorAll(".ayy-toaster .ayy-toast").forEach((el) => el.remove());
        const w = window as unknown as { ayywi: { toast: { (m: string): void; success: (m: string) => void } } };
        w.ayywi.toast("Default text");
        w.ayywi.toast.success("Success text");
      });
      const textToasts = page.locator(".ayy-toaster .ayy-toast:not(.ayy-toast--card)");
      await expect(textToasts).toHaveCount(2);

      // Front text toast has compact natural height (< 80px)
      const frontToastBox = await textToasts.last().boundingBox();
      expect(frontToastBox!.height).toBeLessThan(80);

      // Hover toaster: expands stack, both text toasts are fully visible with title and close buttons clickable
      await page.locator(".ayy-toaster").hover();
      await expect(page.locator(".ayy-toaster")).toHaveAttribute("data-expanded", "");
      for (const t of await textToasts.all()) {
        await expect(t.locator(".ayy-toast__title")).toBeVisible();
      }
      // Can close the older toast in the expanded stack
      await textToasts.first().locator(".ayy-toast__close").click();
      await expect(textToasts).toHaveCount(1);
    });

    test("open stack shows Clear all in its corner and clears every toast", async ({ page }) => {
      await open(page, "toast", { renderer });
      await page.evaluate(() => {
        document.querySelectorAll(".ayy-toaster .ayy-toast").forEach((el) => el.remove());
        const w = window as unknown as { ayywi: { toast: (m: string, o?: object) => void } };
        for (const m of ["One", "Two", "Three"]) w.ayywi.toast(m, { duration: Infinity });
      });
      const clear = page.locator(".ayy-toaster__clear");
      await expect(clear).toBeHidden();
      await page.locator(".ayy-toaster").hover();
      await expect(clear).toBeVisible();
      await clear.click();
      await expect(page.locator(".ayy-toaster .ayy-toast")).toHaveCount(0);
    });

    test("long text toast appears with copy button, copies text, and animates out", async ({ page }) => {
      await open(page, "toast", { renderer });
      await page.evaluate(() => {
        document.querySelectorAll(".ayy-toaster .ayy-toast").forEach((el) => el.remove());
        const w = window as unknown as { ayywi: { toast: { long: (m: string, o?: object) => void } } };
        w.ayywi.toast.long("Secret API key", { description: "whsec_test_secret_key_12345" });
      });
      const longToast = page.locator(".ayy-toaster .ayy-toast--long");
      await expect(longToast).toBeVisible();
      await expect(longToast.locator(".ayy-toast__copy")).toBeVisible();
      await longToast.locator(".ayy-toast__copy").click();
      await expect(longToast.locator(".ayy-toast__copy")).toHaveAttribute("data-copied", "");
      // Close button dismisses with leaving animation
      await longToast.locator(".ayy-toast__close").click();
      await expect(page.locator(".ayy-toaster .ayy-toast--long")).toBeHidden();
    });

    test("card toast appears, shows scrim on hover, and runs action", async ({ page }) => {
      await open(page, "toast", { renderer });
      const card = example(page, "types").locator(".ayy-toast--card[data-hover]").first();
      await expect(card).toBeVisible();

      // Trigger card toasts into the corner
      await page.evaluate(() => {
        for (let i = 0; i < 6; i++) {
          (window as any).ayywi.toast.card({
            src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='560' height='350'></svg>",
            alt: "Card preview",
          });
        }
      });
      const cornerCard = page.locator(".ayy-toaster .ayy-toast--card");
      await expect(cornerCard.first()).toBeVisible();

      const toaster = page.locator(".ayy-toaster");
      const oldestToast = toaster.locator(".ayy-toast[data-limited]");
      await expect(oldestToast).toHaveCount(1);

      // Hover toaster expands the stack and keeps toasts open
      await toaster.hover();
      await expect(toaster).toHaveAttribute("data-expanded", "");

      // In expanded stack, previous cards are fully interactable on hover
      const allCards = toaster.locator(".ayy-toast--card");
      const cardCount = await allCards.count();
      expect(cardCount).toBeGreaterThan(1);
      // Hover the older card in the stack: its scrim appears with working actions
      const olderCard = allCards.nth(cardCount - 2);
      await olderCard.hover();
      await expect(olderCard.locator(".ayy-toast__scrim")).toBeVisible();
      await expect(olderCard.locator(".ayy-toast__close")).toBeVisible();

      // Interacting with components inside does NOT collapse the open state
      await olderCard.locator(".ayy-toast__close").click();
      await expect(toaster).toHaveAttribute("data-expanded", "");

      // Wheel scroll on expanded toaster cycles through toasts
      await toaster.dispatchEvent("wheel", { deltaY: -120 });
      await expect.poll(() => toaster.evaluate((el) => el.style.getPropertyValue("--_toast-scroll-y"))).not.toBe("");

      // Hover preview card reveals actions with close button in top-right corner
      await card.hover();
      const closeBox = await card.locator(".ayy-toast__close").boundingBox();
      const cardBox = await card.boundingBox();
      expect(closeBox!.x + closeBox!.width).toBeGreaterThan(cardBox!.x + cardBox!.width - 50);

      const copyBtn = card.getByRole("button", { name: "Copy" });
      await expect(copyBtn).toBeVisible();
      await copyBtn.click();
    });

    test("carousel pages through its slides and stops at the ends", async ({ page }) => {
      await open(page, "carousel", { renderer });
      const region = stage(page).getByRole("region", { name: "AI assistant features" });
      const prev = region.getByRole("button", { name: "Previous" });
      const next = region.getByRole("button", { name: "Next" });
      const track = region.locator(".ayy-carousel__track");
      await expect(region.getByRole("group", { name: "1 of 5" })).toBeVisible();
      await expect(prev).toHaveAttribute("aria-disabled", "true");
      await expect(next).toHaveAttribute("aria-disabled", "false");
      await next.click();
      await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeGreaterThan(100);
      await expect(prev).toHaveAttribute("aria-disabled", "false");
      await track.evaluate((el) => el.scrollTo({ left: el.scrollWidth }));
      await expect(next).toHaveAttribute("aria-disabled", "true");
      expect(await next.evaluate((el) => (el as HTMLButtonElement).disabled)).toBe(false); // aria-disabled only, so focus isn't lost
    });

    test("table of contents marks the section being read", async ({ page }) => {
      await open(page, "toc", { renderer });
      const nav = stage(page).getByRole("navigation", { name: "Table of contents" });
      const impact = nav.getByRole("link", { name: /Impact/ });
      // Room below the example, so every section can scroll up to the reading line (the page itself is short).
      await page.locator(".pv-page").evaluate((el) => (el.style.paddingBlockEnd = "100vh"));
      await page.evaluate(() => {
        const target = document.getElementById("toc-impact")!;
        window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY - 8);
      });
      await expect(impact).toHaveAttribute("aria-current", "location");
      await expect(nav.locator("[aria-current]")).toHaveCount(1);

      await nav.getByRole("link", { name: /Tokens/ }).click();
      await expect(nav.getByRole("link", { name: "Tokens" })).toHaveAttribute("aria-current", "location");
      await expect(page).toHaveURL(/#\/toc$/); // in-page links don't change the preview route
    });

    test("table of contents shows a sticky pill bar on phones that opens a menu", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 800 });
      await open(page, "toc", { renderer, density: "touch" });
      const nav = stage(page).getByRole("navigation", { name: "Table of contents" });
      expect(await nav.evaluate((el) => getComputedStyle(el).position)).toBe("sticky");

      const toggle = nav.getByRole("button", { name: "Table of contents" });
      await expect(toggle).toBeVisible();
      await expect(toggle).toHaveAttribute("aria-expanded", "false");

      // The menu list should be hidden initially on mobile
      const list = nav.locator(".ayy-toc__list").first();
      await expect(list).toBeHidden();

      // Clicking the toggle opens the menu
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      await expect(list).toBeVisible();

      // Clicking an item in the menu navigates and closes the dropdown
      const impactLink = nav.getByRole("link", { name: /Impact/ });
      await impactLink.click();
      await expect(list).toBeHidden();
      await expect(toggle).toHaveAttribute("aria-expanded", "false");

      await page.setViewportSize({ width: 1280, height: 720 });
    });

    test("breadcrumb links are touch-sized and the trail stays on one line on phones", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 800 });
      await open(page, "breadcrumb", { renderer, density: "touch" });
      const list = stage(page).locator(".ayy-breadcrumb__list").first();
      await list.evaluate((el) => (el.style.maxInlineSize = "12rem"));
      const items = list.locator(".ayy-breadcrumb__item");
      const tops = await items.evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().top)));
      expect(new Set(tops).size).toBe(1);
      expect((await list.locator(".ayy-breadcrumb__link").first().boundingBox())!.height).toBeGreaterThanOrEqual(39.5);
      await page.setViewportSize({ width: 1280, height: 720 });
    });

    test("a card link covers the whole card", async ({ page }) => {
      await open(page, "card", { renderer });
      const card = stage(page, 2).locator(".ayy-card").first();
      await card.scrollIntoViewIfNeeded();
      const box = (await card.boundingBox())!;
      const hit = await page.evaluate(([x, y]) => document.elementFromPoint(x, y)?.closest("a")?.textContent, [box.x + box.width / 2, box.y + 24]);
      expect(hit).toBe("Oktopost");
    });

    test("charts: bars from --ayy-value, a data table for screen readers, lines mirror in RTL", async ({ page }) => {
      await open(page, "chart", { renderer });
      const bars = stage(page);
      await expect(bars.locator(".ayy-chart__column")).toHaveCount(6);
      await expect(bars.locator(".ayy-chart__bar")).toHaveCount(12);
      await expect(bars.locator(".ayy-chart__plot")).toHaveAttribute("aria-hidden", "true");
      await expect(bars.getByRole("table", { name: "Signups by device, April to September" })).toHaveCount(1);
      // The tallest bar (Sep desktop, 2,690 on a 3K scale) ends up ~90% of the plot, once the bars have grown in.
      const ratio = () =>
        bars.locator(".ayy-chart__plot").evaluate((plot) => {
          const tallest = Math.max(...Array.from(plot.querySelectorAll<HTMLElement>(".ayy-chart__bar"), (b) => b.offsetHeight));
          return Math.round((tallest / (plot as HTMLElement).offsetHeight) * 100);
        });
      await expect.poll(ratio).toBe(90);
      const line = stage(page, 1);
      // The comparison series is quiet, not the next series colour.
      const strokes = await line.locator(".ayy-chart__line").evaluateAll((paths) => paths.map((p) => getComputedStyle(p).stroke));
      expect(strokes[0]).not.toBe(strokes[1]);
      await rtl(line);
      expect(await line.locator(".ayy-chart__svg").evaluate((svg) => getComputedStyle(svg).scale)).toBe("-1 1");
    });

    test("table: header buttons sort the rows, the header checkbox selects them all", async ({ page }) => {
      await open(page, "table", { renderer });
      const table = stage(page, 1).getByRole("table");
      const firstAmount = () => table.locator("tbody tr").first().locator("td").nth(4);
      const amount = table.getByRole("button", { name: "Amount" });
      await amount.click();
      const header = amount.locator("xpath=ancestor::th");
      await expect(header).toHaveAttribute("aria-sort", "ascending");
      await expect(firstAmount()).toHaveText("$420.00");
      await expect(table.locator("th[aria-sort]")).toHaveCount(1);
      await amount.click();
      await expect(header).toHaveAttribute("aria-sort", "descending");
      await expect(firstAmount()).toHaveText("$3,150.00");
      const all = table.getByRole("checkbox", { name: "Select all invoices" });
      await all.check();
      await expect(table.locator('tbody tr[aria-selected="true"]')).toHaveCount(4);
      await table.getByRole("checkbox", { name: "Select INV-1044" }).uncheck();
      await expect(table.locator('tbody tr[aria-selected="true"]')).toHaveCount(3);
      await expect(all).toHaveJSProperty("indeterminate", true);
    });

    test("table actions: inline buttons, per-row ⋯ menu, and bulk action bar", async ({ page }) => {
      await open(page, "table", { renderer });
      const s = example(page, "actions");
      const table = s.getByRole("table");
      const bar = s.locator(".ayy-action-bar");

      await expect(bar).toHaveAttribute("open", "");
      await expect(bar.locator(".ayy-action-bar__count")).toHaveText("1 selected");

      // Selecting another row updates the action bar count
      await table.getByRole("checkbox", { name: "Select Mobile Onboarding Screenshots" }).check();
      await expect(bar.locator(".ayy-action-bar__count")).toHaveText("2 selected");

      // Per-row ⋯ menu opens and lists targeted actions
      const moreBtn = table.getByRole("button", { name: "More actions for Brand Kit 2026" });
      await moreBtn.click();
      const menu = s.locator(".ayy-menu:popover-open");
      await expect(menu).toBeVisible();
      await expect(menu.getByRole("menuitem", { name: /Duplicate/ })).toBeVisible();
      await expect(menu.getByRole("menuitem", { name: /Delete/ })).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(menu).toBeHidden();

      // Clicking Clear selection in the action bar unchecks all rows and hides the bar
      await bar.getByRole("button", { name: "Clear selection" }).click();
      await expect(bar).not.toHaveAttribute("open");
      await expect(table.locator('tbody tr[aria-selected="true"]')).toHaveCount(0);
    });

    test("action bar: roving tabindex, arrow keys, and Escape clears selection", async ({ page }) => {
      await open(page, "action-bar", { renderer });
      const s = stage(page);
      const bar = s.locator(".ayy-action-bar");
      await expect(bar).toHaveAttribute("open", "");
      await expect(bar.locator(".ayy-action-bar__count")).toHaveText("2 selected");

      const closeBtn = bar.getByRole("button", { name: "Clear selection" });
      const editBtn = bar.getByRole("button", { name: "Edit" });
      await closeBtn.focus();
      await page.keyboard.press("ArrowRight");
      await expect(editBtn).toBeFocused();

      await page.keyboard.press("Escape");
      await expect(bar).not.toHaveAttribute("open");
    });

    test("grid: card selection, select-all, per-item ⋯ menu, and bulk action bar", async ({ page }) => {
      await open(page, "grid", { renderer });
      const s = example(page, "media");
      const bar = s.locator(".ayy-action-bar");
      await expect(bar).toHaveAttribute("open", "");
      await expect(bar.locator(".ayy-action-bar__count")).toHaveText("2 selected");

      // Clicking a card header toggles selection
      const thirdCard = s.locator(".ayy-grid__item").nth(2);
      const selectAll = s.getByRole("checkbox", { name: "Select all media assets" });
      await expect(selectAll).toHaveJSProperty("indeterminate", true);
      await thirdCard.locator(".ayy-grid__header").click();
      await expect(thirdCard).toHaveAttribute("aria-selected", "true");
      await expect(s.locator('.ayy-grid__item[aria-selected="true"]')).toHaveCount(3);
      await expect(bar.locator(".ayy-action-bar__count")).toHaveText("3 selected");

      // Per-card ⋯ menu opens without toggling card selection
      const moreBtn = s.getByRole("button", { name: "More actions for Dashboard dark mode screenshot" });
      await moreBtn.click();
      const menu = s.locator(".ayy-menu:popover-open");
      await expect(menu).toBeVisible();
      await expect(menu.getByRole("menuitem", { name: /Archive/ })).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(menu).toBeHidden();
      await expect(s.locator('.ayy-grid__item[aria-selected="true"]')).toHaveCount(3);

      // Clear selection from action bar
      await bar.getByRole("button", { name: "Clear selection" }).click();
      await expect(bar).not.toHaveAttribute("open");
      await expect(s.locator('.ayy-grid__item[aria-selected="true"]')).toHaveCount(0);
    });

    test("chips are checkboxes and radios; checked ones draw a tick", async ({ page }) => {
      await open(page, "chip", { renderer });
      const status = stage(page).getByRole("group", { name: "Status" });
      const pending = status.getByRole("checkbox", { name: /Pending/ });
      await pending.focus();
      await page.keyboard.press("Space");
      await expect(pending).toBeChecked();
      const tick = (name: RegExp) => status.locator(".ayy-chip", { hasText: name }).evaluate((el) => getComputedStyle(el, "::before").content);
      expect(await tick(/Pending/)).toBe('""');
      expect(await tick(/Closed/)).toBe("none");
      const category = stage(page).getByRole("radiogroup", { name: "Category" });
      await category.getByRole("radio", { name: "Tea" }).check();
      await expect(category.getByRole("radio", { name: "All" })).not.toBeChecked();
    });

    test("combobox filters as you type, Enter picks, reopening lists everything", async ({ page }) => {
      await open(page, "combobox", { renderer });
      const input = stage(page).getByRole("combobox", { name: "Time zone" });
      const hint = stage(page).locator("#timezone-hint");
      // The list floats over the page: opening it must not push the hint down.
      const gap = async () => Math.round((await hint.boundingBox())!.y - (await input.boundingBox())!.y);
      const closed = await gap();
      await expect(input).toHaveValue("Lisbon");
      await input.fill("");
      await input.pressSequentially("jap");
      const listbox = page.getByRole("listbox");
      await expect(listbox).toBeVisible();
      expect(await gap()).toBe(closed);
      await expect(input).toHaveAttribute("aria-expanded", "true");
      await expect(listbox.getByRole("option")).toHaveCount(1);
      await expect(listbox.getByRole("option", { name: /Tokyo/ })).toHaveAttribute("aria-selected", "true");
      await page.keyboard.press("Enter");
      await expect(input).toHaveValue("Tokyo");
      await expect(listbox).toBeHidden();
      await page.keyboard.press("ArrowDown");
      await expect(listbox.getByRole("option")).toHaveCount(8);
      await expect(listbox.getByRole("option", { name: /Tokyo/ })).toHaveAttribute("aria-selected", "true");
      await page.keyboard.press("Escape");
      await expect(listbox).toBeHidden();
      await expect(stage(page).locator('input[type="hidden"][name="timezone"]')).toHaveValue("Asia/Tokyo");
    });

    test("checkbox colour: --ayy-check-color fills a checked box and outlines an empty one", async ({ page }) => {
      await open(page, "checkbox", { renderer });
      const boxes = example(page, "colored").getByRole("checkbox");
      const danger = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--ayy-color-destructive"));
      expect(danger).not.toBe("");
      const checked = await boxes.nth(0).evaluate((el) => getComputedStyle(el).backgroundColor);
      const empty = await boxes.nth(1).evaluate((el) => getComputedStyle(el).borderColor);
      const checkedLow = await boxes.nth(2).evaluate((el) => getComputedStyle(el).backgroundColor);
      expect(checked).not.toBe(checkedLow);
      expect(empty).not.toBe(checked);
      const primary = await boxes.nth(0).evaluate((el) => {
        const probe = document.createElement("span");
        probe.style.backgroundColor = "var(--ayy-color-primary)";
        el.after(probe);
        const color = getComputedStyle(probe).backgroundColor;
        probe.remove();
        return color;
      });
      expect(checked).not.toBe(primary);
    });

    test("settings: a choice group in a stacked row doesn't stretch the row", async ({ page }) => {
      await page.setViewportSize({ width: 1000, height: 800 });
      await open(page, "settings", { renderer });
      const row = example(page, "theme").locator(".ayy-settings__row--stack");
      const group = row.locator(".ayy-choice-group");
      const rowBox = (await row.boundingBox())!;
      const groupBox = (await group.boundingBox())!;
      const textBox = (await row.locator(".ayy-settings__text").boundingBox())!;
      // The row is its padding, the text, the gap and the group, and nothing more.
      expect(rowBox.height).toBeLessThan(textBox.height + groupBox.height + 24 + 8 + 4);
    });

    test("number field steps with its buttons and stops at max; sliders fill to the thumb", async ({ page }) => {
      await open(page, "number-field", { renderer });
      const guests = stage(page).getByRole("spinbutton", { name: "Guests" });
      const add = stage(page).getByRole("button", { name: "Add a guest" });
      await add.click();
      await expect(guests).toHaveValue("3");
      for (let i = 0; i < 5; i++) await add.click();
      await expect(guests).toHaveValue("8");
      await expect(add).toHaveAttribute("aria-disabled", "true");
      // aria-disabled, not disabled: still clickable and focusable, it just does nothing (Playwright waits on it unless forced).
      await add.click({ force: true });
      await expect(guests).toHaveValue("8");
      await expect(add).toBeFocused();

      await open(page, "slider", { renderer });
      const size = stage(page).getByRole("slider", { name: "Class size" });
      const fill = () => size.evaluate((el) => Number(getComputedStyle(el).getPropertyValue("--ayy-value")));
      const before = await fill();
      await size.focus();
      await page.keyboard.press("End");
      await expect(size).toHaveValue("30");
      await expect.poll(fill).toBe(100);
      expect(before).toBeLessThan(100);
      const range = stage(page, 1);
      const low = range.getByRole("slider", { name: "Minimum price" });
      await low.focus();
      await page.keyboard.press("End");
      // The lower thumb stops at the upper one.
      await expect(low).toHaveValue("64");
    });

    test("choice cards pick one plan; the drop zone marks a drag", async ({ page }) => {
      await open(page, "choice-card", { renderer });
      const plans = stage(page).getByRole("radiogroup", { name: "Plan" });
      await plans.locator(".ayy-choice-card", { hasText: "Business" }).click();
      await expect(plans.getByRole("radio", { name: /Business/ })).toBeChecked();
      await expect(plans.getByRole("radio", { name: /Pro/ })).not.toBeChecked();

      await open(page, "dropzone", { renderer });
      const zone = stage(page).locator(".ayy-dropzone").first();
      const transfer = await page.evaluateHandle(() => {
        const dt = new DataTransfer();
        dt.items.add(new File(["x"], "studio.png", { type: "image/png" }));
        return dt;
      });
      await zone.locator("input").dispatchEvent("dragenter", { dataTransfer: transfer });
      await expect(zone).toHaveAttribute("data-dragging", "");
      await zone.locator("input").dispatchEvent("drop", { dataTransfer: transfer });
      await expect(zone).not.toHaveAttribute("data-dragging");
    });

    test("date range picker selects start and end dates and updates its trigger", async ({ page }) => {
      await open(page, "date-time-picker", { renderer });
      const trigger = example(page, "range").getByRole("button", { name: "Dates of stay" });
      await trigger.evaluate((el) => el.scrollIntoView({ block: "center" }));
      await trigger.click();
      const popover = example(page, "range").locator(".ayy-popover");
      await expect(popover).toBeVisible();
      await popover.locator('.ayy-date-range__period[data-view="years"]').first().click();
      await expect(popover.locator(".ayy-date-range__years")).toBeVisible();
      await popover.locator('.ayy-date-range__cell[data-year="2027"]').click();
      await popover.locator('.ayy-date-range__period[data-view="months"]').first().click();
      await expect(popover.locator(".ayy-date-range__months")).toBeVisible();
      await popover.locator('.ayy-date-range__cell[data-month="2027-05-01"]').click();
      await popover.locator('.ayy-date-range__day[data-date="2027-05-10"]').first().click();
      await expect(popover).toBeVisible();
      await popover.locator('.ayy-date-range__day[data-date="2027-05-15"]').first().click();
      await expect(popover).toHaveCount(1);
      await expect(popover.locator(".ayy-date-range")).toHaveCount(1);
      await expect(popover).toBeHidden();
      await expect(trigger.locator(".ayy-date-range-picker__value")).toContainText("10");
      await expect(trigger.locator(".ayy-date-range-picker__value")).toContainText("15");
      await expect(trigger.locator(".ayy-date-range-picker__value")).toContainText("2027");
    });

    test("time picker selects hours, minutes and updates trigger", async ({ page }) => {
      await open(page, "date-time-picker", { renderer });
      const trigger = example(page, "time").getByRole("button", { name: "Meeting time" });
      await trigger.evaluate((el) => el.scrollIntoView({ block: "center" }));
      await trigger.click();
      const popover = example(page, "time").locator(".ayy-popover");
      await expect(popover).toBeVisible();
      await popover.getByRole("listbox", { name: "Hours" }).getByRole("option", { name: "14" }).click();
      await popover.getByRole("listbox", { name: "Minutes" }).getByRole("option", { name: "45" }).click();
      await expect(trigger.locator(".ayy-time-picker-trigger__value")).toHaveText("14:45");
      await page.keyboard.press("Escape");
      await expect(popover).toBeHidden();
      await expect(popover.locator(".ayy-time-picker")).toHaveCount(1);
    });

    test("time picker allows manual input in selector to identify hours and minutes", async ({ page }) => {
      await open(page, "date-time-picker", { renderer });
      const trigger = example(page, "time").getByRole("button", { name: "Meeting time" });
      await trigger.evaluate((el) => el.scrollIntoView({ block: "center" }));
      await trigger.click();
      const popover = example(page, "time").locator(".ayy-popover");
      await expect(popover).toBeVisible();

      const hourInput = popover.getByRole("textbox", { name: "Hours" });
      const minuteInput = popover.getByRole("textbox", { name: "Minutes" });
      await expect(hourInput).toBeVisible();
      await expect(minuteInput).toBeVisible();

      await hourInput.fill("11");
      await minuteInput.fill("30");

      // Verify that the columns identify and select the typed time
      await expect(popover.getByRole("listbox", { name: "Hours" }).getByRole("option", { name: "11" })).toHaveAttribute("aria-selected", "true");
      await expect(popover.getByRole("listbox", { name: "Minutes" }).getByRole("option", { name: "30" })).toHaveAttribute("aria-selected", "true");
      await expect(trigger.locator(".ayy-time-picker-trigger__value")).toHaveText("11:30");
      await page.keyboard.press("Escape");
    });

    test("date picker container width does not change when switching between days, months, and years", async ({ page }) => {
      await open(page, "date-time-picker", { renderer });
      const grid = example(page, "presets").locator(".ayy-date-picker-grid");
      const initialBox = await grid.boundingBox();
      expect(initialBox).not.toBeNull();

      // Switch to months view
      const monthBtn = grid.locator('.ayy-date-picker-grid__period[data-view="months"]');
      await monthBtn.click();
      const monthsBox = await grid.boundingBox();
      expect(monthsBox?.width).toBeCloseTo(initialBox!.width, 1);

      // Switch to years view
      const yearBtn = grid.locator('.ayy-date-picker-grid__period[data-view="years"]');
      await yearBtn.click();
      const yearsBox = await grid.boundingBox();
      expect(yearsBox?.width).toBeCloseTo(initialBox!.width, 1);
    });

    test("date & time picker selects both date and time", async ({ page }) => {
      await open(page, "date-time-picker", { renderer });
      const trigger = example(page, "date-time").getByRole("button", { name: "Flight departure" });
      await trigger.evaluate((el) => el.scrollIntoView({ block: "center" }));
      await trigger.click();
      const popover = example(page, "date-time").locator(".ayy-popover");
      await expect(popover).toBeVisible();
      await popover.locator('.ayy-date-picker-grid__day[data-date="2026-10-18"]').click();
      await popover.getByRole("listbox", { name: "Hours" }).getByRole("option", { name: "16" }).click();
      await expect(trigger.locator(".ayy-date-time-picker-trigger__value")).toContainText("18");
      await expect(trigger.locator(".ayy-date-time-picker-trigger__value")).toContainText("16");
      await page.keyboard.press("Escape");
      await expect(popover).toBeHidden();
      await expect(popover.locator(".ayy-date-time-picker")).toHaveCount(1);
    });

    test("date picker clear and today buttons update value", async ({ page }) => {
      await open(page, "date-time-picker", { renderer });
      const trigger = example(page, "basic").getByRole("button", { name: "Check-in" });
      await trigger.evaluate((el) => el.scrollIntoView({ block: "center" }));
      await trigger.click();
      const popover = example(page, "basic").locator(".ayy-popover");
      await expect(popover).toBeVisible();

      // Click Today button
      const todayBtn = popover.getByRole("button", { name: "Today" });
      await expect(todayBtn).toBeVisible();
      await todayBtn.click();
      await expect(popover).toBeHidden();
      await expect(trigger.locator(".ayy-date-picker__value")).not.toBeEmpty();

      // Open again and click Clear button
      await trigger.click();
      await expect(popover).toBeVisible();
      const clearBtn = popover.getByRole("button", { name: "Clear" });
      await expect(clearBtn).toBeVisible();
      await clearBtn.click();
      await expect(popover).toBeHidden();
      await expect(trigger.locator(".ayy-date-picker__value")).toBeEmpty();
    });

    test("date range picker clear and today buttons update value", async ({ page }) => {
      await open(page, "date-time-picker", { renderer });
      const trigger = example(page, "range").getByRole("button", { name: "Dates of stay" });
      await trigger.evaluate((el) => el.scrollIntoView({ block: "center" }));
      await trigger.click();
      const popover = example(page, "range").locator(".ayy-popover");
      await expect(popover).toBeVisible();

      // Click Clear button
      const clearBtn = popover.getByRole("button", { name: "Clear" });
      await expect(clearBtn).toBeVisible();
      await clearBtn.click();
      await expect(popover).toBeHidden();
      await expect(trigger.locator(".ayy-date-range-picker__value")).toBeEmpty();

      // Open again and click Today button
      await trigger.click();
      await expect(popover).toBeVisible();
      const todayBtn = popover.getByRole("button", { name: "Today" });
      await expect(todayBtn).toBeVisible();
      await todayBtn.click();
      await expect(popover).toBeHidden();
      await expect(trigger.locator(".ayy-date-range-picker__value")).not.toBeEmpty();
    });

    test("date & time picker clear and today buttons update value", async ({ page }) => {
      await open(page, "date-time-picker", { renderer });
      const trigger = example(page, "date-time").getByRole("button", { name: "Flight departure" });
      await trigger.evaluate((el) => el.scrollIntoView({ block: "center" }));
      await trigger.click();
      const popover = example(page, "date-time").locator(".ayy-popover");
      await expect(popover).toBeVisible();

      // Click Clear button
      const clearBtn = popover.getByRole("button", { name: "Clear" });
      await expect(clearBtn).toBeVisible();
      await clearBtn.click();
      await expect(popover).toBeHidden();
      await expect(trigger.locator(".ayy-date-time-picker-trigger__value")).toBeEmpty();

      // Open again and click Today button
      await trigger.click();
      await expect(popover).toBeVisible();
      const todayBtn = popover.getByRole("button", { name: "Today" });
      await expect(todayBtn).toBeVisible();
      await todayBtn.click();
      await expect(popover).toBeHidden();
      await expect(trigger.locator(".ayy-date-time-picker-trigger__value")).not.toBeEmpty();
    });

    test("color picker updates from area keyboard, hex input and preset swatches", async ({ page }) => {
      await open(page, "color-picker", { renderer });
      const picker = example(page, "basic").locator(".ayy-color-picker");
      const area = picker.getByRole("slider", { name: "Color saturation and brightness" });
      const hex = picker.getByRole("textbox", { name: "Hex color" });
      await expect(hex).toHaveValue("#2563eb");

      const redSwatch = picker.getByRole("button", { name: "#ef4444" });
      await redSwatch.click();
      await expect(hex).toHaveValue("#ef4444");
      await expect(redSwatch).toHaveAttribute("aria-pressed", "true");

      await area.focus();
      await page.keyboard.press("Shift+ArrowDown");
      await expect(hex).not.toHaveValue("#ef4444");
    });

    test("code block copy button enters copied state on click", async ({ page }) => {
      await open(page, "code-block", { renderer });
      const copyBtn = example(page, "basic").getByRole("button", { name: "Copy code" });
      await copyBtn.click();
      await expect(example(page, "basic").locator(".ayy-code-block__copy")).toHaveAttribute("data-copied", "true");
      await expect(example(page, "basic").locator(".ayy-code-block__copy")).toHaveAttribute("aria-label", "Copied!");
    });
  });
}

test("React checkbox supports indeterminate", async ({ page }) => {
  await open(page, "checkbox", { renderer: "react" });
  const box = stage(page).getByRole("checkbox", { name: "Select all projects" });
  expect(await box.evaluate((el) => (el as HTMLInputElement).indeterminate)).toBe(true);
});

test("dialog animates out before it closes", async ({ page }) => {
  await open(page, "dialog", { renderer: "html" });
  await stage(page).getByRole("button", { name: "Delete project" }).click();
  const dialog = page.getByRole("dialog", { name: "Delete Marketing site?" });
  await expect(dialog).toBeVisible();
  const duration = await dialog.evaluate((el) => getComputedStyle(el).transitionDuration);
  expect(duration.split(",").some((d) => parseFloat(d) > 0)).toBe(true);
});

test("side modal slides from the end edge in RTL too, and side-start mirrors it", async ({ page }) => {
  await open(page, "dialog", { renderer: "html" });
  const s = stage(page, 2);
  const dialog = page.getByRole("dialog", { name: "Project settings" });
  const closed = s.locator("dialog"); // a closed <dialog> isn't in the accessibility tree
  const vw = page.viewportSize()!.width;
  const left = async () => {
    await s.getByRole("button", { name: "Project settings" }).click();
    await expect(dialog).toBeVisible();
    await settle(dialog);
    return (await dialog.boundingBox())!.x;
  };
  expect(await closed.evaluate((el) => getComputedStyle(el).transitionProperty)).toContain("inset-inline-end");

  await rtl(s);
  expect(await left()).toBeLessThan(1);
  await page.mouse.click(vw - 5, 5); // the backdrop is on the right now
  await expect(dialog).toBeHidden();

  await s.evaluate((el) => el.removeAttribute("dir"));
  await closed.evaluate((el) => el.classList.replace("ayy-dialog--side-end", "ayy-dialog--side-start"));
  expect(await left()).toBeLessThan(1);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("directional icons mirror under the nearest dir attribute", async ({ page }) => {
  await open(page, "icon", { renderer: "html" });
  const s = stage(page, 2);
  const flip = (nav: string) =>
    s.getByRole("navigation", { name: nav }).locator("svg").evaluateAll((els) => els.map((el) => getComputedStyle(el).scale.split(" ")[0]));
  expect(await flip("Pagination")).toEqual(["1", "1"]);
  expect(await flip("עימוד")).toEqual(["-1", "-1"]);
  // An LTR island inside RTL takes its own direction back.
  await s.evaluate((el) => el.setAttribute("dir", "rtl"));
  await s.getByRole("navigation", { name: "Pagination" }).evaluate((el) => el.setAttribute("dir", "ltr"));
  expect(await flip("Pagination")).toEqual(["1", "1"]);
});

test("icons: sizes come from tokens, auto follows the text", async ({ page }) => {
  await open(page, "icon", { renderer: "html" });
  const icons = stage(page).locator("svg.ayy-icon");
  const widths = await icons.evaluateAll((els) => els.slice(0, 4).map((el) => el.getBoundingClientRect().width));
  expect(widths).toEqual([16, 20, 24, 32]);
  const heading = stage(page).locator(".ayy-h4");
  const [font, icon] = await heading.evaluate((el) => [parseFloat(getComputedStyle(el).fontSize), el.querySelector("svg")!.getBoundingClientRect().width]);
  expect(Math.abs(icon - font * 1.25)).toBeLessThan(0.5);
});

for (const renderer of ["react", "html"] as const) {
  test(`avatar hides a failed image so initials show (${renderer})`, async ({ page }) => {
    await open(page, "avatar", { renderer });
    const avatar = example(page, "fallback").getByRole("img", { name: "Broken Image" });
    await expect(avatar.locator(".ayy-avatar__fallback")).toBeVisible();
    await expect(avatar.locator("img")).toHaveCount(renderer === "react" ? 0 : 1);
    if (renderer === "html") await expect(avatar.locator("img")).toBeHidden();
  });
}

test.describe("select on a touch screen", () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 800 } });

  test("keeps the OS picker: no ayywi list opens", async ({ page }) => {
    await open(page, "select");
    const select = stage(page).getByLabel("Region");
    expect(await select.evaluate((el) => (window as unknown as { ayywi?: unknown }) && matchMedia("(pointer: fine)").matches)).toBe(false);
    await select.tap();
    await expect(page.locator(".ayy-select__list")).toHaveCount(0);
  });
});

test("page-header mobile preview sizes to its content without empty bottom space", async ({ page }) => {
  await open(page, "page-header");
  const mobileRadio = page.getByRole("radio", { name: "Mobile" });
  await mobileRadio.click();
  const iframe = page.locator(".pv-stage__iframe");
  await expect(iframe).toBeVisible();
  await page.waitForTimeout(300);
  const box = await iframe.boundingBox();
  expect(box?.height).toBeLessThan(350);
  expect(box?.height).toBeGreaterThan(100);
});

