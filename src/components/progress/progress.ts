import { cx } from "../../lib/cx";

export const progressVariants = ["default", "success", "warning", "destructive", "ai"] as const;
export type ProgressVariant = (typeof progressVariants)[number];
/** @deprecated Use progressVariants (same values). */
export const progressTones = progressVariants;
/** @deprecated Use ProgressVariant. */
export type ProgressTone = ProgressVariant;
export const progressSizes = ["sm", "md", "lg"] as const;
export type ProgressSize = (typeof progressSizes)[number];

export interface ProgressClassOptions {
  variant?: ProgressVariant;
  /** @deprecated Use variant (the name Alert, Badge and Toast use). */
  tone?: ProgressVariant;
  size?: ProgressSize;
  indeterminate?: boolean;
  className?: string;
}

export function progressClass({ variant, tone, size = "md", indeterminate, className }: ProgressClassOptions = {}): string {
  const colour = variant ?? tone ?? "default";
  return cx(
    "ayy-progress",
    colour !== "default" && `ayy-progress--${colour}`,
    size !== "md" && `ayy-progress--${size}`,
    indeterminate && "ayy-progress--indeterminate",
    className,
  );
}
