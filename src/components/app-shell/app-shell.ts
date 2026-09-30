import { ensureId } from "../../lib/element";
import { Menu01Icon } from "../../lib/icons";
import { iconSvg } from "../icon/icon";

export const appShellClass = "ayy-app-shell";
export const appShellSidebarClass = "ayy-app-shell__sidebar";
export const appShellBrandClass = "ayy-app-shell__brand";
export const appShellNavClass = "ayy-app-shell__nav";
export const appShellLinkClass = "ayy-app-shell__link";
export const appShellGroupClass = "ayy-app-shell__group";
export const appShellGroupLabelClass = "ayy-app-shell__group-label";
export const appShellListClass = "ayy-app-shell__list";
export const appShellSublistClass = "ayy-app-shell__sublist";
export const appShellCollapseClass = "ayy-app-shell__collapse";
export const appShellLinkSubClass = "ayy-app-shell__link--sub";
export const appShellFooterClass = "ayy-app-shell__footer";
export const appShellMainClass = "ayy-app-shell__main";
export const appShellBarClass = "ayy-app-shell__bar";
export const appShellToggleClass = "ayy-app-shell__toggle";

/** SVG markup for the menu icon (Hugeicons Menu01) the toggle draws, for non-React renderers. */
export const appShellMenuIcon = /* @__PURE__ */ iconSvg(Menu01Icon);

/** The drawer layout's breakpoint: below it, a shell with a __bar shows its sidebar as a drawer. */
const DRAWER_QUERY = "(max-width: 48rem)";

/**
 * Wires the phone drawer onto an `.ayy-app-shell` that has a `.ayy-app-shell__bar` with a `.ayy-app-shell__toggle` in it.
 * The toggle's aria-expanded is the state (the CSS reads it). Opening moves focus into the sidebar and makes the rest of the
 * shell inert; Esc, the scrim, a link in the sidebar or growing past the breakpoint close it. Returns a cleanup.
 */
export function connectAppShell(shell: HTMLElement): () => void {
  const toggle = () => shell.querySelector<HTMLElement>(`:scope > .${appShellBarClass} .${appShellToggleClass}`);
  const sidebar = () => shell.querySelector<HTMLElement>(`:scope > .${appShellSidebarClass}`);
  const isOpen = () => toggle()?.getAttribute("aria-expanded") === "true";
  const media = typeof matchMedia === "function" ? matchMedia(DRAWER_QUERY) : null;

  const init = toggle();
  const aside = sidebar();
  if (init && aside) {
    if (!init.hasAttribute("aria-expanded")) init.setAttribute("aria-expanded", "false");
    init.setAttribute("aria-controls", ensureId(aside, "ayy-sidebar"));
  }

  const set = (open: boolean, { returnFocus = true } = {}) => {
    const button = toggle();
    const panel = sidebar();
    if (!button || !panel) return;
    button.setAttribute("aria-expanded", String(open));
    // Everything but the bar (which holds the toggle) and the drawer goes inert while it's open.
    for (const child of Array.from(shell.children)) {
      if (child === panel || child.classList.contains(appShellBarClass)) continue;
      if (open) child.setAttribute("inert", "");
      else child.removeAttribute("inert");
    }
    if (open) panel.querySelector<HTMLElement>("a[href], button:not([disabled]), input, summary, [tabindex]:not([tabindex='-1'])")?.focus();
    else if (returnFocus && panel.contains(document.activeElement)) button.focus();
  };

  const onClick = (event: MouseEvent) => {
    const target = event.target as Element | null;
    if (!target) return;
    const button = toggle();
    if (button && button.contains(target)) return set(!isOpen());
    if (!isOpen()) return;
    if (target === shell) return set(false);
    const link = target.closest("a[href]");
    // A link in the drawer navigates; the page it opens takes the focus, so don't pull it back to the toggle.
    if (link && sidebar()?.contains(link)) set(false, { returnFocus: false });
  };

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && isOpen()) {
      event.preventDefault();
      set(false);
      toggle()?.focus();
    }
  };

  const onMedia = (event: MediaQueryListEvent) => {
    if (!event.matches && isOpen()) set(false, { returnFocus: false });
  };

  shell.addEventListener("click", onClick);
  document.addEventListener("keydown", onKeydown);
  media?.addEventListener("change", onMedia);
  return () => {
    shell.removeEventListener("click", onClick);
    document.removeEventListener("keydown", onKeydown);
    media?.removeEventListener("change", onMedia);
    if (isOpen()) set(false, { returnFocus: false });
  };
}
