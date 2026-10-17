import test from "node:test";
import assert from "node:assert/strict";
import { sortingClass, sortingTriggerClass } from "../../dist/index.js";

test("sortingClass produces ayy-sorting class and size modifier", () => {
  assert.equal(sortingClass(), "ayy-sorting");
  assert.equal(sortingClass({ size: "md" }), "ayy-sorting");
  assert.equal(sortingClass({ size: "sm" }), "ayy-sorting ayy-sorting--sm");
  assert.equal(sortingClass({ size: "sm", className: "custom" }), "ayy-sorting ayy-sorting--sm custom");
});

test("sortingTriggerClass is ayy-sorting__trigger", () => {
  assert.equal(sortingTriggerClass, "ayy-sorting__trigger");
});
