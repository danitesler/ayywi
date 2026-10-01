import { forwardRef, type CSSProperties, type HTMLAttributes } from "react";
import { progressClass, type ProgressSize, type ProgressVariant } from "./progress";

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** 0–100. Omit (or null) for indeterminate. */
  value?: number | null;
  /** The bar's status colour, like Alert and Badge. */
  variant?: ProgressVariant;
  /** @deprecated Use variant. */
  tone?: ProgressVariant;
  size?: ProgressSize;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { value, variant, tone, size, className, style, ...props },
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
      className={progressClass({ variant, tone, size, indeterminate, className })}
      style={indeterminate ? style : ({ "--ayy-value": clamped, ...style } as CSSProperties)}
      {...props}
    >
      <div className="ayy-progress__bar" />
    </div>
  );
});
