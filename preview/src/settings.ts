import { useCallback, useEffect, useState } from "react";
import { DEFAULT_THEME_CUSTOMIZATION, getDensity, getTheme, setBrand, setDensity, setIconPack, setTheme, setThemeCustomization, surfaceStrength, type ThemeCustomization, type BrandInput, type DensityMode, type IconPackName, type ThemeMode } from "@danitesler/ayywi";

export type Renderer = "react" | "html";

function load<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    if (v && (allowed as readonly string[]).includes(v)) return v as T;
  } catch {
    // storage unavailable
  }
  return fallback;
}

function save(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // storage unavailable
  }
}

function usePersisted<T extends string>(key: string, allowed: readonly T[], fallback: T) {
  const [value, setValue] = useState<T>(() => load(key, allowed, fallback));
  const set = useCallback(
    (next: T) => {
      setValue(next);
      save(key, next);
    },
    [key],
  );
  return [value, set] as const;
}

/** The theme picked on the Themes page (brand, surfaces, icon pack) lasts for this tab only: a reload or a new tab starts
 * from Default. Older builds stored it, so those keys are cleared. */
const OLD_THEME_KEYS = ["ayy-preview-brand", "ayy-preview-theme-customization", "ayy-preview-custom-theme", "ayy-icons"];

export function useSettings() {
  useState(() => {
    try {
      for (const key of OLD_THEME_KEYS) localStorage.removeItem(key);
    } catch { /* storage unavailable */ }
  });
  const [theme, setThemeState] = useState<ThemeMode>(() => getTheme());
  const [customization, setCustomization] = useState<ThemeCustomization>(DEFAULT_THEME_CUSTOMIZATION);
  const [density, setDensityState] = useState<DensityMode>(() => getDensity());
  const [icons, setIcons] = useState<IconPackName>("hugeicons");
  const [renderer, setRenderer] = usePersisted<Renderer>("ayy-preview-renderer", ["react", "html"], "react");

  useEffect(() => setTheme(theme), [theme]);
  useEffect(() => setDensity(density), [density]);
  useEffect(() => setIconPack(icons, undefined, { persist: false }), [icons]);

  // The preview's brand: generated in the page, so any colour works without a stylesheet.
  const [brand, chooseBrand] = useState<BrandInput | null>(null);
  useEffect(() => {
    try {
      setBrand(brand);
    } catch {
      setBrand(null);
    }
  }, [brand]);
  useEffect(() => { setThemeCustomization(surfaceStrength(customization.surface) === 0 && customization.contrast === 0 && !customization.textColor && !customization.appearance ? null : customization, undefined, brand?.color ?? null); }, [customization, brand]);
  return { theme, setTheme: setThemeState, customization, setCustomization, density, setDensity: setDensityState, icons, setIcons, brand, setBrand: chooseBrand, renderer, setRenderer };
}
