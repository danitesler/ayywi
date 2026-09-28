import { cx } from "../../lib/cx";
import { connectPopover, type PopoverController, type PopoverControllerOptions } from "../popover/popover";

export const menuClass = "ayy-menu";
export const menuLabelClass = "ayy-menu__label";
export const menuSeparatorClass = "ayy-menu__separator";
export const menuShortcutClass = "ayy-menu__shortcut";

export interface MenuItemClassOptions {
  destructive?: boolean;
  className?: string;
}

export function menuItemClass({ destructive, className }: MenuItemClassOptions = {}): string {
  return cx("ayy-menu__item", destructive && "ayy-menu__item--destructive", className);
}

export interface MenuControllerOptions extends PopoverControllerOptions {
  /** Called when an item is activated (click, Enter, Space). The menu closes afterwards. */
  onSelect?: (item: HTMLElement) => void;
}

const ITEM = '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]';

/**
 * A popover menu with the WAI-ARIA menu button keyboard model: opening focuses the first item, arrows move,
 * Home/End jump, typing a letter jumps to the next matching item, Tab or Esc close and return focus.
 * Framework-free; used by React DropdownMenu and <ayy-menu>.
 */
export function connectMenu(trigger: HTMLElement, content: HTMLElement, options: MenuControllerOptions = {}): PopoverController {
  const items = () =>
    Array.from(content.querySelectorAll<HTMLElement>(ITEM)).filter(
      (el) => !el.hasAttribute("disabled") && el.getAttribute("aria-disabled") !== "true",
    );
  let focusLastOnOpen = false;

  content.setAttribute("role", "menu");
  trigger.setAttribute("aria-haspopup", "menu");
  for (const item of content.querySelectorAll<HTMLElement>(ITEM)) item.tabIndex = -1;

  const controller = connectPopover(trigger, content, {
    align: "start",
    ...options,
    onToggle: (open) => {
      if (open) {
        for (const item of content.querySelectorAll<HTMLElement>(ITEM)) item.tabIndex = -1;
        const list = items();
        (focusLastOnOpen ? list.at(-1) : list[0])?.focus();
        focusLastOnOpen = false;
      }
      options.onToggle?.(open);
    },
  });

  const move = (to: (list: HTMLElement[], index: number) => number) => {
    const list = items();
    if (!list.length) return;
    const index = list.indexOf(document.activeElement as HTMLElement);
    list[(to(list, index) + list.length) % list.length].focus();
  };

  const onContentKey = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        move((_, i) => i + 1);
        return;
      case "ArrowUp":
        event.preventDefault();
        move((list, i) => (i < 0 ? list.length - 1 : i - 1));
        return;
      case "Home":
        event.preventDefault();
        move(() => 0);
        return;
      case "End":
        event.preventDefault();
        move((list) => list.length - 1);
        return;
      case "Tab":
        controller.close();
        return;
    }
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const key = event.key.toLocaleLowerCase();
      const list = items();
      const start = list.indexOf(document.activeElement as HTMLElement);
      for (let step = 1; step <= list.length; step++) {
        const item = list[(start + step) % list.length];
        if (item.textContent?.trim().toLocaleLowerCase().startsWith(key)) {
          item.focus();
          break;
        }
      }
    }
  };

  const onContentClick = (event: MouseEvent) => {
    const item = (event.target as Element | null)?.closest<HTMLElement>(ITEM);
    if (!item || !content.contains(item) || !items().includes(item)) return;
    options.onSelect?.(item);
    controller.close();
  };

  const onTriggerKey = (event: KeyboardEvent) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    focusLastOnOpen = event.key === "ArrowUp";
    if (controller.isOpen()) move(focusLastOnOpen ? (list) => list.length - 1 : () => 0);
    else controller.open();
  };

  content.addEventListener("keydown", onContentKey);
  content.addEventListener("click", onContentClick);
  trigger.addEventListener("keydown", onTriggerKey);

  return {
    ...controller,
    destroy() {
      content.removeEventListener("keydown", onContentKey);
      content.removeEventListener("click", onContentClick);
      trigger.removeEventListener("keydown", onTriggerKey);
      controller.destroy();
    },
  };
}
