// Builds dist/: layered + unlayered CSS, per-file CSS, brands, fonts, JS (ESM, CJS, <script>), .d.ts,
// and token exports for other platforms. Prints gzip sizes.
import { build, transform } from "esbuild";
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { gzipSync } from "node:zlib";
import { buildPlatforms } from "./build-platforms.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const src = (p) => join(root, "src", p);
const LAYERS = "@layer ayywi.tokens, ayywi.base, ayywi.components, ayywi.utilities, ayywi.brand;";

rmSync(dist, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
for (const dir of ["css", "brands", "fonts", "tokens"]) mkdirSync(join(dist, dir), { recursive: true });

// ---- CSS: layered (default) ----
const indexCss = src("css/index.css");
await build({ entryPoints: [indexCss], bundle: true, outfile: join(dist, "ayywi.css"), logLevel: "warning" });
await build({ entryPoints: [indexCss], bundle: true, minify: true, outfile: join(dist, "ayywi.min.css"), logLevel: "warning" });

// ---- CSS: unlayered escape hatch (same files, plain imports) ----
const imports = [...readFileSync(indexCss, "utf8").matchAll(/@import\s+"([^"]+)"/g)].map((m) => m[1]);
const unlayered = imports.map((p) => `@import "${p}";`).join("\n");
function stripLayers(css) {
  let out = css.replace(/@layer\s+[^;{]+;/g, "");
  while (true) {
    const m = out.match(/@layer\s+[\w.-]+\s*\{/);
    if (!m) break;
    const startIdx = m.index;
    const openBrace = startIdx + m[0].length - 1;
    let depth = 1;
    let closeBrace = -1;
    for (let i = openBrace + 1; i < out.length; i++) {
      if (out[i] === "{") depth++;
      else if (out[i] === "}") {
        depth--;
        if (depth === 0) {
          closeBrace = i;
          break;
        }
      }
    }
    if (closeBrace !== -1) {
      out = out.slice(0, startIdx) + out.slice(openBrace + 1, closeBrace) + out.slice(closeBrace + 1);
    } else {
      break;
    }
  }
  return out;
}

for (const [file, minify] of [["ayywi.unlayered.css", false], ["ayywi.unlayered.min.css", true]]) {
  await build({
    stdin: { contents: unlayered, resolveDir: src("css"), loader: "css" },
    bundle: true,
    minify,
    outfile: join(dist, file),
    logLevel: "warning",
  });
  const unlayeredPath = join(dist, file);
  writeFileSync(unlayeredPath, stripLayers(readFileSync(unlayeredPath, "utf8")));
}

// ---- CSS: one file per part, each wrapped in its layer ----
const wrap = (layer, css) => `${LAYERS}\n@layer ${layer} {\n${css}}\n`;
writeFileSync(join(dist, "tokens.css"), wrap("ayywi.tokens", readFileSync(src("css/tokens.css"), "utf8")));
writeFileSync(join(dist, "css/tokens.css"), wrap("ayywi.tokens", readFileSync(src("css/tokens.css"), "utf8")));
writeFileSync(join(dist, "css/base.css"), wrap("ayywi.base", readFileSync(src("css/base.css"), "utf8")));
for (const name of readdirSync(src("components"))) {
  const cssPath = src(`components/${name}/${name}.css`);
  if (!existsSync(cssPath)) continue;
  writeFileSync(join(dist, `css/${name}.css`), wrap("ayywi.components", readFileSync(cssPath, "utf8")));
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

// One ESM graph with shared chunks, so stateful modules (toast) exist once whether imported from "@danitesler/ayywi" or "@danitesler/ayywi/react".
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
// CJS from that same graph: every ESM file (entries and chunks) converted one to one, requiring its siblings as .cjs, so
// require("@danitesler/ayywi").toast is require("@danitesler/ayywi/react").toast too. esbuild can't split CJS itself.
const esmOut = ["index.js", "react.js", "elements.js", ...readdirSync(join(dist, "chunks")).map((f) => `chunks/${f}`)];
await build({
  ...shared,
  entryPoints: esmOut.map((f) => join(dist, f)),
  outbase: dist,
  outdir: dist,
  format: "cjs",
  outExtension: { ".js": ".cjs" },
  plugins: [{
    name: "cjs-siblings",
    setup: (b) => b.onResolve({ filter: /^\.\.?\// }, (args) => ({ path: args.path.replace(/\.js$/, ".cjs"), external: true })),
  }],
});
// esbuild keeps the directive but after its own "use strict"; put it first, where the ESM build has it.
writeFileSync(join(dist, "react.cjs"), `${useClient.js}\n${readFileSync(join(dist, "react.cjs"), "utf8").replace(`${useClient.js}\n`, "")}`);
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

// ---- Brands: tokens/brands/<name>.json → brands/<name>.css, generated (and contrast-checked) by createBrand() ----
{
  const { brandCss, brandPresets, brandTokens, themes } = await import(pathToFileURL(join(dist, "index.js")).href);
  for (const [name, input] of Object.entries(brandPresets)) {
    writeFileSync(join(dist, `brands/${name}.css`), brandCss(input));
    // The same brand for other platforms: per-theme DTCG overrides next to the theme exports (tokens/<theme>.json).
    mkdirSync(join(dist, `tokens/brands/${name}`), { recursive: true });
    for (const theme of themes) writeFileSync(join(dist, `tokens/brands/${name}/${theme}.json`), `${JSON.stringify(brandTokens(input, theme), null, 2)}\n`);
  }
}

// ---- Types ----
execFileSync(process.execPath, [join(root, "node_modules/typescript/bin/tsc"), "-p", "tsconfig.json", "--emitDeclarationOnly"], { cwd: root, stdio: "inherit" });

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
for (const f of readdirSync(join(dist, "chunks")).filter((f) => f.endsWith(".js"))) rows.push([`chunks/${f}`, ...(await gz(join(dist, "chunks", f)))]);
const fontBytes = readdirSync(join(dist, "fonts")).filter((f) => f.endsWith(".woff2")).reduce((n, f) => n + statSync(join(dist, "fonts", f)).size, 0);
console.log("\nfile                               raw     gzip (minified)");
for (const [f, raw, g] of rows) console.log(`${f.padEnd(34)} ${raw.padStart(8)} ${g.padStart(10)}`);
console.log(`fonts/*.woff2 (opt-in)             ${kb(fontBytes).padStart(8)}`);
console.log(`\ndist: ${relative(root, dist)}/ ready`);
