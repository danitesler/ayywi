import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { badgeClass, type BadgeVariant } from "./badge";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  /** Leading status dot. "pulse" animates it (live), "static" doesn't. */
  dot?: boolean | "pulse" | "static";
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant, dot, className, children, ...props },
  ref,
) {
  return (
    <span ref={ref} className={badgeClass({ variant, className })} {...props}>
      {dot ? <span className={cx("ayy-badge__dot", dot === "static" && "ayy-badge__dot--static")} aria-hidden="true" /> : null}
      {children}
    </span>
  );
});
