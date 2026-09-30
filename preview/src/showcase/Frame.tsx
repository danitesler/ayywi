import { useLayoutEffect, type MouseEvent } from "react";
import { setDensity, setTheme } from "ayywi";
import { showcaseApps } from "./apps";

/** One showcase app on its own page (?app=<id>), loaded in the device preview's iframe so media queries see the device width. */
export function ShowcaseFrame({ id }: { id: string }) {
  const app = showcaseApps.find((a) => a.id === id);

  // Each app has its own look. Don't persist: the iframe shares localStorage with the docs.
  useLayoutEffect(() => {
    if (!app) return;
    setTheme(app.theme, document.documentElement, { persist: false });
    setDensity(app.density, document.documentElement, { persist: false });
    document.title = `${app.name} · ${app.kind} · ayywi`;
  }, [app]);

  // Links inside the mockups point at sections that don't exist; keep them from scrolling the frame.
  const onClick = (event: MouseEvent) => {
    if ((event.target as Element).closest('a[href^="#"]')) event.preventDefault();
  };

  if (!app) return <p className="ayy-muted">No example called “{id}”.</p>;
  return (
    <div className="pv-frame" onClick={onClick}>
      <app.Component />
    </div>
  );
}
