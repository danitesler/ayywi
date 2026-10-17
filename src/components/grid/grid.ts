import { cx } from "../../lib/cx";

export interface GridClassOptions {
  compact?: boolean;
  className?: string;
}

export function gridClass({ compact, className }: GridClassOptions = {}): string {
  return cx("ayy-grid", compact && "ayy-grid--compact", className);
}

export interface GridItemActionsClassOptions {
  /** Reveal quick actions on card hover, keyboard focus, or when selected (touch screens keep them visible). */
  reveal?: boolean;
  className?: string;
}

export function gridItemActionsClass({ reveal, className }: GridItemActionsClassOptions = {}): string {
  return cx("ayy-grid__actions", reveal && "ayy-grid__actions--reveal", className);
}

export const gridWrapClass = "ayy-grid-wrap";
export const gridToolbarClass = "ayy-grid__toolbar";
export const gridSelectAllClass = "ayy-grid__select-all";
export const gridItemClass = "ayy-grid__item";
export const gridMediaClass = "ayy-grid__media";
export const gridHeaderClass = "ayy-grid__header";
export const gridSelectClass = "ayy-grid__select";
export const gridActionsClass = "ayy-grid__actions";
export const gridTitleClass = "ayy-grid__title";
export const gridDescriptionClass = "ayy-grid__description";
export const gridBodyClass = "ayy-grid__body";
export const gridFooterClass = "ayy-grid__footer";

export interface GridControllerOptions {
  /** Called when the selected grid items change. */
  onSelectionChange?: (items: HTMLElement[]) => void;
}

const INTERACTIVE = 'a, button, input, label, select, textarea, summary, [popover], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]';

/**
 * Wire a plain .ayy-grid (or its .ayy-grid-wrap): a checkbox in .ayy-grid__select-all selects every card and shows
 * indeterminate when some are selected; each card's .ayy-grid__select checkbox (or a click on the card body outside
 * buttons, links and menus) sets aria-selected on its .ayy-grid__item; Shift+click selects a range of cards.
 * Framework-free; used by <ayy-grid>.
 */
export function connectGrid(root: HTMLElement, options: GridControllerOptions = {}): { destroy(): void } {
  let lastIndex = -1;
  let shiftHeld = false;

  const selectAllBox = () =>
    root.querySelector<HTMLInputElement>(`.${gridSelectAllClass} input[type="checkbox"]`) ?? null;

  const itemBoxes = () =>
    Array.from(root.querySelectorAll<HTMLElement>(`.${gridItemClass}`)).flatMap((item) => {
      const box = item.querySelector<HTMLInputElement>(`.${gridSelectClass} input[type="checkbox"]`);
      return box ? [{ item, box }] : [];
    });

  const syncSelection = (notify: boolean) => {
    const boxes = itemBoxes();
    for (const { item, box } of boxes) item.setAttribute("aria-selected", String(box.checked));
    const selected = boxes.filter(({ box }) => box.checked);
    const all = selectAllBox();
    if (all) {
      all.checked = boxes.length > 0 && selected.length === boxes.length;
      all.indeterminate = selected.length > 0 && selected.length < boxes.length;
    }
    if (notify) options.onSelectionChange?.(selected.map(({ item }) => item));
  };

  const applyRange = (boxes: { item: HTMLElement; box: HTMLInputElement }[], currentIndex: number, checked: boolean) => {
    if (shiftHeld && lastIndex >= 0 && lastIndex !== currentIndex && lastIndex < boxes.length) {
      const start = Math.min(lastIndex, currentIndex);
      const end = Math.max(lastIndex, currentIndex);
      for (let i = start; i <= end; i++) {
        if (!boxes[i].box.disabled) boxes[i].box.checked = checked;
      }
    }
    lastIndex = currentIndex;
  };

  const onClick = (event: MouseEvent) => {
    shiftHeld = event.shiftKey;
    if (event.defaultPrevented) return;
    const target = event.target as Element | null;
    if (!target || target.closest(INTERACTIVE)) return;
    const item = target.closest<HTMLElement>(`.${gridItemClass}`);
    if (!item || !root.contains(item)) return;
    const boxes = itemBoxes();
    const index = boxes.findIndex((entry) => entry.item === item);
    if (index < 0 || boxes[index].box.disabled) return;
    const next = !boxes[index].box.checked;
    boxes[index].box.checked = next;
    applyRange(boxes, index, next);
    boxes[index].box.dispatchEvent(new Event("change", { bubbles: true }));
  };

  const onChange = (event: Event) => {
    const input = event.target as HTMLInputElement | null;
    if (!input || !root.contains(input)) return;
    const all = selectAllBox();
    if (input === all) {
      for (const { box } of itemBoxes()) if (!box.disabled) box.checked = input.checked;
      syncSelection(true);
      return;
    }
    if (!input.closest(`.${gridSelectClass}`)) return;
    const boxes = itemBoxes();
    const index = boxes.findIndex((entry) => entry.box === input);
    if (index >= 0) applyRange(boxes, index, input.checked);
    shiftHeld = false;
    syncSelection(true);
  };

  root.addEventListener("click", onClick);
  root.addEventListener("change", onChange);
  syncSelection(false);

  return {
    destroy() {
      root.removeEventListener("click", onClick);
      root.removeEventListener("change", onChange);
    },
  };
}
