import { cx } from "../../lib/cx";

export const toolbarSizes = ["sm", "md"] as const;
export type ToolbarSize = (typeof toolbarSizes)[number];

export interface ToolbarClassOptions {
  /** A column (an editor's side rail). */
  vertical?: boolean;
  /** A raised pill with a shadow, over a canvas or a photo. */
  floating?: boolean;
  /** One line that scrolls sideways (phones). */
  scroll?: boolean;
  size?: ToolbarSize;
  className?: string;
}

export function toolbarClass({ vertical, floating, scroll, size = "md", className }: ToolbarClassOptions = {}): string {
  return cx(
    "ayy-toolbar",
    vertical && "ayy-toolbar--vertical",
    floating && "ayy-toolbar--floating",
    scroll && "ayy-toolbar--scroll",
    size !== "md" && `ayy-toolbar--${size}`,
    className,
  );
}

export const toolbarButtonClass = "ayy-toolbar__button";
export const toolbarGroupClass = "ayy-toolbar__group";
export const toolbarSeparatorClass = "ayy-toolbar__separator";
export const toolbarSpacerClass = "ayy-toolbar__spacer";

const ITEMS = "button, [href], input, select, textarea, [tabindex]";

export interface ToolbarController {
  /** Re-read the items after adding or removing some. */
  refresh(): void;
  destroy(): void;
}

/**
 * The WAI-ARIA toolbar pattern on a role="toolbar" element: one Tab stop (the last item used, else the pressed one,
 * else the first), arrow keys move along it (Left/Right, mirrored in RTL; Up/Down with aria-orientation="vertical"),
 * Home/End jump to the ends. Disabled and hidden items are skipped; a radio group inside (swatches, a segmented
 * control) counts as one item and keeps its own arrow keys, like text fields. Framework-free; used by React Toolbar
 * and <ayy-toolbar>.
 */
export function connectToolbar(toolbar: HTMLElement): ToolbarController {
  if (!toolbar.hasAttribute("role")) toolbar.setAttribute("role", "toolbar");
  let last: HTMLElement | null = null;

  const items = () =>
    Array.from(toolbar.querySelectorAll<HTMLElement>(ITEMS)).filter((el) => {
      if ((el as HTMLButtonElement).disabled || el.getAttribute("aria-disabled") === "true" || el.closest("[popover]")) return false;
      if (el.getClientRects().length === 0) return false;
      if (el instanceof HTMLInputElement && el.type === "radio") {
        const group = Array.from(toolbar.querySelectorAll<HTMLInputElement>(`input[type="radio"][name="${CSS.escape(el.name)}"]`));
        return el.checked || (!group.some((r) => r.checked) && group[0] === el);
      }
      return true;
    });

  const roam = (current?: HTMLElement) => {
    const list = items();
    const keep = current ?? (last && list.includes(last) ? last : (list.find((el) => el.getAttribute("aria-pressed") === "true") ?? list[0]));
    last = keep ?? null;
    for (const el of list) if (!(el instanceof HTMLInputElement && el.type === "radio")) el.tabIndex = el === keep ? 0 : -1;
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement;
    // Text fields and radio groups keep their own arrow keys.
    if (target.matches("input:not([type='checkbox'], [type='button'], [type='color']), textarea, select")) return;
    const vertical = toolbar.getAttribute("aria-orientation") === "vertical";
    const rtl = getComputedStyle(toolbar).direction === "rtl";
    const nextKey = vertical ? "ArrowDown" : rtl ? "ArrowLeft" : "ArrowRight";
    const prevKey = vertical ? "ArrowUp" : rtl ? "ArrowRight" : "ArrowLeft";
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

  toolbar.addEventListener("keydown", onKeyDown);
  toolbar.addEventListener("focusin", onFocusIn);
  roam();
  return {
    refresh: () => roam(),
    destroy() {
      toolbar.removeEventListener("keydown", onKeyDown);
      toolbar.removeEventListener("focusin", onFocusIn);
    },
  };
}
