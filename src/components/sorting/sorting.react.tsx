import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from "react";
import { cx } from "../../lib/cx";
import {
  sortingClass,
  sortingTriggerClass,
  type SortingSize,
} from "./sorting";

export { type SortingSize } from "./sorting";

export interface SortingProps extends HTMLAttributes<HTMLDivElement> {
  size?: SortingSize;
}

export const Sorting = forwardRef<HTMLDivElement, SortingProps>(function Sorting(
  { size = "md", className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={sortingClass({ size, className })} {...props}>
      {children}
    </div>
  );
});

export interface SortingTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: SortingSize;
  open?: boolean;
}

export const SortingTrigger = forwardRef<HTMLButtonElement, SortingTriggerProps>(function SortingTrigger(
  { size = "md", open = false, type = "button", className, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-haspopup="menu"
      aria-expanded={open}
      className={cx(
        sortingTriggerClass,
        size === "sm" && "ayy-sorting__trigger--sm",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});
