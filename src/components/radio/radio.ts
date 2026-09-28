import { cx } from "../../lib/cx";

/** Put on <input type="radio">. */
export const radioClass = "ayy-radio";
export const radioGroupLegendClass = "ayy-radio-group__legend";

export interface RadioGroupClassOptions {
  orientation?: "vertical" | "horizontal";
  className?: string;
}

/** Put on the <fieldset> that holds the radios. */
export function radioGroupClass({ orientation = "vertical", className }: RadioGroupClassOptions = {}): string {
  return cx("ayy-radio-group", orientation === "horizontal" && "ayy-radio-group--horizontal", className);
}
