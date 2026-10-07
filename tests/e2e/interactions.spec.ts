import { expect, test } from "@playwright/test";
import { open, rtl, settle, stage } from "./helpers";

for (const renderer of ["react", "html"] as const) {
  test.describe(renderer, () => {
    test("app shell collapse toggles with the keyboard, the sub-list indents, and phones drop nested items", async ({ page }) => {
      await open(page, "app-shell", { renderer });
      const shell = stage(page, 2);
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
      await rtl(stage(page, 2));
      expect(await end(scale)).toBeLessThan(await end(typography));
      await stage(page, 2).evaluate((el) => el.removeAttribute("dir"));

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
      const shell = stage(page, 3).locator(".ayy-app-shell");
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
      await expect(sidebar.getByText("Billing")).toBeVisible();
      await expect(sidebar.locator("a").first()).toBeFocused();
      await expect(main).toHaveJSProperty("inert", true);
      await expect.poll(async () => Math.round((await sidebar.boundingBox())!.x - (await shell.boundingBox())!.x)).toBe(0);

      await page.keyboard.press("Escape");
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      await expect(toggle).toBeFocused();
      await expect(main).toHaveJSProperty("inert", false);

      // A link in the drawer closes it.
      await toggle.click();
      await sidebar.getByRole("link", { name: "Projects" }).click();
      await expect(toggle).toHaveAttribute("aria-expanded", "false");

      // RTL: it comes from the right edge.
      await rtl(stage(page, 3));
      await toggle.click();
      await expect
        .poll(async () => {
          const s = (await sidebar.boundingBox())!;
          const b = (await shell.boundingBox())!;
          return Math.round(b.x + b.width - (s.x + s.width));
        })
        .toBe(0);
      await page.keyboard.press("Escape");
      await stage(page, 3).evaluate((el) => el.removeAttribute("dir"));

      // Wider than a phone: no bar, the sidebar in place.
      await page.setViewportSize({ width: 1280, height: 720 });
      await expect(shell.locator(".ayy-app-shell__bar")).toBeHidden();
      await expect(sidebar).toBeVisible();
    });

    test("app shell with a bottom nav: tabs on phones, More opens the drawer, the sidebar from 48rem", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 800 });
      await open(page, "app-shell", { renderer });
      const shell = stage(page, 1).locator(".ayy-app-shell");
      const tabs = shell.locator(".ayy-bottom-nav");
      const sidebar = shell.locator(".ayy-app-shell__sidebar");
      const more = tabs.getByRole("button", { name: "More" });

      await expect(tabs).toBeVisible();
      await expect(sidebar).toBeHidden();
      await expect(tabs.locator('[aria-current="page"]')).toHaveText("Dashboard");
      // The tab bar sits at the bottom of the shell, the bar at the top.
      const shellBox = (await shell.boundingBox())!;
      const tabsBox = (await tabs.boundingBox())!;
      expect(Math.round(tabsBox.y + tabsBox.height)).toBe(Math.round(shellBox.y + shellBox.height));
      await expect(shell.locator(".ayy-app-shell__bar")).toBeVisible();

      await expect(more).toHaveAttribute("aria-expanded", "false");
      await more.click();
      await expect(more).toHaveAttribute("aria-expanded", "true");
      await expect(sidebar).toBeVisible();
      await expect(sidebar.getByRole("link", { name: "Invoices" })).toBeVisible();
      await expect(shell.locator(".ayy-app-shell__main")).toHaveJSProperty("inert", true);
      await page.keyboard.press("Escape");
      await expect(more).toHaveAttribute("aria-expanded", "false");
      await expect(more).toBeFocused();

      await page.setViewportSize({ width: 1280, height: 720 });
      await expect(tabs).toBeHidden();
      await expect(sidebar).toBeVisible();
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
      // The checked segment is filled: its label's background differs from an unchecked one. The fill transitions in from
      // transparent, so poll rather than read it on the frame the key landed.
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
      const tip = page.getByRole("tooltip", { name: "Save changes (⌘S)" });
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

    test("toast appears, runs its action, and sits above a modal dialog", async ({ page }) => {
      await open(page, "toast", { renderer });
      await stage(page).getByRole("button", { name: "With action" }).click();
      const toast = page.locator(".ayy-toast", { hasText: "Project archived" });
      await expect(toast).toBeVisible();
      await toast.getByRole("button", { name: "Undo" }).click();
      await expect(page.locator(".ayy-toast", { hasText: "Project restored" })).toBeVisible();

      // Open a modal, then toast from inside it: the toast must still be clickable.
      await page.goto("/#/dialog");
      await stage(page).getByRole("button", { name: "Delete project" }).click();
      await page.evaluate(() => (window as unknown as { ayywi: { toast: (m: string, o: object) => void } }).ayywi.toast("Over modal", { action: { label: "Act", onClick: () => {} } }));
      const act = page.locator(".ayy-toast", { hasText: "Over modal" }).getByRole("button", { name: "Act" });
      await act.click(); // fails if the modal's inert backdrop covers it
      await expect(page.locator(".ayy-toast", { hasText: "Over modal" })).toBeHidden();
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

    test("contents marks the section being read", async ({ page }) => {
      await open(page, "toc", { renderer });
      const nav = stage(page).getByRole("navigation", { name: "Contents" });
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

    test("contents is a strip of top-level links on phones, keeping the current one in view", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 800 });
      await open(page, "toc", { renderer, density: "touch" });
      const nav = stage(page).getByRole("navigation", { name: "Contents" }); // the hidden title still names it
      const links = nav.locator(".ayy-toc__link:visible");
      const tops = await links.evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().top)));
      expect(new Set(tops).size).toBe(1);
      await expect(nav.getByRole("link", { name: "Tokens" })).toBeHidden();
      expect(await nav.evaluate((el) => getComputedStyle(el).position)).toBe("sticky");
      expect((await links.first().boundingBox())!.height).toBeGreaterThanOrEqual(39.5);

      // Narrow the strip so it scrolls, then read the last section: its link scrolls into view.
      const strip = nav.locator(".ayy-toc__list").first();
      await strip.evaluate((el) => (el.style.maxInlineSize = "8rem"));
      await page.locator(".pv-page").evaluate((el) => (el.style.paddingBlockEnd = "100vh"));
      await page.evaluate(() => {
        const target = document.getElementById("toc-impact")!;
        window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY - 8);
      });
      const impact = nav.getByRole("link", { name: /Impact/ });
      await expect(impact).toHaveAttribute("aria-current", "location");
      await expect
        .poll(async () => {
          const [a, s] = await Promise.all([impact.boundingBox(), strip.boundingBox()]);
          return a!.x >= s!.x - 1 && a!.x + a!.width <= s!.x + s!.width + 1;
        })
        .toBe(true);
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

    test("theme toggle lists every theme, applies the choice and remembers it", async ({ page }) => {
      await open(page, "theme-toggle", { renderer, theme: "dark" });
      const toggle = stage(page).getByRole("button", { name: "Theme" });
      await toggle.click();
      const items = page.getByRole("menuitemradio");
      await expect(items).toHaveText(["System", "Dark", "Dark soft", "Light", "Light gray"]);
      await items.filter({ hasText: /^Light gray$/ }).click();
      await expect(page.locator("html")).toHaveAttribute("data-theme", "light-gray");
      expect(await page.evaluate(() => localStorage.getItem("ayy-theme"))).toBe("light-gray");
      const shown = () =>
        toggle
          .locator("svg")
          .evaluateAll((svgs) => svgs.filter((s) => getComputedStyle(s).color !== "rgba(0, 0, 0, 0)").map((s) => (s.classList.contains("ayy-theme-toggle__sun") ? "sun" : "moon")));
      await expect.poll(shown).toEqual(["sun"]);
      await toggle.click();
      await expect(page.getByRole("menuitemradio", { name: "Light gray" })).toHaveAttribute("aria-checked", "true");
      await page.getByRole("menuitemradio", { name: "System" }).click();
      await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.+/);
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
      await expect(input).toHaveValue("Lisbon");
      await input.fill("");
      await input.pressSequentially("jap");
      const listbox = page.getByRole("listbox");
      await expect(listbox).toBeVisible();
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
    const avatar = stage(page).getByRole("img", { name: "Broken Image" });
    await expect(avatar.locator(".ayy-avatar__fallback")).toBeVisible();
    await expect(avatar.locator("img")).toHaveCount(renderer === "react" ? 0 : 1);
    if (renderer === "html") await expect(avatar.locator("img")).toBeHidden();
  });
}
