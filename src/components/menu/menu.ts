import { cx } from "../../lib/cx";
import { connectPopover, type PopoverController, type PopoverControllerOptions } from "../popover/popover";
import { place, type FloatingSide, type PlaceBoundary } from "../../lib/position";

export const menuClass = "ayy-menu";
export const menuLabelClass = "ayy-menu__label";
export const menuSeparatorClass = "ayy-menu__separator";
export const menuShortcutClass = "ayy-menu__shortcut";
export const menuValueClass = "ayy-menu__value";
export const menuChevronClass = "ayy-menu__chevron";
export const menuDescriptionClass = "ayy-menu__description";
export const menuGroupInlineClass = "ayy-menu__group--inline";

export interface MenuItemClassOptions {
  destructive?: boolean;
  sub?: boolean;
  expand?: boolean;
  described?: boolean;
  className?: string;
}

export function menuItemClass({ destructive, sub, expand, described, className }: MenuItemClassOptions = {}): string {
  return cx(
    "ayy-menu__item",
    destructive && "ayy-menu__item--destructive",
    sub && "ayy-menu__item--sub",
    expand && "ayy-menu__item--expand",
    described && "ayy-menu__item--described",
    className,
  );
}

export interface MenuSubmenuLayout {
  open: boolean;
  width: number;
  height: number;
  side: FloatingSide;
}

export interface MenuControllerOptions extends PopoverControllerOptions {
  /** Called when an item is activated (click, Enter, Space). The menu closes afterwards unless closeOnSelect is false. */
  onSelect?: (item: HTMLElement) => void;
  /** Anchor point in viewport coordinates for context menus / menus opened at a pointer. */
  at?: { x: number; y: number };
  /** Boundary element or rect to constrain menus and submenus (defaults to viewport). */
  boundary?: PlaceBoundary;
  /** Static menu mode: embedded in a page/window, no popover, always visible. */
  static?: boolean;
  /** Side to force submenus to ("end" | "start"). */
  subSide?: FloatingSide;
  /** Called when a submenu opens, closes, or resizes. Useful for resizing host desktop windows. */
  onSubmenuLayout?: (layout: MenuSubmenuLayout) => void;
  /** Internal parent controller if this menu is a submenu panel. */
  parentMenu?: { closeAll: () => void; focusTrigger: () => void };
}

export interface MenuController extends PopoverController {
  openAt(x: number, y: number): void;
  closeAll(): void;
}

const ITEM = '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]';

function pointInTriangle(
  p: { x: number; y: number },
  a: { x: number; y: number },
  b: { x: number; y: number },
  c: { x: number; y: number },
): boolean {
  const area = 0.5 * (-b.y * c.x + a.y * (-b.x + c.x) + a.x * (b.y - c.y) + b.x * c.y);
  const s = (1 / (2 * area)) * (a.y * c.x - a.x * c.y + (c.y - a.y) * p.x + (a.x - c.x) * p.y);
  const t = (1 / (2 * area)) * (a.x * b.y - a.y * b.x + (a.y - b.y) * p.x + (b.x - a.x) * p.y);
  return s >= 0 && t >= 0 && 1 - s - t >= 0;
}

/**
 * A popover menu with the WAI-ARIA menu button keyboard model: opening focuses the first item, arrows move,
 * Home/End jump, typing a letter jumps to the next matching item, Tab or Esc close and return focus.
 * Supports submenus, expandable sections, context menu point anchoring, and static mode.
 * Framework-free; used by React DropdownMenu and <ayy-menu>.
 */
export function connectMenu(
  trigger: HTMLElement | null,
  content: HTMLElement,
  options: MenuControllerOptions = {},
): MenuController {
  const isStatic = options.static ?? content.classList.contains("ayy-menu--static");
  let atPoint: { x: number; y: number } | null = options.at ?? null;

  // Virtual anchor element when opening at a point (context menu)
  let virtualAnchor: HTMLElement | null = null;
  const updateVirtualAnchor = (pt: { x: number; y: number }) => {
    if (!virtualAnchor) {
      virtualAnchor = document.createElement("div");
      virtualAnchor.style.position = "fixed";
      virtualAnchor.style.pointerEvents = "none";
      virtualAnchor.style.opacity = "0";
      virtualAnchor.style.width = "0";
      virtualAnchor.style.height = "0";
      document.body.appendChild(virtualAnchor);
    }
    virtualAnchor.style.left = `${pt.x}px`;
    virtualAnchor.style.top = `${pt.y}px`;
  };

  if (atPoint) updateVirtualAnchor(atPoint);

  const effectiveTrigger = trigger ?? virtualAnchor ?? content;

  const items = () =>
    Array.from(content.querySelectorAll<HTMLElement>(ITEM)).filter((el) => {
      if (el.hasAttribute("disabled") || el.getAttribute("aria-disabled") === "true") return false;
      // Skip items inside a nested submenu panel that isn't inline
      const parentMenu = el.closest(".ayy-menu");
      if (parentMenu !== content && !el.closest(".ayy-menu__group--inline")) return false;
      // Skip items in closed inline groups
      const group = el.closest(".ayy-menu__group--inline");
      if (group && (group.hasAttribute("hidden") || (group as HTMLElement).style.display === "none")) return false;
      return true;
    });

  let focusLastOnOpen = false;
  content.setAttribute("role", "menu");
  if (trigger) trigger.setAttribute("aria-haspopup", "menu");
  for (const item of content.querySelectorAll<HTMLElement>(ITEM)) item.tabIndex = -1;

  // Submenus management
  interface SubmenuState {
    trigger: HTMLElement;
    panel: HTMLElement;
    controller: MenuController;
  }
  const submenus = new Map<HTMLElement, SubmenuState>();
  let activeSubmenu: SubmenuState | null = null;
  let subTimer: ReturnType<typeof setTimeout> | null = null;
  let mousePos = { x: 0, y: 0 };
  let lastExitPos = { x: 0, y: 0 };

  const closeActiveSubmenu = () => {
    if (activeSubmenu) {
      activeSubmenu.controller.close();
      activeSubmenu.trigger.setAttribute("aria-expanded", "false");
      activeSubmenu = null;
    }
  };

  const popoverOpts: PopoverControllerOptions = {
    align: "start",
    offset: options.offset ?? (options.parentMenu ? 4 : 6),
    side: options.side ?? (options.parentMenu ? (options.subSide ?? "end") : "bottom"),
    boundary: options.boundary,
    ...options,
    onToggle: (open) => {
      if (open) {
        for (const item of content.querySelectorAll<HTMLElement>(ITEM)) item.tabIndex = -1;
        const list = items();
        (focusLastOnOpen ? list.at(-1) : list[0])?.focus();
        focusLastOnOpen = false;
      } else {
        closeActiveSubmenu();
      }
      options.onToggle?.(open);
    },
  };

  let controller: PopoverController;
  if (isStatic) {
    let isOpen = true;
    controller = {
      open() {
        isOpen = true;
        content.classList.remove("ayy-menu--hidden");
      },
      close() {
        isOpen = false;
        content.classList.add("ayy-menu--hidden");
      },
      isOpen() {
        return isOpen;
      },
      update() {},
      destroy() {},
    };
  } else {
    controller = connectPopover(effectiveTrigger, content, popoverOpts);
  }

  const closeAll = () => {
    closeActiveSubmenu();
    if (options.parentMenu) {
      options.parentMenu.closeAll();
    } else {
      controller.close();
    }
  };

  const move = (to: (list: HTMLElement[], index: number) => number) => {
    const list = items();
    if (!list.length) return;
    const index = list.indexOf(document.activeElement as HTMLElement);
    list[(to(list, index) + list.length) % list.length].focus();
  };

  const isRtl = () => getComputedStyle(content).direction === "rtl";

  const toggleInlineExpand = (item: HTMLElement) => {
    const controlsId = item.getAttribute("aria-controls");
    const group = controlsId
      ? content.querySelector<HTMLElement>(`#${controlsId}`)
      : (item.nextElementSibling as HTMLElement | null);
    if (!group || !group.classList.contains("ayy-menu__group--inline")) return;

    const currentlyExpanded = item.getAttribute("aria-expanded") === "true";
    const nextExpanded = !currentlyExpanded;

    // By default, close other inline groups unless multiple is permitted
    if (nextExpanded && !item.hasAttribute("data-multiple")) {
      for (const otherItem of content.querySelectorAll<HTMLElement>(".ayy-menu__item--expand")) {
        if (otherItem !== item) {
          otherItem.setAttribute("aria-expanded", "false");
          const otherId = otherItem.getAttribute("aria-controls");
          const otherGroup = otherId
            ? content.querySelector<HTMLElement>(`#${otherId}`)
            : (otherItem.nextElementSibling as HTMLElement | null);
          if (otherGroup?.classList.contains("ayy-menu__group--inline")) {
            otherGroup.hidden = true;
          }
        }
      }
    }

    item.setAttribute("aria-expanded", String(nextExpanded));
    group.hidden = !nextExpanded;
  };

  // Wire up submenus inside this content
  const initSubmenus = () => {
    const subTriggers = Array.from(
      content.querySelectorAll<HTMLElement>(
        ".ayy-menu__item--sub, .ayy-menu__item[aria-haspopup='menu']:not(.ayy-menu__item--expand)",
      ),
    );

    for (const subTrigger of subTriggers) {
      const controlsId = subTrigger.getAttribute("aria-controls");
      const panel = controlsId
        ? (document.getElementById(controlsId) as HTMLElement | null)
        : (subTrigger.nextElementSibling as HTMLElement | null)?.matches(".ayy-menu--sub")
          ? (subTrigger.nextElementSibling as HTMLElement)
          : null;

      if (!panel || submenus.has(subTrigger)) continue;

      subTrigger.setAttribute("aria-haspopup", "menu");
      if (!subTrigger.hasAttribute("aria-expanded")) subTrigger.setAttribute("aria-expanded", "false");

      // Cross-axis offset: -5px so the first item lines up with the parent row (offset by padding & border)
      const subController = connectMenu(subTrigger, panel, {
        side: options.subSide ?? "end",
        align: "start",
        offset: 4,
        crossAxisOffset: -5,
        boundary: options.boundary,
        parentMenu: {
          closeAll,
          focusTrigger: () => subTrigger.focus(),
        },
        onSelect: options.onSelect,
        onToggle: (open) => {
          subTrigger.setAttribute("aria-expanded", String(open));
          if (options.onSubmenuLayout) {
            const rect = panel.getBoundingClientRect();
            options.onSubmenuLayout({
              open,
              width: rect.width,
              height: rect.height,
              side: (panel.getAttribute("data-placement") as FloatingSide) ?? (isRtl() ? "start" : "end"),
            });
          }
        },
      });

      submenus.set(subTrigger, { trigger: subTrigger, panel, controller: subController });
    }
  };

  initSubmenus();

  const openSubmenuFor = (subTrigger: HTMLElement, focusFirst = false) => {
    const sub = submenus.get(subTrigger);
    if (!sub) return;
    if (activeSubmenu && activeSubmenu !== sub) closeActiveSubmenu();
    activeSubmenu = sub;
    sub.controller.open();
    subTrigger.setAttribute("aria-expanded", "true");
    if (focusFirst) {
      const subItems = Array.from(sub.panel.querySelectorAll<HTMLElement>(ITEM)).filter(
        (el) => !el.hasAttribute("disabled") && el.getAttribute("aria-disabled") !== "true",
      );
      subItems[0]?.focus();
    }
  };

  const onMouseMove = (event: MouseEvent) => {
    mousePos = { x: event.clientX, y: event.clientY };
  };

  const isPointerInSafeTriangle = (panelRect: DOMRect): boolean => {
    const rtl = isRtl();
    // Near corners of panel facing the menu
    const corner1 = { x: rtl ? panelRect.right : panelRect.left, y: panelRect.top };
    const corner2 = { x: rtl ? panelRect.right : panelRect.left, y: panelRect.bottom };
    return pointInTriangle(mousePos, lastExitPos, corner1, corner2);
  };

  const onContentPointerOver = (event: MouseEvent) => {
    const target = (event.target as Element | null)?.closest<HTMLElement>(ITEM);
    if (!target || !content.contains(target)) return;
    // The submenu panels are DOM children of this content (popover="auto" keeps
    // them in place). Their hover events bubble up here — let the panel's own
    // controller handle them instead of treating them as leaving the submenu.
    if (target.closest(".ayy-menu") !== content) return;

    if (activeSubmenu) {
      const panelRect = activeSubmenu.panel.getBoundingClientRect();
      if (isPointerInSafeTriangle(panelRect)) return;
    }

    if (subTimer) {
      clearTimeout(subTimer);
      subTimer = null;
    }

    if (submenus.has(target)) {
      subTimer = setTimeout(() => {
        openSubmenuFor(target, false);
      }, 100);
    } else {
      subTimer = setTimeout(() => {
        closeActiveSubmenu();
      }, 100);
    }
  };

  const onContentPointerLeave = (event: MouseEvent) => {
    const target = (event.target as Element | null)?.closest<HTMLElement>(ITEM);
    if (target && submenus.has(target)) {
      lastExitPos = { x: event.clientX, y: event.clientY };
    }
  };

  const onContentKey = (event: KeyboardEvent) => {
    const active = document.activeElement as HTMLElement | null;
    const rtl = isRtl();

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        closeActiveSubmenu();
        move((_, i) => i + 1);
        return;
      case "ArrowUp":
        event.preventDefault();
        closeActiveSubmenu();
        move((list, i) => (i < 0 ? list.length - 1 : i - 1));
        return;
      case "Home":
        event.preventDefault();
        closeActiveSubmenu();
        move(() => 0);
        return;
      case "End":
        event.preventDefault();
        closeActiveSubmenu();
        move((list) => list.length - 1);
        return;
      case "Tab":
        closeAll();
        return;
      case "Escape":
        if (options.parentMenu) {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
          options.parentMenu.focusTrigger();
          controller.close();
        } else {
          closeAll();
        }
        return;
      case "ArrowRight":
        if (!rtl) {
          if (active && submenus.has(active)) {
            event.preventDefault();
            openSubmenuFor(active, true);
            return;
          }
          if (active?.classList.contains("ayy-menu__item--expand")) {
            event.preventDefault();
            if (active.getAttribute("aria-expanded") !== "true") toggleInlineExpand(active);
            return;
          }
        } else {
          // In RTL, ArrowRight closes a submenu panel
          if (options.parentMenu) {
            event.preventDefault();
            options.parentMenu.focusTrigger();
            controller.close();
            return;
          }
          if (active?.classList.contains("ayy-menu__item--expand") && active.getAttribute("aria-expanded") === "true") {
            event.preventDefault();
            toggleInlineExpand(active);
            return;
          }
        }
        break;
      case "ArrowLeft":
        if (!rtl) {
          if (options.parentMenu) {
            event.preventDefault();
            options.parentMenu.focusTrigger();
            controller.close();
            return;
          }
          if (active?.classList.contains("ayy-menu__item--expand") && active.getAttribute("aria-expanded") === "true") {
            event.preventDefault();
            toggleInlineExpand(active);
            return;
          }
        } else {
          if (active && submenus.has(active)) {
            event.preventDefault();
            openSubmenuFor(active, true);
            return;
          }
          if (active?.classList.contains("ayy-menu__item--expand")) {
            event.preventDefault();
            if (active.getAttribute("aria-expanded") !== "true") toggleInlineExpand(active);
            return;
          }
        }
        break;
      case "Enter":
      case " ":
        if (active && submenus.has(active)) {
          event.preventDefault();
          openSubmenuFor(active, true);
          return;
        }
        if (active?.classList.contains("ayy-menu__item--expand")) {
          event.preventDefault();
          toggleInlineExpand(active);
          return;
        }
        break;
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

    if (submenus.has(item)) {
      openSubmenuFor(item, false);
      return;
    }

    if (item.classList.contains("ayy-menu__item--expand")) {
      toggleInlineExpand(item);
      return;
    }

    // menuitemcheckbox / menuitemradio handling
    const role = item.getAttribute("role");
    if (role === "menuitemcheckbox") {
      const checked = item.getAttribute("aria-checked") === "true";
      item.setAttribute("aria-checked", String(!checked));
    } else if (role === "menuitemradio") {
      const group = item.closest('[role="group"]') ?? content;
      for (const radio of group.querySelectorAll<HTMLElement>('[role="menuitemradio"]')) {
        radio.setAttribute("aria-checked", "false");
      }
      item.setAttribute("aria-checked", "true");
    }

    options.onSelect?.(item);

    const closeOnSelectAttr = item.getAttribute("data-close-on-select");
    const closeByDefault = role !== "menuitemcheckbox" && role !== "menuitemradio";
    const shouldClose = closeOnSelectAttr !== null ? closeOnSelectAttr === "true" : closeByDefault;

    if (shouldClose) {
      closeAll();
    }
  };

  const onTriggerKey = (event: KeyboardEvent) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    focusLastOnOpen = event.key === "ArrowUp";
    if (controller.isOpen()) move(focusLastOnOpen ? (list) => list.length - 1 : () => 0);
    else controller.open();
  };

  window.addEventListener("mousemove", onMouseMove, { passive: true });
  content.addEventListener("mouseover", onContentPointerOver);
  content.addEventListener("mouseout", onContentPointerLeave);
  content.addEventListener("keydown", onContentKey);
  content.addEventListener("click", onContentClick);
  if (trigger) trigger.addEventListener("keydown", onTriggerKey);

  return {
    ...controller,
    openAt(x: number, y: number) {
      atPoint = { x, y };
      updateVirtualAnchor(atPoint);
      if (virtualAnchor) {
        if (!isStatic) {
          controller.open();
          place(content, virtualAnchor, {
            side: "bottom",
            align: "start",
            offset: 0,
            boundary: options.boundary,
          });
        }
      }
    },
    closeAll,
    destroy() {
      if (subTimer) clearTimeout(subTimer);
      window.removeEventListener("mousemove", onMouseMove);
      content.removeEventListener("mouseover", onContentPointerOver);
      content.removeEventListener("mouseout", onContentPointerLeave);
      content.removeEventListener("keydown", onContentKey);
      content.removeEventListener("click", onContentClick);
      if (trigger) trigger.removeEventListener("keydown", onTriggerKey);
      if (virtualAnchor?.parentNode) virtualAnchor.parentNode.removeChild(virtualAnchor);
      for (const sub of submenus.values()) sub.controller.destroy();
      submenus.clear();
      controller.destroy();
    },
  };
}
