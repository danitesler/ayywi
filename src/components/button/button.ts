import { cx } from "../../lib/cx";

export const buttonVariants = ["primary", "secondary", "outline", "ghost", "destructive", "link"] as const;
export const buttonSizes = ["sm", "md", "lg", "icon", "icon-sm"] as const;

export type ButtonVariant = (typeof buttonVariants)[number];
export type ButtonSize = (typeof buttonSizes)[number];

export interface ButtonClassOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

/** Class string for a button. Works on <button>, <a>, or any framework's link component. */
export function buttonClass({ variant = "primary", size = "md", className }: ButtonClassOptions = {}): string {
  return cx(
    "ayy-button",
    variant !== "primary" && `ayy-button--${variant}`,
    size !== "md" && `ayy-button--${size}`,
    className,
  );
}
