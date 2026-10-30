import { useCallback, useEffect, useState } from "react";
import { DEFAULT_THEME_CUSTOMIZATION, getDensity, getIconPack, getTheme, setBrand, setDensity, setIconPack, setTheme, setThemeCustomization, createThemeCustomization, surfaceStrength, type ThemeCustomization, type BrandInput, type DensityMode, type IconPackName, type ThemeMode } from "@danitesler/ayywi";

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

const BRAND_KEY = "ayy-preview-brand";

function loadBrand(): BrandInput | null {
  try {
    const v = JSON.parse(localStorage.getItem(BRAND_KEY) ?? "null");
    return v && typeof v.name === "string" && typeof v.color === "string" ? v : null;
  } catch {
    return null;
  }
}

export function useSettings() {
  const [theme, setThemeState] = useState<ThemeMode>(() => getTheme());
  const [customization, setCustomizationState] = useState<ThemeCustomization>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("ayy-preview-theme-customization") ?? "null");
      // Surface used to be a tint strength (0–100) or "vivid": anything above 0 is Subtle now.
      const surface = typeof saved?.surface === "number" && Number.isFinite(saved.surface) && saved.surface >= 0 && saved.surface <= 100 ? (saved.surface > 0 ? "subtle" : "neutral") : saved?.surface === "vivid" ? "subtle" : saved?.surface;
      if (saved && /^#[0-9a-f]{6}$/i.test(saved.color) && ["neutral", "subtle"].includes(surface) && (saved.textColor === undefined || /^#[0-9a-f]{6}$/i.test(saved.textColor)) && Number.isFinite(saved.contrast) && saved.contrast >= 0 && saved.contrast <= 100) { const next = { ...saved, surface }; createThemeCustomization(next); return next; }
    } catch { /* storage unavailable */ }
    return DEFAULT_THEME_CUSTOMIZATION;
  });
  const setCustomization = useCallback((next: ThemeCustomization) => {
    setCustomizationState(next);
    save("ayy-preview-theme-customization", JSON.stringify(next));
  }, []);
  const [density, setDensityState] = useState<DensityMode>(() => getDensity());
  // The site's icon pack: setIconPack stores it, and index.html's inline script puts it back before the first paint.
  const [icons, setIcons] = useState<IconPackName>(() => getIconPack());
  const [renderer, setRenderer] = usePersisted<Renderer>("ayy-preview-renderer", ["react", "html"], "react");

  useEffect(() => setTheme(theme), [theme]);
  useEffect(() => setDensity(density), [density]);
  useEffect(() => setIconPack(icons), [icons]);

  // The preview's brand: generated in the page, so any colour works without a stylesheet.
  const [brand, setBrandState] = useState<BrandInput | null>(loadBrand);
  useEffect(() => {
    try {
      setBrand(brand);
    } catch {
      setBrand(null);
    }
  }, [brand]);
  useEffect(() => { setThemeCustomization(surfaceStrength(customization.surface) === 0 && customization.contrast === 0 && !customization.textColor && !customization.appearance ? null : customization, undefined, brand?.color ?? null); }, [customization, brand]);
  const chooseBrand = useCallback((next: BrandInput | null) => {
    setBrandState(next);
    save(BRAND_KEY, JSON.stringify(next));
  }, []);

  return { theme, setTheme: setThemeState, customization, setCustomization, density, setDensity: setDensityState, icons, setIcons, brand, setBrand: chooseBrand, renderer, setRenderer };
}
