import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { setDensity, setTheme, toast } from "ayywi";
import "ayywi/elements";
import "../../src/css/index.css";
import "./preview.css";
import { App } from "./App";
import { ShowcaseFrame } from "./showcase/Frame";

// Plain-HTML examples call window.ayywi.* exactly like pages using dist/elements.global.js.
Object.assign(window, { ayywi: { toast, setTheme, setDensity } });

// ?app=<id> renders one showcase app on its own, for the device preview's iframe.
const showcaseApp = new URLSearchParams(window.location.search).get("app");

createRoot(document.getElementById("root")!).render(
  <StrictMode>{showcaseApp ? <ShowcaseFrame id={showcaseApp} /> : <App />}</StrictMode>,
);
