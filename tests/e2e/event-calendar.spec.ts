import { expect, test, type Locator } from "@playwright/test";
import { example, keyboardFocus, open, rtl } from "./helpers";
const day = (ex: Locator, date: string) => ex.locator(`.ayy-event-calendar__day[data-date="${date}"]`);
const titles = (ex: Locator, date: string) => day(ex, date).locator(".ayy-event-calendar__event-title").allTextContents();
const pickMonth = async (ex: Locator, date: string) => {
  await ex.locator(".ayy-event-calendar__title button").first().click();
  await ex.locator(`.ayy-date-picker-grid__cell[data-month="${date}-01"]`).click();
};

const chooseView = async (ex: Locator, view: string, count = 3) => {
  await ex.getByRole("button", { name: "Calendar view" }).click();
  if (view === "multi-day") {
    await ex.getByRole("menuitemradio", { name: /Custom/ }).click();
    await ex.getByRole("menuitemradio", { name: `${count} days`, exact: true }).click();
  } else {
    await ex.getByRole("menuitemradio", { name: view === "month" ? "Month" : view === "week" ? "Week" : "Day", exact: true }).click();
  }
};

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
  const more = day(ex, "2026-10-21").locator(".ayy-event-calendar__more");
  await expect(more).toBeVisible();
  expect(await more.evaluate((el) => el.scrollWidth <= el.clientWidth + 1 && el.scrollHeight <= el.clientHeight + 1)).toBe(true);
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
    await page.evaluate(async () => { await document.fonts.ready; await new Promise(requestAnimationFrame); await new Promise(requestAnimationFrame); });
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

test("keeps the month grid size and switches between calendar ranges", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await open(page, "event-calendar", { renderer: "react" });
  const ex = example(page, "schedule");
  const grid = ex.locator(".ayy-event-calendar__grid");
  const height = (await grid.boundingBox())!.height;
  await ex.getByRole("button", { name: "Next month" }).click();
  expect((await grid.boundingBox())!.height).toBeCloseTo(height, 0);
  await pickMonth(ex, "2026-10");
  await expect(ex.getByRole("heading", { name: "October 2026" })).toBeVisible();
  await chooseView(ex, "week");
  await expect(ex.locator(".ayy-event-calendar__day")).toHaveCount(7);
  await chooseView(ex, "day");
  await expect(ex.locator(".ayy-event-calendar__day")).toHaveCount(1);
  await chooseView(ex, "multi-day");
  for (const count of [2, 7, 4]) {
    await chooseView(ex, "multi-day", count);
    await expect(ex.locator(".ayy-event-calendar__day")).toHaveCount(count);
  }
});

test("the calendar keeps its height through every month on desktop and phone", async ({ page }) => {
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await open(page, "event-calendar", { renderer: "react" });
    const ex = example(page, "schedule");
    const calendar = ex.locator(".ayy-event-calendar");
    const initial = (await calendar.boundingBox())!.height;
    for (let month = 1; month <= 12; month++) {
      await pickMonth(ex, `2026-${String(month).padStart(2, "0")}`);
      expect((await calendar.boundingBox())!.height, `month ${month} at ${width}px`).toBeCloseTo(initial, 0);
    }
  }
});

test("in day view, the view follows an event moved with Alt+arrows", async ({ page }) => {
  await open(page, "event-calendar", { renderer: "react" });
  const ex = example(page, "schedule");
  await chooseView(ex, "day");
  await keyboardFocus(day(ex, "2026-10-14").getByRole("button", { name: /Design review/ }));
  await page.keyboard.press("Alt+ArrowRight");
  await expect(day(ex, "2026-10-15").getByRole("button", { name: /Design review/ })).toBeFocused();
});

test("calendar and grid fill their container in every view while navigating", async ({ page }) => {
  test.setTimeout(90_000); // Dozens of clicks, across two widths and every view.
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await open(page, "event-calendar", { renderer: "react" });
    const ex = example(page, "schedule");
    const calendar = ex.locator(".ayy-event-calendar");
    const grid = ex.locator(".ayy-event-calendar__grid");
    for (const view of ["month", "week", "day", "multi-day"]) {
      await chooseView(ex, view);
      for (const count of view === "multi-day" ? [2, 3, 4, 5, 6, 7] : [0]) {
        if (count) await chooseView(ex, "multi-day", count);
        for (let i = 0; i < 3; i++) {
          const sizes = await calendar.evaluate((el) => ({ calendar: el.getBoundingClientRect().width, container: el.parentElement!.getBoundingClientRect().width, grid: el.querySelector(".ayy-event-calendar__grid")!.getBoundingClientRect().width }));
          expect(sizes.calendar, `${width}px ${view} ${count}`).toBeCloseTo(sizes.container, 0);
          expect(sizes.grid, `${width}px ${view} ${count}`).toBeCloseTo(sizes.calendar, 0);
          await ex.getByRole("button", { name: view === "month" ? "Next month" : "Next period" }).click();
        }
      }
    }
  }
});


test("heading picks a month and year using the date picker", async ({ page }) => {
  await open(page, "event-calendar", { renderer: "react" });
  const ex = example(page, "schedule");
  await expect(ex.locator('input[type="month"]')).toHaveCount(0);
  await pickMonth(ex, "2026-12");
  await expect(ex.getByRole("heading", { name: "December 2026" })).toBeVisible();
  await ex.locator(".ayy-event-calendar__title button").last().click();
  await expect(ex.locator(".ayy-date-picker-grid__years")).toBeVisible();
  await ex.locator('.ayy-date-picker-grid__cell[data-year="2027"]').click();
  await expect(ex.getByRole("heading", { name: "December 2027" })).toBeVisible();
  await ex.locator(".ayy-event-calendar__title button").first().focus();
  await page.keyboard.press("Enter");
  await expect(ex.locator(".ayy-date-picker-grid__months")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(ex.locator(".ayy-date-picker-grid__months")).not.toBeVisible();
});


test("calendar view menu nests custom days and marks the current choice", async ({ page }) => {
  await open(page, "event-calendar", { renderer: "react" });
  const ex = example(page, "schedule");
  const trigger = ex.getByRole("button", { name: "Calendar view" });
  await trigger.click();
  await expect(ex.getByRole("menuitemradio", { name: "Month", exact: true })).toHaveAttribute("aria-checked", "true");
  const custom = ex.getByRole("menuitemradio", { name: /Custom/ });
  await custom.click();
  await ex.getByRole("menuitemradio", { name: "5 days", exact: true }).click();
  await expect(trigger).toContainText("5 days");
  await expect(ex.locator(".ayy-event-calendar__day")).toHaveCount(5);
  await trigger.click();
  await expect(custom).toHaveAttribute("aria-checked", "true");
  await custom.click();
  await expect(ex.getByRole("menuitemradio", { name: "5 days", exact: true })).toHaveAttribute("aria-checked", "true");
});

test("custom day choices work with the keyboard", async ({ page }) => {
  await open(page, "event-calendar", { renderer: "react" });
  const ex = example(page, "schedule");
  await keyboardFocus(ex.getByRole("button", { name: "Calendar view" }));
  await page.keyboard.press("Enter");
  const custom = ex.getByRole("menuitemradio", { name: "Custom", exact: true });
  await custom.focus();
  await page.keyboard.press("ArrowRight");
  const twoDays = ex.getByRole("menuitemradio", { name: "2 days", exact: true });
  await expect(twoDays).toBeVisible();
  await twoDays.focus();
  await page.keyboard.press("Enter");
  await expect(ex.locator(".ayy-event-calendar__day")).toHaveCount(2);
});

test("month and year pickers have static titles and match the calendar heading font", async ({ page }) => {
  await open(page, "event-calendar", { renderer: "react" });
  const ex = example(page, "schedule");
  const title = ex.locator(".ayy-event-calendar__title");
  await title.getByRole("button", { name: "October" }).click();
  const picker = ex.locator(".ayy-date-picker-grid");
  const pickerTitle = picker.locator(".ayy-date-picker-grid__title");
  await expect(pickerTitle).toHaveText("Month");
  await expect(pickerTitle.locator("button")).toHaveCount(0);
  const monthCell = picker.locator('[data-month="2026-01-01"]');
  const bodyFont = await page.locator("body").evaluate((el) => { const css = getComputedStyle(el); return { family: css.fontFamily, weight: css.fontWeight }; });
  expect(await monthCell.evaluate((el) => { const css = getComputedStyle(el); return { family: css.fontFamily, weight: css.fontWeight }; })).toEqual(bodyFont);
  expect(await title.evaluate((el) => getComputedStyle(el).fontFamily)).toBe(await pickerTitle.evaluate((el) => getComputedStyle(el).fontFamily));
  await picker.getByRole("button", { name: "Next year" }).click();
  await expect(picker.locator('[data-month="2027-10-01"]')).toBeVisible();
  await picker.locator('[data-month="2027-10-01"]').focus();
  await page.keyboard.press("Escape");
  await expect(picker).toHaveCount(0);
  await title.getByRole("button", { name: "2026" }).click();
  await expect(pickerTitle).toHaveText("Year");
  await expect(pickerTitle.locator("button")).toHaveCount(0);
  expect(await picker.locator('[data-year="2023"]').evaluate((el) => { const css = getComputedStyle(el); return { family: css.fontFamily, weight: css.fontWeight }; })).toEqual(bodyFont);
  await picker.getByRole("button", { name: "Next years" }).click();
  await expect(picker.locator('[data-year="2034"]')).toBeVisible();
});
