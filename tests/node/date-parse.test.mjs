import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const dist = (p) => fileURLToPath(new URL(`../../dist/${p}`, import.meta.url));
const skip = !existsSync(dist("index.js")) && "run pnpm build first";

test("parseIsoDate reads the date part of a date-time and keeps two-digit years", { skip }, async () => {
  const { parseIsoDate, toIsoDate, addDays, addMonths, startOfWeek } = await import(dist("index.js"));
  assert.equal(toIsoDate(parseIsoDate("2026-10-19T10:00")), "2026-10-19");
  assert.equal(addDays("2026-10-19T10:00", 1), "2026-10-20");
  assert.equal(parseIsoDate("0099-03-01").getUTCFullYear(), 99);
  assert.equal(toIsoDate(parseIsoDate("0099-03-01")), "0099-03-01");
  assert.equal(addMonths("0005-01-31", 1), "0005-02-28");
  assert.equal(startOfWeek("0001-01-03", 1), "0001-01-01");
  assert.ok(Number.isNaN(parseIsoDate("next tuesday").getTime()), "not a date stays an invalid Date");
  assert.ok(Number.isNaN(parseIsoDate("2026-13-01").getTime()), "no month 13");
  assert.ok(Number.isNaN(parseIsoDate("2026-02-30").getTime()), "no 30 February");
});
