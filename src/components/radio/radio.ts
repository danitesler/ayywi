import { cx } from "../../lib/cx";

/** Put on <input type="radio">. */
export const radioClass = "ayy-radio";
export const radioGroupLegendClass = "ayy-radio-group__legend";

export const radioSizes = ["sm", "md", "lg"] as const;
export type RadioSize = (typeof radioSizes)[number];

/** Add next to radioClass: `cx(radioClass, radioSizeClass("lg"))`. md is the default and adds nothing. */
export function radioSizeClass(size?: RadioSize): string | undefined {
  return size && size !== "md" ? `ayy-radio--${size}` : undefined;
}

export interface RadioGroupClassOptions {
  orientation?: "vertical" | "horizontal";
  /** Size of every radio and label in the group. A radio with its own size keeps it. */
  size?: RadioSize;
  className?: string;
}

/** Put on the <fieldset> that holds the radios. */
export function radioGroupClass({ orientation = "vertical", size, className }: RadioGroupClassOptions = {}): string {
  return cx(
    "ayy-radio-group",
    orientation === "horizontal" && "ayy-radio-group--horizontal",
    size && size !== "md" && `ayy-radio-group--${size}`,
    className,
  );
}
