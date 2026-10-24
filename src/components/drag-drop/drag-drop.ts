import { cx } from "../../lib/cx";
import { DragDropVerticalIcon } from "../../lib/icons";
import { iconSvg } from "../icon/icon";

export const draggableClass = "ayy-draggable";
export const dragHandleClass = "ayy-drag-handle";
export const dragPreviewClass = "ayy-drag-preview";
export const dropTargetClass = "ayy-drop-target";
export const sortableClass = "ayy-sortable";
export const sortableItemClass = "ayy-sortable__item";

export const dragOrientations = ["vertical", "horizontal"] as const;
export type DragOrientation = (typeof dragOrientations)[number];

/** What a drop target says to the person dragging: it would take the item (ready), the item is over it (over), or it refuses it (reject). */
export const dropStates = ["ready", "over", "reject"] as const;
export type DropState = (typeof dropStates)[number];

/** The side of an item the dragged one will land on, drawn as a line. Logical, so it mirrors in RTL. */
export const dropEdges = ["block-start", "block-end", "inline-start", "inline-end"] as const;
export type DropEdge = (typeof dropEdges)[number];

export function sortableClassName({ orientation, className }: { orientation?: DragOrientation; className?: string } = {}): string {
  return cx(sortableClass, orientation === "horizontal" && "ayy-sortable--horizontal", className);
}

/** The six-dot grip, as SVG markup (Hugeicons DragDropVertical), for a .ayy-drag-handle button. */
export const dragHandleIcon = /* @__PURE__ */ iconSvg(DragDropVerticalIcon);

/**
 * The default for DragDropOptions.accepts: an area with data-accepts="bug feature" takes only items whose data-type is
 * in that list; an area without data-accepts takes everything.
 */
export function dropAccepts(item: HTMLElement, area: HTMLElement): boolean {
  const accepted = area.dataset.accepts;
  if (!accepted) return true;
  const type = item.dataset.type;
  return !!type && accepted.split(/[\s,]+/).includes(type);
}

/** Set or clear a drop target's state (data-drop). */
export function setDropState(target: Element, state: DropState | null): void {
  if (state) {
    if (target.getAttribute("data-drop") !== state) target.setAttribute("data-drop", state);
  } else target.removeAttribute("data-drop");
}

/** Set or clear the line showing where a dragged item will land (data-drop-edge). */
export function setDropEdge(item: Element, edge: DropEdge | null): void {
  if (edge) {
    if (item.getAttribute("data-drop-edge") !== edge) item.setAttribute("data-drop-edge", edge);
  } else item.removeAttribute("data-drop-edge");
}

/** A small floating label to carry along instead of a copy of the item (a table column's name, say). */
export function dragPreviewChip(label: string): HTMLElement {
  const chip = document.createElement("div");
  chip.className = `${dragPreviewClass} ${dragPreviewClass}--chip`;
  chip.textContent = label;
  return chip;
}

let live: HTMLElement | null = null;
let liveTimer = 0;

/** Say something to screen readers (a polite live region, made on first use). */
export function announce(text: string): void {
  if (typeof document === "undefined") return;
  if (!live || !live.isConnected) {
    live = document.createElement("div");
    live.className = "ayy-sr-only";
    live.setAttribute("role", "status");
    live.setAttribute("aria-live", "polite");
    document.body.append(live);
  }
  const region = live;
  region.textContent = "";
  window.clearTimeout(liveTimer);
  liveTimer = window.setTimeout(() => (region.textContent = text), 40);
}

export interface DragMove {
  /** The item that moved. */
  item: HTMLElement;
  /** The area it left and the one it landed in (the same element when it was only reordered). */
  from: HTMLElement;
  to: HTMLElement;
  /** Where it was in `from`, and where it lands in `to` counting the other items only (what Array.splice wants after removing it). */
  fromIndex: number;
  toIndex: number;
  /** data-id of the item and the areas, when they have one. */
  itemId: string | undefined;
  fromId: string | undefined;
  toId: string | undefined;
}

export interface DragDropOptions {
  /** CSS selector for the items that can be picked up, inside the root. Default ".ayy-draggable". */
  items?: string;
  /** CSS selector, inside an item, for the part that starts a drag (a .ayy-drag-handle). Default: the whole item. */
  handle?: string;
  /**
   * CSS selector for the areas items can be dropped in, inside the root: a board's columns, a list of folders. They
   * show data-drop while something is dragged. Default: the root is the only area, so items reorder inside it.
   */
  areas?: string;
  /** The way items line up in an area. Default "vertical". */
  orientation?: DragOrientation;
  /** Can this item go in that area? Default: dropAccepts (the area's data-accepts against the item's data-type). An area that says no shows data-drop="reject" under the pointer. */
  accepts?: (item: HTMLElement, area: HTMLElement) => boolean;
  /** Can this item be picked up? Default: yes. */
  canDrag?: (item: HTMLElement) => boolean;
  /** Can an item land right before or after this one? Default: yes. Say no for a pinned item. */
  canDropOn?: (item: HTMLElement) => boolean;
  /** Move the element in the DOM when it's dropped. Default true; pass false when a framework renders the list (React), and reorder your own state in onMove. */
  moveDom?: boolean;
  /** Called after a drop (or an Alt/arrow key move). */
  onMove?: (move: DragMove) => void;
  /** Replaces the default DOM move (the item before or after its neighbour), e.g. to move a table column's cells. Only used when moveDom isn't false. */
  applyMove?: (move: DragMove) => void;
  /** The element that follows the pointer. Default: a copy of the item. */
  preview?: (item: HTMLElement) => HTMLElement;
  /** The item's name for screen readers. Default: its aria-label, else its text. */
  describe?: (item: HTMLElement) => string;
  /** Mark the item being dragged. Default: data-dragging on it. */
  markItem?: (item: HTMLElement, dragging: boolean) => void;
  /** Draw the drop line. Default: data-drop-edge on the neighbour. */
  markEdge?: (item: HTMLElement, edge: DropEdge | null) => void;
  /** Where a drag may not start (CSS selector). Default: text fields, contenteditable and separators (resize handles). */
  ignore?: string;
  /** Keys that move a focused item: with a `handle`, the handle takes the plain arrow keys; otherwise hold Alt. */
  keyboard?: boolean;
}

const THRESHOLD = 4;
const SCROLL_EDGE = 48;
const SCROLL_SPEED = 14;
const DEFAULT_IGNORE = 'input, textarea, select, [contenteditable="true"], [role="separator"]';

const rtl = (el: Element) => getComputedStyle(el).direction === "rtl";

function nearestScroller(el: Element): Element {
  for (let node = el.parentElement; node; node = node.parentElement) {
    const style = getComputedStyle(node);
    const scrolls = /(auto|scroll|overlay)/.test(`${style.overflowX} ${style.overflowY}`);
    if (scrolls && (node.scrollWidth > node.clientWidth || node.scrollHeight > node.clientHeight)) return node;
  }
  return document.scrollingElement ?? document.documentElement;
}

const nameOf = (item: HTMLElement) => (item.getAttribute("aria-label") ?? item.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 60);

function defaultPreview(item: HTMLElement): HTMLElement {
  const rect = item.getBoundingClientRect();
  const copy = item.cloneNode(true) as HTMLElement;
  copy.removeAttribute("id");
  copy.removeAttribute("data-dragging");
  copy.removeAttribute("data-drop-edge");
  for (const el of Array.from(copy.querySelectorAll("[id]"))) el.removeAttribute("id");
  copy.classList.add(dragPreviewClass);
  copy.style.inlineSize = `${rect.width}px`;
  copy.style.blockSize = `${rect.height}px`;
  return copy;
}

/**
 * Drag items with the pointer to reorder them, or to move them between areas, and show where they will land: the
 * item being dragged is marked (data-dragging), a copy follows the pointer (.ayy-drag-preview), areas that would take
 * it show data-drop="ready", the one under the pointer "over" (or "reject" when it refuses), and the neighbour the
 * item will land beside gets a line (data-drop-edge). Keyboard: a focused .ayy-drag-handle takes the arrow keys
 * (along the list to reorder, across to change area), any other item takes Alt + arrows; each move is read out.
 * Pointer based, so it works with touch on a handle (give it touch-action: none, which .ayy-drag-handle does).
 * Delegated from `root`, so items added later work too. Returns a cleanup. Used by <ayy-drag-drop>, React Sortable
 * and DragDropArea, and the table's column reordering.
 */
export function connectDragDrop(root: HTMLElement, options: DragDropOptions = {}): { destroy(): void; wasDragged(): boolean } {
  const itemSel = options.items ?? `.${draggableClass}`;
  const orientation = options.orientation ?? "vertical";
  const ignore = options.ignore ?? DEFAULT_IGNORE;
  const horizontal = orientation === "horizontal";

  const areaOf = (el: Element): HTMLElement | null => {
    if (!options.areas) return root;
    const area = el.closest<HTMLElement>(options.areas);
    return area && root.contains(area) ? area : null;
  };
  const areas = () => (options.areas ? Array.from(root.querySelectorAll<HTMLElement>(options.areas)) : [root]);
  const itemsOf = (area: HTMLElement) => Array.from(area.querySelectorAll<HTMLElement>(itemSel)).filter((el) => areaOf(el) === area);
  const accepts = (item: HTMLElement, area: HTMLElement) => (options.accepts ?? dropAccepts)(item, area);
  const cannotDrag = (item: HTMLElement) => item.getAttribute("aria-disabled") === "true" || options.canDrag?.(item) === false;
  const markItem = (item: HTMLElement, on: boolean) => {
    if (options.markItem) options.markItem(item, on);
    else if (on) item.setAttribute("data-dragging", "");
    else item.removeAttribute("data-dragging");
  };
  const markEdge = (item: HTMLElement, edge: DropEdge | null) => (options.markEdge ? options.markEdge(item, edge) : setDropEdge(item, edge));
  const edgeFor = (before: boolean): DropEdge => (horizontal ? (before ? "inline-start" : "inline-end") : before ? "block-start" : "block-end");

  type Drop = { area: HTMLElement; toIndex: number; edgeItem: HTMLElement | null; edge: DropEdge | null; state: DropState | null; valid: boolean; rejected: boolean };
  let pending: { item: HTMLElement; x: number; y: number; offX: number; offY: number } | null = null;
  let drag: {
    item: HTMLElement;
    from: HTMLElement;
    fromIndex: number;
    preview: HTMLElement;
    offX: number;
    offY: number;
    x: number;
    y: number;
    scroller: Element;
    frame: number;
    drop: Drop | null;
    geometry: Map<HTMLElement, { items: HTMLElement[]; midpoints: number[]; flip: boolean }>;
    resize: ResizeObserver;
    mutations: MutationObserver;
  } | null = null;
  let dragged = false;
  let suppressUntil = 0;

  const clearDrop = () => {
    if (!drag?.drop) return;
    if (drag.drop.edgeItem) markEdge(drag.drop.edgeItem, null);
    if (options.areas) setDropState(drag.drop.area, accepts(drag.item, drag.drop.area) ? "ready" : null);
    drag.drop = null;
  };

  const place = () => {
    if (!drag) return;
    // Set transform directly: inherited custom properties invalidate the cloned item's descendants too.
    drag.preview.style.transform = `translate(${drag.x - drag.offX}px, ${drag.y - drag.offY}px) scale(1.02)`;
  };

  const findDrop = (): Drop | null => {
    if (!drag) return null;
    const { item, x, y, resize } = drag;
    let area: HTMLElement | null = root;
    if (options.areas) {
      const under = document.elementFromPoint(x, y);
      area = under ? areaOf(under) : null;
    }
    if (!area) return null;
    if (!accepts(item, area)) return { area, toIndex: 0, edgeItem: null, edge: null, state: "reject", valid: false, rejected: true };
    let geometry = drag.geometry.get(area);
    if (!geometry) {
      const items = itemsOf(area).filter((el) => el !== item);
      const midpoints = items.map((other) => {
        resize.observe(other);
        const rect = other.getBoundingClientRect();
        return horizontal ? rect.left + rect.width / 2 : rect.top + rect.height / 2;
      });
      geometry = { items, midpoints, flip: horizontal && rtl(area) };
      drag.geometry.set(area, geometry);
    }
    const { items: rest, midpoints, flip } = geometry;
    let slot = 0;
    const pointer = horizontal ? x : y;
    for (const mid of midpoints) {
      if (flip ? pointer < mid : pointer > mid) slot++;
    }
    const before = slot < rest.length;
    const edgeItem = rest.length ? rest[before ? slot : slot - 1] : null;
    const same = area === drag.from;
    const noop = same && slot === drag.fromIndex;
    const blocked = edgeItem ? options.canDropOn?.(edgeItem) === false : false;
    const valid = !noop && !blocked;
    return {
      area,
      toIndex: slot,
      edgeItem: valid ? edgeItem : null,
      edge: valid && edgeItem ? edgeFor(before) : null,
      state: options.areas ? (blocked ? "reject" : "over") : null,
      valid,
      rejected: blocked,
    };
  };

  const update = () => {
    if (!drag) return;
    const next = findDrop();
    const prev = drag.drop;
    if (prev && next && prev.area === next.area && prev.edgeItem === next.edgeItem && prev.edge === next.edge && prev.state === next.state && prev.valid === next.valid && prev.rejected === next.rejected) {
      prev.toIndex = next.toIndex;
      return;
    }
    clearDrop();
    drag.drop = next;
    drag.preview.toggleAttribute("data-invalid", !!next?.rejected);
    if (!next) return;
    if (next.state) setDropState(next.area, next.state);
    if (next.edgeItem && next.edge) markEdge(next.edgeItem, next.edge);
  };

  const tick = () => {
    if (!drag) return;
    drag.frame = 0;
    update();
    const { scroller, x, y } = drag;
    const box = scroller === document.scrollingElement ? { left: 0, top: 0, right: innerWidth, bottom: innerHeight } : scroller.getBoundingClientRect();
    let dx = 0;
    let dy = 0;
    if (horizontal || options.areas) dx = x < box.left + SCROLL_EDGE ? -SCROLL_SPEED : x > box.right - SCROLL_EDGE ? SCROLL_SPEED : 0;
    if (!horizontal || options.areas) dy = y < box.top + SCROLL_EDGE ? -SCROLL_SPEED : y > box.bottom - SCROLL_EDGE ? SCROLL_SPEED : 0;
    place();
    if (dx || dy) {
      const beforeX = scroller.scrollLeft;
      const beforeY = scroller.scrollTop;
      scroller.scrollBy(dx, dy);
      if (scroller.scrollLeft !== beforeX || scroller.scrollTop !== beforeY) invalidate();
    }
  };

  const schedule = () => {
    if (drag && !drag.frame) drag.frame = requestAnimationFrame(tick);
  };

  const invalidate = () => {
    drag?.geometry.clear();
    schedule();
  };

  const begin = (event: PointerEvent) => {
    if (!pending) return;
    const { item, offX, offY } = pending;
    const from = areaOf(item);
    if (!from) return;
    const parent = item.closest("dialog") ?? document.body;
    const preview = options.preview?.(item) ?? defaultPreview(item);
    preview.setAttribute("aria-hidden", "true");
    preview.setAttribute("inert", "");
    const direction = getComputedStyle(item).direction;
    if (direction === "rtl") preview.setAttribute("dir", "rtl");
    parent.append(preview);
    const chip = preview.classList.contains(`${dragPreviewClass}--chip`);
    drag = {
      item,
      from,
      fromIndex: itemsOf(from).indexOf(item),
      preview,
      offX: chip ? Math.min(offX, 16) : offX,
      offY: chip ? Math.min(offY, 16) : offY,
      x: event.clientX,
      y: event.clientY,
      scroller: nearestScroller(item),
      frame: 0,
      drop: null,
      geometry: new Map(),
      resize: new ResizeObserver(invalidate),
      mutations: new MutationObserver(invalidate),
    };
    dragged = true;
    document.documentElement.setAttribute("data-ayy-dragging", "");
    markItem(item, true);
    if (options.areas) {
      for (const area of areas()) {
        if (accepts(item, area)) setDropState(area, "ready");
      }
    }
    drag.resize.observe(root);
    if (options.areas) for (const area of areas()) drag.resize.observe(area);
    drag.mutations.observe(root, { childList: true, subtree: true, characterData: true });
    window.addEventListener("scroll", invalidate, true);
    window.addEventListener("resize", invalidate);
    schedule();
  };

  const finish = (commit: boolean) => {
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    window.removeEventListener("pointercancel", onPointerCancel);
    window.removeEventListener("keydown", onEscape, true);
    document.removeEventListener("selectstart", prevent);
    root.removeEventListener("dragstart", prevent);
    pending = null;
    if (!drag) return;
    const current = drag;
    drag = null;
    cancelAnimationFrame(current.frame);
    current.resize.disconnect();
    current.mutations.disconnect();
    window.removeEventListener("scroll", invalidate, true);
    window.removeEventListener("resize", invalidate);
    const drop = current.drop;
    if (drop?.edgeItem) markEdge(drop.edgeItem, null);
    for (const area of areas()) setDropState(area, null);
    markItem(current.item, false);
    current.preview.remove();
    document.documentElement.removeAttribute("data-ayy-dragging");
    suppressUntil = Date.now() + 60;
    window.setTimeout(() => (dragged = false), 60);
    if (commit && drop?.valid) {
      applyMove(current.item, current.from, drop.area, current.fromIndex, drop.toIndex);
    }
  };

  const applyMove = (item: HTMLElement, from: HTMLElement, to: HTMLElement, fromIndex: number, toIndex: number) => {
    const move: DragMove = {
      item,
      from,
      to,
      fromIndex,
      toIndex,
      itemId: item.dataset.id,
      fromId: from.dataset.id,
      toId: to.dataset.id,
    };
    if (options.moveDom !== false) {
      if (options.applyMove) options.applyMove(move);
      else {
        const rest = itemsOf(to).filter((el) => el !== item);
        const ref = rest[toIndex];
        if (ref) ref.before(item);
        else if (rest.length) rest[rest.length - 1].after(item);
        else to.append(item);
      }
    }
    options.onMove?.(move);
    announce(`${(options.describe ?? nameOf)(item)} moved to position ${toIndex + 1} of ${countOthers(to, item) + 1}`);
  };

  // The items in `area` besides `item`: a framework may not have re-rendered when we announce.
  const countOthers = (area: HTMLElement, item: HTMLElement) => itemsOf(area).filter((el) => el !== item).length;

  const prevent = (event: Event) => event.preventDefault();

  const onPointerMove = (event: PointerEvent) => {
    if (!pending && !drag) return;
    if (!drag) {
      if (!pending || Math.hypot(event.clientX - pending.x, event.clientY - pending.y) < THRESHOLD) return;
      begin(event);
    }
    if (!drag) return;
    drag.x = event.clientX;
    drag.y = event.clientY;
    event.preventDefault();
    schedule();
  };
  const onPointerUp = (event: PointerEvent) => {
    // A release can arrive before the queued frame; commit its position, not the previous frame's target.
    if (drag) {
      drag.x = event.clientX;
      drag.y = event.clientY;
      drag.geometry.clear();
      update();
    }
    finish(true);
  };
  const onPointerCancel = () => finish(false);
  const onEscape = (event: KeyboardEvent) => {
    if (event.key !== "Escape") return;
    event.stopPropagation();
    finish(false);
  };

  const onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0 || !event.isPrimary || drag) return;
    const target = event.target as Element | null;
    if (!target || target.closest(ignore)) return;
    const item = target.closest<HTMLElement>(itemSel);
    if (!item || !root.contains(item)) return;
    if (options.handle && !target.closest(options.handle)) return;
    if (cannotDrag(item)) return;
    const rect = item.getBoundingClientRect();
    pending = { item, x: event.clientX, y: event.clientY, offX: event.clientX - rect.left, offY: event.clientY - rect.top };
    window.addEventListener("pointermove", onPointerMove, { passive: false });
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerCancel);
    window.addEventListener("keydown", onEscape, true);
    document.addEventListener("selectstart", prevent);
    root.addEventListener("dragstart", prevent);
  };

  // A drag that started on a button or link must not also click it.
  const onClick = (event: MouseEvent) => {
    if (Date.now() < suppressUntil || drag) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (options.keyboard === false || drag) return;
    const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    if (!keys.includes(event.key) || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const target = event.target as Element | null;
    const item = target?.closest<HTMLElement>(itemSel);
    if (!item || !root.contains(item) || cannotDrag(item)) return;
    const onHandle = !!options.handle && !!target?.closest(options.handle);
    if (options.handle ? !onHandle : !event.altKey) return;
    const from = areaOf(item);
    if (!from) return;
    const flip = rtl(from);
    const sign = (key: string, along: [string, string]) => (key === along[0] ? -1 : key === along[1] ? 1 : 0);
    const alongKeys: [string, string] = horizontal ? ["ArrowLeft", "ArrowRight"] : ["ArrowUp", "ArrowDown"];
    const acrossKeys: [string, string] = horizontal ? ["ArrowUp", "ArrowDown"] : ["ArrowLeft", "ArrowRight"];
    const step = sign(event.key, alongKeys) * (horizontal && flip ? -1 : 1);
    const hop = options.areas ? sign(event.key, acrossKeys) * (!horizontal && flip ? -1 : 1) : 0;
    if (!step && !hop) return;
    event.preventDefault();
    const all = areas();
    const siblings = itemsOf(from);
    const index = siblings.indexOf(item);
    let to = from;
    let toIndex = index;
    if (hop) {
      to = all[all.indexOf(from) + hop] ?? from;
      if (to === from || !accepts(item, to)) return;
      toIndex = Math.min(index, countOthers(to, item));
    } else {
      toIndex = index + step;
      if (toIndex < 0 || toIndex >= siblings.length) return;
      const neighbour = siblings[toIndex];
      if (options.canDropOn?.(neighbour) === false) return;
    }
    const focused = document.activeElement as HTMLElement | null;
    applyMove(item, from, to, index, toIndex);
    // Moving a focused node (or re-rendering its list) can drop focus; put it back.
    requestAnimationFrame(() => requestAnimationFrame(() => focused?.isConnected && document.activeElement !== focused && focused.focus({ preventScroll: true })));
  };

  root.addEventListener("pointerdown", onPointerDown);
  root.addEventListener("click", onClick, true);
  root.addEventListener("keydown", onKeyDown);
  return {
    wasDragged: () => dragged,
    destroy() {
      finish(false);
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("click", onClick, true);
      root.removeEventListener("keydown", onKeyDown);
    },
  };
}
