import { cx } from "../../lib/cx";
import { Cancel01Icon, Search01Icon } from "../../lib/icons";
import { iconSvg } from "../icon/icon";

export const searchBarSizes = ["sm", "md", "lg"] as const;
export type SearchBarSize = (typeof searchBarSizes)[number];

export function searchBarClass({ size = "md", className }: { size?: SearchBarSize; className?: string } = {}): string {
  return cx("ayy-search-bar", size !== "md" && `ayy-search-bar--${size}`, className);
}

/** The magnifier, as SVG markup (Hugeicons Search01). */
export const searchBarIcon = /* @__PURE__ */ iconSvg(Search01Icon, { name: "search" });
/** The clear button's ×, as SVG markup (Hugeicons Cancel01). */
export const searchBarClearIcon = /* @__PURE__ */ iconSvg(Cancel01Icon, { name: "x" });

/**
 * Clear the search field a .ayy-search-bar__clear button belongs to: empty it (unless it's disabled or read-only), fire "input" so filters update, and
 * put focus back in it. @danitesler/ayywi/elements calls this for every clear button on the page.
 */
export function clearSearchBar(button: Element): void {
  const input = button.closest(".ayy-search-bar__field")?.querySelector<HTMLInputElement>(".ayy-search-bar__input");
  if (!input || input.disabled || input.readOnly) return;
  input.value = "";
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.focus();
}
