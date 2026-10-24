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

test.describe("time pickers", () => {
  test("24-hour <ayy-time-picker>: the hour moves across noon both ways", async ({ page }) => {
    await htmlPage(page, `<ayy-time-picker value="14:30" format="24h" step="15"><div class="ayy-time-picker"></div></ayy-time-picker>`);
    const picker = page.locator("ayy-time-picker");
    const hours = picker.getByRole("listbox", { name: "Hours" });
    await hours.getByRole("option", { name: "09", exact: true }).click();
    await expect(picker).toHaveAttribute("value", "09:30");
    await hours.getByRole("option", { name: "12", exact: true }).click();
    await expect(picker).toHaveAttribute("value", "12:30");
    await picker.evaluate((el) => el.setAttribute("value", "11:30"));
    await picker.getByRole("textbox", { name: "Hours" }).focus();
    await page.keyboard.press("ArrowUp");
    await expect(picker).toHaveAttribute("value", "12:30");
    await picker.evaluate((el) => el.setAttribute("value", "15:00"));
    const field = picker.getByRole("textbox", { name: "Hours" });
    await field.fill("");
    await field.pressSequentially("08");
    await expect(picker).toHaveAttribute("value", "08:00");
  });

  test("12-hour <ayy-time-picker> and <ayy-date-time-picker>: labels keep PM, the date-time value is ISO", async ({ page }) => {
    await htmlPage(
      page,
      `<ayy-popover align="start">
        <button type="button" class="ayy-input ayy-time-picker-trigger" popovertarget="t12"><span class="ayy-time-picker-trigger__value"></span></button>
        <div class="ayy-popover" id="t12" popover role="dialog" aria-label="Time"><ayy-time-picker format="12h" step="15"><div class="ayy-time-picker"></div></ayy-time-picker></div>
      </ayy-popover>
      <ayy-popover align="start">
        <button type="button" class="ayy-input ayy-date-time-picker-trigger" popovertarget="dt12"><span class="ayy-date-time-picker-trigger__value"></span></button>
        <div class="ayy-popover" id="dt12" popover role="dialog" aria-label="When"><ayy-date-time-picker format="12h" step="15"><div class="ayy-date-time-picker"></div></ayy-date-time-picker></div>
      </ayy-popover>`,
    );
    await page.locator(".ayy-time-picker-trigger").click();
    const time = page.locator("#t12");
    await time.getByRole("listbox", { name: "Period" }).getByRole("option", { name: "PM" }).click();
    await time.getByRole("listbox", { name: "Hours" }).getByRole("option", { name: "02", exact: true }).click();
    await expect(page.locator(".ayy-time-picker-trigger__value")).toHaveText("02:00 PM");
    await page.keyboard.press("Escape");

    await page.locator(".ayy-date-time-picker-trigger").click();
    const dt = page.locator("#dt12");
    await dt.locator(".ayy-date-picker-grid__day:not([data-outside])").first().click();
    await dt.getByRole("listbox", { name: "Period" }).getByRole("option", { name: "PM" }).click();
    await dt.getByRole("listbox", { name: "Hours" }).getByRole("option", { name: "02", exact: true }).click();
    await expect(page.locator("ayy-date-time-picker")).toHaveAttribute("value", /^\d{4}-\d{2}-\d{2}T14:00$/);
    await expect(page.locator(".ayy-date-time-picker-trigger__value")).toHaveText(/, 02:00 PM$/);
  });

  test("React 12-hour TimePicker keeps PM when the next part is picked", async ({ page }) => {
    await reactPage(
      page,
      `import { useState } from "react";
      import { TimePicker } from "ayywi";
      function App() {
        const [v, setV] = useState("");
        return <div><TimePicker format="12h" step={15} value={v} onValueChange={setV} /><output>{v}</output></div>;
      }`,
    );
    await page.getByRole("listbox", { name: "Period" }).getByRole("option", { name: "PM" }).click();
    await page.getByRole("listbox", { name: "Hours" }).getByRole("option", { name: "02", exact: true }).click();
    await expect(page.getByRole("listbox", { name: "Period" }).getByRole("option", { name: "PM" })).toHaveAttribute("aria-selected", "true");
    await page.getByRole("listbox", { name: "Minutes" }).getByRole("option", { name: "30", exact: true }).click();
    await expect(page.locator("output")).toHaveText("02:30 PM");
  });

  test("date picker footers: a button that isn't Clear or Today leaves the value alone", async ({ page }) => {
    await htmlPage(
      page,
      `<ayy-date-picker value="2026-10-14"><div class="ayy-date-picker-grid">
        <div class="ayy-date-picker-grid__footer"><button type="button" class="ayy-button ayy-button--sm">Done</button><button type="button" class="ayy-button ayy-button--sm">Clear</button></div>
      </div></ayy-date-picker>`,
    );
    await page.getByRole("button", { name: "Done" }).click();
    await expect(page.locator("ayy-date-picker")).toHaveAttribute("value", "2026-10-14");
    await page.getByRole("button", { name: "Clear" }).click();
    await expect(page.locator("ayy-date-picker")).not.toHaveAttribute("value");
  });

  test("React pickers: Clear reports once, and DateRange reports null to a destructuring handler without crashing", async ({ page }) => {
    const errors = await reactPage(
      page,
      `import { useState } from "react";
      import { DateRange, DateTimePickerTrigger } from "ayywi";
      function App() {
        const [r, setR] = useState<[string, string] | null>(["2026-10-10", "2026-10-12"]);
        const [dt, setDt] = useState("2026-10-14T09:30");
        return (
          <div>
            <div id="range"><DateRange value={r ?? undefined} showActions onValueChange={(range) => { window.__log.push(["range", range]); setR(range); }} /></div>
            <div id="dt"><DateTimePickerTrigger aria-label="When" value={dt} onValueChange={(x) => { window.__log.push(["dt", x]); setDt(x); }} /></div>
          </div>
        );
      }`,
    );
    await page.locator("#range").getByRole("button", { name: "Clear" }).click();
    expect(await logs(page, "range")).toEqual([[null]]);
    await page.getByRole("button", { name: "When" }).click();
    await page.locator("#dt .ayy-popover").getByRole("button", { name: "Clear" }).click();
    expect(await logs(page, "dt")).toEqual([[""]]);
    expect(errors).toEqual([]);
  });
});

test.describe("combobox and tag input", () => {
  test("<ayy-tag-input> with suggestions: clearing after a pick and Esc, Esc don't throw", async ({ page }) => {
    const errors = await htmlPage(
      page,
      `<ayy-tag-input><div class="ayy-tag-input ayy-combobox">
        <input class="ayy-tag-input__input" aria-label="Tags">
        <ul class="ayy-combobox__listbox"><li role="option" class="ayy-combobox__option">design</li><li role="option" class="ayy-combobox__option">dev</li></ul>
      </div></ayy-tag-input>`,
    );
    const input = page.getByRole("combobox", { name: "Tags" });
    await input.click();
    await input.pressSequentially("des");
    await page.keyboard.press("Enter");
    await expect(page.locator(".ayy-tag-input__tag")).toHaveText(["design"]);
    await input.pressSequentially("x");
    await page.keyboard.press("Backspace");
    await input.pressSequentially("abc");
    await page.keyboard.press("Escape");
    await page.keyboard.press("Escape");
    await expect(input).toHaveValue("");
    await expect(page.locator(".ayy-tag-input__tag")).toHaveText(["design"]);
    expect(errors).toEqual([]);
  });

  test("React Combobox and TagInput: one ('', null) report per clear, no throw", async ({ page }) => {
    const errors = await reactPage(
      page,
      `import { useState } from "react";
      import { Combobox, TagInput } from "ayywi";
      function App() {
        const [tags, setTags] = useState<string[]>([]);
        return (
          <div>
            <Combobox aria-label="Fruit" options={["Apple", "Banana"]} onValueChange={(value, option) => window.__log.push(["combo", value, option && option.label])} />
            <div style={{ marginBlockStart: 240 }}><TagInput aria-label="Tags" value={tags} onValueChange={setTags} suggestions={["design", "dev"]} /></div>
          </div>
        );
      }`,
    );
    const fruit = page.getByRole("combobox", { name: "Fruit" });
    await fruit.click();
    await fruit.pressSequentially("Ban");
    await page.keyboard.press("Enter");
    await fruit.press("ControlOrMeta+a");
    await fruit.press("Backspace");
    await page.keyboard.press("Tab");
    expect(await logs(page, "combo")).toEqual([["Banana", "Banana"], ["", null]]);

    const tags = page.getByRole("combobox", { name: "Tags" });
    await tags.click();
    await tags.pressSequentially("des");
    await page.keyboard.press("Enter");
    await tags.pressSequentially("x");
    await page.keyboard.press("Backspace");
    expect(errors).toEqual([]);
  });

  test("a combobox list placed above its input stays against it while filtering", async ({ page }) => {
    await htmlPage(
      page,
      `<div style="position: fixed; inset-block-end: 24px; inset-inline-start: 16px; inline-size: 240px">
        <ayy-combobox><div class="ayy-combobox"><input class="ayy-input" aria-label="Fruit"><ul class="ayy-combobox__listbox">
          ${["Apple", "Apricot", "Banana", "Blueberry", "Cherry", "Grape", "Lemon", "Mango"].map((f) => `<li role="option" class="ayy-combobox__option">${f}</li>`).join("")}
        </ul></div></ayy-combobox>
      </div>`,
    );
    const input = page.getByRole("combobox", { name: "Fruit" });
    const list = page.locator(".ayy-combobox__listbox");
    await input.click();
    await input.pressSequentially("Ap");
    await expect(list.getByRole("option", { name: "Banana" })).toBeHidden();
    await expect
      .poll(async () => {
        const i = (await input.boundingBox())!;
        const l = (await list.boundingBox())!;
        return Math.round(i.y - (l.y + l.height));
      })
      .toBeLessThanOrEqual(6);
  });
});

test.describe("menus and command palettes", () => {
  test("<ayy-menu> without a trigger opens at the point and keeps checkbox items open", async ({ page }) => {
    await htmlPage(
      page,
      `<ayy-menu id="ctx"><div role="menu" class="ayy-menu" popover="auto">
        <button type="button" role="menuitemcheckbox" aria-checked="false" class="ayy-menu__item">Show grid</button>
        <button type="button" role="menuitem" class="ayy-menu__item">Copy</button>
      </div></ayy-menu>`,
    );
    await page.evaluate(() => (document.getElementById("ctx") as unknown as { openAt(x: number, y: number): void }).openAt(200, 300));
    const menu = page.getByRole("menu");
    await expect(menu).toBeVisible();
    await expect.poll(async () => (await menu.boundingBox())?.x).toBeCloseTo(200, -1);
    await expect.poll(async () => (await menu.boundingBox())?.y).toBeCloseTo(300, -1);
    await page.getByRole("menuitemcheckbox", { name: "Show grid" }).click();
    await expect(page.getByRole("menuitemcheckbox", { name: "Show grid" })).toHaveAttribute("aria-checked", "true");
    await expect(menu).toBeVisible();
  });

  test("React DropdownMenu with anchorPoint opens at the point", async ({ page }) => {
    await reactPage(
      page,
      `import { useState } from "react";
      import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem } from "ayywi";
      function App() {
        const [pt, setPt] = useState<{ x: number; y: number }>();
        const [grid, setGrid] = useState(false);
        return (
          <div>
            <button type="button" onClick={() => setPt({ x: 200, y: 300 })}>Open here</button>
            <DropdownMenu anchorPoint={pt}>
              <DropdownMenuContent>
                <DropdownMenuCheckboxItem checked={grid} onCheckedChange={setGrid}>Show grid</DropdownMenuCheckboxItem>
                <DropdownMenuItem>Copy</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      }`,
    );
    await page.getByRole("button", { name: "Open here" }).click();
    const menu = page.getByRole("menu");
    await expect(menu).toBeVisible();
    await expect.poll(async () => (await menu.boundingBox())?.x).toBeCloseTo(200, -1);
    await expect.poll(async () => (await menu.boundingBox())?.y).toBeCloseTo(300, -1);
    await page.getByRole("menuitemcheckbox", { name: "Show grid" }).click();
    await expect(menu).toBeVisible();
  });

  test("React Command: ranks title matches first, reports each keystroke once, and wrapped or added items survive updates", async ({ page }) => {
    const errors = await reactPage(
      page,
      `import { useState } from "react";
      import { Command, CommandGroup, CommandItem } from "ayywi";
      function App() {
        const [items, setItems] = useState(["Alpha", "Bravo", "Charlie"]);
        const [wrapped, setWrapped] = useState(["Echo", "Foxtrot"]);
        window.__add = () => setItems((xs) => [...xs, "Delta"]);
        return (
          <div>
            <button type="button" onClick={() => setWrapped((xs) => xs.slice(1))}>Remove first</button>
            <Command label="Search" onSearchChange={(text) => window.__log.push(["search", text])}>
              <CommandGroup heading="Letters">{items.map((x) => <CommandItem key={x}>{x}</CommandItem>)}</CommandGroup>
              <CommandGroup heading="Settings">{["Open settings", "Settle up", "Set"].map((x) => <CommandItem key={x}>{x}</CommandItem>)}</CommandGroup>
              <CommandGroup heading="Wrapped"><div className="wrapper">{wrapped.map((x) => <CommandItem key={x}>{x}</CommandItem>)}</div></CommandGroup>
            </Command>
          </div>
        );
      }`,
    );
    const input = page.getByRole("combobox", { name: "Search" });
    await input.fill("set");
    await expect(page.locator(".ayy-command__item:not([hidden])")).toHaveText(["Set", "Settle up", "Open settings"]);
    await expect(page.locator(".ayy-command__item[aria-selected=true]")).toHaveText("Set");
    expect(await logs(page, "search")).toEqual([["set"]]);
    await input.fill("fox");
    await expect(page.locator(".wrapper > .ayy-command__item")).toHaveCount(2);
    await page.getByRole("button", { name: "Remove first" }).click();
    await expect(page.locator(".wrapper > .ayy-command__item")).toHaveText(["Foxtrot"]);
    await input.fill("");
    await page.evaluate(() => window.__add?.());
    await expect(page.locator(".ayy-command__group").first().locator(".ayy-command__item")).toHaveText(["Alpha", "Bravo", "Charlie", "Delta"]);
    expect(errors).toEqual([]);
  });

  test("<ayy-command>: best matches move up, items in a wrapper stay put, an added item keeps its place", async ({ page }) => {
    await htmlPage(
      page,
      `<ayy-command><div class="ayy-command">
        <div class="ayy-command__search"><input class="ayy-command__input" aria-label="Search"></div>
        <div class="ayy-command__list">
          <div class="ayy-command__group" id="g"><div class="ayy-command__item">Open settings</div><div class="ayy-command__item">Settle up</div><div class="ayy-command__item">Set</div></div>
          <div class="ayy-command__group"><div class="wrapper"><div class="ayy-command__item">Settings sync</div></div></div>
        </div>
      </div></ayy-command>`,
    );
    const input = page.getByRole("combobox", { name: "Search" });
    await input.fill("set");
    await expect(page.locator("#g .ayy-command__item:not([hidden])")).toHaveText(["Set", "Settle up", "Open settings"]);
    await expect(page.locator(".wrapper > .ayy-command__item")).toHaveText(["Settings sync"]);
    await input.fill("");
    await expect(page.locator("#g .ayy-command__item")).toHaveText(["Open settings", "Settle up", "Set"]);
    await page.evaluate(() => {
      const item = document.createElement("div");
      item.className = "ayy-command__item";
      item.textContent = "Sign out";
      document.getElementById("g")!.append(item);
      (document.querySelector("ayy-command") as unknown as { refresh(): void }).refresh();
    });
    await expect(page.locator("#g .ayy-command__item")).toHaveText(["Open settings", "Settle up", "Set", "Sign out"]);
  });
});

test.describe("content and colour", () => {
  test("TOC: link text is never parsed as HTML, and a % in an id doesn't break it", async ({ page }) => {
    const errors = await htmlPage(
      page,
      `<nav class="ayy-toc" aria-label="On this page"><ayy-toc><ol class="ayy-toc__list">
        <li><a class="ayy-toc__link" href="#a">&lt;img src=x onerror="window.__xss=1"&gt; Intro</a></li>
        <li><a class="ayy-toc__link" href="#save-20%-now">Save 20% now</a></li>
      </ol></ayy-toc></nav>
      <h2 id="a">Intro</h2><h2 id="save-20%-now">Save</h2>`,
    );
    // The label is the first link's text as text (the scrollspy may move it on to the current section later).
    await expect(page.locator(".ayy-toc__toggle-current")).toHaveText(/onerror|Save 20% now/);
    await expect(page.locator(".ayy-toc__bar img")).toHaveCount(0);
    expect(await page.locator(".ayy-toc__toggle-current").evaluate((el) => el.children.length)).toBe(0);
    await page.mouse.wheel(0, 200);
    await page.waitForTimeout(100);
    expect(await page.evaluate(() => (window as unknown as { __xss?: number }).__xss ?? null)).toBeNull();
    expect(errors).toEqual([]);
  });

  test("code block selector: switches to the block's own templates, never to built-in sample code", async ({ page }) => {
    await htmlPage(
      page,
      `${["one", "two"]
        .map(
          (id) => `<div class="ayy-code-block" id="${id}">
        <div class="ayy-code-block__header"><span class="ayy-code-block__filename">install.sh</span><div class="ayy-code-block__actions">
          <ayy-menu align="end"><button type="button" class="ayy-code-block__selector" popovertarget="${id}-m" aria-label="Language"><span>Bash</span></button>
            <div id="${id}-m" role="menu" class="ayy-menu ayy-code-block__menu" popover="auto">
              <button type="button" role="menuitemradio" aria-checked="true" class="ayy-menu__item" data-value="bash">Bash</button>
              <button type="button" role="menuitemradio" aria-checked="false" class="ayy-menu__item" data-value="python">Python</button>
            </div></ayy-menu></div></div>
        <pre class="ayy-code-block__pre"><code class="ayy-code-block__code" data-language="bash">pip install my-package</code></pre>
        ${id === "two" ? `<template data-language="python" data-filename="install.py">import my_package</template>` : ""}
      </div>`,
        )
        .join("")}`,
    );
    for (const id of ["one", "two"]) {
      await page.locator(`#${id} .ayy-code-block__selector`).click();
      await page.locator(`#${id}-m`).getByRole("menuitemradio", { name: "Python" }).click();
    }
    await expect(page.locator("#one code")).toHaveText("pip install my-package");
    await expect(page.locator("#one .ayy-code-block__filename")).toHaveText("install.sh");
    await expect(page.locator("#two code")).toHaveText("import my_package");
    await expect(page.locator("#two .ayy-code-block__filename")).toHaveText("install.py");
  });

  test("colour picker in RTL: the handle lands where the pointer picked", async ({ page }) => {
    await htmlPage(
      page,
      `<div dir="rtl"><ayy-color-picker value="#2563eb"><div class="ayy-color-picker" style="inline-size: 240px">
        <div class="ayy-color-picker__area" tabindex="0" role="slider" aria-label="Colour"><div class="ayy-color-picker__handle"></div></div>
      </div></ayy-color-picker></div>`,
    );
    const area = page.getByRole("slider", { name: "Colour" });
    const box = (await area.boundingBox())!;
    await page.mouse.click(box.x + box.width * 0.1, box.y + box.height * 0.2);
    const handle = (await page.locator(".ayy-color-picker__handle").boundingBox())!;
    expect(Math.abs(handle.x + handle.width / 2 - (box.x + box.width * 0.1))).toBeLessThan(4);
  });

  test("colour picker emits #rrggbb whatever hex is typed; a custom swatch gets #ffffff for #fff", async ({ page }) => {
    // Older browsers turn anything but #rrggbb in <input type=color> into black, so the picker must normalise.
    await htmlPage(
      page,
      `<ayy-color-picker value="#2563eb"><div class="ayy-color-picker"><div class="ayy-color-picker__inputs"><input class="ayy-input" aria-label="Hex"></div></div></ayy-color-picker>
      <label class="ayy-swatch ayy-swatch--custom"><input type="color" value="#2563eb" aria-label="Custom colour"></label>`,
    );
    await page.evaluate(() => {
      window.__log = [];
      document.addEventListener("ayy-change", (e) => window.__log.push(["change", (e as CustomEvent<{ value: string }>).detail.value]));
    });
    await page.getByRole("textbox", { name: "Hex", exact: true }).fill(" #FFF");
    expect(await logs(page, "change")).toEqual([["#ffffff"]]);
    await page.locator(".ayy-swatch--custom").click();
    await page.getByRole("textbox", { name: "Hex color" }).fill("#fff");
    await expect(page.locator('input[type="color"]')).toHaveValue("#ffffff");
  });

  test("toast.card shows a media duration as text", async ({ page }) => {
    await htmlPage(page, "");
    await page.evaluate(() =>
      (window as unknown as { ayywi: { toast: { card(o: object): void } } }).ayywi.toast.card({
        src: "data:image/gif;base64,R0lGODlhAQABAAAAACw=",
        media: { type: "video", duration: '<img src=x onerror="window.__xss=1">0:42' },
      }),
    );
    await expect(page.locator(".ayy-toast__media")).toContainText("<img src=x");
    await expect(page.locator(".ayy-toast__media img")).toHaveCount(0);
  });
});

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

test.describe("focus rings", () => {
  // WebKit (Safari, Tauri on macOS) never focuses a button on click, so focus that script moves afterwards (a dialog
  // opening, focus going back to the opener) matches :focus-visible and drew a ring after mouse use. Chromium matches
  // it the same way after a key that isn't navigation ("a" below), which stands in for WebKit here.
  const ring = (page: Page, selector: string) => page.locator(selector).evaluate((el) => getComputedStyle(el).outlineColor);
  const transparent = "rgba(0, 0, 0, 0)";

  test("rings show after Tab or arrows, not after a click, and text fields keep theirs", async ({ page }) => {
    await htmlPage(
      page,
      `<button type="button" class="ayy-button" id="open">Open</button>
<input class="ayy-input" id="name" aria-label="Name">
<label class="ayy-label"><input type="checkbox" class="ayy-checkbox" id="check"> Check</label>
<ayy-tooltip class="ayy-tooltip"><button type="button" class="ayy-button ayy-button--outline" id="tip">Tip</button>
<span class="ayy-tooltip__content" role="tooltip" id="tip-content">Save</span></ayy-tooltip>`,
    );
    const html = page.locator("html");
    await expect(html).toHaveAttribute("data-ayy-input", "pointer");

    await page.locator("#open").click();
    await page.keyboard.press("a");
    await page.locator("#tip").evaluate((el) => (el as HTMLElement).focus());
    expect(await page.locator("#tip").evaluate((el) => el.matches(":focus-visible"))).toBe(true);
    expect(await ring(page, "#tip")).toBe(transparent);
    await expect(page.locator("#tip-content")).toBeHidden();
    await page.locator("#check").evaluate((el) => (el as HTMLElement).focus());
    expect(await ring(page, "#check")).toBe(transparent);

    await page.locator("#name").click();
    expect(await ring(page, "#name")).not.toBe(transparent);

    await page.keyboard.press("Shift+Tab");
    await expect(html).toHaveAttribute("data-ayy-input", "keyboard");
    expect(await ring(page, "#open")).not.toBe(transparent);

    await page.mouse.click(300, 300);
    await expect(html).toHaveAttribute("data-ayy-input", "pointer");
    // Shortcuts aren't navigation.
    await page.keyboard.press("Meta+ArrowDown");
    await page.keyboard.press("Control+Tab");
    await expect(html).toHaveAttribute("data-ayy-input", "pointer");
    await page.keyboard.press("ArrowDown");
    await expect(html).toHaveAttribute("data-ayy-input", "keyboard");
  });

  test("React: the button a dialog focuses on open has no ring after a click", async ({ page }) => {
    await reactPage(
      page,
      `import { useState } from "react";
import { Button, Dialog, DialogContent, DialogTitle, DialogFooter, DialogClose, trackInputModality } from "ayywi";
trackInputModality();
export default function App() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Clear all</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent size="sm">
          <DialogTitle>Clear the history?</DialogTitle>
          <DialogFooter><DialogClose>Cancel</DialogClose></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}`,
    );
    // A click that doesn't focus the button, after a key that isn't navigation: what WebKit sees on every click.
    await page.mouse.click(300, 300);
    await page.keyboard.press("a");
    await page.getByRole("button", { name: "Clear all" }).evaluate((el) => (el as HTMLElement).click());
    const cancel = page.getByRole("button", { name: "Cancel" });
    await expect(cancel).toBeFocused();
    expect(await cancel.evaluate((el) => el.matches(":focus-visible"))).toBe(true);
    expect(await cancel.evaluate((el) => getComputedStyle(el).outlineColor)).toBe(transparent);
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    expect(await page.locator(":focus").evaluate((el) => getComputedStyle(el).outlineColor)).not.toBe(transparent);
  });
});

test.describe("inline edit", () => {
  test("React InlineEdit shows displayValue and edits the raw value", async ({ page }) => {
    await reactPage(
      page,
      `import { useState } from "react";
      import { InlineEdit } from "ayywi";
      function App() {
        const [value, setValue] = useState("2026-10-24");
        const [year, month, day] = value.split("-").map(Number);
        const display = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(year, month - 1, day));
        return <InlineEdit label="Change the due date" value={value} onValueChange={setValue} displayValue={display} />;
      }`,
    );
    const display = page.getByRole("button", { name: "Change the due date" });
    await expect(display).toHaveText("24 Oct 2026");
    await display.click();
    const input = page.getByRole("textbox", { name: "Change the due date" });
    await expect(input).toHaveValue("2026-10-24");
    await input.fill("2026-11-01");
    await input.press("Enter");
    await expect(display).toHaveText("1 Nov 2026");
  });

  test("React InlineEdit follows a controlled value and can reject a change", async ({ page }) => {
    await reactPage(
      page,
      `import { useState } from "react";
      import { InlineEdit } from "ayywi";
      function App() {
        const [value, setValue] = useState("1.4.0");
        return (
          <div>
            <InlineEdit label="Change the version" value={value} onValueChange={(next) => { if (!next.endsWith("-rejected")) setValue(next); }} />
            <button type="button" onClick={() => setValue("3.0.0")}>Set 3.0.0</button>
          </div>
        );
      }`,
    );
    await page.getByRole("button", { name: "Change the version" }).click();
    const input = page.getByRole("textbox", { name: "Change the version" });
    await input.fill("2.0.0-rejected");
    await input.press("Enter");
    await expect(page.getByRole("button", { name: "Change the version" })).toHaveText("1.4.0");
    await page.getByRole("button", { name: "Set 3.0.0" }).click();
    await expect(page.getByRole("button", { name: "Change the version" })).toHaveText("3.0.0");
  });
});
