import { cx } from "../../lib/cx";
import { ArrowRight01Icon } from "../../lib/icons";
import { iconSvg } from "../icon/icon";
import { openSwatchColorPicker } from "../swatch/swatch";

export function settingsClass({ plain, className }: { plain?: boolean; className?: string } = {}): string {
  return cx("ayy-settings", plain && "ayy-settings--plain", className);
}

export function settingsRowClass({ stack, link, destructive, className }: { stack?: boolean; link?: boolean; destructive?: boolean; className?: string } = {}): string {
  return cx("ayy-settings__row", stack && "ayy-settings__row--stack", link && "ayy-settings__link", destructive && "ayy-settings__link--destructive", className);
}

/** Appearance pickers: a radiogroup of pictures (theme, corners, font) with captions. */
export const settingsPickerClass = "ayy-settings__picker";
export const settingsOptionClass = "ayy-settings__option";
export const settingsPreviewClass = "ayy-settings__preview";
export const settingsCaptionClass = "ayy-settings__caption";
/** A miniature app drawn from tokens; set data-theme / data-density on it to preview one. */
export const settingsScreenClass = "ayy-settings__screen";
/** What a SettingsScreen draws: the app (theme, corners, direction), rows (density) or brand (the primary colour's places). */
export const settingsScreenVariants = ["app", "rows", "brand"] as const;
export type SettingsScreenVariant = (typeof settingsScreenVariants)[number];

/** A custom colour Select's <input type="color">: the hidden one right after the select's wrapper, if there is one. Its
    data-value names the option it holds the colour of ("custom"). */
export function settingsColorInput(select: HTMLSelectElement): HTMLInputElement | null {
  const next = select.parentElement?.nextElementSibling;
  return next instanceof HTMLInputElement && next.type === "color" && next.dataset.value !== undefined ? next : null;
}

/** When the custom colour option is the chosen one, open ayywi's colour picker under the select. Call it once the
    options list has closed (on change, and on ayy-choose for choosing it again). */
export function openSettingsColor(select: HTMLSelectElement): void {
  const input = settingsColorInput(select);
  if (!input || select.value !== input.dataset.value || input.getAttribute("aria-expanded") === "true") return;
  openSwatchColorPicker(input, { anchor: select });
}

/** A custom colour changed: the brand screens and swatch in its option's picture show it. */
export function syncSettingsColor(input: HTMLInputElement): void {
  const wrapper = input.previousElementSibling;
  if (input.type !== "color" || !wrapper?.classList.contains("ayy-select")) return;
  for (const picture of wrapper.querySelectorAll<HTMLElement>(":scope > .ayy-select__picture")) {
    if (picture.dataset.value !== input.dataset.value) continue;
    for (const screen of picture.querySelectorAll<HTMLElement>(".ayy-settings__screen")) screen.style.setProperty("--ayy-color-primary", input.value);
    for (const swatch of picture.querySelectorAll<HTMLElement>(".ayy-swatch")) swatch.style.setProperty("--ayy-swatch", input.value);
  }
}

/** The chevron at the end of a link row, as SVG markup (Hugeicons ArrowRight01, mirrored in RTL). */
export const settingsChevronIcon = /* @__PURE__ */ iconSvg(ArrowRight01Icon, { name: "chevron-right", directional: true });
