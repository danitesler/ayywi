import { themeBase, themes, type ThemeName } from "./tokens";

/** A theme name ("dark", "light", "dark-soft", "light-soft"), or "system" to follow the OS. */
export type ThemeMode = ThemeName | "system";
/** The theme an element actually renders in. */
export type ResolvedTheme = ThemeName;
/** The base scheme of a theme: what charts, canvas and native widgets need to know. */
export type ColorScheme = "light" | "dark";
export type DensityMode = "compact" | "comfortable" | "touch" | "auto";

export const THEME_STORAGE_KEY = "ayy-theme";
export const DENSITY_STORAGE_KEY = "ayy-density";

const THEMES: readonly string[] = [...themes, "system"];
const DENSITIES: readonly string[] = ["compact", "comfortable", "touch", "auto"];

function store(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // storage can be unavailable (private mode, sandboxed iframes)
  }
}

function read<T extends string>(key: string, allowed: readonly string[], fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored && allowed.includes(stored)) return stored as T;
  } catch {
    // ignore
  }
  return fallback;
}

/**
 * Force a theme on `target` (default: <html>). "system" removes the override so the OS preference applies.
 * Any element can carry its own theme, so this also works for a single themed section.
 */
export function setTheme(mode: ThemeMode, target: HTMLElement = document.documentElement, options: { persist?: boolean } = {}): void {
  if (mode === "system") target.removeAttribute("data-theme");
  else target.setAttribute("data-theme", mode);
  if (options.persist ?? target === document.documentElement) store(THEME_STORAGE_KEY, mode);
}

/** The stored theme preference, or "system". */
export function getTheme(): ThemeMode {
  return read<ThemeMode>(THEME_STORAGE_KEY, THEMES, "system");
}

/** What `el` actually renders as right now: the nearest forced theme, else the OS preference. */
export function getResolvedTheme(el: Element = document.documentElement): ResolvedTheme {
  const forced = el.closest("[data-theme]")?.getAttribute("data-theme");
  if (forced && (themes as readonly string[]).includes(forced)) return forced as ThemeName;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

/** "light" or "dark": the scheme `el` renders in (dark-soft counts as dark). */
export function getColorScheme(el: Element = document.documentElement): ColorScheme {
  return themeBase[getResolvedTheme(el)];
}

/**
 * Set control density on `target` (default: <html>). "auto" removes the override: compact on mouse/trackpad,
 * touch on touch-first devices.
 */
export function setDensity(mode: DensityMode, target: HTMLElement = document.documentElement, options: { persist?: boolean } = {}): void {
  if (mode === "auto") target.removeAttribute("data-density");
  else target.setAttribute("data-density", mode);
  if (options.persist ?? target === document.documentElement) store(DENSITY_STORAGE_KEY, mode);
}

/** The stored density preference, or "auto". */
export function getDensity(): DensityMode {
  return read<DensityMode>(DENSITY_STORAGE_KEY, DENSITIES, "auto");
}

/**
 * Apply a brand (its stylesheet, ayywi/brands/<name>.css, must be loaded). Pass null to remove.
 * Brands are usually fixed per app, so this isn't persisted.
 */
export function setBrand(name: string | null, target: HTMLElement = document.documentElement): void {
  if (name) target.setAttribute("data-brand", name);
  else target.removeAttribute("data-brand");
}

/**
 * Inline this in <head> (before CSS paints) to apply a stored theme and density without a flash:
 * <script>{themeInitScript}</script>
 */
export const themeInitScript = `(function(){try{var d=document.documentElement,t=localStorage.getItem("${THEME_STORAGE_KEY}"),n=localStorage.getItem("${DENSITY_STORAGE_KEY}");if(${JSON.stringify(themes)}.indexOf(t)>-1)d.setAttribute("data-theme",t);if(n==="compact"||n==="comfortable"||n==="touch")d.setAttribute("data-density",n)}catch(e){}})();`;
