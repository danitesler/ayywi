import { useEffect, useLayoutEffect, type MouseEvent } from "react";
import { setBrand, setDensity, setIconPack, setTheme, setThemeCustomization, surfaceStrength, THEME_PRESETS, type BrandInput, type ThemeMode } from "@danitesler/ayywi";
import { showcaseApps } from "./apps";

/** One showcase app on its own page (?app=<id>), loaded in the device preview's iframe so media queries see the device width. */
export function ShowcaseFrame({ id }: { id: string }) {
  const app = showcaseApps.find((a) => a.id === id);

  // Each app wears one of the Themes page's presets: its colours, fonts, corners and icon pack. Don't persist: the
  // iframe shares localStorage with the docs.
  useLayoutEffect(() => {
    if (!app) return;
    const root = document.documentElement;
    const preset = THEME_PRESETS.find((p) => p.id === app.preset) ?? THEME_PRESETS[0];
    const { customization } = preset;
    setTheme(app.theme, root, { persist: false });
    setDensity(app.density, root, { persist: false });
    setBrand(preset.brand, root);
    setThemeCustomization(surfaceStrength(customization.surface) === 0 && customization.contrast === 0 ? null : customization, root, preset.brand?.color ?? null);
    setIconPack(preset.icons ?? "hugeicons", root, { persist: false });
    document.title = `${app.kind} · ayywi`;
  }, [app]);

  // The Themes page restyles the app it shows: { type: "ayywi-look", theme, brand } from the page that holds this frame.
  useEffect(() => {
    const onMessage = (event: MessageEvent<{ type?: string; theme?: ThemeMode; brand?: BrandInput | null }>) => {
      if (event.origin !== window.location.origin || event.source !== window.parent || event.data?.type !== "ayywi-look") return;
      if (event.data.theme) setTheme(event.data.theme, document.documentElement, { persist: false });
      try {
        setBrand(event.data.brand ?? null);
      } catch {
        setBrand(null);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Links inside the mockups point at sections that don't exist; keep them from scrolling the frame.
  const onClick = (event: MouseEvent) => {
    if ((event.target as Element).closest('a[href^="#"]')) event.preventDefault();
  };

  if (!app) return <p className="ayy-muted">No example called “{id}”.</p>;
  return (
    // ayywi-lint-disable-next-line -- not an action: it stops the demo's in-page links from changing the route
    <div className="pv-frame" onClick={onClick}>
      <app.Component />
    </div>
  );
}
