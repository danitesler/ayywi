import { forwardRef, type InputHTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { switchClass, switchSizeClass, type SwitchSize } from "./switch";

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "role" | "size"> {
  /** Visual size. (The native `size` attribute does nothing on a switch, so it is not exposed.) */
  size?: SwitchSize;
  /** Convenience: called with the new checked state. `onChange` still works too. */
  onCheckedChange?: (checked: boolean) => void;
}

/** A native checkbox with role="switch": form submission, keyboard (Space) and labels work out of the box. */
export const Switch = /* @__PURE__ */ forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { size, className, onChange, onCheckedChange, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type="checkbox"
      role="switch"
      className={cx(switchClass, switchSizeClass(size), className)}
      onChange={(event) => {
        onChange?.(event);
        onCheckedChange?.(event.currentTarget.checked);
      }}
      {...props}
    />
  );
});
