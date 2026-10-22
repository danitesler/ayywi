// Which input was used last, kept as data-ayy-input on <html>: "keyboard" after a key that moves focus, "pointer"
// after a mouse, pen or touch press. base.css hides focus rings in pointer mode. The browser's own :focus-visible
// guess shows one whenever script moves focus (a dialog opening, a menu focusing its first item, focus going back to
// the opener) unless the last focus came from a click, and WebKit (Safari, Tauri and other macOS web views) never
// focuses a button on click, so without this every click that opens something drew a ring.

/** Keys that move focus or a selection. Typing, Enter, Space and Esc leave the mode as it is. */
const NAVIGATION_KEYS = new Set([
  "Tab",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Home",
  "End",
  "PageUp",
  "PageDown",
]);

export type InputModality = "keyboard" | "pointer";

let stopTracking: (() => void) | null = null;

/** The input used last, or null when trackInputModality() isn't running. */
export function getInputModality(): InputModality | null {
  if (typeof document === "undefined") return null;
  const mode = document.documentElement.getAttribute("data-ayy-input");
  return mode === "keyboard" || mode === "pointer" ? mode : null;
}

/** Start keeping data-ayy-input on <html> in step, so focus rings show for keyboard use only. Starts in pointer mode;
    the first Tab or arrow key switches it. Safe to call twice and during SSR. Returns a function that stops it. */
export function trackInputModality(): () => void {
  if (typeof document === "undefined") return () => {};
  if (stopTracking) return stopTracking;
  const root = document.documentElement;
  const set = (mode: InputModality) => {
    if (root.getAttribute("data-ayy-input") !== mode) root.setAttribute("data-ayy-input", mode);
  };
  const onKeyDown = (event: KeyboardEvent) => {
    // Shift+Tab counts; Cmd/Ctrl/Alt combinations are shortcuts, not navigation.
    if (!event.metaKey && !event.ctrlKey && !event.altKey && NAVIGATION_KEYS.has(event.key)) set("keyboard");
  };
  const onPointerDown = () => set("pointer");
  if (!getInputModality()) set("pointer");
  // Capture phase, so a handler that stops propagation can't hide the input from us.
  document.addEventListener("keydown", onKeyDown, true);
  document.addEventListener("pointerdown", onPointerDown, true);
  stopTracking = () => {
    document.removeEventListener("keydown", onKeyDown, true);
    document.removeEventListener("pointerdown", onPointerDown, true);
    root.removeAttribute("data-ayy-input");
    stopTracking = null;
  };
  return stopTracking;
}
