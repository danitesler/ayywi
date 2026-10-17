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
  /** Called when the search query changes, including when reset() clears it. */
  onSearchChange?: (text: string) => void;
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

/** Details extracted from an item for search scoring: title, description, and keywords. */
export function commandItemDetails(item: HTMLElement): { title: string; description: string; keywords: string } {
  const keywords = item.dataset.keywords ?? "";

  let title = item.dataset.title;
  if (!title) {
    const titleEl = item.querySelector<HTMLElement>(".ayy-command__title");
    if (titleEl) {
      title = titleEl.textContent?.trim() ?? "";
    } else {
      let label = item.dataset.label;
      if (!label) {
        const clone = item.cloneNode(true) as HTMLElement;
        for (const meta of clone.querySelectorAll(".ayy-command__meta, .ayy-command__description")) meta.remove();
        label = clone.textContent?.trim() ?? "";
      }
      title = label;
    }
  }

  const descEl = item.querySelector<HTMLElement>(".ayy-command__description");
  const description = item.dataset.description ?? descEl?.textContent?.trim() ?? "";

  return { title, description, keywords };
}

/**
 * Scores an item against a search query, with strict priority given to title matches:
 * 1000: Exact normalized title match
 * 500:  Title starts with query
 * 400:  All query words start title words (multi-word)
 * 300:  A title word starts with query
 * 200:  Title contains query
 * 100:  A description or keyword word starts with query
 * 50:   Description or keywords contains query
 * 0:    No match
 */
export function commandScore(title: string, description: string, keywords: string, query: string): number {
  const q = query.trim().toLocaleLowerCase();
  if (!q) return 1;

  const t = title.trim().toLocaleLowerCase();
  const d = description.trim().toLocaleLowerCase();
  const k = keywords.trim().toLocaleLowerCase();
  const dk = `${d} ${k}`.trim();

  // Exact match on title
  if (t === q) return 1000;

  // Title starts with query
  if (t.startsWith(q)) return 500;

  const qWords = q.split(/\s+/).filter(Boolean);
  const tWords = t.split(/[\s\-_/.,:]+/).filter(Boolean);
  const dkWords = dk.split(/[\s\-_/.,:]+/).filter(Boolean);

  if (qWords.length > 1) {
    const allInTitle = qWords.every((qw) => tWords.some((tw) => tw.startsWith(qw)));
    if (allInTitle) return 400;

    const someInTitle = qWords.some((qw) => tWords.some((tw) => tw.startsWith(qw)));
    const allInCombined = qWords.every(
      (qw) => tWords.some((tw) => tw.startsWith(qw)) || dkWords.some((dkw) => dkw.startsWith(qw)),
    );
    if (allInCombined) return someInTitle ? 250 : 80;

    if (t.includes(q)) return 200;
    if (dk.includes(q)) return 50;
    return 0;
  }

  // Single word: title word starts with query
  if (tWords.some((w) => w.startsWith(q))) return 300;

  // Title contains query
  if (t.includes(q)) return 200;

  // Description / keywords word starts with query
  if (dkWords.some((w) => w.startsWith(q))) return 100;

  // Description / keywords contains query
  if (dk.includes(q)) return 50;

  return 0;
}

/**
 * Does `text` match `query`? Every word of the query has to start a word of the text ("ne ta" finds "New task"),
 * or appear anywhere in it when the query is a single run of letters ("task" finds "Subtask").
 */
export function commandMatches(text: string, query: string): boolean {
  const q = query.trim().toLocaleLowerCase();
  if (!q) return true;
  const t = text.toLocaleLowerCase();
  const words = q.split(/\s+/);
  if (words.length === 1) return t.includes(q);
  const starts = t.split(/[\s\-_/.,:]+/);
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

  const initialGroupOrder = new Map<HTMLElement, number>();
  const initialItemOrder = new Map<HTMLElement, number>();

  const initOrder = () => {
    let gIdx = 0;
    for (const group of list.querySelectorAll<HTMLElement>(".ayy-command__group")) {
      if (!initialGroupOrder.has(group)) initialGroupOrder.set(group, gIdx++);
      let iIdx = 0;
      for (const item of group.querySelectorAll<HTMLElement>(ITEM)) {
        if (!initialItemOrder.has(item)) initialItemOrder.set(item, iIdx++);
      }
    }
    let directIdx = 0;
    for (const item of list.querySelectorAll<HTMLElement>(`:scope > ${ITEM}`)) {
      if (!initialItemOrder.has(item)) initialItemOrder.set(item, directIdx++);
    }
  };

  initOrder();

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
    initOrder();
    const query = input.value.trim();
    const isReact =
      Object.keys(root).some((k) => k.startsWith("__reactFiber") || k.startsWith("__reactProps")) ||
      Object.keys(list).some((k) => k.startsWith("__reactFiber") || k.startsWith("__reactProps"));

    if (!filter || !query) {
      if (!isReact) {
        // Restore initial order when empty
        const groups = Array.from(list.querySelectorAll<HTMLElement>(".ayy-command__group"));
        groups.sort((a, b) => (initialGroupOrder.get(a) ?? 0) - (initialGroupOrder.get(b) ?? 0));
        for (const group of groups) {
          list.appendChild(group);
          const items = Array.from(group.querySelectorAll<HTMLElement>(ITEM));
          items.sort((a, b) => (initialItemOrder.get(a) ?? 0) - (initialItemOrder.get(b) ?? 0));
          for (const item of items) {
            ensureId(item, "ayy-command-item");
            item.setAttribute("role", "option");
            item.hidden = false;
            group.appendChild(item);
          }
          group.hidden = false;
        }
        const directItems = Array.from(list.querySelectorAll<HTMLElement>(`:scope > ${ITEM}`));
        directItems.sort((a, b) => (initialItemOrder.get(a) ?? 0) - (initialItemOrder.get(b) ?? 0));
        for (const item of directItems) {
          ensureId(item, "ayy-command-item");
          item.setAttribute("role", "option");
          item.hidden = false;
          list.appendChild(item);
        }
      } else {
        for (const group of list.querySelectorAll<HTMLElement>(".ayy-command__group")) {
          group.hidden = false;
        }
        for (const item of all()) {
          ensureId(item, "ayy-command-item");
          item.setAttribute("role", "option");
          item.hidden = false;
        }
      }
      for (const item of all()) item.hidden = false;
      const empty = list.querySelector<HTMLElement>(".ayy-command__empty");
      if (empty) {
        empty.hidden = true;
        if (!isReact) list.appendChild(empty);
      }
      return;
    }

    let shown = 0;
    const itemScores = new Map<HTMLElement, number>();
    const groupScores = new Map<HTMLElement, number>();

    for (const item of all()) {
      ensureId(item, "ayy-command-item");
      item.setAttribute("role", "option");
      const details = commandItemDetails(item);
      const score = commandScore(details.title, details.description, details.keywords, query);
      itemScores.set(item, score);
      item.hidden = score === 0;
      if (!item.hidden) shown++;
    }

    if (!isReact) {
      const groups = Array.from(list.querySelectorAll<HTMLElement>(".ayy-command__group"));
      for (const group of groups) {
        const items = Array.from(group.querySelectorAll<HTMLElement>(ITEM));
        items.sort((a, b) => {
          const diff = (itemScores.get(b) ?? 0) - (itemScores.get(a) ?? 0);
          if (diff !== 0) return diff;
          return (initialItemOrder.get(a) ?? 0) - (initialItemOrder.get(b) ?? 0);
        });
        for (const item of items) group.appendChild(item);

        const visibleInGroup = items.filter((o) => !o.hidden);
        group.hidden = visibleInGroup.length === 0;
        const maxScore = visibleInGroup.reduce((m, o) => Math.max(m, itemScores.get(o) ?? 0), 0);
        groupScores.set(group, maxScore);
      }

      // Reorder groups by their highest score so groups with title matches float to top
      groups.sort((a, b) => {
        const diff = (groupScores.get(b) ?? 0) - (groupScores.get(a) ?? 0);
        if (diff !== 0) return diff;
        return (initialGroupOrder.get(a) ?? 0) - (initialGroupOrder.get(b) ?? 0);
      });

      for (const group of groups) list.appendChild(group);

      const directItems = Array.from(list.querySelectorAll<HTMLElement>(`:scope > ${ITEM}`));
      directItems.sort((a, b) => {
        const diff = (itemScores.get(b) ?? 0) - (itemScores.get(a) ?? 0);
        if (diff !== 0) return diff;
        return (initialItemOrder.get(a) ?? 0) - (initialItemOrder.get(b) ?? 0);
      });
      for (const item of directItems) list.appendChild(item);
    } else {
      for (const group of list.querySelectorAll<HTMLElement>(".ayy-command__group")) {
        const items = Array.from(group.querySelectorAll<HTMLElement>(ITEM));
        const visibleInGroup = items.filter((o) => !o.hidden);
        group.hidden = visibleInGroup.length === 0;
      }
    }

    const empty = list.querySelector<HTMLElement>(".ayy-command__empty");
    if (empty) {
      empty.hidden = shown > 0;
      if (!isReact) list.appendChild(empty);
    }
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
    options.onSearchChange?.(input.value);
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
    options.onSearchChange?.("");
    input!.dispatchEvent(new Event("input", { bubbles: true }));
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
