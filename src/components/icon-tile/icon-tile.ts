import { cx } from "../../lib/cx";

export const iconTileSizes = ["sm", "md", "lg"] as const;
export type IconTileSize = (typeof iconTileSizes)[number];

export interface IconTileClassOptions {
  /** 32px, 48px (default) or 64px. */
  size?: IconTileSize;
  className?: string;
}

export function iconTileClass({ size = "md", className }: IconTileClassOptions = {}): string {
  return cx("ayy-icon-tile", size !== "md" && `ayy-icon-tile--${size}`, className);
}
