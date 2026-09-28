import { autoPlace, supportsPopover, type FloatingAlign, type FloatingSide } from "../../lib/position";

export const popoverClass = "ayy-popover";

export interface PopoverControllerOptions {
  side?: FloatingSide;
  align?: FloatingAlign;
  offset?: number;
  /** Called after every open/close (including light dismiss and Esc). */
  onToggle?: (open: boolean) => void;
}

export interface PopoverController {
  open(): void;
  close(): void;
  isOpen(): boolean;
  /** Change placement options while mounted. */
  update(options: Pick<PopoverControllerOptions, "side" | "align" | "offset">): void;
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
    stopPlacing = open ? autoPlace(content, trigger, opts) : null;
    if (!open && (content.contains(document.activeElement) || document.activeElement === document.body)) trigger.focus();
    opts.onToggle?.(open);
  };
  content.addEventListener("toggle", onToggle);

  // Without the Popover API: plain show/hide by attribute so the content is at least reachable.
  const fallbackClick = () => (isOpen() ? close() : open());
  if (!native) {
    content.hidden = !content.hasAttribute("data-open");
    trigger.addEventListener("click", fallbackClick);
  }

  function open() {
    if (isOpen()) return;
    if (native) content.showPopover();
    else {
      content.setAttribute("data-open", "");
      content.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
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
        stopPlacing = autoPlace(content, trigger, opts);
      }
    },
    destroy() {
      content.removeEventListener("toggle", onToggle);
      trigger.removeEventListener("click", fallbackClick);
      stopPlacing?.();
      if (native && trigger instanceof HTMLButtonElement && trigger.popoverTargetElement === content) trigger.popoverTargetElement = null;
    },
  };
}
