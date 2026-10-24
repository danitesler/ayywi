import { expect, test } from "@playwright/test";
import { example, keyboardFocus, open, rtl } from "./helpers";

for (const renderer of ["react", "html"] as const) {
  test.describe(`tree (${renderer})`, () => {
    test("keyboard: expand, collapse, children, parents, Home and End", async ({ page }) => {
      await open(page, "tree", { renderer });
      const ex = example(page, "folders");
      const tree = ex.getByRole("tree", { name: "Folders" });
      const projects = tree.getByRole("treeitem", { name: "Projects", exact: true });
      const launch = tree.getByRole("treeitem", { name: "Q4 launch", exact: true });
      await keyboardFocus(projects);
      await expect(projects).toBeFocused();
      await expect(projects).toHaveAttribute("aria-expanded", "true");

      await page.keyboard.press("ArrowRight"); // collapse
      await expect(projects).toHaveAttribute("aria-expanded", "false");
      await page.keyboard.press("ArrowRight"); // expand
      await expect(projects).toHaveAttribute("aria-expanded", "true");
      await page.keyboard.press("ArrowRight"); // first child
      await expect(launch).toBeFocused();
      expect(await launch.getAttribute("aria-level")).toBe("2");
      await page.keyboard.press("ArrowLeft"); // parent
      await expect(projects).toBeFocused();
      await page.keyboard.press("ArrowLeft"); // collapse
      await expect(projects).toHaveAttribute("aria-expanded", "false");
      await page.keyboard.press("ArrowDown");
      await expect(tree.getByRole("treeitem", { name: "Team", exact: true })).toBeFocused();
      await page.keyboard.press("End");
      await expect(tree.getByRole("treeitem").last()).toBeFocused();
      await page.keyboard.press("Home");
      await expect(projects).toBeFocused();
    });

    test("a toggle expands without selecting; a row selects; Enter activates", async ({ page }) => {
      await open(page, "tree", { renderer });
      const ex = example(page, "folders");
      const tree = ex.getByRole("tree", { name: "Folders" });
      const projects = tree.getByRole("treeitem", { name: "Projects", exact: true });
      // The selected child stays in the DOM (and keeps its selection) while its group is hidden, so look past hidden.
      const launch = tree.getByRole("treeitem", { name: "Q4 launch", exact: true, includeHidden: true });
      await expect(launch).toHaveAttribute("aria-selected", "true");
      await projects.locator(".ayy-tree__toggle").click();
      await expect(projects).toHaveAttribute("aria-expanded", "false");
      await expect(launch).toHaveAttribute("aria-selected", "true");
      await projects.locator(".ayy-tree__toggle").click();
      await launch.click();
      await expect(launch).toHaveAttribute("aria-selected", "true");
      if (renderer === "react") {
        await page.keyboard.press("Enter");
        await expect(ex.getByRole("status")).toHaveText("Opened Q4 launch");
      } else {
        await page.evaluate(() => {
          (window as unknown as { __opened: unknown[] }).__opened = [];
          document.addEventListener("ayy-activate", (event) => (window as unknown as { __opened: unknown[] }).__opened.push((event as CustomEvent).detail));
        });
        await page.keyboard.press("Enter");
        expect(await page.evaluate(() => (window as unknown as { __opened: unknown[] }).__opened)).toEqual([{ id: "q4" }]);
      }
    });

    test("a disabled node cannot be selected or activated", async ({ page }) => {
      await open(page, "tree", { renderer });
      const ex = example(page, "folders");
      const tree = ex.getByRole("tree", { name: "Folders" });
      const locked = tree.getByRole("treeitem", { name: "Shared with me", exact: true });
      await expect(locked).toHaveAttribute("aria-disabled", "true");
      // Playwright refuses a normal click on an aria-disabled target; force it, so the click reaches the controller
      // that must ignore it.
      await locked.click({ force: true });
      await expect(locked).toHaveAttribute("aria-selected", "false");
      await keyboardFocus(locked);
      await page.keyboard.press("Enter");
      await expect(ex.getByRole("status")).not.toHaveText(/Shared with me/);
    });

    test("RTL indents from the right and mirrors the chevron", async ({ page }) => {
      await open(page, "tree", { renderer });
      const ex = example(page, "folders");
      const tree = ex.getByRole("tree", { name: "Folders" });
      const parent = tree.getByRole("treeitem", { name: "Projects", exact: true });
      const child = tree.getByRole("treeitem", { name: "Q4 launch", exact: true });
      const row = parent.locator(":scope > .ayy-tree__row");
      const childRow = child.locator(":scope > .ayy-tree__row");
      const left = (l: typeof row) => l.evaluate((el) => el.getBoundingClientRect().x);
      const right = (l: typeof row) => l.evaluate((el) => el.getBoundingClientRect().right);
      expect(await left(childRow)).toBeGreaterThan(await left(row));
      const chevron = parent.locator(".ayy-tree__toggle svg");
      const before = await chevron.evaluate((el) => getComputedStyle(el).transform);
      await rtl(ex);
      expect(await right(childRow)).toBeLessThan(await right(row));
      // The chevron's rotation transitions, so wait for it rather than reading the first frame.
      await expect.poll(() => chevron.evaluate((el) => getComputedStyle(el).transform)).not.toBe(before);
    });

    test("a long label wraps inside the row at phone width", async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 800 });
      await open(page, "tree", { renderer });
      const ex = example(page, "folders");
      const row = ex.getByRole("tree", { name: "Folders" }).getByRole("treeitem", { name: /Averyveryvery/ });
      await expect(row).toBeVisible();
      expect(await row.evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
    });

    test("the picker selects without activating", async ({ page }) => {
      await open(page, "tree", { renderer });
      const ex = example(page, "picker");
      const tree = ex.getByRole("tree", { name: "Choose a folder" });
      await tree.getByRole("treeitem", { name: "Marketing", exact: true }).click();
      await expect(tree.getByRole("treeitem", { name: "Marketing", exact: true })).toHaveAttribute("aria-selected", "true");
      await expect(tree.getByRole("treeitem", { name: "Marketing", exact: true })).toBeFocused();
    });
  });
}
