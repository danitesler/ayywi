import { cx } from "../../lib/cx";

export const hoverActionsPositions = ["top-start", "top-end", "bottom-start", "bottom-end"] as const;
export type HoverActionsPosition = (typeof hoverActionsPositions)[number];

export interface HoverActionsClassOptions {
  /** Corner of the positioned parent to float in. Without one the actions sit in the normal flow. */
  position?: HoverActionsPosition;
  /** One glass bar for all the buttons instead of a frosted background on each. */
  group?: boolean;
  /** Hidden until the parent is hovered or focused (always shown on touch screens). */
  reveal?: boolean;
  className?: string;
}

export function hoverActionsClass({ position, group = false, reveal = false, className }: HoverActionsClassOptions = {}): string {
  return cx(
    "ayy-hover-actions",
    position && `ayy-hover-actions--${position}`,
    group && "ayy-hover-actions--group",
    reveal && "ayy-hover-actions--reveal",
    className,
  );
}

export function hoverActionClass({ className }: { className?: string } = {}): string {
  return cx("ayy-hover-action", className);
}
