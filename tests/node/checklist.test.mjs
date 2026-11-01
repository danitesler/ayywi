import { test } from "node:test";
import assert from "node:assert/strict";
import { checklistProgress, checklistInsert, checklistRemove, checklistMove, checklistUpdate } from "../../dist/index.js";

test("checklist pure functions", () => {
  const items = [{ id: "a", text: "A", done: true }, { id: "b", text: "B", done: false }, { id: "c", text: "C", done: false }];
  assert.deepEqual(checklistProgress(items), { done: 1, total: 3, percent: 33 });
  assert.deepEqual(checklistProgress([]), { done: 0, total: 0, percent: 0 });
  assert.deepEqual(checklistInsert(items, "a", { id: "n", text: "", done: false }).map((i) => i.id), ["a", "n", "b", "c"]);
  assert.deepEqual(checklistInsert(items, null, { id: "n", text: "", done: false }).map((i) => i.id), ["a", "b", "c", "n"]);
  assert.deepEqual(checklistRemove(items, "b"), { items: [items[0], items[2]], focusId: "a" });
  assert.equal(checklistRemove(items, "a").focusId, "b");
  assert.equal(checklistRemove([items[0]], "a").focusId, null);
  assert.deepEqual(checklistMove(items, "c", -1).map((i) => i.id), ["a", "c", "b"]);
  assert.deepEqual(checklistMove(items, "a", -1).map((i) => i.id), ["a", "b", "c"]);
  assert.equal(checklistUpdate(items, "b", { done: true })[1].done, true);
  assert.equal(items[1].done, false);
});
