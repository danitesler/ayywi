import { cx } from "../../lib/cx";
import { ArrowLeft01Icon } from "../../lib/icons";
import { iconSvg } from "../icon/icon";

export function topBarClass({ center, large, className }: { center?: boolean; large?: boolean; className?: string } = {}): string {
  return cx("ayy-top-bar", center && "ayy-top-bar--center", large && "ayy-top-bar--large", className);
}

export const topBarBackClass = "ayy-top-bar__back";
export const topBarTitleClass = "ayy-top-bar__title";
export const topBarHeadingClass = "ayy-top-bar__heading";
export const topBarSubtitleClass = "ayy-top-bar__subtitle";
export const topBarActionsClass = "ayy-top-bar__actions";
export const topBarRowClass = "ayy-top-bar__row";

/** The back chevron, as SVG markup (Hugeicons ArrowLeft01, mirrored in RTL). */
export const topBarBackIcon = /* @__PURE__ */ iconSvg(ArrowLeft01Icon, { name: "chevron-left", directional: true });
