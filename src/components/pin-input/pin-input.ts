import { cx } from "../../lib/cx";
import type { InputSize } from "../input/input";

export const pinInputTypes = ["numeric", "alphanumeric"] as const;
export type PinInputType = (typeof pinInputTypes)[number];

export interface PinInputClassOptions {
  size?: InputSize;
  className?: string;
}

export function pinInputClass({ size = "md", className }: PinInputClassOptions = {}): string {
  return cx("ayy-pin-input", size !== "md" && `ayy-pin-input--${size}`, className);
}

export const pinInputGroupClass = "ayy-pin-input__group";
export const pinInputSeparatorClass = "ayy-pin-input__separator";
export const pinInputSlotClass = "ayy-pin-input__slot";

export interface PinInputOptions {
  /** Allowed characters: digits only ("numeric") or letters and digits ("alphanumeric"). Default "numeric". */
  type?: PinInputType;
  /** Called whenever the combined code changes. */
  onChange?(value: string): void;
  /** Called once every slot has a character. */
  onComplete?(value: string): void;
}

export interface PinInputController {
  value(): string;
  setValue(value: string): void;
  clear(): void;
  focus(index?: number): void;
  destroy(): void;
}

const NUMERIC = /^[0-9]$/;
const ALPHANUMERIC = /^[a-zA-Z0-9]$/;

/**
 * Wire a PIN / OTP input on plain markup (.ayy-pin-input containing .ayy-pin-input__slot inputs).
 * Typing advances to the next slot, Backspace clears or steps back, ArrowLeft/ArrowRight/Home/End move between slots,
 * and pasting or SMS autofill distributes valid characters across slots (ignoring spaces and dashes).
 */
export function connectPinInput(root: HTMLElement, options: PinInputOptions = {}): PinInputController {
  const slots = () => Array.from(root.querySelectorAll<HTMLInputElement>(".ayy-pin-input__slot"));
  const allow = (ch: string) => ((options.type ?? "numeric") === "alphanumeric" ? ALPHANUMERIC : NUMERIC).test(ch);
  const filterChars = (raw: string) => Array.from(raw).filter(allow);

  let previous = slots().map((s) => s.value.slice(0, 1));
  let lastReported = previous.join("");
  let lastCompleted = slots().length > 0 && previous.every((v) => v.length === 1) ? lastReported : "";

  const syncDomAttributes = () => {
    const list = slots();
    list.forEach((slot, index) => {
      // Allow SMS one-time-code autofill to drop the whole code into slot 0; the input handler distributes it.
      if (index === 0) slot.maxLength = Math.max(list.length, 1);
      else slot.maxLength = 2;
    });
  };
  syncDomAttributes();

  const focusSlot = (index: number) => {
    const list = slots();
    const target = list[Math.max(0, Math.min(index, list.length - 1))];
    if (!target || target.disabled) return;
    target.focus();
    target.select();
  };

  const commit = () => {
    const list = slots();
    previous = list.map((s) => s.value.slice(0, 1));
    const next = previous.join("");
    const complete = list.length > 0 && previous.every((v) => v.length === 1);
    if (!complete) lastCompleted = "";
    if (next !== lastReported) {
      lastReported = next;
      options.onChange?.(next);
    }
    if (complete && next !== lastCompleted) {
      lastCompleted = next;
      options.onComplete?.(next);
    }
  };

  const fillFrom = (startIndex: number, chars: string[]) => {
    const list = slots();
    if (!chars.length || !list.length) return;
    const from = chars.length >= list.length ? 0 : startIndex;
    let cursor = from;
    for (const ch of chars) {
      while (cursor < list.length && list[cursor].disabled) cursor++;
      if (cursor >= list.length) break;
      list[cursor].value = ch;
      cursor++;
    }
    commit();
    focusSlot(Math.min(cursor, list.length - 1));
  };

  const onInput = (event: Event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || !target.classList.contains("ayy-pin-input__slot")) return;
    const list = slots();
    const index = list.indexOf(target);
    if (index < 0) return;

    const inputEvent = event as InputEvent;
    const data = inputEvent.data ?? "";
    const raw = target.value;

    if (raw === "") {
      commit();
      return;
    }

    if (inputEvent.inputType === "insertText" && data.length === 1) {
      if (!allow(data)) {
        target.value = previous[index] ?? "";
        return;
      }
      target.value = data;
      commit();
      if (index + 1 < list.length) focusSlot(index + 1);
      return;
    }

    const chars = filterChars(data.length > 1 ? data : raw);
    if (!chars.length) {
      target.value = previous[index] ?? "";
      return;
    }
    target.value = previous[index] ?? "";
    fillFrom(index, chars);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.defaultPrevented || event.isComposing || event.keyCode === 229) return;
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || !target.classList.contains("ayy-pin-input__slot")) return;
    const list = slots();
    const index = list.indexOf(target);
    if (index < 0) return;

    switch (event.key) {
      case "Backspace":
        event.preventDefault();
        if (target.value) {
          target.value = "";
          commit();
        } else if (index > 0) {
          let prev = index - 1;
          while (prev > 0 && list[prev].disabled) prev--;
          if (!list[prev].disabled) {
            list[prev].value = "";
            commit();
            focusSlot(prev);
          }
        }
        return;
      case "Delete":
        event.preventDefault();
        if (target.value) {
          target.value = "";
          commit();
        }
        return;
      case "ArrowLeft":
        event.preventDefault();
        if (index > 0) focusSlot(index - 1);
        return;
      case "ArrowRight":
        event.preventDefault();
        if (index + 1 < list.length) focusSlot(index + 1);
        return;
      case "Home":
        event.preventDefault();
        focusSlot(0);
        return;
      case "End":
        event.preventDefault();
        focusSlot(list.length - 1);
        return;
    }
  };

  const onPaste = (event: ClipboardEvent) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || !target.classList.contains("ayy-pin-input__slot")) return;
    const list = slots();
    const index = list.indexOf(target);
    if (index < 0) return;
    event.preventDefault();
    const pasted = event.clipboardData?.getData("text") ?? "";
    const chars = filterChars(pasted);
    if (chars.length) fillFrom(index, chars);
  };

  const onFocus = (event: FocusEvent) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.classList.contains("ayy-pin-input__slot")) {
      requestAnimationFrame(() => target.select());
    }
  };

  root.addEventListener("input", onInput);
  root.addEventListener("keydown", onKeyDown);
  root.addEventListener("paste", onPaste);
  root.addEventListener("focusin", onFocus);

  return {
    value: () => slots().map((s) => s.value.slice(0, 1)).join(""),
    setValue(next: string) {
      const list = slots();
      const chars = filterChars(next);
      list.forEach((slot, i) => {
        slot.value = chars[i] ?? "";
      });
      previous = list.map((s) => s.value.slice(0, 1));
      lastReported = previous.join("");
      lastCompleted = list.length > 0 && previous.every((v) => v.length === 1) ? lastReported : "";
    },
    clear() {
      for (const slot of slots()) slot.value = "";
      commit();
    },
    focus(index = 0) {
      focusSlot(index);
    },
    destroy() {
      root.removeEventListener("input", onInput);
      root.removeEventListener("keydown", onKeyDown);
      root.removeEventListener("paste", onPaste);
      root.removeEventListener("focusin", onFocus);
    },
  };
}
