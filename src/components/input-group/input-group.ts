import { cx } from "../../lib/cx";

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
