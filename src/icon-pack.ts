import { iconPacks, type IconPackName } from "./icon-packs";
import { read, store } from "./lib/storage";

export const ICON_PACK_STORAGE_KEY = "ayy-icons";

/**
 * Choose the icon pack for `target` (default: <html>). The default pack, "hugeicons", removes the attribute; inside
 * another pack's subtree it sets "hugeicons" instead, which needs icons/hugeicons.css. Any other pack needs its
 * icons/<pack>.css. Persisted by default when `target` is <html>, like setTheme.
 */
export function setIconPack(pack: IconPackName, target?: HTMLElement, options: { persist?: boolean } = {}): void {
  const el = target ?? (typeof document !== "undefined" ? document.documentElement : null);
  if (el) {
    const inPack = pack === "hugeicons" && el.parentElement?.closest("[data-ayy-icons]");
    if (pack === "hugeicons" && !inPack) el.removeAttribute("data-ayy-icons");
    else el.setAttribute("data-ayy-icons", pack);
  }
  if (options.persist ?? (el && typeof document !== "undefined" && el === document.documentElement)) store(ICON_PACK_STORAGE_KEY, pack);
}

/** The stored icon pack, or "hugeicons". */
export function getIconPack(): IconPackName {
  return read<IconPackName>(ICON_PACK_STORAGE_KEY, iconPacks, "hugeicons");
}
