import { cx } from "../../lib/cx";

export interface FieldClassOptions {
  /** Control and label side by side (switches, checkboxes). */
  inline?: boolean;
  className?: string;
}

export function fieldClass({ inline, className }: FieldClassOptions = {}): string {
  return cx("ayy-field", inline && "ayy-field--inline", className);
}

export const labelClass = "ayy-label";
export const fieldHintClass = "ayy-field__hint";
export const fieldErrorClass = "ayy-field__error";
