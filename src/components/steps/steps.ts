import { cx } from "../../lib/cx";

export const stepsSizes = ["sm", "md", "lg"] as const;
export type StepsSize = (typeof stepsSizes)[number];

export interface StepsClassOptions {
  size?: StepsSize;
  /** A column instead of a row: for a side panel, or a phone. */
  vertical?: boolean;
  className?: string;
}

export function stepsClass({ size = "md", vertical, className }: StepsClassOptions = {}): string {
  return cx("ayy-steps", size !== "md" && `ayy-steps--${size}`, vertical && "ayy-steps--vertical", className);
}

export const stepsItemClass = "ayy-steps__item";
export const stepsLabelClass = "ayy-steps__label";
