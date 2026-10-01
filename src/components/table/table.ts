import { cx } from "../../lib/cx";

export interface TableClassOptions {
  compact?: boolean;
  className?: string;
}

export function tableClass({ compact, className }: TableClassOptions = {}): string {
  return cx("ayy-table", compact && "ayy-table--compact", className);
}

export const tableWrapClass = "ayy-table-wrap";
export const tableNumClass = "ayy-table__num";
export const tableSortClass = "ayy-table__sort";
export const tableSelectClass = "ayy-table__select";

export type SortDirection = "ascending" | "descending";

/** The direction a click on a column header gives: ascending first, then it flips. */
export function nextSortDirection(current: string | null | undefined): SortDirection {
  return current === "ascending" ? "descending" : "ascending";
}

const collator = typeof Intl === "undefined" ? null : new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

/** A number from text like "1,204", "$48.20", "-3%" or "12 GB"; null when the text isn't one number. */
function asNumber(value: string): number | null {
  const match = value.trim().match(/^[^\d.-]{0,3}(-?[\d,\s]*\.?\d+)\s*[^\d]{0,4}$/);
  if (!match) return null;
  const n = Number(match[1].replace(/[,\s]/g, ""));
  return Number.isFinite(n) ? n : null;
}

/**
 * Compare two cell values the way people expect: numbers (also "1,204", "$48.20", "12 GB") by value, other text
 * alphabetically with digits read as numbers ("Item 2" before "Item 10"). Empty values sort last.
 */
export function compareValues(a: unknown, b: unknown): number {
  if (typeof a === "number" && typeof b === "number") return a - b;
  const x = a == null ? "" : String(a);
  const y = b == null ? "" : String(b);
  if (!x || !y) return x ? -1 : y ? 1 : 0;
  const nx = asNumber(x);
  const ny = asNumber(y);
  if (nx !== null && ny !== null) return nx - ny;
  return collator ? collator.compare(x, y) : x < y ? -1 : x > y ? 1 : 0;
}

export interface TableSortDetail {
  /** Index of the column among the header row's cells. */
  column: number;
  /** The header's data-sort-key, if it has one. */
  key: string | undefined;
  direction: SortDirection;
}

export interface TableControllerOptions {
  /** Called before rows move. Return false to sort them yourself (on the server, in your state). */
  onSort?: (detail: TableSortDetail) => boolean | void;
  /** Called when the selected rows change. */
  onSelectionChange?: (rows: HTMLTableRowElement[]) => void;
}

const cellValue = (row: HTMLTableRowElement, column: number) => {
  const cell = row.cells[column] as HTMLElement | undefined;
  return cell?.dataset.sortValue ?? cell?.textContent?.trim() ?? "";
};

/**
 * Wire a plain .ayy-table: a click on a header's .ayy-table__sort button sets aria-sort on that <th> (ascending,
 * then flipping) and reorders the body rows by that column (a cell's data-sort-value wins over its text); a
 * checkbox in the header's .ayy-table__select cell selects every row, rows' checkboxes set aria-selected on their
 * <tr>, and the header box shows all, some (indeterminate) or none. Framework-free; used by <ayy-table>.
 */
export function connectTable(table: HTMLTableElement, options: TableControllerOptions = {}): { destroy(): void } {
  const body = () => table.tBodies[0];
  const headerBox = () => table.tHead?.querySelector<HTMLInputElement>(`.${tableSelectClass} input[type="checkbox"]`) ?? null;
  const rowBoxes = () =>
    Array.from(body()?.rows ?? []).flatMap((row) => {
      const box = row.querySelector<HTMLInputElement>(`.${tableSelectClass} input[type="checkbox"]`);
      return box ? [{ row, box }] : [];
    });

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

  const onClick = (event: MouseEvent) => {
    const button = (event.target as Element | null)?.closest<HTMLButtonElement>(`.${tableSortClass}`);
    const th = button?.closest("th");
    if (!button || !th || !table.contains(th) || !th.closest("thead")) return;
    const direction = nextSortDirection(th.getAttribute("aria-sort"));
    const column = th.cellIndex;
    for (const other of th.parentElement?.querySelectorAll("th[aria-sort]") ?? []) if (other !== th) other.removeAttribute("aria-sort");
    th.setAttribute("aria-sort", direction);
    if (options.onSort?.({ column, key: th.dataset.sortKey, direction }) === false) return;
    const tbody = body();
    if (!tbody) return;
    const sign = direction === "ascending" ? 1 : -1;
    const rows = Array.from(tbody.rows);
    rows.sort((a, b) => sign * compareValues(cellValue(a, column), cellValue(b, column)));
    tbody.append(...rows);
  };

  const onChange = (event: Event) => {
    const input = event.target as HTMLInputElement | null;
    if (!input?.closest(`.${tableSelectClass}`) || !table.contains(input)) return;
    if (input === headerBox()) for (const { box } of rowBoxes()) box.checked = input.checked;
    syncSelection(true);
  };

  table.addEventListener("click", onClick);
  table.addEventListener("change", onChange);
  syncSelection(false);
  return {
    destroy() {
      table.removeEventListener("click", onClick);
      table.removeEventListener("change", onChange);
    },
  };
}
