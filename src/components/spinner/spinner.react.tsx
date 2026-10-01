import { forwardRef, type HTMLAttributes } from "react";
import { spinnerClass, type SpinnerSize } from "./spinner";

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize;
  /** What's loading, for screen readers. Defaults to "Loading" (translate it). Pass "" when the text next to it says it. */
  label?: string;
}

/** An indeterminate loading ring. With a label it's a role="status"; without one it's decorative. */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner({ size, label = "Loading", className, ...props }, ref) {
  const a11y = label ? { role: "status", "aria-label": label } : { "aria-hidden": true as const };
  return <span ref={ref} className={spinnerClass({ size, className })} {...a11y} {...props} />;
});
