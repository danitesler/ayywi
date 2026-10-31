import { cx } from "../../lib/cx";

export const buttonVariants = ["primary", "secondary", "outline", "ghost", "destructive", "link", "ring"] as const;
export const buttonSizes = ["xs", "sm", "md", "lg", "xl", "icon-xs", "icon-sm", "icon", "icon-lg", "icon-xl"] as const;

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

/* Floating action button: the one main action of a phone screen. */
export const fabVariants = ["primary", "secondary"] as const;
export type FabVariant = (typeof fabVariants)[number];
export const fabSizes = ["sm", "md", "lg"] as const;
export type FabSize = (typeof fabSizes)[number];

export interface FabClassOptions {
  variant?: FabVariant;
  size?: FabSize;
  /** Icon and a label: a wider pill. */
  extended?: boolean;
  /** Not floating: placed by its container. */
  inline?: boolean;
  className?: string;
}

/** Class string for a floating action button (.ayy-fab). */
export function fabClass({ variant = "primary", size = "md", extended, inline, className }: FabClassOptions = {}): string {
  return cx(
    "ayy-fab",
    variant !== "primary" && `ayy-fab--${variant}`,
    size !== "md" && `ayy-fab--${size}`,
    extended && "ayy-fab--extended",
    inline && "ayy-fab--inline",
    className,
  );
}
