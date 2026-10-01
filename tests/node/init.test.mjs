import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { init } from "../../cli/init.mjs";

test("init sets up a project once and is idempotent", (t) => {
  const cwd = mkdtempSync(join(tmpdir(), "ayywi-init-"));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  writeFileSync(join(cwd, "AGENTS.md"), "# My app\n");
  writeFileSync(join(cwd, ".mcp.json"), JSON.stringify({ mcpServers: { other: { command: "x" } } }));

  const log = [];
  init({ cwd, log: (l) => log.push(l), dryRun: true });
  assert.ok(!existsSync(join(cwd, ".claude")), "dry run writes nothing");

  init({ cwd, log: () => {} });
  init({ cwd, log: () => {} });
  assert.ok(existsSync(join(cwd, ".claude/skills/ayywi/SKILL.md")));
  assert.ok(existsSync(join(cwd, ".cursor/rules/ayywi.mdc")));
  const agents = readFileSync(join(cwd, "AGENTS.md"), "utf8");
  assert.ok(agents.startsWith("# My app"));
  assert.equal(agents.split("<!-- ayywi:agents -->").length, 2, "snippet appended exactly once");
  const mcp = JSON.parse(readFileSync(join(cwd, ".mcp.json"), "utf8"));
  assert.ok(mcp.mcpServers.other, "existing servers kept");
  assert.ok(mcp.mcpServers.ayywi);
  assert.ok(existsSync(join(cwd, ".cursor/mcp.json")));
});

test("init --force replaces only the ayywi section of AGENTS.md", (t) => {
  const cwd = mkdtempSync(join(tmpdir(), "ayywi-init-"));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  // A section written by an older init: no end marker, and the project's own notes after it.
  writeFileSync(join(cwd, "AGENTS.md"), "# My app\n\n<!-- ayywi:agents -->\n## UI: ayywi design system\n\nOld rules.\n\n## Deploys\n\nUse the staging branch.\n");
  init({ cwd, mcp: false, log: () => {} });
  assert.match(readFileSync(join(cwd, "AGENTS.md"), "utf8"), /Old rules\./, "without --force the section is kept");

  init({ cwd, mcp: false, force: true, log: () => {} });
  const agents = readFileSync(join(cwd, "AGENTS.md"), "utf8");
  assert.doesNotMatch(agents, /Old rules\./);
  assert.ok(agents.startsWith("# My app"));
  assert.match(agents, /## Deploys\n\nUse the staging branch\.\n$/, "content after the section is untouched");
  assert.equal(agents.split("<!-- ayywi:agents -->").length, 2);
  assert.equal(agents.split("<!-- /ayywi:agents -->").length, 2, "an end marker makes the next update exact");

  init({ cwd, mcp: false, force: true, log: () => {} });
  assert.equal(readFileSync(join(cwd, "AGENTS.md"), "utf8"), agents, "updating twice changes nothing");
});
