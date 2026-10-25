import { cx } from "../../lib/cx";
import { Copy01Icon } from "../../lib/icons";
import { autoPlace, supportsPopover } from "../../lib/position";
import {
  colorPickerAreaClass,
  colorPickerClassConstant,
  colorPickerCopyClass,
  colorPickerHandleClass,
  colorPickerHueClass,
  colorPickerInputsClass,
  colorPickerPreviewClass,
  colorPickerSlidersClass,
  connectColorPicker,
} from "../color-picker/color-picker";
import { iconSvg } from "../icon/icon";

export const colorSwatchSizes = ["sm", "md", "lg"] as const;
export type ColorSwatchSize = (typeof colorSwatchSizes)[number];

export const swatchSizes = colorSwatchSizes;
export type SwatchSize = ColorSwatchSize;

export interface ColorSwatchClassOptions {
  size?: ColorSwatchSize;
  /** "No colour": the surface with a diagonal stroke. */
  none?: boolean;
  /** Any colour: wraps an <input type="color">. */
  custom?: boolean;
  className?: string;
}
export type SwatchClassOptions = ColorSwatchClassOptions;

export function colorSwatchClass({ size = "md", none, custom, className }: ColorSwatchClassOptions = {}): string {
  return cx("ayy-swatch", size !== "md" && `ayy-swatch--${size}`, none && "ayy-swatch--none", custom && "ayy-swatch--custom", className);
}
export const swatchClass = colorSwatchClass;

export function colorSwatchGroupClass({ track, className }: { track?: boolean; className?: string } = {}): string {
  return cx("ayy-swatch-group", track && "ayy-swatch-group--track", className);
}
export const swatchGroupClass = colorSwatchGroupClass;

/** Show a custom swatch's picked colour: sets --ayy-swatch on the .ayy-swatch--custom around an <input type="color">. */
export function syncColorSwatch(input: HTMLInputElement): void {
  const swatch = input.closest<HTMLElement>(".ayy-swatch--custom");
  if (swatch && input.type === "color") swatch.style.setProperty("--ayy-swatch", input.value);
}
export const syncSwatch = syncColorSwatch;

let popoverCount = 0;
const dismissedBy = new WeakSet<HTMLInputElement>();

/**
 * Whether a custom swatch opens ayywi's ColorPicker popover rather than the OS picker: an enabled, editable
 * <input type="color"> inside .ayy-swatch--custom in a browser that supports the Popover API.
 */
export function usesColorPicker(input: HTMLInputElement): boolean {
  return (
    input.type === "color" &&
    Boolean(input.closest(".ayy-swatch--custom")) &&
    !input.disabled &&
    !input.readOnly &&
    supportsPopover()
  );
}

/**
 * Handle a mousedown, click or keydown on a custom swatch: open ayywi's ColorPicker in a popover rather than the OS picker
 * and call preventDefault(). Returns whether it did. Used by React SwatchCustom and the page-wide listener in
 * "@danitesler/ayywi/elements" (which skips events that are already defaultPrevented).
 */
export function openColorPickerFrom(event: MouseEvent | KeyboardEvent): boolean {
  const target = event.target as Element | null;
  const input =
    target instanceof HTMLInputElement && target.type === "color"
      ? target
      : target?.closest?.(".ayy-swatch--custom")?.querySelector<HTMLInputElement>("input[type='color']");
  if (!input || event.defaultPrevented || !usesColorPicker(input)) return false;

  if (event instanceof MouseEvent) {
    if (event.button !== 0) return false;
    // mousedown would open the OS picker: stop it and keep focus. The picker opens on click.
    if (event.type === "mousedown") {
      event.preventDefault();
      input.focus();
      return true;
    }
    if (event.type !== "click") return false;
    event.preventDefault();
    if (!dismissedBy.delete(input)) openSwatchColorPicker(input);
    return true;
  }

  const opens = event.key === " " || event.key === "Enter" || event.key === "ArrowDown" || event.key === "ArrowUp";
  if (event.type !== "keydown" || !opens || event.ctrlKey || event.metaKey) return false;
  event.preventDefault();
  openSwatchColorPicker(input);
  return true;
}

/**
 * Show ayywi's ColorPicker in a popover anchored to a custom swatch's <input type="color">, or to `anchor` (a hidden
 * input's button, as for a settings colour option), where focus also returns when it closes.
 * Updates the input's value and fires `input` and `change` events as the colour changes.
 * Esc, Enter or a click outside closes it. Returns a function that closes the popover.
 */
export function openSwatchColorPicker(input: HTMLInputElement, { anchor }: { anchor?: HTMLElement } = {}): () => void {
  const swatch = anchor ?? input.closest<HTMLElement>(".ayy-swatch--custom") ?? input;

  const popover = document.createElement("div");
  popover.id = `ayy-swatch-popover-${++popoverCount}`;
  popover.className = "ayy-swatch-popover";
  popover.setAttribute("role", "dialog");
  popover.setAttribute("popover", "auto");
  const label = input.getAttribute("aria-label") || input.labels?.[0]?.textContent?.trim() || "Color picker";
  popover.setAttribute("aria-label", label);

  const picker = document.createElement("div");
  picker.className = colorPickerClassConstant;

  const area = document.createElement("div");
  area.tabIndex = 0;
  area.setAttribute("role", "slider");
  area.setAttribute("aria-label", "Color saturation and brightness");
  area.setAttribute("aria-valuemin", "0");
  area.setAttribute("aria-valuemax", "100");
  area.className = colorPickerAreaClass;

  const handle = document.createElement("div");
  handle.className = colorPickerHandleClass;
  area.append(handle);

  const sliders = document.createElement("div");
  sliders.className = colorPickerSlidersClass;

  const preview = document.createElement("div");
  preview.className = colorPickerPreviewClass;
  preview.setAttribute("aria-hidden", "true");

  const sliderWrap = document.createElement("div");
  sliderWrap.style.flex = "1";
  sliderWrap.style.minInlineSize = "0";

  const hue = document.createElement("input");
  hue.type = "range";
  hue.min = "0";
  hue.max = "360";
  hue.className = colorPickerHueClass;
  hue.setAttribute("aria-label", "Hue");
  sliderWrap.append(hue);

  sliders.append(preview, sliderWrap);

  const inputs = document.createElement("div");
  inputs.className = colorPickerInputsClass;

  const group = document.createElement("div");
  group.className = "ayy-input-group ayy-input-group--sm";

  const addon = document.createElement("span");
  addon.className = "ayy-input-group__addon";
  addon.textContent = "HEX";

  const hex = document.createElement("input");
  hex.type = "text";
  hex.className = "ayy-input ayy-mono";
  hex.setAttribute("aria-label", "Hex color");
  hex.spellcheck = false;

  const tip = document.createElement("ayy-tooltip");
  tip.className = "ayy-tooltip";

  const copy = document.createElement("button");
  copy.type = "button";
  copy.className = `ayy-button ayy-button--ghost ayy-button--icon-sm ${colorPickerCopyClass}`;
  copy.setAttribute("aria-label", "Copy hex");
  copy.innerHTML = iconSvg(Copy01Icon);

  const tipContent = document.createElement("span");
  tipContent.className = "ayy-tooltip__content";
  tipContent.setAttribute("role", "tooltip");
  tipContent.textContent = "Copy hex";

  tip.append(copy, tipContent);
  group.append(addon, hex, tip);
  inputs.append(group);

  picker.append(area, sliders, inputs);
  popover.append(picker);

  // Inside a modal dialog or open popover, so the dialog doesn't make it inert and the popover stays open.
  let host: Element | null = null;
  try {
    host = swatch.closest("dialog[open], :popover-open");
  } catch {
    host = swatch.closest("dialog[open]");
  }
  (host ?? document.body).append(popover);

  popover.dir = getComputedStyle(swatch).direction;
  for (const attr of ["data-theme", "data-density", "data-brand"]) {
    const value = swatch.closest(`[${attr}]`)?.getAttribute(attr);
    if (value) popover.setAttribute(attr, value);
  }

  const controller = connectColorPicker(picker, {
    value: input.value || "#2563eb",
    alpha: false,
    onChange: (color) => {
      if (input.value.toLowerCase() !== color.toLowerCase()) {
        const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
        if (descriptor?.set) {
          descriptor.set.call(input, color);
        } else {
          input.value = color;
        }
        syncSwatch(input);
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    },
  });

  let stopPlacing: () => void = () => {};

  const close = () => {
    if (popover.matches(":popover-open")) popover.hidePopover();
  };

  area.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      close();
    }
  });

  hex.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      close();
    }
  });

  popover.addEventListener("beforetoggle", (event) => {
    if ((event as ToggleEvent).newState === "open") return;
    controller.destroy();
    stopPlacing();
    document.removeEventListener("pointerdown", onPointerDown, true);
    window.removeEventListener("resize", close);
    input.removeAttribute("aria-expanded");
    input.removeAttribute("aria-controls");
    swatch.removeAttribute("aria-expanded");
    if (popover.contains(document.activeElement) || document.activeElement === document.body) (anchor ?? input).focus();
    queueMicrotask(() => popover.remove());
  });

  const onPointerDown = (event: PointerEvent) => {
    if (event.target instanceof Node && (input.contains(event.target) || swatch.contains(event.target))) {
      dismissedBy.add(input);
    }
  };
  document.addEventListener("pointerdown", onPointerDown, true);
  window.addEventListener("resize", close);

  dismissedBy.delete(input);
  input.setAttribute("aria-expanded", "true");
  input.setAttribute("aria-controls", popover.id);
  swatch.setAttribute("aria-expanded", "true");
  popover.showPopover();
  stopPlacing = autoPlace(popover, swatch, { side: "bottom", align: "center", offset: 6 });
  area.focus();

  return close;
}
