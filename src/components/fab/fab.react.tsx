import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes } from "react";
import { fabClass, type FabSize, type FabVariant } from "./fab";

export interface FabProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  variant?: FabVariant;
  size?: FabSize;
  /** Icon and a label: a wider pill. Without it, give the button an aria-label. */
  extended?: boolean;
  /** Not floating: placed by its container. */
  inline?: boolean;
  /** Renders an <a> to that page instead of a <button>. */
  href?: string;
  type?: "button" | "submit" | "reset";
}

/** The screen's main action, floating at the bottom inline-end corner. Children: an Icon (and a label when extended). */
export const Fab = forwardRef<HTMLButtonElement & HTMLAnchorElement, FabProps>(function Fab(
  { variant, size, extended, inline, href, type = "button", className, ...props },
  ref,
) {
  const cls = fabClass({ variant, size, extended, inline, className });
  if (href !== undefined) {
    return <a ref={ref} href={href} className={cls} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)} />;
  }
  return <button ref={ref} type={type} className={cls} {...props} />;
});
