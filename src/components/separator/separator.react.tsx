import { forwardRef, type HTMLAttributes } from "react";
import { separatorClass, type SeparatorOrientation } from "./separator";

export interface SeparatorProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: SeparatorOrientation;
  /** Fade out at both ends. */
  fade?: boolean;
}

export const Separator = forwardRef<HTMLHRElement, SeparatorProps>(function Separator(
  { orientation = "horizontal", fade, className, ...props },
  ref,
) {
  return (
    <hr
      ref={ref}
      className={separatorClass({ orientation, fade, className })}
      aria-orientation={orientation === "vertical" ? "vertical" : undefined}
      {...props}
    />
  );
});
