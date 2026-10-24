import { cx } from "../../lib/cx";

export const inlineEditVariants = ["text", "title"] as const;
export type InlineEditVariant = (typeof inlineEditVariants)[number];

export interface InlineEditClassOptions {
  /** Title: heading font and size for a page or card title. Text (default): keeps the surrounding type. */
  variant?: InlineEditVariant;
  className?: string;
}

export function inlineEditClass({ variant = "text", className }: InlineEditClassOptions = {}): string {
  return cx("ayy-inline-edit", variant !== "text" && `ayy-inline-edit--${variant}`, className);
}

/** True while an IME (Japanese, Chinese, Korean…) is composing: Enter then belongs to the IME, not the field. */
export function isComposingEvent(event: { isComposing?: boolean; keyCode?: number }): boolean {
  return Boolean(event.isComposing) || event.keyCode === 229;
}

/** Enter commits one line; a multiline field commits on Mod+Enter (⌘ on Apple, Ctrl elsewhere) so Enter adds a line. */
export function commitsOnEnter(event: { key: string; metaKey?: boolean; ctrlKey?: boolean }, multiline = false): boolean {
  return event.key === "Enter" && (!multiline || Boolean(event.metaKey || event.ctrlKey));
}

/** Set a textarea's height to its content, borders included. */
export function growInlineEdit(field: HTMLTextAreaElement): void {
  field.style.blockSize = "auto";
  const borders = field.offsetHeight - field.clientHeight;
  field.style.blockSize = `${field.scrollHeight + borders}px`;
}

export interface InlineEditOptions {
  /** Called with the trimmed value after a commit, only when it differs from the old one. */
  onCommit?(value: string, previous: string): void;
  /** Called when Esc threw the draft away. */
  onCancel?(): void;
  /** Called when edit mode starts (true) and ends (false), however it ends. */
  onEditingChange?(editing: boolean): void;
  /** Trim the value on commit. Default true. */
  trim?: boolean;
}

export interface InlineEditController {
  /** Show the field, copy the raw value into it and focus it (all selected on one line, caret at the end on more). */
  start(): void;
  /** Save the field's value, end editing and put focus back on the display button. */
  commit(): void;
  /** Throw the draft away, end editing and put focus back on the display button. */
  cancel(): void;
  isEditing(): boolean;
  destroy(): void;
}

const DISPLAY = ".ayy-inline-edit__display";
const INPUT = ".ayy-inline-edit__input";
const TEXT = ".ayy-inline-edit__text";

/**
 * Wire an .ayy-inline-edit on plain markup: the __display button starts editing, __input is the field (an <input> or a
 * <textarea>, which grows with its content). Enter commits the first, Mod+Enter the second, Esc cancels, blur commits;
 * Enter during IME composition is left alone. The raw value lives in data-value and the displayed text may be formatted.
 * The controller edits the DOM itself and emits nothing; <ayy-inline-edit> turns its callbacks into events.
 */
export function connectInlineEdit(root: HTMLElement, options: InlineEditOptions = {}): InlineEditController {
  const display = root.querySelector<HTMLButtonElement>(DISPLAY);
  const field = root.querySelector<HTMLInputElement | HTMLTextAreaElement>(INPUT);
  const text = root.querySelector<HTMLElement>(TEXT);
  if (!display || !field) {
    return { start() {}, commit() {}, cancel() {}, isEditing: () => false, destroy() {} };
  }

  let editing = false;
  let previous = "";

  const raw = () => root.dataset.value ?? text?.textContent ?? display.textContent ?? "";
  const multiline = field instanceof HTMLTextAreaElement;

  const grow = () => {
    if (field instanceof HTMLTextAreaElement) growInlineEdit(field);
  };

  const show = (next: boolean) => {
    editing = next;
    display.hidden = next;
    field.hidden = !next;
  };

  const start = () => {
    if (editing || display.disabled || field.disabled) return;
    previous = raw();
    field.value = previous;
    show(true);
    grow();
    field.focus();
    if (field instanceof HTMLTextAreaElement) {
      field.setSelectionRange(field.value.length, field.value.length);
    } else {
      field.select();
    }
    options.onEditingChange?.(true);
  };

  const finish = (focusDisplay: boolean) => {
    if (!editing) return;
    const value = options.trim === false ? field.value : field.value.trim();
    show(false);
    field.value = value;
    // Only a real change rewrites the display: a no-op commit keeps formatted text (the app rewrites it from ayy-change
    // when it wants its own format back).
    if (value !== previous) {
      root.dataset.value = value;
      if (text) text.textContent = value;
      options.onCommit?.(value, previous);
    }
    options.onEditingChange?.(false);
    if (focusDisplay) display.focus();
  };

  const cancel = (focusDisplay = true) => {
    if (!editing) return;
    field.value = previous;
    show(false);
    options.onCancel?.();
    options.onEditingChange?.(false);
    if (focusDisplay) display.focus();
  };

  const onKeyDown = (event: Event) => {
    const key = event as KeyboardEvent;
    if (isComposingEvent(key)) return;
    if (key.key === "Escape") {
      event.preventDefault();
      cancel();
      return;
    }
    if (!commitsOnEnter(key, multiline)) return;
    event.preventDefault();
    finish(true);
  };
  const onInput = () => grow();
  // Blur saves the draft without pulling focus back, so Tab moves on.
  const onBlur = () => finish(false);

  display.addEventListener("click", start);
  field.addEventListener("keydown", onKeyDown);
  field.addEventListener("input", onInput);
  field.addEventListener("blur", onBlur);

  return {
    start,
    commit: () => finish(true),
    cancel: () => cancel(),
    isEditing: () => editing,
    destroy() {
      display.removeEventListener("click", start);
      field.removeEventListener("keydown", onKeyDown);
      field.removeEventListener("input", onInput);
      field.removeEventListener("blur", onBlur);
    },
  };
}
