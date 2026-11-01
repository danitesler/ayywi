import { cx } from "../../lib/cx";

export interface FindBarLabels {
  find: string; replaceWith: string; previous: string; next: string; matchCase: string; close: string;
  replace: string; replaceAll: string; none: string; count: (current: number, total: number) => string;
}
export const findBarLabels: FindBarLabels = {
  find: "Find", replaceWith: "Replace with", previous: "Previous match", next: "Next match", matchCase: "Match case",
  close: "Close", replace: "Replace", replaceAll: "Replace all", none: "No results", count: (current, total) => `${current} of ${total}`,
};
export function findBarClass({ floating = false, className }: { floating?: boolean; className?: string } = {}): string {
  return cx("ayy-find-bar", floating && "ayy-find-bar--floating", className);
}
export function findBarCountText(query: string, current: number, total: number, labels: Partial<FindBarLabels> = {}): string {
  if (!query) return "";
  return total ? (labels.count ?? findBarLabels.count)(current, total) : (labels.none ?? findBarLabels.none);
}
