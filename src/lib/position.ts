// Tiny floating-element positioner for top-layer popovers (menus, popovers, tooltips).
// Top-layer elements escape overflow clipping; this puts them next to their anchor, flips when there's no room,
// and keeps them inside the viewport. Logical sides/alignment follow the anchor's text direction.

export type FloatingSide = "top" | "bottom" | "start" | "end";
export type FloatingAlign = "start" | "center" | "end";

export interface PlaceBoundaryRect {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width?: number;
  height?: number;
}

export type PlaceBoundary = Element | PlaceBoundaryRect;

export interface PlaceOptions {
  side?: FloatingSide;
  align?: FloatingAlign;
  /** Gap between anchor and floating element, px. */
  offset?: number;
  /** Offset along the cross axis (e.g. alignment shift), px. */
  crossAxisOffset?: number;
  /** Minimum distance from the viewport / boundary edge, px. */
  padding?: number;
  /** Boundary to measure room and keep the floating element inside (defaults to viewport). */
  boundary?: PlaceBoundary;
}

type Physical = "top" | "bottom" | "left" | "right";
const OPPOSITE: Record<Physical, Physical> = { top: "bottom", bottom: "top", left: "right", right: "left" };

/** Position `floating` (must already be displayed, e.g. an open popover) next to `anchor`. Returns the side used. */
export function place(floating: HTMLElement, anchor: Element, options: PlaceOptions = {}): FloatingSide {
  const { side = "bottom", align = "center", offset = 6, crossAxisOffset = 0, padding = 8, boundary } = options;
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

  const bound = boundary
    ? "getBoundingClientRect" in boundary
      ? (boundary as Element).getBoundingClientRect()
      : (boundary as PlaceBoundaryRect)
    : {
        top: 0,
        left: 0,
        right: document.documentElement.clientWidth,
        bottom: document.documentElement.clientHeight,
      };

  const minX = bound.left + padding;
  const maxX = Math.max(minX, bound.right - f.width - padding);
  const minY = bound.top + padding;
  const maxY = Math.max(minY, bound.bottom - f.height - padding);

  const space: Record<Physical, number> = {
    top: a.top - minY,
    bottom: maxY + f.height - a.bottom,
    left: a.left - minX,
    right: maxX + f.width - a.right,
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
    x += rtl ? -crossAxisOffset : crossAxisOffset;
  } else {
    x = physical === "left" ? a.left - offset - f.width : a.right + offset;
    y = align === "center" ? a.top + (a.height - f.height) / 2 : align === "start" ? a.top : a.bottom - f.height;
    y += crossAxisOffset;
  }

  x = Math.min(Math.max(x, minX), maxX);
  y = Math.min(Math.max(y, minY), maxY);

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
