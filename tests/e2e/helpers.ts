import { expect, type Locator, type Page } from "@playwright/test";

export interface Settings {
  renderer?: "react" | "html";
  theme?: "dark" | "light" | "dark-soft" | "light-gray";
  density?: "compact" | "comfortable" | "touch";
}

const watched = new WeakMap<Page, string[]>();
let loads = 0;

/**
 * Open a preview route with toolbar settings seeded into localStorage, via a real page load (a hash change
 * alone would keep the old settings). Returns the page's error list, which fills for the page's lifetime.
 */
export async function open(page: Page, route: string, s: Settings = {}): Promise<string[]> {
  let errors = watched.get(page);
  if (!errors) {
    const list: string[] = [];
    errors = list;
    watched.set(page, list);
    page.on("pageerror", (e) => list.push(e.message));
    // Failed third-party requests (fonts behind a proxy) are not ours; failed local ones are.
    page.on("requestfailed", (r) => {
      if (new URL(r.url()).hostname === "127.0.0.1") list.push(`${r.url()}: ${r.failure()?.errorText}`);
    });
    page.on("console", (m) => {
      if (m.type() === "error" && !m.text().startsWith("Failed to load resource")) list.push(m.text());
    });
  }
  if (!page.url().startsWith("http")) await page.goto("/");
  await page.evaluate((s: Settings) => {
    localStorage.clear();
    const set = (k: string, v?: string) => v && localStorage.setItem(k, v);
    set("ayy-preview-renderer", s.renderer);
    set("ayy-theme", s.theme);
    set("ayy-density", s.density);
  }, s);
  await page.goto(`/?load=${++loads}#/${route}`);
  await expect(page.locator(".pv-page").first()).toBeVisible();
  return errors;
}

/** The live stage of the n-th example on a component page. */
export const stage = (page: Page, n = 0) => page.locator(".pv-stage").nth(n);

/** Wait for entry transitions/animations to finish, so boxes are measured at rest. */
export const settle = (l: Locator) => l.evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));

/** Mirror a stage right-to-left, the way a page with dir="rtl" on an ancestor would. */
export const rtl = (l: Locator) => l.evaluate((el) => el.setAttribute("dir", "rtl"));
