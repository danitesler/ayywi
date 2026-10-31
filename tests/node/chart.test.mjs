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

  assert.match(markup, /<table class="ayy-table ayy-table--sm">/);
  assert.match(markup, /<td class="ayy-table__num">\$50,000<\/td>/);
});

test("scales and paths take series longer than the engine's argument limit", { skip }, async () => {
  const { chartScale, chartPath, Sparkline } = await import(dist("react.js"));
  const values = Array.from({ length: 300_000 }, (_, i) => i % 1000);
  values[123_456] = 1840;
  assert.equal(chartScale(values).max, 2000);
  const { line } = chartPath(values);
  assert.match(line, /^M0,100 /);
  assert.match(renderToStaticMarkup(createElement(Sparkline, { values, label: "Requests" })), /<path/);
});

test("chartBins counts values into round bins; the last bin takes the largest value", { skip }, async () => {
  const { chartBins } = await import(dist("index.js"));
  assert.deepEqual(chartBins([12, 48, 51, 97], { bins: 5 }), { edges: [0, 20, 40, 60, 80, 100], counts: [1, 0, 2, 0, 1] });
  assert.deepEqual(chartBins([0, 10, 20], { bins: 2 }), { edges: [0, 10, 20], counts: [1, 2] });
  assert.deepEqual(chartBins([]), { edges: [], counts: [] });
});

test("chartStack keeps running tops, and percent makes every point's total 100", { skip }, async () => {
  const { chartStack } = await import(dist("index.js"));
  assert.deepEqual(chartStack([[1, 2], [3, 4]]), [[1, 2], [4, 6]]);
  assert.deepEqual(chartStack([[1, 3], [3, 1]], { percent: true }), [[25, 75], [100, 100]]);
});

test("chartSlices and chartWaterfall place ring slices and floating bars", { skip }, async () => {
  const { chartSlices, chartWaterfall } = await import(dist("index.js"));
  assert.deepEqual(chartSlices([1, 1, 2]), [{ start: 0, value: 25 }, { start: 25, value: 25 }, { start: 50, value: 50 }]);
  assert.deepEqual(chartWaterfall([{ value: 10, total: true }, { value: 5 }, { value: -3 }, { value: 12, total: true }]), [
    { from: 0, to: 10 },
    { from: 10, to: 15, change: "up" },
    { from: 15, to: 12, change: "down" },
    { from: 0, to: 12 },
  ]);
});

test("chartPath draws steps, points over column centres and areas on a base", { skip }, async () => {
  const { chartPath, chartRadar } = await import(dist("index.js"));
  assert.equal(chartPath([0, 100], { step: true }).line, "M0,100 L50,100 L50,0 L100,0");
  assert.equal(chartPath([0, 100], { band: true }).line, "M25,100 L75,0");
  assert.equal(chartPath([50, 100], { max: 100, base: [0, 50] }).area, "M0,50 L100,0 L100,50 L0,100 Z");
  assert.equal(chartRadar([1, 1, 1, 1], { max: 1 }), "M50,10 L90,50 L50,90 L10,50 Z");
});
