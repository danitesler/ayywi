#!/usr/bin/env node
// Skill eval: runs a coding agent on each task twice — with the ayywi AI kit installed and without — and scores both.
//
//   AYYWI_EVAL_AGENT='claude -p --permission-mode acceptEdits' node evals/run.mjs [task-id…] [--runs=N]
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
const out = join(here, "runs", stamp);
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
      results.push({ task: task.id, condition, run, score, seconds: Math.round((Date.now() - started) / 1000), failed: checks.filter((c) => !c.pass).map((c) => c.name) });
      console.log(`${task.id.padEnd(18)} ${condition.padEnd(9)} #${run}  ${(score * 100).toFixed(0).padStart(3)}%`);
    }
  }
}

writeFileSync(join(out, "results.json"), JSON.stringify(results, null, 2));
const mean = (c) => {
  const r = results.filter((x) => x.condition === c);
  return r.reduce((s, x) => s + x.score, 0) / (r.length || 1);
};
console.log(`\nmean score  with kit ${(mean("with-kit") * 100).toFixed(0)}%  ·  without ${(mean("without") * 100).toFixed(0)}%`);
console.log(`details: ${out}`);
