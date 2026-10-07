import { ensureId } from "../../lib/element";
import { Search01Icon } from "../../lib/icons";
import { iconSvg } from "../icon/icon";

export const commandClass = "ayy-command";
export const commandInputClass = "ayy-command__input";
export const commandListClass = "ayy-command__list";
export const commandItemClass = "ayy-command__item";

/** The magnifier before the input, as SVG markup (Hugeicons Search01). */
export const commandSearchIcon = /* @__PURE__ */ iconSvg(Search01Icon);

export interface CommandControllerOptions {
  /** Called when an item is run (Enter or a click). The item has been clicked, so its own handlers run too. */
  onSelect?: (item: HTMLElement) => void;
  /** Hide items that don't match the typed text. Default true; false when you filter them yourself (a search API). */
  filter?: boolean;
}

export interface CommandController {
  /** Re-read the items after you change them. */
  refresh(): void;
  /** Empty the field and show every item again (call it when a palette dialog closes). */
  reset(): void;
  destroy(): void;
}

const ITEM = `.${commandItemClass}`;

/** The text an item is matched on: its data-label (else its text without the __meta part) plus data-keywords. */
export function commandItemText(item: HTMLElement): string {
  let label = item.dataset.label;
  if (!label) {
    const clone = item.cloneNode(true) as HTMLElement;
    for (const meta of clone.querySelectorAll(".ayy-command__meta")) meta.remove();
    label = clone.textContent?.trim() ?? "";
  }
  return `${label} ${item.dataset.keywords ?? ""}`.toLocaleLowerCase();
}

/**
 * Does `text` match `query`? Every word of the query has to start a word of the text ("ne ta" finds "New task"),
 * or appear anywhere in it when the query is a single run of letters ("task" finds "Subtask").
 */
export function commandMatches(text: string, query: string): boolean {
  const q = query.trim().toLocaleLowerCase();
  if (!q) return true;
  const words = q.split(/\s+/);
  if (words.length === 1) return text.includes(q);
  const starts = text.split(/[\s\-_/.,:]+/);
  return words.every((w) => starts.some((s) => s.startsWith(w)));
}

/**
 * Wire a command palette: the .ayy-command__input filters the .ayy-command__item options as you type (groups with
 * nothing left hide, .ayy-command__empty shows when nothing matches), the first match is highlighted, Up/Down move
 * (wrapping), Enter clicks the highlighted item, Esc clears the field (a second Esc closes a dialog), and the
 * pointer highlights what it's over. Focus stays in the input throughout (aria-activedescendant).
 * Framework-free; used by React Command and <ayy-command>.
 */
export function connectCommand(root: HTMLElement, options: CommandControllerOptions = {}): CommandController {
  const filter = options.filter ?? true;
  const input = root.querySelector<HTMLInputElement>(`.${commandInputClass}`);
  const list = root.querySelector<HTMLElement>(`.${commandListClass}`);
  if (!input || !list) return { refresh() {}, reset() {}, destroy() {} };

  ensureId(list, "ayy-command-list");
  input.setAttribute("role", "combobox");
  input.setAttribute("aria-autocomplete", "list");
  input.setAttribute("aria-expanded", "true");
  input.setAttribute("aria-controls", list.id);
  input.setAttribute("autocomplete", "off");
  input.setAttribute("spellcheck", "false");
  list.setAttribute("role", "listbox");

  const all = () => Array.from(list.querySelectorAll<HTMLElement>(ITEM));
  const visible = () => all().filter((o) => !o.hidden && o.getAttribute("aria-disabled") !== "true");
  const active = () => all().find((o) => o.getAttribute("aria-selected") === "true") ?? null;

  const setActive = (item: HTMLElement | null, scroll = true) => {
    for (const o of all()) o.setAttribute("aria-selected", String(o === item));
    if (item) {
      input.setAttribute("aria-activedescendant", item.id);
      if (scroll) item.scrollIntoView?.({ block: "nearest" });
    } else input.removeAttribute("aria-activedescendant");
  };

  const applyFilter = () => {
    let shown = 0;
    for (const item of all()) {
      ensureId(item, "ayy-command-item");
      item.setAttribute("role", "option");
      item.hidden = filter && !commandMatches(commandItemText(item), input.value);
      if (!item.hidden) shown++;
    }
    for (const group of list.querySelectorAll<HTMLElement>(".ayy-command__group")) {
      group.hidden = !Array.from(group.querySelectorAll<HTMLElement>(ITEM)).some((o) => !o.hidden);
    }
    const empty = list.querySelector<HTMLElement>(".ayy-command__empty");
    if (empty) empty.hidden = shown > 0;
  };

  const refresh = () => {
    const current = active();
    applyFilter();
    setActive(current && !current.hidden ? current : (visible()[0] ?? null), false);
  };

  const run = (item: HTMLElement) => {
    if (item.getAttribute("aria-disabled") === "true") return;
    item.click();
  };

  const move = (step: number) => {
    const items = visible();
    if (!items.length) return;
    const index = items.indexOf(active() as HTMLElement);
    setActive(items[index < 0 ? (step > 0 ? 0 : items.length - 1) : (index + step + items.length) % items.length]);
  };

  const onInput = () => {
    applyFilter();
    setActive(visible()[0] ?? null);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.isComposing) return;
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp":
        event.preventDefault();
        move(event.key === "ArrowDown" ? 1 : -1);
        return;
      case "PageDown":
      case "PageUp":
        event.preventDefault();
        move(event.key === "PageDown" ? 5 : -5);
        return;
      case "Enter": {
        const item = active();
        if (item) {
          event.preventDefault();
          run(item);
        }
        return;
      }
      case "Escape":
        // The first Esc clears the field; with nothing typed it's left to the dialog (or the page).
        if (input.value) {
          event.preventDefault();
          event.stopPropagation();
          reset();
        }
        return;
    }
  };

  // Clicks run items (their own onclick first); the input keeps focus.
  const onClick = (event: MouseEvent) => {
    const item = (event.target as Element).closest<HTMLElement>(ITEM);
    if (!item || !list.contains(item) || item.getAttribute("aria-disabled") === "true") return;
    options.onSelect?.(item);
  };
  const onPointerDown = (event: PointerEvent) => {
    if ((event.target as Element).closest(ITEM)) event.preventDefault();
  };
  const onPointerMove = (event: PointerEvent) => {
    const item = (event.target as Element).closest<HTMLElement>(ITEM);
    if (item && !item.hidden && item.getAttribute("aria-disabled") !== "true" && item !== active()) setActive(item, false);
  };

  function reset() {
    input!.value = "";
    applyFilter();
    setActive(visible()[0] ?? null);
    list!.scrollTop = 0;
  }

  input.addEventListener("input", onInput);
  input.addEventListener("keydown", onKeyDown);
  list.addEventListener("click", onClick);
  list.addEventListener("pointerdown", onPointerDown);
  list.addEventListener("pointermove", onPointerMove);
  refresh();

  return {
    refresh,
    reset,
    destroy() {
      input.removeEventListener("input", onInput);
      input.removeEventListener("keydown", onKeyDown);
      list.removeEventListener("click", onClick);
      list.removeEventListener("pointerdown", onPointerDown);
      list.removeEventListener("pointermove", onPointerMove);
    },
  };
}
