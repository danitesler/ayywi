#!/usr/bin/env node
// `npx ayywi …` → the CLI in @danitesler/ayywi, with the same arguments and stdio (so `ayywi mcp` still speaks MCP).
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";

const pkg = createRequire(import.meta.url).resolve("@danitesler/ayywi/package.json");
await import(pathToFileURL(join(dirname(pkg), "cli/index.mjs")).href);
