import { getColorScheme, setTheme } from "../../theme";
import type { ThemeName } from "../../tokens";

export const themeToggleClass = "ayy-theme-toggle";
export const themeToggleMoonClass = "ayy-theme-toggle__moon";
export const themeToggleSunClass = "ayy-theme-toggle__sun";

export interface ThemeToggleOptions {
  /** Theme used for dark. Default "dark". */
  dark?: ThemeName;
  /** Theme used for light. Default "light". */
  light?: ThemeName;
  /** Called with the theme just applied. */
  onChange?: (theme: ThemeName) => void;
}

/**
 * Makes `button` a dark-theme toggle: aria-pressed follows the colour scheme it renders in (OS preference included),
 * and a click switches <html> to the other theme and remembers it (setTheme). Framework-free; returns a cleanup.
 */
export function connectThemeToggle(button: HTMLElement, options: ThemeToggleOptions = {}): () => void {
  const sync = () => button.setAttribute("aria-pressed", String(getColorScheme(button) === "dark"));

  const onClick = () => {
    const next = getColorScheme(button) === "dark" ? (options.light ?? "light") : (options.dark ?? "dark");
    setTheme(next);
    sync();
    options.onChange?.(next);
  };

  const media = window.matchMedia("(prefers-color-scheme: light)");
  const observer = new MutationObserver(sync);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class"] });
  media.addEventListener("change", sync);
  button.addEventListener("click", onClick);
  sync();

  return () => {
    observer.disconnect();
    media.removeEventListener("change", sync);
    button.removeEventListener("click", onClick);
  };
}
