import { cx } from "../../lib/cx";

export const skeletonShapes = ["block", "text", "circle"] as const;
export type SkeletonShape = (typeof skeletonShapes)[number];

export interface SkeletonClassOptions {
  shape?: SkeletonShape;
  className?: string;
}

export function skeletonClass({ shape = "block", className }: SkeletonClassOptions = {}): string {
  return cx("ayy-skeleton", shape !== "block" && `ayy-skeleton--${shape}`, className);
}
