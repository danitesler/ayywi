import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";
import { Tooltip } from "../tooltip/tooltip.react";
import type { TooltipSide } from "../tooltip/tooltip";
import { hoverActionClass, hoverActionsClass, type HoverActionsPosition } from "./hover-actions";

export interface HoverActionsProps extends HTMLAttributes<HTMLDivElement> {
  /** Corner of the positioned parent to float in. Without one the actions sit in the normal flow. */
  position?: HoverActionsPosition;
  /** One glass bar for all the buttons instead of a frosted background on each. */
  group?: boolean;
  /** Hidden until the parent is hovered or focused (always shown on touch screens). */
  reveal?: boolean;
}

export const HoverActions = forwardRef<HTMLDivElement, HoverActionsProps>(function HoverActions(
  { position, group = false, reveal = false, className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={hoverActionsClass({ position, group, reveal, className })} {...props}>
      {children}
    </div>
  );
});

export interface HoverActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** What the button does. Its accessible name and, unless tooltip is false, its tooltip. */
  label: string;
  /** Extra tooltip content after the label, such as <Shortcut keys="Mod+C" />. */
  hint?: ReactNode;
  /** false: no ayywi tooltip (the label is still the accessible name). */
  tooltip?: boolean;
  /** Tooltip side. Default "bottom" for buttons along a top edge reads best over pictures. */
  side?: TooltipSide;
  /** The icon. */
  children: ReactNode;
}

export const HoverAction = forwardRef<HTMLButtonElement, HoverActionProps>(function HoverAction(
  { label, hint, tooltip = true, side = "bottom", className, children, type = "button", ...props },
  ref,
) {
  const button = (
    <button ref={ref} type={type} className={hoverActionClass({ className })} aria-label={label} {...props}>
      {children}
    </button>
  );
  if (!tooltip) return button;
  return (
    <Tooltip
      side={side}
      content={
        hint ? (
          <>
            {label} {hint}
          </>
        ) : (
          label
        )
      }
    >
      {button}
    </Tooltip>
  );
});
