import { cx } from "../../lib/cx";

export const paginationClass = "ayy-pagination";
export const paginationEllipsisClass = "ayy-pagination__ellipsis";

export interface PaginationLinkClassOptions {
  /** Previous / next: stays visible on phones, where the numbers hide. */
  step?: boolean;
  className?: string;
}

export function paginationLinkClass({ step, className }: PaginationLinkClassOptions = {}): string {
  return cx("ayy-pagination__link", step && "ayy-pagination__link--step", className);
}

/**
 * The pages to show for `page` of `count`: the first and last, `siblings` either side of the current one, and "…" for
 * each gap, always the same number of slots so the control doesn't jump. paginationRange(6, 12) → [1, "…", 5, 6, 7, "…", 12],
 * paginationRange(1, 12) → [1, 2, 3, 4, 5, "…", 12]. Pages are 1-based.
 */
export function paginationRange(page: number, count: number, siblings = 1): (number | "…")[] {
  const total = Math.max(1, Math.floor(count));
  const current = Math.min(Math.max(1, Math.floor(page)), total);
  // First + last + current + siblings + two gaps: with that many pages or fewer, list them all.
  if (total <= siblings * 2 + 5) return Array.from({ length: total }, (_, i) => i + 1);
  const start = Math.max(Math.min(current - siblings, total - siblings * 2 - 2), 3);
  const end = Math.min(Math.max(current + siblings, siblings * 2 + 3), total - 2);
  const out: (number | "…")[] = [1, start > 3 ? "…" : 2];
  for (let p = start; p <= end; p++) out.push(p);
  out.push(end < total - 2 ? "…" : total - 1, total);
  return out;
}
