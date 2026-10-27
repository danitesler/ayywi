import { expect, test, type Page } from "@playwright/test";
import { example, keyboardFocus, open, rtl, settle, stage } from "./helpers";

/** The app shell playground's toolbar switch. Inert in the HTML renderer: use pgSetup() there instead. */
async function pgSwitch(page: Page, name: string, on: boolean) {
  const ex = page.locator('.pv-example[aria-labelledby="ex-playground"]');
  const propsBtn = ex.getByRole("button", { name: "Props" });
  await expect(propsBtn).toBeVisible();
  const popover = ex.locator(".pv-props-popover");
  if (!(await popover.isVisible())) await propsBtn.click();
  await expect(popover).toBeVisible();
  const sw = popover.getByRole("switch", { name });
  await expect(sw).toBeVisible();
  if ((await sw.isChecked()) !== on) {
    await sw.click();
    await expect(sw).toBeChecked({ checked: on });
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
      // Measure the resting column, rather than the last few pixels of its collapse transition.
      await shell.evaluate((el) => Promise.all(el.getAnimations().map((animation) => animation.finished)));

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

      // Toggle again collapses it. The rail slides out from under the stationary pointer; the hold keeps the
      // preview shut on the way out, then lets go once the pointer is clear. A broken hold would stick the preview
      // open under the pointer instead of settling back to the rail.
      const icon = sidebar.locator(".ayy-app-shell__link:has(svg)").first().locator("svg");
      const iconXOpen = (await icon.boundingBox())!.x;
      await toggle.click();
      await expect(shell).toHaveClass(/ayy-app-shell--collapsed/);
      await expect.poll(async () => Math.round((await sidebar.boundingBox())!.width)).toBeLessThan(70);
      await settle(sidebar);
      expect(Math.round((await sidebar.boundingBox())!.width)).toBeLessThan(70);
      // The icons barely move between the open sidebar and the rail: rows keep their place.
      expect(Math.abs((await icon.boundingBox())!.x - iconXOpen)).toBeLessThan(6);
      // Coming back previews again, and leaving collapses it back.
      await sidebar.hover();
      await expect.poll(async () => Math.round((await sidebar.boundingBox())!.width)).toBeGreaterThan(200);
      await main.hover();
      await expect.poll(async () => Math.round((await sidebar.boundingBox())!.width)).toBeLessThan(70);
    });

    test("app shell sidebar toggle names its action in a tooltip", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await open(page, "app-shell", { renderer });
      const shell = pgShell(page);
      const toggle = shell.locator(".ayy-app-shell__head .ayy-app-shell__toggle");
      const tip = toggle.locator("xpath=..").getByRole("tooltip");

      await toggle.hover();
      await expect(tip).toBeVisible();
      await expect(tip).toHaveText("Collapse");
      await expect(toggle).toHaveAccessibleName("Collapse sidebar");

      // The next click collapses, and the label and tooltip say so.
      await shell.locator(".ayy-app-shell__main").hover();
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      await expect(toggle).toHaveAccessibleName("Expand sidebar");
      await page.mouse.move(0, 0);
      await toggle.hover();
      await expect(tip).toHaveText("Expand");
    });

    test("app shell parts: a row's More button opens the row's menu", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await open(page, "app-shell", { renderer });
      const shell = example(page, "parts").locator(".ayy-app-shell");
      const row = shell.locator(".ayy-app-shell__row").first();
      const more = row.getByRole("button", { name: "Project options" });
      await expect(more).toHaveCSS("opacity", "0");
      await row.hover();
      await expect(more).toHaveCSS("opacity", "1");

      await more.click();
      const menu = page.getByRole("menu").filter({ hasText: "New project" });
      await expect(menu).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(menu).toBeHidden();
      await expect(more).toBeFocused();
      // The link is still its own target: the menu came from the button beside it, not the row.
      await expect(row.getByRole("link", { name: /Projects/ })).toBeVisible();
    });

    test("app shell parts: an uncontrolled shell's toggle follows the state too", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await open(page, "app-shell", { renderer });
      const shell = example(page, "parts").locator(".ayy-app-shell");
      const toggle = shell.locator(".ayy-app-shell__head .ayy-app-shell__toggle");
      const tip = toggle.locator("xpath=..").getByRole("tooltip");

      await toggle.click();
      await expect(shell).toHaveClass(/ayy-app-shell--collapsed/);
      await expect(toggle).toHaveAccessibleName("Expand sidebar");
      await page.mouse.move(0, 0);
      await toggle.hover();
      await expect(tip).toHaveText("Expand");
    });

    test("app shell logo: mark, link icons and toggle share one axis; in the rail the pointer on the mark swaps in the toggle", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await open(page, "app-shell", { renderer });
      if (renderer === "react") {
        await pgSwitch(page, "Collapsed sidebar", true);
        await pgSwitch(page, "Hover preview", false);
      } else {
        await pgShell(page).evaluate((el) => el.classList.add("ayy-app-shell--collapsed"));
        await pgShell(page).evaluate((el) => el.classList.remove("ayy-app-shell--hover-preview"));
      }
      const shell = pgShell(page);
      const sidebar = shell.locator(".ayy-app-shell__sidebar");
      const main = shell.locator(".ayy-app-shell__main");
      const mark = sidebar.locator(".ayy-app-shell__head .ayy-app-shell__brand > svg");
      const toggle = sidebar.locator(".ayy-app-shell__head .ayy-app-shell__toggle");
      const centre = async (loc: ReturnType<typeof sidebar.locator>) => {
        const box = (await loc.boundingBox())!;
        return box.x + box.width / 2;
      };
      const axes = async () => {
        const icons = sidebar.locator(".ayy-app-shell__link:has(> svg) > svg");
        const xs = [await centre(mark), await centre(toggle.locator("svg"))];
        for (let i = 0; i < Math.min(await icons.count(), 3); i++) xs.push(await centre(icons.nth(i)));
        return xs;
      };
      const flat = (xs: number[]) => Math.max(...xs) - Math.min(...xs);

      await expect.poll(async () => Math.round((await sidebar.boundingBox())!.width)).toBeLessThan(70);
      await expect.poll(async () => flat(await axes())).toBeLessThan(0.75);
      // At rest the rail shows the mark; the toggle waits underneath.
      await expect(toggle).toHaveCSS("opacity", "0");
      await expect(mark).toHaveCSS("opacity", "1");
      // Resting on the mark swaps it for the toggle; the rail stays narrow (no hover preview here).
      await sidebar.locator(".ayy-app-shell__head").hover();
      await expect(toggle).toHaveCSS("opacity", "1");
      await expect(mark).toHaveCSS("opacity", "0");
      expect(Math.round((await sidebar.boundingBox())!.width)).toBeLessThan(70);
      // Clicking it expands the sidebar; the axis holds, and the toggle is now at the inline end of the row.
      await toggle.click();
      await expect(shell).not.toHaveClass(/ayy-app-shell--collapsed/);
      await expect.poll(async () => Math.round((await sidebar.boundingBox())!.width)).toBeGreaterThan(200);
      await main.hover();
      await expect(mark).toHaveCSS("opacity", "1");
      await expect
        .poll(async () => {
          const xs = await axes();
          return flat([xs[0], ...xs.slice(2)]);
        })
        .toBeLessThan(0.75);
      const sideBox = (await sidebar.boundingBox())!;
      const toggleBox = (await toggle.boundingBox())!;
      expect(toggleBox.x).toBeGreaterThan(sideBox.x + sideBox.width / 2);
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

      // Closing must keep the sidebar edge aligned with the moving content, with no hover-close delay.
      await shell.evaluate((el) => {
        for (const animation of el.getAnimations({ subtree: true })) animation.finish();
        el.querySelector<HTMLButtonElement>(".ayy-app-shell__toggle")!.click();
      });
      const closing = await shell.evaluate((el) => {
        const sidebar = el.querySelector<HTMLElement>(".ayy-app-shell__sidebar")!;
        const main = el.querySelector<HTMLElement>(".ayy-app-shell__main")!;
        void sidebar.offsetWidth;
        for (const animation of el.getAnimations({ subtree: true })) {
          animation.pause();
          animation.currentTime = 1000;
        }
        return { width: sidebar.getBoundingClientRect().width, column: main.offsetLeft - sidebar.offsetLeft };
      });
      expect(closing.width).toBeGreaterThan(70);
      expect(closing.width).toBeLessThan(230);
      expect(Math.abs(closing.width - closing.column)).toBeLessThan(1);
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
      // After pointer use focus alone doesn't open it; a keyboard user's focus does.
      await trigger.focus();
      const tip = page.getByRole("tooltip", { name: /Save changes/ });
      await expect(tip).toBeHidden();
      await keyboardFocus(trigger);
      await expect(tip).toBeVisible();
      await expect(trigger).toHaveAttribute("aria-describedby", (await tip.getAttribute("id"))!);
      if (await tip.evaluate((el) => el.hasAttribute("popover"))) {
        expect(await tip.evaluate((el) => el.matches(":popover-open"))).toBe(true);
      }
      await page.keyboard.press("Escape");
      await expect(tip).toBeHidden();
    });

    test("icon-only buttons show tooltip on hover", async ({ page }) => {
      await open(page, "button", { renderer });
      const trigger = stage(page, 2).getByRole("button", { name: "Add item" }).first();
      await trigger.hover();
      const tip = page.getByRole("tooltip", { name: /Add item/ }).first();
      await expect(tip).toBeVisible();
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
      const menu = example(page, "actions").locator(".ayy-menu:not(.ayy-menu--sub)");
      await expect(menu).toBeVisible();
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expect(menu.getByRole("menuitem", { name: /Rename/ })).toBeFocused();
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("End");
      await expect(menu.getByRole("menuitem", { name: "Delete project" })).toBeFocused();
      await page.keyboard.press("Home");
      await expect(menu.getByRole("menuitem", { name: /Rename/ })).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(menu).toBeHidden();
      await expect(trigger).toBeFocused();

      await trigger.click();
      await menu.getByRole("menuitem", { name: /^Duplicate/ }).click();
      await expect(menu).toBeHidden();
    });

    test("menu: submenus, radio/check items, inline expand, keyboard flyout", async ({ page }) => {
      await open(page, "menu", { renderer });
      const captureTrigger = example(page, "actions").getByRole("button", { name: "Project actions" });
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

    test("menu: a split row's trailing button opens the item's own menu", async ({ page }) => {
      await open(page, "menu", { renderer });
      const ex = example(page, "actions");
      // Open from the keyboard: a pointer resting where the menu opens would move focus by hovering an item.
      await ex.getByRole("button", { name: "Project actions" }).press("Enter");
      const menu = page.locator(".ayy-menu:not(.ayy-menu--sub)").filter({ hasText: "Archive project" });
      await expect(menu).toBeVisible();

      // The trailing button is the row's second menuitem: arrows reach it, and it opens a panel.
      const more = menu.getByRole("menuitem", { name: "More options for Duplicate" });
      await menu.getByRole("menuitem", { name: /^Duplicate/ }).focus();
      await page.keyboard.press("ArrowDown");
      await expect(more).toBeFocused();
      await page.keyboard.press("ArrowRight");
      const sub = page.locator(".ayy-menu--sub").filter({ hasText: "Without comments" });
      await expect(sub).toBeVisible();
      await expect(sub.getByRole("menuitem", { name: "Without comments" })).toBeFocused();

      // Esc closes only the row's menu; choosing there closes both.
      await page.keyboard.press("Escape");
      await expect(sub).toBeHidden();
      await expect(menu).toBeVisible();
      await more.click();
      await sub.getByRole("menuitem", { name: "Without comments" }).click();
      await expect(menu).toBeHidden();
    });

    test("menu: split-row options open only on click and clear pointer highlight", async ({ page }) => {
      await open(page, "menu", { renderer });
      await example(page, "actions").getByRole("button", { name: "Project actions" }).click();
      const more = page.getByRole("menuitem", { name: "More options for Duplicate" });
      const sub = page.locator(".ayy-menu--sub").filter({ hasText: "Without comments" });
      await more.hover();
      await page.waitForTimeout(200);
      await expect(sub).toBeHidden();
      await more.click();
      await expect(sub).toBeVisible();
      await expect(sub.getByRole("menuitem", { name: "Without comments" })).toBeFocused();
      await page.keyboard.press("Escape");
      await page.mouse.move(5, 5);
      await expect(more).toBeFocused();
      await more.click();
      await page.mouse.move(5, 5);
      await expect(more).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    });

    test("menu: hovering the submenu panel keeps it open", async ({ page }) => {
      await open(page, "menu", { renderer });
      const captureTrigger = example(page, "actions").getByRole("button", { name: "Project actions" });
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
        await keyboardFocus(toggleBtn);
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
        await keyboardFocus(copyTokenBtn);
        await expect(page.getByRole("tooltip", { name: "Copy token" })).toBeVisible();
        await copyTokenBtn.click();
        await expect(page.locator(".ayy-toast").filter({ hasText: "Access token copied to clipboard" })).toBeVisible();

        const copyPasswordBtn = stage(page, 2).getByRole("button", { name: "Copy password" });
        await copyPasswordBtn.click();
        await expect(page.locator(".ayy-toast").filter({ hasText: "Password copied to clipboard" })).toBeVisible();
      });

      test("preview header and table icon-only buttons show tooltip on hover", async ({ page }) => {
        await open(page, "table", { renderer: "react" });
        const appearanceBtn = page.getByRole("button", { name: "Appearance" });
        await appearanceBtn.hover();
        await expect(page.getByRole("tooltip", { name: "Appearance" })).toBeVisible();

        const editBtn = page.getByRole("button", { name: "Edit Northwind Traders" });
        await editBtn.hover();
        await expect(page.getByRole("tooltip", { name: "Edit" })).toBeVisible();

        const moreBtn = page.getByRole("button", { name: "More actions for Northwind Traders" });
        await moreBtn.hover();
        await expect(page.getByRole("tooltip", { name: "More actions" })).toBeVisible();
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
      await page.goto("/#/components/dialog");
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
      await expect(page).toHaveURL(/#\/components\/toc$/); // in-page links don't change the preview route
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
      const bars = example(page, "bars");
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
      const line = example(page, "line");
      // The comparison series is quiet, not the next series colour.
      const strokes = await line.locator(".ayy-chart__line").evaluateAll((paths) => paths.map((p) => getComputedStyle(p).stroke));
      expect(strokes[0]).not.toBe(strokes[1]);
      await rtl(line);
      expect(await line.locator(".ayy-chart__svg").evaluate((svg) => getComputedStyle(svg).scale)).toBe("-1 1");
    });

    test("chart types: bars along rows, lines over column centres, floating bars, slices, a meter, dots, cells, a funnel", async ({ page }) => {
      await open(page, "chart", { renderer });
      const box = (l: import("@playwright/test").Locator) => l.evaluate((el) => el.getBoundingClientRect().toJSON() as DOMRect);

      // Horizontal: each label sits on its row; Technical in October (5.8h on an 8h scale) is 72.5% of the plot.
      const horizontal = example(page, "horizontal");
      const rows = horizontal.locator(".ayy-chart__column");
      const labels = horizontal.locator(".ayy-chart__labels > *");
      for (const i of [0, 4]) expect(Math.round((await box(rows.nth(i))).top)).toBe(Math.round((await box(labels.nth(i))).top));
      // Polled, plot and bar together: the bars grow in, settle() only waits for the stage's own animations, and the
      // page's layout can still shift.
      const technical = rows.nth(1).locator(".ayy-chart__bar").first();
      const share = async () => ((await box(technical)).width / (await box(horizontal.locator(".ayy-chart__plot"))).width) * 100;
      await expect.poll(async () => Math.abs((await share()) - 72.5)).toBeLessThan(1);

      // Combo: the line's first point is over the first column's centre.
      const combo = example(page, "combo");
      const comboPlot = await box(combo.locator(".ayy-chart__plot"));
      const column = await box(combo.locator(".ayy-chart__column").first());
      const startX = await combo.locator(".ayy-chart__line").evaluate((p) => (p as SVGPathElement).getPointAtLength(0).x);
      expect(Math.abs(startX - ((column.left + column.width / 2 - comboPlot.left) / comboPlot.width) * 100)).toBeLessThan(0.5);

      // Waterfall: the first change starts where the opening total ends, and drops aren't coloured like rises.
      const bars = example(page, "waterfall").locator(".ayy-chart__bar");
      await expect.poll(async () => Math.abs((await box(bars.nth(0))).top - (await box(bars.nth(1))).bottom)).toBeLessThan(1.5);
      const fill = (i: number) => bars.nth(i).evaluate((el) => getComputedStyle(el).backgroundColor);
      expect(await fill(1)).not.toBe(await fill(3));

      // Donut: one slice per part, each its own colour, starting where the one before ends.
      const donut = example(page, "donut");
      const slices = donut.locator(".ayy-chart__slice");
      await expect(slices).toHaveCount(4);
      expect(new Set(await slices.evaluateAll((all) => all.map((s) => getComputedStyle(s).stroke))).size).toBe(4);
      // Chrome keeps the offset in a calc(): calc(-43.7px).
      const offset = await slices.nth(1).evaluate((s) => getComputedStyle(s).strokeDashoffset);
      expect(Number(offset.match(/-?[\d.]+/)?.[0])).toBeCloseTo(-43.7, 1);

      // Gauge: a meter with its value in words.
      const meter = example(page, "gauge").getByRole("meter", { name: "Ad spend this month" });
      await expect(meter).toHaveAttribute("aria-valuenow", "7240");
      await expect(meter).toHaveAttribute("aria-valuetext", "$7.2K of $10K ad spend");

      // Scatter: the biggest deal is at the end side, and moves to the start side's mirror in RTL.
      const scatter = example(page, "scatter");
      const lost = scatter.locator(".ayy-chart__series").nth(1).locator(".ayy-chart__dot");
      const farthest = lost.last();
      const nearest = lost.first();
      expect((await box(farthest)).left).toBeGreaterThan((await box(nearest)).left);
      await rtl(scatter);
      expect((await box(farthest)).left).toBeLessThan((await box(nearest)).left);

      // Heatmap: the busiest cell takes the full series colour, like the key's darkest cell.
      const heatmap = example(page, "heatmap");
      await expect(heatmap.locator(".ayy-heatmap .ayy-heatmap__cell")).toHaveCount(84);
      const shade = (l: import("@playwright/test").Locator) => l.evaluate((el) => getComputedStyle(el).backgroundColor);
      expect(await shade(heatmap.locator('.ayy-heatmap__cell[data-value="Mon, 12pm: 46"]'))).toBe(await shade(heatmap.locator(".ayy-heatmap__key .ayy-heatmap__cell").last()));
      await expect(heatmap.getByRole("table", { name: "Support tickets by day and time, last four weeks" })).toHaveCount(1);

      // Funnel: readable as a list, each rate saying what it's a share of.
      const funnel = example(page, "funnel").getByRole("list", { name: "Signup funnel, last 30 days" });
      await expect(funnel.getByRole("listitem")).toHaveCount(5);
      for (const text of ["Started signup", "4,830", "39% of the step before"]) await expect(funnel.getByRole("listitem").nth(1)).toContainText(text);
    });

    test("table: column titles sort from their menu, the header checkbox selects them all", async ({ page }) => {
      await open(page, "table", { renderer });
      const demo = example(page, "playground");
      const table = demo.getByRole("table");
      const firstMRR = () => table.locator("tbody tr:not(.ayy-table__detail)").first().locator("td.ayy-table__num").last().locator(".ayy-inline-edit__text, span").first();
      const mrr = table.getByRole("button", { name: "MRR", exact: true });
      const header = mrr.locator("xpath=ancestor::th");
      const sortBy = async (name: string) => {
        await mrr.click();
        await demo.getByRole("menuitem", { name: "Sort", exact: true }).click();
        await demo.getByRole("menuitem", { name, exact: true }).click();
      };
      await expect(header).toHaveAttribute("aria-sort", "descending");
      await expect(firstMRR()).toHaveText("$36,000");

      await sortBy("Sort ascending");
      await expect(header).toHaveAttribute("aria-sort", "ascending");
      // React sorts every account; <ayy-table> only sorts the rows on the page.
      await expect(firstMRR()).toHaveText(renderer === "react" ? "$0" : "$1,920");

      await sortBy("Sort descending");
      await expect(header).toHaveAttribute("aria-sort", "descending");
      await expect(firstMRR()).toHaveText("$36,000");

      const all = table.getByRole("checkbox", { name: "Select all accounts on this page" });
      await all.check();
      await expect(table.locator('tbody tr[aria-selected="true"]')).toHaveCount(10);
      await table.getByRole("checkbox", { name: "Select Brightside Health" }).uncheck();
      await expect(table.locator('tbody tr[aria-selected="true"]')).toHaveCount(9);
      await expect(all).toHaveJSProperty("indeterminate", true);
    });

    test("table playground: sticky header, pinned column, expanding rows and detail rows", async ({ page }) => {
      await open(page, "table", { renderer });
      const table = example(page, "playground").getByRole("table", { name: "Accounts" });
      const name = table.locator("tbody td.ayy-table__pin").first();
      expect(await table.locator("thead th").first().evaluate((el) => getComputedStyle(el).position)).toBe("sticky");
      expect(await name.evaluate((el) => getComputedStyle(el).position)).toBe("sticky");

      // Northwind starts expanded; Brightside Health doesn't. The detail row follows its button's aria-expanded.
      const northwind = table.getByRole("button", { name: "Show details for Northwind Traders" });
      const lumen = table.getByRole("button", { name: "Show details for Brightside Health" });
      await expect(northwind).toHaveAttribute("aria-expanded", "true");
      await expect(table.locator("#ACC-201-detail")).toBeVisible();
      await expect(table.locator("#ACC-204-detail")).toBeHidden();
      await northwind.click();
      await expect(northwind).toHaveAttribute("aria-expanded", "false");
      await expect(table.locator("#ACC-201-detail")).toBeHidden();
      await lumen.click();
      await expect(table.locator("#ACC-204-detail")).toBeVisible();

      if (renderer === "html") {
        // <ayy-table>: Shift+click ticks every row between the last box ticked and this one.
        await table.getByRole("checkbox", { name: "Select Nimbus Energy" }).check();
        await table.getByRole("checkbox", { name: "Select Juniper Foods" }).click({ modifiers: ["Shift"] });
        await expect(table.locator('tbody tr[aria-selected="true"]')).toHaveCount(10);
        await expect(table.getByRole("checkbox", { name: "Select all accounts on this page" })).toBeChecked();
        return;
      }

      // React: the Props popover groups the rows by status, and a search that matches nothing shows the empty row.
      const ex = page.locator('.pv-example[aria-labelledby="ex-playground"]');
      await ex.getByRole("button", { name: "Props" }).click();
      await ex.locator(".pv-props-popover").getByRole("switch", { name: "Grouped by status" }).click();
      await page.keyboard.press("Escape");
      await expect(table.locator("tr.ayy-table__group")).toHaveText(["Past due · 1", "Active · 9"]);
      await example(page, "playground").getByRole("searchbox", { name: "Search accounts" }).fill("zzz");
      await expect(table.locator(".ayy-table__empty")).toContainText("No accounts match");
    });

    test("table parts: detail rows move with their row, resize handles take the arrow keys", async ({ page }) => {
      await open(page, "table", { renderer });
      const table = example(page, "playground").getByRole("table", { name: "Accounts" });

      // Each detail row sits right after the row it belongs to.
      const pairs = await table.locator("tbody").first().locator("tr.ayy-table__detail").evaluateAll((details) =>
        details.map((d) => [d.id, d.previousElementSibling?.querySelector("[aria-controls]")?.getAttribute("aria-controls")]),
      );
      for (const [id, owner] of pairs) expect(owner).toBe(id);

      const handle = table.getByRole("separator", { name: "Resize Last note" });
      const header = handle.locator("xpath=ancestor::th");
      await keyboardFocus(handle);
      // Read the width just before the key: an auto-width table can still settle by a few pixels until then.
      const before = await header.evaluate((el) => (el as HTMLElement).offsetWidth);
      await page.keyboard.press("ArrowRight");
      await expect.poll(() => header.evaluate((el) => (el as HTMLElement).offsetWidth)).toBe(before + 16);
      await expect(handle).toHaveAttribute("aria-valuenow", String(before + 16));
      await page.keyboard.press("Shift+ArrowRight");
      await expect.poll(() => header.evaluate((el) => (el as HTMLElement).offsetWidth)).toBe(before + 16 + 64);
      await handle.dblclick();
      await expect.poll(() => header.evaluate((el) => (el as HTMLElement).style.inlineSize)).toBe("");

      // Dragging a column's resize handle changes its width.
      const handleBox = (await handle.boundingBox())!;
      await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(handleBox.x + handleBox.width / 2 + 40, handleBox.y + handleBox.height / 2);
      await page.mouse.up();
      await expect.poll(() => header.evaluate((el) => (el as HTMLElement).offsetWidth)).toBeGreaterThanOrEqual(before + 35);

      // Inline cell editing commits on Enter and reverts on Escape.
      const noteButton = table.getByRole("button", { name: "Last note for Northwind Traders" });
      const noteInput = table.getByRole("textbox", { name: "Last note for Northwind Traders" });
      await expect(noteButton).toHaveText("Wants SSO for the Lisbon office before the March renewal.");
      const textLeft = () => noteButton.locator(".ayy-inline-edit__text").evaluate((el) => el.getBoundingClientRect().left);
      const restLeft = await textLeft();
      await noteButton.click();
      await expect(noteInput).toHaveValue("Wants SSO for the Lisbon office before the March renewal.");
      // The field keeps the text where it was.
      expect(await noteInput.evaluate((el) => el.getBoundingClientRect().left + parseFloat(getComputedStyle(el).paddingLeft) + 1)).toBeCloseTo(restLeft, 0);
      await noteInput.fill("Temporary draft");
      await page.keyboard.press("Escape");
      await expect(noteButton).toHaveText("Wants SSO for the Lisbon office before the March renewal.");
      await noteButton.click();
      await noteInput.fill("Updated terms · Net 15");
      await page.keyboard.press("Enter");
      await expect(noteButton).toHaveText("Updated terms · Net 15");

      // Dragging across rows selects them all in one stroke.
      const firstRowBox = table.getByRole("checkbox", { name: "Select Brightside Health" });
      const secondRowBox = table.getByRole("checkbox", { name: "Select Northwind Traders" });
      const firstRowCell = firstRowBox.locator("xpath=ancestor::td");
      const secondRowCell = secondRowBox.locator("xpath=ancestor::td");
      await firstRowCell.scrollIntoViewIfNeeded();
      const firstBox = (await firstRowCell.boundingBox())!;
      const secondBox = (await secondRowCell.boundingBox())!;
      await page.mouse.move(firstBox.x + firstBox.width / 2, firstBox.y + firstBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(secondBox.x + secondBox.width / 2, secondBox.y + secondBox.height / 2, { steps: 5 });
      await page.mouse.up();
      await expect(firstRowBox).toBeChecked();
      await expect(secondRowBox).toBeChecked();
    });

    test("table actions: inline buttons, per-row ⋯ menu, filters, and bulk action bar", async ({ page }) => {
      await open(page, "table", { renderer });
      const s = example(page, "playground");
      const table = s.getByRole("table");
      const bar = s.locator(".ayy-action-bar");

      await expect(bar).toHaveAttribute("open", "");
      await expect(bar.locator(".ayy-action-bar__count")).toHaveText("1 selected");

      // Selecting another row updates the action bar count
      await table.getByRole("checkbox", { name: "Select Brightside Health" }).check();
      await expect(bar.locator(".ayy-action-bar__count")).toHaveText("2 selected");

      // Per-row ⋯ menu opens and lists targeted actions
      const moreBtn = table.getByRole("button", { name: "More actions for Brightside Health" });
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

      if (renderer === "react") {
        // Filters → Status filters the rows by status, the button says how many filters are on, and Reset filters clears them
        await s.getByRole("button", { name: "Filters", exact: true }).click();
        const filtersMenu = page.getByRole("menu", { name: "Filter options" });
        await expect(filtersMenu).toBeVisible();
        await filtersMenu.getByRole("menuitem", { name: /Status/ }).click();
        await page.getByRole("menu", { name: "Status options" }).getByRole("menuitemcheckbox", { name: /Trial/ }).click();
        await page.keyboard.press("Escape");
        await page.keyboard.press("Escape");
        await expect(table.locator("tbody tr:not(.ayy-table__detail)")).toHaveCount(5);
        await s.getByRole("button", { name: "Filters (1 active)" }).click();
        await filtersMenu.getByRole("menuitem", { name: "Reset filters" }).click();
        await expect(table.locator("tbody tr:not(.ayy-table__detail)")).toHaveCount(10);
        await expect(s.getByRole("button", { name: "Filters", exact: true })).toBeVisible();
      }
    });

    test("table column reorder: dragging a header cell reorders columns and shows placement indicator", async ({ page }) => {
      await open(page, "table", { renderer });
      const table = example(page, "playground").getByRole("table", { name: "Accounts" });
      const headers = table.locator("thead th");
      const planHeader = headers.filter({ hasText: "Plan" });
      const statusHeader = headers.filter({ hasText: "Status" });
      await expect(planHeader).toHaveAttribute("data-reorderable", "");
      await planHeader.scrollIntoViewIfNeeded();

      const planBox = (await planHeader.boundingBox())!;
      const statusBox = (await statusHeader.boundingBox())!;

      // Drag Plan past Status
      await page.mouse.move(planBox.x + planBox.width / 2, planBox.y + planBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(statusBox.x + statusBox.width * 0.8, statusBox.y + statusBox.height / 2, { steps: 5 });
      await page.mouse.up();

      // Column order updated
      const updatedHeaders = await table.locator("thead th").allInnerTexts();
      const planIndex = updatedHeaders.findIndex((t) => t.includes("Plan"));
      const statusIndex = updatedHeaders.findIndex((t) => t.includes("Status"));
      expect(planIndex).toBeGreaterThan(statusIndex);
    });

    test("table row reorder: dragging a row's handle drops it in a new place, the arrow keys move it too", async ({ page }) => {
      await open(page, "table", { renderer });
      const table = example(page, "playground").getByRole("table", { name: "Accounts" });
      const names = () => table.locator('tbody tr[data-id] .ayy-drag-handle').evaluateAll((els) => els.map((el) => el.getAttribute("aria-label")));
      const before = (await names()) as string[];
      expect(before).toHaveLength(10);
      const first = table.getByRole("button", { name: before[0], exact: true });
      const third = table.getByRole("button", { name: before[2], exact: true });
      await third.scrollIntoViewIfNeeded();
      const from = (await first.boundingBox())!;
      const to = (await third.boundingBox())!;
            const beforeWidths = await table.locator("thead th").evaluateAll((ths) => ths.map((th) => (th as HTMLElement).offsetWidth));

      await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
      await page.mouse.down();
      await page.mouse.move(to.x + to.width / 2, to.y + to.height / 4, { steps: 8 });
      const dropRow = table.locator("tr[data-drop-edge]");
      await expect(dropRow).toHaveCount(1);
      await expect(dropRow).toHaveAttribute("data-drop-edge", "block-start");

      // Verify dropRow does NOT generate any ::before pseudo-element creating an extra column
      const cellCount = await dropRow.locator("td").count();
      const firstRowCellCount = await table.locator("tbody tr[data-id]").first().locator("td").count();
      expect(cellCount).toBe(firstRowCellCount);

      await page.mouse.up();
      expect(await names()).toEqual([before[1], before[0], before[2], ...before.slice(3)]);
      if (renderer === "react") await expect(table.locator("th[aria-sort]")).toHaveCount(0);

      await table.getByRole("button", { name: before[0], exact: true }).focus();
      await page.keyboard.press("ArrowDown");
      expect(await names()).toEqual([before[1], before[2], before[0], ...before.slice(3)]);
    });

    test("pagination: the page size picker changes how many rows a page holds", async ({ page }) => {
      test.skip(renderer !== "react", "the HTML example is static markup");
      await open(page, "table", { renderer });
      const demo = example(page, "playground");
      const table = demo.getByRole("table", { name: "Accounts" });
      await expect(table.locator("tbody tr[data-id]")).toHaveCount(10);
      await expect(demo.getByText("1–10 of 24")).toBeVisible();
      await demo.getByLabel("Rows per page").selectOption("5");
      await expect(table.locator("tbody tr[data-id]")).toHaveCount(5);
      await expect(demo.getByText("1–5 of 24")).toBeVisible();
      await demo.getByRole("button", { name: "5", exact: true }).click();
      await demo.getByLabel("Rows per page").selectOption("25");
      await expect(table.locator("tbody tr[data-id]")).toHaveCount(24);
      await expect(demo.getByRole("button", { name: "Next" })).toBeDisabled();
    });

    test("drag-drop: sortable items move between areas and drop targets react", async ({ page }) => {
      await open(page, "drag-drop", { renderer });
      const board = example(page, "board");
      const featureCard = board.locator('[data-id="c-1"]');
      const inProgressTarget = board.locator('[data-id="in-progress"]');

      const handle = featureCard.locator(".ayy-drag-handle");
      await expect(handle).toBeVisible();

      // Keyboard navigation: moving across areas with ArrowRight on focused handle
      await handle.focus();
      await page.keyboard.press("ArrowRight");

      await expect(inProgressTarget.locator('[data-id="c-1"]')).toBeVisible();
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

    test("icon picker searches, moves with arrow keys, picks and removes", async ({ page }) => {
      await open(page, "icon-picker", { renderer });
      const picker = example(page, "basic").locator(".ayy-icon-picker");
      const star = picker.getByRole("button", { name: "Star", exact: true }).first();
      await expect(star).toHaveAttribute("aria-pressed", "true");
      await expect(star).toHaveAttribute("tabindex", "0");

      await keyboardFocus(star);
      await page.keyboard.press("ArrowRight");
      const tag = picker.getByRole("button", { name: "Tag", exact: true });
      await expect(tag).toBeFocused();
      await page.keyboard.press("ArrowDown");
      await expect(tag).not.toBeFocused();
      await page.keyboard.press("ArrowUp");
      await expect(tag).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(tag).toHaveAttribute("aria-pressed", "true");
      await expect(star).toHaveAttribute("aria-pressed", "false");

      const search = picker.getByRole("searchbox", { name: "Search icons" });
      await search.fill("money");
      await expect(picker.getByRole("button", { name: "Dollar" })).toBeVisible();
      await expect(picker.getByRole("button", { name: "Money bag" })).toBeVisible();
      await expect(tag).toBeHidden();
      await search.fill("zzz");
      await expect(picker.getByRole("status")).toHaveText("No icons found");
      await search.fill("");

      await rtl(picker);
      await keyboardFocus(tag);
      await page.keyboard.press("ArrowLeft");
      await expect(picker.getByRole("button", { name: "Calendar", exact: true }).first()).toBeFocused();

      await picker.getByRole("button", { name: "Remove" }).click();
      await expect(picker.locator('[aria-pressed="true"]')).toHaveCount(0);
    });

    test("icon picker in a popover closes it on pick", async ({ page }) => {
      await open(page, "icon-picker", { renderer });
      const demo = example(page, "popover");
      await demo.getByRole("button", { name: "Project icon" }).click();
      const dialog = demo.getByRole("dialog", { name: "Project icon" });
      await expect(dialog).toBeVisible();
      await dialog.getByRole("button", { name: "Target", exact: true }).first().click();
      await expect(dialog).toBeHidden();
    });

    test("code block copy button enters copied state on click", async ({ page }) => {
      await open(page, "code-block", { renderer });
      const copyBtn = example(page, "basic").getByRole("button", { name: "Copy code" });
      await copyBtn.click();
      await expect(example(page, "basic").locator(".ayy-code-block__copy")).toHaveAttribute("data-copied", "true");
      await expect(example(page, "basic").locator(".ayy-code-block__copy")).toHaveAttribute("aria-label", "Copied!");
    });

    test("split button joins the main button and menu trigger seamlessly in LTR and RTL", async ({ page }) => {
      await open(page, "button", { renderer });
      const s = example(page, "split");
      const firstSplit = s.locator(".ayy-button-split").first();
      const deployBtn = firstSplit.getByRole("button", { name: "Deploy", exact: true });
      const moreBtn = firstSplit.getByRole("button", { name: "More deploy options" });

      const mainBox = (await deployBtn.boundingBox())!;
      const moreBox = (await moreBtn.boundingBox())!;
      expect(Math.abs(mainBox.x + mainBox.width - moreBox.x)).toBeLessThanOrEqual(2);
      expect(Math.round(mainBox.height)).toBe(Math.round(moreBox.height));

      await moreBtn.click();
      await expect(moreBtn).toHaveAttribute("aria-expanded", "true");
      const menu = s.locator(".ayy-menu:popover-open");
      await expect(menu.getByRole("menuitem", { name: "Deploy to preview" })).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(menu).toBeHidden();

      await rtl(s);
      const rtlMain = (await deployBtn.boundingBox())!;
      const rtlMore = (await moreBtn.boundingBox())!;
      expect(Math.abs(rtlMore.x + rtlMore.width - rtlMain.x)).toBeLessThanOrEqual(2);
      await s.evaluate((el) => el.removeAttribute("dir"));
    });

    test("pin input auto-advances on typing, steps back on Backspace, and distributes pasted codes", async ({ page }) => {
      await open(page, "pin-input", { renderer });
      const s = example(page, "verification");
      const s1 = s.getByRole("textbox", { name: "Digit 1 of 6" });
      const s2 = s.getByRole("textbox", { name: "Digit 2 of 6" });
      const s3 = s.getByRole("textbox", { name: "Digit 3 of 6" });
      const s4 = s.getByRole("textbox", { name: "Digit 4 of 6" });
      const s6 = s.getByRole("textbox", { name: "Digit 6 of 6" });

      await s1.click();
      await page.keyboard.type("482");
      await expect(s1).toHaveValue("4");
      await expect(s2).toHaveValue("8");
      await expect(s3).toHaveValue("2");
      await expect(s4).toBeFocused();

      // Backspace in an empty slot moves back and clears the previous slot.
      await page.keyboard.press("Backspace");
      await expect(s3).toBeFocused();
      await expect(s3).toHaveValue("");

      // Pasting a formatted code strips non-digits and fills every slot.
      await s1.evaluate((el) => {
        const dt = new DataTransfer();
        dt.setData("text/plain", "482-910");
        el.dispatchEvent(new ClipboardEvent("paste", { clipboardData: dt, bubbles: true, cancelable: true }));
      });
      await expect(s1).toHaveValue("4");
      await expect(s6).toHaveValue("0");
      await expect(s6).toBeFocused();

      // Masked PIN renders password inputs.
      await expect(s.locator('#card-pin, #card-pin-html')).toHaveAttribute("type", "password");
    });

    test("rating selects stars, clears when clearable is clicked again, and exposes read-only scores", async ({ page }) => {
      await open(page, "rating", { renderer });
      const s = example(page, "stars");
      const overall = s.getByRole("radiogroup", { name: "Overall rating" });
      const star4 = overall.getByRole("radio", { name: "4 stars" });
      const star5 = overall.getByRole("radio", { name: "5 stars" });

      await expect(star4).toBeChecked();
      await star5.click();
      await expect(star5).toBeChecked();

      // Clicking the already-checked star on a clearable rating resets it to 0.
      await star5.click();
      await expect(star5).not.toBeChecked();
      await expect(overall.locator("input:checked")).toHaveCount(0);

      // Read-only fractional rating is exposed as a single image with its label.
      await expect(s.getByRole("img", { name: "4.5 out of 5 stars" })).toBeVisible();
    });

    test("transfer list moves checked items, updates counts and indeterminate state, and filters panes", async ({ page }) => {
      await open(page, "transfer-list", { renderer });
      const s = example(page, "permissions");
      const source = s.locator('.ayy-transfer-list__pane[data-pane="source"]');
      const target = s.locator('.ayy-transfer-list__pane[data-pane="target"]');
      const addBtn = s.getByRole("button", { name: "Move selected to Assigned" });
      const sourceAll = source.locator(".ayy-transfer-list__title input");

      await expect(source.locator(".ayy-transfer-list__count")).toHaveText("4");
      await expect(target.locator(".ayy-transfer-list__count")).toHaveText("3");
      await expect(addBtn).toBeDisabled();

      await source.getByRole("checkbox", { name: /View billing/ }).check();
      await expect(sourceAll).toHaveJSProperty("indeterminate", true);
      await expect(addBtn).toBeEnabled();

      await addBtn.click();
      await expect(source.locator(".ayy-transfer-list__count")).toHaveText("3");
      await expect(target.locator(".ayy-transfer-list__count")).toHaveText("4");
      await expect(target.getByRole("checkbox", { name: /View billing/ })).toBeVisible();

      const filter = source.getByRole("searchbox", { name: "Filter Available" });
      await filter.fill("audit");
      await expect(source.locator(".ayy-transfer-list__count")).toHaveText("1 of 3");
      await expect(source.locator(".ayy-transfer-list__item:not([hidden])")).toHaveCount(1);

      await filter.fill("zzz");
      await expect(source.locator(".ayy-transfer-list__empty")).toBeVisible();
      await expect(source.locator(".ayy-transfer-list__empty")).toHaveText("No matches");
    });

    test("mentions opens at @ or # triggers, inserts the chosen handle on Enter, and ignores email addresses", async ({ page }) => {
      await open(page, "mentions", { renderer });
      const s = example(page, "comment");
      const textarea = s.getByRole("textbox", { name: "Release note" });
      const listbox = s.locator(".ayy-mentions__listbox");

      await textarea.click();
      await textarea.press("End");
      await page.keyboard.type("@gr");
      await expect(listbox).toBeVisible();
      const grace = listbox.getByRole("option", { name: /Grace Hopper/ });
      await expect(grace).toHaveAttribute("aria-selected", "true");

      await page.keyboard.press("Enter");
      await expect(listbox).toBeHidden();
      await expect(textarea).toHaveValue(/Looping in @ada to review #142 before Friday’s release\. @grace $/);

      // Issue trigger (#) filters # options; Escape dismisses without inserting.
      await page.keyboard.type("#15");
      await expect(listbox).toBeVisible();
      await expect(listbox.getByRole("option", { name: /RTL sidebar resize handle/ })).toHaveAttribute("aria-selected", "true");
      await page.keyboard.press("Escape");
      await expect(listbox).toBeHidden();

      // A trigger preceded by non-whitespace (like an email address) does not open mentions.
      await textarea.fill("ops@ada");
      await expect(listbox).toBeHidden();
    });

    test("block editor splits and joins lines, turns Markdown, / and @ into blocks and chips, formats, selects across and moves blocks", async ({ page }) => {
      await open(page, "block-editor", { renderer });
      const editor = example(page, "page").locator(".ayy-block-editor");
      const blocks = editor.locator(":scope > .ayy-block-editor__block");
      const line = (n: number) => blocks.nth(n).locator(":scope > .ayy-block-editor__text");
      const menu = editor.locator(".ayy-block-editor__menu");
      const caret = (n: number, offset: number | "end") =>
        line(n).evaluate((el, at) => {
          el.focus();
          const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
          let left = at === "end" ? Number.POSITIVE_INFINITY : at;
          let last: Node = el;
          for (let t = walker.nextNode(); t; t = walker.nextNode()) {
            last = t;
            if (left <= (t as Text).length) return getSelection()!.collapse(t, left);
            left -= (t as Text).length;
          }
          getSelection()!.collapse(last, last === el ? el.childNodes.length : (last as Text).length);
        }, offset);
      await expect(blocks).toHaveCount(17);

      // Enter splits a line at the caret; Backspace at the start of the new one joins them again.
      await caret(1, 4);
      await page.keyboard.press("Enter");
      await expect(blocks).toHaveCount(18);
      await expect(line(1)).toHaveText("Ship");
      await expect(line(2)).toHaveText(/^ the new onboarding/);
      await page.keyboard.press("Backspace");
      await expect(blocks).toHaveCount(17);
      await expect(line(1)).toHaveText(/^Ship the new onboarding/);

      // Markdown at the start of a line makes a block; "/" opens the block menu, filtered by what follows.
      await caret(16, 0);
      await page.keyboard.type("## Notes");
      await expect(blocks.nth(16)).toHaveAttribute("data-type", "heading-2");
      await page.keyboard.press("Enter");
      await page.keyboard.type("/quo");
      await expect(menu).toBeVisible();
      await expect(menu.getByRole("option").first()).toHaveAttribute("aria-selected", "true");
      await expect(menu.getByRole("option").first()).toContainText("Quote");
      await page.keyboard.press("Enter");
      await expect(menu).toBeHidden();
      await expect(blocks.nth(17)).toHaveAttribute("data-type", "quote");

      // "@" opens mentions; Enter puts a chip in the line and typing goes on after it.
      await page.keyboard.type("Ask @gr");
      await expect(menu.getByRole("option", { name: /Grace Hopper/ })).toHaveAttribute("aria-selected", "true");
      await page.keyboard.press("Enter");
      await page.keyboard.type("today");
      await expect(line(17).locator(".ayy-block-editor__mention")).toHaveAttribute("data-id", "grace");
      await expect(line(17)).toHaveText("Ask @Grace Hopper today");

      // **bold** turns into bold as it's typed; Mod+B toggles it on a selection.
      await page.keyboard.type(" **now*");
      await page.keyboard.type("*");
      await expect(line(17).locator("strong")).toHaveText("now");
      await page.keyboard.press("Control+a");
      await page.keyboard.press("Control+i");
      await expect(line(17).locator("em")).toHaveText("Ask @Grace Hopper today now");

      // Shift+↓ on a line's last row selects into the next block; typing replaces the text across both, undo brings it back.
      await expect(blocks).toHaveCount(18);
      await caret(9, 9);
      await page.keyboard.press("Shift+ArrowDown");
      await expect(editor).toHaveAttribute("contenteditable", "true");
      await page.keyboard.type("X");
      await expect(blocks).toHaveCount(17);
      await expect(line(9)).toHaveText(/^Internal X/);
      await page.keyboard.press("Control+z");
      await expect(blocks).toHaveCount(18);
      await expect(line(9)).toHaveText("Internal workspaces, behind a flag");

      // Esc selects the block, Shift+↑ adds the one above, Mod+Shift+↑ moves both, Delete removes them.
      await caret(10, 0);
      await page.keyboard.press("Escape");
      await expect(blocks.nth(10)).toHaveAttribute("data-selected", "");
      await page.keyboard.press("Shift+ArrowUp");
      await expect(editor.locator("[data-selected]")).toHaveCount(2);
      await page.keyboard.press("Control+Shift+ArrowUp");
      await expect(line(8)).toHaveText("Internal workspaces, behind a flag");
      await expect(blocks.nth(10)).toHaveAttribute("data-type", "heading-2");
      await page.keyboard.press("Delete");
      await expect(blocks).toHaveCount(16);
      await page.keyboard.press("Control+z");
      await expect(blocks).toHaveCount(18);
    });

    test("block editor code blocks keep new lines, switch language from their header with type-ahead, and hide the gutter while typing", async ({ page }) => {
      await open(page, "block-editor", { renderer });
      const editor = example(page, "page").locator(".ayy-block-editor");
      const block = editor.locator('[data-type="code"]');
      const code = block.locator(".ayy-block-editor__text");
      const language = block.locator("button[data-code-language]");
      await expect(language).toHaveText("TypeScript");

      // Enter in code is a new line, also after typing (the browser may split the line into <div>s instead).
      await code.evaluate((el) => {
        el.focus();
        getSelection()!.collapse(el.firstChild!, 0);
      });
      await page.keyboard.type("x");
      await page.keyboard.press("Enter");
      await page.keyboard.type("y");
      await expect(code).toHaveText(/^x\ny\/\/ Start/);
      await expect(editor).toHaveAttribute("data-typing", "");
      await expect(block.locator(".ayy-block-editor__gutter")).toHaveCSS("opacity", "0");

      // The language button opens a list; typing jumps to a match; Enter picks it and focus returns to the button.
      await language.focus();
      await page.keyboard.press("Enter");
      const menu = editor.locator('.ayy-block-editor__menu[data-mode="language"]');
      await expect(menu).toBeVisible();
      await page.keyboard.press("p");
      await page.keyboard.press("y");
      await expect(menu.locator('[aria-selected="true"]')).toHaveText("Python");
      await page.keyboard.press("Enter");
      await expect(menu).toBeHidden();
      await expect(language).toHaveText("Python");
      await expect(language).toBeFocused();
    });

    test("block editor toggles hide and show what's nested under them, and Enter and >> make them", async ({ page }) => {
      await open(page, "block-editor", { renderer });
      const editor = example(page, "task-notes").locator(".ayy-block-editor");
      const blocks = editor.locator(":scope > .ayy-block-editor__block");
      const toggle = editor.locator('[data-type="toggle"]');
      const arrow = toggle.locator(":scope > .ayy-block-editor__toggle");
      const text = (n: number) => blocks.nth(n).locator(":scope > .ayy-block-editor__text");
      const shown = editor.locator(":scope > .ayy-block-editor__block:not([hidden])");

      // Closed: the two blocks under it are in the document but not shown.
      await expect(blocks).toHaveCount(8);
      await expect(shown).toHaveCount(6);
      await expect(arrow).toHaveAttribute("aria-expanded", "false");

      await arrow.click();
      await expect(arrow).toHaveAttribute("aria-expanded", "true");
      await expect(toggle).toHaveAttribute("data-open", "");
      await expect(shown).toHaveCount(8);
      await arrow.click();
      await expect(shown).toHaveCount(6);

      // Mod+Enter in the line opens it; the arrow keys skip what a closed toggle hides.
      await text(4).evaluate((el) => {
        el.focus();
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        const sel = window.getSelection()!;
        sel.removeAllRanges();
        sel.addRange(range);
      });
      await page.keyboard.press("Control+Enter");
      await expect(shown).toHaveCount(8);
      await page.keyboard.press("Control+Enter");
      await expect(shown).toHaveCount(6);
      // ArrowDown skips the two blocks the closed toggle hides, into the table; ArrowUp comes back to the toggle.
      await page.keyboard.press("ArrowDown");
      await expect(editor.locator('[data-type="table"] .ayy-block-editor__cell').first()).toBeFocused();
      await page.keyboard.press("ArrowUp");
      await expect(text(4)).toBeFocused();

      // Enter at the end of an open toggle starts its first nested line.
      await page.keyboard.press("Control+Enter");
      await page.keyboard.press("Enter");
      await expect(blocks).toHaveCount(9);
      await expect(blocks.nth(5)).toHaveAttribute("data-indent", "1");
      await expect(text(5)).toBeFocused();

      // Closing the toggle while the caret is inside it moves the caret to the toggle.
      await arrow.click();
      await expect(shown).toHaveCount(6);
      await expect(text(4)).toBeFocused();

      // ">> " at the start of an empty line makes a toggle (open, so it can take lines right away).
      await text(0).evaluate((el) => {
        el.focus();
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        const sel = window.getSelection()!;
        sel.removeAllRanges();
        sel.addRange(range);
      });
      await page.keyboard.press("Enter");
      await page.keyboard.type(">> Notes");
      await expect(blocks.nth(1)).toHaveAttribute("data-type", "toggle");
      await expect(blocks.nth(1)).toHaveAttribute("data-open", "");
    });

    test("block editor tables move between cells with Tab, Enter and the arrows, grow by row and column, and take a pasted spreadsheet", async ({ page }) => {
      await open(page, "block-editor", { renderer });
      const editor = example(page, "task-notes").locator(".ayy-block-editor");
      const table = editor.locator('[data-type="table"]');
      const cell = (r: number, c: number) => table.locator(`.ayy-block-editor__cell[data-row="${r}"][data-col="${c}"]`);
      const menu = editor.locator(".ayy-block-editor__menu");

      // The header is a <thead> of <th>, the rest a <tbody>.
      await expect(table.locator("thead th")).toHaveCount(3);
      await expect(table.locator("tbody tr")).toHaveCount(2);
      await expect(cell(0, 0)).toHaveText("Plan");

      // Tab goes along the row, then to the next one; Enter goes down; the last Tab adds a row.
      await cell(0, 0).click();
      await page.keyboard.press("Tab");
      await expect(cell(0, 1)).toBeFocused();
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await expect(cell(1, 0)).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(cell(2, 0)).toBeFocused();
      await cell(2, 2).click();
      await page.keyboard.press("Tab");
      await expect(table.locator("tbody tr")).toHaveCount(3);
      await expect(cell(3, 0)).toBeFocused();
      await page.keyboard.type("Business");
      await expect(cell(3, 0)).toHaveText("Business");

      // The + beside and below the table add a column and a row.
      await table.locator('.ayy-block-editor__table-add[data-axis="column"]').click();
      await expect(table.locator("thead th")).toHaveCount(4);
      await expect(cell(0, 3)).toBeFocused();
      await table.locator('.ayy-block-editor__table-add[data-axis="row"]').click();
      await expect(table.locator("tbody tr")).toHaveCount(4);

      // A spreadsheet pasted into a cell fills the cells from there on.
      await cell(1, 1).click();
      await cell(1, 1).evaluate((el) => {
        const data = new DataTransfer();
        data.setData("text/plain", "$10\t$13\n$25\t$30");
        el.dispatchEvent(new ClipboardEvent("paste", { clipboardData: data, bubbles: true, cancelable: true }));
      });
      await expect(cell(1, 1)).toHaveText("$10");
      await expect(cell(2, 2)).toHaveText("$30");

      // The row and column grips open menus scoped to that row or column, and act on it (not the caret's cell).
      // A grip only takes the pointer once its row or column is hot, so hover a cell in it first.
      const option = (name: RegExp) => menu.getByRole("option", { name });
      await cell(1, 0).hover();
      await table.locator('.ayy-block-editor__row-grip[data-row="1"]').click();
      await expect(menu).toHaveAttribute("aria-label", "Row 2");
      await option(/^Delete/).click();
      await expect(table.locator("tbody tr")).toHaveCount(3);
      await cell(0, 1).hover();
      await table.locator('.ayy-block-editor__col-grip[data-col="1"]').click();
      await expect(menu).toHaveAttribute("aria-label", "Column 2");
      await option(/^Delete/).click();
      await expect(table.locator("thead th")).toHaveCount(3);

      // Align (with Back to leave the group) and Duplicate change the column and the rows from their grips.
      await cell(0, 1).hover();
      await table.locator('.ayy-block-editor__col-grip[data-col="1"]').click();
      await option(/^Align/).click();
      await option(/^Back/).click();
      await expect(option(/^Align/)).toBeVisible();
      await option(/^Align/).click();
      await option(/^Centered/).click();
      await expect(cell(1, 1)).toHaveAttribute("data-align", "center");
      await cell(1, 0).hover();
      await table.locator('.ayy-block-editor__row-grip[data-row="1"]').click();
      await option(/^Duplicate/).click();
      await expect(table.locator("tbody tr")).toHaveCount(4);

      // Mod+Shift+arrows move the row and the column.
      const before = await cell(1, 0).textContent();
      await cell(1, 0).click();
      await page.keyboard.press("Control+Shift+ArrowDown");
      await expect(cell(2, 0)).toHaveText(before ?? "");
      await page.keyboard.press("Control+Shift+ArrowRight");
      await expect(cell(2, 1)).toHaveText(before ?? "");

      // Dragging a column's edge sets its width; the cell menu's Even out clears them.
      const grip = table.locator(".ayy-block-editor__col-resize").first();
      const box = (await grip.boundingBox())!;
      const start = (await cell(0, 0).boundingBox())!.width;
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 + 60, box.y + box.height / 2, { steps: 4 });
      await page.mouse.up();
      await expect(table.locator("table")).toHaveAttribute("data-sized", "");
      expect((await cell(0, 0).boundingBox())!.width).toBeGreaterThan(start + 40);
      await cell(0, 0).click();
      await page.keyboard.press("Control+/");
      await option(/^Even out column widths/).click();
      await expect(table.locator("table")).not.toHaveAttribute("data-sized", "");

      // The header column (on in this example) makes the first cell of each row a <th scope="row">.
      await expect(table.locator('tbody th[scope="row"]')).toHaveCount(4);
      await cell(1, 1).click();
      await page.keyboard.press("Control+/");
      await option(/^Header column/).click();
      await expect(table.locator('tbody th[scope="row"]')).toHaveCount(0);
    });

    test("block editor table menus act on the row or column they were opened from", async ({ page }) => {
      await open(page, "block-editor", { renderer });
      const editor = example(page, "task-notes").locator(".ayy-block-editor");
      const table = editor.locator('[data-type="table"]');
      const cell = (r: number, c: number) => table.locator(`.ayy-block-editor__cell[data-row="${r}"][data-col="${c}"]`);
      const menu = editor.locator(".ayy-block-editor__menu");
      const option = (name: RegExp) => menu.getByRole("option", { name });

      // The header row's grip can't move, but a click still opens its menu. Insert above is omitted: it would make the new row the header.
      await cell(0, 0).hover();
      await table.locator('.ayy-block-editor__row-grip[data-row="0"]').click();
      await expect(menu).toHaveAttribute("aria-label", "Row 1");
      await expect(option(/^Insert above/)).toHaveCount(0);
      await expect(option(/^Insert below/)).toBeVisible();
      const headerBefore = (await cell(0, 0).textContent()) ?? "";
      await option(/^Insert below/).click();
      await expect(cell(0, 0)).toHaveText(headerBefore);
      await expect(cell(1, 0)).toHaveText("");
      await page.keyboard.press("Control+z");
      await expect(table.locator("tbody tr")).toHaveCount(2);

      // The row grip of the second row (Starter, whose grip is labelled "Row 2") opens a menu scoped to it.
      await cell(1, 0).hover();
      await table.locator('.ayy-block-editor__row-grip[data-row="1"]').click();
      await expect(menu).toHaveAttribute("aria-label", "Row 2");
      await expect(option(/^Insert above/)).toBeVisible();
      await option(/^Duplicate/).click();
      await expect(table.locator("tbody tr")).toHaveCount(3);
      await expect(table.locator("tbody tr").nth(1).locator("th, td")).toHaveText(["Starter", "$9", "$12"]);

      // The first column's grip sorts its column Z → A: the body rows' first cells end up descending.
      await cell(0, 0).hover();
      await table.locator('.ayy-block-editor__col-grip[data-col="0"]').click();
      await expect(menu).toHaveAttribute("aria-label", "Column 1");
      await option(/^Sort/).click();
      await option(/^Z → A/).click();
      await expect(table.locator('tbody th[scope="row"]')).toHaveText(["Team", "Starter", "Starter"]);

      // A second A → Z on an already sorted column must not push history: one undo returns to Z → A.
      await cell(0, 0).hover();
      await table.locator('.ayy-block-editor__col-grip[data-col="0"]').click();
      await option(/^Sort/).click();
      await option(/^A → Z/).click();
      await cell(0, 0).hover();
      await table.locator('.ayy-block-editor__col-grip[data-col="0"]').click();
      await option(/^Sort/).click();
      await option(/^A → Z/).click();
      await cell(1, 0).click();
      await page.keyboard.press("Control+z");
      await expect(table.locator('tbody th[scope="row"]').first()).toHaveText("Team");

      // Mod+/ in a cell opens the cell menu. Escape and Tab return focus to that cell, not the editor.
      await cell(1, 1).click();
      await page.keyboard.press("Control+/");
      await expect(menu).toBeVisible();
      await expect(option(/^Row/)).toHaveCount(1);
      await expect(option(/^Column/)).toHaveCount(1);
      await expect(option(/^Header row/)).toHaveCount(1);
      await expect(option(/^Delete table/)).toHaveCount(1);
      await page.keyboard.press("Escape");
      await expect(cell(1, 1)).toBeFocused();
      await page.keyboard.press("Control+/");
      await page.keyboard.press("Tab");
      await expect(menu).toBeHidden();
      await expect(cell(1, 1)).toBeFocused();

      // A right-click on a cell opens the same menu.
      await cell(1, 1).evaluate((el) => el.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true, button: 2 })));
      await expect(option(/^Row/)).toHaveCount(1);
      await expect(option(/^Column/)).toHaveCount(1);
      await expect(option(/^Header row/)).toHaveCount(1);
      await expect(option(/^Delete table/)).toHaveCount(1);
      await page.keyboard.press("Escape");

      // The block handle (⋮⋮) menu keeps the table-wide items but drops Row › and Column ›.
      await table.locator(".ayy-block-editor__handle").click();
      await expect(option(/^Row/)).toHaveCount(0);
      await expect(option(/^Header row/)).toHaveCount(1);
      await expect(option(/^Delete table/)).toHaveCount(1);
    });

    test("block editor table grips show for the hovered or focused cell and stay out of read-only", async ({ page }) => {
      await open(page, "block-editor", { renderer });
      const editor = example(page, "task-notes").locator(".ayy-block-editor");
      const table = editor.locator('[data-type="table"]');
      const cell = (r: number, c: number) => table.locator(`.ayy-block-editor__cell[data-row="${r}"][data-col="${c}"]`);
      const rowGrip = table.locator(".ayy-block-editor__row-grip");
      const colGrip = table.locator(".ayy-block-editor__col-grip");

      // A cold grip does not take the pointer, and the column grip sits above the header cell, not over its text.
      await cell(0, 0).scrollIntoViewIfNeeded();
      await expect(table.locator('.ayy-block-editor__col-grip[data-col="0"]')).toHaveCSS("pointer-events", "none");
      const headerBox = (await cell(0, 0).boundingBox())!;
      const coldGrip = (await table.locator('.ayy-block-editor__col-grip[data-col="0"]').boundingBox())!;
      expect(coldGrip.y + coldGrip.height).toBeLessThanOrEqual(headerBox.y + 2);
      await page.mouse.click(headerBox.x + headerBox.width / 2, headerBox.y + headerBox.height / 2);
      await expect(cell(0, 0)).toBeFocused();
      await expect(editor.locator(".ayy-block-editor__menu")).toBeHidden();

      // Hovering a cell lights the grips of its row and column, and only those receive the pointer.
      await cell(2, 1).hover();
      await expect(table.locator('.ayy-block-editor__row-grip[data-row="2"]')).toHaveAttribute("data-hot", "");
      await expect(table.locator('.ayy-block-editor__col-grip[data-col="1"]')).toHaveAttribute("data-hot", "");
      await expect(table.locator('.ayy-block-editor__row-grip[data-row="2"]')).toBeVisible();
      await expect(table.locator('.ayy-block-editor__col-grip[data-col="1"]')).toBeVisible();
      await expect(table.locator(".ayy-block-editor__row-grip[data-hot]")).toHaveCount(1);
      await expect(table.locator('.ayy-block-editor__row-grip[data-row="2"]')).toHaveCSS("pointer-events", "auto");
      await expect(table.locator('.ayy-block-editor__col-grip[data-col="1"]')).toHaveCSS("pointer-events", "auto");
      await expect(table.locator('.ayy-block-editor__row-grip[data-row="0"]')).toHaveCSS("pointer-events", "none");
      const colGripBox = (await table.locator('.ayy-block-editor__col-grip[data-col="1"]').boundingBox())!;
      const colCellBox = (await cell(0, 1).boundingBox())!;
      expect(colGripBox.y + colGripBox.height).toBeLessThanOrEqual(colCellBox.y + 2);

      // Clicking (focusing) a cell moves the hot grips to its row and column.
      await cell(1, 2).click();
      await expect(table.locator('.ayy-block-editor__row-grip[data-row="1"]')).toHaveAttribute("data-hot", "");
      await expect(table.locator('.ayy-block-editor__col-grip[data-col="2"]')).toHaveAttribute("data-hot", "");

      // Read-only: no grips at all, and the table still shows.
      await example(page, "task-notes").getByRole("switch", { name: "Read only" }).click();
      await expect(rowGrip).toHaveCount(0);
      await expect(colGrip).toHaveCount(0);
      await expect(table.locator(".ayy-block-editor__cell")).toHaveCount(9);
    });

    test("block editor table rows and columns move by dragging their grips, in both directions", async ({ page }) => {
      await open(page, "block-editor", { renderer });
      const editor = example(page, "task-notes").locator(".ayy-block-editor");
      const table = editor.locator('[data-type="table"]');
      const cell = (r: number, c: number) => table.locator(`.ayy-block-editor__cell[data-row="${r}"][data-col="${c}"]`);
      const rowGrip = (r: number) => table.locator(`.ayy-block-editor__row-grip[data-row="${r}"]`);
      const colGrip = (c: number) => table.locator(`.ayy-block-editor__col-grip[data-col="${c}"]`);

      // Wait for the table to be drawn before dragging (header Plan · Old price · New price, rows Starter, Team).
      await expect(cell(0, 0)).toHaveText("Plan");
      await expect(cell(1, 0)).toHaveText("Starter");
      const drop = table.locator(".ayy-block-editor__table-drop");

      // A cancelled drag drops the line and the dragging mark, and does not move the row.
      await cell(1, 0).hover();
      const cancelGrip = (await rowGrip(1).boundingBox())!;
      const cancelTarget = (await table.locator("tbody tr").nth(1).boundingBox())!;
      await page.mouse.move(cancelGrip.x + cancelGrip.width / 2, cancelGrip.y + cancelGrip.height / 2);
      await page.mouse.down();
      await page.mouse.move(cancelTarget.x + cancelTarget.width / 2, cancelTarget.y + cancelTarget.height - 2, { steps: 5 });
      await expect(table.locator(".ayy-block-editor__cell[data-dragging]")).not.toHaveCount(0);
      await page.evaluate(() => window.dispatchEvent(new PointerEvent("pointercancel", { bubbles: true })));
      await expect(table.locator(".ayy-block-editor__cell[data-dragging]")).toHaveCount(0);
      await expect(drop).toBeHidden();
      await page.mouse.up();
      await expect(cell(1, 0)).toHaveText("Starter");
      await expect(cell(2, 0)).toHaveText("Team");

      // Dragging row 1 into the top half of the next row is the gap it already occupies: the line stays hidden and the row stays.
      await cell(1, 0).hover();
      const nearGrip = (await rowGrip(1).boundingBox())!;
      const nextRow = (await table.locator("tbody tr").nth(1).boundingBox())!;
      await page.mouse.move(nearGrip.x + nearGrip.width / 2, nearGrip.y + nearGrip.height / 2);
      await page.mouse.down();
      await page.mouse.move(nextRow.x + nextRow.width / 2, nextRow.y + 2, { steps: 5 });
      await expect(drop).toBeHidden();
      await page.mouse.up();
      await expect(cell(1, 0)).toHaveText("Starter");
      await expect(cell(2, 0)).toHaveText("Team");

      // Drag row 1 (Starter) down past the last row's far edge: the line sits on that edge, and Starter lands there.
      await cell(1, 0).hover();
      await rowGrip(1).scrollIntoViewIfNeeded();
      const grip = (await rowGrip(1).boundingBox())!;
      const team = (await table.locator("tbody tr").nth(1).boundingBox())!;
      await page.mouse.move(grip.x + grip.width / 2, grip.y + grip.height / 2);
      await page.mouse.down();
      await page.mouse.move(team.x + team.width / 2, team.y + team.height - 2, { steps: 5 });
      await expect(drop).toBeVisible();
      const farLine = (await drop.boundingBox())!;
      const teamNow = (await table.locator("tbody tr").nth(1).boundingBox())!;
      expect(Math.abs(farLine.y - (teamNow.y + teamNow.height))).toBeLessThan(4);
      await page.mouse.up();
      await expect(cell(2, 0)).toHaveText("Starter");
      await expect(cell(1, 0)).toHaveText("Team");

      // Drag column 0 (Plan) past column 2 (New price): Plan lands last.
      await cell(0, 0).hover();
      await colGrip(0).scrollIntoViewIfNeeded();
      const colHandle = (await colGrip(0).boundingBox())!;
      const lastCol = (await cell(0, 2).boundingBox())!;
      await page.mouse.move(colHandle.x + colHandle.width / 2, colHandle.y + colHandle.height / 2);
      await page.mouse.down();
      await page.mouse.move(lastCol.x + lastCol.width - 2, lastCol.y + lastCol.height / 2, { steps: 5 });
      await page.mouse.up();
      await expect(cell(0, 2)).toHaveText("Plan");
      await expect(cell(0, 0)).toHaveText("Old price");

      // Dragging the header row's grip changes nothing.
      await cell(0, 0).hover();
      await rowGrip(0).scrollIntoViewIfNeeded();
      const headerGrip = (await rowGrip(0).boundingBox())!;
      const headersBefore = await table.locator("thead th").allInnerTexts();
      await page.mouse.move(headerGrip.x + headerGrip.width / 2, headerGrip.y + headerGrip.height / 2);
      await page.mouse.down();
      await page.mouse.move(headerGrip.x + headerGrip.width / 2, headerGrip.y + headerGrip.height + 60, { steps: 5 });
      await page.mouse.up();
      await expect(table.locator("thead th")).toHaveText(headersBefore);

      // One Control+z restores the column order (focus a cell first: the header grip kept focus from the press above).
      await cell(0, 0).click();
      await page.keyboard.press("Control+z");
      await expect(cell(0, 0)).toHaveText("Plan");
      await expect(cell(0, 2)).toHaveText("New price");

      // In RTL a row drag still lands on the intended row, and its drop line's inline-start edge (its right edge) sits on
      // the table's inline-start edge.
      await editor.evaluate((el) => el.setAttribute("dir", "rtl"));
      await cell(1, 0).hover();
      await rowGrip(1).scrollIntoViewIfNeeded();
      const rtlRowGrip = (await rowGrip(1).boundingBox())!;
      const rtlRowTarget = (await table.locator("tbody tr").nth(1).boundingBox())!;
      await page.mouse.move(rtlRowGrip.x + rtlRowGrip.width / 2, rtlRowGrip.y + rtlRowGrip.height / 2);
      await page.mouse.down();
      await page.mouse.move(rtlRowTarget.x + rtlRowTarget.width / 2, rtlRowTarget.y + rtlRowTarget.height - 2, { steps: 5 });
      const dropBox = (await drop.boundingBox())!;
      const tableBox = (await table.locator(".ayy-block-editor__table").boundingBox())!;
      expect(Math.round(dropBox.x + dropBox.width)).toBe(Math.round(tableBox.x + tableBox.width));
      await page.mouse.up();
      await expect(cell(2, 0)).toHaveText("Team");

      // The same column drag works in RTL, moving the mouse leftwards.
      await cell(0, 0).hover();
      await colGrip(0).scrollIntoViewIfNeeded();
      const rtlHandle = (await colGrip(0).boundingBox())!;
      const rtlLast = (await cell(0, 2).boundingBox())!;
      await page.mouse.move(rtlHandle.x + rtlHandle.width / 2, rtlHandle.y + rtlHandle.height / 2);
      await page.mouse.down();
      await page.mouse.move(rtlLast.x + 2, rtlLast.y + rtlLast.height / 2, { steps: 5 });
      await page.mouse.up();
      await expect(cell(0, 2)).toHaveText("Plan");
      await editor.evaluate((el) => el.removeAttribute("dir"));
    });

    test("block editor table rows and columns select from their grips and take keyboard actions", async ({ page, context }) => {
      await context.grantPermissions(["clipboard-read", "clipboard-write"]);
      await open(page, "block-editor", { renderer });
      const editor = example(page, "task-notes").locator(".ayy-block-editor");
      const table = editor.locator('[data-type="table"]');
      const cell = (r: number, c: number) => table.locator(`.ayy-block-editor__cell[data-row="${r}"][data-col="${c}"]`);
      const cols = await table.locator("thead th").count();

      // Click row grip 2, then Escape: the menu closes and the row stays selected.
      await cell(2, 0).hover();
      await table.locator('.ayy-block-editor__row-grip[data-row="2"]').click();
      await page.keyboard.press("Escape");
      await expect(table.locator("tbody tr:nth-child(2) > [data-selected]")).toHaveCount(cols);

      // Undo of a clear, with the row still selected and focus on the editor, lands in that row's first cell.
      await expect(editor).toBeFocused();
      await page.keyboard.press("Backspace");
      await page.keyboard.press("Control+z");
      await expect(cell(2, 0)).toBeFocused();
      await cell(2, 0).hover();
      await table.locator('.ayy-block-editor__row-grip[data-row="2"]').click();
      await page.keyboard.press("Escape");
      await expect(table.locator("tbody tr:nth-child(2) > [data-selected]")).toHaveCount(cols);

      const rows = await table.locator("tbody tr").count();
      await page.keyboard.press("Control+d");
      await expect(table.locator("tbody tr")).toHaveCount(rows + 1);

      const beforeClear = await table.locator(".ayy-block-editor__cell").allTextContents();
      await page.keyboard.press("Backspace");
      await expect(table.locator("tbody tr:nth-child(2) > [data-selected] .ayy-block-editor__cell")).toHaveText(["", "", ""]);

      await page.keyboard.press("Control+Backspace");
      await expect(table.locator("tbody tr")).toHaveCount(rows);

      await page.keyboard.press("Control+z");
      await page.keyboard.press("Control+z");
      await expect(table.locator("tbody tr")).toHaveCount(rows + 1);
      await expect(table.locator(".ayy-block-editor__cell")).toHaveText(beforeClear);

      // Column grip 1: copy its values as one per line, then a cell click clears the selection.
      await cell(0, 1).hover();
      await table.locator('.ayy-block-editor__col-grip[data-col="1"]').click();
      await page.keyboard.press("Escape");
      const column = await table.locator('.ayy-block-editor__cell[data-col="1"]').allTextContents();
      await page.keyboard.press("Control+c");
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(column.join("\n"));

      await cell(1, 0).click();
      await expect(editor.locator("[data-selected]")).toHaveCount(0);
    });

    test("block editor table menus omit insert, duplicate and sort when they would do nothing", async ({ page }) => {
      await open(page, "block-editor", { renderer });
      const editor = example(page, "task-notes").locator(".ayy-block-editor");
      const table = editor.locator('[data-type="table"]');
      const cell = (r: number, c: number) => table.locator(`.ayy-block-editor__cell[data-row="${r}"][data-col="${c}"]`);
      const menu = editor.locator(".ayy-block-editor__menu");
      const option = (name: RegExp) => menu.getByRole("option", { name });
      const paste = (text: string) => cell(0, 0).evaluate((el, value) => {
        const data = new DataTransfer();
        data.setData("text/plain", value);
        el.dispatchEvent(new ClipboardEvent("paste", { clipboardData: data, bubbles: true, cancelable: true }));
      }, text);

      // One body row cannot sort.
      await cell(2, 0).hover();
      await table.locator('.ayy-block-editor__row-grip[data-row="2"]').click();
      await option(/^Delete/).click();
      await expect(table.locator("tbody tr")).toHaveCount(1);
      await cell(0, 0).hover();
      await table.locator('.ayy-block-editor__col-grip[data-col="0"]').click();
      await expect(option(/^Sort/)).toHaveCount(0);
      await page.keyboard.press("Escape");

      // Twelve columns: no insert or duplicate.
      await cell(0, 0).click();
      await paste(Array.from({ length: 12 }, (_, i) => `c${i}`).join("\t"));
      await expect(table.locator("thead th")).toHaveCount(12);
      await cell(0, 0).hover();
      await table.locator('.ayy-block-editor__col-grip[data-col="0"]').click();
      await expect(option(/^Insert before/)).toHaveCount(0);
      await expect(option(/^Insert after/)).toHaveCount(0);
      await expect(option(/^Duplicate/)).toHaveCount(0);
      await page.keyboard.press("Escape");

      // One hundred rows: no insert or duplicate, on a body row as well as the header.
      await cell(0, 0).click();
      await paste(Array.from({ length: 100 }, () => "x").join("\n"));
      await expect(table.locator("tr")).toHaveCount(100);
      await cell(1, 0).hover();
      await table.locator('.ayy-block-editor__row-grip[data-row="1"]').click();
      await expect(option(/^Insert above/)).toHaveCount(0);
      await expect(option(/^Insert below/)).toHaveCount(0);
      await expect(option(/^Duplicate/)).toHaveCount(0);
    });

    test("block editor callouts change colour from block actions", async ({ page }) => {
      await open(page, "block-editor", { renderer });
      const notes = example(page, "task-notes");
      const editor = notes.locator(".ayy-block-editor");
      const blocks = editor.locator(":scope > .ayy-block-editor__block");
      const menu = editor.locator(".ayy-block-editor__menu");
      const option = (name: RegExp) => menu.getByRole("option", { name });

      // A new line, then /callout. Not the page example: that callout later gets a tone, which would make the undo below meaningless.
      await blocks.nth(0).locator(":scope > .ayy-block-editor__text").evaluate((el) => {
        el.focus();
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        const sel = window.getSelection()!;
        sel.removeAllRanges();
        sel.addRange(range);
      });
      await page.keyboard.press("Enter");
      await page.keyboard.type("/callout");
      await expect(menu.getByRole("option").first()).toContainText("Callout");
      await page.keyboard.press("Enter");
      const callout = blocks.nth(1);
      await expect(callout).toHaveAttribute("data-type", "callout");
      await expect(callout).not.toHaveAttribute("data-tone");

      // A real pointer move clears the typing lock (the gutter ignores the pointer while it is set). Hover alone does not: its move reports no travel.
      const box = (await callout.locator(":scope > .ayy-block-editor__text").boundingBox())!;
      await page.mouse.move(box.x + 4, box.y + 4);
      await page.mouse.move(box.x + 28, box.y + 12);
      await expect(editor).not.toHaveAttribute("data-typing");
      await callout.locator(".ayy-block-editor__handle").click();
      await option(/^Colour/).click();
      await option(/^Warning/).click();
      await expect(callout).toHaveAttribute("data-tone", "warning");

      await page.keyboard.press("Control+z");
      await expect(callout).not.toHaveAttribute("data-tone");

      await notes.getByRole("switch", { name: "Read only" }).click();
      await expect(callout.locator(".ayy-block-editor__handle")).toHaveCount(0);
    });

    test("block editor highlights a selection from the bar and with Mod+Shift+H", async ({ page }) => {
      await open(page, "block-editor", { renderer });
      const editor = example(page, "page").locator(".ayy-block-editor");
      const blocks = editor.locator(":scope > .ayy-block-editor__block");
      const line = (n: number) => blocks.nth(n).locator(":scope > .ayy-block-editor__text");
      const selectText = (n: number, start: number, end: number) =>
        line(n).evaluate((el, at) => {
          el.focus();
          const point = (offset: number): [Node, number] => {
            const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
            let left = offset;
            let last: Node = el;
            for (let t = walker.nextNode(); t; t = walker.nextNode()) {
              last = t;
              if (left <= (t as Text).length) return [t, left];
              left -= (t as Text).length;
            }
            return [last, last === el ? el.childNodes.length : (last as Text).length];
          };
          const [sn, so] = point(at[0]);
          const [en, eo] = point(at[1]);
          getSelection()!.setBaseAndExtent(sn, so, en, eo);
        }, [start, end] as [number, number]);

      // "Ship" is the first word of line 1. Mod+Shift+H toggles the highlight.
      await selectText(1, 0, 4);
      await page.keyboard.press("Control+Shift+h");
      await expect(line(1).locator("mark")).toHaveText("Ship");
      await page.keyboard.press("Control+Shift+h");
      await expect(line(1).locator("mark")).toHaveCount(0);

      // The page example ends on an empty line. ==hi== becomes a mark as the closing pair is typed.
      await line(16).evaluate((el) => {
        el.focus();
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(true);
        const sel = getSelection()!;
        sel.removeAllRanges();
        sel.addRange(range);
      });
      await page.keyboard.type("==hi=");
      await page.keyboard.type("=");
      await expect(line(16).locator("mark")).toHaveText("hi");
    });

    test("block editor links a record from / and fires the mention click", async ({ page }) => {
      await open(page, "block-editor", { renderer });
      const stage = example(page, "page");
      const editor = stage.locator(".ayy-block-editor");
      const blocks = editor.locator(":scope > .ayy-block-editor__block");
      const menu = editor.locator(".ayy-block-editor__menu");

      await blocks.nth(16).locator(":scope > .ayy-block-editor__text").evaluate((el) => {
        el.focus();
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(true);
        const sel = getSelection()!;
        sel.removeAllRanges();
        sel.addRange(range);
      });
      await page.keyboard.type("/link to iss");
      await page.keyboard.press("Enter");
      await expect(menu).toBeVisible();
      await expect(menu).toHaveAttribute("data-mode", "mention");
      await expect(menu.getByRole("option", { name: /Onboarding checklist copy/ })).toBeVisible();

      await page.keyboard.type("onb");
      await expect(menu.getByRole("option", { name: /Onboarding checklist copy/ })).toHaveAttribute("aria-selected", "true");
      await page.keyboard.press("Enter");
      const record = editor.locator('[data-type="record"]');
      await expect(record).toContainText("Onboarding checklist copy");

      if (renderer !== "html") return;
      const host = stage.locator("ayy-block-editor");
      await host.evaluate((el) => {
        el.addEventListener("ayy-mention-click", (e) => {
          (window as unknown as { __clicked: unknown }).__clicked = (e as CustomEvent).detail;
        });
      });
      await record.locator(".ayy-block-editor__record").click();
      expect(await page.evaluate(() => (window as unknown as { __clicked?: { id: string } }).__clicked?.id)).toBe("158");

      const text = ((await record.textContent()) ?? "").replace(/\s+/g, " ").trim();
      await host.evaluate((el) => {
        (el as HTMLElement & { mentions: unknown[] }).mentions = [];
      });
      await expect(record).toHaveText(text);
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


for (const renderer of ["react", "html"] as const) {
  test.describe(`card view type and hover actions (${renderer})`, () => {
    const opacity = (l: import("@playwright/test").Locator) => l.evaluate((el) => getComputedStyle(el).opacity);

    test("card view type: details and grouped actions wait for hover or focus, the play badge gives way, an open menu keeps them", async ({ page }) => {
      await open(page, "card", { renderer });
      const cards = example(page, "view").locator(".ayy-card--view");
      const video = cards.nth(2);
      const body = video.locator(".ayy-card__view-body");
      const actions = video.locator(".ayy-hover-actions");
      const play = video.locator(".ayy-card__view-play");

      await page.mouse.move(0, 0);
      await expect.poll(() => opacity(body)).toBe("0");
      await expect.poll(() => opacity(actions)).toBe("0");
      await expect.poll(() => opacity(play)).toBe("1");

      await video.hover();
      await expect.poll(() => opacity(body)).toBe("1");
      await expect.poll(() => opacity(actions)).toBe("1");
      await expect.poll(() => opacity(play)).toBe("0");

      // Every action names itself in a tooltip.
      await actions.getByRole("button", { name: "Trim" }).hover();
      await expect(page.getByRole("tooltip", { name: "Trim" })).toBeVisible();

      // Keyboard: focus on the picture reveals the same things.
      await page.mouse.move(0, 0);
      await expect.poll(() => opacity(body)).toBe("0");
      await video.locator(".ayy-card__view-media").focus();
      await expect.poll(() => opacity(body)).toBe("1");
      await expect.poll(() => opacity(actions)).toBe("1");

      // The ⋯ menu keeps the row up after the pointer leaves.
      await video.hover();
      await actions.getByRole("button", { name: "More actions" }).click();
      await expect(page.getByRole("menuitem", { name: "Delete" })).toBeVisible();
      await page.mouse.move(0, 0);
      await expect.poll(() => opacity(actions)).toBe("1");
      await page.keyboard.press("Escape");

      // A portrait capture keeps the 16 / 10 box: it letterboxes over its blurred copy.
      const box = (await cards.nth(1).locator(".ayy-card__view-media").boundingBox())!;
      expect(box.width / box.height).toBeCloseTo(1.6, 1);
    });

    test("hover actions: control-size buttons with tooltips; a group puts clear buttons on one glass bar", async ({ page }) => {
      await open(page, "hover-actions", { renderer });
      const separate = example(page, "corners").locator(".ayy-hover-action").first();
      const size = await separate.evaluate((el) => {
        const probe = document.createElement("div");
        probe.style.blockSize = "var(--ayy-size-control-sm)";
        el.parentElement!.append(probe);
        const want = probe.getBoundingClientRect().height;
        probe.remove();
        const box = el.getBoundingClientRect();
        return { want, w: box.width, h: box.height, bg: getComputedStyle(el).backgroundColor };
      });
      expect(size.w).toBeCloseTo(size.want, 0);
      expect(size.h).toBeCloseTo(size.want, 0);
      expect(size.bg).not.toBe("rgba(0, 0, 0, 0)");

      await separate.hover();
      await expect(page.getByRole("tooltip", { name: "Annotate" })).toBeVisible();

      const grouped = example(page, "group").locator(".ayy-hover-actions--group .ayy-hover-action").first();
      await page.mouse.move(0, 0);
      expect(await grouped.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe("rgba(0, 0, 0, 0)");
    });
  });
}

test("toast stack: toasts behind share the front one's size, get their own back when it opens; card toasts follow ratio", async ({ page }) => {
  await open(page, "toast");
  const src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='560' height='350'></svg>";
  await page.evaluate((src) => {
    document.querySelectorAll(".ayy-toaster .ayy-toast").forEach((el) => el.remove());
    const w = window as unknown as { ayywi: { toast: { (m: string, o?: object): void; card: (o: object) => void } } };
    w.ayywi.toast.card({ src, ratio: "3 / 4", duration: Infinity, id: "tall" });
    w.ayywi.toast("Saved to Desktop", { duration: Infinity, id: "text" });
  }, src);
  const toaster = page.locator(".ayy-toaster");
  const tall = toaster.locator('[data-toast-id="tall"]');
  const text = toaster.locator('[data-toast-id="text"]');
  const height = (l: import("@playwright/test").Locator) => l.evaluate((el) => (el as HTMLElement).offsetHeight);
  const width = (l: import("@playwright/test").Locator) => l.evaluate((el) => (el as HTMLElement).offsetWidth);

  await page.mouse.move(0, 0);
  const front = await height(text);
  expect(front).toBeLessThan(80);
  // Behind the text toast, the tall card takes its height and width, so only an even strip peeks out.
  await expect.poll(() => height(tall)).toBe(front);
  await expect.poll(() => width(tall)).toBe(await width(text));

  // Opening the stack gives the card its own size back: 3 / 4 at 17.5rem wide is past the 14rem cap.
  await toaster.hover();
  await expect(toaster).toHaveAttribute("data-expanded", "");
  await expect.poll(() => height(tall)).toBe(224);
  await expect.poll(() => width(tall)).toBe(280);

  // ratio sets the card's shape; very wide pictures stop at 6.75rem.
  await page.evaluate((src) => {
    const w = window as unknown as { ayywi: { toast: { card: (o: object) => void } } };
    w.ayywi.toast.card({ src, ratio: 1440 / 900, duration: Infinity, id: "desktop" });
    w.ayywi.toast.card({ src, ratio: 4, duration: Infinity, id: "wide" });
  }, src);
  await expect.poll(() => height(toaster.locator('[data-toast-id="desktop"]'))).toBe(175);
  await expect.poll(() => height(toaster.locator('[data-toast-id="wide"]'))).toBe(108);
});

test("toast stack: hovering a toast behind opens the stack once, without blinking", async ({ page }) => {
  await open(page, "toast");
  const src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='560' height='350'></svg>";
  await page.evaluate((src) => {
    document.querySelectorAll(".ayy-toaster .ayy-toast").forEach((el) => el.remove());
    const w = window as unknown as { ayywi: { toast: { (m: string, o?: object): void; card: (o: object) => void } } };
    w.ayywi.toast("Saved to Desktop", { duration: Infinity, id: "oldest" });
    w.ayywi.toast.card({ src, ratio: 390 / 844, duration: Infinity });
    w.ayywi.toast.card({ src, ratio: 2560 / 800, duration: Infinity });
    w.ayywi.toast("Copied to clipboard", { description: "pricing-page.png", duration: Infinity });
  }, src);
  const toaster = page.locator(".ayy-toaster");
  await page.mouse.move(0, 0);
  await page.evaluate(() => {
    const w = window as unknown as { __flips: number };
    w.__flips = 0;
    new MutationObserver((records) => {
      for (const r of records) if (r.attributeName === "data-expanded") w.__flips++;
    }).observe(document.querySelector(".ayy-toaster")!, { attributes: true });
  });
  // The strip of the oldest toast, peeking out at the top of the closed stack.
  const strip = (await toaster.locator('[data-toast-id="oldest"]').boundingBox())!;
  await page.mouse.move(strip.x + strip.width / 2, strip.y + 4);
  await expect(toaster).toHaveAttribute("data-expanded", "");
  await page.waitForTimeout(800);
  expect(await page.evaluate(() => (window as unknown as { __flips: number }).__flips)).toBe(1);
  await expect(toaster).toHaveAttribute("data-expanded", "");

  // Leaving closes it once.
  await page.mouse.move(0, 0);
  await expect(toaster).not.toHaveAttribute("data-expanded", "");
  expect(await page.evaluate(() => (window as unknown as { __flips: number }).__flips)).toBe(2);
});

test("toast stack: a dismissed toast slides off toward its side of the screen; Clear all sends them all at once", async ({ page }) => {
  await open(page, "toast");
  await page.evaluate(() => {
    document.querySelectorAll(".ayy-toaster .ayy-toast").forEach((el) => el.remove());
    const w = window as unknown as { ayywi: { toast: (m: string, o?: object) => void } };
    for (const m of ["One", "Two", "Three", "Four"]) w.ayywi.toast(m, { duration: Infinity, id: m });
  });
  const toaster = page.locator(".ayy-toaster");
  const toast = (id: string) => toaster.locator(`[data-toast-id="${id}"]`);
  await page.mouse.move(0, 0);

  // Bottom end in left to right: the front toast leaves to the right, not down or to the left.
  const before = (await toast("Four").boundingBox())!;
  await toast("Four").locator(".ayy-toast__close").evaluate((el) => (el as HTMLElement).click());
  await page.waitForTimeout(150);
  const during = await toast("Four").boundingBox();
  if (during) {
    expect(during.x).toBeGreaterThan(before.x + 20);
    expect(Math.abs(during.y - before.y)).toBeLessThan(4);
  }
  await expect(toast("Four")).toHaveCount(0);

  // Clear all: every toast starts leaving in the same moment, from where it is, toward the right.
  await toaster.hover();
  await expect(toaster).toHaveAttribute("data-expanded", "");
  await page.waitForTimeout(400);
  const result = await page.evaluate(async () => {
    const host = document.querySelector<HTMLElement>(".ayy-toaster")!;
    const boxes = () => Object.fromEntries([...host.querySelectorAll<HTMLElement>(".ayy-toast")].map((el) => [el.dataset.toastId, el.getBoundingClientRect()]));
    const first = boxes();
    const start = performance.now();
    const seen: number[] = [];
    new MutationObserver((records) => {
      for (const r of records) if (r.attributeName === "data-leaving" && (r.target as HTMLElement).hasAttribute("data-leaving")) seen.push(performance.now() - start);
    }).observe(host, { attributes: true, subtree: true });
    host.querySelector<HTMLButtonElement>(".ayy-toaster__clear")!.click();
    await new Promise((r) => setTimeout(r, 150));
    const mid = boxes();
    const moves = Object.keys(first).map((id) => ({ dx: mid[id].x - first[id].x, dy: Math.abs(mid[id].y - first[id].y) }));
    return { seen, moves };
  });
  expect(result.seen).toHaveLength(3);
  expect(Math.max(...result.seen) - Math.min(...result.seen)).toBeLessThan(20);
  for (const m of result.moves) {
    expect(m.dx).toBeGreaterThan(10);
    expect(m.dy).toBeLessThan(4);
  }
  await expect(toaster.locator(".ayy-toast")).toHaveCount(0);
});

test("toast stack: toasts behind line up with the front one on the stack's side; the example's Props pick the side", async ({ page }) => {
  await open(page, "toast", { renderer: "react" });
  const toaster = page.locator(".ayy-toaster");
  const edges = () =>
    page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>(".ayy-toaster .ayy-toast")].map((el) => {
        const r = el.getBoundingClientRect();
        return { left: r.left, right: r.right, center: r.left + r.width / 2 };
      }),
    );
  const fill = () =>
    page.evaluate(() => {
      document.querySelectorAll(".ayy-toaster .ayy-toast").forEach((el) => el.remove());
      const w = window as unknown as { ayywi: { toast: (m: string, o?: object) => void } };
      for (const m of ["One", "Two", "Three"]) w.ayywi.toast(m, { duration: Infinity });
    });

  await fill();
  await page.mouse.move(0, 0);
  await page.waitForTimeout(500);
  let e = await edges();
  // Right: the strips behind are smaller but share the front toast's right edge.
  for (const x of e) expect(Math.abs(x.right - e[e.length - 1].right)).toBeLessThan(1);
  expect(e[0].left).toBeGreaterThan(e[e.length - 1].left + 2);

  const pick = async (side: string) => {
    await page.locator('.pv-example[aria-labelledby="ex-basic"]').getByRole("button", { name: "Props" }).click();
    await page.getByRole("radio", { name: side }).click();
    await page.keyboard.press("Escape");
    await expect(toaster).toHaveAttribute("data-position", side === "Left" ? "bottom-start" : "bottom-center");
    await fill();
    await page.mouse.move(0, 0);
    await page.waitForTimeout(500);
    return edges();
  };

  // Clear all sits on the same side as the stack.
  const clear = page.locator(".ayy-toaster__clear");
  const clearAt = async () => {
    await toaster.hover();
    await expect(clear).toBeVisible();
    const c = (await clear.boundingBox())!;
    const s = (await toaster.boundingBox())!;
    await page.mouse.move(0, 0);
    return { left: c.x - s.x, right: s.x + s.width - (c.x + c.width), center: c.x + c.width / 2 - (s.x + s.width / 2) };
  };
  expect((await clearAt()).right).toBeLessThan(1);

  e = await pick("Left");
  for (const x of e) expect(Math.abs(x.left - e[e.length - 1].left)).toBeLessThan(1);
  expect((await clearAt()).left).toBeLessThan(1);
  e = await pick("Center");
  for (const x of e) expect(Math.abs(x.center - e[e.length - 1].center)).toBeLessThan(1);
  expect(Math.abs((await clearAt()).center)).toBeLessThan(1);
});

test("every toast type's close button is the same component at the same size", async ({ page }) => {
  await open(page, "toast");
  const src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='560' height='350'></svg>";
  await page.evaluate((src) => {
    document.querySelectorAll(".ayy-toaster .ayy-toast").forEach((el) => el.remove());
    const w = window as unknown as { ayywi: { toast: { (m: string, o?: object): void; long: (m: string, o?: object) => void; card: (o: object) => void } } };
    w.ayywi.toast("Saved", { duration: Infinity });
    w.ayywi.toast.long("whsec_9b2e8a1f4c7d0e3b5a6f", { duration: Infinity });
    w.ayywi.toast.card({ src, duration: Infinity });
    w.ayywi.toast.card({ src, split: true, title: "Screenshot.png", duration: Infinity });
  }, src);
  await page.locator(".ayy-toaster").hover();
  const sizes = await page.evaluate(() => {
    const probe = document.createElement("div");
    probe.style.blockSize = "var(--ayy-size-control-sm)";
    document.querySelector(".ayy-toaster")!.append(probe);
    const want = Math.round(probe.getBoundingClientRect().height);
    probe.remove();
    // Every close button on the page: the stack's and the static examples' (React renders those).
    const all = [...document.querySelectorAll<HTMLElement>(".ayy-toast__close")].map((el) => `${el.offsetWidth}x${el.offsetHeight}`);
    return { want, all };
  });
  expect(sizes.all.length).toBeGreaterThan(5);
  expect(new Set(sizes.all)).toEqual(new Set([`${sizes.want}x${sizes.want}`]));
});

test("every toast icon button names itself in an ayywi tooltip, never title", async ({ page }) => {
  await open(page, "toast");
  const src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='560' height='350'></svg>";
  await page.evaluate((src) => {
    document.querySelectorAll(".ayy-toaster .ayy-toast").forEach((el) => el.remove());
    const icon = "<svg viewBox='0 0 24 24' width='16' height='16'><path d='M4 4h16v16H4z' stroke='currentColor' fill='none'/></svg>";
    const w = window as unknown as { ayywi: { toast: { (m: string, o?: object): void; long: (m: string, o?: object) => void; card: (o: object) => void } } };
    w.ayywi.toast("Saved", { duration: Infinity, id: "text" });
    w.ayywi.toast.long("whsec_9b2e8a1f4c7d0e3b5a6f", { duration: Infinity, id: "long" });
    w.ayywi.toast.card({ src, duration: Infinity, id: "card", topActions: [{ label: "Annotate", icon, onClick() {} }], bottomEndActions: [{ label: "Show in folder", icon, onClick() {} }] });
    w.ayywi.toast.card({ src, split: true, title: "Screenshot.png", duration: Infinity, id: "split" });
  }, src);
  const toaster = page.locator(".ayy-toaster");
  await toaster.hover();
  await expect(toaster).toHaveAttribute("data-expanded", "");
  await page.waitForTimeout(400);
  expect(await toaster.locator("[title]").count()).toBe(0);

  const check = async (id: string, name: string) => {
    const toast = toaster.locator(`[data-toast-id="${id}"]`);
    await toast.hover();
    const button = toast.getByRole("button", { name, exact: true });
    await button.hover();
    // Its own bubble (the one before may still be fading out).
    const tip = button.locator("xpath=../*[@role='tooltip']");
    await expect(tip).toHaveText(name);
    await expect(tip).toBeVisible();
  };
  await check("text", "Dismiss");
  await check("long", "Copy");
  await check("long", "Dismiss");
  await check("card", "Annotate");
  await check("card", "Show in folder");
  await check("card", "Dismiss");
  await check("split", "Dismiss");

  // The card's close still sits in its top end corner, now through its tooltip wrapper.
  const card = (await toaster.locator('[data-toast-id="card"]').boundingBox())!;
  const close = (await toaster.locator('[data-toast-id="card"] .ayy-toast__close').boundingBox())!;
  expect(card.x + card.width - (close.x + close.width)).toBeLessThan(14);
  expect(close.y - card.y).toBeLessThan(14);

  // React's static toasts too.
  expect(await page.locator(".pv-stage .ayy-toast__close[title], .pv-stage .ayy-toast__action[title], .pv-stage .ayy-toast__copy[title]").count()).toBe(0);
  expect(await page.locator(".pv-stage .ayy-tooltip > .ayy-toast__close").count()).toBeGreaterThan(3);
});
