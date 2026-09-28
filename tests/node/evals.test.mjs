import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { parseTask, scoreOutput } from "../../evals/score.mjs";

const evals = (p) => fileURLToPath(new URL(`../../evals/${p}`, import.meta.url));

test("every eval task parses and its patterns are valid regexes", () => {
  for (const f of readdirSync(evals("tasks"))) {
    const task = parseTask(readFileSync(evals(`tasks/${f}`), "utf8"));
    assert.ok(task.prompt.length > 40, f);
    for (const p of [...task.expect, ...task.reject]) new RegExp(p);
  }
});

test("scorer separates a good answer from a bad one", () => {
  const task = parseTask(readFileSync(evals("tasks/settings-form.md"), "utf8"));
  const good = scoreOutput(task, evals("fixtures/settings-form/good"));
  const bad = scoreOutput(task, evals("fixtures/settings-form/bad"));
  assert.equal(good.score, 1, JSON.stringify(good.checks.filter((c) => !c.pass)));
  assert.ok(bad.score < 0.5, `bad scored ${bad.score}`);
  assert.equal(scoreOutput(task, evals("fixtures")).score, 0, "missing file scores 0");
});
