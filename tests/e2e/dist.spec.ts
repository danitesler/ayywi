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
