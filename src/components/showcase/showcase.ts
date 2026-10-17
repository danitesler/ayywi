import { cx } from "../../lib/cx";

export const showcaseDevices = ["desktop", "tablet", "mobile"] as const;
export type ShowcaseDevice = (typeof showcaseDevices)[number];

export const showcaseClass = "ayy-showcase";
export const showcaseHeaderClass = "ayy-showcase__header";
export const showcaseTitleClass = "ayy-showcase__title";
export const showcaseActionsClass = "ayy-showcase__actions";
export const showcaseStageClass = "ayy-showcase__stage";
export const showcaseBodyClass = "ayy-showcase__body";

export function showcaseViewportClass({
  device = "desktop",
  className,
}: {
  device?: ShowcaseDevice;
  className?: string;
} = {}): string {
  return cx(
    "ayy-showcase__viewport",
    device && `ayy-showcase__viewport--${device}`,
    className
  );
}
