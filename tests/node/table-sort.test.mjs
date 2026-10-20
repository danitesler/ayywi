import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const dist = (p) => fileURLToPath(new URL(`../../dist/${p}`, import.meta.url));

test("compareValues keeps empty values last in both directions", { skip: !existsSync(dist("index.js")) && "run pnpm build first" }, async () => {
  const { compareValues } = await import(dist("index.js"));
  const values = ["12", "", "3", null, "120"];
  assert.deepEqual([...values].sort((a, b) => compareValues(a, b)), ["3", "12", "120", "", null]);
  assert.deepEqual([...values].sort((a, b) => compareValues(a, b, "ascending")), ["3", "12", "120", "", null]);
  assert.deepEqual([...values].sort((a, b) => compareValues(a, b, "descending")), ["120", "12", "3", "", null]);
  assert.deepEqual([5, 1, 9].sort((a, b) => compareValues(a, b, "descending")), [9, 5, 1]);
  assert.deepEqual(["b", "", "a"].sort((a, b) => compareValues(a, b, "descending")), ["b", "a", ""]);
});
