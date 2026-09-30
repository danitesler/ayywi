import { setTheme, type ThemeMode } from "../../theme";
import { themeBase, themes } from "../../tokens";
import { connectMenu } from "../menu/menu";

export const themeToggleClass = "ayy-theme-toggle";
export const themeToggleMoonClass = "ayy-theme-toggle__moon";
export const themeToggleSunClass = "ayy-theme-toggle__sun";
export const themeToggleItemClass = "ayy-theme-toggle__item";

/** "System" first, then each base theme followed by its variants (dark, dark soft, light, light gray), with display labels. */
export const themeToggleOptions: readonly { value: ThemeMode; label: string }[] = [
  { value: "system", label: "System" },
  ...[...themes]
    .sort((a, b) => themeBase[a].localeCompare(themeBase[b]) || Number(a !== themeBase[a]) - Number(b !== themeBase[b]) || a.localeCompare(b))
    .map((value) => ({ value, label: (value.charAt(0).toUpperCase() + value.slice(1)).replace(/-/g, " ") })),
];

export interface ThemeToggleOptions {
  /** Called with the theme just applied ("system" clears the override). */
  onChange?: (theme: ThemeMode) => void;
}

const isTheme = (value: string | null): value is ThemeMode =>
  value === "system" || (value !== null && (themes as readonly string[]).includes(value));

/**
 * Makes `button` open `menu`, a list of `menuitemradio` items whose data-value is a theme name or "system".
 * Choosing one applies it to <html> and remembers it (setTheme); aria-checked follows the theme in force, including
 * changes made elsewhere. Framework-free; returns a cleanup.
 */
export function connectThemeToggle(button: HTMLElement, menu: HTMLElement, options: ThemeToggleOptions = {}): () => void {
  const items = () => Array.from(menu.querySelectorAll<HTMLElement>('[role="menuitemradio"][data-value]'));
  const current = (): ThemeMode => {
    const forced = document.documentElement.getAttribute("data-theme");
    return isTheme(forced) ? forced : "system";
  };
  const sync = () => {
    const now = current();
    for (const item of items()) item.setAttribute("aria-checked", String(item.dataset.value === now));
  };

  const controller = connectMenu(button, menu, {
    align: "end",
    onSelect: (item) => {
      const value = item.dataset.value ?? null;
      if (!isTheme(value)) return;
      setTheme(value);
      sync();
      options.onChange?.(value);
    },
  });

  const observer = new MutationObserver(sync);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  sync();

  return () => {
    observer.disconnect();
    controller.destroy();
  };
}
