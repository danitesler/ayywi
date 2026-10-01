import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { inputGroupAddonClass, inputGroupClass, type InputGroupSize } from "./input-group";

export interface InputGroupProps extends HTMLAttributes<HTMLDivElement> {
  size?: InputGroupSize;
}

/** An Input with an icon, InputGroupAddon text or a small Button inside its box. Put the Input in as a direct child. */
export const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(function InputGroup({ size, className, ...props }, ref) {
  return <div ref={ref} className={inputGroupClass({ size, className })} {...props} />;
});

/** Text beside the input: a prefix (https://), a suffix (USD) or a Kbd hint. */
export const InputGroupAddon = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(function InputGroupAddon(
  { className, ...props },
  ref,
) {
  return <span ref={ref} className={cx(inputGroupAddonClass, className)} {...props} />;
});
