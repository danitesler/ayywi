import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const here = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  root: here("."),
  base: "./",
  plugins: [react()],
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
