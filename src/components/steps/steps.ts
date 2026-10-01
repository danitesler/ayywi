import { cx } from "../../lib/cx";

export interface StepsClassOptions {
  /** A column instead of a row: for a side panel, or a phone. */
  vertical?: boolean;
  className?: string;
}

export function stepsClass({ vertical, className }: StepsClassOptions = {}): string {
  return cx("ayy-steps", vertical && "ayy-steps--vertical", className);
}

export const stepsItemClass = "ayy-steps__item";
export const stepsLabelClass = "ayy-steps__label";
