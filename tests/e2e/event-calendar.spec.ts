import { expect, test, type Locator } from "@playwright/test";
import { example, open, rtl } from "./helpers";
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
  expect(await titles(ex, "2026-10-14")).toEqual(["Ship v0.2", "New event", "Design review"]);
  const review = ex.locator('.ayy-event-calendar__event[data-id="e1"]');
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
