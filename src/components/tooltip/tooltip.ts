import { getInputModality } from "../../lib/input-modality";
import { autoPlace, supportsPopover, type FloatingSide } from "../../lib/position";

export const tooltipSides = ["top", "bottom", "start", "end"] as const;
export type TooltipSide = (typeof tooltipSides)[number];

export const tooltipClass = "ayy-tooltip";
export const tooltipContentClass = "ayy-tooltip__content";

const ACTION_PREFIXES = [
  "More actions",
  "Show details",
  "Hide details",
  "Copy link",
  "Edit",
  "Delete",
  "Remove",
  "Copy",
  "Duplicate",
  "Archive",
  "Download",
  "Upload",
  "Refresh",
  "Save",
  "Cancel",
  "Close",
  "Expand",
  "Collapse",
  "Search",
  "Filter",
  "Sort",
  "View",
  "Open",
  "Share",
  "Add",
];
const ACTION_RE = new RegExp(`^(${ACTION_PREFIXES.join("|")})\\b`, "i");

/**
 * Keep action tooltips general ("Edit", "Delete", "More actions"), leaving the item's specific name in aria-label
 * for screen readers. If a label starts with a common action verb, returns that verb.
 */
export function generalActionLabel(label: string): string {
  const match = label.trim().match(ACTION_RE);
  if (!match) return label.trim();
  const matched = match[1].toLowerCase();
  const canonical = ACTION_PREFIXES.find((p) => p.toLowerCase() === matched);
  return canonical ?? (match[1].charAt(0).toUpperCase() + match[1].slice(1));
}

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
  let pointerDown = false;
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

  const dismiss = () => {
    window.clearTimeout(hideTimer);
    host.setAttribute("data-dismissed", "");
    stopPlacing?.();
    stopPlacing = null;
    if (floating && content.matches(":popover-open")) content.hidePopover();
  };

  const onEscape = (event: KeyboardEvent) => {
    if (event.key !== "Escape" || !active()) return;
    dismiss();
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
    host.removeAttribute("data-dismissed");
    hovered = true;
    update();
  };
  const onLeave = () => {
    hovered = false;
    update();
  };
  const onPointerUp = () => {
    pointerDown = false;
    window.removeEventListener("pointerup", onPointerUp);
  };
  const onPointerDown = () => {
    pointerDown = true;
    focused = false;
    dismiss();
    window.addEventListener("pointerup", onPointerUp);
  };
  const onFocusIn = (event: FocusEvent) => {
    if (pointerDown || getInputModality() === "pointer") return;
    const target = (event.target as HTMLElement | null) ?? host;
    try {
      if (target.matches(":focus-visible") || host.matches(":focus-visible")) {
        focused = true;
        update();
      }
    } catch {
      focused = true;
      update();
    }
  };
  const onFocusOut = (event: FocusEvent) => {
    if (host.contains(event.relatedTarget as Node | null)) return;
    focused = false;
    update();
  };

  host.addEventListener("pointerenter", onEnter);
  host.addEventListener("pointerleave", onLeave);
  host.addEventListener("pointerdown", onPointerDown);
  host.addEventListener("focusin", onFocusIn);
  host.addEventListener("focusout", onFocusOut);

  return () => {
    host.removeEventListener("pointerenter", onEnter);
    host.removeEventListener("pointerleave", onLeave);
    host.removeEventListener("pointerdown", onPointerDown);
    window.removeEventListener("pointerup", onPointerUp);
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
