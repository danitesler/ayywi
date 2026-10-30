import {
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type MutableRefObject,
  type ReactElement,
  type ReactNode,
} from "react";
import { cx } from "../../lib/cx";
import type { FloatingAlign, FloatingSide } from "../../lib/position";
import { mergeRefs } from "../../lib/refs";
import { Button, type ButtonProps } from "../button/button.react";
import { connectPopover, popoverClass, type PopoverController } from "./popover";

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  contentId: string;
  triggerRef: MutableRefObject<HTMLButtonElement | null>;
  contentRef: MutableRefObject<HTMLDivElement | null>;
  controllerRef: MutableRefObject<PopoverController | null>;
}

const PopoverContext = /* @__PURE__ */ createContext<PopoverContextValue | null>(null);

function usePopover(component: string): PopoverContextValue {
  const ctx = useContext(PopoverContext);
  if (!ctx) throw new Error(`<${component}> must be used inside <Popover>.`);
  return ctx;
}

export interface PopoverProps {
  open?: boolean;
  defaultOpen?: boolean;
  /** Called on every open/close, including click-outside and Esc. */
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

/** State holder. Renders no element; put a PopoverTrigger and a PopoverContent inside. */
export function Popover({ open: controlled, defaultOpen = false, onOpenChange, children }: PopoverProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const open = controlled ?? uncontrolled;
  const contentId = useId();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<PopoverController | null>(null);

  const setOpen = useCallback(
    (next: boolean) => {
      if (controlled === undefined) setUncontrolled(next);
      onOpenChange?.(next);
    },
    [controlled, onOpenChange],
  );

  return (
    <PopoverContext.Provider value={{ open, setOpen, contentId, triggerRef, contentRef, controllerRef }}>
      {children}
    </PopoverContext.Provider>
  );
}

export interface PopoverTriggerProps extends ButtonProps {
  /** Clone the child element and merge trigger props onto it instead of rendering a Button. */
  asChild?: boolean;
}

/** The button that opens the popover. Accepts all Button props, or pass asChild to clone a custom trigger element. */
export const PopoverTrigger = /* @__PURE__ */ forwardRef<HTMLButtonElement, PopoverTriggerProps>(function PopoverTrigger(
  { asChild = false, children, ...props },
  ref,
) {
  const ctx = usePopover("PopoverTrigger");
  if (asChild) {
    return isValidElement(children)
      ? cloneElement(children as ReactElement<Record<string, unknown>>, {
          "aria-haspopup": "dialog",
          ...props,
          ...(children.props as Record<string, unknown>),
          className: cx(props.className, (children.props as { className?: string })?.className) || undefined,
          ref: mergeRefs(ref, ctx.triggerRef, (children as any).ref ?? (children.props as any)?.ref),
        })
      : null;
  }
  return (
    <Button ref={mergeRefs(ref, ctx.triggerRef)} aria-haspopup="dialog" {...props}>
      {children}
    </Button>
  );
});

export interface PopoverContentProps extends HTMLAttributes<HTMLDivElement> {
  side?: FloatingSide;
  align?: FloatingAlign;
}

export const PopoverContent = /* @__PURE__ */ forwardRef<HTMLDivElement, PopoverContentProps>(function PopoverContent(
  { side = "bottom", align = "center", className, ...props },
  ref,
) {
  const ctx = usePopover("PopoverContent");
  const setOpenRef = useRef(ctx.setOpen);
  setOpenRef.current = ctx.setOpen;
  const openRef = useRef(ctx.open);
  openRef.current = ctx.open;

  useEffect(() => {
    const trigger = ctx.triggerRef.current;
    const content = ctx.contentRef.current;
    if (!trigger || !content) return;
    const controller = connectPopover(trigger, content, {
      side,
      align,
      onToggle: (open) => {
        if (open !== openRef.current) setOpenRef.current(open);
      },
    });
    ctx.controllerRef.current = controller;
    if (openRef.current) controller.open();
    return () => {
      controller.destroy();
      ctx.controllerRef.current = null;
    };
    // Connect once; side/align changes are applied by the next effect without reconnecting.
  }, []);

  useEffect(() => {
    ctx.controllerRef.current?.update({ side, align });
  }, [side, align, ctx.controllerRef]);

  useEffect(() => {
    const controller = ctx.controllerRef.current;
    if (!controller) return;
    if (ctx.open) controller.open();
    else controller.close();
  }, [ctx.open, ctx.controllerRef]);

  return (
    <div
      ref={mergeRefs(ref, ctx.contentRef)}
      id={ctx.contentId}
      role="dialog"
      className={cx(popoverClass, className)}
      popover="auto"
      {...props}
    />
  );
});
