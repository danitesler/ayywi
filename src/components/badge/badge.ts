import { cx } from "../../lib/cx";

export const badgeVariants = ["default", "muted", "outline", "success", "warning", "destructive", "info", "ai"] as const;
export type BadgeVariant = (typeof badgeVariants)[number];

export const badgeSizes = ["sm", "md", "lg"] as const;
export type BadgeSize = (typeof badgeSizes)[number];

export interface BadgeClassOptions {
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

export function badgeClass({ variant = "default", size = "md", className }: BadgeClassOptions = {}): string {
  return cx("ayy-badge", variant !== "default" && `ayy-badge--${variant}`, size !== "md" && `ayy-badge--${size}`, className);
}
