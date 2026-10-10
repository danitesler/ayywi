import { ensureId } from "../../lib/element";
import { ArrowLeft01Icon, Menu01Icon } from "../../lib/icons";
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
export const appShellSettingsClass = "ayy-app-shell--settings";
export const appShellBackClass = "ayy-app-shell__back";
export const appShellTitleClass = "ayy-app-shell__title";
export const appShellCollapsedClass = "ayy-app-shell--collapsed";
export const appShellHoverPreviewClass = "ayy-app-shell--hover-preview";

/** SVG markup for the menu icon (Hugeicons Menu01) the toggle draws, for non-React renderers. */
export const appShellMenuIcon = /* @__PURE__ */ iconSvg(Menu01Icon);

/** SVG markup for the settings shell's back arrow (Hugeicons ArrowLeft01), mirrored in RTL. */
export const appShellBackIcon = /* @__PURE__ */ iconSvg(ArrowLeft01Icon, { directional: true });

/** Esc here belongs to the text field (clearing, cancelling an edit) or to the overlay it's in. Switches and checkboxes don't keep it. */
const KEEPS_ESCAPE =
  "input:not([type='checkbox'], [type='radio'], [type='range'], [type='button'], [type='submit'], [type='reset'], [type='color']), textarea, select, [contenteditable]:not([contenteditable='false']), dialog, [popover], [role='dialog'], [role='menu'], [role='listbox']";

/** The drawer layout's breakpoint: below it, a shell with a __bar shows its sidebar as a drawer. */
const DRAWER_QUERY = "(max-width: 48rem)";

/** Where a drawer toggle may live: the phone bar, or the bottom nav (a "More" tab). */
const TOGGLE_SELECTOR = `:scope > .${appShellBarClass} .${appShellToggleClass}, :scope > .ayy-bottom-nav .${appShellToggleClass}`;

/** Where a sidebar collapse toggle may live. */
const SIDEBAR_TOGGLE_SELECTOR = `:scope > .${appShellSidebarClass} .${appShellToggleClass}`;

/** A dialog or a popover (menu, tooltip, picker; the toaster aside) is open, so Esc is its to handle. */
function overlayOpen(): boolean {
  if (document.querySelector("dialog[open]")) return true;
  try {
    return document.querySelector(":popover-open:not(.ayy-toaster)") !== null;
  } catch {
    return false;
  }
}

export interface ConnectAppShellOptions {
  /** Called when the sidebar is collapsed or expanded. */
  onCollapseChange?: (collapsed: boolean) => void;
}

/**
 * Wires the phone drawer and desktop sidebar collapsing onto an `.ayy-app-shell`.
 * - On phones: a toggle in `.ayy-app-shell__bar` or `.ayy-bottom-nav` opens/closes the sidebar as a drawer.
 * - On wide screens: a toggle in the sidebar or shell collapses/expands the sidebar into an icon rail.
 * - On a settings shell (`.ayy-app-shell--settings`), Esc follows its `.ayy-app-shell__back` out of settings.
 * Returns a cleanup.
 */
export function connectAppShell(shell: HTMLElement, options?: ConnectAppShellOptions): () => void {
  const toggle = () => shell.querySelector<HTMLElement>(TOGGLE_SELECTOR);
  const sidebar = () => shell.querySelector<HTMLElement>(`:scope > .${appShellSidebarClass}`);
  const sidebarToggles = () => Array.from(shell.querySelectorAll<HTMLElement>(SIDEBAR_TOGGLE_SELECTOR));
  const isOpen = () => toggle()?.getAttribute("aria-expanded") === "true";
  const media = typeof matchMedia === "function" ? matchMedia(DRAWER_QUERY) : null;

  const init = toggle();
  const aside = sidebar();
  if (init && aside) {
    if (!init.hasAttribute("aria-expanded")) init.setAttribute("aria-expanded", "false");
    init.setAttribute("aria-controls", ensureId(aside, "ayy-sidebar"));
  }

  if (aside) {
    for (const st of sidebarToggles()) {
      if (!st.hasAttribute("aria-expanded")) {
        st.setAttribute("aria-expanded", String(!shell.classList.contains(appShellCollapsedClass)));
      }
      st.setAttribute("aria-controls", ensureId(aside, "ayy-sidebar"));
    }
  }

  const syncSidebarToggles = (collapsed: boolean) => {
    for (const st of sidebarToggles()) {
      st.setAttribute("aria-expanded", String(!collapsed));
    }
  };

  const toggleCollapse = () => {
    const next = !shell.classList.contains(appShellCollapsedClass);
    shell.classList.toggle(appShellCollapsedClass, next);
    syncSidebarToggles(next);
    options?.onCollapseChange?.(next);
  };

  const set = (open: boolean, { returnFocus = true } = {}) => {
    const button = toggle();
    const panel = sidebar();
    if (!button || !panel) return;
    button.setAttribute("aria-expanded", String(open));
    // Everything but the drawer and the part that holds the toggle (the bar or the bottom nav) goes inert while it's open.
    for (const child of Array.from(shell.children)) {
      if (child === panel || child.contains(button)) continue;
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
    const stList = sidebarToggles();
    const clickedSidebarToggle = stList.find((t) => t.contains(target));

    if (clickedSidebarToggle) {
      if (media?.matches) {
        if (isOpen()) set(false);
      } else {
        toggleCollapse();
      }
      return;
    }

    if (button && button.contains(target)) {
      if (media?.matches) return set(!isOpen());
      toggleCollapse();
      return;
    }

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
      return;
    }
    if (
      event.key === "Escape" &&
      !isOpen() &&
      shell.classList.contains(appShellHoverPreviewClass) &&
      sidebar()?.contains(document.activeElement)
    ) {
      (document.activeElement as HTMLElement | null)?.blur();
    }
  };

  // Settings: Esc leaves, unless something else owns it. Runs in the capture phase, before menus and popovers close
  // themselves, so an open one is still seen as open.
  const onSettingsEscape = (event: KeyboardEvent) => {
    if (event.key !== "Escape" || event.defaultPrevented || !shell.classList.contains(appShellSettingsClass)) return;
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest(KEEPS_ESCAPE) || target?.closest("[aria-expanded='true']") || overlayOpen()) return;
    const back = shell.querySelector<HTMLElement>(`:scope > .${appShellSidebarClass} .${appShellBackClass}`);
    if (!back) return;
    event.preventDefault();
    back.click();
  };

  const onMedia = (event: MediaQueryListEvent) => {
    if (!event.matches && isOpen()) set(false, { returnFocus: false });
    if (!event.matches) {
      syncSidebarToggles(shell.classList.contains(appShellCollapsedClass));
    }
  };

  shell.addEventListener("click", onClick);
  document.addEventListener("keydown", onKeydown);
  document.addEventListener("keydown", onSettingsEscape, true);
  media?.addEventListener("change", onMedia);
  return () => {
    shell.removeEventListener("click", onClick);
    document.removeEventListener("keydown", onKeydown);
    document.removeEventListener("keydown", onSettingsEscape, true);
    media?.removeEventListener("change", onMedia);
    if (isOpen()) set(false, { returnFocus: false });
  };
}
