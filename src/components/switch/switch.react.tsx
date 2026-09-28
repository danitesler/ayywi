import { forwardRef, type InputHTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { switchClass } from "./switch";

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "role"> {
  /** Convenience: called with the new checked state. `onChange` still works too. */
  onCheckedChange?: (checked: boolean) => void;
}

/** A native checkbox with role="switch": form submission, keyboard (Space) and labels work out of the box. */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { className, onChange, onCheckedChange, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type="checkbox"
      role="switch"
      className={cx(switchClass, className)}
      onChange={(event) => {
        onChange?.(event);
        onCheckedChange?.(event.currentTarget.checked);
      }}
      {...props}
    />
  );
});
