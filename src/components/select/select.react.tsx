import { forwardRef, type HTMLAttributes, type SelectHTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { selectClass, selectControlClass, type SelectSize } from "./select";

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  /** Visual size. (The native `size` attribute — visible rows — isn't exposed; use `multiple` for a list box.) */
  size?: SelectSize;
  /** Props for the wrapper <div> that draws the chevron. `className` goes to the <select>. */
  wrapperProps?: HTMLAttributes<HTMLDivElement>;
}

/** A styled native <select>. Children are regular <option>/<optgroup> elements. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { size, className, wrapperProps, ...props },
  ref,
) {
  return (
    <div {...wrapperProps} className={selectClass({ size, className: wrapperProps?.className })}>
      <select ref={ref} className={cx(selectControlClass, className)} {...props} />
    </div>
  );
});
