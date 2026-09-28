#!/usr/bin/env node
// ayywi command line: lint | init | mcp
import { readFileSync } from "node:fs";
import { formatFindings, lintPaths } from "./lint.mjs";

const [command, ...rest] = process.argv.slice(2);
const flags = new Set(rest.filter((a) => a.startsWith("--")));
const args = rest.filter((a) => !a.startsWith("--"));
const version = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")).version;

const HELP = `ayywi ${version}

  ayywi lint [paths…] [--json] [--max-warnings=N]
      Check UI code against the ayywi contract: unknown classes, tokens, variants and element attributes,
      hardcoded colours, physical left/right CSS, unlabeled icon buttons. Default path: current directory.
      Configure rules in ayywi.config.json: { "rules": { "physical-property": "off" }, "ignore": ["legacy/**"] }.
      Silence a line with a comment containing ayywi-lint-disable-line (or -next-line).

  ayywi init [--no-mcp] [--force] [--dry-run]
      Set up this project for AI agents: .claude/skills/ayywi, .cursor/rules/ayywi.mdc, an ayywi section
      in AGENTS.md, and the MCP server in .mcp.json and .cursor/mcp.json.

  ayywi mcp
      Run the ayywi MCP server over stdio (for Claude Code, Cursor, and other MCP clients).
`;

switch (command) {
  case "lint": {
    const result = lintPaths(args);
    if (flags.has("--json")) process.stdout.write(`${JSON.stringify(result.findings, null, 2)}\n`);
    else console.log(formatFindings(result));
    const maxWarnings = Number(rest.find((a) => a.startsWith("--max-warnings="))?.split("=")[1] ?? Infinity);
    const errors = result.findings.filter((f) => f.severity === "error").length;
    const warnings = result.findings.length - errors;
    process.exitCode = errors > 0 || warnings > maxWarnings ? 1 : 0;
    break;
  }
  case "init": {
    const { init } = await import("./init.mjs");
    init({ mcp: !flags.has("--no-mcp"), force: flags.has("--force"), dryRun: flags.has("--dry-run") });
    break;
  }
  case "mcp": {
    const { serve } = await import("./mcp.mjs");
    serve();
    break;
  }
  case "--version":
  case "-v":
    console.log(version);
    break;
  default:
    console.log(HELP);
    if (command && command !== "help" && command !== "--help" && command !== "-h") process.exitCode = 1;
}
