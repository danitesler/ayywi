import { test } from "node:test";
import assert from "node:assert/strict";
import { findBarCountText } from "../../dist/index.js";

test("findBarCountText", () => {
  assert.equal(findBarCountText("", 0, 0), "");
  assert.equal(findBarCountText("zzz", 0, 0), "No results");
  assert.equal(findBarCountText("launch", 2, 3), "2 of 3");
  assert.equal(findBarCountText("launch", 1, 3, { count: (c, t) => `${c}/${t}` }), "1/3");
});
