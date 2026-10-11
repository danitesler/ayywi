import { cx } from "../../lib/cx";
import { autoPlace, supportsPopover } from "../../lib/position";

export const selectSizes = ["sm", "md", "lg"] as const;
export type SelectSize = (typeof selectSizes)[number];

export interface SelectClassOptions {
  size?: SelectSize;
  className?: string;
}

/** Put on the wrapper element; the <select> inside gets selectControlClass. */
export function selectClass({ size = "md", className }: SelectClassOptions = {}): string {
  return cx("ayy-select", size !== "md" && `ayy-select--${size}`, className);
}

export const selectControlClass = "ayy-select__control";
export const selectListClass = "ayy-select__list";
export const selectOptionClass = "ayy-select__option";
export const selectLabelClass = "ayy-select__label";

const OPTION = `.${selectOptionClass}`;
let listCount = 0;
// Selects whose open list a press on the select itself just dismissed: that click mustn't reopen it.
const dismissedBy = new WeakSet<HTMLSelectElement>();

/**
 * Whether a select opens ayywi's options list rather than the OS picker: a single-choice, enabled select on a screen
 * whose main pointer is a mouse or trackpad. Phones and tablets keep the native picker, which suits touch better.
 */
export function usesSelectList(select: HTMLSelectElement): boolean {
  return (
    select.classList.contains(selectControlClass) &&
    !select.multiple &&
    select.size <= 1 &&
    !select.disabled &&
    supportsPopover() &&
    typeof matchMedia === "function" &&
    matchMedia("(pointer: fine)").matches
  );
}

/**
 * Handle a mousedown, click or keydown on a `.ayy-select__control`: when it would open the OS picker, open ayywi's
 * list instead and call preventDefault(). Returns whether it did. Used by React Select and the page-wide listener in
 * "@danitesler/ayywi/elements" (which skips events that are already defaultPrevented).
 */
export function openSelectListFrom(event: MouseEvent | KeyboardEvent): boolean {
  const select = (event.target as Element | null)?.closest?.("select");
  if (!(select instanceof HTMLSelectElement) || event.defaultPrevented || !usesSelectList(select)) return false;
  if (event instanceof MouseEvent) {
    if (event.button !== 0) return false;
    // mousedown would open the OS picker: stop it and keep focus. The list opens on click, after the pointerup that
    // would light-dismiss a popover shown any earlier — and not when that click just closed the list.
    if (event.type === "mousedown") {
      event.preventDefault();
      select.focus();
      return true;
    }
    if (event.type !== "click") return false;
    event.preventDefault();
    if (!dismissedBy.delete(select)) openSelectList(select);
    return true;
  }
  const opens = event.key === " " || event.key === "Enter" || event.key === "ArrowDown" || event.key === "ArrowUp";
  if (event.type !== "keydown" || !opens || event.ctrlKey || event.metaKey) return false;
  event.preventDefault();
  openSelectList(select, { focusLast: event.key === "ArrowUp" && select.selectedIndex < 0, keyboard: true });
  return true;
}

/**
 * Show ayywi's options list under a native <select>: a listbox popover built from its <option>s and <optgroup>s,
 * with arrows, Home/End and type-ahead, Enter/Space or a click to choose, Esc, Tab or a click outside to close.
 * Choosing sets the select's value and fires `input` and `change` on it, so forms and frameworks see a normal select.
 * The list is removed again when it closes. Returns a function that closes it.
 */
export function openSelectList(
  select: HTMLSelectElement,
  { focusLast = false, keyboard = false }: { focusLast?: boolean; /** Opened from the keyboard: show the focus ring at once. */ keyboard?: boolean } = {},
): () => void {
  const list = document.createElement("div");
  list.id = `ayy-select-list-${++listCount}`;
  list.className = selectListClass;
  list.setAttribute("role", "listbox");
  list.setAttribute("popover", "auto");
  const label = select.labels?.[0]?.textContent?.trim() || select.getAttribute("aria-label");
  if (label) list.setAttribute("aria-label", label);

  const optionFor = (option: HTMLOptionElement) => {
    const item = document.createElement("div");
    item.className = selectOptionClass;
    item.setAttribute("role", "option");
    item.setAttribute("aria-selected", String(option.selected));
    item.tabIndex = -1;
    item.textContent = option.label || option.text;
    item.dataset.index = String(option.index);
    if (option.disabled) item.setAttribute("aria-disabled", "true");
    return item;
  };
  for (const child of Array.from(select.children)) {
    if (child instanceof HTMLOptionElement && !child.hidden) list.append(optionFor(child));
    else if (child instanceof HTMLOptGroupElement) {
      const group = document.createElement("div");
      group.setAttribute("role", "group");
      const heading = document.createElement("div");
      heading.className = selectLabelClass;
      heading.id = `${list.id}-${list.children.length}`;
      heading.textContent = child.label;
      group.setAttribute("aria-labelledby", heading.id);
      group.append(heading);
      for (const option of Array.from(child.children)) {
        if (option instanceof HTMLOptionElement && !option.hidden) group.append(optionFor(option));
      }
      if (child.disabled) for (const item of group.querySelectorAll(OPTION)) item.setAttribute("aria-disabled", "true");
      list.append(group);
    }
  }

  // Inside a modal dialog or an open popover, so the dialog doesn't make it inert and the popover stays open.
  let host: Element | null = null;
  try {
    host = select.closest("dialog[open], :popover-open");
  } catch {
    host = select.closest("dialog[open]");
  }
  (host ?? document.body).append(list);
  // It may land outside the select's subtree: carry over the direction, and the theme, density and brand set around it.
  list.dir = getComputedStyle(select).direction;
  for (const attr of ["data-theme", "data-density", "data-brand"]) {
    const value = select.closest(`[${attr}]`)?.getAttribute(attr);
    if (value) list.setAttribute(attr, value);
  }
  list.style.minInlineSize = `${select.offsetWidth}px`;

  const items = () => Array.from(list.querySelectorAll<HTMLElement>(OPTION)).filter((el) => el.getAttribute("aria-disabled") !== "true");
  const focusItem = (item: HTMLElement | undefined) => item?.focus();
  let stopPlacing: () => void = () => {};
  let typed = "";
  let typedAt = 0;

  const close = () => {
    if (list.matches(":popover-open")) list.hidePopover();
  };
  const choose = (item: HTMLElement) => {
    const index = Number(item.dataset.index);
    if (select.selectedIndex !== index) {
      select.selectedIndex = index;
      select.dispatchEvent(new Event("input", { bubbles: true }));
      select.dispatchEvent(new Event("change", { bubbles: true }));
    }
    select.focus();
    close();
  };

  list.addEventListener("keydown", (event) => {
    const all = items();
    const index = all.indexOf(document.activeElement as HTMLElement);
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusItem(all[Math.min(index + 1, all.length - 1)]);
        return;
      case "ArrowUp":
        event.preventDefault();
        focusItem(all[index < 0 ? all.length - 1 : Math.max(index - 1, 0)]);
        return;
      case "Home":
      case "PageUp":
        event.preventDefault();
        focusItem(all[0]);
        return;
      case "End":
      case "PageDown":
        event.preventDefault();
        focusItem(all.at(-1));
        return;
      case "Enter":
      case " ":
        event.preventDefault();
        if (index >= 0) choose(all[index]);
        return;
      case "Tab":
        // Back on the select first, so Tab moves on from where the user was.
        select.focus();
        close();
        return;
    }
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      // Type-ahead: letters typed within a second add up ("ger" finds Germany after Georgia).
      const now = Date.now();
      typed = now - typedAt > 1000 ? event.key.toLocaleLowerCase() : typed + event.key.toLocaleLowerCase();
      typedAt = now;
      const start = typed.length > 1 ? Math.max(index, 0) : index + 1;
      for (let step = 0; step < all.length; step++) {
        const item = all[(start + step) % all.length];
        if (item.textContent?.trim().toLocaleLowerCase().startsWith(typed)) {
          focusItem(item);
          break;
        }
      }
    }
  });
  list.addEventListener("click", (event) => {
    const item = (event.target as Element | null)?.closest<HTMLElement>(OPTION);
    if (item && items().includes(item)) choose(item);
  });
  // The pointer moves the highlight, so the hovered option and the keyboard's never disagree.
  list.addEventListener("pointermove", (event) => {
    const item = (event.target as Element | null)?.closest<HTMLElement>(OPTION);
    if (item && item !== document.activeElement && items().includes(item)) item.focus({ preventScroll: true, focusVisible: false } as FocusOptions);
  });
  // beforetoggle, not toggle: it fires at once on every close (toggle events coalesce), so a quick reopen never finds the old list.
  list.addEventListener("beforetoggle", (event) => {
    if ((event as ToggleEvent).newState === "open") return;
    stopPlacing();
    document.removeEventListener("pointerdown", onPointerDown, true);
    window.removeEventListener("resize", close);
    select.removeAttribute("aria-expanded");
    select.removeAttribute("aria-controls");
    if (list.contains(document.activeElement) || document.activeElement === document.body) select.focus();
    queueMicrotask(() => list.remove());
  });

  // A press on the select closes the list (light dismiss); remember it so the click that follows doesn't reopen it.
  const onPointerDown = (event: PointerEvent) => {
    if (event.target instanceof Node && select.contains(event.target)) dismissedBy.add(select);
  };
  document.addEventListener("pointerdown", onPointerDown, true);
  // Like the OS picker, it closes when the window resizes rather than drifting from a select that moved.
  window.addEventListener("resize", close);
  dismissedBy.delete(select);
  select.setAttribute("aria-expanded", "true");
  select.setAttribute("aria-controls", list.id);
  list.showPopover();
  stopPlacing = autoPlace(list, select, { side: "bottom", align: "start", offset: 4 });
  const all = items();
  const first = all.find((item) => item.getAttribute("aria-selected") === "true") ?? (focusLast ? all.at(-1) : all[0]);
  first?.focus({ focusVisible: keyboard } as FocusOptions);
  return close;
}
