import { cx } from "../../lib/cx";
import { Alert02Icon, Cancel01Icon, CancelCircleIcon, CheckmarkCircle02Icon, Copy01Icon, InformationCircleIcon, PlayIcon, Tick02Icon } from "../../lib/icons";
import { supportsPopover } from "../../lib/position";
import { iconSvg } from "../icon/icon";

export const toastVariants = ["default", "success", "warning", "destructive", "info", "card", "long"] as const;
export type ToastVariant = (typeof toastVariants)[number];
export const toastPositions = ["bottom-end", "bottom-start", "bottom-center", "top-end", "top-start", "top-center"] as const;
export type ToastPosition = (typeof toastPositions)[number];

export interface ToastClassOptions {
  variant?: ToastVariant;
  className?: string;
}

export function toastClass({ variant = "default", className }: ToastClassOptions = {}): string {
  return cx("ayy-toast", variant !== "default" && `ayy-toast--${variant}`, className);
}

export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  /** Milliseconds before it hides itself. Default 5000. Use Infinity to keep it until dismissed. */
  duration?: number;
  /** One action button, e.g. { label: "Undo", onClick }. The toast closes after it runs. */
  action?: { label: string; onClick: () => void };
  /** Show a copy button to copy the message or custom text to clipboard. Default true for "long" variant. */
  copyable?: boolean;
  /** Custom text to copy to clipboard (defaults to message, or message + description). */
  copyText?: string;
  /** Reuse an id to replace a toast that's still showing (e.g. "Saving…" → "Saved"). */
  id?: string;
}

export type CardToastStatusTone = "success" | "busy" | "error";

export interface CardToastStatus {
  tone: CardToastStatusTone;
  text: string;
}

export interface CardToastMedia {
  type: "video" | "gif";
  duration: string;
}

export interface CardToastAction {
  label: string;
  onClick: (event: MouseEvent) => void;
  variant?: "primary" | "secondary";
  className?: string;
}

export interface CardToastCornerAction {
  label: string;
  icon: string;
  onClick: (event: MouseEvent) => void;
  className?: string;
}

export interface CardToastOptions {
  /** Main image or video thumbnail url. */
  src: string;
  /** Accessible alt text for the preview. */
  alt?: string;
  /** Optional blurred backdrop url (defaults to src). */
  backdrop?: string;
  /** Media type and duration badge, e.g. { type: "video", duration: "0:42" }. */
  media?: CardToastMedia;
  /** Split card layout with media preview thumbnail and text details side-by-side or stacked. */
  split?: boolean | "horizontal" | "vertical";
  /** Optional title for split card toasts. */
  title?: string;
  /** Optional description for split card toasts. */
  description?: string;
  /** Action buttons rendered in text block (for split cards) or center scrim (for full cards). */
  actions?: CardToastAction[];
  /** Primary and secondary buttons in center scrim, e.g. Copy, Save. */
  centerActions?: CardToastAction[];
  /** Corner icon buttons in the hover scrim. */
  topActions?: CardToastCornerAction[];
  bottomStartActions?: CardToastCornerAction[];
  bottomEndActions?: CardToastCornerAction[];
  /** Optional initial status badge shown at the bottom. */
  status?: CardToastStatus;
  /** Milliseconds before it hides itself. Default 6000. Use Infinity to keep it until dismissed. */
  duration?: number;
  /** Reuse an id to replace a card toast that's still showing. */
  id?: string;
  /** Called when the card is double-clicked. */
  onDoubleClick?: () => void;
  /** Accessible label for the close button. Default config.closeLabel or "Dismiss". */
  closeLabel?: string;
}

export interface ToasterOptions {
  position?: ToastPosition;
  /** Accessible name of the notifications region. Translate it. */
  label?: string;
  /** Accessible name of each toast's close button. Translate it. */
  closeLabel?: string;
  /** Label of the "Clear all" button shown when the stack is open. Translate it. */
  clearLabel?: string;
}

export interface ToastHandle {
  id: string;
  dismiss: () => void;
}

export interface CardToastHandle extends ToastHandle {
  /** Update or show an inline status badge (e.g. "Copied", "Uploading…"). Pass clearAfter ms to auto-hide the badge. */
  status: (status: CardToastStatus | null, clearAfter?: number) => void;
}

export const toastCloseIcon = iconSvg(Cancel01Icon);
export const toastCopyIcon = iconSvg(Copy01Icon);
export const toastCopiedIcon = iconSvg(Tick02Icon);
export const toastSuccessIcon = iconSvg(CheckmarkCircle02Icon);
export const toastWarningIcon = iconSvg(Alert02Icon);
export const toastInfoIcon = iconSvg(InformationCircleIcon);
export const toastErrorIcon = iconSvg(CancelCircleIcon);
export const toastPlayIcon = iconSvg(PlayIcon, { size: "sm" });

const VARIANT_ICONS: Record<string, string> = {
  success: toastSuccessIcon,
  warning: toastWarningIcon,
  destructive: toastErrorIcon,
  info: toastInfoIcon,
};

let config: Required<ToasterOptions> = { position: "bottom-end", label: "Notifications", closeLabel: "Dismiss", clearLabel: "Clear all" };

interface LiveToastEntry {
  el: HTMLElement;
  dismiss: () => void;
  pause: () => void;
  resume: () => void;
}

const live = new Map<string, LiveToastEntry>();
let counter = 0;

function syncIndices(host: HTMLElement): void {
  // Elements are in order of creation. We assign reverse index: newest = 0, older = 1, 2...
  const toasts = Array.from(host.querySelectorAll<HTMLElement>(".ayy-toast:not([data-leaving])"));
  const count = toasts.length;
  let accumulatedHeight = 0;
  const gap = 10;
  const peek = 14;
  const scaleStep = 0.05;

  const front = count > 0 ? toasts[count - 1] : null;
  const frontH = front ? (front.offsetHeight || 56) : 56;
  host.style.setProperty("--_toast-front-height", `${frontH}px`);

  const isExpanded = host.hasAttribute("data-expanded");

  for (let i = count - 1; i >= 0; i--) {
    const el = toasts[i];
    const revIndex = count - 1 - i;
    const h = el.offsetHeight || frontH;

    el.style.setProperty("--_toast-index", String(revIndex));
    el.style.setProperty("--_toast-offset-y", `${accumulatedHeight}px`);
    el.style.setProperty("--_toast-peek", `${revIndex * peek}px`);
    el.style.setProperty("--_toast-scale", String(Math.max(0, 1 - revIndex * scaleStep)));
    el.style.setProperty("--_toast-h", `${h}px`);
    el.style.setProperty("z-index", String(1000 - revIndex));

    if (revIndex === 0 || isExpanded) {
      el.removeAttribute("data-behind");
    } else {
      el.setAttribute("data-behind", "");
    }

    if (revIndex >= 5 && !isExpanded) {
      el.setAttribute("data-limited", "");
    } else {
      el.removeAttribute("data-limited");
    }

    accumulatedHeight += h + gap;
  }

  if (count > 0) {
    const collapsedH = frontH + peek * Math.min(count - 1, 4);
    host.style.setProperty("--_toast-collapsed-height", `${collapsedH}px`);
    // Room for the "Clear all" button and empty space when there is more than one toast to clear
    const clearRoom = count > 1 ? 56 : 0;
    host.style.setProperty("--_toast-expanded-height", `${accumulatedHeight + clearRoom}px`);
    if (count > 1) host.setAttribute("data-multiple", "");
    else host.removeAttribute("data-multiple");
  } else {
    host.removeAttribute("data-expanded");
    host.style.removeProperty("--_toast-front-height");
    host.style.removeProperty("--_toast-collapsed-height");
    host.style.removeProperty("--_toast-expanded-height");
  }
}

function region(): HTMLElement {
  let el = document.querySelector<HTMLElement>(".ayy-toaster[data-ayy-toaster]");
  if (!el) {
    el = document.createElement("section");
    el.className = "ayy-toaster";
    el.setAttribute("data-ayy-toaster", "");
    el.setAttribute("aria-live", "polite");
    el.setAttribute("aria-relevant", "additions");
    if (supportsPopover()) el.setAttribute("popover", "manual");

    const toaster = el;
    let toastScrollY = 0;
    let scrollingTimer = 0;

    // Hover and focus expand the deck and pause countdowns across all toasts in the stack
    const expand = () => {
      toaster.setAttribute("data-expanded", "");
      syncIndices(toaster);
      for (const entry of live.values()) entry.pause();
    };
    const collapse = () => {
      if (toaster.matches(":hover") || toaster.contains(document.activeElement)) return;
      toaster.removeAttribute("data-expanded");
      toaster.removeAttribute("data-scrolling");
      toaster.removeAttribute("data-scrolled");
      toastScrollY = 0;
      toaster.style.removeProperty("--_toast-scroll-y");
      syncIndices(toaster);
      for (const entry of live.values()) entry.resume();
    };
    toaster.addEventListener("pointerenter", expand);
    toaster.addEventListener("pointerleave", collapse);
    toaster.addEventListener("focusin", expand);
    toaster.addEventListener("focusout", (e) => {
      if (toaster.matches(":hover")) return;
      if (toaster.contains(e.relatedTarget as Node | null)) return;
      collapse();
    });

    toaster.addEventListener(
      "wheel",
      (e) => {
        if (!toaster.hasAttribute("data-expanded")) return;
        const toasts = Array.from(toaster.querySelectorAll<HTMLElement>(".ayy-toast:not([data-leaving])"));
        if (toasts.length <= 1) return;

        e.preventDefault();
        toaster.setAttribute("data-scrolling", "");
        if (scrollingTimer) window.clearTimeout(scrollingTimer);
        scrollingTimer = window.setTimeout(() => {
          toaster.removeAttribute("data-scrolling");
          scrollingTimer = 0;
        }, 120);

        const expandedH = parseFloat(toaster.style.getPropertyValue("--_toast-expanded-height")) || 0;
        const visibleH = Math.min(window.innerHeight - 32, expandedH);
        const maxScroll = Math.max(0, expandedH - visibleH);
        if (maxScroll <= 0) return;

        const isTop = (config.position || "").startsWith("top");
        const delta = isTop ? e.deltaY : -e.deltaY;
        toastScrollY = Math.max(0, Math.min(maxScroll, toastScrollY + delta));
        toaster.style.setProperty("--_toast-scroll-y", `${toastScrollY}px`);
        toaster.toggleAttribute("data-scrolled", toastScrollY > 0);
      },
      { passive: false },
    );

    toaster.addEventListener("keydown", (e) => {
      if (!toaster.hasAttribute("data-expanded")) return;
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        const expandedH = parseFloat(toaster.style.getPropertyValue("--_toast-expanded-height")) || 0;
        const visibleH = Math.min(window.innerHeight - 32, expandedH);
        const maxScroll = Math.max(0, expandedH - visibleH);
        if (maxScroll <= 0) return;
        e.preventDefault();
        const step = 60;
        const isTop = (config.position || "").startsWith("top");
        const dir = e.key === "ArrowUp" ? (isTop ? -1 : 1) : (isTop ? 1 : -1);
        toastScrollY = Math.max(0, Math.min(maxScroll, toastScrollY + dir * step));
        toaster.style.setProperty("--_toast-scroll-y", `${toastScrollY}px`);
        toaster.toggleAttribute("data-scrolled", toastScrollY > 0);
      }
    });

    const clear = document.createElement("button");
    clear.type = "button";
    clear.className = "ayy-button ayy-button--secondary ayy-button--sm ayy-toaster__clear";
    clear.addEventListener("click", () => {
      for (const entry of [...live.values()]) entry.dismiss();
    });
    toaster.append(clear);

    document.body.append(el);
  }
  el.setAttribute("aria-label", config.label);
  const clearBtn = el.querySelector<HTMLElement>(":scope > .ayy-toaster__clear");
  if (clearBtn) clearBtn.textContent = config.clearLabel;
  el.setAttribute("data-position", config.position);
  // A modal dialog makes everything outside it inert, top layer included. So while one is open the
  // region lives inside the topmost modal, and moves back to <body> when that dialog closes.
  const modals = document.querySelectorAll<HTMLDialogElement>("dialog:modal");
  const host: HTMLElement = modals[modals.length - 1] ?? document.body;
  if (el.parentElement !== host) {
    host.append(el);
    if (host instanceof HTMLDialogElement) {
      host.addEventListener(
        "close",
        () => {
          if (el.parentElement !== host) return;
          document.body.append(el);
          if (el.querySelector(".ayy-toast")) region();
        },
        { once: true },
      );
    }
  }
  // Re-showing puts the region at the top of the top layer, above anything opened since.
  if (el.hasAttribute("popover") && (modals.length > 0 || !el.matches(":popover-open"))) {
    if (el.matches(":popover-open")) el.hidePopover();
    el.showPopover();
  }
  return el;
}

/** Configure the shared toaster region (position, translated labels). Safe to call any time. */
export function configureToaster(options: ToasterOptions): void {
  config = { ...config, ...options };
  if (typeof document === "undefined") return;
  const el = document.querySelector<HTMLElement>(".ayy-toaster[data-ayy-toaster]");
  if (el) {
    el.setAttribute("aria-label", config.label);
    el.setAttribute("data-position", config.position);
    const clearBtn = el.querySelector<HTMLElement>(":scope > .ayy-toaster__clear");
    if (clearBtn) clearBtn.textContent = config.clearLabel;
  }
}

function showToast(message: string, options: ToastOptions = {}): ToastHandle {
  if (typeof document === "undefined") return { id: "", dismiss: () => {} };
  const id = options.id ?? `ayy-toast-${++counter}`;
  live.get(id)?.el.remove();

  const toast = document.createElement("div");
  toast.className = toastClass({ variant: options.variant });
  toast.setAttribute("data-toast-id", id);
  if (options.variant === "destructive") toast.setAttribute("role", "alert");

  // Leading icon for status variants
  const iconMarkup = options.variant ? VARIANT_ICONS[options.variant] : undefined;
  if (iconMarkup) {
    const iconWrapper = document.createElement("span");
    iconWrapper.className = "ayy-toast__icon";
    iconWrapper.setAttribute("aria-hidden", "true");
    iconWrapper.innerHTML = iconMarkup;
    toast.append(iconWrapper);
  }

  // Content block: title + optional description
  const content = document.createElement("div");
  content.className = "ayy-toast__content";

  const title = document.createElement("p");
  title.className = "ayy-toast__title";
  title.textContent = message;
  content.append(title);

  if (options.description) {
    const description = document.createElement("p");
    description.className = "ayy-toast__description";
    description.textContent = options.description;
    content.append(description);
  }
  toast.append(content);

  let timer = 0;
  let remaining = options.duration ?? 5000;
  let startedAt = 0;

  const dismiss = () => {
    if (!live.has(id) || live.get(id)?.el !== toast) return;
    live.delete(id);
    if (timer) window.clearTimeout(timer);
    toast.setAttribute("data-leaving", "");
    const host = document.querySelector<HTMLElement>(".ayy-toaster[data-ayy-toaster]");
    if (host) syncIndices(host);
    const remove = () => {
      toast.remove();
      if (host) {
        syncIndices(host);
        if (!host.querySelector(".ayy-toast") && host.matches(":popover-open")) host.hidePopover();
      }
    };
    toast.addEventListener("animationend", (e) => { if (e.target === toast) remove(); });
    window.setTimeout(remove, 400);
  };

  if (options.action) {
    const actions = document.createElement("div");
    actions.className = "ayy-toast__actions";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "ayy-button ayy-button--secondary ayy-button--sm";
    button.textContent = options.action.label;
    const run = options.action.onClick;
    button.addEventListener("click", () => {
      run();
      dismiss();
    });
    actions.append(button);
    toast.append(actions);
  }

  const showCopy = options.copyable ?? (options.variant === "long");
  if (showCopy) {
    const copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.className = "ayy-toast__copy";
    copyBtn.setAttribute("aria-label", "Copy");
    copyBtn.setAttribute("title", "Copy");
    copyBtn.innerHTML = toastCopyIcon;
    let copyResetTimer = 0;
    copyBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const textToCopy = options.copyText ?? (options.description ? `${message}\n${options.description}` : message);
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(textToCopy).catch(() => {});
      }
      copyBtn.innerHTML = toastCopiedIcon;
      copyBtn.setAttribute("data-copied", "");
      copyBtn.setAttribute("aria-label", "Copied");
      copyBtn.setAttribute("title", "Copied");
      if (copyResetTimer) window.clearTimeout(copyResetTimer);
      copyResetTimer = window.setTimeout(() => {
        copyBtn.innerHTML = toastCopyIcon;
        copyBtn.removeAttribute("data-copied");
        copyBtn.setAttribute("aria-label", "Copy");
        copyBtn.setAttribute("title", "Copy");
      }, 1500);
    });
    toast.append(copyBtn);
  }

  const close = document.createElement("button");
  close.type = "button";
  close.className = "ayy-toast__close";
  close.setAttribute("aria-label", config.closeLabel);
  close.innerHTML = toastCloseIcon;
  close.addEventListener("click", dismiss);
  toast.append(close);

  const start = () => {
    if (!Number.isFinite(remaining)) return;
    if (timer) window.clearTimeout(timer);
    startedAt = Date.now();
    timer = window.setTimeout(dismiss, remaining);
  };
  const pause = () => {
    if (!timer) return;
    window.clearTimeout(timer);
    timer = 0;
    remaining -= Date.now() - startedAt;
  };

  const host = region();

  toast.addEventListener("pointerenter", pause);
  toast.addEventListener("pointerleave", () => {
    if (!host.hasAttribute("data-expanded")) start();
  });
  toast.addEventListener("focusin", pause);
  toast.addEventListener("focusout", (event) => {
    if (!toast.contains(event.relatedTarget as Node | null) && !host.hasAttribute("data-expanded")) start();
  });

  attachSwipe(toast, dismiss);

  host.append(toast);
  live.set(id, { el: toast, dismiss, pause, resume: start });
  syncIndices(host);
  requestAnimationFrame(() => syncIndices(host));

  if (!host.hasAttribute("data-expanded")) {
    start();
  } else {
    pause();
  }

  return { id, dismiss };
}

function attachSwipe(toast: HTMLElement, dismiss: () => void): void {
  let dragStartY = 0;
  let currentDeltaY = 0;
  let isDragging = false;

  const onPointerDown = (e: PointerEvent) => {
    // Only primary button and don't drag if clicking buttons
    if (e.button !== 0 || (e.target as HTMLElement).closest("button")) return;
    dragStartY = e.clientY;
    currentDeltaY = 0;
    isDragging = true;
    toast.setPointerCapture(e.pointerId);
    toast.style.transition = "none";
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!isDragging) return;
    const deltaY = e.clientY - dragStartY;
    const isTop = config.position.startsWith("top");
    const allowedDelta = isTop ? Math.min(0, deltaY) : Math.max(0, deltaY);
    currentDeltaY = allowedDelta;
    toast.style.setProperty("--_toast-swipe-y", `${currentDeltaY}px`);
  };

  const onPointerUp = (e: PointerEvent) => {
    if (!isDragging) return;
    isDragging = false;
    try {
      toast.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    toast.style.removeProperty("transition");
    if (Math.abs(currentDeltaY) > 40) {
      dismiss();
    } else {
      toast.style.removeProperty("--_toast-swipe-y");
    }
  };

  toast.addEventListener("pointerdown", onPointerDown);
  toast.addEventListener("pointermove", onPointerMove);
  toast.addEventListener("pointerup", onPointerUp);
  toast.addEventListener("pointercancel", onPointerUp);
}

function showCardToast(options: CardToastOptions): CardToastHandle {
  if (typeof document === "undefined") return { id: "", dismiss: () => {}, status: () => {} };
  const id = options.id ?? `ayy-toast-card-${++counter}`;
  live.get(id)?.dismiss();

  const isSplit = Boolean(options.split);
  const isVertical = options.split === "vertical";

  const toast = document.createElement("div");
  toast.className = cx(
    "ayy-toast",
    "ayy-toast--card",
    isSplit && "ayy-toast--card-split",
    isVertical && "ayy-toast--card-split--vertical",
  );
  toast.setAttribute("data-toast-id", id);
  if (options.onDoubleClick) {
    toast.addEventListener("dblclick", () => options.onDoubleClick?.());
  }

  let timer = 0;
  let remaining = options.duration ?? 6000;
  let startedAt = 0;
  let statusTimer = 0;
  let statusEl: HTMLElement | null = null;

  const dismiss = () => {
    if (!live.has(id) || live.get(id)?.el !== toast) return;
    live.delete(id);
    if (timer) window.clearTimeout(timer);
    if (statusTimer) window.clearTimeout(statusTimer);
    toast.setAttribute("data-leaving", "");
    const host = document.querySelector<HTMLElement>(".ayy-toaster[data-ayy-toaster]");
    if (host) syncIndices(host);
    const remove = () => {
      toast.remove();
      if (host) {
        syncIndices(host);
        if (!host.querySelector(".ayy-toast") && host.matches(":popover-open")) host.hidePopover();
      }
    };
    toast.addEventListener("animationend", (e) => { if (e.target === toast) remove(); });
    window.setTimeout(remove, 400);
  };

  if (isSplit) {
    // Thumbnail container
    const thumb = document.createElement("div");
    thumb.className = "ayy-toast__thumb";

    if (options.backdrop ?? options.src) {
      const backdrop = document.createElement("img");
      backdrop.className = "ayy-toast__backdrop";
      backdrop.src = options.backdrop ?? options.src;
      backdrop.alt = "";
      backdrop.setAttribute("aria-hidden", "true");
      backdrop.draggable = false;
      thumb.append(backdrop);
    }

    const image = document.createElement("img");
    image.className = "ayy-toast__image";
    image.src = options.src;
    image.alt = options.alt ?? "Capture preview";
    image.draggable = false;
    thumb.append(image);

    if (options.media) {
      const mediaBadge = document.createElement("span");
      mediaBadge.className = "ayy-toast__media";
      mediaBadge.setAttribute("aria-hidden", "true");
      mediaBadge.innerHTML = `${toastPlayIcon}<span>${options.media.duration}</span>`;
      thumb.append(mediaBadge);
    }
    toast.append(thumb);

    // Text content container
    const content = document.createElement("div");
    content.className = "ayy-toast__content";

    if (options.title) {
      const title = document.createElement("p");
      title.className = "ayy-toast__title";
      title.textContent = options.title;
      content.append(title);
    }

    if (options.description) {
      const description = document.createElement("p");
      description.className = "ayy-toast__description";
      description.textContent = options.description;
      content.append(description);
    }

    const actionList = options.actions ?? options.centerActions;
    if (actionList && actionList.length > 0) {
      const actions = document.createElement("div");
      actions.className = "ayy-toast__actions";
      for (const act of actionList) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = cx(
          "ayy-button",
          act.variant === "secondary" && "ayy-button--secondary",
          "ayy-button--sm",
          act.className,
        );
        btn.textContent = act.label;
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          act.onClick(e);
        });
        actions.append(btn);
      }
      content.append(actions);
    }
    toast.append(content);

    // Close button
    const close = document.createElement("button");
    close.type = "button";
    close.className = "ayy-toast__close";
    close.setAttribute("aria-label", options.closeLabel ?? config.closeLabel);
    close.title = options.closeLabel ?? config.closeLabel;
    close.innerHTML = toastCloseIcon;
    close.addEventListener("click", (e) => {
      e.stopPropagation();
      dismiss();
    });
    toast.append(close);
  } else {
    // Blurred backdrop image behind the thumbnail
    const backdrop = document.createElement("img");
    backdrop.className = "ayy-toast__backdrop";
    backdrop.src = options.backdrop ?? options.src;
    backdrop.alt = "";
    backdrop.setAttribute("aria-hidden", "true");
    backdrop.draggable = false;
    toast.append(backdrop);

    // Main foreground preview
    const image = document.createElement("img");
    image.className = "ayy-toast__image";
    image.src = options.src;
    image.alt = options.alt ?? "Capture preview";
    image.draggable = false;
    toast.append(image);

    // Video or GIF duration badge
    if (options.media) {
      const mediaBadge = document.createElement("span");
      mediaBadge.className = "ayy-toast__media";
      mediaBadge.setAttribute("aria-hidden", "true");
      mediaBadge.innerHTML = `${toastPlayIcon}<span>${options.media.duration}</span>`;
      toast.append(mediaBadge);
    }

    // Hover and focus action scrim
    const scrim = document.createElement("div");
    scrim.className = "ayy-toast__scrim";

    const close = document.createElement("button");
    close.type = "button";
    close.className = "ayy-toast__close";
    close.setAttribute("aria-label", options.closeLabel ?? config.closeLabel);
    close.title = options.closeLabel ?? config.closeLabel;
    close.innerHTML = toastCloseIcon;
    close.addEventListener("click", (e) => {
      e.stopPropagation();
      dismiss();
    });
    scrim.append(close);

    if (options.topActions && options.topActions.length > 0) {
      const topCorner = document.createElement("div");
      topCorner.className = "ayy-toast__corner ayy-toast__corner--top ayy-toast__corner--top-start";
      for (const act of options.topActions) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = cx("ayy-toast__action", act.className);
        btn.setAttribute("aria-label", act.label);
        btn.title = act.label;
        btn.innerHTML = act.icon;
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          act.onClick(e);
        });
        topCorner.append(btn);
      }
      scrim.append(topCorner);
    }

    if (options.centerActions && options.centerActions.length > 0) {
      const center = document.createElement("div");
      center.className = "ayy-toast__center";
      for (const act of options.centerActions) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = cx(
          "ayy-button",
          act.variant === "secondary" && "ayy-button--secondary",
          "ayy-button--sm",
          act.className,
        );
        btn.textContent = act.label;
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          act.onClick(e);
        });
        center.append(btn);
      }
      scrim.append(center);
    }

    if (options.bottomStartActions && options.bottomStartActions.length > 0) {
      const bsCorner = document.createElement("div");
      bsCorner.className = "ayy-toast__corner ayy-toast__corner--bottom-start";
      for (const act of options.bottomStartActions) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = cx("ayy-toast__action", act.className);
        btn.setAttribute("aria-label", act.label);
        btn.title = act.label;
        btn.innerHTML = act.icon;
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          act.onClick(e);
        });
        bsCorner.append(btn);
      }
      scrim.append(bsCorner);
    }

    if (options.bottomEndActions && options.bottomEndActions.length > 0) {
      const beCorner = document.createElement("div");
      beCorner.className = "ayy-toast__corner ayy-toast__corner--bottom-end";
      for (const act of options.bottomEndActions) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = cx("ayy-toast__action", act.className);
        btn.setAttribute("aria-label", act.label);
        btn.title = act.label;
        btn.innerHTML = act.icon;
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          act.onClick(e);
        });
        beCorner.append(btn);
      }
      scrim.append(beCorner);
    }

    toast.append(scrim);
  }

  const setStatus = (status: CardToastStatus | null, clearAfter = 0) => {
    if (statusTimer) {
      window.clearTimeout(statusTimer);
      statusTimer = 0;
    }
    if (statusEl) {
      statusEl.remove();
      statusEl = null;
    }
    if (!status) return;

    statusEl = document.createElement("div");
    statusEl.className = inlineToastClass({ tone: status.tone });
    statusEl.setAttribute("role", "status");

    const iconSpan = document.createElement("span");
    iconSpan.setAttribute("aria-hidden", "true");
    if (status.tone === "error") {
      iconSpan.innerHTML = toastErrorIcon;
    } else if (status.tone === "busy") {
      iconSpan.innerHTML = `<span class="ayy-spinner ayy-spinner--sm" aria-hidden="true"></span>`;
    } else {
      iconSpan.innerHTML = toastSuccessIcon;
    }
    statusEl.append(iconSpan);

    const textSpan = document.createElement("span");
    textSpan.textContent = status.text;
    statusEl.append(textSpan);

    toast.append(statusEl);

    if (clearAfter > 0) {
      statusTimer = window.setTimeout(() => {
        statusEl?.remove();
        statusEl = null;
        statusTimer = 0;
      }, clearAfter);
    }
  };

  if (options.status) {
    setStatus(options.status);
  }

  const start = () => {
    if (!Number.isFinite(remaining)) return;
    if (timer) window.clearTimeout(timer);
    startedAt = Date.now();
    timer = window.setTimeout(dismiss, remaining);
  };
  const pause = () => {
    if (!timer) return;
    window.clearTimeout(timer);
    timer = 0;
    remaining -= Date.now() - startedAt;
  };

  const host = region();

  toast.addEventListener("pointerenter", () => {
    pause();
    toast.setAttribute("data-hover", "");
  });
  toast.addEventListener("pointerleave", () => {
    toast.removeAttribute("data-hover");
    if (!host.hasAttribute("data-expanded")) start();
  });
  toast.addEventListener("focusin", pause);
  toast.addEventListener("focusout", (event) => {
    if (!toast.contains(event.relatedTarget as Node | null) && !host.hasAttribute("data-expanded")) start();
  });

  attachSwipe(toast, dismiss);

  host.append(toast);
  live.set(id, { el: toast, dismiss, pause, resume: start });
  syncIndices(host);
  requestAnimationFrame(() => syncIndices(host));

  if (!host.hasAttribute("data-expanded")) {
    start();
  } else {
    pause();
  }

  return { id, dismiss, status: setStatus };
}

export const cardToast = (options: CardToastOptions): CardToastHandle => showCardToast(options);

export function inlineToastClass(options: { tone?: "default" | "success" | "busy" | "error"; className?: string } = {}): string {
  const { tone = "default", className } = options;
  return cx("ayy-toast--inline", tone !== "default" && `ayy-toast--inline--${tone}`, className);
}

type ToastFn = (message: string, options?: Omit<ToastOptions, "variant">) => ToastHandle;

/**
 * Show a toast. Works in any framework (it renders straight into the DOM) and is a no-op during SSR.
 *   toast("Saved")   toast.success("Deployed", { description: "v2.1 is live" })   toast.error("Build failed")
 */
export const toast = Object.assign(showToast, {
  success: ((message, options) => showToast(message, { ...options, variant: "success" })) as ToastFn,
  warning: ((message, options) => showToast(message, { ...options, variant: "warning" })) as ToastFn,
  error: ((message, options) => showToast(message, { ...options, variant: "destructive" })) as ToastFn,
  info: ((message, options) => showToast(message, { ...options, variant: "info" })) as ToastFn,
  long: ((message, options) => showToast(message, { ...options, variant: "long" })) as ToastFn,
  card: cardToast,
  /** Copy text to clipboard and trigger a confirmation toast. */
  copy(text: string, options?: ToastOptions): ToastHandle {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    return showToast(options?.title ?? "Copied to clipboard", {
      ...options,
      variant: options?.variant ?? "success",
    });
  },
  /** Dismiss one toast by id, or all of them. */
  dismiss(id?: string): void {
    if (id) live.get(id)?.dismiss();
    else for (const entry of [...live.values()]) entry.dismiss();
  },
});
