import { cx } from "../../lib/cx";
import { Alert02Icon, Cancel01Icon, CancelCircleIcon, CheckmarkCircle02Icon, InformationCircleIcon } from "../../lib/icons";
import { supportsPopover } from "../../lib/position";
import { iconSvg } from "../icon/icon";

export const toastVariants = ["default", "success", "warning", "destructive", "info"] as const;
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
  description?: string;
  variant?: ToastVariant;
  /** Milliseconds before it hides itself. Default 5000. Use Infinity to keep it until dismissed. */
  duration?: number;
  /** One action button, e.g. { label: "Undo", onClick }. The toast closes after it runs. */
  action?: { label: string; onClick: () => void };
  /** Reuse an id to replace a toast that's still showing (e.g. "Saving…" → "Saved"). */
  id?: string;
}

export interface ToasterOptions {
  position?: ToastPosition;
  /** Accessible name of the notifications region. Translate it. */
  label?: string;
  /** Accessible name of each toast's close button. Translate it. */
  closeLabel?: string;
}

export interface ToastHandle {
  id: string;
  dismiss: () => void;
}

export const toastCloseIcon = iconSvg(Cancel01Icon);
export const toastSuccessIcon = iconSvg(CheckmarkCircle02Icon);
export const toastWarningIcon = iconSvg(Alert02Icon);
export const toastInfoIcon = iconSvg(InformationCircleIcon);
export const toastErrorIcon = iconSvg(CancelCircleIcon);

const VARIANT_ICONS: Record<string, string> = {
  success: toastSuccessIcon,
  warning: toastWarningIcon,
  destructive: toastErrorIcon,
  info: toastInfoIcon,
};

let config: Required<ToasterOptions> = { position: "bottom-end", label: "Notifications", closeLabel: "Dismiss" };
const live = new Map<string, { el: HTMLElement; dismiss: () => void }>();
let counter = 0;

function syncIndices(host: HTMLElement): void {
  // Elements are in order of creation. We assign reverse index: newest = 0, older = 1, 2...
  const toasts = Array.from(host.querySelectorAll<HTMLElement>(".ayy-toast:not([data-leaving])"));
  const count = toasts.length;
  let accumulatedHeight = 0;
  const gap = 12; // 0.75rem / var(--ayy-space-3)

  for (let i = count - 1; i >= 0; i--) {
    const el = toasts[i];
    const revIndex = count - 1 - i;
    el.style.setProperty("--_toast-index", String(revIndex));
    el.style.setProperty("--_toast-offset-y", `${accumulatedHeight}px`);

    if (revIndex === 0) {
      el.removeAttribute("data-behind");
    } else {
      el.setAttribute("data-behind", "");
    }

    if (revIndex >= 5) {
      el.setAttribute("data-limited", "");
    } else {
      el.removeAttribute("data-limited");
    }

    accumulatedHeight += (el.offsetHeight || 56) + gap;
  }

  if (toasts.length > 0) {
    const front = toasts[toasts.length - 1];
    const frontH = front.offsetHeight || 56;
    host.style.setProperty("--_toast-front-height", `${frontH}px`);
    host.style.setProperty("--_toast-expanded-height", `${accumulatedHeight}px`);
  } else {
    host.style.removeProperty("--_toast-front-height");
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
    // Hover and focus expand the deck
    const expand = () => {
      syncIndices(toaster);
      toaster.setAttribute("data-expanded", "");
    };
    const collapse = () => {
      toaster.removeAttribute("data-expanded");
    };
    toaster.addEventListener("pointerenter", expand);
    toaster.addEventListener("pointerleave", collapse);
    toaster.addEventListener("focusin", expand);
    toaster.addEventListener("focusout", (e) => {
      if (!toaster.contains(e.relatedTarget as Node | null)) collapse();
    });

    document.body.append(el);
  }
  el.setAttribute("aria-label", config.label);
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
    window.clearTimeout(timer);
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
    toast.addEventListener("animationend", remove, { once: true });
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

  const close = document.createElement("button");
  close.type = "button";
  close.className = "ayy-toast__close";
  close.setAttribute("aria-label", config.closeLabel);
  close.innerHTML = toastCloseIcon;
  close.addEventListener("click", dismiss);
  toast.append(close);

  const start = () => {
    if (!Number.isFinite(remaining)) return;
    startedAt = Date.now();
    timer = window.setTimeout(dismiss, remaining);
  };
  const pause = () => {
    if (!timer) return;
    window.clearTimeout(timer);
    timer = 0;
    remaining -= Date.now() - startedAt;
  };
  toast.addEventListener("pointerenter", pause);
  toast.addEventListener("pointerleave", start);
  toast.addEventListener("focusin", pause);
  toast.addEventListener("focusout", (event) => {
    if (!toast.contains(event.relatedTarget as Node | null)) start();
  });

  // Swipe / Drag to dismiss gesture
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
    // Downwards swipe dismisses bottom toasts; upwards for top toasts
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

  const host = region();
  host.append(toast);
  live.set(id, { el: toast, dismiss });
  syncIndices(host);
  requestAnimationFrame(() => syncIndices(host));
  start();
  return { id, dismiss };
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
  /** Dismiss one toast by id, or all of them. */
  dismiss(id?: string): void {
    if (id) live.get(id)?.dismiss();
    else for (const entry of [...live.values()]) entry.dismiss();
  },
});
