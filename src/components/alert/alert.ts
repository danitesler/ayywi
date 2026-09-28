import { cx } from "../../lib/cx";

export const alertVariants = ["default", "info", "success", "warning", "destructive"] as const;
export type AlertVariant = (typeof alertVariants)[number];

export interface AlertClassOptions {
  variant?: AlertVariant;
  className?: string;
}

export function alertClass({ variant = "default", className }: AlertClassOptions = {}): string {
  return cx("ayy-alert", variant !== "default" && `ayy-alert--${variant}`, className);
}

export const alertTitleClass = "ayy-alert__title";
export const alertDescriptionClass = "ayy-alert__description";
export const alertActionsClass = "ayy-alert__actions";
