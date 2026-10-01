import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

// The no-build path: a static page with only the two dist files. Run `pnpm build` first.
const read = (p: string) => readFileSync(new URL(`../../dist/${p}`, import.meta.url), "utf8");

const PAGE = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>smoke</title>
<link rel="stylesheet" href="/smoke/ayywi.min.css">
<script src="/smoke/elements.global.js" defer></script>
</head><body>
<ayy-tabs class="ayy-tabs" value="a">
  <div class="ayy-tabs__list" role="tablist" aria-label="Demo">
    <button class="ayy-tabs__tab" role="tab" data-value="a" aria-selected="true">A</button>
    <button class="ayy-tabs__tab" role="tab" data-value="b" aria-selected="false" tabindex="-1">B</button>
  </div>
  <div class="ayy-tabs__panel" role="tabpanel" data-value="a">Panel A</div>
  <div class="ayy-tabs__panel" role="tabpanel" data-value="b" hidden>Panel B</div>
</ayy-tabs>
<ayy-dialog>
  <button class="ayy-button" data-ayy-open>Open</button>
  <dialog class="ayy-dialog" aria-label="Hi"><button class="ayy-button" data-ayy-close>Close</button></dialog>
</ayy-dialog>
<button class="ayy-button ayy-button--outline" onclick="ayywi.toast('Hello')">Toast</button>
</body></html>`;

test("dist bundle works on a plain HTML page", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route("**/smoke/**", (route) => {
    const file = new URL(route.request().url()).pathname.replace("/smoke/", "");
    if (file === "index.html") return route.fulfill({ contentType: "text/html", body: PAGE });
    return route.fulfill({ contentType: file.endsWith(".css") ? "text/css" : "text/javascript", body: read(file) });
  });
  await page.goto("/smoke/index.html");

  await expect(page.locator(".ayy-button").first()).toHaveCSS("border-radius", /px/);
  await page.getByRole("tab", { name: "B" }).click();
  await expect(page.getByText("Panel B")).toBeVisible();
  await page.getByRole("button", { name: "Open" }).click();
  await expect(page.getByRole("dialog", { name: "Hi" })).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.getByRole("dialog", { name: "Hi" })).toBeHidden();
  await page.getByRole("button", { name: "Toast" }).click();
  await expect(page.locator(".ayy-toast", { hasText: "Hello" })).toBeVisible();
  expect(errors).toEqual([]);
});

const route = (body: string) => async (r: import("@playwright/test").Route) => {
  const file = new URL(r.request().url()).pathname.replace("/smoke/", "");
  if (file === "index.html") return r.fulfill({ contentType: "text/html", body });
  return r.fulfill({ contentType: file.endsWith(".css") ? "text/css" : "text/javascript", body: read(file) });
};

test("a saved theme comes back: theme-init.js before the first paint, the toggle when it connects", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("ayy-theme", "light-gray"));
  const head = (init: boolean) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>t</title>
${init ? '<script src="/smoke/theme-init.js"></script>' : ""}
<link rel="stylesheet" href="/smoke/ayywi.min.css"><script src="/smoke/elements.global.js" defer></script></head><body>`;
  const toggle = `<ayy-theme-toggle><button class="ayy-theme-toggle" aria-label="Theme"></button>
<div class="ayy-menu" popover role="menu"><button class="ayy-menu__item ayy-theme-toggle__item" role="menuitemradio" data-value="system">System</button>
<button class="ayy-menu__item ayy-theme-toggle__item" role="menuitemradio" data-value="light-gray">Light gray</button></div></ayy-theme-toggle>`;

  // theme-init.js alone, no toggle: applied before any other script runs.
  await page.route("**/smoke/**", route(`${head(true)}<script>window.seen = document.documentElement.dataset.theme</script></body></html>`));
  await page.goto("/smoke/index.html");
  expect(await page.evaluate(() => (window as unknown as { seen: string }).seen)).toBe("light-gray");

  // No theme-init.js: the toggle restores it, and marks it in its menu.
  await page.unroute("**/smoke/**");
  await page.route("**/smoke/**", route(`${head(false)}${toggle}</body></html>`));
  await page.goto("/smoke/index.html");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light-gray");
  await expect(page.locator('[data-value="light-gray"]')).toHaveAttribute("aria-checked", "true");
});

test("page-wide helpers work on plain HTML: number fields step, sliders fill, combobox picks", async ({ page }) => {
  await page.route(
    "**/smoke/**",
    route(`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>t</title>
<link rel="stylesheet" href="/smoke/ayywi.min.css"><script src="/smoke/elements.global.js" defer></script></head><body>
<div class="ayy-number-field"><button type="button" class="ayy-number-field__decrement" aria-label="Fewer">-</button>
<input class="ayy-number-field__input" type="number" min="1" max="3" value="2" aria-label="Seats">
<button type="button" class="ayy-number-field__increment" aria-label="More">+</button></div>
<input class="ayy-slider" type="range" min="0" max="10" value="5" aria-label="Volume">
<ayy-combobox><div class="ayy-combobox"><input class="ayy-input" aria-label="City">
<ul class="ayy-combobox__listbox" popover="manual"><li role="option" class="ayy-combobox__option" data-value="lis">Lisbon</li><li role="option" class="ayy-combobox__option" data-value="tlv">Tel Aviv</li></ul></div></ayy-combobox>
</body></html>`),
  );
  await page.goto("/smoke/index.html");
  const more = page.getByRole("button", { name: "More" });
  await more.click();
  await expect(page.getByRole("spinbutton", { name: "Seats" })).toHaveValue("3");
  await expect(more).toHaveAttribute("aria-disabled", "true");
  const slider = page.getByRole("slider", { name: "Volume" });
  // Filled from its value when the script loads, and kept in step.
  await expect.poll(() => slider.evaluate((el) => (el as HTMLElement).style.getPropertyValue("--ayy-value"))).toBe("50");
  await slider.focus();
  await page.keyboard.press("End");
  await expect.poll(() => slider.evaluate((el) => (el as HTMLElement).style.getPropertyValue("--ayy-value"))).toBe("100");
  const city = page.getByRole("combobox", { name: "City" });
  await city.pressSequentially("tel");
  await page.keyboard.press("Enter");
  await expect(city).toHaveValue("Tel Aviv");
});
