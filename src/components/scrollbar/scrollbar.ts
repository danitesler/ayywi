import { cx } from "../../lib/cx";

export interface ScrollbarClassOptions {
  /** Show the thumb only while the pointer or focus is inside. */
  hover?: boolean;
  className?: string;
}

export function scrollbarClass({ hover, className }: ScrollbarClassOptions = {}): string {
  return cx("ayy-scrollbar", hover && "ayy-scrollbar--hover", className);
}
