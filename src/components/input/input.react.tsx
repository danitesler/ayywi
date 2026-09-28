import { forwardRef, type InputHTMLAttributes } from "react";
import { inputClass, type InputSize } from "./input";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Visual size. (The native `size` attribute — width in characters — is intentionally not exposed.) */
  size?: InputSize;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size, className, type = "text", ...props },
  ref,
) {
  return <input ref={ref} type={type} className={inputClass({ size, className })} {...props} />;
});
