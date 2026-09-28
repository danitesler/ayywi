// ayywi init — set up a consuming project for AI agents: Claude skill, Cursor rule, AGENTS.md snippet, MCP config.
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const pkgRoot = fileURLToPath(new URL("..", import.meta.url));
const MARKER = "<!-- ayywi:agents -->";
const MCP_SERVER = { command: "npx", args: ["ayywi", "mcp"] };

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
 * @param {{ cwd?: string, mcp?: boolean, force?: boolean, dryRun?: boolean, log?: (s: string) => void }} options
 */
export function init({ cwd = process.cwd(), mcp = true, force = false, dryRun = false, log = console.log } = {}) {
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
  copy("ai/cursor/ayywi.mdc", ".cursor/rules/ayywi.mdc");

  const agents = join(cwd, "AGENTS.md");
  const existing = existsSync(agents) ? readFileSync(agents, "utf8") : "";
  if (existing.includes(MARKER)) {
    log("keep  AGENTS.md (ayywi section already present)");
  } else {
    const snippet = readFileSync(join(pkgRoot, "ai/AGENTS.snippet.md"), "utf8");
    if (!dryRun) writeFileSync(agents, `${existing}${existing && !existing.endsWith("\n\n") ? "\n\n" : ""}${MARKER}\n${snippet}`);
    log(`${existing ? "append" : "write"} AGENTS.md`);
  }

  if (mcp) {
    mergeMcp(cwd, ".mcp.json", "mcpServers", log, dryRun);
    mergeMcp(cwd, ".cursor/mcp.json", "mcpServers", log, dryRun);
  }
  log(dryRun ? "\n(dry run — nothing written)" : "\nDone. Agents will now read the ayywi rules and can query components over MCP.");
}
