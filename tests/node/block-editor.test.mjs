import test from "node:test";
import assert from "node:assert/strict";
import { blockEditorEditTable, blockEditorFromMarkdown, blockEditorNormalize, blockEditorToHtml, blockEditorToMarkdown, blockEditorToText } from "../../dist/index.js";

const doc = [
  { id: "a", type: "text", html: "Before" },
  { id: "t", type: "toggle", html: "FAQ", open: true },
  { id: "c1", type: "text", indent: 1, html: "Inside" },
  { id: "c2", type: "bullet", indent: 1, html: "A list inside" },
  { id: "t2", type: "toggle", indent: 1, html: "Nested" },
  { id: "c3", type: "text", indent: 2, html: "Deeper" },
  { id: "z", type: "text", html: "After" },
];

test("normalize keeps a toggle's open flag and drops it from other blocks", () => {
  const [, toggle, , , nested] = blockEditorNormalize([...doc, { id: "x", type: "text", open: true }]);
  assert.equal(toggle.open, true);
  assert.equal(nested.open, undefined);
  assert.equal(blockEditorNormalize([{ id: "x", type: "text", open: true }])[0].open, undefined);
});

test("toggles export as <details> with their nested blocks inside", () => {
  assert.equal(
    blockEditorToHtml(doc),
    ["<p>Before</p>", "<details open><summary>FAQ</summary>", "<p>Inside</p>", "<ul>", "<li>A list inside</li>", "</ul>", "<details><summary>Nested</summary>", "<p>Deeper</p>", "</details>", "</details>", "<p>After</p>"].join("\n"),
  );
});

test("toggles round-trip through Markdown", () => {
  const md = blockEditorToMarkdown(doc);
  assert.match(md, /<details open><summary>FAQ<\/summary>/);
  const back = blockEditorFromMarkdown(md).map((b) => [b.type, b.indent ?? 0, !!b.open]);
  assert.deepEqual(back, [
    ["text", 0, false],
    ["toggle", 0, true],
    ["text", 1, false],
    ["bullet", 1, false],
    ["toggle", 1, false],
    ["text", 2, false],
    ["text", 0, false],
  ]);
});

const table = { id: "t", type: "table", header: true, rows: [["Plan", "Price"], ["Starter", "$9 | month"], ["Team"]] };

test("normalize makes a table rectangular, one line per cell, and gives a blank one cells", () => {
  const [made] = blockEditorNormalize([table]);
  assert.deepEqual(made.rows, [["Plan", "Price"], ["Starter", "$9 | month"], ["Team", ""]]);
  const [multi] = blockEditorNormalize([{ type: "table", rows: [["a\nb  c"]] }]);
  assert.deepEqual(multi.rows, [["a b c"]]);
  assert.deepEqual(blockEditorNormalize([{ type: "table" }])[0].rows, [[""]]);
  assert.equal(blockEditorNormalize([{ type: "table", rows: [["x"]], header: false }])[0].header, false);
});

test("tables export as a <table> with a header, and as plain text", () => {
  assert.equal(
    blockEditorToHtml([table]),
    "<table><thead><tr><th scope=\"col\">Plan</th><th scope=\"col\">Price</th></tr></thead><tbody><tr><td>Starter</td><td>$9 | month</td></tr><tr><td>Team</td><td></td></tr></tbody></table>",
  );
  assert.equal(blockEditorToHtml([{ ...table, header: false }]).includes("<thead>"), false);
  assert.equal(blockEditorToText([table]), "Plan\tPrice\nStarter\t$9 | month\nTeam");
});

test("tables round-trip through Markdown, with and without a header", () => {
  const md = blockEditorToMarkdown([table]);
  assert.equal(md.split("\n")[1], "| --- | --- |");
  assert.match(md, /\$9 \\\| month/);
  const [back] = blockEditorFromMarkdown(md);
  assert.equal(back.type, "table");
  assert.equal(back.header, true);
  assert.deepEqual(back.rows, [["Plan", "Price"], ["Starter", "$9 | month"], ["Team", ""]]);

  const [headless] = blockEditorFromMarkdown(blockEditorToMarkdown([{ ...table, header: false }]));
  assert.equal(headless.header, false);
  assert.deepEqual(headless.rows, [["Plan", "Price"], ["Starter", "$9 | month"], ["Team", ""]]);
  assert.deepEqual(blockEditorFromMarkdown("before\n\n| a | b |\n|---|:-:|\n| 1 | 2 |\nafter").map((b) => b.type), ["text", "table", "text"]);
});

test("normalize keeps a table's widths and alignment per column, and drops the defaults", () => {
  const [made] = blockEditorNormalize([{ type: "table", rows: [["a", "b", "c"]], widths: [10, 200, "x"], align: ["center", "wat"], headerColumn: true }]);
  assert.deepEqual(made.widths, [48, 200, 0]);
  assert.deepEqual(made.align, ["center", "start", "start"]);
  assert.equal(made.headerColumn, true);
  const [plain] = blockEditorNormalize([{ type: "table", rows: [["a", "b"]], widths: [0, 0], align: ["start", "start"] }]);
  assert.equal(plain.widths, undefined);
  assert.equal(plain.align, undefined);
  assert.equal(plain.headerColumn, undefined);
});

test("table alignment survives Markdown and shows in HTML", () => {
  const aligned = { id: "t", type: "table", header: true, rows: [["a", "b", "c"], ["1", "2", "3"]], align: ["start", "center", "end"], widths: [0, 120, 0], headerColumn: true };
  const md = blockEditorToMarkdown([aligned]);
  assert.equal(md.split("\n")[1], "| --- | :---: | ---: |");
  assert.deepEqual(blockEditorFromMarkdown(md)[0].align, ["start", "center", "end"]);
  const html = blockEditorToHtml([aligned]);
  assert.match(html, /<th scope="col" style="text-align:center">b<\/th>/);
  assert.match(html, /<th scope="row">1<\/th>/);
  assert.match(html, /<colgroup><col><col style="width:120px"><col><\/colgroup>/);
});

const t3 = { id: "t", type: "table", header: true, rows: [["Name", "Qty"], ["pear", "10"], ["Apple", "9"], ["", "1"]] };
test("insert, duplicate and delete rows and columns keep widths and align per column", () => {
  const sized = { ...t3, widths: [100, 0], align: ["start", "end"] };
  assert.deepEqual(blockEditorEditTable(sized, { op: "insert-column", at: 1 }).widths, [100, 0, 0]);
  assert.deepEqual(blockEditorEditTable(sized, { op: "duplicate-column", at: 1 }).align, ["start", "end", "end"]);
  assert.deepEqual(blockEditorEditTable(t3, { op: "duplicate-row", at: 1 }).rows[2], ["pear", "10"]);
  assert.equal(blockEditorEditTable(t3, { op: "delete-column", at: 0 }).rows[0].length, 1);
  const one = { ...t3, rows: [["x"]] };
  assert.equal(blockEditorEditTable(one, { op: "delete-row", at: 0 }), one);
});
test("moves never take the header row out of first place", () => {
  assert.deepEqual(blockEditorEditTable(t3, { op: "move-row", from: 3, to: 1 }).rows.map((r) => r[1]), ["Qty", "1", "10", "9"]);
  assert.equal(blockEditorEditTable(t3, { op: "move-row", from: 0, to: 2 }), t3);
  assert.equal(blockEditorEditTable(t3, { op: "move-row", from: 2, to: 0 }), t3);
  assert.deepEqual(blockEditorEditTable(t3, { op: "move-column", from: 0, to: 1 }).rows[0], ["Qty", "Name"]);
});
test("sort is case- and number-aware, keeps the header and puts empty cells last", () => {
  assert.deepEqual(blockEditorEditTable(t3, { op: "sort", column: 0, dir: "asc" }).rows.map((r) => r[0]), ["Name", "Apple", "pear", ""]);
  assert.deepEqual(blockEditorEditTable(t3, { op: "sort", column: 1, dir: "desc" }).rows.map((r) => r[1]), ["Qty", "10", "9", "1"]);
});
test("clear, align, width and header edits", () => {
  assert.deepEqual(blockEditorEditTable(t3, { op: "clear", rows: [1, 2], columns: [1, 1] }).rows.map((r) => r[1]), ["Qty", "", "", "1"]);
  assert.deepEqual(blockEditorEditTable(t3, { op: "align", column: 1, align: "end" }).align, ["start", "end"]);
  assert.deepEqual(blockEditorEditTable(t3, { op: "width", column: 0, width: 10, measured: [200, 150] }).widths, [48, 150]);
  assert.equal(blockEditorEditTable({ ...t3, widths: [90, 90] }, { op: "width", column: 0, width: 0 }).widths, undefined);
  assert.equal(blockEditorEditTable(t3, { op: "header", column: true }).headerColumn, true);
  assert.equal(blockEditorEditTable(t3, { op: "header", row: false }).header, false);
});
test("cells fills from a cell and grows the table, one line per cell", () => {
  const out = blockEditorEditTable(t3, { op: "cells", at: [3, 1], values: [["a", "b"], ["c\nd", "e"]] });
  assert.deepEqual(out.rows.slice(3), [["", "a", "b"], ["", "c d", "e"]]);
  assert.equal(out.rows[0].length, 3);
});
test("edits respect the row and column limits", () => {
  const wide = { ...t3, rows: [Array(12).fill("")] };
  assert.equal(blockEditorEditTable(wide, { op: "insert-column", at: 0 }), wide);
});
