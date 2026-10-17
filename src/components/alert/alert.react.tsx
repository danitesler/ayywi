import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { alertActionsClass, alertClass, alertDescriptionClass, alertTitleClass, type AlertVariant } from "./alert";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
}

/** Inline message. Put an optional <Icon> first, then AlertTitle / AlertDescription / AlertActions. */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert({ variant, className, ...props }, ref) {
  return <div ref={ref} className={alertClass({ variant, className })} {...props} />;
});

export interface AlertTitleProps extends HTMLAttributes<HTMLParagraphElement> {}

export const AlertTitle = forwardRef<HTMLParagraphElement, AlertTitleProps>(function AlertTitle(
  { className, ...props },
  ref,
) {
  return <p ref={ref} className={cx(alertTitleClass, className)} {...props} />;
});

export interface AlertDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export const AlertDescription = forwardRef<HTMLParagraphElement, AlertDescriptionProps>(function AlertDescription(
  { className, ...props },
  ref,
) {
  return <p ref={ref} className={cx(alertDescriptionClass, className)} {...props} />;
});

export interface AlertActionsProps extends HTMLAttributes<HTMLDivElement> {}

export const AlertActions = forwardRef<HTMLDivElement, AlertActionsProps>(function AlertActions(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx(alertActionsClass, className)} {...props} />;
});
