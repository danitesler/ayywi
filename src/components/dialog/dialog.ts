import { cx } from "../../lib/cx";
import { Cancel01Icon } from "../../lib/icons";
import { iconSvg } from "../icon/icon";

export const dialogSizes = ["sm", "md", "lg", "xl"] as const;
export type DialogSize = (typeof dialogSizes)[number];
/** "center" is a regular modal; "start" and "end" make a side modal on that inline edge (end = right in LTR, left in RTL). */
export const dialogSides = ["center", "start", "end"] as const;
export type DialogSide = (typeof dialogSides)[number];

export interface DialogClassOptions {
  /** Width: 24, 32, 42 or 56rem. */
  size?: DialogSize;
  side?: DialogSide;
  className?: string;
}

export function dialogClass({ size = "md", side = "center", className }: DialogClassOptions = {}): string {
  return cx("ayy-dialog", size !== "md" && `ayy-dialog--${size}`, side !== "center" && `ayy-dialog--side-${side}`, className);
}

/** True when a click on the <dialog> element landed on its ::backdrop (outside the box). */
export function isBackdropClick(dialog: HTMLDialogElement, event: { target: EventTarget | null; clientX: number; clientY: number }): boolean {
  if (event.target !== dialog) return false;
  const r = dialog.getBoundingClientRect();
  return event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom;
}

/** SVG markup for the close icon (Hugeicons Cancel01), for non-React renderers. */
export const dialogCloseIcon = /* @__PURE__ */ iconSvg(Cancel01Icon);
