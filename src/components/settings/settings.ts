import { cx } from "../../lib/cx";
import { ArrowRight01Icon } from "../../lib/icons";
import { iconSvg } from "../icon/icon";

export function settingsClass({ plain, className }: { plain?: boolean; className?: string } = {}): string {
  return cx("ayy-settings", plain && "ayy-settings--plain", className);
}

export function settingsRowClass({ stack, link, destructive, className }: { stack?: boolean; link?: boolean; destructive?: boolean; className?: string } = {}): string {
  return cx("ayy-settings__row", stack && "ayy-settings__row--stack", link && "ayy-settings__link", destructive && "ayy-settings__link--destructive", className);
}

/** The chevron at the end of a link row, as SVG markup (Hugeicons ArrowRight01, mirrored in RTL). */
export const settingsChevronIcon = /* @__PURE__ */ iconSvg(ArrowRight01Icon, { directional: true });
