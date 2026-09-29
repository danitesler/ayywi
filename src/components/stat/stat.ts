import { cx } from "../../lib/cx";

export const statSizes = ["md", "sm"] as const;
export type StatSize = (typeof statSizes)[number];

export interface StatClassOptions {
  size?: StatSize;
  className?: string;
}

export function statClass({ size = "md", className }: StatClassOptions = {}): string {
  return cx("ayy-stat", size === "sm" && "ayy-stat--sm", className);
}

export const statValueClass = "ayy-stat__value";
export const statUnitClass = "ayy-stat__unit";
export const statLabelClass = "ayy-stat__label";
