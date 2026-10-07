import { cx } from "../../lib/cx";

export const fabVariants = ["primary", "secondary"] as const;
export type FabVariant = (typeof fabVariants)[number];
export const fabSizes = ["sm", "md"] as const;
export type FabSize = (typeof fabSizes)[number];

export interface FabClassOptions {
  variant?: FabVariant;
  size?: FabSize;
  /** Icon and a label: a wider pill. */
  extended?: boolean;
  /** Not floating: placed by its container. */
  inline?: boolean;
  className?: string;
}

export function fabClass({ variant = "primary", size = "md", extended, inline, className }: FabClassOptions = {}): string {
  return cx(
    "ayy-fab",
    variant !== "primary" && `ayy-fab--${variant}`,
    size !== "md" && `ayy-fab--${size}`,
    extended && "ayy-fab--extended",
    inline && "ayy-fab--inline",
    className,
  );
}
