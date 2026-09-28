import { cx } from "../../lib/cx";

export const progressTones = ["default", "success", "warning", "destructive", "ai"] as const;
export type ProgressTone = (typeof progressTones)[number];
export const progressSizes = ["sm", "md", "lg"] as const;
export type ProgressSize = (typeof progressSizes)[number];

export interface ProgressClassOptions {
  tone?: ProgressTone;
  size?: ProgressSize;
  indeterminate?: boolean;
  className?: string;
}

export function progressClass({ tone = "default", size = "md", indeterminate, className }: ProgressClassOptions = {}): string {
  return cx(
    "ayy-progress",
    tone !== "default" && `ayy-progress--${tone}`,
    size !== "md" && `ayy-progress--${size}`,
    indeterminate && "ayy-progress--indeterminate",
    className,
  );
}
