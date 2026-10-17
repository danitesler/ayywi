import { themeBase, themes, type ThemeName } from "./tokens";

/** A theme name ("dark", "light", "dark-contrast", "light-gray"), or "system" to follow the OS. */
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
export function setTheme(mode: ThemeMode, target?: HTMLElement, options: { persist?: boolean } = {}): void {
  const el = target ?? (typeof document !== "undefined" ? document.documentElement : null);
  if (el) {
    if (mode === "system") el.removeAttribute("data-theme");
    else el.setAttribute("data-theme", mode);
  }
  if (options.persist ?? (el && typeof document !== "undefined" && el === document.documentElement)) store(THEME_STORAGE_KEY, mode);
}

/** The stored theme preference, or "system". */
export function getTheme(): ThemeMode {
  return read<ThemeMode>(THEME_STORAGE_KEY, THEMES, "system");
}

/** What `el` actually renders as right now: the nearest forced theme, else the OS preference. */
export function getResolvedTheme(target?: Element): ResolvedTheme {
  const el = target ?? (typeof document !== "undefined" ? document.documentElement : null);
  if (el) {
    const forcedEl = el.closest("[data-theme], .dark, .light");
    if (forcedEl) {
      const forced = forcedEl.getAttribute("data-theme");
      if (forced && (themes as readonly string[]).includes(forced)) return forced as ThemeName;
      if (forcedEl.classList.contains("dark")) return "dark";
      if (forcedEl.classList.contains("light")) return "light";
    }
  }
  if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  return "dark";
}

/** "light" or "dark": the scheme `el` renders in (dark-contrast counts as dark). */
export function getColorScheme(target?: Element): ColorScheme {
  return themeBase[getResolvedTheme(target)];
}

/**
 * Set control density on `target` (default: <html>). "auto" removes the override: compact on mouse/trackpad,
 * touch on touch-first devices.
 */
export function setDensity(mode: DensityMode, target?: HTMLElement, options: { persist?: boolean } = {}): void {
  const el = target ?? (typeof document !== "undefined" ? document.documentElement : null);
  if (el) {
    if (mode === "auto") el.removeAttribute("data-density");
    else el.setAttribute("data-density", mode);
  }
  if (options.persist ?? (el && typeof document !== "undefined" && el === document.documentElement)) store(DENSITY_STORAGE_KEY, mode);
}

/** The stored density preference, or "auto". */
export function getDensity(): DensityMode {
  return read<DensityMode>(DENSITY_STORAGE_KEY, DENSITIES, "auto");
}

/**
 * Inline this in <head> (before CSS paints) to apply a stored theme and density without a flash:
 * <script>{themeInitScript}</script>
 */
export const themeInitScript = `(function(){try{var d=document.documentElement,t=localStorage.getItem("${THEME_STORAGE_KEY}"),n=localStorage.getItem("${DENSITY_STORAGE_KEY}");if(${JSON.stringify(themes)}.indexOf(t)>-1)d.setAttribute("data-theme",t);if(n==="compact"||n==="comfortable"||n==="touch")d.setAttribute("data-density",n)}catch(e){}})();`;
