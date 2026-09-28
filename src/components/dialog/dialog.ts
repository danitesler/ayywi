import { cx } from "../../lib/cx";

export const dialogSizes = ["sm", "md", "lg", "xl"] as const;
export type DialogSize = (typeof dialogSizes)[number];

export interface DialogClassOptions {
  size?: DialogSize;
  className?: string;
}

export function dialogClass({ size = "md", className }: DialogClassOptions = {}): string {
  return cx("ayy-dialog", size !== "md" && `ayy-dialog--${size}`, className);
}

/** True when a click on the <dialog> element landed on its ::backdrop (outside the box). */
export function isBackdropClick(dialog: HTMLDialogElement, event: { target: EventTarget | null; clientX: number; clientY: number }): boolean {
  if (event.target !== dialog) return false;
  const r = dialog.getBoundingClientRect();
  return event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom;
}

/** SVG markup for the close icon, for non-React renderers. */
export const dialogCloseIcon =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
