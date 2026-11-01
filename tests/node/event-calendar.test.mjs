import { test } from "node:test";
import assert from "node:assert/strict";
import { eventCalendarMonth, eventCalendarShiftDate } from "../../dist/index.js";
test("eventCalendarMonth lays out 42 days and sorts each day's events", () => {
  const events = [
    { id: "a", date: "2026-10-14", title: "Design review", time: "09:30" },
    { id: "b", date: "2026-10-14", title: "Ship v0.2" },
    { id: "c", date: "2026-10-14", title: "Old", time: "08:00", done: true },
    { id: "d", date: "2026-10-14", title: "Early", time: "08:15" },
    { id: "x", date: "2026-12-01", title: "Not shown" },
  ];
  const days = eventCalendarMonth({ month: "2026-10-01", events, today: "2026-10-14", weekStart: 1 });
  assert.equal(days.length, 42); assert.equal(days[0].date, "2026-09-28"); assert.equal(days[0].outside, true); assert.equal(days[3].date, "2026-10-01");
  const day = days.find((d) => d.date === "2026-10-14");
  assert.equal(day.today, true); assert.deepEqual(day.events.map((e) => e.id), ["b", "d", "a", "c"]);
  assert.equal(days.flatMap((d) => d.events).some((e) => e.id === "x"), false);
  assert.equal(eventCalendarMonth({ month: "2026-10-01", events: [], weekStart: 0 })[0].date, "2026-09-27");
});


test("eventCalendarShiftDate", () => {
  assert.equal(eventCalendarShiftDate("2026-10-30", "ArrowRight", false), "2026-10-31");
  assert.equal(eventCalendarShiftDate("2026-10-30", "ArrowRight", true), "2026-10-29");
  assert.equal(eventCalendarShiftDate("2026-10-30", "ArrowDown", false), "2026-11-06");
  assert.equal(eventCalendarShiftDate("2026-10-01", "ArrowUp", true), "2026-09-24");
});
