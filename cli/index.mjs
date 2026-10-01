#!/usr/bin/env node
// ayywi command line: lint | init | mcp
import { readFileSync } from "node:fs";
import { formatFindings, lintPaths } from "./lint.mjs";

const [command, ...raw] = process.argv.slice(2);
// "--max-warnings 0" and "--max-warnings=0" both work.
const rest = raw.flatMap((a, i) => (a === "--max-warnings" && raw[i + 1] !== undefined ? [] : raw[i - 1] === "--max-warnings" ? [`--max-warnings=${a}`] : [a]));
const flags = new Set(rest.filter((a) => a.startsWith("--")));
const args = rest.filter((a) => !a.startsWith("--"));
const version = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")).version;

const HELP = `ayywi ${version}

  ayywi lint [paths…] [--json] [--max-warnings N]
      Check UI code (HTML, JSX/TSX, Vue, Svelte, Angular, CSS…) against the ayywi contract. Rules:
        unknown-class, unknown-token, unknown-variant, unknown-element, unknown-attribute-value (data-theme,
        data-density, element attributes), reserved-prefix (your own .ayy-* classes), icon-button-label,
        hardcoded-color (hex, rgb()…, named colours, also in style="" and style={{}}), dir-selector,
        physical-property (left/right CSS), img-size (<img> without width/height), icon-library (a second icon set).
      Default path: current directory. Exits 1 on errors, or on more than N warnings.
      Configure rules in ayywi.config.json: { "rules": { "physical-property": "off" }, "ignore": ["legacy/**"] }.
      Silence a line with a comment containing ayywi-lint-disable-line (or -next-line); a whole file with
      ayywi-lint-disable-file in its first five lines.

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
