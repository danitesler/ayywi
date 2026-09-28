import { forwardRef, type HTMLAttributes } from "react";
import { skeletonClass, type SkeletonShape } from "./skeleton";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  shape?: SkeletonShape;
}

/** Decorative loading placeholder (aria-hidden). Mark the loading region with aria-busy="true". */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton({ shape, className, ...props }, ref) {
  return <div ref={ref} aria-hidden="true" className={skeletonClass({ shape, className })} {...props} />;
});
