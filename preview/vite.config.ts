import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const here = (p: string) => fileURLToPath(new URL(p, import.meta.url));

/**
 * The files an agent needs to use ayywi without installing it, served by the preview at the same paths as in the package
 * (dist/ayywi.min.css, llms-full.txt…). Get started builds its copy-paste prompts from their URLs. `pnpm build` makes dist/.
 */
const HOSTED: Record<string, string> = {
  "dist/ayywi.min.css": "../dist/ayywi.min.css",
  "dist/ayywi.css": "../dist/ayywi.css",
  "dist/elements.global.js": "../dist/elements.global.js",
  "llms.txt": "../llms.txt",
  "llms-full.txt": "../llms-full.txt",
  "manifest/components.json": "../manifest/components.json",
  "tokens/tokens.json": "../tokens/tokens.json",
  "ai/AGENTS.snippet.md": "../ai/AGENTS.snippet.md",
  "ai/skills/ayywi/SKILL.md": "../ai/skills/ayywi/SKILL.md",
  "ai/skills/ayywi/reference.md": "../ai/skills/ayywi/reference.md",
  "ai/cursor/ayywi.mdc": "../ai/cursor/ayywi.mdc",
};

const TYPES: Record<string, string> = { css: "text/css", js: "text/javascript", json: "application/json", md: "text/markdown", mdc: "text/markdown", txt: "text/plain" };

function hostedFiles(): Plugin {
  return {
    name: "ayywi-hosted-files",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = decodeURIComponent((req.url ?? "").split("?")[0]).replace(/^\/+/, "");
        const source = HOSTED[path];
        if (!source || !existsSync(here(source))) return next();
        res.setHeader("Content-Type", `${TYPES[path.split(".").pop() ?? "txt"] ?? "text/plain"}; charset=utf-8`);
        res.end(readFileSync(here(source)));
      });
    },
    generateBundle() {
      for (const [fileName, source] of Object.entries(HOSTED)) {
        if (existsSync(here(source))) this.emitFile({ type: "asset", fileName, source: readFileSync(here(source)) });
        else this.warn(`${source} is missing; run pnpm build so the preview can host it`);
      }
    },
  };
}

export default defineConfig({
  root: here("."),
  base: "./",
  plugins: [react(), hostedFiles()],
  resolve: {
    alias: [
      { find: /^ayywi\/react$/, replacement: here("../src/react/index.ts") },
      { find: /^ayywi\/elements$/, replacement: here("../src/elements/index.ts") },
      { find: /^ayywi$/, replacement: here("../src/index.ts") },
    ],
  },
  server: { fs: { allow: [here("..")] } },
  build: { outDir: here("dist"), emptyOutDir: true },
});
