#!/usr/bin/env node
// Skill eval: runs a coding agent on each task twice — with the ayywi AI kit installed and without — and scores both.
//
//   AYYWI_EVAL_AGENT='claude -p --permission-mode acceptEdits' node evals/run.mjs [task-id…] [--runs=N]
//   AYYWI_EVAL_OUT=/tmp/ayywi-evals …   (recommended: workspaces inside the repo inherit its agent instructions)
//   node evals/report.mjs <runs-dir>/*/results.json > evals/RESULTS.md
//
// The agent command runs inside a fresh workspace with the task prompt on stdin. Anything that writes files
// works: Claude Code (`claude -p`), Codex (`codex exec -`), a script calling an API. Results land in evals/runs/.
import { spawnSync } from "node:child_process";
import { chmodSync, cpSync, existsSync, mkdirSync, readdirSync, readFileSync, symlinkSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import { init } from "../cli/init.mjs";
import { parseTask, scoreOutput } from "./score.mjs";

const here = fileURLToPath(new URL(".", import.meta.url));
const root = join(here, "..");
const agent = process.env.AYYWI_EVAL_AGENT;
if (!agent) {
  console.error("Set AYYWI_EVAL_AGENT to the agent command, e.g. AYYWI_EVAL_AGENT='claude -p --permission-mode acceptEdits'");
  process.exit(2);
}

const args = process.argv.slice(2);
const runs = Number(args.find((a) => a.startsWith("--runs="))?.split("=")[1] ?? 1);
const only = args.filter((a) => !a.startsWith("--"));
const tasks = readdirSync(join(here, "tasks"))
  .filter((f) => f.endsWith(".md") && (only.length === 0 || only.includes(basename(f, ".md"))))
  .map((f) => ({ id: basename(f, ".md"), ...parseTask(readFileSync(join(here, "tasks", f), "utf8")) }));

const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
if (!existsSync(join(root, "dist"))) {
  console.error("Run pnpm build first.");
  process.exit(2);
}

/** Lay the package out in node_modules like `npm i @danitesler/ayywi` would, including the `ayywi` bin for npx. */
function install(dir) {
  const target = join(dir, "node_modules/@danitesler/ayywi");
  for (const f of [...pkg.files, "package.json"]) {
    if (existsSync(join(root, f))) cpSync(join(root, f), join(target, f), { recursive: true });
  }
  mkdirSync(join(dir, "node_modules/.bin"), { recursive: true });
  symlinkSync("../ayywi/cli/index.mjs", join(dir, "node_modules/.bin/ayywi"));
  chmodSync(join(target, "cli/index.mjs"), 0o755);
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
// AYYWI_EVAL_OUT puts the workspaces outside this repo, so agents don't pick up its CLAUDE.md / AGENTS.md.
const out = join(process.env.AYYWI_EVAL_OUT ?? join(here, "runs"), stamp);
const results = [];

for (const task of tasks) {
  for (const condition of ["with-kit", "without"]) {
    for (let run = 1; run <= runs; run++) {
      const dir = join(out, task.id, `${condition}-${run}`);
      mkdirSync(dir, { recursive: true });
      // Both conditions get the installed package (docs, llms.txt, CLI) — only the agent kit differs.
      install(dir);
      if (condition === "with-kit") init({ cwd: dir, log: () => {} });

      const started = Date.now();
      const proc = spawnSync(agent, { cwd: dir, input: task.prompt, shell: true, encoding: "utf8", timeout: 10 * 60_000 });
      writeFileSync(join(dir, ".agent.log"), `${proc.stdout ?? ""}\n--- stderr ---\n${proc.stderr ?? ""}`);
      const { score, checks } = scoreOutput(task, dir);
      // An agent that exits non-zero (not signed in, timed out) didn't attempt the task: report it, don't score it.
      const error = proc.status === 0 ? undefined : (proc.error?.message ?? `${proc.stdout ?? ""}${proc.stderr ?? ""}`.trim().slice(0, 200)) || `exit ${proc.status}`;
      results.push({ task: task.id, condition, run, score, seconds: Math.round((Date.now() - started) / 1000), failed: checks.filter((c) => !c.pass).map((c) => c.name), ...(error && { error }) });
      console.log(`${task.id.padEnd(18)} ${condition.padEnd(9)} #${run}  ${error ? `agent failed: ${error}` : `${(score * 100).toFixed(0).padStart(3)}%`}`);
    }
  }
}

writeFileSync(join(out, "results.json"), JSON.stringify(results, null, 2));
const mean = (c) => {
  const r = results.filter((x) => x.condition === c && !x.error);
  return r.reduce((s, x) => s + x.score, 0) / (r.length || 1);
};
console.log(`\nmean score  with kit ${(mean("with-kit") * 100).toFixed(0)}%  ·  without ${(mean("without") * 100).toFixed(0)}%`);
console.log(`details: ${out}`);
