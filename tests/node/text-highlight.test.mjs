import test from "node:test";
import assert from "node:assert/strict";
import { textHighlightParts, textHighlightClass } from "../../dist/index.js";

test("textHighlightClass produces ayy-text-highlight class and variant modifiers", () => {
  assert.equal(textHighlightClass(), "ayy-text-highlight");
  assert.equal(textHighlightClass({ variant: "warning" }), "ayy-text-highlight ayy-text-highlight--warning");
  assert.equal(textHighlightClass({ variant: "destructive" }), "ayy-text-highlight ayy-text-highlight--destructive");
  assert.equal(textHighlightClass({ variant: "success" }), "ayy-text-highlight ayy-text-highlight--success");
  assert.equal(textHighlightClass({ variant: "info" }), "ayy-text-highlight ayy-text-highlight--info");
  assert.equal(textHighlightClass({ variant: "orange" }), "ayy-text-highlight ayy-text-highlight--orange");
  assert.equal(textHighlightClass({ className: "custom" }), "ayy-text-highlight custom");
});

test("textHighlightParts returns text unchanged when query is empty or whitespace", () => {
  assert.deepEqual(textHighlightParts("Hello world", ""), [{ text: "Hello world", match: false }]);
  assert.deepEqual(textHighlightParts("Hello world", "   "), [{ text: "Hello world", match: false }]);
});

test("textHighlightParts matches substring case-insensitively and preserves original casing", () => {
  const parts = textHighlightParts("Input component for text input", "input");
  assert.deepEqual(parts, [
    { text: "Input", match: true },
    { text: " component for text ", match: false },
    { text: "input", match: true }
  ]);
});

test("textHighlightParts safely handles regex special characters", () => {
  const parts = textHighlightParts("Price ($10) [test]", "($10)");
  assert.deepEqual(parts, [
    { text: "Price ", match: false },
    { text: "($10)", match: true },
    { text: " [test]", match: false }
  ]);
});

test("textHighlightParts splits across multiple words in query", () => {
  const parts = textHighlightParts("Command palette input search", "palette search");
  assert.deepEqual(parts, [
    { text: "Command ", match: false },
    { text: "palette", match: true },
    { text: " input ", match: false },
    { text: "search", match: true }
  ]);
});
