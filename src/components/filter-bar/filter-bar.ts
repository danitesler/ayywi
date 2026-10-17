import { cx } from "../../lib/cx";

export type FilterBarSize = "sm" | "md";

export interface FilterBarClassOptions {
  sticky?: boolean;
  flush?: boolean;
  size?: FilterBarSize;
  className?: string;
}

export function filterBarClass({ sticky = false, flush = false, size = "md", className }: FilterBarClassOptions = {}): string {
  return cx(
    "ayy-filter-bar",
    sticky && "ayy-filter-bar--sticky",
    flush && "ayy-filter-bar--flush",
    size === "sm" && "ayy-filter-bar--sm",
    className,
  );
}

export const filterBarMainClass = "ayy-filter-bar__main";
export const filterBarGroupClass = "ayy-filter-bar__group";
export const filterBarTabsClass = "ayy-filter-bar__tabs";
export const filterBarTabClass = "ayy-filter-bar__tab";
export const filterBarTabCountClass = "ayy-filter-bar__tab-count";
export const filterBarTriggerClass = "ayy-filter-bar__trigger";
export const filterBarTriggerBadgeClass = "ayy-filter-bar__trigger-badge";
export const filterBarActiveClass = "ayy-filter-bar__active";
export const filterBarSummaryClass = "ayy-filter-bar__summary";
export const filterBarClearClass = "ayy-filter-bar__clear";
