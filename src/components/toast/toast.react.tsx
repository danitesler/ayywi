import { useEffect } from "react";
import { configureToaster, type ToastPosition } from "./toast";

export interface ToasterProps {
  position?: ToastPosition;
  /** Accessible name of the notifications region. Translate it. Default "Notifications". */
  label?: string;
  /** Accessible name of each toast's close button. Translate it. Default "Dismiss". */
  closeLabel?: string;
}

/**
 * Optional: configures where toasts appear and their translated labels. Toasts work without it —
 * call toast() from anywhere. Renders nothing.
 */
export function Toaster({ position, label, closeLabel }: ToasterProps) {
  useEffect(() => {
    configureToaster({
      ...(position ? { position } : {}),
      ...(label ? { label } : {}),
      ...(closeLabel ? { closeLabel } : {}),
    });
  }, [position, label, closeLabel]);
  return null;
}
