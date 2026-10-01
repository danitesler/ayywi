import { cx } from "../../lib/cx";

export const segmentedControlSizes = ["sm", "md"] as const;
export type SegmentedControlSize = (typeof segmentedControlSizes)[number];

export interface SegmentedControlClassOptions {
  size?: SegmentedControlSize;
  /** Fill the container with equal segments. */
  full?: boolean;
  className?: string;
}

export function segmentedControlClass({ size = "md", full, className }: SegmentedControlClassOptions = {}): string {
  return cx("ayy-segmented-control", size !== "md" && `ayy-segmented-control--${size}`, full && "ayy-segmented-control--full", className);
}

export const segmentedControlOptionClass = "ayy-segmented-control__option";
