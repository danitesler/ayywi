import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { chartColors, chartTheme, setDensity, setTheme, toast } from "@danitesler/ayywi";
import "@danitesler/ayywi/elements";
import "../../src/css/index.css";
import "./preview.css";

// Plain-HTML examples call window.ayywi.* exactly like pages using dist/elements.global.js.
Object.assign(window, { ayywi: { toast, setTheme, setDensity, chartColors, chartTheme } });

// ?app=<id> renders one showcase app on its own, for the device preview's iframe. Each is its own bundle, so the
// iframes on Get started and What you can build don't download the docs (every component's examples).
const showcaseApp = new URLSearchParams(window.location.search).get("app");
const root = createRoot(document.getElementById("root")!);

if (showcaseApp) {
  void import("./showcase/Frame").then(({ ShowcaseFrame }) =>
    root.render(
      <StrictMode>
        <ShowcaseFrame id={showcaseApp} />
      </StrictMode>,
    ),
  );
} else {
  void import("./App").then(({ App }) =>
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    ),
  );
}
