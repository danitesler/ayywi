#!/usr/bin/env node
// Scores one agent output against a task: the file exists, `ayywi lint` finds no errors and no skipped components
// (raw-control, bare-control, clickable-element, rebuilt-component), every `expect:` pattern
// matches and no `reject:` pattern does. Usage: node evals/score.mjs <task.md> <workspace-dir>
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadContract, lintText } from "../cli/lint.mjs";

/** Parse a task file: `---` header with file/expect/reject lines, then the prompt. */
export function parseTask(text) {
  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(text.replace(/\r\n/g, "\n"));
  if (!match) throw new Error("Task needs a --- header ---");
  const task = { file: "", expect: [], reject: [], prompt: match[2].trim() };
  for (const line of match[1].split("\n")) {
    const i = line.indexOf(":");
    if (i < 0) continue;
    const key = line.slice(0, i).trim();
    const value = line.slice(i + 1).trim();
    if (key === "file") task.file = value;
    else if (key === "expect" || key === "reject") task[key].push(value);
  }
  if (!task.file) throw new Error("Task needs a file: line");
  return task;
}

let contract;
// Lint rules that mean a component was skipped: an ayywi UI has none of them.
const SKIPPED = new Set(["raw-control", "bare-control", "clickable-element", "rebuilt-component"]);

/** Score `task.file` inside `dir`. Returns { score, checks: [{ name, pass, detail? }] }. */
export function scoreOutput(task, dir) {
  contract ??= loadContract();
  const path = join(dir, task.file);
  if (!existsSync(path)) return { score: 0, checks: [{ name: `writes ${task.file}`, pass: false }] };
  const code = readFileSync(path, "utf8");
  const findings = lintText(code, task.file, contract);
  const errors = findings.filter((f) => f.severity === "error");
  const skipped = findings.filter((f) => SKIPPED.has(f.rule));
  const checks = [
    { name: `writes ${task.file}`, pass: true },
    { name: "ayywi lint: no errors", pass: errors.length === 0, detail: errors.map((f) => `${f.line}:${f.column} ${f.rule} ${f.message}`).join("; ") },
    { name: "ayywi lint: no skipped components", pass: skipped.length === 0, detail: skipped.map((f) => `${f.line}:${f.column} ${f.rule}`).join("; ") },
    ...task.expect.map((p) => ({ name: `has /${p}/`, pass: new RegExp(p).test(code) })),
    ...task.reject.map((p) => ({ name: `avoids /${p}/`, pass: !new RegExp(p).test(code) })),
  ];
  return { score: checks.filter((c) => c.pass).length / checks.length, checks };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [taskPath, dir] = process.argv.slice(2);
  if (!taskPath || !dir) {
    console.error("usage: node evals/score.mjs <task.md> <workspace-dir>");
    process.exit(2);
  }
  const result = scoreOutput(parseTask(readFileSync(taskPath, "utf8")), dir);
  for (const c of result.checks) console.log(`${c.pass ? "✓" : "✗"} ${c.name}${c.detail ? `  (${c.detail})` : ""}`);
  console.log(`score ${(result.score * 100).toFixed(0)}%`);
}
