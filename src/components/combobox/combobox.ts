import { ArrowDown01Icon } from "../../lib/icons";
import { ensureId } from "../../lib/element";
import { autoPlace, supportsPopover } from "../../lib/position";
import { iconSvg } from "../icon/icon";

export const comboboxClass = "ayy-combobox";
export const comboboxListboxClass = "ayy-combobox__listbox";
export const comboboxOptionClass = "ayy-combobox__option";
export const comboboxMetaClass = "ayy-combobox__meta";
export const comboboxEmptyClass = "ayy-combobox__empty";

/** The chevron after the input, as SVG markup (Hugeicons ArrowDown01). */
export const comboboxChevronIcon = /* @__PURE__ */ iconSvg(ArrowDown01Icon);

export interface ComboboxControllerOptions {
  /** Called when an option is chosen (click, Enter). The input already shows its label. */
  onSelect?: (option: HTMLElement) => void;
  /** Hide options that don't contain the typed text. Default true; false when you filter them yourself (a search API). */
  filter?: boolean;
}

export interface ComboboxController {
  open(): void;
  close(): void;
  /** Re-read the options after you change them. */
  refresh(): void;
  destroy(): void;
}

const OPTION = '[role="option"]';

/** Pick an option from code (a saved value): the input shows its label, as if it had been clicked. */
export function comboboxOptionByValue(listbox: HTMLElement, value: string): HTMLElement | null {
  return Array.from(listbox.querySelectorAll<HTMLElement>(OPTION)).find((o) => (o.dataset.value ?? comboboxOptionLabel(o)) === value) ?? null;
}

/** What an option puts in the input: its data-label, else its text without the __meta part. */
export function comboboxOptionLabel(option: HTMLElement): string {
  if (option.dataset.label) return option.dataset.label;
  const clone = option.cloneNode(true) as HTMLElement;
  for (const meta of clone.querySelectorAll(`.${comboboxMetaClass}`)) meta.remove();
  return clone.textContent?.trim() ?? "";
}

/**
 * Wire an input to a listbox with the WAI-ARIA combobox pattern (list autocomplete): typing filters the options and
 * highlights the first match, Down/Up move through them (Alt+Down just opens), Enter picks one, Esc closes and then
 * clears, and focus never leaves the input. The listbox is a manual popover placed under the input.
 * Framework-free; used by React Combobox and <ayy-combobox>.
 */
export function connectCombobox(input: HTMLInputElement, listbox: HTMLElement, options: ComboboxControllerOptions = {}): ComboboxController {
  const filter = options.filter ?? true;
  const anchor = input.closest(`.${comboboxClass}`) ?? input;
  const native = supportsPopover();
  let stopPlacing: (() => void) | null = null;
  // The last option picked: while the input still shows its label, opening lists everything again.
  let chosen: HTMLElement | null = null;

  ensureId(listbox, "ayy-listbox");
  input.setAttribute("role", "combobox");
  input.setAttribute("aria-autocomplete", "list");
  input.setAttribute("aria-expanded", "false");
  input.setAttribute("aria-controls", listbox.id);
  input.setAttribute("autocomplete", "off");
  listbox.setAttribute("role", "listbox");
  if (native && !listbox.hasAttribute("popover")) listbox.setAttribute("popover", "manual");
  if (!native) listbox.hidden = true;

  const all = () => Array.from(listbox.querySelectorAll<HTMLElement>(OPTION));
  const visible = () => all().filter((o) => !o.hidden && o.getAttribute("aria-disabled") !== "true");
  const active = () => all().find((o) => o.getAttribute("aria-selected") === "true") ?? null;
  const empty = () => listbox.querySelector<HTMLElement>(`.${comboboxEmptyClass}`);
  const isOpen = () => input.getAttribute("aria-expanded") === "true";

  const prepare = () => {
    for (const option of all()) {
      ensureId(option, "ayy-option");
      if (!option.hasAttribute("aria-selected")) option.setAttribute("aria-selected", "false");
    }
  };

  const setActive = (option: HTMLElement | null) => {
    for (const o of all()) o.setAttribute("aria-selected", String(o === option));
    if (option) {
      input.setAttribute("aria-activedescendant", option.id);
      option.scrollIntoView?.({ block: "nearest" });
    } else input.removeAttribute("aria-activedescendant");
  };

  const applyFilter = () => {
    const showsChoice = chosen !== null && input.value === comboboxOptionLabel(chosen);
    const query = showsChoice ? "" : input.value.trim().toLocaleLowerCase();
    let shown = 0;
    for (const option of all()) {
      const text = `${comboboxOptionLabel(option)} ${option.dataset.keywords ?? ""}`.toLocaleLowerCase();
      option.hidden = filter && query !== "" && !text.includes(query);
      if (!option.hidden) shown++;
    }
    const none = empty();
    if (none) none.hidden = shown > 0;
  };

  function open() {
    if (isOpen()) return;
    prepare();
    input.setAttribute("aria-expanded", "true");
    if (native) listbox.showPopover();
    else listbox.hidden = false;
    listbox.style.minInlineSize = `${(anchor as HTMLElement).offsetWidth}px`;
    stopPlacing = autoPlace(listbox, anchor, { side: "bottom", align: "start", offset: 4 });
  }

  function close() {
    if (!isOpen()) return;
    input.setAttribute("aria-expanded", "false");
    setActive(null);
    stopPlacing?.();
    stopPlacing = null;
    if (native) {
      if (listbox.matches(":popover-open")) listbox.hidePopover();
    } else listbox.hidden = true;
  }

  const choose = (option: HTMLElement) => {
    if (option.getAttribute("aria-disabled") === "true") return;
    chosen = option;
    input.value = comboboxOptionLabel(option);
    close();
    applyFilter();
    input.dispatchEvent(new Event("change", { bubbles: true }));
    options.onSelect?.(option);
  };

  const move = (step: 1 | -1) => {
    const list = visible();
    if (!list.length) return;
    const index = list.indexOf(active() as HTMLElement);
    setActive(list[index < 0 ? (step > 0 ? 0 : list.length - 1) : (index + step + list.length) % list.length]);
  };

  const onInput = () => {
    applyFilter();
    open();
    setActive(input.value.trim() ? (visible()[0] ?? null) : null);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen()) {
          applyFilter();
          open();
          if (event.altKey) return;
          if (chosen && !chosen.hidden) {
            setActive(chosen);
            return;
          }
        }
        move(1);
        return;
      case "ArrowUp":
        event.preventDefault();
        if (!isOpen()) {
          applyFilter();
          open();
        }
        move(-1);
        return;
      case "Enter": {
        const option = isOpen() ? active() : null;
        if (option) {
          event.preventDefault();
          choose(option);
        }
        return;
      }
      case "Escape":
        if (isOpen()) {
          event.preventDefault();
          close();
        } else if (input.value) {
          event.preventDefault();
          input.value = "";
          applyFilter();
          input.dispatchEvent(new Event("input", { bubbles: true }));
          close();
        }
        return;
      case "Tab":
        close();
        return;
    }
  };

  const onClick = () => {
    if (isOpen()) return;
    applyFilter();
    open();
  };

  // Keep focus in the input while the pointer picks an option.
  const onPointerDown = (event: PointerEvent) => event.preventDefault();
  const onOptionClick = (event: MouseEvent) => {
    const option = (event.target as Element | null)?.closest<HTMLElement>(OPTION);
    if (option && listbox.contains(option)) choose(option);
  };
  const onBlur = () => close();

  input.addEventListener("input", onInput);
  input.addEventListener("keydown", onKeyDown);
  input.addEventListener("click", onClick);
  input.addEventListener("blur", onBlur);
  listbox.addEventListener("pointerdown", onPointerDown);
  listbox.addEventListener("click", onOptionClick);
  prepare();
  chosen = all().find((option) => input.value !== "" && comboboxOptionLabel(option) === input.value) ?? null;
  applyFilter();

  return {
    open,
    close,
    refresh() {
      prepare();
      applyFilter();
    },
    destroy() {
      close();
      input.removeEventListener("input", onInput);
      input.removeEventListener("keydown", onKeyDown);
      input.removeEventListener("click", onClick);
      input.removeEventListener("blur", onBlur);
      listbox.removeEventListener("pointerdown", onPointerDown);
      listbox.removeEventListener("click", onOptionClick);
    },
  };
}
