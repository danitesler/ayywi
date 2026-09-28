import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type MutableRefObject,
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

const PopoverContext = createContext<PopoverContextValue | null>(null);

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

/** The button that opens the popover. Accepts all Button props. */
export const PopoverTrigger = forwardRef<HTMLButtonElement, ButtonProps>(function PopoverTrigger(props, ref) {
  const ctx = usePopover("PopoverTrigger");
  return <Button ref={mergeRefs(ref, ctx.triggerRef)} aria-haspopup="dialog" {...props} />;
});

export interface PopoverContentProps extends HTMLAttributes<HTMLDivElement> {
  side?: FloatingSide;
  align?: FloatingAlign;
}

export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(function PopoverContent(
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
