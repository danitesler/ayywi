import { cx } from "../../lib/cx";
import { connectDragDrop, dragPreviewChip } from "../drag-drop/drag-drop";
import { iconPickerClassConstant, type IconPickerChange } from "../icon-picker/icon-picker";
import { connectInlineEdit, type InlineEditController } from "../inline-edit/inline-edit";

export interface TableClassOptions {
  /** Tighter rows. */
  compact?: boolean;
  /** Roomier rows and columns. */
  spacious?: boolean;
  /** Lines between the columns too. */
  bordered?: boolean;
  /** The header (and footer) row stays in view while the wrap or container scrolls. */
  sticky?: boolean;
  /** table-layout: fixed — columns take their header cells' widths, not their content's. */
  fixed?: boolean;
  /** Draggable header cells that reorder columns on drop. */
  reorderable?: boolean;
  className?: string;
}

export function tableClass({ compact, spacious, bordered, sticky, fixed, reorderable, className }: TableClassOptions = {}): string {
  return cx(
    "ayy-table",
    compact && "ayy-table--compact",
    spacious && "ayy-table--spacious",
    bordered && "ayy-table--bordered",
    sticky && "ayy-table--sticky",
    fixed && "ayy-table--fixed",
    reorderable && "ayy-table--reorderable",
    className,
  );
}

export const tableContainerClass = "ayy-table-container";
export const tableToolbarClass = "ayy-table__toolbar";
export const tableHeadingClass = "ayy-table__heading";
export const tableTitleClass = "ayy-table__title";
export const tableDescriptionClass = "ayy-table__description";
export const tableToolsClass = "ayy-table__tools";
export const tablePagerClass = "ayy-table__pager";
export const tableWrapClass = "ayy-table-wrap";
export const tableNumClass = "ayy-table__num";
export const tableSortClass = "ayy-table__sort";
export const tableResizeClass = "ayy-table__resize";
export const tableSelectClass = "ayy-table__select";
export const tableActionsClass = "ayy-table__actions";
export const tablePinClass = "ayy-table__pin";
export const tablePinEndClass = "ayy-table__pin--end";
export const tableTruncateClass = "ayy-table__truncate";
export const tableEditClass = "ayy-table__edit";
export const tableMediaClass = "ayy-table__media";
export const tableSecondaryClass = "ayy-table__secondary";
export const tableExpandClass = "ayy-table__expand";
export const tableDetailClass = "ayy-table__detail";
export const tableGroupClass = "ayy-table__group";
export const tableEmptyClass = "ayy-table__empty";
export const tableRowLinkClass = "ayy-table__row-link";
export const tableDraggableClass = "ayy-table__draggable";
export const tableReorderClass = "ayy-table__reorder";
export const tableColumnHeaderClass = "ayy-table__column-header";
export const tableColumnLabelClass = "ayy-table__column-label";
export const tableColumnIconClass = "ayy-table__column-icon";
export const tableAddColumnClass = "ayy-table__add-column";
export const tableCellWrapClass = "ayy-table__wrap";

export type TablePin = "start" | "end";

/** Classes for a pinned header or body cell: it stays at the inline start (or end) while the table scrolls sideways. */
export function tablePinClassName(pin: TablePin | boolean | undefined): string | undefined {
  if (!pin) return undefined;
  return pin === "end" ? cx(tablePinClass, tablePinEndClass) : tablePinClass;
}

export interface TableRowActionsClassOptions {
  /** Reveal quick actions on row hover, keyboard focus, or when selected (touch screens keep them visible). */
  reveal?: boolean;
  className?: string;
}

export function tableRowActionsClass({ reveal, className }: TableRowActionsClassOptions = {}): string {
  return cx("ayy-table__row-actions", reveal && "ayy-table__row-actions--reveal", className);
}

export type SortDirection = "ascending" | "descending";

/** The direction a click on a column header gives: ascending first, then it flips. */
export function nextSortDirection(current: string | null | undefined): SortDirection {
  return current === "ascending" ? "descending" : "ascending";
}

const collator = typeof Intl === "undefined" ? null : /* @__PURE__ */ new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

/** A number from text like "1,204", "$48.20", "-3%" or "12 GB"; null when the text isn't one number. */
function asNumber(value: string): number | null {
  const match = value.trim().match(/^[^\d.-]{0,3}(-?[\d,\s]*\.?\d+)\s*[^\d]{0,4}$/);
  if (!match) return null;
  const n = Number(match[1].replace(/[,\s]/g, ""));
  return Number.isFinite(n) ? n : null;
}

/**
 * Compare two cell values the way people expect: numbers (also "1,204", "$48.20", "12 GB") by value, other text
 * alphabetically with digits read as numbers ("Item 2" before "Item 10"). Pass the direction rather than negating
 * the result, so empty values sort last both ways.
 */
export function compareValues(a: unknown, b: unknown, direction: SortDirection = "ascending"): number {
  const sign = direction === "descending" ? -1 : 1;
  if (typeof a === "number" && typeof b === "number") return sign * (a - b);
  const x = a == null ? "" : String(a);
  const y = b == null ? "" : String(b);
  if (!x || !y) return x ? -1 : y ? 1 : 0;
  const nx = asNumber(x);
  const ny = asNumber(y);
  if (nx !== null && ny !== null) return sign * (nx - ny);
  return sign * (collator ? collator.compare(x, y) : x < y ? -1 : x > y ? 1 : 0);
}

export interface TableSortDetail {
  /** Index of the column among the header row's cells. */
  column: number;
  /** The header's data-sort-key, if it has one. */
  key: string | undefined;
  direction: SortDirection;
}

export interface TableResizeDetail {
  /** Index of the column among the header row's cells. */
  column: number;
  /** The header's data-key (or data-sort-key), if it has one. */
  key: string | undefined;
  /** The column's width in px, or null when a double-click put it back. */
  width: number | null;
}

export interface TableCellEditDetail {
  /** The edited <tr>. */
  row: HTMLTableRowElement;
  /** The edited <td> or <th>. */
  cell: HTMLTableCellElement;
  /** Index of the column among the row's cells. */
  column: number;
  /** The cell's or header's data-key (or data-sort-key), if it has one. */
  key: string | undefined;
  /** The new cell value. */
  value: string;
}

export interface TableColumnReorderDetail {
  /** The 0-based column index that was dragged. */
  from: number;
  /** The 0-based column index where it was dropped. */
  to: number;
  /** The dragged column's data-key or data-sort-key, if present. */
  key?: string;
  /** The target column's data-key or data-sort-key, if present. */
  targetKey?: string;
}

export interface TableRowReorderDetail {
  /** Where the row was among the reorderable rows (0-based, across every body). */
  from: number;
  /** Where it lands among the others: what Array.splice wants after removing it. */
  to: number;
  /** The row's data-id, if it has one. */
  id?: string;
}

export interface TableControllerOptions {
  /** Return false to handle column actions in application state instead of changing the markup. */
  onColumnAction?: (detail: TableColumnActionDetail) => boolean | void;
  /** Called before rows move. Return false to sort them yourself (on the server, in your state). */
  onSort?: (detail: TableSortDetail) => boolean | void;
  /** Called when the selected rows change. */
  onSelectionChange?: (rows: HTMLTableRowElement[]) => void;
  /** Called when an .ayy-table__expand button opens or closes its row's detail row. */
  onExpandChange?: (row: HTMLTableRowElement, expanded: boolean) => void;
  /** Called when a drag or key press on an .ayy-table__resize handle ends. Save the width to restore it next time. */
  onResize?: (detail: TableResizeDetail) => void;
  /** Called when an .ayy-table__edit input commits a new value (on Enter or blur). */
  onCellEdit?: (detail: TableCellEditDetail) => void;
  /** Called when a row is dropped (or moved with the arrow keys on its handle). Return false to leave the DOM alone and reorder your own data. */
  onRowReorder?: (detail: TableRowReorderDetail) => boolean | void;
  /** Called when a column header is dragged to reorder columns. Return false to prevent DOM moving. */
  onColumnReorder?: (detail: TableColumnReorderDetail) => boolean | void;
}

export type TableColumnAction = "sort-ascending" | "sort-descending" | "duplicate" | "hide" | "delete" | "freeze" | "wrap" | "icon" | "insert-before" | "insert-after" | "add" | "filter" | "group" | "group-by";

export interface TableColumnActionDetail {
  action: TableColumnAction;
  column: number;
  key?: string;
  value?: string;
}

const cellValue = (row: HTMLTableRowElement, column: number) => {
  const cell = row.cells[column] as HTMLElement | undefined;
  if (!cell) return "";
  if (cell.dataset.sortValue !== undefined) return cell.dataset.sortValue;
  const edit = cell.querySelector<HTMLElement>(`.${tableEditClass}`);
  return edit ? (edit.dataset.value ?? "").trim() : (cell.textContent?.trim() ?? "");
};

/**
 * Reorder one <tbody> by a column. Group rows (.ayy-table__group) stay put and split the body into runs that sort on
 * their own; a detail row (.ayy-table__detail) moves with the row before it; a row holding .ayy-table__empty stays.
 */
function sortBody(tbody: HTMLTableSectionElement, column: number, direction: SortDirection) {
  type Run = { head: HTMLTableRowElement[]; units: HTMLTableRowElement[][] };
  const runs: Run[] = [{ head: [], units: [] }];
  for (const row of Array.from(tbody.rows)) {
    let run = runs[runs.length - 1];
    if (row.classList.contains(tableGroupClass) || row.querySelector(`:scope > .${tableEmptyClass}`)) {
      if (run.units.length) runs.push((run = { head: [], units: [] }));
      run.head.push(row);
    } else if (row.classList.contains(tableDetailClass) && run.units.length) {
      run.units[run.units.length - 1].push(row);
    } else {
      run.units.push([row]);
    }
  }
  for (const run of runs) run.units.sort((a, b) => compareValues(cellValue(a[0], column), cellValue(b[0], column), direction));
  tbody.append(...runs.flatMap((run) => [...run.head, ...run.units.flat()]));
}

const RESIZE_STEP = 16;
const RESIZE_STEP_BIG = 64;
const RESIZE_LIMITS: [number, number] = [48, 960];

/**
 * Wire the .ayy-table__resize handles in a table's header cells: drag one, or focus it and press the arrow keys
 * (Shift for bigger steps), to set that column's width; double-click puts the columns back. The first resize fixes
 * every header cell's width in px and makes the table as wide as its columns, so only the edge you move moves.
 * Handles are separators with aria-valuenow in px (limits from aria-valuemin / aria-valuemax, else 48–960).
 * Delegated, so handles rendered later work too. Used by connectTable() and the React Table.
 */
export function connectTableResize(table: HTMLTableElement, options: Pick<TableControllerOptions, "onResize"> = {}): { destroy(): void } {
  const handleOf = (target: EventTarget | null) => {
    const handle = target instanceof Element ? target.closest<HTMLElement>(`.${tableResizeClass}`) : null;
    const cell = handle?.closest("th");
    return handle && cell && table.contains(cell) ? { handle, cell } : null;
  };
  const isRtl = () => getComputedStyle(table).direction === "rtl";
  const limits = (handle: HTMLElement): [number, number] => [
    Number(handle.getAttribute("aria-valuemin")) || RESIZE_LIMITS[0],
    Number(handle.getAttribute("aria-valuemax")) || RESIZE_LIMITS[1],
  ];
  const initial = new Map<HTMLTableCellElement, string>();

  const prepare = (handle: HTMLElement, cell: HTMLTableCellElement) => {
    handle.setAttribute("role", "separator");
    handle.setAttribute("aria-orientation", "vertical");
    if (!handle.hasAttribute("tabindex")) handle.setAttribute("tabindex", "0");
    if (!handle.hasAttribute("aria-label") && !handle.hasAttribute("aria-labelledby")) {
      handle.setAttribute("aria-label", `Resize ${cell.textContent?.trim() || "column"}`);
    }
    const [min, max] = limits(handle);
    handle.setAttribute("aria-valuemin", String(min));
    handle.setAttribute("aria-valuemax", String(max));
    if (cell.offsetWidth) handle.setAttribute("aria-valuenow", String(Math.round(cell.offsetWidth)));
  };

  const row = (cell: HTMLTableCellElement) => Array.from((cell.parentElement as HTMLTableRowElement).cells);
  const fitTable = (cell: HTMLTableCellElement) => {
    const total = row(cell).reduce((sum, c) => sum + (parseFloat(c.style.inlineSize) || c.offsetWidth), 0);
    table.style.inlineSize = `${Math.round(total)}px`;
  };

  // Fix every column at the width it has now, so a change to one doesn't spread over the others.
  const freeze = (cell: HTMLTableCellElement) => {
    if (table.style.tableLayout === "fixed" && table.style.inlineSize) return;
    const cells = row(cell);
    const widths = cells.map((c) => c.offsetWidth);
    cells.forEach((c, i) => {
      if (!initial.has(c)) initial.set(c, c.style.inlineSize);
      // Border-box, so the width set is the width measured, padding included.
      c.style.boxSizing = "border-box";
      c.style.inlineSize = `${widths[i]}px`;
    });
    table.style.tableLayout = "fixed";
    fitTable(cell);
  };

  const setWidth = (handle: HTMLElement, cell: HTMLTableCellElement, width: number) => {
    freeze(cell);
    const [min, max] = limits(handle);
    const next = Math.round(Math.min(max, Math.max(min, width)));
    cell.style.inlineSize = `${next}px`;
    fitTable(cell);
    handle.setAttribute("aria-valuenow", String(next));
  };

  const report = (cell: HTMLTableCellElement, width: number | null) =>
    options.onResize?.({ column: cell.cellIndex, key: cell.dataset.key ?? cell.dataset.sortKey, width });

  let drag: { handle: HTMLElement; cell: HTMLTableCellElement; startX: number; startWidth: number; id: number } | null = null;

  const onDown = (event: PointerEvent) => {
    const hit = handleOf(event.target);
    if (!hit || event.button !== 0) return;
    event.preventDefault();
    prepare(hit.handle, hit.cell);
    hit.handle.focus();
    hit.handle.setPointerCapture?.(event.pointerId);
    drag = { ...hit, startX: event.clientX, startWidth: hit.cell.offsetWidth, id: event.pointerId };
    hit.handle.setAttribute("data-dragging", "");
  };

  const onMove = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.id) return;
    // Dragging towards the inline end widens the column.
    setWidth(drag.handle, drag.cell, drag.startWidth + (event.clientX - drag.startX) * (isRtl() ? -1 : 1));
  };

  const onUp = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.id) return;
    const { handle, cell, id } = drag;
    drag = null;
    handle.removeAttribute("data-dragging");
    if (handle.hasPointerCapture?.(id)) handle.releasePointerCapture(id);
    report(cell, cell.offsetWidth);
  };

  const onKey = (event: KeyboardEvent) => {
    const hit = handleOf(event.target);
    if (!hit) return;
    const step = event.shiftKey ? RESIZE_STEP_BIG : RESIZE_STEP;
    const grows = isRtl() ? -1 : 1;
    const [min, max] = limits(hit.handle);
    const current = hit.cell.offsetWidth;
    let next: number | undefined;
    if (event.key === "ArrowRight") next = current + step * grows;
    else if (event.key === "ArrowLeft") next = current - step * grows;
    else if (event.key === "Home") next = min;
    else if (event.key === "End") next = max;
    if (next === undefined) return;
    event.preventDefault();
    setWidth(hit.handle, hit.cell, next);
    report(hit.cell, hit.cell.offsetWidth);
  };

  const onReset = (event: MouseEvent) => {
    const hit = handleOf(event.target);
    if (!hit) return;
    for (const [c, width] of initial) {
      c.style.inlineSize = width;
      c.style.removeProperty("box-sizing");
    }
    initial.clear();
    table.style.removeProperty("table-layout");
    table.style.removeProperty("inline-size");
    prepare(hit.handle, hit.cell);
    report(hit.cell, null);
  };

  const onFocus = (event: FocusEvent) => {
    const hit = handleOf(event.target);
    if (hit) prepare(hit.handle, hit.cell);
  };

  for (const handle of table.querySelectorAll<HTMLElement>(`thead .${tableResizeClass}`)) {
    const cell = handle.closest("th");
    if (cell) prepare(handle, cell);
  }

  table.addEventListener("pointerdown", onDown);
  table.addEventListener("pointermove", onMove);
  table.addEventListener("pointerup", onUp);
  table.addEventListener("pointercancel", onUp);
  table.addEventListener("keydown", onKey);
  table.addEventListener("dblclick", onReset);
  table.addEventListener("focusin", onFocus);
  return {
    destroy() {
      table.removeEventListener("pointerdown", onDown);
      table.removeEventListener("pointermove", onMove);
      table.removeEventListener("pointerup", onUp);
      table.removeEventListener("pointercancel", onUp);
      table.removeEventListener("keydown", onKey);
      table.removeEventListener("dblclick", onReset);
      table.removeEventListener("focusin", onFocus);
    },
  };
}

const INTERACTIVE_IN_ROW =
  'a, button, input:not([type="checkbox"]), select, textarea, summary, [contenteditable="true"], [popover], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], .ayy-table__resize, .ayy-table__row-link';

/**
 * Wire drag-to-select on a table's rows: pressing the primary pointer button on a selectable row (or its checkbox /
 * .ayy-table__select cell) and dragging across other rows sets every crossed row's selection to the starting row's
 * toggled state. Used by connectTable() and the React Table.
 */
export function connectTableDragSelect(
  table: HTMLTableElement,
  options: { onRowChange?: (row: HTMLTableRowElement, box: HTMLInputElement, checked: boolean) => void } = {},
): { destroy(): void; wasDragged(): boolean } {
  let drag: {
    startRow: HTMLTableRowElement;
    startBox: HTMLInputElement;
    targetChecked: boolean;
    pointerId: number;
    moved: boolean;
    startedOnCheckbox: boolean;
    visited: Set<HTMLTableRowElement>;
  } | null = null;
  let suppressClickUntil = 0;

  const findSelectableRow = (target: EventTarget | null) => {
    const el = target instanceof Element ? target : null;
    if (!el || !table.contains(el)) return null;
    const row = el.closest("tbody tr") as HTMLTableRowElement | null;
    if (!row || row.classList.contains(tableGroupClass) || row.classList.contains(tableDetailClass) || row.getAttribute("aria-disabled") === "true") {
      return null;
    }
    const box = row.querySelector<HTMLInputElement>(`:scope > .${tableSelectClass} input[type="checkbox"]`);
    if (!box || box.disabled) return null;
    return { row, box, el };
  };

  const applyRow = (row: HTMLTableRowElement, box: HTMLInputElement, checked: boolean) => {
    if (options.onRowChange) {
      options.onRowChange(row, box, checked);
      return;
    }
    if (box.checked === checked) return;
    box.checked = checked;
    row.setAttribute("aria-selected", String(checked));
    box.dispatchEvent(new Event("change", { bubbles: true }));
  };

  const onDown = (event: PointerEvent) => {
    if (event.button !== 0 || event.shiftKey || event.metaKey || event.ctrlKey || event.altKey) return;
    const hit = findSelectableRow(event.target);
    if (!hit) return;
    if (hit.el.closest(INTERACTIVE_IN_ROW)) return;
    const startedOnCheckbox = Boolean(hit.el.closest('input[type="checkbox"], label'));
    const inSelectCell = Boolean(hit.el.closest(`.${tableSelectClass}`));
    // Don't start row drag on a row with a row-link unless pressing inside the select column
    if (!inSelectCell && hit.row.querySelector(`.${tableRowLinkClass}`)) return;
    drag = {
      startRow: hit.row,
      startBox: hit.box,
      targetChecked: !hit.box.checked,
      pointerId: event.pointerId,
      moved: false,
      startedOnCheckbox,
      visited: new Set(),
    };
  };

  const onMove = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    if ((event.buttons & 1) === 0) {
      onUp(event);
      return;
    }
    const under = typeof document !== "undefined" ? document.elementFromPoint(event.clientX, event.clientY) : event.target;
    const hit = findSelectableRow(under ?? event.target);
    if (!hit) return;
    if (!drag.moved) {
      if (hit.row === drag.startRow && !drag.startedOnCheckbox) {
        // Still on the starting row; only start drag-selecting once crossing to another row or dragging from the select cell
        return;
      }
      if (hit.row === drag.startRow && drag.startedOnCheckbox) return;
      drag.moved = true;
      table.setAttribute("data-selecting", "");
      if (!drag.visited.has(drag.startRow)) {
        drag.visited.add(drag.startRow);
        applyRow(drag.startRow, drag.startBox, drag.targetChecked);
      }
    }
    if (!drag.visited.has(hit.row)) {
      drag.visited.add(hit.row);
      applyRow(hit.row, hit.box, drag.targetChecked);
    }
  };

  const onUp = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const { moved } = drag;
    drag = null;
    table.removeAttribute("data-selecting");
    if (moved) {
      suppressClickUntil = Date.now() + 80;
    }
  };

  const onClickCapture = (event: MouseEvent) => {
    if (Date.now() < suppressClickUntil) {
      const target = event.target as Element | null;
      if (target?.closest('input[type="checkbox"], label, .ayy-table__select')) {
        event.preventDefault();
        event.stopPropagation();
      }
      suppressClickUntil = 0;
    }
  };

  table.addEventListener("pointerdown", onDown);
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
  window.addEventListener("pointercancel", onUp);
  table.addEventListener("click", onClickCapture, true);

  return {
    destroy() {
      table.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      table.removeEventListener("click", onClickCapture, true);
    },
    wasDragged() {
      return Date.now() < suppressClickUntil;
    },
  };
}

interface CellEditSpec {
  label: string;
  value: string;
  /** What the display shows when it isn't the raw value (a formatted price). */
  text?: string;
  multiline?: boolean;
  disabled?: boolean;
}

const cellEditControllers = new WeakMap<HTMLElement, InlineEditController>();

/** Read back what a cell's inline edit (.ayy-table__edit) was built from, so a copy or a switch to a textarea keeps it. */
function readCellEdit(root: HTMLElement): CellEditSpec {
  const display = root.querySelector<HTMLButtonElement>(".ayy-inline-edit__display");
  const field = root.querySelector<HTMLElement>(".ayy-inline-edit__input");
  return {
    label: display?.getAttribute("aria-label") ?? "",
    value: root.dataset.value ?? "",
    text: root.querySelector(".ayy-inline-edit__text")?.textContent ?? undefined,
    multiline: field instanceof HTMLTextAreaElement,
    disabled: !!display?.disabled,
  };
}

/** A cell's inline edit built from plain DOM and wired to Inline edit; a commit bubbles as "ayy-change" for connectTableEdit. */
function createCellEdit({ label, value, text, multiline, disabled }: CellEditSpec): HTMLElement {
  const root = document.createElement("div");
  root.className = `ayy-inline-edit ${tableEditClass}`;
  root.dataset.value = value;
  const display = document.createElement("button");
  display.type = "button";
  display.className = "ayy-inline-edit__display";
  display.setAttribute("aria-label", label);
  display.disabled = !!disabled;
  const span = document.createElement("span");
  span.className = "ayy-inline-edit__text";
  span.textContent = text ?? value;
  display.append(span);
  const field = document.createElement(multiline ? "textarea" : "input");
  field.className = `${multiline ? "ayy-textarea" : "ayy-input"} ayy-inline-edit__input`;
  if (field instanceof HTMLTextAreaElement) field.rows = 1;
  else field.type = "text";
  field.value = value;
  field.hidden = true;
  field.disabled = !!disabled;
  field.setAttribute("aria-label", label);
  root.append(display, field);
  cellEditControllers.set(root, connectInlineEdit(root, {
    onCommit: (next) => root.dispatchEvent(new CustomEvent("ayy-change", { detail: { value: next }, bubbles: true })),
  }));
  return root;
}

/** Rebuild every inline edit in a cell (a duplicated column, or a column that starts or stops wrapping). */
function rebuildCellEdits(cell: HTMLElement, label?: (old: string) => string, multiline?: boolean) {
  for (const root of Array.from(cell.querySelectorAll<HTMLElement>(`.${tableEditClass}`))) {
    const spec = readCellEdit(root);
    if (multiline !== undefined && spec.multiline === multiline) continue;
    cellEditControllers.get(root)?.destroy();
    const next = createCellEdit({ ...spec, label: label ? label(spec.label) : spec.label, multiline: multiline ?? spec.multiline });
    (root.parentElement?.localName === "ayy-inline-edit" ? root.parentElement : root).replaceWith(next);
  }
}

/**
 * Report cell edits in a table: an inline edit inside a cell (.ayy-table__edit on an .ayy-inline-edit, in React a TableEdit)
 * bubbles "ayy-change" when a value is saved, and onCellEdit gets the row, cell, column and new value.
 */
export function connectTableEdit(
  table: HTMLTableElement,
  options: Pick<TableControllerOptions, "onCellEdit"> = {},
): { destroy(): void } {
  const onChange = (event: Event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const root = target.closest<HTMLElement>(`.${tableEditClass}`) ?? target.querySelector<HTMLElement>(`.${tableEditClass}`);
    if (!root || !table.contains(root)) return;
    const cell = root.closest<HTMLTableCellElement>("td, th");
    const row = cell?.closest("tr");
    if (!cell || !row) return;
    const th = table.tHead?.rows[0]?.cells[cell.cellIndex] as HTMLElement | undefined;
    const key = cell.dataset.key ?? cell.dataset.sortKey ?? th?.dataset.key ?? th?.dataset.sortKey;
    const value = (event as CustomEvent<{ value?: string }>).detail?.value ?? root.dataset.value ?? "";
    options.onCellEdit?.({ row, cell, column: cell.cellIndex, key, value });
  };

  table.addEventListener("ayy-change", onChange);

  return {
    destroy() {
      table.removeEventListener("ayy-change", onChange);
    },
  };
}

/** Mark a header as the sorted column and reorder every body by it; onSort can return false to sort the rows yourself. */
function sortByHeader(table: HTMLTableElement, th: HTMLTableCellElement, direction: SortDirection, onSort: TableControllerOptions["onSort"]) {
  for (const other of th.parentElement?.querySelectorAll("th[aria-sort]") ?? []) if (other !== th) other.removeAttribute("aria-sort");
  th.setAttribute("aria-sort", direction);
  if (onSort?.({ column: th.cellIndex, key: th.dataset.sortKey, direction }) === false) return;
  for (const tbody of Array.from(table.tBodies)) sortBody(tbody, th.cellIndex, direction);
}

/** Column menu actions and cumulative offsets for multiple frozen columns. */
export function connectTableColumns(
  table: HTMLTableElement,
  options: Pick<TableControllerOptions, "onColumnAction" | "onSort"> = {},
): { destroy(): void } {
  const root = table.closest<HTMLElement>(`.${tableContainerClass}`) ?? table.parentElement!;
  let frame = 0;
  let nextColumn = 0;
  let controlTimer: ReturnType<typeof setTimeout> | undefined;
  const headers = () => Array.from(table.tHead?.rows[0]?.cells ?? []);
  const sync = () => {
    frame = 0;
    const cells = headers();
    for (const end of [false, true]) {
      let offset = 0;
      for (const head of end ? [...cells].reverse() : cells) {
        if (!head.classList.contains(tablePinClass) || head.classList.contains(tablePinEndClass) !== end) continue;
        for (const row of Array.from(table.rows)) {
          const cell = row.cells[head.cellIndex];
          if (cell?.colSpan === 1 && cell.classList.contains(tablePinClass)) cell.style.setProperty("--_pin-offset", `${offset}px`);
        }
        offset += head.offsetWidth;
      }
    }
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(sync); };
  const resize = new ResizeObserver(schedule);
  resize.observe(table);
  let columnCount = headers().length;
  const observe = () => {
    const cells = headers();
    if (cells.length !== columnCount && table.style.tableLayout === "fixed") {
      // Let an inserted column take space before the next resize fixes the widths again.
      table.style.removeProperty("table-layout");
      table.style.removeProperty("inline-size");
    }
    columnCount = cells.length;
    resize.disconnect();
    resize.observe(table);
    for (const head of cells) resize.observe(head);
    schedule();
  };
  const mutations = new MutationObserver(observe);
  mutations.observe(table, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
  observe();

  const groupBy = (key: string) => {
    for (const group of table.querySelectorAll(`tr.${tableGroupClass}[data-generated-group]`)) group.remove();
    const column = headers().findIndex((head) => head.dataset.key === key);
    if (column < 0) return;
    for (const body of Array.from(table.tBodies)) {
      const groups = new Map<string, HTMLTableRowElement[]>();
      let label = "";
      for (const row of Array.from(body.rows)) {
        if (row.querySelector(`.${tableEmptyClass}`)) continue;
        if (!row.classList.contains(tableDetailClass)) label = cellValue(row, column) || "Empty";
        const rows = groups.get(label) ?? [];
        rows.push(row);
        groups.set(label, rows);
      }
      for (const [name, rows] of groups) {
        const group = body.insertRow();
        group.className = tableGroupClass;
        group.setAttribute("data-generated-group", "");
        const th = document.createElement("th");
        th.colSpan = headers().length;
        th.scope = "rowgroup";
        const span = document.createElement("span");
        span.textContent = `${name} · ${rows.filter((row) => !row.classList.contains(tableDetailClass)).length}`;
        th.append(span);
        group.append(th);
        body.append(group, ...rows);
      }
    }
  };

  const insert = (index: number) => {
    let key: string;
    do { key = `column-${++nextColumn}`; } while (headers().some((head) => head.dataset.key === key));
    const label = `Column ${nextColumn}`;
    const source = headers().find((head) => head.dataset.key);
    for (const row of Array.from(table.rows)) {
      const spanning = Array.from(row.cells).find((cell) => cell.colSpan > 1 || cell.classList.contains(tableEmptyClass));
      if (spanning) { spanning.colSpan += 1; continue; }
      const cell = document.createElement(row.parentElement === table.tHead ? "th" : "td");
      cell.dataset.key = key;
      if (cell instanceof HTMLTableCellElement && cell.tagName === "TH") {
        // Copy authored controls so inserted HTML columns keep the same menu and resize contract.
        if (source) {
          const copy = source.cloneNode(true) as HTMLTableCellElement;
          cell.append(...Array.from(copy.childNodes));
          // Tooltips gain [popover] at runtime; leave only the menu panel for ayy-menu to discover on upgrade.
          for (const tip of cell.querySelectorAll(".ayy-tooltip__content")) {
            tip.removeAttribute("popover");
            tip.removeAttribute("data-floating");
            tip.removeAttribute("style");
          }
          for (const menu of cell.querySelectorAll("ayy-menu[open]")) menu.removeAttribute("open");
          for (const trigger of cell.querySelectorAll('[aria-expanded]')) trigger.setAttribute("aria-expanded", "false");
          const menuLabel = cell.querySelector(`.ayy-menu__label`);
          if (menuLabel) menuLabel.textContent = label;
          for (const el of cell.querySelectorAll<HTMLElement>("[id]")) {
            const old = el.id;
            el.id = `${key}-${old}`;
            for (const target of cell.querySelectorAll<HTMLElement>("[aria-controls], [aria-labelledby], [aria-describedby], [popovertarget]")) {
              for (const attr of ["aria-controls", "aria-labelledby", "aria-describedby", "popovertarget"]) if (target.getAttribute(attr) === old) target.setAttribute(attr, el.id);
            }
          }
          const name = cell.querySelector(`.${tableColumnLabelClass}`);
          if (name) name.textContent = label;
          for (const button of cell.querySelectorAll<HTMLElement>("[aria-label]")) {
            if (button.classList.contains(tableResizeClass)) button.setAttribute("aria-label", `Resize ${label}`);
            else if (button.getAttribute("aria-haspopup") === "menu") button.setAttribute("aria-label", `Column options for ${label}`);
          }
          for (const item of cell.querySelectorAll('[role="menuitemcheckbox"]')) item.setAttribute("aria-checked", "false");
        } else cell.textContent = label;
        cell.scope = "col";
      } else if (row.parentElement !== table.tFoot) {
        const rowName = row.querySelector(`.${tableMediaClass} > :last-child > :first-child`)?.textContent?.trim() || `row ${row.sectionRowIndex + 1}`;
        cell.append(createCellEdit({ label: `${label} for ${rowName}`, value: "", disabled: row.getAttribute("aria-disabled") === "true" }));
      }
      row.insertBefore(cell, row.cells[index] ?? null);
    }
    table.style.removeProperty("inline-size");
    table.style.removeProperty("table-layout");
    schedule();
  };

  const duplicate = (head: HTMLTableCellElement) => {
    const index = head.cellIndex;
    let key: string;
    do { key = `column-${++nextColumn}`; } while (headers().some((cell) => cell.dataset.key === key));
    const name = head.querySelector(`.${tableColumnLabelClass}`)?.textContent?.trim() || head.textContent?.trim() || "Column";
    const label = `${name} copy`;
    for (const row of Array.from(table.rows)) {
      const spanning = Array.from(row.cells).find((cell) => cell.colSpan > 1 || cell.classList.contains(tableEmptyClass));
      if (spanning) { spanning.colSpan += 1; continue; }
      const source = row.cells[index];
      if (!source) continue;
      const cell = source.cloneNode(true) as HTMLTableCellElement;
      cell.dataset.key = key;
      cell.removeAttribute("aria-sort");
      cell.classList.remove(tablePinClass);
      cell.style.removeProperty("--_pin-offset");
      cell.style.removeProperty("inline-size");
      rebuildCellEdits(cell, (text) => text.replace(name, label));
      if (row.parentElement === table.tHead) {
        for (const tip of cell.querySelectorAll(".ayy-tooltip__content")) {
          tip.removeAttribute("popover");
          tip.removeAttribute("data-floating");
          tip.removeAttribute("style");
        }
        for (const menu of cell.querySelectorAll("ayy-menu[open]")) menu.removeAttribute("open");
        for (const trigger of cell.querySelectorAll("[aria-expanded]")) trigger.setAttribute("aria-expanded", "false");
        for (const el of cell.querySelectorAll<HTMLElement>("[id]")) {
          const old = el.id;
          el.id = `${key}-${old}`;
          for (const target of cell.querySelectorAll<HTMLElement>("[aria-controls], [aria-labelledby], [aria-describedby], [popovertarget]")) {
            for (const attr of ["aria-controls", "aria-labelledby", "aria-describedby", "popovertarget"]) if (target.getAttribute(attr) === old) target.setAttribute(attr, el.id);
          }
        }
        const title = cell.querySelector(`.${tableColumnLabelClass}`);
        const textNode = title && Array.from(title.childNodes).reverse().find((node) => node.nodeType === Node.TEXT_NODE);
        if (textNode) textNode.textContent = label;
        else if (title) title.textContent = label;
        const menuLabel = cell.querySelector(".ayy-menu__label");
        if (menuLabel) menuLabel.textContent = label;
        for (const handle of cell.querySelectorAll(`.${tableResizeClass}`)) handle.setAttribute("aria-label", `Resize ${label}`);
      }
      row.insertBefore(cell, source.nextElementSibling);
    }
    table.style.removeProperty("inline-size");
    table.style.removeProperty("table-layout");
    schedule();
  };

  const hide = (head: HTMLTableCellElement) => {
    for (const row of Array.from(table.rows)) {
      const cell = row.cells[head.cellIndex];
      if (cell?.colSpan === 1) cell.hidden = true;
    }
    schedule();
  };

  const remove = (head: HTMLTableCellElement) => {
    const index = head.cellIndex;
    for (const row of Array.from(table.rows)) {
      const spanning = Array.from(row.cells).find((cell) => cell.colSpan > 1);
      if (spanning) { spanning.colSpan -= 1; continue; }
      row.cells[index]?.remove();
    }
    schedule();
  };

  // item: the clicked [data-column-action] element, or an Icon picker carrying one. picked: what the picker chose.
  const run = (item: HTMLElement, picked?: IconPickerChange) => {
    // A control outside the header (a toolbar sort menu) names its column with data-column-key.
    const head = item.closest<HTMLTableCellElement>("thead th")
      ?? (item.dataset.columnKey ? Array.from(table.tHead?.querySelectorAll<HTMLTableCellElement>("th[data-key]") ?? []).find((cell) => cell.dataset.key === item.dataset.columnKey) ?? null : null);
    if (head && head.closest("table") !== table) return;
    const requested = item.dataset.columnAction;
    const rtl = getComputedStyle(table).direction === "rtl";
    const action: TableColumnAction = requested === "insert-left" ? (rtl ? "insert-after" : "insert-before")
      : requested === "insert-right" ? (rtl ? "insert-before" : "insert-after") : requested as TableColumnAction;
    const detail: TableColumnActionDetail = { action, column: head?.cellIndex ?? -1, key: head?.dataset.key, value: picked ? picked.value : item.dataset.columnValue };
    if (options.onColumnAction?.(detail) === false) return;
    if (!table.dispatchEvent(new CustomEvent("ayy-column-action", { detail, bubbles: true, cancelable: true }))) return;
    if (head && (action === "sort-ascending" || action === "sort-descending")) {
      sortByHeader(table, head, action === "sort-ascending" ? "ascending" : "descending", options.onSort);
    } else if (head && action === "duplicate") {
      duplicate(head);
    } else if (head && action === "hide") {
      hide(head);
    } else if (head && action === "delete") {
      remove(head);
    } else if (action === "filter" || action === "group") {
      controlTimer = setTimeout(() => root.querySelector<HTMLButtonElement>(`[data-table-control~="${action === "filter" ? "filters" : "groups"}"]`)?.click(), 0);
    } else if (action === "group-by") {
      groupBy(detail.value ?? "");
    } else if (action === "add" || action === "insert-before" || action === "insert-after") {
      const index = head ? head.cellIndex + (action === "insert-after" ? 1 : 0) : headers().findIndex((cell) => cell.classList.contains(tableAddColumnClass));
      insert(index < 0 ? headers().length : index);
    } else if (head && (action === "freeze" || action === "wrap")) {
      const cls = action === "freeze" ? tablePinClass : tableCellWrapClass;
      const enabled = !head.classList.contains(cls);
      for (const row of Array.from(table.rows)) {
        const cell = row.cells[head.cellIndex];
        if (cell?.colSpan === 1) {
          cell.classList.toggle(cls, enabled);
          if (action === "wrap") {
            rebuildCellEdits(cell, undefined, enabled);
          }
        }
      }
      item.setAttribute("aria-checked", String(enabled));
    } else if (head && action === "icon") {
      const label = head.querySelector(`.${tableColumnLabelClass}`);
      label?.querySelector(`.${tableColumnIconClass}`)?.remove();
      // An Icon picker's option (an SVG or an emoji), or a plain menu item holding an SVG; "" or "none" removes it.
      const source = picked ? picked.option : item;
      const svg = source?.querySelector("svg");
      const emoji = picked?.kind === "emoji" ? picked.value : "";
      if (label && (svg || emoji) && detail.value !== "none") {
        const icon = document.createElement("span");
        icon.className = tableColumnIconClass;
        icon.setAttribute("aria-hidden", "true");
        if (svg) icon.append(svg.cloneNode(true));
        else icon.textContent = emoji;
        label.prepend(icon);
      }
    }
    schedule();
  };
  const onClick = (event: MouseEvent) => {
    const item = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-column-action]") : null;
    // Clicks inside an Icon picker are its own (search, arrow keys); its pick arrives as ayy-pick.
    if (item && root.contains(item) && !item.classList.contains(iconPickerClassConstant)) run(item);
  };
  const onPick = (event: Event) => {
    const picker = event.target instanceof Element ? event.target.closest<HTMLElement>(`.${iconPickerClassConstant}[data-column-action]`) : null;
    if (picker && root.contains(picker)) run(picker, (event as CustomEvent<IconPickerChange>).detail);
  };
  root.addEventListener("click", onClick);
  root.addEventListener("ayy-pick", onPick);
  return { destroy() {
    root.removeEventListener("click", onClick);
    root.removeEventListener("ayy-pick", onPick);
    resize.disconnect();
    mutations.disconnect();
    cancelAnimationFrame(frame);
    clearTimeout(controlTimer);
  } };
}

export interface TableColumnReorderOptions {
  /** Called when a column header is dragged and dropped to reorder columns. Return false to skip DOM moving. */
  onColumnReorder?: (detail: TableColumnReorderDetail) => boolean | void;
  /** Selector for header cells that can be dragged. Default matches th[data-reorderable], th.ayy-table__draggable, or unpinned headers on a reorderable table. */
  selector?: string;
}

/**
 * Wire drag-and-drop column reordering on a table's header cells. Dragging a header shows where it will land with
 * a drop line (data-drop-edge) and reorders the column in the header and every body and footer row on drop.
 * Keyboard: focused headers or their handles move with Alt + arrow keys.
 * Delegated from the table; emits "ayy-column-reorder" and calls options.onColumnReorder. Used by connectTable() and React Table.
 */
export function connectTableColumnReorder(
  table: HTMLTableElement,
  options: TableColumnReorderOptions = {},
): { destroy(): void; wasDragged(): boolean } {
  const defaultSelector = `thead th[data-reorderable]:not([data-reorderable="false"]), thead th.${tableDraggableClass}, .ayy-table[data-reorderable] thead th:not(.${tableSelectClass}, .${tableExpandClass}, .${tableActionsClass}, .${tableAddColumnClass}, .${tablePinClass}, [data-reorderable="false"]), .ayy-table--reorderable thead th:not(.${tableSelectClass}, .${tableExpandClass}, .${tableActionsClass}, .${tableAddColumnClass}, .${tablePinClass}, [data-reorderable="false"])`;
  const columnSelector = options.selector ?? defaultSelector;

  return connectDragDrop(table, {
    items: columnSelector,
    orientation: "horizontal",
    ignore: `input, textarea, select, [aria-haspopup="menu"]:not(.${tableSortClass}), [role^="menuitem"], [contenteditable="true"], [role="separator"], .${tableResizeClass}`,
    preview: (th) => dragPreviewChip(th.querySelector(`.${tableColumnLabelClass}`)?.textContent?.trim() || th.textContent?.trim() || "Column"),
    applyMove(move) {
      const fromTh = move.item as HTMLTableCellElement;
      const fromIndex = fromTh.cellIndex;
      const rest = Array.from(table.querySelectorAll<HTMLTableCellElement>(columnSelector)).filter((el) => el !== fromTh);
      const isBefore = move.toIndex < rest.length;
      const targetTh = isBefore ? rest[move.toIndex] : rest[rest.length - 1];
      if (!targetTh || targetTh === fromTh) return;

      const targetIndex = targetTh.cellIndex;
      const toIndex = isBefore ? (fromIndex < targetIndex ? targetIndex - 1 : targetIndex) : (fromIndex < targetIndex ? targetIndex : targetIndex + 1);

      const detail: TableColumnReorderDetail = {
        from: fromIndex,
        to: toIndex,
        key: fromTh.dataset.key ?? fromTh.dataset.sortKey,
        targetKey: targetTh.dataset.key ?? targetTh.dataset.sortKey,
      };

      const dispatchEvent = () => {
        table.dispatchEvent(new CustomEvent("ayy-column-reorder", { bubbles: true, detail }));
      };

      if (options.onColumnReorder?.(detail) === false) {
        dispatchEvent();
        return;
      }

      for (const row of Array.from(table.rows)) {
        if (row.classList.contains(tableGroupClass) || row.classList.contains(tableDetailClass)) continue;
        const fromCell = row.cells[fromIndex];
        const targetCell = row.cells[targetIndex];
        if (fromCell && targetCell && fromCell !== targetCell) {
          if (isBefore) {
            targetCell.before(fromCell);
          } else {
            targetCell.after(fromCell);
          }
        }
      }
      dispatchEvent();
    },
  });
}

/**
 * Wire drag-and-drop row reordering: a row with an .ayy-drag-handle button is picked up by it, a line shows where it
 * will land, and on drop the row (with its .ayy-table__detail row) moves in the DOM. A focused handle moves its row with
 * the arrow keys. Rows without a handle, group rows and detail rows stay put.
 * Delegated from the table; emits "ayy-row-reorder" and calls options.onRowReorder. Used by connectTable() and React Table.
 */
export function connectTableRowReorder(
  table: HTMLTableElement,
  options: Pick<TableControllerOptions, "onRowReorder"> = {},
): { destroy(): void; wasDragged(): boolean } {
  const items = `tbody tr:has(> td .ayy-drag-handle):not(.${tableGroupClass}, .${tableDetailClass}, [aria-disabled="true"])`;
  const detailOf = (row: Element) => {
    const next = row.nextElementSibling;
    return next?.classList.contains(tableDetailClass) ? next : null;
  };
  return connectDragDrop(table, {
    items,
    handle: ".ayy-drag-handle",
    orientation: "vertical",
    preview: (row) => dragPreviewChip(row.querySelector(".ayy-drag-handle")?.getAttribute("aria-label")?.replace(/^Move\s+/i, "") || "Row"),
    describe: (row) => row.querySelector(".ayy-drag-handle")?.getAttribute("aria-label")?.replace(/^Move\s+/i, "") ?? "Row",
    applyMove(move) {
      const row = move.item;
      const rest = Array.from(table.querySelectorAll<HTMLElement>(items)).filter((el) => el !== row);
      const target = rest[Math.min(move.toIndex, rest.length - 1)];
      if (!target) return;
      const detail = detailOf(row);
      const event: TableRowReorderDetail = { from: move.fromIndex, to: move.toIndex, id: row.dataset.id };
      if (options.onRowReorder?.(event) === false) {
        table.dispatchEvent(new CustomEvent("ayy-row-reorder", { bubbles: true, detail: event }));
        return;
      }
      if (move.toIndex < rest.length) target.before(row);
      else (detailOf(target) ?? target).after(row);
      if (detail) row.after(detail);
      table.dispatchEvent(new CustomEvent("ayy-row-reorder", { bubbles: true, detail: event }));
    },
  });
}

/**
 * Wire a plain .ayy-table: a click on a header's .ayy-table__sort button sets aria-sort on that <th> (ascending,
 * then flipping) and reorders each body's rows by that column (a cell's data-sort-value wins over its text; detail
 * rows move with their row, group rows stay put); a checkbox in the header's .ayy-table__select cell selects every
 * row, rows' checkboxes set aria-selected on their <tr> (Shift+click ticks the range since the last one, and dragging
 * across rows selects or deselects them as you move), and the header box shows all, some (indeterminate) or none;
 * an .ayy-table__expand button flips its aria-expanded, which shows or hides the .ayy-table__detail row after it;
 * .ayy-table__resize handles resize their column (connectTableResize); .ayy-table__edit inputs edit cells inline
 * (Enter/blur commits, Escape reverts); column headers drag to reorder columns (connectTableColumnReorder); rows with an .ayy-drag-handle drag to reorder rows (connectTableRowReorder).
 * Framework-free; used by <ayy-table>.
 */
export function connectTable(table: HTMLTableElement, options: TableControllerOptions = {}): { destroy(): void } {
  const headerBox = () => table.tHead?.querySelector<HTMLInputElement>(`.${tableSelectClass} input[type="checkbox"]`) ?? null;
  const rowBoxes = () =>
    Array.from(table.tBodies).flatMap((body) =>
      Array.from(body.rows).flatMap((row) => {
        const box = row.querySelector<HTMLInputElement>(`:scope > .${tableSelectClass} input[type="checkbox"]`);
        return box ? [{ row, box }] : [];
      }),
    );

  const syncSelection = (notify: boolean) => {
    const boxes = rowBoxes();
    for (const { row, box } of boxes) row.setAttribute("aria-selected", String(box.checked));
    const selected = boxes.filter(({ box }) => box.checked);
    const all = headerBox();
    if (all) {
      all.checked = boxes.length > 0 && selected.length === boxes.length;
      all.indeterminate = selected.length > 0 && selected.length < boxes.length;
    }
    if (notify) options.onSelectionChange?.(selected.map(({ row }) => row));
  };

  let lastBox: HTMLInputElement | null = null;
  let shiftHeld = false;

  const onPointer = (event: MouseEvent | KeyboardEvent) => {
    shiftHeld = event.shiftKey;
  };

  const onClick = (event: MouseEvent) => {
    const target = event.target as Element | null;
    const expand = target?.closest<HTMLButtonElement>(`.${tableExpandClass}`);
    if (expand && table.contains(expand)) {
      const expanded = expand.getAttribute("aria-expanded") !== "true";
      expand.setAttribute("aria-expanded", String(expanded));
      const row = expand.closest("tr");
      if (row) options.onExpandChange?.(row, expanded);
      return;
    }
    const selectCell = target?.closest<HTMLElement>(`.${tableSelectClass}`);
    if (selectCell && table.contains(selectCell) && !target?.closest('input[type="checkbox"], label')) {
      const box = selectCell.querySelector<HTMLInputElement>('input[type="checkbox"]');
      if (box && !box.disabled && !dragSelect.wasDragged()) {
        box.checked = !box.checked;
        box.dispatchEvent(new Event("change", { bubbles: true }));
      }
      return;
    }
    // A title that opens a column menu (aria-haspopup) sorts from the menu, not on click.
    const button = target?.closest<HTMLButtonElement>(`.${tableSortClass}:not([aria-haspopup])`);
    const th = button?.closest("th");
    if (!button || !th || !table.contains(th) || !th.closest("thead")) return;
    sortByHeader(table, th, nextSortDirection(th.getAttribute("aria-sort")), options.onSort);
  };

  const onChange = (event: Event) => {
    const input = event.target as HTMLInputElement | null;
    if (!input?.closest(`.${tableSelectClass}`) || !table.contains(input)) return;
    if (input === headerBox()) {
      for (const { box } of rowBoxes()) if (!box.disabled) box.checked = input.checked;
      lastBox = null;
    } else {
      const boxes = rowBoxes().map(({ box }) => box);
      const from = lastBox ? boxes.indexOf(lastBox) : -1;
      const to = boxes.indexOf(input);
      // Shift+click: every box between the last one ticked and this one follows this one.
      if (shiftHeld && from >= 0 && to >= 0 && from !== to) {
        for (const box of boxes.slice(Math.min(from, to), Math.max(from, to) + 1)) {
          if (!box.disabled) box.checked = input.checked;
        }
      }
      lastBox = input;
    }
    shiftHeld = false;
    syncSelection(true);
  };

  const resize = connectTableResize(table, { onResize: options.onResize });
  const dragSelect = connectTableDragSelect(table, {
    onRowChange: (_row, box, checked) => {
      if (box.checked === checked) return;
      box.checked = checked;
      lastBox = box;
      syncSelection(true);
    },
  });
  const edit = connectTableEdit(table, { onCellEdit: options.onCellEdit });
  const columnReorder = connectTableColumnReorder(table, { onColumnReorder: options.onColumnReorder });
  const rowReorder = connectTableRowReorder(table, { onRowReorder: options.onRowReorder });
  const columns = connectTableColumns(table, { onColumnAction: options.onColumnAction, onSort: options.onSort });
  table.addEventListener("pointerdown", onPointer, true);
  table.addEventListener("keydown", onPointer, true);
  table.addEventListener("click", onClick);
  table.addEventListener("change", onChange);
  syncSelection(false);
  return {
    destroy() {
      resize.destroy();
      dragSelect.destroy();
      edit.destroy();
      columnReorder.destroy();
      rowReorder.destroy();
      columns.destroy();
      table.removeEventListener("pointerdown", onPointer, true);
      table.removeEventListener("keydown", onPointer, true);
      table.removeEventListener("click", onClick);
      table.removeEventListener("change", onChange);
    },
  };
}
