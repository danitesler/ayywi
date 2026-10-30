import { autoPlace, supportsPopover, type FloatingAlign, type FloatingSide, type PlaceBoundary } from "../../lib/position";

export const popoverClass = "ayy-popover";

export interface PopoverControllerOptions {
  side?: FloatingSide;
  align?: FloatingAlign;
  offset?: number;
  crossAxisOffset?: number;
  boundary?: PlaceBoundary;
  /** What to place it next to, when that isn't the trigger (a point for a context menu). Default: the trigger. */
  anchor?: Element;
  /** Called after every open/close (including light dismiss and Esc). */
  onToggle?: (open: boolean) => void;
}

export interface PopoverController {
  open(): void;
  close(): void;
  isOpen(): boolean;
  /** Change placement options while mounted. */
  update(options: Pick<PopoverControllerOptions, "side" | "align" | "offset" | "anchor">): void;
  destroy(): void;
}

/**
 * Wire a trigger button to a `popover` element: the trigger becomes its invoker (native toggle + light dismiss),
 * aria-expanded is kept in sync, and while open the popover is placed next to the trigger and follows scrolling.
 * Framework-free; used by React Popover/DropdownMenu and by <ayy-popover>/<ayy-menu>.
 */
export function connectPopover(trigger: HTMLElement, content: HTMLElement, options: PopoverControllerOptions = {}): PopoverController {
  let opts = { side: "bottom" as FloatingSide, align: "center" as FloatingAlign, offset: 6, ...options };
  let stopPlacing: (() => void) | null = null;
  const native = supportsPopover();

  if (!content.hasAttribute("popover")) content.setAttribute("popover", "auto");
  if (native && trigger instanceof HTMLButtonElement) trigger.popoverTargetElement = content;
  trigger.setAttribute("aria-expanded", "false");
  if (content.id) trigger.setAttribute("aria-controls", content.id);

  const isOpen = () => (native ? content.matches(":popover-open") : content.hasAttribute("data-open"));

  const onToggle = (event: Event) => {
    const open = (event as ToggleEvent).newState === "open";
    trigger.setAttribute("aria-expanded", String(open));
    stopPlacing?.();
    stopPlacing = open ? autoPlace(content, opts.anchor ?? trigger, opts) : null;
    if (!open && (content.contains(document.activeElement) || document.activeElement === document.body)) trigger.focus();
    opts.onToggle?.(open);
  };
  content.addEventListener("toggle", onToggle);
  // A picker inside (Icon picker) fires ayy-pick once something is chosen: that ends the popover's job.
  const onPick = () => close();
  content.addEventListener("ayy-pick", onPick);

  // When popoverTargetElement cannot be set (no native API or trigger is not a button e.g. asChild),
  // attach a click listener to trigger the popover.
  const toggleClick = () => (isOpen() ? close() : open());
  const needsClickTrigger = !(native && trigger instanceof HTMLButtonElement);
  if (needsClickTrigger) {
    if (!native) content.hidden = !content.hasAttribute("data-open");
    trigger.addEventListener("click", toggleClick);
  }

  function open() {
    if (isOpen()) return;
    // The trigger as source, as a click on it would set: a popover kept outside the one its trigger is in (a menu's
    // dialog panel) still nests in it rather than closing it. Browsers without the option ignore it.
    if (native) content.showPopover({ source: trigger });
    else {
      content.setAttribute("data-open", "");
      content.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
      stopPlacing?.();
      stopPlacing = autoPlace(content, opts.anchor ?? trigger, opts);
      opts.onToggle?.(true);
    }
  }

  function close() {
    if (!isOpen()) return;
    if (native) content.hidePopover();
    else {
      content.removeAttribute("data-open");
      content.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
      stopPlacing?.();
      stopPlacing = null;
      opts.onToggle?.(false);
    }
  }

  return {
    open,
    close,
    isOpen,
    update(next) {
      opts = { ...opts, ...next };
      if (isOpen()) {
        stopPlacing?.();
        stopPlacing = autoPlace(content, opts.anchor ?? trigger, opts);
      }
    },
    destroy() {
      content.removeEventListener("toggle", onToggle);
      content.removeEventListener("ayy-pick", onPick);
      if (needsClickTrigger) trigger.removeEventListener("click", toggleClick);
      stopPlacing?.();
      if (native && trigger instanceof HTMLButtonElement && trigger.popoverTargetElement === content) trigger.popoverTargetElement = null;
    },
  };
}
