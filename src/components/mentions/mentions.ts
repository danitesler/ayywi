import { cx } from "../../lib/cx";
import { ensureId } from "../../lib/element";
import { autoPlace, supportsPopover } from "../../lib/position";
import { textareaClass, type TextareaClassOptions } from "../textarea/textarea";

export interface MentionsClassOptions {
  className?: string;
}

export function mentionsClass({ className }: MentionsClassOptions = {}): string {
  return cx("ayy-mentions", className);
}

export function mentionsTextareaClass(options: TextareaClassOptions = {}): string {
  return cx(textareaClass(options), "ayy-mentions__textarea");
}

export const mentionsAnchorClass = "ayy-mentions__anchor";
export const mentionsListboxClass = "ayy-combobox__listbox ayy-mentions__listbox";
export const mentionsOptionClass = "ayy-combobox__option ayy-mentions__option";
export const mentionsBodyClass = "ayy-mentions__body";
export const mentionsLabelClass = "ayy-mentions__label";
export const mentionsHandleClass = "ayy-mentions__handle";

export interface MentionInsertDetail {
  trigger: string;
  value: string;
  label: string;
  text: string;
}

export interface MentionsOptions {
  /** Characters that open the suggestions list. Default `["@"]`. */
  triggers?: string[];
  /** Called when an option is chosen and inserted into the textarea. */
  onMention?(detail: MentionInsertDetail): void;
}

export interface MentionsController {
  close(): void;
  refresh(): void;
  destroy(): void;
}

interface ActiveTrigger {
  trigger: string;
  index: number;
  query: string;
}

const BOUNDARY_BEFORE = /^[\s([{'"«„]$/;

function findActiveTrigger(text: string, caret: number, triggers: string[]): ActiveTrigger | null {
  for (let i = caret - 1; i >= 0; i--) {
    const ch = text[i];
    if (ch === "\n" || ch === "\r") return null;
    if (triggers.includes(ch)) {
      const before = i > 0 ? text[i - 1] : "";
      if (before !== "" && !BOUNDARY_BEFORE.test(before)) continue;
      const query = text.slice(i + 1, caret);
      if (/^\s/.test(query) || /\s{2,}/.test(query) || (query.match(/\s/g)?.length ?? 0) > 1) return null;
      return { trigger: ch, index: i, query };
    }
  }
  return null;
}

/** Measure the pixel offset of `index` inside `textarea` and place `anchor` there. */
function placeAnchorAtTrigger(textarea: HTMLTextAreaElement, anchor: HTMLElement, index: number): void {
  const style = getComputedStyle(textarea);
  const mirror = document.createElement("div");
  mirror.setAttribute("aria-hidden", "true");
  mirror.style.position = "fixed";
  mirror.style.top = "-9999px";
  mirror.style.left = "-9999px";
  mirror.style.visibility = "hidden";
  mirror.style.pointerEvents = "none";
  mirror.style.whiteSpace = "pre-wrap";
  mirror.style.overflowWrap = "break-word";
  mirror.style.boxSizing = "border-box";
  mirror.style.width = `${textarea.clientWidth}px`;
  for (const prop of [
    "fontFamily",
    "fontSize",
    "fontWeight",
    "fontStyle",
    "letterSpacing",
    "lineHeight",
    "textTransform",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth",
    "direction",
    "textAlign",
  ] as const) {
    mirror.style[prop] = style[prop];
  }
  mirror.append(document.createTextNode(textarea.value.slice(0, index)));
  const marker = document.createElement("span");
  marker.textContent = textarea.value[index] || "@";
  mirror.append(marker);
  document.body.append(mirror);

  const top = textarea.offsetTop + marker.offsetTop - textarea.scrollTop;
  const left = textarea.offsetLeft + marker.offsetLeft - textarea.scrollLeft;
  const height = marker.offsetHeight || 20;
  mirror.remove();

  const clampedTop = Math.max(textarea.offsetTop, Math.min(top, textarea.offsetTop + textarea.clientHeight - height));
  const clampedLeft = Math.max(textarea.offsetLeft, Math.min(left, textarea.offsetLeft + textarea.clientWidth));
  anchor.style.insetBlockStart = `${Math.round(clampedTop)}px`;
  anchor.style.insetInlineStart = "auto";
  anchor.style.left = `${Math.round(clampedLeft)}px`;
  anchor.style.blockSize = `${Math.round(height)}px`;
}

/**
 * Wire inline `@` (or `#`) mentions onto a plain `.ayy-mentions` wrapper containing a `<textarea>` and
 * `.ayy-mentions__listbox` of `[role="option"]` items. Opens at the caret when a trigger is typed after whitespace
 * or start-of-line (never inside an email address), filters as you type, navigates with arrows, and inserts on Enter/Tab/click.
 */
export function connectMentions(root: HTMLElement, options: MentionsOptions = {}): MentionsController {
  const textarea = root.querySelector<HTMLTextAreaElement>("textarea");
  const listbox = root.querySelector<HTMLElement>(".ayy-mentions__listbox");
  if (!textarea || !listbox) return { close() {}, refresh() {}, destroy() {} };

  let anchor = root.querySelector<HTMLElement>(".ayy-mentions__anchor");
  if (!anchor) {
    anchor = document.createElement("span");
    anchor.className = mentionsAnchorClass;
    anchor.setAttribute("aria-hidden", "true");
    root.insertBefore(anchor, listbox);
  }

  const triggers = options.triggers?.length ? options.triggers : ["@"];
  const native = supportsPopover();
  let activeOption: HTMLElement | null = null;
  let currentMatch: ActiveTrigger | null = null;
  let dismissedIndex = -1;
  let stopPlacing: (() => void) | null = null;
  let openState = false;

  ensureId(listbox, "ayy-mentions");
  textarea.setAttribute("aria-autocomplete", "list");
  textarea.setAttribute("aria-controls", listbox.id);
  listbox.setAttribute("role", "listbox");
  if (!listbox.hasAttribute("aria-label") && !listbox.hasAttribute("aria-labelledby")) {
    listbox.setAttribute("aria-label", "Suggestions");
  }
  if (native && !listbox.hasAttribute("popover")) listbox.setAttribute("popover", "manual");
  if (!native) listbox.hidden = true;

  const allOptions = () => Array.from(listbox.querySelectorAll<HTMLElement>('[role="option"]'));
  const visibleOptions = () => allOptions().filter((el) => !el.hidden && el.getAttribute("aria-disabled") !== "true");

  const setActive = (option: HTMLElement | null) => {
    activeOption = option;
    for (const el of allOptions()) {
      el.setAttribute("aria-selected", String(el === option));
    }
    if (option) {
      ensureId(option, "ayy-mention-opt");
      textarea.setAttribute("aria-activedescendant", option.id);
      option.scrollIntoView?.({ block: "nearest" });
    } else {
      textarea.removeAttribute("aria-activedescendant");
    }
  };

  const close = () => {
    if (!openState) return;
    openState = false;
    currentMatch = null;
    setActive(null);
    stopPlacing?.();
    stopPlacing = null;
    if (native) {
      if (listbox.matches(":popover-open")) listbox.hidePopover();
    } else {
      listbox.hidden = true;
    }
  };

  const update = () => {
    if (textarea.disabled || textarea.readOnly || textarea.selectionStart !== textarea.selectionEnd) {
      close();
      return;
    }
    const caret = textarea.selectionStart ?? 0;
    const match = findActiveTrigger(textarea.value, caret, triggers);
    if (!match) {
      dismissedIndex = -1;
      close();
      return;
    }
    if (match.index === dismissedIndex) return;
    if (!openState && /\s$/.test(match.query)) return;
    dismissedIndex = -1;

    const q = match.query.toLocaleLowerCase();
    for (const opt of allOptions()) {
      const optTrigger = opt.dataset.trigger ?? triggers[0];
      const label = opt.dataset.label ?? opt.textContent?.trim() ?? "";
      const val = opt.dataset.value ?? label;
      const haystack = `${label} ${val} ${opt.dataset.keywords ?? ""}`.toLocaleLowerCase();
      opt.hidden = optTrigger !== match.trigger || (q !== "" && !haystack.includes(q));
    }

    const vis = visibleOptions();
    if (!vis.length) {
      close();
      return;
    }

    currentMatch = match;
    placeAnchorAtTrigger(textarea, anchor!, match.index);

    if (!openState) {
      openState = true;
      if (native) {
        if (!listbox.matches(":popover-open")) listbox.showPopover();
      } else {
        listbox.hidden = false;
      }
      stopPlacing = autoPlace(listbox, anchor!, { side: "bottom", align: "start", offset: 4 });
    } else {
      stopPlacing?.();
      stopPlacing = autoPlace(listbox, anchor!, { side: "bottom", align: "start", offset: 4 });
    }

    if (!activeOption || !vis.includes(activeOption)) {
      setActive(vis[0]);
    }
  };

  const choose = (option: HTMLElement) => {
    if (!currentMatch || option.getAttribute("aria-disabled") === "true") return;
    const caret = textarea.selectionStart ?? textarea.value.length;
    const val = option.dataset.value ?? option.dataset.label ?? option.textContent?.trim() ?? "";
    const label = option.dataset.label ?? val;
    const trigger = currentMatch.trigger;
    const before = textarea.value.slice(0, currentMatch.index);
    const after = textarea.value.slice(caret);
    const inserted = `${trigger}${val} `;
    const nextText = `${before}${inserted}${after.startsWith(" ") ? after.slice(1) : after}`;
    const nextCaret = before.length + inserted.length;

    dismissedIndex = currentMatch.index;
    close();

    const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set;
    if (setter) setter.call(textarea, nextText);
    else textarea.value = nextText;
    textarea.setSelectionRange(nextCaret, nextCaret);
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    options.onMention?.({ trigger, value: val, label, text: nextText });
    textarea.focus();
  };

  const move = (step: 1 | -1) => {
    const vis = visibleOptions();
    if (!vis.length) return;
    const idx = activeOption ? vis.indexOf(activeOption) : -1;
    const next = idx < 0 ? 0 : (idx + step + vis.length) % vis.length;
    setActive(vis[next]);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (!openState || event.defaultPrevented || event.isComposing || event.keyCode === 229) return;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        move(1);
        return;
      case "ArrowUp":
        event.preventDefault();
        move(-1);
        return;
      case "Enter":
      case "Tab":
        if (activeOption) {
          event.preventDefault();
          choose(activeOption);
        }
        return;
      case "Escape":
        event.preventDefault();
        event.stopPropagation();
        dismissedIndex = currentMatch?.index ?? -1;
        close();
        return;
    }
  };

  const onInput = () => update();
  const onClickTextarea = () => update();
  const onKeyUp = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "Home" || event.key === "End") {
      update();
    }
  };
  const onBlur = () => close();
  const onListPointerDown = (event: PointerEvent) => event.preventDefault();
  const onListClick = (event: MouseEvent) => {
    const option = (event.target as Element | null)?.closest?.<HTMLElement>('[role="option"]');
    if (option && listbox.contains(option)) choose(option);
  };

  textarea.addEventListener("input", onInput);
  textarea.addEventListener("keydown", onKeyDown);
  textarea.addEventListener("keyup", onKeyUp);
  textarea.addEventListener("click", onClickTextarea);
  textarea.addEventListener("blur", onBlur);
  listbox.addEventListener("pointerdown", onListPointerDown);
  listbox.addEventListener("click", onListClick);

  return {
    close,
    refresh() {
      if (openState) update();
    },
    destroy() {
      close();
      textarea.removeEventListener("input", onInput);
      textarea.removeEventListener("keydown", onKeyDown);
      textarea.removeEventListener("keyup", onKeyUp);
      textarea.removeEventListener("click", onClickTextarea);
      textarea.removeEventListener("blur", onBlur);
      listbox.removeEventListener("pointerdown", onListPointerDown);
      listbox.removeEventListener("click", onListClick);
    },
  };
}
