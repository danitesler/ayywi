import { cx } from "../../lib/cx";

export const buttonVariants = ["primary", "secondary", "outline", "ghost", "destructive", "link", "ring"] as const;
export const buttonSizes = ["sm", "md", "lg", "icon", "icon-sm", "icon-lg"] as const;

export type ButtonVariant = (typeof buttonVariants)[number];
export const buttonAligns = ["start", "center", "end"] as const;

export type ButtonAlign = (typeof buttonAligns)[number];
export type ButtonSize = (typeof buttonSizes)[number];

export interface ButtonClassOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Fill the container's width. */
  block?: boolean;
  /** Where the icon and label sit in a wide button (use with block). Defaults to "center". */
  align?: ButtonAlign;
  className?: string;
}

/** Class string for a button. Works on <button>, <a>, or any framework's link component. */
export function buttonClass({ variant = "primary", size = "md", block, align, className }: ButtonClassOptions = {}): string {
  return cx(
    "ayy-button",
    variant !== "primary" && `ayy-button--${variant}`,
    size !== "md" && `ayy-button--${size}`,
    block && "ayy-button--block",
    align && align !== "center" && `ayy-button--${align}`,
    className,
  );
}

export interface SplitButtonClassOptions {
  /** Fill the container's width: the main action grows, the menu trigger stays square. */
  block?: boolean;
  className?: string;
}

/** Class string for a split button group holding a main action button and a trailing menu trigger button. */
export function splitButtonClass({ block, className }: SplitButtonClassOptions = {}): string {
  return cx("ayy-button-split", block && "ayy-button-split--block", className);
}
