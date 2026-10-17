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

export const inputGroupSizes = ["sm", "md", "lg"] as const;
export type InputGroupSize = (typeof inputGroupSizes)[number];

export interface InputGroupClassOptions {
  size?: InputGroupSize;
  className?: string;
}

export function inputGroupClass({ size = "md", className }: InputGroupClassOptions = {}): string {
  return cx("ayy-input-group", size !== "md" && `ayy-input-group--${size}`, className);
}

export const inputGroupAddonClass = "ayy-input-group__addon";

