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
export const appShellHeadClass = "ayy-app-shell__head";
export const appShellCollapsedClass = "ayy-app-shell--collapsed";
export const appShellHoverPreviewClass = "ayy-app-shell--hover-preview";
export const appShellSmClass = "ayy-app-shell--sm";
export const appShellMdClass = "ayy-app-shell--md";
export const appShellDrawerClass = "ayy-app-shell--drawer";
export const appShellDetailClass = "ayy-app-shell__detail";
export const appShellResizeClass = "ayy-app-shell__resize";
export const appShellResizeDetailClass = "ayy-app-shell__resize--detail";
export const appShellResizingClass = "ayy-app-shell--resizing";

export const appShellSizes = ["sm", "md", "lg"] as const;
export type AppShellSize = (typeof appShellSizes)[number];

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

/** A `--drawer` shell may also keep its toggle in the main area (a Top bar of its own). */
const DRAWER_TOGGLE_SELECTOR = `${TOGGLE_SELECTOR}, :scope > .${appShellMainClass} .${appShellToggleClass}`;

/** Resize limits in px when the handle has no aria-valuemin / aria-valuemax, and what the main area must keep. */
const RESIZE_LIMITS = { sidebar: [192, 384], detail: [288, 640] } as const;
const MIN_MAIN = 320;
/** Arrow key step in px; Shift takes the big one. */
const RESIZE_STEP = 16;
const RESIZE_STEP_BIG = 64;

export type AppShellEdge = "sidebar" | "detail";

/** Set on the sidebar while the hover preview is held shut after a collapse. */
const HOLD = "data-ayy-hold";

/** The pointer is on the sidebar, or keyboard focus is in it: what opens the hover preview. */
function wouldPreview(aside: HTMLElement): boolean {
  try {
    return aside.matches(":hover, :has(:focus-visible)");
  } catch {
    return aside.matches(":hover");
  }
}

/** Where a sidebar collapse toggle may live. */
const SIDEBAR_TOGGLE_SELECTOR = `:scope > .${appShellSidebarClass} .${appShellToggleClass}`;

/** A dialog or a popover (menu, tooltip, picker; the toaster aside) is open, so Esc is its to handle. */
function overlayOpen(doc?: Document): boolean {
  const d = doc ?? (typeof document !== "undefined" ? document : null);
  if (!d) return false;
  if (d.querySelector("dialog[open]")) return true;
  try {
    return d.querySelector(":popover-open:not(.ayy-toaster)") !== null;
  } catch {
    return false;
  }
}

export interface ConnectAppShellOptions {
  /** Called when the sidebar is collapsed or expanded. */
  onCollapseChange?: (collapsed: boolean) => void;
  /**
   * Called when a drag or the keyboard ends a resize of the sidebar or the detail pane: `width` in px, or null when it
   * went back to the default (double click). Save it and set `--ayy-sidebar-w` / `--ayy-detail-w` to it on the next load.
   */
  onResize?: (edge: AppShellEdge, width: number | null) => void;
}

/**
 * Wires the phone drawer and desktop sidebar collapsing onto an `.ayy-app-shell`.
 * - On phones: a toggle in `.ayy-app-shell__bar` or `.ayy-bottom-nav` opens/closes the sidebar as a drawer.
 * - On wide screens: a toggle in the sidebar or shell collapses/expands the sidebar into an icon rail.
 * - On a settings shell (`.ayy-app-shell--settings`), Esc follows its `.ayy-app-shell__back` out of settings.
 * - A `.ayy-app-shell__resize` handle (a direct child of the shell) resizes the sidebar by dragging or with the arrow
 *   keys, and an `.ayy-app-shell__resize--detail` one the detail pane: they set `--ayy-sidebar-w` / `--ayy-detail-w` on
 *   the shell. Home / End jump to the limits, a double click goes back to the default.
 * Returns a cleanup.
 */
export function connectAppShell(shell: HTMLElement, options?: ConnectAppShellOptions): () => void {
  // Every toggle that can open the drawer: the bar's, the bottom nav's "More", and (with --drawer) the main area's.
  const drawerToggles = () =>
    Array.from(
      shell.querySelectorAll<HTMLElement>(shell.classList.contains(appShellDrawerClass) ? DRAWER_TOGGLE_SELECTOR : TOGGLE_SELECTOR),
    );
  const sidebar = () => shell.querySelector<HTMLElement>(`:scope > .${appShellSidebarClass}`);
  const sidebarToggles = () => Array.from(shell.querySelectorAll<HTMLElement>(SIDEBAR_TOGGLE_SELECTOR));
  const isOpen = () => drawerToggles().some((t) => t.getAttribute("aria-expanded") === "true");
  const media = typeof shell.ownerDocument.defaultView?.matchMedia === "function"
    ? shell.ownerDocument.defaultView.matchMedia(DRAWER_QUERY)
    : typeof matchMedia === "function"
      ? matchMedia(DRAWER_QUERY)
      : null;
  const doc = shell.ownerDocument;
  // The toggle that opened the drawer, so Esc and closing give the focus back to it.
  let opener: HTMLElement | null = null;

  const aside = sidebar();
  if (aside) {
    for (const button of drawerToggles()) {
      if (!button.hasAttribute("aria-expanded")) button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-controls", ensureId(aside, "ayy-sidebar"));
    }
  }

  if (aside) {
    for (const st of sidebarToggles()) {
      st.setAttribute("aria-expanded", String(!shell.classList.contains(appShellCollapsedClass)));
      st.setAttribute("aria-controls", ensureId(aside, "ayy-sidebar"));
    }
  }

  const syncSidebarToggles = (collapsed: boolean) => {
    for (const st of sidebarToggles()) {
      st.setAttribute("aria-expanded", String(!collapsed));
    }
  };

  // Collapsing from the sidebar's own toggle leaves the pointer (or focus) on the sidebar, which would open the hover
  // preview straight away. Hold it shut until the pointer leaves or focus moves to something else.
  const release = () => sidebar()?.removeAttribute(HOLD);
  const onPointerLeave = () => release();
  const onFocusIn = (event: FocusEvent) => {
    if (!sidebarToggles().some((t) => t.contains(event.target as Node))) release();
  };

  const toggleCollapse = () => {
    const next = !shell.classList.contains(appShellCollapsedClass);
    const aside = sidebar();
    if (next && aside && shell.classList.contains(appShellHoverPreviewClass) && wouldPreview(aside)) aside.setAttribute(HOLD, "");
    else release();
    shell.classList.toggle(appShellCollapsedClass, next);
    syncSidebarToggles(next);
    options?.onCollapseChange?.(next);
  };

  const set = (open: boolean, { returnFocus = true } = {}) => {
    const buttons = drawerToggles();
    const panel = sidebar();
    if (!buttons.length || !panel) return;
    for (const button of buttons) button.setAttribute("aria-expanded", String(open));
    // Everything but the drawer and the parts that hold a toggle (the bar, the bottom nav, the main area) goes inert.
    for (const child of Array.from(shell.children)) {
      if (child === panel || buttons.some((b) => child.contains(b))) continue;
      if (open) child.setAttribute("inert", "");
      else child.removeAttribute("inert");
    }
    // Opening moves focus to the first link in the drawer, past the sidebar's own collapse toggle.
    if (open)
      panel
        .querySelector<HTMLElement>(
          `a[href], button:not([disabled]):not(.${appShellToggleClass}), input, summary, [tabindex]:not([tabindex='-1'])`,
        )
        ?.focus();
    else if (returnFocus && panel.contains(doc.activeElement)) (opener?.isConnected ? opener : buttons[0])?.focus();
  };

  const onClick = (event: MouseEvent) => {
    const target = event.target as Element | null;
    if (!target) return;
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

    const clickedDrawerToggle = drawerToggles().find((b) => b.contains(target));
    if (clickedDrawerToggle) {
      opener = clickedDrawerToggle;
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
      (opener?.isConnected ? opener : drawerToggles()[0])?.focus();
      return;
    }
    if (
      event.key === "Escape" &&
      !isOpen() &&
      shell.classList.contains(appShellHoverPreviewClass) &&
      sidebar()?.contains(doc.activeElement)
    ) {
      (doc.activeElement as HTMLElement | null)?.blur();
    }
  };

  // Settings: Esc leaves, unless something else owns it. Runs in the capture phase, before menus and popovers close
  // themselves, so an open one is still seen as open.
  const onSettingsEscape = (event: KeyboardEvent) => {
    if (event.key !== "Escape" || event.defaultPrevented || !shell.classList.contains(appShellSettingsClass)) return;
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest(KEEPS_ESCAPE) || target?.closest("[aria-expanded='true']") || overlayOpen(doc)) return;
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

  // ---- Resize: separators that set --ayy-sidebar-w / --ayy-detail-w ----
  const handles = Array.from(shell.querySelectorAll<HTMLElement>(`:scope > .${appShellResizeClass}`));
  const edgeOf = (handle: HTMLElement): AppShellEdge => (handle.classList.contains(appShellResizeDetailClass) ? "detail" : "sidebar");
  const paneOf = (edge: AppShellEdge) =>
    shell.querySelector<HTMLElement>(`:scope > .${edge === "sidebar" ? appShellSidebarClass : appShellDetailClass}`);
  const hookOf = (edge: AppShellEdge) => (edge === "sidebar" ? "--ayy-sidebar-w" : "--ayy-detail-w");
  const isRtl = () => getComputedStyle(shell).direction === "rtl";
  // The author's limits, read once: aria-valuemin / aria-valuemax are then kept at what the handle can do right now.
  const configured = new Map<HTMLElement, [number, number]>();
  for (const handle of handles) {
    const [min, max] = RESIZE_LIMITS[edgeOf(handle)];
    configured.set(handle, [Number(handle.getAttribute("aria-valuemin")) || min, Number(handle.getAttribute("aria-valuemax")) || max]);
  }

  const limits = (handle: HTMLElement): [number, number] => {
    const edge = edgeOf(handle);
    const [min, configuredMax] = configured.get(handle)!;
    let max = configuredMax;
    // The main area keeps room: whatever the other pane takes is out of the budget too.
    const other = paneOf(edge === "sidebar" ? "detail" : "sidebar");
    const room = shell.clientWidth - (other && !other.hidden ? other.offsetWidth : 0) - MIN_MAIN;
    max = Math.min(max, room);
    return [min, Math.max(min, max)];
  };

  const syncHandle = (handle: HTMLElement) => {
    const pane = paneOf(edgeOf(handle));
    const [min, max] = limits(handle);
    handle.setAttribute("aria-valuemin", String(Math.round(min)));
    handle.setAttribute("aria-valuemax", String(Math.round(max)));
    if (pane && pane.offsetWidth) handle.setAttribute("aria-valuenow", String(Math.round(pane.offsetWidth)));
  };

  for (const handle of handles) {
    const edge = edgeOf(handle);
    const pane = paneOf(edge);
    handle.setAttribute("role", "separator");
    handle.setAttribute("aria-orientation", "vertical");
    if (!handle.hasAttribute("tabindex")) handle.setAttribute("tabindex", "0");
    if (!handle.hasAttribute("aria-label") && !handle.hasAttribute("aria-labelledby")) {
      handle.setAttribute("aria-label", edge === "sidebar" ? "Resize sidebar" : "Resize detail pane");
    }
    if (pane) handle.setAttribute("aria-controls", ensureId(pane, edge === "sidebar" ? "ayy-sidebar" : "ayy-detail"));
    syncHandle(handle);
  }

  // Where a key press left each pane. The width on screen lags behind it while the columns animate, and the next press
  // has to continue from the target, not from the frame it lands on.
  const target = new Map<HTMLElement, number>();

  const setWidth = (handle: HTMLElement, width: number | null) => {
    const edge = edgeOf(handle);
    if (width === null) {
      shell.style.removeProperty(hookOf(edge));
      target.delete(handle);
    } else {
      const [min, max] = limits(handle);
      const next = Math.min(max, Math.max(min, width));
      shell.style.setProperty(hookOf(edge), `${next}px`);
      target.set(handle, next);
    }
    syncHandle(handle);
  };

  let drag: { handle: HTMLElement; startX: number; startWidth: number; id: number } | null = null;

  const endDrag = (event?: PointerEvent) => {
    if (!drag) return;
    const { handle, id } = drag;
    drag = null;
    shell.classList.remove(appShellResizingClass);
    handle.removeAttribute("data-dragging");
    if (handle.hasPointerCapture?.(id)) handle.releasePointerCapture(id);
    if (event) options?.onResize?.(edgeOf(handle), Number(handle.getAttribute("aria-valuenow")) || null);
  };

  const onResizeDown = (event: PointerEvent) => {
    const handle = (event.target as Element | null)?.closest<HTMLElement>(`.${appShellResizeClass}`);
    if (!handle || event.button !== 0 || handle.parentElement !== shell) return;
    const pane = paneOf(edgeOf(handle));
    if (!pane) return;
    event.preventDefault();
    handle.focus();
    handle.setPointerCapture?.(event.pointerId);
    drag = { handle, startX: event.clientX, startWidth: pane.offsetWidth, id: event.pointerId };
    handle.setAttribute("data-dragging", "");
    shell.classList.add(appShellResizingClass);
  };

  const onResizeMove = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.id) return;
    // Dragging towards the inline end grows the sidebar and shrinks the detail pane.
    const toward = (event.clientX - drag.startX) * (isRtl() ? -1 : 1);
    setWidth(drag.handle, drag.startWidth + (edgeOf(drag.handle) === "sidebar" ? toward : -toward));
  };

  const onResizeUp = (event: PointerEvent) => {
    if (drag && event.pointerId === drag.id) endDrag(event);
  };

  const onResizeKey = (event: KeyboardEvent) => {
    const handle = (event.target as Element | null)?.closest<HTMLElement>(`.${appShellResizeClass}`);
    if (!handle || handle.parentElement !== shell) return;
    const edge = edgeOf(handle);
    const pane = paneOf(edge);
    if (!pane) return;
    const [min, max] = limits(handle);
    const step = event.shiftKey ? RESIZE_STEP_BIG : RESIZE_STEP;
    // ArrowRight grows the sidebar in LTR (the edge moves right), and shrinks the detail pane whose edge it is.
    const grows = (edge === "sidebar" ? 1 : -1) * (isRtl() ? -1 : 1);
    let next: number | null | undefined;
    const current = target.get(handle) ?? pane.offsetWidth;
    if (event.key === "ArrowRight") next = current + step * grows;
    else if (event.key === "ArrowLeft") next = current - step * grows;
    else if (event.key === "Home") next = min;
    else if (event.key === "End") next = max;
    if (next === undefined) return;
    event.preventDefault();
    setWidth(handle, next);
    options?.onResize?.(edge, Number(handle.getAttribute("aria-valuenow")) || null);
  };

  const onResizeReset = (event: MouseEvent) => {
    const handle = (event.target as Element | null)?.closest<HTMLElement>(`.${appShellResizeClass}`);
    if (!handle || handle.parentElement !== shell) return;
    setWidth(handle, null);
    options?.onResize?.(edgeOf(handle), null);
  };

  const onResizeFocus = (event: FocusEvent) => {
    const handle = event.target instanceof Element ? event.target.closest<HTMLElement>(`.${appShellResizeClass}`) : null;
    if (!handle || handle.parentElement !== shell) return;
    target.delete(handle);
    syncHandle(handle);
  };

  if (handles.length) {
    shell.addEventListener("pointerdown", onResizeDown);
    shell.addEventListener("pointermove", onResizeMove);
    shell.addEventListener("pointerup", onResizeUp);
    shell.addEventListener("pointercancel", onResizeUp);
    shell.addEventListener("keydown", onResizeKey);
    shell.addEventListener("dblclick", onResizeReset);
    shell.addEventListener("focusin", onResizeFocus);
  }

  shell.addEventListener("click", onClick);
  aside?.addEventListener("pointerleave", onPointerLeave);
  aside?.addEventListener("focusin", onFocusIn);
  doc.addEventListener("keydown", onKeydown);
  doc.addEventListener("keydown", onSettingsEscape, true);
  media?.addEventListener("change", onMedia);
  return () => {
    endDrag();
    shell.removeEventListener("pointerdown", onResizeDown);
    shell.removeEventListener("pointermove", onResizeMove);
    shell.removeEventListener("pointerup", onResizeUp);
    shell.removeEventListener("pointercancel", onResizeUp);
    shell.removeEventListener("keydown", onResizeKey);
    shell.removeEventListener("dblclick", onResizeReset);
    shell.removeEventListener("focusin", onResizeFocus);
    shell.removeEventListener("click", onClick);
    aside?.removeEventListener("pointerleave", onPointerLeave);
    aside?.removeEventListener("focusin", onFocusIn);
    release();
    doc.removeEventListener("keydown", onKeydown);
    doc.removeEventListener("keydown", onSettingsEscape, true);
    media?.removeEventListener("change", onMedia);
    if (isOpen()) set(false, { returnFocus: false });
  };
}
