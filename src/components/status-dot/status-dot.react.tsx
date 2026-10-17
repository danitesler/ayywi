import { forwardRef, type HTMLAttributes } from "react";
import { statusDotClass, type StatusDotSize, type StatusDotVariant } from "./status-dot";

export interface StatusDotProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: StatusDotVariant;
  size?: StatusDotSize;
  pulse?: boolean;
  label?: string;
}

export const StatusDot = forwardRef<HTMLSpanElement, StatusDotProps>(function StatusDot(
  { variant = "neutral", size = "md", pulse = false, label, className, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={statusDotClass({ variant, size, pulse, className })}
      role={label ? "status" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : "true"}
      {...props}
    />
  );
});
