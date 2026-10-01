import { cx } from "../../lib/cx";

export const spinnerSizes = ["sm", "md", "lg"] as const;
export type SpinnerSize = (typeof spinnerSizes)[number];

export interface SpinnerClassOptions {
  /** md (default) follows the text size like an icon; sm and lg are fixed icon sizes. */
  size?: SpinnerSize;
  className?: string;
}

export function spinnerClass({ size = "md", className }: SpinnerClassOptions = {}): string {
  return cx("ayy-spinner", size !== "md" && `ayy-spinner--${size}`, className);
}
