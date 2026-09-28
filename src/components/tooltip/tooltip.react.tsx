import { cloneElement, isValidElement, useEffect, useId, useRef, type HTMLAttributes, type ReactElement, type ReactNode } from "react";
import { cx } from "../../lib/cx";
import { enhanceTooltip, tooltipClass, tooltipContentClass, type TooltipSide } from "./tooltip";

export interface TooltipProps extends Omit<HTMLAttributes<HTMLSpanElement>, "content"> {
  /** Tooltip text. Keep it short; it's a hint, not content. */
  content: ReactNode;
  side?: TooltipSide;
  /** A single focusable element (Button, link…). It gets aria-describedby automatically. */
  children: ReactElement<{ "aria-describedby"?: string }>;
}

/** Shows on hover and focus, Esc dismisses it. Renders in the top layer, so it can't be clipped. */
export function Tooltip({ content, side = "top", className, children, ...props }: TooltipProps) {
  const id = useId();
  const hostRef = useRef<HTMLSpanElement>(null);

  useEffect(() => (hostRef.current ? enhanceTooltip(hostRef.current) : undefined), []);

  return (
    <span ref={hostRef} className={cx(tooltipClass, className)} {...props}>
      {isValidElement(children) ? cloneElement(children, { "aria-describedby": cx(children.props["aria-describedby"], id) }) : children}
      <span role="tooltip" id={id} className={tooltipContentClass} data-side={side}>
        {content}
      </span>
    </span>
  );
}
