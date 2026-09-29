import { cx } from "../../lib/cx";

export const separatorOrientations = ["horizontal", "vertical"] as const;
export type SeparatorOrientation = (typeof separatorOrientations)[number];

export interface SeparatorClassOptions {
  orientation?: SeparatorOrientation;
  /** Fade out at both ends. */
  fade?: boolean;
  className?: string;
}

export function separatorClass({ orientation = "horizontal", fade, className }: SeparatorClassOptions = {}): string {
  return cx("ayy-separator", orientation === "vertical" && "ayy-separator--vertical", fade && "ayy-separator--fade", className);
}
