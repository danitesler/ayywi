import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const dist = (p) => fileURLToPath(new URL(`../../dist/${p}`, import.meta.url));

/** Minified size of an app that only runs `code`, bundled the way an app's bundler would from dist/. */
async function appSize(code) {
  const { outputFiles } = await build({
    stdin: { contents: code, resolveDir: dist(".") },
    bundle: true,
    minify: true,
    format: "esm",
    platform: "browser",
    external: ["react", "react-dom", "react/jsx-runtime", "@hugeicons/*"],
    write: false,
    logLevel: "silent",
  });
  return outputFiles[0].contents.length;
}

// Every component is a top-level forwardRef() call. A bundler keeps a call it can't prove pure, so a missing
// /* @__PURE__ */ ships the whole React entry (~520 kB) with a single <Button>.
test("an app using one React component doesn't ship the others", { skip: !existsSync(dist("react.js")) && "run pnpm build first" }, async () => {
  const one = await appSize(`import { Button } from "./react.js"; console.log(Button);`);
  assert.ok(one < 40_000, `Button alone bundles to ${one} bytes`);
});

test("an app using one helper doesn't ship the components", { skip: !existsSync(dist("index.js")) && "run pnpm build first" }, async () => {
  const one = await appSize(`import { buttonClass } from "./index.js"; console.log(buttonClass({}));`);
  assert.ok(one < 10_000, `buttonClass alone bundles to ${one} bytes`);
});
