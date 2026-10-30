import { forwardRef, type HTMLAttributes, type InputHTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { inputClass, inputGroupAddonClass, inputGroupClass, type InputGroupSize, type InputSize } from "./input";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Visual size. (The native `size` attribute — width in characters — is intentionally not exposed.) */
  size?: InputSize;
}

export const Input = /* @__PURE__ */ forwardRef<HTMLInputElement, InputProps>(function Input(
  { size, className, type = "text", ...props },
  ref,
) {
  return <input ref={ref} type={type} className={inputClass({ size, className })} {...props} />;
});

export interface InputGroupProps extends HTMLAttributes<HTMLDivElement> {
  size?: InputGroupSize;
}

/** An Input with an icon, InputGroupAddon text or a small Button inside its box. Put the Input in as a direct child. */
export const InputGroup = /* @__PURE__ */ forwardRef<HTMLDivElement, InputGroupProps>(function InputGroup({ size, className, ...props }, ref) {
  return <div ref={ref} className={inputGroupClass({ size, className })} {...props} />;
});

/** Text beside the input: a prefix (https://), a suffix (USD) or a Kbd hint. */
export const InputGroupAddon = /* @__PURE__ */ forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(function InputGroupAddon(
  { className, ...props },
  ref,
) {
  return <span ref={ref} className={cx(inputGroupAddonClass, className)} {...props} />;
});

