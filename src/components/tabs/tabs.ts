export const tabsClass = "ayy-tabs";
export const tabsListClass = "ayy-tabs__list";
export const tabsTabClass = "ayy-tabs__tab";
export const tabsPanelClass = "ayy-tabs__panel";
export const tabsCountClass = "ayy-tabs__count";

export const tabsSizes = ["sm", "md", "lg"] as const;
export type TabsSize = (typeof tabsSizes)[number];

/** Add next to tabsClass on the root: `cx(tabsClass, tabsSizeClass("sm"))`. md is the default and adds nothing. */
export function tabsSizeClass(size?: TabsSize): string | undefined {
  return size && size !== "md" ? `ayy-tabs--${size}` : undefined;
}

/**
 * Next tab index for a key press, following the WAI-ARIA tabs pattern.
 * Arrow keys follow visual direction, so they flip in RTL. Returns null for keys tabs don't handle.
 */
export function nextTabIndex(key: string, current: number, count: number, rtl = false): number | null {
  if (count === 0) return null;
  const forward = rtl ? "ArrowLeft" : "ArrowRight";
  const backward = rtl ? "ArrowRight" : "ArrowLeft";
  if (key === forward) return (current + 1) % count;
  if (key === backward) return (current - 1 + count) % count;
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  return null;
}
