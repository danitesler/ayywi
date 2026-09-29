import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "../../lib/cx";
import { frameBarClass, frameBodyClass, frameClass, frameTitleClass } from "./frame";

export interface FrameProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Text in the address bar, e.g. "oktopost.com". */
  title?: ReactNode;
}

export const Frame = forwardRef<HTMLDivElement, FrameProps>(function Frame({ title, className, children, ...props }, ref) {
  return (
    <div ref={ref} className={cx(frameClass, className)} {...props}>
      <div className={frameBarClass}>{title ? <span className={frameTitleClass}>{title}</span> : null}</div>
      <div className={frameBodyClass}>{children}</div>
    </div>
  );
});
