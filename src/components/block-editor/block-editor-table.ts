// Block editor tables: every data change a table block can undergo, as one pure function. DOM-free so it unit-tests in
// node. connectBlockEditor routes each table action (the block-actions menu, the keyboard, the resize grip and paste)
// through `editTable`, which calls `blockEditorEditTable` and commits the block it returns.

import type { BlockEditorBlock, BlockEditorTableAlign } from "./block-editor";

export const MAX_ROWS = 100;
export const MAX_COLUMNS = 12;
export const MIN_COLUMN = 48;
export const MAX_COLUMN = 1200;

/** Cells as the table stores them: single-line plain text, every row as wide as the widest, at least one cell. */
export function tableGrid(raw: unknown): string[][] {
  const grid = (Array.isArray(raw) ? raw : [])
    .slice(0, MAX_ROWS)
    .map((row) => (Array.isArray(row) ? row : []).slice(0, MAX_COLUMNS).map((cell) => String(cell ?? "").replace(/\s+/g, " ").trim()));
  const width = Math.max(1, ...grid.map((row) => row.length));
  if (!grid.length) grid.push([]);
  return grid.map((row) => Array.from({ length: width }, (_, c) => row[c] ?? ""));
}

/** One change to a table block. `blockEditorEditTable` returns the same block for an edit that does nothing. */
export type BlockEditorTableEdit =
  | { op: "insert-row"; at: number }
  | { op: "insert-column"; at: number }
  | { op: "delete-row"; at: number }
  | { op: "delete-column"; at: number }
  | { op: "duplicate-row"; at: number }
  | { op: "duplicate-column"; at: number }
  | { op: "move-row"; from: number; to: number }
  | { op: "move-column"; from: number; to: number }
  | { op: "clear"; rows: [number, number]; columns: [number, number] } // inclusive ranges
  | { op: "align"; column: number; align: BlockEditorTableAlign }
  | { op: "width"; column: number; width: number; measured?: number[] } // width 0 = even out all
  | { op: "sort"; column: number; dir: "asc" | "desc" }
  | { op: "header"; row?: boolean; column?: boolean }
  | { op: "cells"; at: [number, number]; values: string[][] }; // fills from `at`, growing up to the limits

const columnWidth = (width: number) => Math.max(MIN_COLUMN, Math.min(MAX_COLUMN, Math.round(width)));

/** Apply one edit to a table block, returning a new block — or `block` itself when the edit changes nothing. */
export function blockEditorEditTable(block: BlockEditorBlock, edit: BlockEditorTableEdit): BlockEditorBlock {
  let rows = tableGrid(block.rows);
  const columns = rows[0].length;
  let widths = rows[0].map((_, c) => block.widths?.[c] ?? 0);
  const align = rows[0].map((_, c) => block.align?.[c] ?? "start");
  const extra: Partial<BlockEditorBlock> = {};

  switch (edit.op) {
    case "insert-row": {
      if (edit.at < 0 || edit.at > rows.length || rows.length >= MAX_ROWS) return block;
      rows.splice(edit.at, 0, rows[0].map(() => ""));
      break;
    }
    case "insert-column": {
      if (edit.at < 0 || edit.at > columns || columns >= MAX_COLUMNS) return block;
      for (const row of rows) row.splice(edit.at, 0, "");
      widths.splice(edit.at, 0, 0);
      align.splice(edit.at, 0, "start");
      break;
    }
    case "delete-row": {
      if (edit.at < 0 || edit.at >= rows.length || rows.length < 2) return block;
      rows.splice(edit.at, 1);
      break;
    }
    case "delete-column": {
      if (edit.at < 0 || edit.at >= columns || columns < 2) return block;
      for (const row of rows) row.splice(edit.at, 1);
      widths.splice(edit.at, 1);
      align.splice(edit.at, 1);
      break;
    }
    case "duplicate-row": {
      if (edit.at < 0 || edit.at >= rows.length || rows.length >= MAX_ROWS) return block;
      rows.splice(edit.at + 1, 0, rows[edit.at].slice());
      break;
    }
    case "duplicate-column": {
      if (edit.at < 0 || edit.at >= columns || columns >= MAX_COLUMNS) return block;
      for (const row of rows) row.splice(edit.at + 1, 0, row[edit.at]);
      widths.splice(edit.at + 1, 0, widths[edit.at]);
      align.splice(edit.at + 1, 0, align[edit.at]);
      break;
    }
    case "move-row": {
      const first = block.header !== false ? 1 : 0;
      if (edit.from < first || edit.from >= rows.length || edit.to < first || edit.to >= rows.length || edit.from === edit.to) return block;
      rows.splice(edit.to, 0, ...rows.splice(edit.from, 1));
      break;
    }
    case "move-column": {
      if (edit.from < 0 || edit.from >= columns || edit.to < 0 || edit.to >= columns || edit.from === edit.to) return block;
      for (const row of rows) row.splice(edit.to, 0, ...row.splice(edit.from, 1));
      widths.splice(edit.to, 0, ...widths.splice(edit.from, 1));
      align.splice(edit.to, 0, ...align.splice(edit.from, 1));
      break;
    }
    case "clear": {
      const rowStart = Math.max(0, Math.min(edit.rows[0], edit.rows[1]));
      const rowEnd = Math.min(rows.length - 1, Math.max(edit.rows[0], edit.rows[1]));
      const colStart = Math.max(0, Math.min(edit.columns[0], edit.columns[1]));
      const colEnd = Math.min(columns - 1, Math.max(edit.columns[0], edit.columns[1]));
      if (rowStart > rowEnd || colStart > colEnd) return block;
      for (let r = rowStart; r <= rowEnd; r++) for (let c = colStart; c <= colEnd; c++) rows[r][c] = "";
      break;
    }
    case "align": {
      if (edit.column < 0 || edit.column >= columns) return block;
      align[edit.column] = edit.align;
      break;
    }
    case "width": {
      if (edit.column < 0 || edit.column >= columns) return block;
      if (!edit.width) widths.fill(0);
      else {
        // The first width edit keeps every column's current px, so only this one moves. Clamp each measured width, not only the one being sized.
        if (!widths.some(Boolean)) widths = edit.measured?.length ? edit.measured.map(columnWidth) : rows[0].map(() => 160);
        widths[edit.column] = columnWidth(edit.width);
      }
      break;
    }
    case "sort": {
      if (edit.column < 0 || edit.column >= columns) return block;
      const first = block.header !== false ? 1 : 0;
      if (rows.length - first < 2) return block;
      const dir = edit.dir === "desc" ? -1 : 1;
      const body = rows.slice(first);
      body.sort((a, b) => {
        const x = a[edit.column];
        const y = b[edit.column];
        if (x === y) return 0;
        if (!x) return 1; // empty cells last, whatever the direction
        if (!y) return -1;
        return dir * x.localeCompare(y, undefined, { numeric: true, sensitivity: "base" });
      });
      rows.splice(first, body.length, ...body);
      break;
    }
    case "header": {
      if (edit.row === undefined && edit.column === undefined) return block;
      if (edit.row !== undefined) extra.header = edit.row;
      if (edit.column !== undefined) extra.headerColumn = edit.column;
      break;
    }
    case "cells": {
      const [atRow, atCol] = edit.at;
      if (atRow < 0 || atCol < 0 || atRow >= rows.length || atCol >= columns) return block;
      const width = Math.min(MAX_COLUMNS, Math.max(columns, atCol + edit.values.reduce((m, r) => Math.max(m, r.length), 0)));
      const height = Math.min(MAX_ROWS, Math.max(rows.length, atRow + edit.values.length));
      const grid = Array.from({ length: height }, (_, r) => Array.from({ length: width }, (_, c) => rows[r]?.[c] ?? ""));
      edit.values.forEach((line, r) => line.forEach((value, c) => {
        if (atRow + r < height && atCol + c < width) grid[atRow + r][atCol + c] = String(value ?? "").replace(/\s+/g, " ").trim();
      }));
      rows = grid;
      break;
    }
  }

  const nextWidths = Array.from({ length: rows[0].length }, (_, c) => widths[c] ?? 0);
  const nextAlign = Array.from({ length: rows[0].length }, (_, c) => align[c] ?? "start");
  const widthsOut = nextWidths.some(Boolean) ? nextWidths : undefined;
  const alignOut = nextAlign.some((a) => a !== "start") ? nextAlign : undefined;
  const sameRows = !!block.rows && block.rows.length === rows.length && block.rows.every((row, r) => row.length === rows[r].length && row.every((cell, c) => cell === rows[r][c]));
  const sameList = <T>(a: T[] | undefined, b: T[] | undefined) => a === b || (!!a && !!b && a.length === b.length && a.every((v, i) => v === b[i]));
  const sameHeader = (extra.header === undefined || extra.header === block.header) && (extra.headerColumn === undefined || extra.headerColumn === block.headerColumn);
  if (sameRows && sameList(block.widths, widthsOut) && sameList(block.align, alignOut) && sameHeader) return block;

  const next: BlockEditorBlock = { ...block, ...extra, rows };
  if (widthsOut) next.widths = widthsOut;
  else delete next.widths;
  if (alignOut) next.align = alignOut;
  else delete next.align;
  return next;
}
