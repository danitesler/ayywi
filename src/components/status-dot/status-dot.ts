import { cx } from "../../lib/cx";

export const statusDotVariants = ["neutral", "success", "warning", "destructive", "info"] as const;
export type StatusDotVariant = (typeof statusDotVariants)[number];

export const statusDotSizes = ["sm", "md", "lg"] as const;
export type StatusDotSize = (typeof statusDotSizes)[number];

export interface StatusDotClassOptions {
  variant?: StatusDotVariant;
  size?: StatusDotSize;
  pulse?: boolean;
  className?: string;
}

export function statusDotClass({
  variant = "neutral",
  size = "md",
  pulse = false,
  className,
}: StatusDotClassOptions = {}): string {
  return cx(
    "ayy-status-dot",
    variant && `ayy-status-dot--${variant}`,
    size !== "md" && `ayy-status-dot--${size}`,
    pulse && "ayy-status-dot--pulse",
    className,
  );
}
