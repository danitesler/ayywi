import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type DialogHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cx } from "../../lib/cx";
import { Cancel01Icon } from "../../lib/icons";
import { Button, type ButtonProps } from "../button/button.react";
import { Icon } from "../icon/icon.react";
import { dialogClass, isBackdropClick, type DialogSide, type DialogSize } from "./dialog";

interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  titleId: string;
  descriptionId: string;
  hasDescription: boolean;
  setHasDescription: (value: boolean) => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialog(component: string): DialogContextValue {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error(`<${component}> must be used inside <Dialog>.`);
  return ctx;
}

export interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  /** Called on every open/close, including Esc and backdrop click. Required to keep a controlled dialog in sync. */
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

/** State holder. Renders no element; put a DialogTrigger and a DialogContent inside. */
export function Dialog({ open: controlled, defaultOpen = false, onOpenChange, children }: DialogProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const [hasDescription, setHasDescription] = useState(false);
  const open = controlled ?? uncontrolled;
  const id = useId();

  const setOpen = useCallback(
    (next: boolean) => {
      if (controlled === undefined) setUncontrolled(next);
      onOpenChange?.(next);
    },
    [controlled, onOpenChange],
  );

  return (
    <DialogContext.Provider
      value={{ open, setOpen, titleId: `${id}title`, descriptionId: `${id}desc`, hasDescription, setHasDescription }}
    >
      {children}
    </DialogContext.Provider>
  );
}

export const DialogTrigger = forwardRef<HTMLButtonElement, ButtonProps>(function DialogTrigger({ onClick, ...props }, ref) {
  const { setOpen } = useDialog("DialogTrigger");
  return (
    <Button
      ref={ref}
      aria-haspopup="dialog"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) setOpen(true);
      }}
      {...props}
    />
  );
});

export interface DialogContentProps extends DialogHTMLAttributes<HTMLDialogElement> {
  size?: DialogSize;
  /** "start" / "end" turn it into a side modal: a full-height panel sliding in from that inline edge. Default "center". */
  side?: DialogSide;
  /** Hide the built-in top-corner close button. */
  hideClose?: boolean;
  /** Accessible label of the close button. Translate it. Default "Close". */
  closeLabel?: string;
  /** Close when the backdrop is clicked. Default true. */
  closeOnBackdrop?: boolean;
}

/** Longest transition on `el`, in ms (for waiting out the closing animation). */
function transitionMs(el: Element): number {
  const style = getComputedStyle(el);
  const toMs = (v: string) => (v.trim().endsWith("ms") ? parseFloat(v) : parseFloat(v) * 1000) || 0;
  const durations = style.transitionDuration.split(",").map(toMs);
  const delays = style.transitionDelay.split(",").map(toMs);
  return Math.max(0, ...durations.map((d, i) => d + (delays[i] ?? 0)));
}

export const DialogContent = forwardRef<HTMLDialogElement, DialogContentProps>(function DialogContent(
  { size, side, className, children, hideClose, closeLabel = "Close", closeOnBackdrop = true, onClose, onClick, ...props },
  forwardedRef,
) {
  const ctx = useDialog("DialogContent");
  const innerRef = useRef<HTMLDialogElement | null>(null);
  // Children stay mounted while the closing transition runs, then unmount (closed dialogs cost nothing).
  const [present, setPresent] = useState(ctx.open);

  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    if (ctx.open && !el.open) {
      setPresent(true);
      el.showModal();
    } else if (!ctx.open && el.open) {
      el.close();
    }
  }, [ctx.open]);

  useEffect(() => {
    const el = innerRef.current;
    if (ctx.open || !present || !el) return;
    const done = () => setPresent(false);
    const onEnd = (event: TransitionEvent) => {
      if (event.target === el && event.propertyName === "opacity") done();
    };
    el.addEventListener("transitionend", onEnd);
    const timer = window.setTimeout(done, transitionMs(el) + 50);
    return () => {
      el.removeEventListener("transitionend", onEnd);
      window.clearTimeout(timer);
    };
  }, [ctx.open, present]);

  return (
    <dialog
      ref={(el) => {
        innerRef.current = el;
        if (typeof forwardedRef === "function") forwardedRef(el);
        else if (forwardedRef) forwardedRef.current = el;
      }}
      className={dialogClass({ size, side, className })}
      aria-labelledby={ctx.titleId}
      aria-describedby={ctx.hasDescription ? ctx.descriptionId : undefined}
      onClose={(event) => {
        onClose?.(event);
        if (ctx.open) ctx.setOpen(false);
      }}
      onClick={(event) => {
        onClick?.(event);
        if (closeOnBackdrop && !event.defaultPrevented && isBackdropClick(event.currentTarget, event)) ctx.setOpen(false);
      }}
      {...props}
    >
      {ctx.open || present ? (
        <>
          {children}
          {hideClose ? null : (
            <button type="button" className="ayy-dialog__close" aria-label={closeLabel} onClick={() => ctx.setOpen(false)}>
              <Icon icon={Cancel01Icon} />
            </button>
          )}
        </>
      ) : null}
    </dialog>
  );
});

export const DialogHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function DialogHeader(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx("ayy-dialog__header", className)} {...props} />;
});

/** Scrolls on its own between the header and the footer, which stay in view. Fills the height of a side modal. */
export const DialogBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function DialogBody({ className, ...props }, ref) {
  return <div ref={ref} className={cx("ayy-dialog__body", className)} {...props} />;
});

export const DialogFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function DialogFooter(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx("ayy-dialog__footer", className)} {...props} />;
});

export const DialogTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(function DialogTitle(
  { className, ...props },
  ref,
) {
  const { titleId } = useDialog("DialogTitle");
  return <h2 ref={ref} id={titleId} className={cx("ayy-dialog__title", className)} {...props} />;
});

export const DialogDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  function DialogDescription({ className, ...props }, ref) {
    const { descriptionId, setHasDescription } = useDialog("DialogDescription");
    useLayoutEffect(() => {
      setHasDescription(true);
      return () => setHasDescription(false);
    }, [setHasDescription]);
    return <p ref={ref} id={descriptionId} className={cx("ayy-dialog__description", className)} {...props} />;
  },
);

/** A Button that closes the dialog. Defaults to the secondary variant. */
export const DialogClose = forwardRef<HTMLButtonElement, ButtonProps>(function DialogClose(
  { variant = "secondary", onClick, ...props },
  ref,
) {
  const { setOpen } = useDialog("DialogClose");
  return (
    <Button
      ref={ref}
      variant={variant}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) setOpen(false);
      }}
      {...props}
    />
  );
});
