import { cx } from "../../lib/cx";
import { Cancel01Icon } from "../../lib/icons";
import { iconSvg } from "../icon/icon";

export interface ChipClassOptions {
  /** An active filter with a remove button (a <span>, not a control). */
  removable?: boolean;
  className?: string;
}

export function chipClass({ removable, className }: ChipClassOptions = {}): string {
  return cx("ayy-chip", removable && "ayy-chip--removable", className);
}

export function chipGroupClass({ scroll, className }: { scroll?: boolean; className?: string } = {}): string {
  return cx("ayy-chip-group", scroll && "ayy-chip-group--scroll", className);
}

export const chipCountClass = "ayy-chip__count";
export const chipRemoveClass = "ayy-chip__remove";

/** The cross inside .ayy-chip__remove, as SVG markup (Hugeicons Cancel01). */
export const chipRemoveIcon = /* @__PURE__ */ iconSvg(Cancel01Icon);
