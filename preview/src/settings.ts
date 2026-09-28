import { useCallback, useEffect, useState } from "react";
import { getDensity, getTheme, setBrand, setDensity, setTheme, type DensityMode, type ThemeMode } from "ayywi";

export type Renderer = "react" | "html";
export type Direction = "ltr" | "rtl";
export type Brand = "default" | "violet";

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

export function useSettings() {
  const [theme, setThemeState] = useState<ThemeMode>(() => getTheme());
  const [density, setDensityState] = useState<DensityMode>(() => getDensity());
  const [renderer, setRenderer] = usePersisted<Renderer>("ayy-preview-renderer", ["react", "html"], "react");
  const [dir, setDir] = usePersisted<Direction>("ayy-preview-dir", ["ltr", "rtl"], "ltr");
  const [brand, setBrandState] = usePersisted<Brand>("ayy-preview-brand", ["default", "violet"], "default");

  useEffect(() => setTheme(theme), [theme]);
  useEffect(() => setDensity(density), [density]);
  useEffect(() => setBrand(brand === "default" ? null : brand), [brand]);

  return { theme, setTheme: setThemeState, density, setDensity: setDensityState, brand, setBrand: setBrandState, renderer, setRenderer, dir, setDir };
}

export function useHashRoute(): string {
  const read = () => decodeURIComponent(window.location.hash.replace(/^#\/?/, "")) || "";
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const onChange = () => {
      setRoute(read());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}
