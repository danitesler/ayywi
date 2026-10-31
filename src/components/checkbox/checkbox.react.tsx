import { forwardRef, useEffect, useRef, type InputHTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { mergeRefs } from "../../lib/refs";
import { checkboxClass, checkboxSizeClass, type CheckboxSize } from "./checkbox";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /** Visual size. (The native `size` attribute does nothing on a checkbox, so it is not exposed.) */
  size?: CheckboxSize;
  /** "Some selected" state (e.g. a select-all box). Screen readers announce it as mixed. */
  indeterminate?: boolean;
  /** Called with the new checked state. `onChange` still works too. */
  onCheckedChange?: (checked: boolean) => void;
}

/** A native checkbox: forms, labels and keyboard (Space) work out of the box. */
export const Checkbox = /* @__PURE__ */ forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { indeterminate = false, size, className, onChange, onCheckedChange, ...props },
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
      className={cx(checkboxClass, checkboxSizeClass(size), className)}
      onChange={(event) => {
        onChange?.(event);
        onCheckedChange?.(event.currentTarget.checked);
      }}
      {...props}
    />
  );
});
