import { cx } from "../../lib/cx";

export const inputSizes = ["sm", "md", "lg"] as const;
export type InputSize = (typeof inputSizes)[number];

export interface InputClassOptions {
  size?: InputSize;
  className?: string;
}

export function inputClass({ size = "md", className }: InputClassOptions = {}): string {
  return cx("ayy-input", size !== "md" && `ayy-input--${size}`, className);
}
