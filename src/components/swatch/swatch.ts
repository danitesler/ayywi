import { cx } from "../../lib/cx";

export const swatchSizes = ["sm", "md", "lg"] as const;
export type SwatchSize = (typeof swatchSizes)[number];

export interface SwatchClassOptions {
  size?: SwatchSize;
  /** "No colour": the surface with a diagonal stroke. */
  none?: boolean;
  /** Any colour: wraps an <input type="color">. */
  custom?: boolean;
  className?: string;
}

export function swatchClass({ size = "md", none, custom, className }: SwatchClassOptions = {}): string {
  return cx("ayy-swatch", size !== "md" && `ayy-swatch--${size}`, none && "ayy-swatch--none", custom && "ayy-swatch--custom", className);
}

export function swatchGroupClass({ track, className }: { track?: boolean; className?: string } = {}): string {
  return cx("ayy-swatch-group", track && "ayy-swatch-group--track", className);
}

/** Show a custom swatch's picked colour: sets --ayy-swatch on the .ayy-swatch--custom around an <input type="color">. */
export function syncSwatch(input: HTMLInputElement): void {
  const swatch = input.closest<HTMLElement>(".ayy-swatch--custom");
  if (swatch && input.type === "color") swatch.style.setProperty("--ayy-swatch", input.value);
}
