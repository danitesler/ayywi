import { cx } from "../../lib/cx";
import { PlayIcon } from "../../lib/icons";
import { iconSvg } from "../icon/icon";

export function viewCardClass({ className }: { className?: string } = {}): string {
  return cx("ayy-view-card", className);
}

/** The play glyph a View card's __play badge shows, as SVG markup for templates. */
export const viewCardPlayIcon = iconSvg(PlayIcon, { size: "sm" });
