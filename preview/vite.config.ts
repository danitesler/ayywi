import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const here = (p: string) => fileURLToPath(new URL(p, import.meta.url));
const pkg = JSON.parse(readFileSync(here("../package.json"), "utf8")) as { version: string };

/**
 * The files an agent needs to use ayywi without installing it, served by the preview at the same paths as in the package
 * (dist/ayywi.min.css, llms-full.txt…). Get started builds its copy-paste prompts from their URLs. `pnpm build` makes dist/.
 */
const HOSTED: Record<string, string> = {
  "dist/ayywi.min.css": "../dist/ayywi.min.css",
  "dist/ayywi.css": "../dist/ayywi.css",
  "dist/elements.global.js": "../dist/elements.global.js",
  "dist/fonts.css": "../dist/fonts.css",
  "dist/theme-init.js": "../dist/theme-init.js",
  "dist/shadcn.css": "../dist/shadcn.css",
  "llms.txt": "../llms.txt",
  "llms-full.txt": "../llms-full.txt",
  "manifest/components.json": "../manifest/components.json",
  "tokens/tokens.json": "../tokens/tokens.json",
  "tailwind/theme.css": "../tailwind/theme.css",
  "tailwind/preset.cjs": "../tailwind/preset.cjs",
  "ai/AGENTS.snippet.md": "../ai/AGENTS.snippet.md",
  "ai/skills/ayywi/SKILL.md": "../ai/skills/ayywi/SKILL.md",
  "ai/skills/ayywi/reference.md": "../ai/skills/ayywi/reference.md",
  "ai/cursor/ayywi.mdc": "../ai/cursor/ayywi.mdc",
};
/** Folders hosted whole: the fonts that fonts.css loads, one markdown page per component. */
const HOSTED_DIRS: Record<string, string> = { "dist/fonts": "../dist/fonts", llms: "../llms" };

/** What an app downloads at run time. Each build also publishes these under v/<release>/, a path whose files never change. */
const isRuntime = (path: string) => /^dist\/(ayywi(\.min)?\.css|elements\.global\.js|fonts\.css|theme-init\.js|shadcn\.css|fonts\/.+)$/.test(path);

function hosted(): Record<string, string> {
  const files = { ...HOSTED };
  for (const [dir, source] of Object.entries(HOSTED_DIRS)) {
    if (existsSync(here(source))) for (const file of readdirSync(here(source))) files[`${dir}/${file}`] = `${source}/${file}`;
  }
  return files;
}

/** <version>-<hash of the runtime files>: a new one exactly when what an app downloads changes. */
function releaseId(files: Record<string, string>): string {
  const hash = createHash("sha256");
  for (const path of Object.keys(files).filter(isRuntime).sort()) {
    hash.update(path);
    if (existsSync(here(files[path]))) hash.update(readFileSync(here(files[path])));
  }
  return `${pkg.version}-${hash.digest("hex").slice(0, 8)}`;
}

const TYPES: Record<string, string> = {
  css: "text/css",
  js: "text/javascript",
  cjs: "text/javascript",
  json: "application/json",
  md: "text/markdown",
  mdc: "text/markdown",
  txt: "text/plain",
  woff2: "font/woff2",
};

function hostedFiles(release: string): Plugin {
  return {
    name: "ayywi-hosted-files",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // v/<any release>/dist/… is the current dist/… while developing.
        const path = decodeURIComponent((req.url ?? "").split("?")[0])
          .replace(/^\/+/, "")
          .replace(/^v\/[^/]+\/(?=dist\/)/, "");
        const source = hosted()[path];
        if (!source || !existsSync(here(source))) return next();
        res.setHeader("Content-Type", `${TYPES[path.split(".").pop() ?? "txt"] ?? "text/plain"}; charset=utf-8`);
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.end(readFileSync(here(source)));
      });
    },
    generateBundle() {
      const files = hosted();
      const runtime: string[] = [];
      for (const [fileName, source] of Object.entries(files)) {
        if (!existsSync(here(source))) {
          this.warn(`${source} is missing; run pnpm build so the preview can host it`);
          continue;
        }
        const content = readFileSync(here(source));
        this.emitFile({ type: "asset", fileName, source: content });
        if (isRuntime(fileName)) {
          this.emitFile({ type: "asset", fileName: `v/${release}/${fileName}`, source: content });
          runtime.push(fileName);
        }
      }
      // scripts/keep-versions.mjs adds the releases already on the live site before a deploy, so old links keep working.
      const versions = { latest: release, versions: [{ id: release, version: pkg.version, built: new Date().toISOString().slice(0, 10), files: runtime.sort() }] };
      this.emitFile({ type: "asset", fileName: "versions.json", source: `${JSON.stringify(versions, null, 2)}\n` });
    },
  };
}

const release = releaseId(hosted());

export default defineConfig({
  root: here("."),
  base: "./",
  plugins: [react(), hostedFiles(release)],
  define: { __AYYWI_RELEASE__: JSON.stringify(release) },
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
