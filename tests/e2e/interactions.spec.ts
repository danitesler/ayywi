import { expect, test } from "@playwright/test";
import { open, settle, stage } from "./helpers";

for (const renderer of ["react", "html"] as const) {
  test.describe(renderer, () => {
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

    test("theme toggle switches the page theme and remembers it", async ({ page }) => {
      await open(page, "theme-toggle", { renderer, theme: "dark" });
      const toggle = stage(page).getByRole("button", { name: "Dark theme" });
      await expect(toggle).toHaveAttribute("aria-pressed", "true");
      await toggle.click();
      await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
      await expect(toggle).toHaveAttribute("aria-pressed", "false");
      expect(await page.evaluate(() => localStorage.getItem("ayy-theme"))).toBe("light");
      const shown = () =>
        toggle.locator("svg").evaluateAll((svgs) => svgs.filter((s) => getComputedStyle(s).color !== "rgba(0, 0, 0, 0)").map((s) => s.getAttribute("class")));
      await expect.poll(shown).toEqual(["ayy-theme-toggle__sun"]);
      await toggle.click();
      await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
      await expect.poll(shown).toEqual(["ayy-theme-toggle__moon"]);
    });

    test("a card link covers the whole card", async ({ page }) => {
      await open(page, "card", { renderer });
      const card = stage(page, 2).locator(".ayy-card").first();
      await card.scrollIntoViewIfNeeded();
      const box = (await card.boundingBox())!;
      const hit = await page.evaluate(([x, y]) => document.elementFromPoint(x, y)?.closest("a")?.textContent, [box.x + box.width / 2, box.y + 24]);
      expect(hit).toBe("Oktopost");
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

for (const renderer of ["react", "html"] as const) {
  test(`avatar hides a failed image so initials show (${renderer})`, async ({ page }) => {
    await open(page, "avatar", { renderer });
    const avatar = stage(page).getByRole("img", { name: "Broken Image" });
    await expect(avatar.locator(".ayy-avatar__fallback")).toBeVisible();
    await expect(avatar.locator("img")).toHaveCount(renderer === "react" ? 0 : 1);
    if (renderer === "html") await expect(avatar.locator("img")).toBeHidden();
  });
}
