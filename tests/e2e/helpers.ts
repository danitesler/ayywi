import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { expect, type Locator, type Page } from "@playwright/test";

/**
 * A dist/ file from the build this run serves. scripts/e2e-server.mjs keeps its own copy, so another session's build
 * can't change it mid-run. Against a server it didn't start (E2E_REUSE), the checkout's dist/.
 */
export function distFile(path: string): URL {
  try {
    const served = new URL(`../../node_modules/.cache/ayywi-e2e/port-${process.env.E2E_PORT ?? 4173}.json`, import.meta.url);
    const { pid, dir } = JSON.parse(readFileSync(served, "utf8")) as { pid: number; dir: string };
    process.kill(pid, 0);
    return pathToFileURL(`${dir}/dist/${path}`);
  } catch {
    return new URL(`../../dist/${path}`, import.meta.url);
  }
}

export interface Settings {
  renderer?: "react" | "html";
  theme?: "dark" | "light" | "dark-contrast" | "light-gray";
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
    // Failed third-party requests (fonts behind a proxy) are not ours; failed local ones are. A load cancelled because the
    // page moved on (the lazy example iframes on Get started) isn't a failure.
    page.on("requestfailed", (r) => {
      const error = r.failure()?.errorText ?? "";
      if (new URL(r.url()).hostname === "127.0.0.1" && error !== "net::ERR_ABORTED") list.push(`${r.url()}: ${error}`);
    });
    page.on("console", (m) => {
      if (m.type() === "error" && !m.text().startsWith("Failed to load resource")) list.push(m.text());
    });
  }
  // Storage needs the origin, but not the app: a first app load saves its default settings ("system") from an effect
  // that can land after the values written below. A hosted text file runs no script.
  if (!page.url().startsWith("http")) await page.goto("/llms.txt");
  await page.evaluate((s: Settings) => {
    localStorage.clear();
    const set = (k: string, v?: string) => v && localStorage.setItem(k, v);
    set("ayy-preview-renderer", s.renderer);
    set("ayy-theme", s.theme);
    set("ayy-density", s.density);
  }, s);
  const url = `/?load=${++loads}#/${route}`;
  try {
    await page.goto(url, { waitUntil: "domcontentloaded" });
  } catch (err: any) {
    if (!`${err}`.includes("net::ERR_ABORTED")) throw err;
    // transient abort (e.g. from prior lazy loads); retry once
    await page.goto(url, { waitUntil: "domcontentloaded" });
  }
  await expect(page.locator(".pv-page").first()).toBeVisible();
  await examplesLoaded(page);
  return errors;
}

/** Examples load their code on first show, under a placeholder that says aria-busy; wait until every one is in. */
export const examplesLoaded = (page: Page) => expect(page.locator(".pv-example[aria-busy='true']")).toHaveCount(0);

/** The live stage of the n-th example on a component page. */
export const stage = (page: Page, n = 0) => page.locator(":is(.pv-stage, .ayy-showcase__stage)").nth(n);

/** The live stage of the example with this id (its file name), so adding an example doesn't shift the others. */
export const example = (page: Page, id: string) => page.locator(`:is(.pv-example, .ayy-showcase)[aria-labelledby="ex-${id}"] :is(.pv-stage, .ayy-showcase__stage)`);

/** Wait for entry transitions/animations to finish, so boxes are measured at rest. */
export const settle = (l: Locator) => l.evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));

/** Mirror a stage right-to-left, the way a page with dir="rtl" on an ancestor would. */
export const rtl = (l: Locator) => l.evaluate((el) => el.setAttribute("dir", "rtl"));

/** Focus as a keyboard user gets there: a Tab first puts the page in keyboard mode (trackInputModality), so the ring
    and focus-only UI (tooltips) show. A bare locator.focus() counts as pointer use. */
export async function keyboardFocus(l: Locator): Promise<void> {
  await l.page().keyboard.press("Tab");
  await l.focus();
}
