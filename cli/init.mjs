// ayywi init — set up a consuming project for AI agents: Claude skill, reviewer agent and lint hook, Cursor rule,
// AGENTS.md snippet, MCP config.
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const pkgRoot = fileURLToPath(new URL("..", import.meta.url));
const MARKER = "<!-- ayywi:agents -->";
const END_MARKER = "<!-- /ayywi:agents -->";

/** Where the ayywi section sits in AGENTS.md: from the marker to the end marker, or (sections written before it existed)
    to the next "## " heading after its own, or the end of the file. */
function sectionRange(text) {
  const start = text.indexOf(MARKER);
  if (start < 0) return null;
  const end = text.indexOf(END_MARKER, start);
  if (end >= 0) return [start, end + END_MARKER.length];
  const own = text.indexOf("\n## ", start);
  const next = own < 0 ? -1 : text.indexOf("\n## ", own + 1);
  return [start, next < 0 ? text.length : next + 1];
}
const MCP_SERVER = { command: "npx", args: ["ayywi", "mcp"] };
// After every file Claude Code writes, lint it; findings go back to the agent (exit 2) so it fixes them before moving on.
const HOOK_COMMAND = "npx --no ayywi lint --hook";
const HOOK = { matcher: "Write|Edit|MultiEdit", hooks: [{ type: "command", command: HOOK_COMMAND }] };

function mergeHook(cwd, log, dryRun) {
  const name = ".claude/settings.json";
  const file = join(cwd, name);
  let json = {};
  if (existsSync(file)) {
    try {
      json = JSON.parse(readFileSync(file, "utf8"));
    } catch {
      log(`skip  ${name} (not valid JSON — add the ayywi lint hook by hand: ${HOOK_COMMAND})`);
      return;
    }
  }
  json.hooks ??= {};
  json.hooks.PostToolUse ??= [];
  if (json.hooks.PostToolUse.some((entry) => entry.hooks?.some((h) => String(h.command ?? "").includes("ayywi lint --hook"))))
    return log(`keep  ${name} (ayywi lint hook already configured)`);
  json.hooks.PostToolUse.push(HOOK);
  if (!dryRun) {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`);
  }
  log(`write ${name} (lint hook)`);
}

function mergeMcp(cwd, name, key, log, dryRun) {
  const file = join(cwd, name);
  let json = {};
  if (existsSync(file)) {
    try {
      json = JSON.parse(readFileSync(file, "utf8"));
    } catch {
      log(`skip  ${name} (not valid JSON — add the ayywi server by hand)`);
      return;
    }
  }
  json[key] ??= {};
  if (json[key].ayywi) return log(`keep  ${name} (ayywi server already configured)`);
  json[key].ayywi = MCP_SERVER;
  if (!dryRun) {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`);
  }
  log(`write ${name}`);
}

/**
 * @param {{ cwd?: string, mcp?: boolean, hook?: boolean, force?: boolean, dryRun?: boolean, log?: (s: string) => void }} options
 */
export function init({ cwd = process.cwd(), mcp = true, hook = true, force = false, dryRun = false, log = console.log } = {}) {
  const copy = (from, to) => {
    const target = join(cwd, to);
    if (existsSync(target) && !force) return log(`keep  ${to} (exists; --force to overwrite)`);
    if (!dryRun) {
      mkdirSync(dirname(target), { recursive: true });
      cpSync(join(pkgRoot, from), target, { recursive: true });
    }
    log(`write ${to}`);
  };

  copy("ai/skills/ayywi", ".claude/skills/ayywi");
  copy("ai/agents/ayywi-ui-reviewer.md", ".claude/agents/ayywi-ui-reviewer.md");
  if (hook) mergeHook(cwd, log, dryRun);
  copy("ai/cursor/ayywi.mdc", ".cursor/rules/ayywi.mdc");

  const agents = join(cwd, "AGENTS.md");
  const existing = existsSync(agents) ? readFileSync(agents, "utf8") : "";
  const section = `${MARKER}\n${readFileSync(join(pkgRoot, "ai/AGENTS.snippet.md"), "utf8").trimEnd()}\n${END_MARKER}\n`;
  const range = sectionRange(existing);
  if (range && !force) {
    log("keep  AGENTS.md (ayywi section already present; --force to update it)");
  } else if (range) {
    // --force: replace only the ayywi section, so the rest of the file stays as the project wrote it.
    const after = existing.slice(range[1]).replace(/^\n+/, "");
    if (!dryRun) writeFileSync(agents, `${existing.slice(0, range[0])}${section}${after ? `\n${after}` : ""}`);
    log("update AGENTS.md (ayywi section)");
  } else {
    if (!dryRun) writeFileSync(agents, `${existing}${existing && !existing.endsWith("\n\n") ? (existing.endsWith("\n") ? "\n" : "\n\n") : ""}${section}`);
    log(`${existing ? "append" : "write"} AGENTS.md`);
  }

  if (mcp) {
    mergeMcp(cwd, ".mcp.json", "mcpServers", log, dryRun);
    mergeMcp(cwd, ".cursor/mcp.json", "mcpServers", log, dryRun);
  }
  log(dryRun ? "\n(dry run — nothing written)" : "\nDone. Agents will now read the ayywi rules, query components over MCP, and get lint findings back after every UI file they write.");
}
