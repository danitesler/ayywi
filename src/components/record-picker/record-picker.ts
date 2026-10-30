import { cx } from "../../lib/cx";
import { ensureId } from "../../lib/element";
import { CancelCircleIcon } from "../../lib/icons";
import { autoPlace, supportsPopover } from "../../lib/position";
import { comboboxEmptyClass, comboboxOptionLabel } from "../combobox/combobox";
import { iconSvg } from "../icon/icon";
import type { InputSize } from "../input/input";
import { tagRemoveIcon } from "../tag-input/tag-input";

export function recordPickerClass({ multiple = false, size = "md", className }: { multiple?: boolean; size?: InputSize; className?: string } = {}): string {
  return cx(
    "ayy-record-picker",
    "ayy-tag-input",
    "ayy-combobox",
    multiple && "ayy-record-picker--multiple",
    size !== "md" && `ayy-tag-input--${size}`,
    className,
  );
}

/** The clear-all button, as SVG markup (Hugeicons CancelCircle). */
export const recordPickerClearIcon = /* @__PURE__ */ iconSvg(CancelCircleIcon, { name: "circle-x" });

/** One picked record's chip, as React's RecordPicker renders it. */
export function recordPickerChip(option: { id: string; label: string }, removeLabel: (label: string) => string = (label) => `Remove ${label}`): HTMLSpanElement {
  const chip = document.createElement("span");
  chip.className = "ayy-chip ayy-chip--removable ayy-tag-input__tag ayy-record-picker__tag";
  chip.dataset.value = option.id;
  const text = document.createElement("span");
  text.className = "ayy-record-picker__tag-label";
  text.textContent = option.label;
  chip.append(text);
  const button = document.createElement("button");
  button.type = "button";
  button.className = "ayy-chip__remove";
  button.setAttribute("aria-label", removeLabel(option.label));
  button.innerHTML = tagRemoveIcon;
  chip.append(button);
  return chip;
}

export interface RecordPickerOptions {
  /** Pick several records; the list stays open after each pick. Defaults to the root's --multiple class. */
  multiple?: boolean;
  /** Offer a create row for the typed text when no record matches. */
  creatable?: boolean;
  /** Filter the records by the typed text. Default true; false when a search API replaces them (manual). */
  filter?: boolean;
  /** Called with the active record when Enter or a click picks it. */
  onSelect?(option: HTMLElement): void;
  /** Called with the typed text when the create row is picked. */
  onCreate?(label: string): void;
  /** Called when Backspace is pressed in the empty input. */
  onRemoveLast?(): void;
  /** Called when the clear button is pressed. */
  onClear?(): void;
  /** The create row's text. Default "Create “<label>”". */
  createLabel?(label: string): string;
}

export interface RecordPickerController {
  open(): void;
  close(): void;
  /** Re-read the options after you change them. */
  refresh(): void;
  destroy(): void;
}

const OPTION = '[role="option"]';
const CREATE = "[data-create]";
const CREATE_LABEL = ".ayy-record-picker__create-label";

/** The default create row text: `Create “Maya”`. */
export const defaultCreateLabel = (label: string) => `Create “${label}”`;

/**
 * Wire a record picker on plain markup: the .ayy-record-picker field with its input, chips, clear button and
 * .ayy-record-picker__listbox. Typing filters the records (data-label and data-keywords) and activates the first
 * match, arrows move the active row without wrapping, Enter picks the active record or creates from the typed text,
 * Escape closes and clears the query, Backspace in the empty field removes the last chip, and the clear button empties
 * the field. Focus never leaves the input. The controller changes neither chips nor aria-selected: onSelect, onCreate,
 * onRemoveLast and onClear let React and <ayy-record-picker> do that. Framework-free.
 */
export function connectRecordPicker(root: HTMLElement, options: RecordPickerOptions = {}): RecordPickerController {
  const input = root.querySelector<HTMLInputElement>(".ayy-record-picker__input");
  const listbox = root.querySelector<HTMLElement>(".ayy-record-picker__listbox");
  if (!input || !listbox) return { open() {}, close() {}, refresh() {}, destroy() {} };

  const multiple = options.multiple ?? root.classList.contains("ayy-record-picker--multiple");
  const filter = options.filter ?? true;
  const createLabel = options.createLabel ?? defaultCreateLabel;
  const native = supportsPopover();
  let active: HTMLElement | null = null;
  let stopPlacing: (() => void) | null = null;
  let destroyed = false;

  ensureId(listbox, "ayy-listbox");
  input.setAttribute("role", "combobox");
  input.setAttribute("aria-autocomplete", "list");
  input.setAttribute("aria-expanded", "false");
  input.setAttribute("aria-controls", listbox.id);
  if (!input.getAttribute("autocomplete")) input.setAttribute("autocomplete", "off");
  listbox.setAttribute("role", "listbox");
  if (multiple) listbox.setAttribute("aria-multiselectable", "true");
  else listbox.removeAttribute("aria-multiselectable");
  if (native && !listbox.hasAttribute("popover")) listbox.setAttribute("popover", "manual");
  if (!native) listbox.hidden = true;

  // The list is the same field: it takes the input's name, so a screen reader announces it as "Assignee".
  if (!listbox.hasAttribute("aria-label") && !listbox.hasAttribute("aria-labelledby")) {
    const labelledby = input.getAttribute("aria-labelledby");
    const label = input.getAttribute("aria-label");
    if (labelledby) listbox.setAttribute("aria-labelledby", labelledby);
    else if (label) listbox.setAttribute("aria-label", label);
  }

  const all = () => Array.from(listbox.querySelectorAll<HTMLElement>(OPTION));
  const createRow = () => listbox.querySelector<HTMLElement>(CREATE);
  const emptyRow = () => listbox.querySelector<HTMLElement>(`.${comboboxEmptyClass}`);
  const isOpen = () => input.getAttribute("aria-expanded") === "true";
  const query = () => input.value.trim();
  const labelOf = (option: HTMLElement) => comboboxOptionLabel(option);
  const visible = () => all().filter((option) => !option.hidden && option.getAttribute("aria-disabled") !== "true");

  const setActive = (option: HTMLElement | null) => {
    active = option;
    for (const each of all()) each.setAttribute("data-active", String(each === option));
    if (option) {
      ensureId(option, "ayy-option");
      input.setAttribute("aria-activedescendant", option.id);
      option.scrollIntoView?.({ block: "nearest" });
    } else input.removeAttribute("aria-activedescendant");
  };

  const applyFilter = () => {
    const text = query().toLocaleLowerCase();
    for (const option of all()) {
      if (option.hasAttribute("data-create")) continue;
      const haystack = `${labelOf(option)} ${option.dataset.keywords ?? ""}`.toLocaleLowerCase();
      option.hidden = filter && text !== "" && !haystack.includes(text);
    }
    const create = createRow();
    if (create) {
      const exact = all().some((option) => !option.hasAttribute("data-create") && labelOf(option).toLocaleLowerCase() === text);
      const show = Boolean(options.creatable) && text !== "" && !exact;
      create.hidden = !show;
      if (show) {
        const text_ = create.querySelector<HTMLElement>(CREATE_LABEL);
        if (text_) text_.textContent = createLabel(query());
      }
    }
    const none = emptyRow();
    if (none) none.hidden = all().some((option) => !option.hidden);
  };

  const open = () => {
    if (isOpen() || destroyed) return;
    applyFilter();
    input.setAttribute("aria-expanded", "true");
    if (native) {
      if (!listbox.matches(":popover-open")) listbox.showPopover();
    } else listbox.hidden = false;
    listbox.style.minInlineSize = `${root.offsetWidth}px`;
    stopPlacing = autoPlace(listbox, root, { side: "bottom", align: "start", offset: 4 });
  };

  const close = () => {
    if (!isOpen()) return;
    input.setAttribute("aria-expanded", "false");
    setActive(null);
    stopPlacing?.();
    stopPlacing = null;
    if (native) {
      if (listbox.matches(":popover-open")) listbox.hidePopover();
    } else listbox.hidden = true;
  };

  const choose = (option: HTMLElement) => {
    if (option.getAttribute("aria-disabled") === "true") return;
    if (option.hasAttribute("data-create")) {
      const text = query();
      if (!text) return;
      input.value = "";
      applyFilter();
      options.onCreate?.(text);
    } else {
      input.value = "";
      applyFilter();
      options.onSelect?.(option);
    }
    if (!multiple) close();
    else setActive(null);
    input.focus();
  };

  const move = (step: 1 | -1) => {
    const list = visible();
    if (!list.length) return;
    const index = active ? list.indexOf(active) : -1;
    const next = index < 0 ? (step > 0 ? 0 : list.length - 1) : index + step;
    if (next >= 0 && next < list.length) setActive(list[next]);
  };

  const onInput = () => {
    applyFilter();
    open();
    setActive(query() ? (visible()[0] ?? null) : null);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.defaultPrevented || event.isComposing || event.keyCode === 229) return;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen()) open();
        move(1);
        return;
      case "ArrowUp":
        event.preventDefault();
        if (!isOpen()) open();
        move(-1);
        return;
      case "Enter":
        if (!isOpen() || !active) return;
        event.preventDefault();
        choose(active);
        return;
      case "Escape":
        if (isOpen()) {
          event.preventDefault();
          close();
          input.value = "";
          applyFilter();
        } else if (input.value) {
          event.preventDefault();
          input.value = "";
          applyFilter();
        }
        return;
      case "Backspace":
        if (input.value === "" && input.selectionStart === 0) options.onRemoveLast?.();
        return;
      case "Tab":
        close();
        return;
    }
  };

  // The pointer never takes focus out of the input; a blur closes the list.
  const onPointerDown = (event: PointerEvent) => event.preventDefault();
  const onOptionClick = (event: MouseEvent) => {
    const option = (event.target as Element | null)?.closest<HTMLElement>(OPTION);
    if (option && listbox.contains(option)) choose(option);
  };
  const onFocus = () => open();
  const onClick = () => open();
  const onBlur = () => close();
  const onClickClear = () => {
    input.value = "";
    applyFilter();
    options.onClear?.();
    input.focus();
  };
  // The field's empty space and a chip's body put the caret back in the input; its buttons and the list keep their own.
  const onRootClick = (event: MouseEvent) => {
    const target = event.target as Element | null;
    if (!target || target.closest("button, input, .ayy-record-picker__listbox")) return;
    input.focus();
  };

  const clear = root.querySelector<HTMLElement>(".ayy-record-picker__clear");
  input.addEventListener("input", onInput);
  input.addEventListener("keydown", onKeyDown);
  input.addEventListener("focus", onFocus);
  input.addEventListener("click", onClick);
  input.addEventListener("blur", onBlur);
  listbox.addEventListener("pointerdown", onPointerDown);
  listbox.addEventListener("click", onOptionClick);
  root.addEventListener("click", onRootClick);
  clear?.addEventListener("click", onClickClear);
  applyFilter();

  return {
    open,
    close,
    refresh() {
      applyFilter();
      if (active && (active.hidden || !listbox.contains(active))) setActive(null);
    },
    destroy() {
      destroyed = true;
      close();
      input.removeEventListener("input", onInput);
      input.removeEventListener("keydown", onKeyDown);
      input.removeEventListener("focus", onFocus);
      input.removeEventListener("click", onClick);
      input.removeEventListener("blur", onBlur);
      listbox.removeEventListener("pointerdown", onPointerDown);
      listbox.removeEventListener("click", onOptionClick);
      root.removeEventListener("click", onRootClick);
      clear?.removeEventListener("click", onClickClear);
    },
  };
}
