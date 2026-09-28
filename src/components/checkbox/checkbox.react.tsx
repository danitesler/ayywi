import { forwardRef, useEffect, useRef, type InputHTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { mergeRefs } from "../../lib/refs";
import { checkboxClass } from "./checkbox";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** "Some selected" state (e.g. a select-all box). Screen readers announce it as mixed. */
  indeterminate?: boolean;
  /** Called with the new checked state. `onChange` still works too. */
  onCheckedChange?: (checked: boolean) => void;
}

/** A native checkbox: forms, labels and keyboard (Space) work out of the box. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { indeterminate = false, className, onChange, onCheckedChange, ...props },
  ref,
) {
  const inner = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inner.current) inner.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <input
      ref={mergeRefs(ref, inner)}
      type="checkbox"
      className={cx(checkboxClass, className)}
      onChange={(event) => {
        onChange?.(event);
        onCheckedChange?.(event.currentTarget.checked);
      }}
      {...props}
    />
  );
});
