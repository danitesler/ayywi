import { cx } from "../../lib/cx";

export const iconPickerClassConstant = "ayy-icon-picker";
export const iconPickerHeaderClass = "ayy-icon-picker__header";
export const iconPickerSearchClass = "ayy-icon-picker__search";
export const iconPickerRemoveClass = "ayy-icon-picker__remove";
export const iconPickerBodyClass = "ayy-icon-picker__body";
export const iconPickerSectionClass = "ayy-icon-picker__section";
export const iconPickerLabelClass = "ayy-icon-picker__label";
export const iconPickerGridClass = "ayy-icon-picker__grid";
export const iconPickerOptionClass = "ayy-icon-picker__option";
export const iconPickerEmptyClass = "ayy-icon-picker__empty";

export function iconPickerClass({ className }: { className?: string } = {}): string {
  return cx(iconPickerClassConstant, className);
}

export type IconPickerKind = "icon" | "emoji";

export interface IconPickerEmoji {
  /** The emoji itself; it is also the picked value. */
  value: string;
  /** Accessible name ("Rocket"), also searched. */
  label: string;
  /** Extra search words. */
  keywords?: string[];
}

/** A starter set of emoji for marking columns, projects and pages. Pass your own list for more. */
export const iconPickerEmojis: IconPickerEmoji[] = [
  { value: "⭐", label: "Star", keywords: ["favourite", "favorite", "important"] },
  { value: "🔥", label: "Fire", keywords: ["hot", "trending"] },
  { value: "🚀", label: "Rocket", keywords: ["launch", "ship", "release"] },
  { value: "🎯", label: "Target", keywords: ["goal", "aim"] },
  { value: "💡", label: "Light bulb", keywords: ["idea", "tip"] },
  { value: "📌", label: "Pin", keywords: ["pinned"] },
  { value: "📅", label: "Calendar", keywords: ["date", "schedule"] },
  { value: "⏰", label: "Alarm clock", keywords: ["time", "deadline", "due"] },
  { value: "✅", label: "Check mark", keywords: ["done", "complete", "yes"] },
  { value: "❌", label: "Cross mark", keywords: ["no", "cancel", "wrong"] },
  { value: "⚠️", label: "Warning", keywords: ["alert", "caution", "risk"] },
  { value: "❓", label: "Question mark", keywords: ["help", "unknown"] },
  { value: "💰", label: "Money bag", keywords: ["revenue", "price", "cost", "budget"] },
  { value: "📈", label: "Chart increasing", keywords: ["growth", "trend", "up"] },
  { value: "📉", label: "Chart decreasing", keywords: ["decline", "trend", "down"] },
  { value: "📊", label: "Bar chart", keywords: ["stats", "report", "analytics"] },
  { value: "🏷️", label: "Label", keywords: ["tag", "category"] },
  { value: "📝", label: "Memo", keywords: ["note", "text", "write"] },
  { value: "📁", label: "Folder", keywords: ["files", "project"] },
  { value: "📎", label: "Paperclip", keywords: ["attachment", "file"] },
  { value: "🔗", label: "Link", keywords: ["url", "chain"] },
  { value: "🔒", label: "Lock", keywords: ["private", "secure"] },
  { value: "👤", label: "Person", keywords: ["user", "owner", "contact"] },
  { value: "👥", label: "People", keywords: ["team", "users", "group"] },
  { value: "🏢", label: "Office building", keywords: ["company", "account", "business"] },
  { value: "🌍", label: "Globe", keywords: ["world", "region", "country"] },
  { value: "📍", label: "Location", keywords: ["place", "address", "map"] },
  { value: "📧", label: "Email", keywords: ["mail", "message"] },
  { value: "📞", label: "Phone", keywords: ["call", "contact"] },
  { value: "💬", label: "Speech bubble", keywords: ["comment", "chat", "message"] },
  { value: "🔔", label: "Bell", keywords: ["notification", "reminder"] },
  { value: "🎉", label: "Party popper", keywords: ["celebrate", "win"] },
  { value: "❤️", label: "Red heart", keywords: ["love", "like"] },
  { value: "👍", label: "Thumbs up", keywords: ["approve", "like", "yes"] },
  { value: "🐛", label: "Bug", keywords: ["issue", "defect"] },
  { value: "🛠️", label: "Tools", keywords: ["settings", "build", "fix"] },
  { value: "🧪", label: "Test tube", keywords: ["experiment", "test", "beta"] },
  { value: "📦", label: "Package", keywords: ["box", "product", "shipping"] },
  { value: "🟢", label: "Green circle", keywords: ["status", "active", "ok"] },
  { value: "🟡", label: "Yellow circle", keywords: ["status", "pending"] },
  { value: "🔴", label: "Red circle", keywords: ["status", "blocked", "error"] },
  { value: "⚪", label: "White circle", keywords: ["status", "empty"] },
];

export interface IconPickerChange {
  /** The picked option's data-value; "" when the icon was removed. */
  value: string;
  /** "icon" for an option holding an SVG, "emoji" for one holding text; null when removed. */
  kind: IconPickerKind | null;
  /** The picked option, or null when removed. Clone its SVG or read its text to show the choice elsewhere. */
  option: HTMLButtonElement | null;
}

export interface ConnectIconPickerOptions {
  /** Called when an option is picked or the remove button is pressed. */
  onChange?: (change: IconPickerChange) => void;
  /** Mark the picked option with aria-pressed on click (default true). React passes false and renders it from value. */
  manageSelection?: boolean;
}

export interface IconPickerController {
  /** Press the option with this value (none for ""). */
  setValue(value: string): void;
  /** Filter the options as if this was typed into the search field. */
  filter(query: string): void;
  /** Re-read the options after rendering new ones. */
  refresh(): void;
  destroy(): void;
}

const kindOf = (option: HTMLElement): IconPickerKind => (option.querySelector("svg") ? "icon" : "emoji");

/**
 * Wire an .ayy-icon-picker: the search field filters options by aria-label, data-keywords and value; one option is the
 * roving tab stop and the arrow keys, Home and End move through the visible grid; clicking an option or the remove
 * button calls onChange and dispatches a bubbling "ayy-pick" event ({ value, kind, option }) from the root, which closes
 * a Menu the picker sits in. Keys stay inside the picker (Esc still reaches a surrounding menu or popover).
 */
export function connectIconPicker(root: HTMLElement, options: ConnectIconPickerOptions = {}): IconPickerController {
  const manage = options.manageSelection ?? true;
  const search = () => root.querySelector<HTMLInputElement>(`.${iconPickerSearchClass}`);
  const all = () => Array.from(root.querySelectorAll<HTMLButtonElement>(`.${iconPickerOptionClass}`));
  const visible = () => all().filter((el) => !el.hidden && !el.disabled);

  const roving = (target?: HTMLButtonElement) => {
    const list = visible();
    const stop = target && list.includes(target) ? target : (list.find((el) => el.getAttribute("aria-pressed") === "true") ?? list[0]);
    for (const el of all()) el.tabIndex = el === stop ? 0 : -1;
  };

  const press = (value: string) => {
    for (const el of all()) el.setAttribute("aria-pressed", String(value !== "" && el.dataset.value === value));
  };

  const filter = (query: string) => {
    const q = query.trim().toLocaleLowerCase();
    for (const el of all()) {
      const text = `${el.getAttribute("aria-label") ?? ""} ${el.dataset.keywords ?? ""} ${el.dataset.value ?? ""}`.toLocaleLowerCase();
      el.hidden = q !== "" && !text.includes(q);
    }
    for (const section of root.querySelectorAll<HTMLElement>(`.${iconPickerSectionClass}`)) {
      section.hidden = !section.querySelector(`.${iconPickerOptionClass}:not([hidden])`);
    }
    const empty = root.querySelector<HTMLElement>(`.${iconPickerEmptyClass}`);
    if (empty) empty.hidden = visible().length > 0;
    roving();
  };

  const pick = (option: HTMLButtonElement | null) => {
    const change: IconPickerChange = option
      ? { value: option.dataset.value ?? "", kind: kindOf(option), option }
      : { value: "", kind: null, option: null };
    if (manage) press(change.value);
    roving(option ?? undefined);
    options.onChange?.(change);
    root.dispatchEvent(new CustomEvent("ayy-pick", { detail: change, bubbles: true }));
  };

  // Columns in the grid an option sits in: the options sharing its row, read from their positions.
  const step = (from: HTMLButtonElement, down: boolean) => {
    const grid = Array.from(from.parentElement?.children ?? []).filter(
      (el): el is HTMLButtonElement => el instanceof HTMLButtonElement && !el.hidden && !el.disabled,
    );
    const columns = Math.max(1, grid.filter((el) => el.offsetTop === grid[0].offsetTop).length);
    const list = visible();
    const index = list.indexOf(from);
    const column = grid.indexOf(from) % columns;
    if (down) {
      const below = grid[grid.indexOf(from) + columns];
      if (below) return below;
      // Into the next section: the same column, or its last option.
      const next = list.slice(index + 1).find((el) => el.parentElement !== from.parentElement);
      if (!next) return null;
      const nextGrid = list.filter((el) => el.parentElement === next.parentElement);
      return nextGrid[Math.min(column, nextGrid.length - 1)];
    }
    const above = grid[grid.indexOf(from) - columns];
    if (above) return above;
    const previous = list.slice(0, index).reverse().find((el) => el.parentElement !== from.parentElement);
    if (!previous) return null;
    const prevGrid = list.filter((el) => el.parentElement === previous.parentElement);
    const lastRow = prevGrid.length - (prevGrid.length % columns || columns);
    return prevGrid[Math.min(lastRow + column, prevGrid.length - 1)];
  };

  const focus = (el: HTMLButtonElement | null | undefined) => {
    if (!el) return;
    roving(el);
    el.focus();
    el.scrollIntoView({ block: "nearest" });
  };

  const onKey = (event: KeyboardEvent) => {
    // Esc belongs to the menu or popover around the picker; every other key is the picker's.
    if (event.key === "Escape") return;
    event.stopPropagation();
    const target = event.target as HTMLElement;
    const field = search();
    if (target === field) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        focus(visible()[0]);
      } else if (event.key === "Enter") {
        event.preventDefault();
        const first = visible()[0];
        if (first) pick(first);
      }
      return;
    }
    const option = target.closest<HTMLButtonElement>(`.${iconPickerOptionClass}`);
    if (!option) return;
    const list = visible();
    const index = list.indexOf(option);
    const rtl = getComputedStyle(root).direction === "rtl";
    let next: HTMLButtonElement | null | undefined;
    switch (event.key) {
      case "ArrowRight": next = list[index + (rtl ? -1 : 1)]; break;
      case "ArrowLeft": next = list[index + (rtl ? 1 : -1)]; break;
      case "ArrowDown": next = step(option, true); break;
      case "ArrowUp":
        next = step(option, false);
        if (!next && field) {
          event.preventDefault();
          field.focus();
          return;
        }
        break;
      case "Home": next = list[0]; break;
      case "End": next = list.at(-1); break;
      default: return;
    }
    event.preventDefault();
    focus(next);
  };

  const onClick = (event: MouseEvent) => {
    const target = event.target as Element | null;
    const option = target?.closest<HTMLButtonElement>(`.${iconPickerOptionClass}`);
    if (option && root.contains(option) && !option.disabled) return pick(option);
    const remove = target?.closest<HTMLButtonElement>(`.${iconPickerRemoveClass}`);
    if (remove && root.contains(remove) && !remove.disabled) pick(null);
  };

  const onInput = (event: Event) => {
    if (event.target === search()) filter(search()!.value);
  };

  root.addEventListener("keydown", onKey);
  root.addEventListener("click", onClick);
  root.addEventListener("input", onInput);
  filter(search()?.value ?? "");

  return {
    setValue(value) {
      press(value);
      roving();
    },
    filter(query) {
      const field = search();
      if (field) field.value = query;
      filter(query);
    },
    refresh() {
      filter(search()?.value ?? "");
    },
    destroy() {
      root.removeEventListener("keydown", onKey);
      root.removeEventListener("click", onClick);
      root.removeEventListener("input", onInput);
    },
  };
}
