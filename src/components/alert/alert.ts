import { cx } from "../../lib/cx";

export const alertVariants = ["default", "info", "success", "warning", "destructive"] as const;
export type AlertVariant = (typeof alertVariants)[number];

export const alertSizes = ["sm", "md", "lg"] as const;
export type AlertSize = (typeof alertSizes)[number];

export interface AlertClassOptions {
  variant?: AlertVariant;
  size?: AlertSize;
  className?: string;
}

export function alertClass({ variant = "default", size = "md", className }: AlertClassOptions = {}): string {
  return cx("ayy-alert", variant !== "default" && `ayy-alert--${variant}`, size !== "md" && `ayy-alert--${size}`, className);
}

export const alertTitleClass = "ayy-alert__title";
export const alertDescriptionClass = "ayy-alert__description";
export const alertActionsClass = "ayy-alert__actions";
