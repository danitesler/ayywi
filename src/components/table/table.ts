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
