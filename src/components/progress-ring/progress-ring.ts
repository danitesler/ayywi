import { cx } from "../../lib/cx";
import type { ProgressVariant } from "../progress/progress";

export const progressRingSizes = ["sm", "md", "lg", "xl"] as const;
export type ProgressRingSize = (typeof progressRingSizes)[number];

export function progressRingClass({ variant = "default", size = "md", indeterminate, className }: { variant?: ProgressVariant; size?: ProgressRingSize; indeterminate?: boolean; className?: string } = {}): string {
  return cx(
    "ayy-progress-ring",
    variant !== "default" && `ayy-progress-ring--${variant}`,
    size !== "md" && `ayy-progress-ring--${size}`,
    indeterminate && "ayy-progress-ring--indeterminate",
    className,
  );
}

/** The ring's SVG (track and fill), as markup to put first inside .ayy-progress-ring. */
export const progressRingSvg =
  '<svg class="ayy-progress-ring__svg" viewBox="0 0 36 36" aria-hidden="true">' +
  '<circle class="ayy-progress-ring__track" cx="18" cy="18" r="16" pathLength="100"></circle>' +
  '<circle class="ayy-progress-ring__bar" cx="18" cy="18" r="16" pathLength="100"></circle></svg>';
