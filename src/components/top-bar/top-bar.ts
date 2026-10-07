import { cx } from "../../lib/cx";
import { ArrowLeft01Icon } from "../../lib/icons";
import { iconSvg } from "../icon/icon";

export function topBarClass({ center, large, className }: { center?: boolean; large?: boolean; className?: string } = {}): string {
  return cx("ayy-top-bar", center && "ayy-top-bar--center", large && "ayy-top-bar--large", className);
}

/** The back chevron, as SVG markup (Hugeicons ArrowLeft01, mirrored in RTL). */
export const topBarBackIcon = /* @__PURE__ */ iconSvg(ArrowLeft01Icon, { directional: true });
