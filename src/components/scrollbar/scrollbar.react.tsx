import { forwardRef, type HTMLAttributes } from "react";
import { scrollbarClass } from "./scrollbar";

export interface ScrollbarProps extends HTMLAttributes<HTMLDivElement> {
  /** Show the thumb only while the pointer or focus is inside. */
  hover?: boolean;
}

export const Scrollbar = /* @__PURE__ */ forwardRef<HTMLDivElement, ScrollbarProps>(function Scrollbar(
  { hover, className, tabIndex = 0, ...props },
  ref,
) {
  return <div ref={ref} className={scrollbarClass({ hover, className })} tabIndex={tabIndex} {...props} />;
});
