import { forwardRef, type CSSProperties, type HTMLAttributes } from "react";
import type { ProgressVariant } from "../progress/progress";
import { progressRingClass, type ProgressRingSize } from "./progress-ring";

export interface ProgressRingProps extends HTMLAttributes<HTMLDivElement> {
  /** 0–100. Omit (or null) for indeterminate. */
  value?: number | null;
  variant?: ProgressVariant;
  /** sm 1.25rem (inline with text), md 2.5rem, lg 4rem, xl up to 16rem (a timer). */
  size?: ProgressRingSize;
}

/** Progress as a ring that fills clockwise from the top. Children go in the middle: the value, a time, an icon. */
export const ProgressRing = forwardRef<HTMLDivElement, ProgressRingProps>(function ProgressRing(
  { value, variant, size, className, style, children, ...props },
  ref,
) {
  const indeterminate = value === undefined || value === null;
  const clamped = indeterminate ? undefined : Math.min(100, Math.max(0, value));
  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      className={progressRingClass({ variant, size, indeterminate, className })}
      style={indeterminate ? style : ({ "--ayy-value": clamped, ...style } as CSSProperties)}
      {...props}
    >
      <svg className="ayy-progress-ring__svg" viewBox="0 0 36 36" aria-hidden="true">
        <circle className="ayy-progress-ring__track" cx="18" cy="18" r="16" pathLength={100} />
        <circle className="ayy-progress-ring__bar" cx="18" cy="18" r="16" pathLength={100} />
      </svg>
      {children !== undefined && children !== null && children !== false && <span className="ayy-progress-ring__label">{children}</span>}
    </div>
  );
});
