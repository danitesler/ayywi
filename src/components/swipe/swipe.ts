import { cx } from "../../lib/cx";

export const swipeActionVariants = ["default", "primary", "success", "warning", "info", "destructive"] as const;
export type SwipeActionVariant = (typeof swipeActionVariants)[number];

export function swipeActionClass({ variant = "default", className }: { variant?: SwipeActionVariant; className?: string } = {}): string {
  return cx("ayy-swipe__action", variant !== "default" && `ayy-swipe__action--${variant}`, className);
}

export type SwipeSide = "start" | "end";

export interface SwipeControllerOptions {
  /** Called when a tray opens ("start" / "end") or the row closes (null). */
  onOpenChange?: (side: SwipeSide | null) => void;
}

export interface SwipeController {
  open(side: SwipeSide): void;
  close(): void;
  destroy(): void;
}

/** How far a finger moves before the row decides it's a swipe (or a scroll). */
const SLOP = 8;

/**
 * Make an .ayy-swipe row slide: drag the .ayy-swipe__content sideways (touch, pen or mouse) to show the tray on that
 * side; let go past half a tray and it stays open, else it slides back. A tap on the open row, a tap elsewhere, Esc,
 * or running an action closes it. Vertical drags are left to the page's scrolling. Framework-free; used by React
 * Swipe and <ayy-swipe>.
 */
export function connectSwipe(row: HTMLElement, options: SwipeControllerOptions = {}): SwipeController {
  const content = row.querySelector<HTMLElement>(":scope > .ayy-swipe__content");
  if (!content) return { open() {}, close() {}, destroy() {} };
  const tray = (side: SwipeSide) => row.querySelector<HTMLElement>(`:scope > .ayy-swipe__actions--${side}`);
  const width = (side: SwipeSide) => tray(side)?.offsetWidth ?? 0;
  const rtl = () => getComputedStyle(row).direction === "rtl";

  let x = 0;
  let side: SwipeSide | null = null;
  let start: { id: number; x: number; y: number; base: number } | null = null;
  let dragging = false;
  let suppressClick = false;

  const setX = (next: number) => {
    x = next;
    row.style.setProperty("--_x", `${Math.round(next)}px`);
  };

  const setSide = (next: SwipeSide | null) => {
    setX(next === "start" ? width("start") : next === "end" ? -width("end") : 0);
    if (next) row.dataset.open = next;
    else delete row.dataset.open;
    if (next !== side) {
      side = next;
      options.onOpenChange?.(next);
    }
  };

  const onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0 || start) return;
    start = { id: event.pointerId, x: event.clientX, y: event.clientY, base: x };
    dragging = false;
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!start || event.pointerId !== start.id) return;
    const dx = (event.clientX - start.x) * (rtl() ? -1 : 1);
    const dy = event.clientY - start.y;
    if (!dragging) {
      if (Math.abs(dy) > SLOP && Math.abs(dy) > Math.abs(dx)) {
        start = null;
        return;
      }
      if (Math.abs(dx) <= SLOP) return;
      dragging = true;
      row.dataset.dragging = "";
      content.setPointerCapture?.(event.pointerId);
    }
    let next = start.base + dx;
    const max = width("start");
    const min = -width("end");
    // Past a tray's width (or with no tray on that side), the row resists.
    if (next > max) next = max + (next - max) * 0.25;
    if (next < min) next = min + (next - min) * 0.25;
    setX(next);
  };

  const onPointerUp = (event: PointerEvent) => {
    if (!start || event.pointerId !== start.id) return;
    start = null;
    if (!dragging) return;
    dragging = false;
    delete row.dataset.dragging;
    suppressClick = true;
    setTimeout(() => (suppressClick = false), 0);
    const startW = width("start");
    const endW = width("end");
    setSide(startW && x > startW / 2 ? "start" : endW && x < -endW / 2 ? "end" : null);
  };

  // A drag doesn't click what's under the finger; a tap on the open row closes it instead of opening the item.
  const onContentClick = (event: MouseEvent) => {
    if (!suppressClick && !side) return;
    event.preventDefault();
    event.stopPropagation();
    if (suppressClick) suppressClick = false;
    else setSide(null);
  };

  // Running an action closes the row after the action's own handlers.
  const onActionClick = (event: MouseEvent) => {
    if ((event.target as Element).closest(".ayy-swipe__action")) setTimeout(() => setSide(null), 0);
  };

  const onDocPointerDown = (event: PointerEvent) => {
    if (side && !row.contains(event.target as Node)) setSide(null);
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && side) {
      setSide(null);
      content.focus?.();
    }
  };

  content.addEventListener("pointerdown", onPointerDown);
  content.addEventListener("pointermove", onPointerMove);
  content.addEventListener("pointerup", onPointerUp);
  content.addEventListener("pointercancel", onPointerUp);
  content.addEventListener("click", onContentClick, true);
  row.addEventListener("click", onActionClick);
  row.addEventListener("keydown", onKeyDown);
  document.addEventListener("pointerdown", onDocPointerDown);

  return {
    open: (s) => setSide(s),
    close: () => setSide(null),
    destroy() {
      content.removeEventListener("pointerdown", onPointerDown);
      content.removeEventListener("pointermove", onPointerMove);
      content.removeEventListener("pointerup", onPointerUp);
      content.removeEventListener("pointercancel", onPointerUp);
      content.removeEventListener("click", onContentClick, true);
      row.removeEventListener("click", onActionClick);
      row.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onDocPointerDown);
    },
  };
}
