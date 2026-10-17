import { cx } from "../../lib/cx";

export type SortingSize = "sm" | "md";

export interface SortingClassOptions {
  size?: SortingSize;
  className?: string;
}

export function sortingClass({
  size = "md",
  className,
}: SortingClassOptions = {}): string {
  return cx(
    "ayy-sorting",
    size === "sm" && "ayy-sorting--sm",
    className,
  );
}

export const sortingTriggerClass = "ayy-sorting__trigger";
