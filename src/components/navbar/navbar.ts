import { ensureId } from "../../lib/element";
import { Menu01Icon } from "../../lib/icons";
import { iconSvg } from "../icon/icon";

export const navbarClass = "ayy-navbar";
export const navbarInnerClass = "ayy-navbar__inner";
export const navbarBrandClass = "ayy-navbar__brand";
export const navbarNavClass = "ayy-navbar__nav";
export const navbarLinkClass = "ayy-navbar__link";
export const navbarActionsClass = "ayy-navbar__actions";
export const navbarToggleClass = "ayy-navbar__toggle";

/** SVG markup for the menu icon (Hugeicons Menu01) the toggle draws, for non-React renderers. */
export const navbarMenuIcon = /* @__PURE__ */ iconSvg(Menu01Icon);

/** Below this width a navbar with a __toggle folds its links into a panel under the bar. */
const MENU_QUERY = "(max-width: 48rem)";

/**
 * Wires the phone menu onto an `.ayy-navbar` that has a `.ayy-navbar__toggle`: the toggle opens and closes a panel
 * with the `.ayy-navbar__nav` links under the bar. Its aria-expanded is the state (the CSS reads it). Esc, a click
 * outside the navbar, a link in the panel or widening past the breakpoint close it. Returns a cleanup.
 */
export function connectNavbar(navbar: HTMLElement): () => void {
  const toggle = () => navbar.querySelector<HTMLElement>(`.${navbarToggleClass}`);
  const nav = () => navbar.querySelector<HTMLElement>(`.${navbarNavClass}`);
  const isOpen = () => toggle()?.getAttribute("aria-expanded") === "true";
  const media = typeof matchMedia === "function" ? matchMedia(MENU_QUERY) : null;

  const init = toggle();
  const panel = nav();
  if (init && panel) {
    if (!init.hasAttribute("aria-expanded")) init.setAttribute("aria-expanded", "false");
    init.setAttribute("aria-controls", ensureId(panel, "ayy-navbar-menu"));
  }

  const set = (open: boolean) => toggle()?.setAttribute("aria-expanded", String(open));

  const onClick = (event: MouseEvent) => {
    const target = event.target as Element | null;
    if (!target) return;
    const button = toggle();
    if (button?.contains(target)) return set(!isOpen());
    // A link in the panel navigates (often to a section of the same page), so the panel gets out of the way.
    if (isOpen() && target.closest("a[href]") && nav()?.contains(target)) set(false);
  };

  const onDocumentClick = (event: MouseEvent) => {
    if (isOpen() && !navbar.contains(event.target as Node)) set(false);
  };

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key !== "Escape" || !isOpen()) return;
    event.preventDefault();
    const inside = navbar.contains(document.activeElement);
    set(false);
    if (inside) toggle()?.focus();
  };

  const onMedia = (event: MediaQueryListEvent) => {
    if (!event.matches && isOpen()) set(false);
  };

  navbar.addEventListener("click", onClick);
  document.addEventListener("click", onDocumentClick);
  document.addEventListener("keydown", onKeydown);
  media?.addEventListener("change", onMedia);
  return () => {
    navbar.removeEventListener("click", onClick);
    document.removeEventListener("click", onDocumentClick);
    document.removeEventListener("keydown", onKeydown);
    media?.removeEventListener("change", onMedia);
    set(false);
  };
}
