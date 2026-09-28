import { cx } from "../../lib/cx";

export const badgeVariants = ["default", "muted", "outline", "success", "warning", "destructive", "info", "ai"] as const;
export type BadgeVariant = (typeof badgeVariants)[number];

export interface BadgeClassOptions {
  variant?: BadgeVariant;
  className?: string;
}

export function badgeClass({ variant = "default", className }: BadgeClassOptions = {}): string {
  return cx("ayy-badge", variant !== "default" && `ayy-badge--${variant}`, className);
}
