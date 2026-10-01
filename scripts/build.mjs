// Builds dist/: layered + unlayered CSS, per-file CSS, fonts, JS (ESM, CJS, <script>), .d.ts,
// and token exports for other platforms. Prints gzip sizes.
import { build, transform } from "esbuild";
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { gzipSync } from "node:zlib";
import { buildPlatforms } from "./build-platforms.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const src = (p) => join(root, "src", p);
const LAYERS = "@layer ayywi.tokens, ayywi.base, ayywi.components;";

rmSync(dist, { recursive: true, force: true });
for (const dir of ["css", "fonts", "tokens"]) mkdirSync(join(dist, dir), { recursive: true });

// ---- CSS: layered (default) ----
const indexCss = src("css/index.css");
await build({ entryPoints: [indexCss], bundle: true, outfile: join(dist, "ayywi.css"), logLevel: "warning" });
await build({ entryPoints: [indexCss], bundle: true, minify: true, outfile: join(dist, "ayywi.min.css"), logLevel: "warning" });

// ---- CSS: unlayered escape hatch (same files, plain imports) ----
const imports = [...readFileSync(indexCss, "utf8").matchAll(/@import\s+"([^"]+)"/g)].map((m) => m[1]);
const unlayered = imports.map((p) => `@import "${p}";`).join("\n");
for (const [file, minify] of [["ayywi.unlayered.css", false], ["ayywi.unlayered.min.css", true]]) {
  await build({
    stdin: { contents: unlayered, resolveDir: src("css"), loader: "css" },
    bundle: true,
    minify,
    outfile: join(dist, file),
    logLevel: "warning",
  });
}

// ---- CSS: one file per part, each wrapped in its layer ----
const wrap = (layer, css) => `${LAYERS}\n@layer ${layer} {\n${css}}\n`;
writeFileSync(join(dist, "tokens.css"), wrap("ayywi.tokens", readFileSync(src("css/tokens.css"), "utf8")));
writeFileSync(join(dist, "css/tokens.css"), wrap("ayywi.tokens", readFileSync(src("css/tokens.css"), "utf8")));
writeFileSync(join(dist, "css/base.css"), wrap("ayywi.base", readFileSync(src("css/base.css"), "utf8")));
for (const name of readdirSync(src("components"))) {
  writeFileSync(join(dist, `css/${name}.css`), wrap("ayywi.components", readFileSync(src(`components/${name}/${name}.css`), "utf8")));
}

// ---- Fonts: self-hosted (default) + Google Fonts alternative ----
const families = { sora: "Sora", unbounded: "Unbounded", caveat: "Caveat" };
const faces = [];
for (const [pkg, family] of Object.entries(families)) {
  const dir = join(root, `node_modules/@fontsource-variable/${pkg}`);
  for (const file of readdirSync(join(dir, "files"))) {
    if (file.endsWith(".woff2")) copyFileSync(join(dir, "files", file), join(dist, "fonts", file));
  }
  copyFileSync(join(dir, "LICENSE"), join(dist, "fonts", `LICENSE-${family}.txt`));
  const css = readFileSync(join(dir, "index.css"), "utf8")
    .replace(/font-family: '[^']+';/g, `font-family: '${family}';`)
    .replace(/url\(\.\/files\//g, "url(./fonts/");
  faces.push(`/* ${family} — SIL Open Font License, see fonts/LICENSE-${family}.txt */\n${css.trim()}`);
}
writeFileSync(
  join(dist, "fonts.css"),
  `/* ayywi brand fonts, self-hosted (works offline, no third-party requests). Import before ayywi.css. */\n${faces.join("\n\n")}\n`,
);
copyFileSync(src("css/fonts.css"), join(dist, "fonts-google.css"));
// The shadcn/ui bridge: plain CSS on purpose (unlayered), so it outranks a project's own shadcn variables.
copyFileSync(src("css/shadcn.css"), join(dist, "shadcn.css"));

// ---- JS ----
const shared = {
  bundle: true,
  platform: "browser",
  target: "es2022",
  jsx: "automatic",
  external: ["react", "react-dom", "react/jsx-runtime"],
  logLevel: "warning",
};
const libEntries = { index: src("index.ts"), elements: src("elements/index.ts") };
const reactEntry = { react: src("react/index.ts") };
const useClient = { js: '"use client";' };

// One ESM graph with shared chunks, so stateful modules (toast) exist once whether imported from "ayywi" or "ayywi/react".
await build({
  ...shared,
  entryPoints: { ...libEntries, ...reactEntry },
  format: "esm",
  splitting: true,
  outdir: dist,
  chunkNames: "chunks/[name]-[hash]",
});
// "use client" only on the React entry: RSC bundlers treat it as the client boundary; "ayywi" stays server-safe.
writeFileSync(join(dist, "react.js"), `${useClient.js}\n${readFileSync(join(dist, "react.js"), "utf8")}`);
await build({ ...shared, entryPoints: libEntries, format: "cjs", outdir: dist, outExtension: { ".js": ".cjs" } });
await build({ ...shared, entryPoints: reactEntry, format: "cjs", outdir: dist, outExtension: { ".js": ".cjs" }, banner: useClient });
await build({
  ...shared,
  entryPoints: [src("elements/global.ts")],
  format: "iife",
  globalName: "ayywi",
  minify: true,
  outfile: join(dist, "elements.global.js"),
});

// A saved theme and density before the first paint, for pages that can't inline themeInitScript: load it in <head>.
{
  const { themeInitScript } = await import(pathToFileURL(join(dist, "index.js")).href);
  writeFileSync(join(dist, "theme-init.js"), `${themeInitScript}\n`);
}

// ---- Types ----
execFileSync(join(root, "node_modules/.bin/tsc"), ["-p", "tsconfig.json", "--emitDeclarationOnly"], { cwd: root, stdio: "inherit" });

// ---- Tokens for other platforms ----
buildPlatforms(root, join(dist, "tokens"));

// ---- Report ----
const kb = (n) => `${(n / 1024).toFixed(1)} kB`;
const gz = async (p) => {
  const buf = readFileSync(p);
  const min = p.endsWith(".js") && !p.endsWith(".global.js") ? Buffer.from((await transform(buf.toString(), { minify: true })).code) : buf;
  return [kb(buf.length), kb(gzipSync(min).length)];
};
const rows = [];
for (const f of ["ayywi.min.css", "ayywi.unlayered.min.css", "index.js", "react.js", "elements.js", "elements.global.js"]) {
  rows.push([f, ...(await gz(join(dist, f)))]);
}
for (const f of readdirSync(join(dist, "chunks"))) rows.push([`chunks/${f}`, ...(await gz(join(dist, "chunks", f)))]);
const fontBytes = readdirSync(join(dist, "fonts")).filter((f) => f.endsWith(".woff2")).reduce((n, f) => n + statSync(join(dist, "fonts", f)).size, 0);
console.log("\nfile                               raw     gzip (minified)");
for (const [f, raw, g] of rows) console.log(`${f.padEnd(34)} ${raw.padStart(8)} ${g.padStart(10)}`);
console.log(`fonts/*.woff2 (opt-in)             ${kb(fontBytes).padStart(8)}`);
console.log(`\ndist: ${relative(root, dist)}/ ready`);
