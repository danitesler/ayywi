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
