// The date/time and colour helpers the pickers share: one time model for both clocks, strict hex parsing.
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";

const dist = (p) => new URL(`../../dist/${p}`, import.meta.url);
const skip = !existsSync(dist("index.js")) && "run pnpm build first";
const m = skip ? {} : await import(dist("index.js").href);

test("parseTime reads either clock as 24-hour, and rejects times that don't exist", { skip }, () => {
  assert.deepEqual(m.parseTime("14:30"), { hours: 14, minutes: 30 });
  assert.deepEqual(m.parseTime("02:30 PM"), { hours: 14, minutes: 30 });
  assert.deepEqual(m.parseTime("2:30 pm"), { hours: 14, minutes: 30 });
  assert.deepEqual(m.parseTime("12:00 AM"), { hours: 0, minutes: 0 });
  assert.deepEqual(m.parseTime("12:00 PM"), { hours: 12, minutes: 0 });
  for (const bad of ["99:99", "24:00", "12:60", "00:30 AM", "13:00 PM", "", "noon"]) assert.equal(m.parseTime(bad), null, bad);
  assert.equal(m.parseTimeString("99:99"), null);
});

test("12-hour times keep their AM/PM when formatted", { skip }, () => {
  assert.equal(m.formatTimeString("02:30 PM", "12h"), "02:30 PM");
  assert.equal(m.formatTimeString("02:30 PM", "24h"), "14:30");
  assert.equal(m.formatTimeString("14:30", "12h"), "02:30 PM");
  assert.equal(m.formatTimeString("00:15", "12h"), "12:15 AM");
  assert.equal(m.formatTime("02:30 PM", true), "02:30 PM");
  assert.equal(m.formatTime("02:30 PM", false), "14:30");
  assert.equal(m.formatDateTime("2026-10-19", "02:30 PM", "en-US", "12h"), "Oct 19, 2026, 02:30 PM");
  assert.equal(m.formatDateTime("2026-10-19", "14:30", "en-US", "24h"), "Oct 19, 2026, 14:30");
});

test("toTime24 gives the ISO time part for either clock", { skip }, () => {
  assert.equal(m.toTime24("02:30 PM"), "14:30");
  assert.equal(m.toTime24("12:05 AM"), "00:05");
  assert.equal(m.toTime24("09:00"), "09:00");
  assert.equal(m.toTime24("later"), "later");
});

test("hexToRgb only accepts real hex colours", { skip }, () => {
  assert.deepEqual(m.hexToRgb("#fff"), { r: 255, g: 255, b: 255 });
  assert.deepEqual(m.hexToRgb(" #2563EB "), { r: 37, g: 99, b: 235 });
  assert.deepEqual(m.hexToRgb("#ff000080"), { r: 255, g: 0, b: 0, a: 0.5 });
  for (const bad of ["#12345g", "#0z0", "#fffffff", "red", ""]) assert.equal(m.hexToRgb(bad), null, bad);
});
