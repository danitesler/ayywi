import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { setBrand, setDensity, setTheme, toast } from "ayywi";
import "ayywi/elements";
import "../../src/css/index.css";
import "../../src/css/brands/violet.css";
import "./preview.css";
import { App } from "./App";

// Plain-HTML examples call window.ayywi.* exactly like pages using dist/elements.global.js.
Object.assign(window, { ayywi: { toast, setTheme, setDensity, setBrand } });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
