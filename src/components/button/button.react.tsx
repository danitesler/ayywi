import { forwardRef, type ButtonHTMLAttributes, type MouseEvent } from "react";
import { Spinner } from "../spinner/spinner.react";
import { buttonClass, type ButtonSize, type ButtonVariant } from "./button";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Fill the container's width. */
  block?: boolean;
  /** Working on it: a spinner before the label, aria-busy="true", and clicks (and form submits) are ignored. It stays focusable. */
  loading?: boolean;
}

/** Defaults to type="button" so it never submits a form by accident. Pass type="submit" explicitly. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, block, loading, className, type = "button", onClick, children, ...props },
  ref,
) {
  const click = (event: MouseEvent<HTMLButtonElement>) => {
    if (loading) return event.preventDefault();
    onClick?.(event);
  };
  return (
    <button
      ref={ref}
      type={type}
      className={buttonClass({ variant, size, block, className })}
      aria-busy={loading || undefined}
      onClick={click}
      {...props}
    >
      {loading ? <Spinner label="" /> : null}
      {children}
    </button>
  );
});
