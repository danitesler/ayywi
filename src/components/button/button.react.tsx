import { forwardRef, type ButtonHTMLAttributes, type MouseEvent } from "react";
import { Spinner } from "../spinner/spinner.react";
import { buttonClass, type ButtonAlign, type ButtonSize, type ButtonVariant } from "./button";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Where the icon and label sit in a wide button (use with block). Defaults to "center". */
  align?: ButtonAlign;
  /** Fill the container's width. */
  block?: boolean;
  /** Working on it: a spinner before the label, aria-busy="true", and clicks (and form submits) are ignored. It stays focusable. */
  loading?: boolean;
}

/** Defaults to type="button" so it never submits a form by accident. Pass type="submit" explicitly. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, block, align, loading, className, type = "button", onClick, children, ...props },
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
      className={buttonClass({ variant, size, block, align, className })}
      aria-busy={loading || undefined}
      onClick={click}
      {...props}
    >
      {loading ? <Spinner label="" /> : null}
      {children}
    </button>
  );
});
