import { cx } from "../../lib/cx";
import { ArrowRight01Icon } from "../../lib/icons";
import { iconSvg } from "../icon/icon";

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

/** When a SettingsOption is chosen inside a Popover, update the trigger's label and close the popover. */
export function syncSettingsPicker(input: HTMLInputElement): void {
  if (!input.checked) return;
  const option = input.closest(".ayy-settings__option");
  if (!option) return;
  const popover = option.closest<HTMLElement>("[popover]");
  if (!popover) return;
  const caption = option.querySelector(".ayy-settings__caption")?.textContent?.trim();
  const preview = option.querySelector(".ayy-settings__preview");
  const trigger =
    (popover.id &&
      (document.querySelector<HTMLElement>(`[aria-controls="${popover.id}"]`) ??
        document.querySelector<HTMLElement>(`[popovertarget="${popover.id}"]`))) ||
    popover.closest("ayy-popover")?.querySelector<HTMLElement>("button");
  const triggerPreview = trigger?.querySelector(".ayy-settings__preview");
  if (preview && triggerPreview) triggerPreview.replaceWith(preview.cloneNode(true));
  const textNode = trigger && Array.from(trigger.childNodes).find((n) => n.nodeType === 3 && n.textContent?.trim());
  if (textNode && caption) textNode.textContent = caption;
  try {
    if (popover.matches(":popover-open")) popover.hidePopover();
  } catch {
    // Ignore when not open.
  }
}

/** The chevron at the end of a link row, as SVG markup (Hugeicons ArrowRight01, mirrored in RTL). */
export const settingsChevronIcon = /* @__PURE__ */ iconSvg(ArrowRight01Icon, { directional: true });
