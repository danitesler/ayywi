import { cx } from "../../lib/cx";
import { Copy01Icon, Tick02Icon } from "../../lib/icons";
import { iconSvg } from "../icon/icon";

export interface HSV {
  /** Hue angle: 0–360 */
  h: number;
  /** Saturation: 0–100 */
  s: number;
  /** Value / Brightness: 0–100 */
  v: number;
  /** Alpha opacity: 0–1 */
  a?: number;
}

export interface RGB {
  /** Red channel: 0–255 */
  r: number;
  /** Green channel: 0–255 */
  g: number;
  /** Blue channel: 0–255 */
  b: number;
  /** Alpha opacity: 0–1 */
  a?: number;
}

export const colorPickerClassConstant = "ayy-color-picker";
export const colorPickerAreaClass = "ayy-color-picker__area";
export const colorPickerHandleClass = "ayy-color-picker__handle";
export const colorPickerSlidersClass = "ayy-color-picker__sliders";
export const colorPickerHueClass = "ayy-color-picker__hue";
export const colorPickerAlphaClass = "ayy-color-picker__alpha";
export const colorPickerPreviewClass = "ayy-color-picker__preview";
export const colorPickerInputsClass = "ayy-color-picker__inputs";
export const colorPickerCopyClass = "ayy-color-picker__copy";
export const colorPickerSwatchesClass = "ayy-color-picker__swatches";
export const colorPickerSwatchClass = "ayy-color-picker__swatch";

export function colorPickerClass({ className }: { className?: string } = {}): string {
  return cx(colorPickerClassConstant, className);
}

/** Convert HSV (h: 0–360, s: 0–100, v: 0–100, a?: 0–1) to RGB (r: 0–255, g: 0–255, b: 0–255, a?: 0–1). */
export function hsvToRgb({ h, s, v, a }: HSV): RGB {
  const normH = ((h % 360) + 360) % 360;
  const normS = Math.max(0, Math.min(100, s)) / 100;
  const normV = Math.max(0, Math.min(100, v)) / 100;

  const c = normV * normS;
  const x = c * (1 - Math.abs(((normH / 60) % 2) - 1));
  const m = normV - c;

  let r1 = 0;
  let g1 = 0;
  let b1 = 0;

  if (normH < 60) {
    r1 = c;
    g1 = x;
    b1 = 0;
  } else if (normH < 120) {
    r1 = x;
    g1 = c;
    b1 = 0;
  } else if (normH < 180) {
    r1 = 0;
    g1 = c;
    b1 = x;
  } else if (normH < 240) {
    r1 = 0;
    g1 = x;
    b1 = c;
  } else if (normH < 300) {
    r1 = x;
    g1 = 0;
    b1 = c;
  } else {
    r1 = c;
    g1 = 0;
    b1 = x;
  }

  const res: RGB = {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
  if (a !== undefined) {
    res.a = Math.round(Math.max(0, Math.min(1, a)) * 100) / 100;
  }
  return res;
}

/** Convert RGB (r: 0–255, g: 0–255, b: 0–255, a?: 0–1) to HSV (h: 0–360, s: 0–100, v: 0–100, a?: 0–1). */
export function rgbToHsv({ r, g, b, a }: RGB): HSV {
  const normR = Math.max(0, Math.min(255, r)) / 255;
  const normG = Math.max(0, Math.min(255, g)) / 255;
  const normB = Math.max(0, Math.min(255, b)) / 255;

  const max = Math.max(normR, normG, normB);
  const min = Math.min(normR, normG, normB);
  const delta = max - min;

  let h = 0;
  if (delta > 0) {
    if (max === normR) {
      h = 60 * (((normG - normB) / delta) % 6);
    } else if (max === normG) {
      h = 60 * ((normB - normR) / delta + 2);
    } else {
      h = 60 * ((normR - normG) / delta + 4);
    }
  }
  if (h < 0) h += 360;

  const s = max === 0 ? 0 : (delta / max) * 100;
  const v = max * 100;

  const res: HSV = {
    h: Math.round(h),
    s: Math.round(s),
    v: Math.round(v),
  };
  if (a !== undefined) {
    res.a = Math.round(Math.max(0, Math.min(1, a)) * 100) / 100;
  }
  return res;
}

/** Convert RGB (r: 0–255, g: 0–255, b: 0–255, a?: 0–1) to a hex colour string (#rrggbb or #rrggbbaa). */
export function rgbToHex({ r, g, b, a }: RGB): string {
  const clampByte = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  const toHex = (n: number) => clampByte(n).toString(16).padStart(2, "0");

  const baseHex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  if (a !== undefined && a < 1) {
    const alphaByte = clampByte(a * 255);
    return `${baseHex}${toHex(alphaByte)}`;
  }
  return baseHex;
}

/** Parse a hex colour string (#rgb, #rgba, #rrggbb, #rrggbbaa) to RGB (r: 0–255, g: 0–255, b: 0–255, a?: 0–1). */
export function hexToRgb(hex: string): RGB | null {
  const clean = hex.replace(/^#/, "").trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
    return { r, g, b };
  }
  if (clean.length === 4) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    const a = parseInt(clean[3] + clean[3], 16) / 255;
    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b) || Number.isNaN(a)) return null;
    return { r, g, b, a: Math.round(a * 100) / 100 };
  }
  if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
    return { r, g, b };
  }
  if (clean.length === 8) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    const a = parseInt(clean.slice(6, 8), 16) / 255;
    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b) || Number.isNaN(a)) return null;
    return { r, g, b, a: Math.round(a * 100) / 100 };
  }
  return null;
}

const HUE_TRACK_GRADIENT =
  "linear-gradient(to right, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%))";

export function colorPickerAreaBackground(hue: number): string {
  return `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))`;
}

export { HUE_TRACK_GRADIENT as colorPickerHueTrackBackground };

export interface ConnectColorPickerOptions {
  value?: string;
  alpha?: boolean;
  swatches?: string[];
  onChange?: (color: string) => void;
}

export interface ColorPickerController {
  setValue(color: string): void;
  update(options: Partial<ConnectColorPickerOptions>): void;
  destroy(): void;
}

/**
 * Wire an .ayy-color-picker element: 2D saturation/brightness area (pointer drag + arrow keys),
 * hue and optional alpha range sliders, hex input, and preset swatch buttons.
 */
export function connectColorPicker(root: HTMLElement, options: ConnectColorPickerOptions = {}): ColorPickerController {
  let currentHex = options.value ?? "#2563eb";
  let alpha = options.alpha ?? Boolean(root.querySelector(`.${colorPickerAlphaClass}`));
  let onChange = options.onChange;

  const parseHsv = (hex: string): HSV => {
    const rgb = hexToRgb(hex);
    if (!rgb) return { h: 217, s: 85, v: 92, a: 1 };
    const hsv = rgbToHsv(rgb);
    return { ...hsv, a: rgb.a ?? 1 };
  };

  let hsv: HSV = parseHsv(currentHex);

  const area = root.querySelector<HTMLElement>(`.${colorPickerAreaClass}`);
  const hueInput = root.querySelector<HTMLInputElement>(`.${colorPickerHueClass}`);
  const alphaInput = root.querySelector<HTMLInputElement>(`.${colorPickerAlphaClass}`);
  const hexInput = root.querySelector<HTMLInputElement>(`.${colorPickerInputsClass} input`);

  const syncSwatches = () => {
    for (const btn of root.querySelectorAll<HTMLButtonElement>(`.${colorPickerSwatchClass}`)) {
      const c = btn.dataset.color ?? btn.getAttribute("aria-label");
      if (c) btn.style.setProperty("--_swatch", c);
      btn.setAttribute("aria-pressed", String(c?.toLowerCase() === currentHex.toLowerCase()));
    }
  };

  const renderSwatches = (swatchesList?: readonly string[]) => {
    let group = root.querySelector<HTMLElement>(`.${colorPickerSwatchesClass}`);
    if (!swatchesList || swatchesList.length === 0) {
      group?.remove();
      return;
    }
    if (!group) {
      group = document.createElement("div");
      group.className = colorPickerSwatchesClass;
      group.setAttribute("role", "group");
      group.setAttribute("aria-label", "Preset colors");
      root.append(group);
    }
    group.replaceChildren(
      ...swatchesList.map((hex) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = colorPickerSwatchClass;
        btn.dataset.color = hex;
        btn.setAttribute("aria-label", hex);
        return btn;
      }),
    );
  };

  if (options.swatches && options.swatches.length > 0) {
    renderSwatches(options.swatches);
  }

  const syncDom = (updateHexInput = true) => {
    root.style.setProperty("--_hue", String(hsv.h));
    root.style.setProperty("--_area-bg", colorPickerAreaBackground(hsv.h));
    root.style.setProperty("--_hue-track", HUE_TRACK_GRADIENT);
    root.style.setProperty("--_x", `${hsv.s}%`);
    root.style.setProperty("--_y", `${100 - hsv.v}%`);
    root.style.setProperty("--_color", currentHex);
    if (area) {
      area.setAttribute("aria-valuenow", String(hsv.v));
      area.setAttribute("aria-valuetext", `Saturation ${hsv.s}%, Brightness ${hsv.v}%`);
    }
    if (hueInput) hueInput.value = String(hsv.h);
    if (alphaInput) alphaInput.value = String(Math.round((hsv.a ?? 1) * 100));
    if (hexInput && updateHexInput) hexInput.value = currentHex;
    syncSwatches();
  };

  const commitHsv = (next: HSV, updateHex = true) => {
    hsv = next;
    const rgb = hsvToRgb(hsv);
    if (!alpha) delete rgb.a;
    currentHex = rgbToHex(rgb);
    syncDom(updateHex);
    onChange?.(currentHex);
  };

  const pointerAt = (clientX: number, clientY: number) => {
    if (!area) return;
    const rect = area.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
    const s = Math.round((x / rect.width) * 100);
    const v = Math.round((1 - y / rect.height) * 100);
    commitHsv({ ...hsv, s, v });
  };

  const onAreaPointerDown = (event: PointerEvent) => {
    area?.setPointerCapture?.(event.pointerId);
    pointerAt(event.clientX, event.clientY);
  };

  const onAreaPointerMove = (event: PointerEvent) => {
    if (event.buttons !== 1) return;
    pointerAt(event.clientX, event.clientY);
  };

  const onAreaKeyDown = (event: KeyboardEvent) => {
    const step = event.shiftKey ? 10 : 1;
    let nextS = hsv.s;
    let nextV = hsv.v;
    if (event.key === "ArrowLeft") nextS = Math.max(0, hsv.s - step);
    else if (event.key === "ArrowRight") nextS = Math.min(100, hsv.s + step);
    else if (event.key === "ArrowUp") nextV = Math.min(100, hsv.v + step);
    else if (event.key === "ArrowDown") nextV = Math.max(0, hsv.v - step);
    else return;
    event.preventDefault();
    commitHsv({ ...hsv, s: nextS, v: nextV });
  };

  const onHueInput = () => {
    if (!hueInput) return;
    commitHsv({ ...hsv, h: hueInput.valueAsNumber });
  };

  const onAlphaInput = () => {
    if (!alphaInput) return;
    alpha = true;
    commitHsv({ ...hsv, a: alphaInput.valueAsNumber / 100 });
  };

  const onHexInput = () => {
    if (!hexInput) return;
    const rgb = hexToRgb(hexInput.value);
    if (!rgb) return;
    const nextHsv = rgbToHsv(rgb);
    const h = nextHsv.s === 0 || nextHsv.v === 0 ? hsv.h : nextHsv.h;
    hsv = { h, s: nextHsv.s, v: nextHsv.v, a: rgb.a ?? (hsv.a ?? 1) };
    currentHex = hexInput.value.startsWith("#") ? hexInput.value : `#${hexInput.value}`;
    syncDom(false);
    onChange?.(currentHex);
  };

  const onHexBlur = () => {
    if (hexInput) hexInput.value = currentHex;
  };

  const onClick = (event: MouseEvent) => {
    const swatch = (event.target as Element | null)?.closest?.<HTMLButtonElement>(`.${colorPickerSwatchClass}`);
    if (swatch && root.contains(swatch)) {
      const c = swatch.dataset.color ?? swatch.getAttribute("aria-label");
      if (!c) return;
      const rgb = hexToRgb(c);
      if (!rgb) return;
      const nextHsv = rgbToHsv(rgb);
      const h = nextHsv.s === 0 || nextHsv.v === 0 ? hsv.h : nextHsv.h;
      hsv = { h, s: nextHsv.s, v: nextHsv.v, a: rgb.a ?? 1 };
      currentHex = c;
      syncDom();
      onChange?.(currentHex);
      return;
    }
    const copyBtn = (event.target as Element | null)?.closest?.<HTMLButtonElement>(
      `.${colorPickerCopyClass}, [data-color-copy]`,
    );
    if (copyBtn && root.contains(copyBtn)) {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        void navigator.clipboard.writeText(currentHex);
      }
      try {
        if (typeof window !== "undefined") {
          const w = window as unknown as { ayywi?: { toast?: (msg: string) => void } };
          w.ayywi?.toast?.("Color copied to clipboard");
        }
      } catch {}
      copyBtn.innerHTML = iconSvg(Tick02Icon);
      copyBtn.setAttribute("aria-label", "Copied!");
      const tipContent = copyBtn.closest(".ayy-tooltip")?.querySelector(".ayy-tooltip__content");
      if (tipContent) tipContent.textContent = "Copied!";
      setTimeout(() => {
        copyBtn.innerHTML = iconSvg(Copy01Icon);
        copyBtn.setAttribute("aria-label", "Copy hex");
        if (tipContent) tipContent.textContent = "Copy hex";
      }, 2000);
      return;
    }
  };

  syncDom();
  area?.addEventListener("pointerdown", onAreaPointerDown);
  area?.addEventListener("pointermove", onAreaPointerMove);
  area?.addEventListener("keydown", onAreaKeyDown);
  hueInput?.addEventListener("input", onHueInput);
  alphaInput?.addEventListener("input", onAlphaInput);
  hexInput?.addEventListener("input", onHexInput);
  hexInput?.addEventListener("blur", onHexBlur);
  root.addEventListener("click", onClick);

  return {
    setValue(color: string) {
      const rgb = hexToRgb(color);
      if (!rgb) return;
      const nextHsv = rgbToHsv(rgb);
      const h = nextHsv.s === 0 || nextHsv.v === 0 ? hsv.h : nextHsv.h;
      hsv = { h, s: nextHsv.s, v: nextHsv.v, a: rgb.a ?? (hsv.a ?? 1) };
      currentHex = color;
      syncDom();
    },
    update(next) {
      if (next.alpha !== undefined) alpha = next.alpha;
      if (next.onChange) onChange = next.onChange;
      if (next.swatches !== undefined) {
        renderSwatches(next.swatches);
      }
      if (next.value !== undefined) this.setValue(next.value);
      else syncDom();
    },
    destroy() {
      area?.removeEventListener("pointerdown", onAreaPointerDown);
      area?.removeEventListener("pointermove", onAreaPointerMove);
      area?.removeEventListener("keydown", onAreaKeyDown);
      hueInput?.removeEventListener("input", onHueInput);
      alphaInput?.removeEventListener("input", onAlphaInput);
      hexInput?.removeEventListener("input", onHexInput);
      hexInput?.removeEventListener("blur", onHexBlur);
      root.removeEventListener("click", onClick);
    },
  };
}
