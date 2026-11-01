import { expect, test, type Locator } from "@playwright/test";
import { example, keyboardFocus, open, rtl } from "./helpers";
const day = (ex: Locator, date: string) => ex.locator(`.ayy-event-calendar__day[data-date="${date}"]`);
const titles = (ex: Locator, date: string) => day(ex, date).locator(".ayy-event-calendar__event-title").allTextContents();

test("a month: title, weekdays, 42 days, today, other months, sorted events", async ({ page }) => {
  await open(page, "event-calendar", { renderer: "react" });
  const ex = example(page, "schedule");
  await expect(ex.getByRole("heading", { name: "October 2026" })).toBeVisible();
  await expect(ex.locator(".ayy-event-calendar__weekdays > span")).toHaveText(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
  await expect(ex.locator(".ayy-event-calendar__day")).toHaveCount(42);
  await expect(day(ex, "2026-10-14")).toHaveAttribute("aria-current", "date");
  await expect(day(ex, "2026-09-28")).toHaveAttribute("data-outside", "");
  expect(await titles(ex, "2026-10-14")).toEqual(["Ship v0.2", "Design review"]);
  await expect(day(ex, "2026-10-14")).toHaveAccessibleName("Wednesday, October 14, 2026, 2 events");
});
test("navigation, add and event clicks", async ({ page }) => {
  await open(page, "event-calendar", { renderer: "react" });
  const ex = example(page, "schedule");
  await ex.getByRole("button", { name: "Next month" }).click();
  await expect(ex.getByRole("heading", { name: "November 2026" })).toBeVisible();
  await ex.getByRole("button", { name: "Today" }).click();
  await expect(ex.getByRole("heading", { name: "October 2026" })).toBeVisible();
  await ex.getByRole("button", { name: "Add an event on Wednesday, October 14, 2026" }).click();
  await day(ex, "2026-10-14").getByRole("button", { name: /more/ }).click();
  const popover = page.getByRole("dialog", { name: "Wednesday, October 14, 2026" });
  await expect(popover.locator(".ayy-event-calendar__event-title")).toHaveText(["Ship v0.2", "New event", "Design review"]);
  const review = popover.locator('.ayy-event-calendar__event[data-id="e1"]');
  await expect(review).toHaveAttribute("aria-current", "true");
  await review.click(); await expect(review).not.toHaveAttribute("aria-current", "true");
});
test("fits a phone, keeps long titles in their day, mirrors in RTL", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await open(page, "event-calendar", { renderer: "react" });
  const ex = example(page, "schedule");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(await day(ex, "2026-10-02").evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
  await rtl(ex);
  const mon = await day(ex, "2026-09-28").boundingBox(); const sun = await day(ex, "2026-10-04").boundingBox();
  expect(mon!.x).toBeGreaterThan(sun!.x);
  const prev = await ex.getByRole("button", { name: "Previous month" }).boundingBox(); const next = await ex.getByRole("button", { name: "Next month" }).boundingBox();
  expect(prev!.x).toBeGreaterThan(next!.x);
});


test("a full day shows +N more; Alt+arrows move an event", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await open(page, "event-calendar", { renderer: "react" });
  const ex = example(page, "schedule");
  const busy = day(ex, "2026-10-21");
  const more = busy.locator(".ayy-event-calendar__more");
  await expect(more).toBeVisible();
  const shown = await busy.locator(".ayy-event-calendar__event:visible").count();
  const hidden = Number((await more.textContent())!.match(/\d+/)![0]);
  expect(shown + hidden).toBe(5);
  expect(hidden).toBeGreaterThanOrEqual(1);
  await more.click();
  const pop = page.getByRole("dialog", { name: "Wednesday, October 21, 2026" });
  await expect(pop.locator(".ayy-event-calendar__event")).toHaveCount(5);
  await page.keyboard.press("Escape");
  await expect(more).toBeFocused();
  const notes = ex.getByRole("button", { name: "Release notes" });
  await keyboardFocus(notes);
  await page.keyboard.press("Alt+ArrowRight");
  expect(await titles(ex, "2026-10-31")).toEqual(["Release notes"]);
  await expect(day(ex, "2026-10-31").getByRole("button", { name: "Release notes" })).toBeFocused();
});

test("touch density fits no more rows than compact", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  const rows = async (density: "compact" | "touch") => {
    await open(page, "event-calendar", { renderer: "react", density });
    return day(example(page, "schedule"), "2026-10-21").locator(".ayy-event-calendar__event:visible").count();
  };
  expect(await rows("touch")).toBeLessThanOrEqual(await rows("compact"));
});

test("drag an event to another day", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await open(page, "event-calendar", { renderer: "react" });
  const ex = example(page, "schedule");
  await ex.getByRole("button", { name: "Release notes" }).scrollIntoViewIfNeeded();
  const from = await ex.getByRole("button", { name: "Release notes" }).boundingBox();
  const to = await day(ex, "2026-10-28").boundingBox();
  await page.mouse.move(from!.x + 10, from!.y + from!.height / 2);
  await page.mouse.down();
  await page.mouse.move(to!.x + to!.width / 2, to!.y + to!.height - 12, { steps: 12 });
  await page.mouse.up();
  expect(await titles(ex, "2026-10-28")).toEqual(["Release notes"]);
  expect(await titles(ex, "2026-10-30")).toEqual([]);
});
