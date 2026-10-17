import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const dist = (p) => fileURLToPath(new URL(`../../dist/${p}`, import.meta.url));
const skip = !existsSync(dist("react.js")) && "run pnpm build first";

test("TableChart renders ayywi Table with series swatches, caption and numeric cells", { skip }, async () => {
  const { TableChart } = await import(dist("react.js"));

  const markup = renderToStaticMarkup(
    createElement(TableChart, {
      label: "Signups by device, April to June",
      labels: ["Apr", "May", "Jun"],
      series: [
        { name: "Desktop", values: [1840, 2120, 1960] },
        { name: "Mobile", values: [920, 1180, 1340] },
      ],
    }),
  );

  assert.match(markup, /<div class="ayy-table-wrap">/);
  assert.match(markup, /<table class="ayy-table">/);
  assert.match(markup, /<caption>Signups by device, April to June<\/caption>/);
  assert.match(markup, /<th scope="col" class="ayy-table__num"><span class="ayy-chart__legend-item" style="--ayy-chart-color:var\(--ayy-chart-1\)"><span class="ayy-chart__swatch"><\/span>Desktop<\/span><\/th>/);
  assert.match(markup, /<th scope="col" class="ayy-table__num"><span class="ayy-chart__legend-item" style="--ayy-chart-color:var\(--ayy-chart-2\)"><span class="ayy-chart__swatch"><\/span>Mobile<\/span><\/th>/);
  assert.match(markup, /<th scope="row">Apr<\/th>/);
  assert.match(markup, /<td class="ayy-table__num">1\.8K<\/td>/);
  assert.match(markup, /<td class="ayy-table__num">920<\/td>/);
});

test("TableChart supports compact variant and custom format", { skip }, async () => {
  const { TableChart } = await import(dist("react.js"));

  const markup = renderToStaticMarkup(
    createElement(TableChart, {
      label: "Compact test",
      labels: ["Q1"],
      series: [{ name: "Revenue", values: [50000] }],
      compact: true,
      format: (val) => `$${val.toLocaleString()}`,
    }),
  );

  assert.match(markup, /<table class="ayy-table ayy-table--compact">/);
  assert.match(markup, /<td class="ayy-table__num">\$50,000<\/td>/);
});
