import { autoPlace, supportsPopover, type FloatingSide } from "../../lib/position";

export const tooltipSides = ["top", "bottom", "start", "end"] as const;
export type TooltipSide = (typeof tooltipSides)[number];

export const tooltipClass = "ayy-tooltip";
export const tooltipContentClass = "ayy-tooltip__content";

/**
 * Upgrade a CSS-only `.ayy-tooltip` (host) so its bubble lives in the top layer: it can't be clipped by
 * overflow:hidden ancestors and flips at viewport edges. Also adds Esc-to-dismiss while hovered or focused.
 * Visibility and fading stay in CSS. Returns a cleanup function. Used by React Tooltip and <ayy-tooltip>.
 */
export function enhanceTooltip(host: HTMLElement): () => void {
  const content = Array.from(host.children).find((el): el is HTMLElement => el.classList.contains(tooltipContentClass));
  if (!content) return () => {};
  const anchor = Array.from(host.children).find((el) => el !== content) ?? host;
  const floating = supportsPopover();
  if (floating) {
    content.setAttribute("popover", "manual");
    content.setAttribute("data-floating", "");
  }

  let hovered = false;
  let focused = false;
  let hideTimer = 0;
  let stopPlacing: (() => void) | null = null;
  const active = () => hovered || focused;

  const show = () => {
    window.clearTimeout(hideTimer);
    if (!floating || content.matches(":popover-open")) return;
    content.showPopover();
    const side = (content.getAttribute("data-side") as FloatingSide | null) ?? "top";
    stopPlacing = autoPlace(content, anchor, { side, align: "center", offset: 6 });
  };

  const hide = () => {
    window.clearTimeout(hideTimer);
    // Wait for the CSS fade-out before leaving the top layer.
    hideTimer = window.setTimeout(() => {
      if (active() && !host.hasAttribute("data-dismissed")) return;
      stopPlacing?.();
      stopPlacing = null;
      if (floating && content.matches(":popover-open")) content.hidePopover();
    }, 250);
  };

  const onEscape = (event: KeyboardEvent) => {
    if (event.key !== "Escape" || !active()) return;
    host.setAttribute("data-dismissed", "");
    hide();
  };

  const update = () => {
    if (active()) {
      document.addEventListener("keydown", onEscape);
      if (!host.hasAttribute("data-dismissed")) show();
    } else {
      document.removeEventListener("keydown", onEscape);
      host.removeAttribute("data-dismissed");
      hide();
    }
  };

  const onEnter = () => {
    hovered = true;
    update();
  };
  const onLeave = () => {
    hovered = false;
    update();
  };
  const onFocusIn = () => {
    focused = true;
    update();
  };
  const onFocusOut = (event: FocusEvent) => {
    if (host.contains(event.relatedTarget as Node | null)) return;
    focused = false;
    update();
  };

  host.addEventListener("pointerenter", onEnter);
  host.addEventListener("pointerleave", onLeave);
  host.addEventListener("focusin", onFocusIn);
  host.addEventListener("focusout", onFocusOut);

  return () => {
    host.removeEventListener("pointerenter", onEnter);
    host.removeEventListener("pointerleave", onLeave);
    host.removeEventListener("focusin", onFocusIn);
    host.removeEventListener("focusout", onFocusOut);
    document.removeEventListener("keydown", onEscape);
    window.clearTimeout(hideTimer);
    stopPlacing?.();
    if (floating) {
      if (content.matches(":popover-open")) content.hidePopover();
      content.removeAttribute("popover");
      content.removeAttribute("data-floating");
    }
  };
}
