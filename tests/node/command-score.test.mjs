import test from "node:test";
import assert from "node:assert/strict";
import { commandScore } from "../../dist/index.js";

test("commandScore gives highest priority to exact title match", () => {
  const exactScore = commandScore("Input", "", "", "input");
  const prefixScore = commandScore("Input group", "", "", "input");
  const wordStartScore = commandScore("Number input field", "", "", "input");
  const containsScore = commandScore("Userinput", "", "", "input");
  const descScore = commandScore("Choice card", "A native input wrapper", "", "input");

  assert.ok(exactScore > prefixScore, `Exact (${exactScore}) must beat prefix (${prefixScore})`);
  assert.ok(prefixScore > wordStartScore, `Prefix (${prefixScore}) must beat word start (${wordStartScore})`);
  assert.ok(wordStartScore > containsScore, `Word start (${wordStartScore}) must beat contains (${containsScore})`);
  assert.ok(containsScore > descScore, `Title match (${containsScore}) must beat description match (${descScore})`);
  assert.ok(descScore > 0, `Description match (${descScore}) must be positive`);
});

test("commandScore returns 0 when query does not match", () => {
  assert.equal(commandScore("Button", "Clickable element", "action", "input"), 0);
  assert.equal(commandScore("Card", "Container", "", "xyz"), 0);
});

test("commandScore returns 1 when query is empty or whitespace", () => {
  assert.equal(commandScore("Input", "Field", "text", ""), 1);
  assert.equal(commandScore("Input", "Field", "text", "   "), 1);
});

test("commandScore handles multi-word queries with title priority", () => {
  const matchTitle = commandScore("Date picker", "A calendar popup", "", "date picker");
  const matchDesc = commandScore("Calendar", "Date picker popup", "", "date picker");
  assert.ok(matchTitle > matchDesc, "Title multi-word match must beat description match");
});
