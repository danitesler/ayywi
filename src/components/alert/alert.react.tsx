import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { alertActionsClass, alertClass, alertDescriptionClass, alertTitleClass, type AlertSize, type AlertVariant } from "./alert";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  /** Padding, text and icon size. */
  size?: AlertSize;
}

/** Inline message. Put an optional <Icon> first, then AlertTitle / AlertDescription / AlertActions. */
export const Alert = /* @__PURE__ */ forwardRef<HTMLDivElement, AlertProps>(function Alert({ variant, size, className, ...props }, ref) {
  return <div ref={ref} className={alertClass({ variant, size, className })} {...props} />;
});

export interface AlertTitleProps extends HTMLAttributes<HTMLParagraphElement> {}

export const AlertTitle = /* @__PURE__ */ forwardRef<HTMLParagraphElement, AlertTitleProps>(function AlertTitle(
  { className, ...props },
  ref,
) {
  return <p ref={ref} className={cx(alertTitleClass, className)} {...props} />;
});

export interface AlertDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export const AlertDescription = /* @__PURE__ */ forwardRef<HTMLParagraphElement, AlertDescriptionProps>(function AlertDescription(
  { className, ...props },
  ref,
) {
  return <p ref={ref} className={cx(alertDescriptionClass, className)} {...props} />;
});

export interface AlertActionsProps extends HTMLAttributes<HTMLDivElement> {}

export const AlertActions = /* @__PURE__ */ forwardRef<HTMLDivElement, AlertActionsProps>(function AlertActions(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx(alertActionsClass, className)} {...props} />;
});
