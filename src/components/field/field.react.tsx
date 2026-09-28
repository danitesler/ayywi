import { forwardRef, type HTMLAttributes, type LabelHTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { fieldClass, fieldErrorClass, fieldHintClass, labelClass } from "./field";

export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  inline?: boolean;
}

export const Field = forwardRef<HTMLDivElement, FieldProps>(function Field({ inline, className, ...props }, ref) {
  return <div ref={ref} className={fieldClass({ inline, className })} {...props} />;
});

export const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(function Label(
  { className, ...props },
  ref,
) {
  return <label ref={ref} className={cx(labelClass, className)} {...props} />;
});

export const FieldHint = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(function FieldHint(
  { className, ...props },
  ref,
) {
  return <p ref={ref} className={cx(fieldHintClass, className)} {...props} />;
});

export const FieldError = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(function FieldError(
  { className, ...props },
  ref,
) {
  return <p ref={ref} className={cx(fieldErrorClass, className)} {...props} />;
});
