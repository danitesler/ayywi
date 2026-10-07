import { cx } from "../../lib/cx";
import { Cancel01Icon } from "../../lib/icons";
import { connectCombobox, type ComboboxController } from "../combobox/combobox";
import { iconSvg } from "../icon/icon";
import type { InputSize } from "../input/input";

export function tagInputClass({ size = "md", suggestions, className }: { size?: InputSize; suggestions?: boolean; className?: string } = {}): string {
  return cx("ayy-tag-input", size !== "md" && `ayy-tag-input--${size}`, suggestions && "ayy-combobox", className);
}

export interface TagRules {
  /** Most tags allowed. */
  max?: number;
  /** Keep tags that differ only in case apart ("Design" and "design"). Default false. */
  caseSensitive?: boolean;
}

/** Split typed or pasted text into tags at commas and new lines, trimmed, empties dropped. */
export function splitTags(text: string): string[] {
  return text
    .split(/[,\n]/)
    .map((t) => t.trim())
    .filter(Boolean);
}

/** `values` with each of `add` appended unless it's already there (ignoring case unless caseSensitive) or max is reached. */
export function addTags(values: readonly string[], add: readonly string[], { max, caseSensitive = false }: TagRules = {}): string[] {
  const key = (t: string) => (caseSensitive ? t : t.toLocaleLowerCase());
  const seen = new Set(values.map(key));
  const out = [...values];
  for (const tag of add) {
    if (max !== undefined && out.length >= max) break;
    if (seen.has(key(tag))) continue;
    seen.add(key(tag));
    out.push(tag);
  }
  return out;
}

/** The × inside a tag, as SVG markup (Hugeicons Cancel01). */
export const tagRemoveIcon = /* @__PURE__ */ iconSvg(Cancel01Icon);

/** One tag's chip, as React's TagInput renders it. */
export function tagChip(value: string, removeLabel = (v: string) => `Remove ${v}`): HTMLSpanElement {
  const chip = document.createElement("span");
  chip.className = "ayy-chip ayy-chip--removable ayy-tag-input__tag";
  chip.dataset.value = value;
  chip.append(value);
  const button = document.createElement("button");
  button.type = "button";
  button.className = "ayy-chip__remove";
  button.setAttribute("aria-label", removeLabel(value));
  button.innerHTML = tagRemoveIcon;
  chip.append(button);
  return chip;
}

export interface TagInputControllerOptions extends TagRules {
  /** Called with every tag after one is added or removed. */
  onChange?: (values: string[]) => void;
  /** Form name: a hidden input per tag carries it. */
  name?: string;
  /** Accessible name of a tag's × button. Default "Remove <tag>". */
  removeLabel?: (value: string) => string;
  /** Spoken after a change. Defaults: "<tag> added", "<tag> removed". */
  addedText?: (value: string) => string;
  removedText?: (value: string) => string;
}

export interface TagInputController {
  values(): string[];
  setValues(values: string[]): void;
  destroy(): void;
}

/**
 * Wire a tag field on plain markup: the .ayy-tag-input root, its .ayy-tag-input__tag chips (data-value) and its
 * .ayy-tag-input__input. Enter or a comma adds what's typed, pasting "a, b" adds both, Backspace in an empty field
 * removes the last tag, a chip's × removes it, and every change is announced. With an .ayy-combobox__listbox inside,
 * its options are suggestions (already added ones get aria-disabled). Framework-free; used by <ayy-tag-input>.
 */
export function connectTagInput(root: HTMLElement, options: TagInputControllerOptions = {}): TagInputController {
  const input = root.querySelector<HTMLInputElement>(".ayy-tag-input__input");
  if (!input) return { values: () => [], setValues() {}, destroy() {} };
  const removeLabel = options.removeLabel ?? ((v: string) => `Remove ${v}`);
  const listbox = root.querySelector<HTMLElement>(".ayy-combobox__listbox");
  let combobox: ComboboxController | null = null;

  // A polite live region for "design added".
  const status = document.createElement("span");
  status.className = "ayy-sr-only";
  status.setAttribute("role", "status");
  root.append(status);
  const say = (text: string) => {
    status.textContent = "";
    requestAnimationFrame(() => (status.textContent = text));
  };

  const chips = () => Array.from(root.querySelectorAll<HTMLElement>(".ayy-tag-input__tag"));
  const values = () => chips().map((c) => c.dataset.value ?? c.textContent?.trim() ?? "");

  const syncAround = () => {
    if (options.name) {
      for (const h of root.querySelectorAll(`input[type="hidden"][data-tag]`)) h.remove();
      for (const v of values()) {
        const hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = options.name;
        hidden.value = v;
        hidden.dataset.tag = "";
        root.append(hidden);
      }
    }
    if (listbox) {
      const taken = new Set(values().map((v) => v.toLocaleLowerCase()));
      for (const option of listbox.querySelectorAll<HTMLElement>('[role="option"]')) {
        const v = (option.dataset.value ?? option.textContent?.trim() ?? "").toLocaleLowerCase();
        if (taken.has(v)) option.setAttribute("aria-disabled", "true");
        else option.removeAttribute("aria-disabled");
      }
      combobox?.refresh();
    }
  };

  const render = (next: string[]) => {
    for (const chip of chips()) chip.remove();
    for (const v of next) input.before(tagChip(v, removeLabel));
    syncAround();
  };

  const add = (text: string) => {
    const before = values();
    const next = addTags(before, splitTags(text), options);
    input.value = "";
    if (next.length === before.length) return;
    render(next);
    say(next.slice(before.length).map(options.addedText ?? ((v) => `${v} added`)).join(", "));
    options.onChange?.(next);
  };

  const remove = (chip: HTMLElement) => {
    const value = chip.dataset.value ?? "";
    chip.remove();
    syncAround();
    say((options.removedText ?? ((v) => `${v} removed`))(value));
    options.onChange?.(values());
    input.focus();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.defaultPrevented || event.isComposing) return;
    if ((event.key === "Enter" || event.key === ",") && input.value.trim()) {
      event.preventDefault();
      add(input.value);
    } else if (event.key === "Backspace" && input.value === "" && input.selectionStart === 0) {
      const last = chips().at(-1);
      if (last) {
        event.preventDefault();
        remove(last);
      }
    }
  };
  // A comma typed on a phone keyboard may not arrive as a keydown: split on input too.
  const onInput = () => {
    if (input.value.includes(",")) add(input.value);
  };
  const onPaste = (event: ClipboardEvent) => {
    const text = event.clipboardData?.getData("text") ?? "";
    if (!/[,\n]/.test(text)) return;
    event.preventDefault();
    add(input.value + text);
  };
  const onClick = (event: MouseEvent) => {
    const target = event.target as Element;
    const remover = target.closest(".ayy-chip__remove");
    if (remover && !input.disabled) {
      const chip = remover.closest<HTMLElement>(".ayy-tag-input__tag");
      if (chip) remove(chip);
      return;
    }
    if (target === root) input.focus();
  };
  // Adding what's typed when focus leaves, so a half-typed tag isn't lost.
  const onBlur = (event: FocusEvent) => {
    if (listbox?.contains(event.relatedTarget as Node)) return;
    if (input.value.trim()) add(input.value);
  };

  // Suggestions first, so Enter on a highlighted one picks it rather than adding the typed text.
  if (listbox) {
    combobox = connectCombobox(input, listbox, {
      onSelect: (option) => add(option.dataset.value ?? option.textContent?.trim() ?? ""),
    });
  }
  input.addEventListener("keydown", onKeyDown);
  input.addEventListener("input", onInput);
  input.addEventListener("paste", onPaste);
  input.addEventListener("blur", onBlur);
  root.addEventListener("click", onClick);
  // Chips in the HTML: give their × buttons a name, then forms and suggestions their state.
  for (const chip of chips()) {
    chip.querySelector(".ayy-chip__remove")?.setAttribute("aria-label", removeLabel(chip.dataset.value ?? ""));
  }
  syncAround();

  return {
    values,
    setValues(next) {
      render(addTags([], next, options));
    },
    destroy() {
      input.removeEventListener("keydown", onKeyDown);
      input.removeEventListener("input", onInput);
      input.removeEventListener("paste", onPaste);
      input.removeEventListener("blur", onBlur);
      root.removeEventListener("click", onClick);
      combobox?.destroy();
      status.remove();
    },
  };
}
