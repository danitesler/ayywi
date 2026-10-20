import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { expect, test, type Page } from "@playwright/test";

// Regression tests for bugs found in the 2026-10 audit. Plain-HTML cases load only the dist files (run `pnpm build`
// first); React cases bundle a small app from src/react with esbuild, so they can render setups the preview has no
// example for (12-hour pickers, context menus, wrapped command items).

const read = (p: string) => readFileSync(new URL(`../../dist/${p}`, import.meta.url), "utf8");
const here = fileURLToPath(new URL(".", import.meta.url));

type Log = unknown[][];
declare global {
  interface Window {
    __log: Log;
    __add?: () => void;
  }
}

async function serve(page: Page, body: string, script = ""): Promise<string[]> {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route("**/regress/**", (route) => {
    const file = new URL(route.request().url()).pathname.replace("/regress/", "");
    if (file === "index.html") return route.fulfill({ contentType: "text/html", body });
    if (file === "app.js") return route.fulfill({ contentType: "text/javascript", body: script });
    return route.fulfill({ contentType: file.endsWith(".css") ? "text/css" : "text/javascript", body: read(file) });
  });
  await page.goto("/regress/index.html");
  return errors;
}

/** A plain HTML page with ayywi's CSS and elements.global.js. */
async function htmlPage(page: Page, html: string): Promise<string[]> {
  const errors = await serve(
    page,
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>t</title><link rel="stylesheet" href="/regress/ayywi.min.css">
<script src="/regress/elements.global.js" defer></script></head><body style="padding: 16px">${html}</body></html>`,
  );
  await page.waitForFunction(() => Boolean(customElements.get("ayy-tabs")));
  return errors;
}

/** A page rendering `app` (TSX with a default-exported component; `ayywi` is src/react). */
async function reactPage(page: Page, app: string): Promise<string[]> {
  const result = await build({
    stdin: {
      contents: `import { createRoot } from "react-dom/client";\nwindow.__log = [];\n${app.replaceAll('from "ayywi"', 'from "../../src/react/index"')}\ncreateRoot(document.getElementById("root")!).render(<App />);`,
      resolveDir: here,
      loader: "tsx",
    },
    bundle: true,
    write: false,
    format: "iife",
    jsx: "automatic",
    define: { "process.env.NODE_ENV": '"development"' },
    logLevel: "silent",
  });
  const errors = await serve(
    page,
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>t</title><link rel="stylesheet" href="/regress/ayywi.min.css"></head>
<body style="padding: 16px"><div id="root"></div><script src="/regress/app.js"></script></body></html>`,
    result.outputFiles[0].text,
  );
  await expect(page.locator("#root > *").first()).toBeAttached();
  return errors;
}

const logs = (page: Page, tag: string) => page.evaluate((t) => window.__log.filter((e) => e[0] === t).map((e) => e.slice(1)), tag);

test.describe("page setup", () => {
  test("elements.global.js in <head> without defer still syncs controls once the body is parsed", async ({ page }) => {
    const errors = await serve(
      page,
      `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>t</title><link rel="stylesheet" href="/regress/ayywi.min.css">
<script src="/regress/elements.global.js"></script></head><body>
<input class="ayy-slider" type="range" min="0" max="100" value="30" aria-label="Volume"></body></html>`,
    );
    const slider = page.locator("input.ayy-slider").first();
    await expect(slider).toHaveAttribute("style", /--ayy-value:\s*30/);
    // Controls added later are watched too.
    await page.evaluate(() => {
      const added = Object.assign(document.createElement("input"), { className: "ayy-slider", type: "range", value: "70" });
      added.setAttribute("aria-label", "Added");
      document.body.append(added);
    });
    await expect(page.getByLabel("Added")).toHaveAttribute("style", /--ayy-value:\s*70/);
    expect(errors).toEqual([]);
  });
});

test.describe("gestures", () => {
  test("swipe: a mouse press released outside the row doesn't leave a drag behind for the next hover", async ({ page }) => {
    await htmlPage(
      page,
      `<ayy-swipe style="display: block; inline-size: 20rem"><div class="ayy-swipe">
  <div class="ayy-swipe__content">Buy milk</div>
  <div class="ayy-swipe__actions ayy-swipe__actions--end"><button type="button" class="ayy-swipe__action">Delete</button></div>
</div></ayy-swipe>`,
    );
    const row = page.locator(".ayy-swipe");
    const box = (await row.locator(".ayy-swipe__content").boundingBox())!;
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x, y + 200);
    await page.mouse.up();
    // Back over the row with no button held, sideways.
    await page.mouse.move(x, y);
    for (let i = 1; i <= 8; i++) await page.mouse.move(x - 20 * i, y);
    await expect(row).not.toHaveAttribute("data-dragging");
    expect(await row.evaluate((el) => el.style.getPropertyValue("--_x"))).toMatch(/^(0px)?$/);
  });
});

test.describe("data", () => {
  test("<ayy-table> keeps empty cells last when sorting descending", async ({ page }) => {
    const row = (name: string, amount: string) => `<tr><td>${name}</td><td class="ayy-table__num">${amount}</td></tr>`;
    await htmlPage(
      page,
      `<ayy-table><table class="ayy-table"><thead><tr><th scope="col">Name</th>
<th scope="col" class="ayy-table__num"><button type="button" class="ayy-table__sort">Amount</button></th></tr></thead>
<tbody>${row("A", "$40")}${row("B", "")}${row("C", "$1,200")}${row("D", "$7")}</tbody></table></ayy-table>`,
    );
    const names = () => page.locator("tbody tr td:first-child").allTextContents();
    const sort = page.getByRole("button", { name: "Amount" });
    await sort.click();
    await expect(page.locator("th").nth(1)).toHaveAttribute("aria-sort", "ascending");
    expect(await names()).toEqual(["D", "A", "C", "B"]);
    await sort.click();
    await expect(page.locator("th").nth(1)).toHaveAttribute("aria-sort", "descending");
    expect(await names()).toEqual(["C", "A", "D", "B"]);
  });
});
