import { cx } from "../../lib/cx";
import { ArrowRight01Icon } from "../../lib/icons";
import { iconSvg } from "../icon/icon";

export const treeSizes = ["sm", "md", "lg"] as const;
export type TreeSize = (typeof treeSizes)[number];

export interface TreeClassOptions {
  /** sm is the same as compact; lg has taller rows and a wider indent. */
  size?: TreeSize;
  /** Tighter rows, a smaller indent and the small control text. */
  compact?: boolean;
  className?: string;
}

export function treeClass({ size = "md", compact, className }: TreeClassOptions = {}): string {
  return cx("ayy-tree", size !== "md" && `ayy-tree--${size}`, compact && "ayy-tree--compact", className);
}

export const treeItemClass = "ayy-tree__item";
export const treeRowClass = "ayy-tree__row";
export const treeToggleClass = "ayy-tree__toggle";
export const treeIconClass = "ayy-tree__icon";
export const treeLabelClass = "ayy-tree__label";
export const treeGroupClass = "ayy-tree__group";

/** The chevron: points along the reading direction and turns down while its group is open. */
export const treeChevronIcon = /* @__PURE__ */ iconSvg(ArrowRight01Icon, { name: "chevron-right", directional: true });

const ITEM = '[role="treeitem"]';
const DROPPED = ".ayy-inline-edit, button, input, textarea, select, a[href], [contenteditable]:not([contenteditable='false'])";

export interface TreeControllerOptions {
  /** A row was clicked or Space was pressed on it. */
  onSelect?: (id: string) => void;
  /** A row was double-clicked or Enter was pressed on it. */
  onActivate?: (id: string) => void;
  /** A group opened or closed. */
  onToggle?: (id: string, expanded: boolean) => void;
}

export interface TreeController {
  /** Focus the node with this id (the selected one, or the first, without one). */
  focus(id?: string): void;
  /** Call after nodes were added, removed or shown or hidden: gives the tree a tab stop again if it has lost its one. */
  refresh(): void;
  destroy(): void;
}

/**
 * Wire a plain .ayy-tree: one treeitem is the roving tab stop, clicking a row selects it, the toggle opens its group,
 * double-click and Enter activate, and the arrow keys, Home and End move through the visible nodes. A node with
 * aria-disabled="true" can't be selected or activated. Framework-free; used by <ayy-tree> and React Tree.
 */
export function connectTree(root: HTMLElement, options: TreeControllerOptions = {}): TreeController {
  const items = (): HTMLElement[] =>
    Array.from(root.querySelectorAll<HTMLElement>(ITEM)).filter((item) => item.closest('[role="tree"]') === root);

  const hidden = (item: HTMLElement): boolean => {
    for (let node = item.parentElement; node && node !== root; node = node.parentElement) {
      if (node.getAttribute("role") === "group" && node.hasAttribute("hidden")) return true;
    }
    return false;
  };

  const visible = (): HTMLElement[] => items().filter((item) => !hidden(item));

  const levelOf = (item: HTMLElement): number => {
    let level = 1;
    for (let node = item.parentElement; node && node !== root; node = node.parentElement) {
      if (node.matches(ITEM)) level++;
    }
    return level;
  };

  const parentOf = (item: HTMLElement): HTMLElement | undefined => {
    for (let node = item.parentElement; node && node !== root; node = node.parentElement) {
      if (node.matches(ITEM)) return node as HTMLElement;
    }
    return undefined;
  };

  const child = (item: HTMLElement, selector: string): HTMLElement | undefined =>
    Array.from(item.children).find((el) => el.matches(selector)) as HTMLElement | undefined;

  const groupOf = (item: HTMLElement): HTMLElement | undefined => child(item, '[role="group"]');

  const idOf = (item: HTMLElement): string => item.dataset.id ?? "";

  const isDisabled = (item: HTMLElement): boolean => item.getAttribute("aria-disabled") === "true";

  const setTabStop = (item: HTMLElement): void => {
    for (const other of items()) other.tabIndex = other === item ? 0 : -1;
  };

  const focusItem = (item: HTMLElement): void => {
    setTabStop(item);
    item.focus();
  };

  const selectItem = (item: HTMLElement): void => {
    for (const other of items()) other.setAttribute("aria-selected", other === item ? "true" : "false");
    options.onSelect?.(idOf(item));
  };

  const setExpanded = (item: HTMLElement, expanded: boolean): void => {
    item.setAttribute("aria-expanded", expanded ? "true" : "false");
    const group = groupOf(item);
    if (group) group.hidden = !expanded;
    options.onToggle?.(idOf(item), expanded);
  };

  const toggleItem = (item: HTMLElement): void => {
    if (!groupOf(item)) return;
    setExpanded(item, item.getAttribute("aria-expanded") !== "true");
  };

  const onClick = (event: MouseEvent): void => {
    const target = event.target as Element | null;
    if (!target || target.closest(DROPPED)) return;
    const item = target.closest<HTMLElement>(ITEM);
    if (!item || item.closest('[role="tree"]') !== root) return;
    if (target.closest(".ayy-tree__toggle")) {
      if (isDisabled(item)) return;
      event.preventDefault();
      focusItem(item);
      toggleItem(item);
      return;
    }
    const row = target.closest<HTMLElement>(".ayy-tree__row");
    if (!row || !item.contains(row) || isDisabled(item)) return;
    // Safari leaves a tabindex="-1" element unfocused on click, so focus it here.
    focusItem(item);
    selectItem(item);
  };

  const onDoubleClick = (event: MouseEvent): void => {
    const target = event.target as Element | null;
    if (!target || target.closest(DROPPED) || target.closest(".ayy-tree__toggle")) return;
    const item = target.closest<HTMLElement>(ITEM);
    if (!item || item.closest('[role="tree"]') !== root || isDisabled(item)) return;
    options.onActivate?.(idOf(item));
  };

  const onFocusIn = (event: FocusEvent): void => {
    const item = (event.target as Element | null)?.closest<HTMLElement>(ITEM);
    if (item && item.closest('[role="tree"]') === root) setTabStop(item);
  };

  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.isComposing) return;
    const target = event.target as Element | null;
    if (!target || target.closest(DROPPED)) return;
    const item = target.closest<HTMLElement>(ITEM);
    if (!item || item.closest('[role="tree"]') !== root) return;
    const list = visible();
    const index = list.indexOf(item);
    const disabled = isDisabled(item);

    const move = (next: HTMLElement | undefined) => {
      if (!next) return;
      event.preventDefault();
      focusItem(next);
    };

    switch (event.key) {
      case "ArrowDown":
        move(list[index + 1]);
        break;
      case "ArrowUp":
        move(list[index - 1]);
        break;
      case "ArrowRight": {
        const group = groupOf(item);
        if (!group) break;
        event.preventDefault();
        if (item.getAttribute("aria-expanded") === "true") {
          setExpanded(item, false);
        } else {
          setExpanded(item, true);
          const first = Array.from(group.children).find((el) => el.matches(ITEM)) as HTMLElement | undefined;
          if (first) focusItem(first);
        }
        break;
      }
      case "ArrowLeft": {
        const group = groupOf(item);
        if (group && item.getAttribute("aria-expanded") === "true") {
          event.preventDefault();
          setExpanded(item, false);
          break;
        }
        const parent = parentOf(item);
        if (parent) move(parent);
        break;
      }
      case "Home":
        move(list[0]);
        break;
      case "End":
        move(list[list.length - 1]);
        break;
      case "Enter":
        if (disabled) break;
        event.preventDefault();
        options.onActivate?.(idOf(item));
        break;
      case " ":
        if (disabled) break;
        event.preventDefault();
        selectItem(item);
        break;
      default:
        break;
    }
  };

  for (const item of items()) {
    if (!item.hasAttribute("aria-level")) item.setAttribute("aria-level", String(levelOf(item)));
    if (!item.hasAttribute("aria-selected")) item.setAttribute("aria-selected", "false");
    if (!item.hasAttribute("tabindex")) item.tabIndex = -1;
    const group = groupOf(item);
    if (!group) continue;
    const expanded = item.getAttribute("aria-expanded");
    if (expanded === null) item.setAttribute("aria-expanded", group.hidden ? "false" : "true");
    else group.hidden = expanded === "false";
  }

  const ensureTabStop = (force = false): void => {
    const list = visible();
    if (!force && list.some((item) => item.tabIndex === 0)) return;
    const active = list.find((item) => item.getAttribute("aria-selected") === "true") ?? list.find((item) => !isDisabled(item)) ?? list[0];
    if (active) setTabStop(active);
  };
  ensureTabStop(true);

  root.addEventListener("click", onClick);
  root.addEventListener("dblclick", onDoubleClick);
  root.addEventListener("keydown", onKeyDown);
  root.addEventListener("focusin", onFocusIn);

  return {
    refresh: () => ensureTabStop(),
    focus(id?: string) {
      const list = visible();
      const target = id
        ? list.find((item) => idOf(item) === id)
        : list.find((item) => item.tabIndex === 0) ?? list.find((item) => item.getAttribute("aria-selected") === "true") ?? list[0];
      if (target) focusItem(target);
    },
    destroy() {
      root.removeEventListener("click", onClick);
      root.removeEventListener("dblclick", onDoubleClick);
      root.removeEventListener("keydown", onKeyDown);
      root.removeEventListener("focusin", onFocusIn);
    },
  };
}
