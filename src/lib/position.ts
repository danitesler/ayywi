// Tiny floating-element positioner for top-layer popovers (menus, popovers, tooltips).
// Top-layer elements escape overflow clipping; this puts them next to their anchor, flips when there's no room,
// and keeps them inside the viewport. Logical sides/alignment follow the anchor's text direction.

export type FloatingSide = "top" | "bottom" | "start" | "end";
export type FloatingAlign = "start" | "center" | "end";

export interface PlaceOptions {
  side?: FloatingSide;
  align?: FloatingAlign;
  /** Gap between anchor and floating element, px. */
  offset?: number;
  /** Minimum distance from the viewport edge, px. */
  padding?: number;
}

type Physical = "top" | "bottom" | "left" | "right";
const OPPOSITE: Record<Physical, Physical> = { top: "bottom", bottom: "top", left: "right", right: "left" };

/** Position `floating` (must already be displayed, e.g. an open popover) next to `anchor`. Returns the side used. */
export function place(floating: HTMLElement, anchor: Element, options: PlaceOptions = {}): FloatingSide {
  const { side = "bottom", align = "center", offset = 6, padding = 8 } = options;
  const rtl = getComputedStyle(anchor).direction === "rtl";
  const toPhysical = (s: FloatingSide): Physical =>
    s === "start" ? (rtl ? "right" : "left") : s === "end" ? (rtl ? "left" : "right") : s;
  const toLogical = (p: Physical): FloatingSide =>
    p === "top" || p === "bottom" ? p : (p === "left") !== rtl ? "start" : "end";

  floating.style.position = "fixed";
  floating.style.inset = "auto";
  floating.style.margin = "0";
  floating.style.translate = "none";

  const a = anchor.getBoundingClientRect();
  // Layout size, not getBoundingClientRect(): entry animations scale the element while we measure.
  const f = { width: floating.offsetWidth, height: floating.offsetHeight };
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;

  const space: Record<Physical, number> = {
    top: a.top - padding,
    bottom: vh - a.bottom - padding,
    left: a.left - padding,
    right: vw - a.right - padding,
  };
  let physical = toPhysical(side);
  const needed = physical === "top" || physical === "bottom" ? f.height + offset : f.width + offset;
  if (space[physical] < needed && space[OPPOSITE[physical]] > space[physical]) physical = OPPOSITE[physical];

  let x: number;
  let y: number;
  if (physical === "top" || physical === "bottom") {
    y = physical === "top" ? a.top - offset - f.height : a.bottom + offset;
    const startEdge = rtl ? a.right - f.width : a.left;
    const endEdge = rtl ? a.left : a.right - f.width;
    x = align === "center" ? a.left + (a.width - f.width) / 2 : align === "start" ? startEdge : endEdge;
  } else {
    x = physical === "left" ? a.left - offset - f.width : a.right + offset;
    y = align === "center" ? a.top + (a.height - f.height) / 2 : align === "start" ? a.top : a.bottom - f.height;
  }

  x = Math.min(Math.max(x, padding), Math.max(padding, vw - f.width - padding));
  y = Math.min(Math.max(y, padding), Math.max(padding, vh - f.height - padding));

  floating.style.left = `${Math.round(x)}px`;
  floating.style.top = `${Math.round(y)}px`;
  const logical = toLogical(physical);
  floating.setAttribute("data-placement", logical);
  return logical;
}

/** Keep `floating` placed while the page scrolls or resizes. Returns a cleanup function. */
export function autoPlace(floating: HTMLElement, anchor: Element, options: PlaceOptions = {}): () => void {
  let frame = 0;
  const update = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => place(floating, anchor, options));
  };
  place(floating, anchor, options);
  window.addEventListener("scroll", update, { capture: true, passive: true });
  window.addEventListener("resize", update, { passive: true });
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("scroll", update, { capture: true });
    window.removeEventListener("resize", update);
  };
}

/** Popover API available? (Baseline 2024; older browsers fall back to non-top-layer rendering.) */
export function supportsPopover(): boolean {
  return typeof HTMLElement !== "undefined" && "showPopover" in HTMLElement.prototype;
}
