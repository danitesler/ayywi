import { cx } from "../../lib/cx";

export const selectSizes = ["sm", "md", "lg"] as const;
export type SelectSize = (typeof selectSizes)[number];

export interface SelectClassOptions {
  size?: SelectSize;
  className?: string;
}

/** Put on the wrapper element; the <select> inside gets selectControlClass. */
export function selectClass({ size = "md", className }: SelectClassOptions = {}): string {
  return cx("ayy-select", size !== "md" && `ayy-select--${size}`, className);
}

export const selectControlClass = "ayy-select__control";
