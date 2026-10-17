import { cx } from "../../lib/cx";

export const actionBarButtonVariants = ["default", "primary", "secondary", "destructive"] as const;
export type ActionBarButtonVariant = (typeof actionBarButtonVariants)[number];

export interface ActionBarClassOptions {
  /** Pin the bar to the bottom center of the viewport instead of sticky inside its scroll container. */
  fixed?: boolean;
  className?: string;
}

export function actionBarClass({ fixed, className }: ActionBarClassOptions = {}): string {
  return cx("ayy-action-bar", fixed && "ayy-action-bar--fixed", className);
}

export interface ActionBarButtonClassOptions {
  variant?: ActionBarButtonVariant;
  primary?: boolean;
  secondary?: boolean;
  destructive?: boolean;
  className?: string;
}

export function actionBarButtonClass({
  variant = "default",
  primary,
  secondary,
  destructive,
  className,
}: ActionBarButtonClassOptions = {}): string {
  const resolved = destructive ? "destructive" : primary ? "primary" : secondary ? "secondary" : variant;
  return cx("ayy-action-bar__button", resolved !== "default" && `ayy-action-bar__button--${resolved}`, className);
}

export const actionBarSelectionClass = "ayy-action-bar__selection";
export const actionBarCountClass = "ayy-action-bar__count";
export const actionBarCloseClass = "ayy-action-bar__close";
export const actionBarSeparatorClass = "ayy-action-bar__separator";
export const actionBarActionsClass = "ayy-action-bar__actions";

const ITEMS = "button, [href], input, select, textarea, [tabindex]";

export interface ActionBarControllerOptions {
  /** Called when the clear button or Escape clears the selection. Return false to handle state yourself. */
  onClear?: () => boolean | void;
}

export interface ActionBarController {
  /** Re-read the focusable buttons after adding or removing some. */
  refresh(): void;
  /** Update the selection count and open/close the bar to match. */
  syncCount(count: number): void;
  destroy(): void;
}

/**
 * Wire an .ayy-action-bar: WAI-ARIA toolbar keyboard navigation (one Tab stop, Left/Right arrows mirrored in RTL,
 * Home/End), Escape or a click on .ayy-action-bar__close clears the selection, and syncCount(count) toggles [open]
 * and updates .ayy-action-bar__count. Framework-free; used by React ActionBar and <ayy-action-bar>.
 */
export function connectActionBar(bar: HTMLElement, options: ActionBarControllerOptions = {}): ActionBarController {
  if (!bar.hasAttribute("role")) bar.setAttribute("role", "toolbar");
  let last: HTMLElement | null = null;

  const items = () =>
    Array.from(bar.querySelectorAll<HTMLElement>(ITEMS)).filter((el) => {
      if ((el as HTMLButtonElement).disabled || el.getAttribute("aria-disabled") === "true" || el.closest("[popover]")) return false;
      if (el.getClientRects().length === 0) return false;
      return true;
    });

  const roam = (current?: HTMLElement) => {
    const list = items();
    const keep = current ?? (last && list.includes(last) ? last : list[0]);
    last = keep ?? null;
    for (const el of list) el.tabIndex = el === keep ? 0 : -1;
  };

  const syncCount = (count: number) => {
    const countEl = bar.querySelector<HTMLElement>(`.${actionBarCountClass}`);
    if (countEl && count > 0) {
      const tpl = countEl.dataset.template ?? "{count} selected";
      countEl.textContent = tpl.replace("{count}", String(count));
    }
    if (count > 0) {
      bar.setAttribute("open", "");
      roam();
    } else {
      bar.removeAttribute("open");
    }
  };

  const clearLinkedScope = () => {
    const host = bar.closest("ayy-action-bar") ?? bar;
    const scope = host.closest("ayy-grid, ayy-table, .ayy-grid-wrap") ?? host.parentElement ?? document;
    const checked = scope.querySelectorAll<HTMLInputElement>(
      '.ayy-table__select input[type="checkbox"]:checked, .ayy-grid__select input[type="checkbox"]:checked, .ayy-grid__select-all input[type="checkbox"]:checked',
    );
    let first: HTMLInputElement | null = null;
    for (const box of checked) {
      box.checked = false;
      box.indeterminate = false;
      first ??= box;
    }
    if (first) first.dispatchEvent(new Event("change", { bubbles: true }));
  };

  const triggerClear = () => {
    if (options.onClear?.() === false) return;
    clearLinkedScope();
    syncCount(0);
  };

  const onClick = (event: MouseEvent) => {
    const close = (event.target as Element | null)?.closest<HTMLButtonElement>(`.${actionBarCloseClass}`);
    if (!close || !bar.contains(close)) return;
    if (event.defaultPrevented) return;
    triggerClear();
  };

  const doc = bar.ownerDocument;

  const onDocKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && bar.hasAttribute("open")) {
      if (doc) {
        let hasModal = false;
        try {
          hasModal = Boolean(doc.querySelector("dialog[open], [popover]:popover-open, .ayy-menu[open], .ayy-popover[open]"));
        } catch {
          hasModal = Boolean(doc.querySelector("dialog[open], .ayy-menu[open], .ayy-popover[open]"));
        }
        if (hasModal) return;
      }
      event.preventDefault();
      triggerClear();
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement;
    const rtl = getComputedStyle(bar).direction === "rtl";
    const nextKey = rtl ? "ArrowLeft" : "ArrowRight";
    const prevKey = rtl ? "ArrowRight" : "ArrowLeft";
    const list = items();
    const index = list.indexOf(target);
    if (index < 0) return;
    let next: HTMLElement | undefined;
    if (event.key === nextKey) next = list[(index + 1) % list.length];
    else if (event.key === prevKey) next = list[(index - 1 + list.length) % list.length];
    else if (event.key === "Home") next = list[0];
    else if (event.key === "End") next = list[list.length - 1];
    if (!next) return;
    event.preventDefault();
    roam(next);
    next.focus();
  };

  const onFocusIn = (event: FocusEvent) => {
    const item = (event.target as Element).closest<HTMLElement>(ITEMS);
    if (item && items().includes(item)) roam(item);
  };

  bar.addEventListener("click", onClick);
  bar.addEventListener("keydown", onKeyDown);
  bar.addEventListener("focusin", onFocusIn);
  doc?.addEventListener("keydown", onDocKeyDown);
  roam();

  return {
    refresh: () => roam(),
    syncCount,
    destroy() {
      bar.removeEventListener("click", onClick);
      bar.removeEventListener("keydown", onKeyDown);
      bar.removeEventListener("focusin", onFocusIn);
      doc?.removeEventListener("keydown", onDocKeyDown);
    },
  };
}
