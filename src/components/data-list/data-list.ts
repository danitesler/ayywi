import { cx } from "../../lib/cx";

export interface DataListClassOptions {
  /** Items side by side, wrapping to fit (columns at least --ayy-min wide). */
  row?: boolean;
  className?: string;
}

export function dataListClass({ row, className }: DataListClassOptions = {}): string {
  return cx("ayy-data-list", row && "ayy-data-list--row", className);
}

export const dataListItemClass = "ayy-data-list__item";
export const dataListLabelClass = "ayy-data-list__label";
export const dataListValueClass = "ayy-data-list__value";
