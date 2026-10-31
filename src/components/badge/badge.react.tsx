import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { badgeClass, type BadgeSize, type BadgeVariant } from "./badge";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  /** Leading status dot. "pulse" animates it (live), "static" doesn't. */
  dot?: boolean | "pulse" | "static";
}

export const Badge = /* @__PURE__ */ forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant, size, dot, className, children, ...props },
  ref,
) {
  return (
    <span ref={ref} className={badgeClass({ variant, size, className })} {...props}>
      {dot ? <span className={cx("ayy-badge__dot", dot === "static" && "ayy-badge__dot--static")} aria-hidden="true" /> : null}
      {children}
    </span>
  );
});
