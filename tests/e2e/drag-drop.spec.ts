import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { distFile } from "./helpers";

async function tableFixture(page: Page, count = 1000) {
  await page.route("**/dist/**", (route) => {
    const file = new URL(route.request().url()).pathname.slice("/dist/".length);
    return route.fulfill({ contentType: file.endsWith(".css") ? "text/css" : "text/javascript", body: readFileSync(distFile(file), "utf8") });
  });
  await page.route("**/drag-performance", (route) => route.fulfill({
    contentType: "text/html",
    body: '<!doctype html><html lang="en"><title>Table drag performance</title><link rel="stylesheet" href="/dist/ayywi.css"><body><main><div style="height:600px;overflow:auto"><table class="ayy-table" aria-label="Accounts"><thead><tr><th>Move</th><th>Name</th><th>Status</th></tr></thead><tbody></tbody></table></div></main></body></html>',
  }));
  await page.goto("/drag-performance");
  await page.evaluate(async (count) => {
    const path = "/dist/index.js";
    const { connectTableRowReorder } = await import(path);
    const table = document.querySelector("table")!;
    const body = table.tBodies[0];
    for (let i = 0; i < count; i++) {
      const row = body.insertRow();
      row.dataset.id = String(i);
      const handle = document.createElement("button");
      handle.className = "ayy-drag-handle";
      handle.setAttribute("aria-label", `Move Account ${i}`);
      handle.textContent = "⠿";
      row.insertCell().append(handle);
      row.insertCell().textContent = `Account ${i}`;
      row.insertCell().textContent = "Active";
    }
    connectTableRowReorder(table);
  }, count);
}

test("table drag: pointer bursts reuse row geometry between frames", async ({ page }) => {
  await tableFixture(page);
  const measurement = await page.evaluate(async () => {
    const handle = document.querySelector("button")!;
    const box = handle.getBoundingClientRect();
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    const fire = (type: string, y: number, target: EventTarget = window) => target.dispatchEvent(new PointerEvent(type, {
      clientX: x, clientY: y, button: 0, buttons: 1, isPrimary: true, bubbles: true, cancelable: true,
    }));
    fire("pointerdown", y, handle);
    fire("pointermove", y + 8);
    await new Promise(requestAnimationFrame);
    const original = Element.prototype.getBoundingClientRect;
    let reads = 0;
    Element.prototype.getBoundingClientRect = function () {
      if (this.matches("tbody tr")) reads++;
      return original.call(this);
    };
    try {
      for (let frame = 0; frame < 20; frame++) {
        for (let move = 0; move < 8; move++) fire("pointermove", y + 80 + frame + move);
        await new Promise(requestAnimationFrame);
      }
      return { reads };
    } finally {
      fire("pointercancel", y);
      Element.prototype.getBoundingClientRect = original;
    }
  });
  // Re-reading every row on every pointer event makes large tables lag.
  expect(measurement.reads).toBeLessThan(2000);
  await expect(page.locator(".ayy-drag-preview")).toHaveCount(0);
});

test("table drag: the preview stays at the pointer and release uses the final position", async ({ page }) => {
  await tableFixture(page, 20);
  const handle = page.getByRole("button", { name: "Move Account 0", exact: true });
  const box = (await handle.boundingBox())!;
  const target = (await page.locator('tr[data-id="3"]').boundingBox())!;
  const x = box.x + box.width / 2;
  const y = target.y + target.height * 0.8;
  await page.mouse.move(x, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(x, y, { steps: 4 });
  const preview = page.locator(".ayy-drag-preview");
  await expect(preview).toBeVisible();
  const previewBox = (await preview.boundingBox())!;
  expect(Math.abs(previewBox.y - y)).toBeLessThan(previewBox.height);
  await expect(page.locator("tr[data-drop-edge]")).toHaveCount(1);
  await page.mouse.up();
  await expect(page.locator("tbody tr").nth(3)).toHaveAttribute("data-id", "0");
  await expect(preview).toHaveCount(0);
  await expect(page.locator("[data-drop-edge], [data-dragging]")).toHaveCount(0);
});

test("table drag: scrolling refreshes the target, Escape cancels without moving rows", async ({ page }) => {
  await tableFixture(page);
  const handle = page.getByRole("button", { name: "Move Account 0", exact: true });
  const box = (await handle.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2, 250, { steps: 4 });
  await expect(page.locator("tr[data-drop-edge]")).toHaveCount(1);
  const before = await page.locator("tr[data-drop-edge]").getAttribute("data-id");
  await page.mouse.wheel(0, 500);
  await expect.poll(() => page.locator("tr[data-drop-edge]").getAttribute("data-id")).not.toBe(before);
  await page.keyboard.press("Escape");
  await page.mouse.up();
  await expect(page.locator("tbody tr").first()).toHaveAttribute("data-id", "0");
  await expect(page.locator(".ayy-drag-preview, [data-drop-edge], [data-dragging]")).toHaveCount(0);
});

test("table drag: releasing before the next frame commits the latest pointer position", async ({ page }) => {
  await tableFixture(page, 20);
  await page.evaluate(() => {
    const handle = document.querySelector("button")!;
    const source = handle.getBoundingClientRect();
    const target = document.querySelector('tr[data-id="3"]')!.getBoundingClientRect();
    const fire = (type: string, y: number, receiver: EventTarget = window) => receiver.dispatchEvent(new PointerEvent(type, {
      clientX: source.x + source.width / 2, clientY: y, button: 0, isPrimary: true, bubbles: true, cancelable: true,
    }));
    fire("pointerdown", source.y + source.height / 2, handle);
    fire("pointermove", source.y + source.height + 8);
    fire("pointermove", target.bottom - 4);
    fire("pointerup", target.bottom - 4);
  });
  await expect(page.locator("tbody tr").nth(3)).toHaveAttribute("data-id", "0");
});

test("table drag: holding still stops work and moving near the edge scrolls the table", async ({ page }) => {
  await tableFixture(page);
  const handle = page.getByRole("button", { name: "Move Account 0", exact: true });
  const box = (await handle.boundingBox())!;
  const x = box.x + box.width / 2;
  await page.mouse.move(x, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(x, 250, { steps: 4 });
  await expect(page.locator("tr[data-drop-edge]")).toHaveCount(1);
  const reads = await page.evaluate(async () => {
    // Let the first ResizeObserver delivery and its frame settle.
    for (let i = 0; i < 3; i++) await new Promise(requestAnimationFrame);
    const original = Element.prototype.getBoundingClientRect;
    const scroller = document.querySelector("main > div");
    let reads = 0;
    Element.prototype.getBoundingClientRect = function () {
      if (this === scroller) reads++;
      return original.call(this);
    };
    try {
      for (let i = 0; i < 6; i++) await new Promise(requestAnimationFrame);
      return reads;
    } finally {
      Element.prototype.getBoundingClientRect = original;
    }
  });
  expect(reads).toBe(0);
  await page.mouse.move(x, 590);
  await expect.poll(() => page.locator("main > div").evaluate((el) => el.scrollTop)).toBeGreaterThan(100);
  await page.keyboard.press("Escape");
  await page.mouse.up();
});

test("table drag: resized rows refresh the insertion position inside a fixed-height table", async ({ page }) => {
  await tableFixture(page, 20);
  await page.locator("table").evaluate((el) => { el.style.height = "2000px"; });
  const handle = page.getByRole("button", { name: "Move Account 0", exact: true });
  const box = (await handle.boundingBox())!;
  const x = box.x + box.width / 2;
  await page.mouse.move(x, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(x, 450, { steps: 4 });
  await expect(page.locator("tr[data-drop-edge]")).toHaveCount(1);
  const before = await page.locator("tr[data-drop-edge]").getAttribute("data-id");
  await page.evaluate(() => {
    const row = document.querySelector('tr[data-id="1"]') as HTMLElement;
    row.style.height = "600px";
  });
  await expect.poll(() => page.locator("tr[data-drop-edge]").getAttribute("data-id")).not.toBe(before);
  await page.keyboard.press("Escape");
  await page.mouse.up();
});

test("table drag: release remeasures layout changes before observers deliver", async ({ page }) => {
  await tableFixture(page, 20);
  const handle = page.getByRole("button", { name: "Move Account 0", exact: true });
  const source = (await handle.boundingBox())!;
  const target = (await page.locator('tr[data-id="3"]').boundingBox())!;
  const x = source.x + source.width / 2;
  const y = target.y + target.height - 4;
  await page.mouse.move(x, source.y + source.height / 2);
  await page.mouse.down();
  await page.mouse.move(x, y, { steps: 4 });
  await expect(page.locator("tr[data-drop-edge]")).toHaveCount(1);
  await page.evaluate(({ x, y }) => {
    const row = document.querySelector('tr[data-id="3"]') as HTMLElement;
    row.style.height = "300px";
    window.dispatchEvent(new PointerEvent("pointerup", { clientX: x, clientY: y, button: 0, isPrimary: true, bubbles: true }));
  }, { x, y });
  await page.mouse.up();
  await expect(page.locator("tbody tr").nth(2)).toHaveAttribute("data-id", "0");
});
