import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type MutableRefObject,
  type ReactNode,
} from "react";
import { cx } from "../../lib/cx";
import type { FloatingAlign, FloatingSide } from "../../lib/position";
import { mergeRefs } from "../../lib/refs";
import { Button, type ButtonProps } from "../button/button.react";
import type { PopoverController } from "../popover/popover";
import { connectMenu, menuClass, menuItemClass, menuLabelClass, menuSeparatorClass, menuShortcutClass } from "./menu";

interface MenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  contentId: string;
  triggerRef: MutableRefObject<HTMLButtonElement | null>;
  contentRef: MutableRefObject<HTMLDivElement | null>;
  controllerRef: MutableRefObject<PopoverController | null>;
}

const MenuContext = createContext<MenuContextValue | null>(null);

function useMenu(component: string): MenuContextValue {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error(`<${component}> must be used inside <DropdownMenu>.`);
  return ctx;
}

export interface DropdownMenuProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

/** State holder. Renders no element; put a DropdownMenuTrigger and a DropdownMenuContent inside. */
export function DropdownMenu({ open: controlled, defaultOpen = false, onOpenChange, children }: DropdownMenuProps) {
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
    <MenuContext.Provider value={{ open, setOpen, contentId, triggerRef, contentRef, controllerRef }}>{children}</MenuContext.Provider>
  );
}

/** The button that opens the menu. Accepts all Button props. */
export const DropdownMenuTrigger = forwardRef<HTMLButtonElement, ButtonProps>(function DropdownMenuTrigger(props, ref) {
  const ctx = useMenu("DropdownMenuTrigger");
  return <Button ref={mergeRefs(ref, ctx.triggerRef)} aria-haspopup="menu" {...props} />;
});

export interface DropdownMenuContentProps extends HTMLAttributes<HTMLDivElement> {
  side?: FloatingSide;
  align?: FloatingAlign;
}

export const DropdownMenuContent = forwardRef<HTMLDivElement, DropdownMenuContentProps>(function DropdownMenuContent(
  { side = "bottom", align = "start", className, ...props },
  ref,
) {
  const ctx = useMenu("DropdownMenuContent");
  const setOpenRef = useRef(ctx.setOpen);
  setOpenRef.current = ctx.setOpen;
  const openRef = useRef(ctx.open);
  openRef.current = ctx.open;

  useEffect(() => {
    const trigger = ctx.triggerRef.current;
    const content = ctx.contentRef.current;
    if (!trigger || !content) return;
    const controller = connectMenu(trigger, content, {
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
      role="menu"
      className={cx(menuClass, className)}
      popover="auto"
      {...props}
    />
  );
});

export interface DropdownMenuItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Called when the item is chosen (click, Enter, Space). The menu closes afterwards. */
  onSelect?: () => void;
  destructive?: boolean;
  /** Keyboard shortcut hint shown at the end, e.g. "⌘D". */
  shortcut?: string;
}

export const DropdownMenuItem = forwardRef<HTMLButtonElement, DropdownMenuItemProps>(function DropdownMenuItem(
  { onSelect, destructive, shortcut, className, onClick, children, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      role="menuitem"
      tabIndex={-1}
      className={menuItemClass({ destructive, className })}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) onSelect?.();
      }}
      {...props}
    >
      {children}
      {shortcut ? <span className={menuShortcutClass}>{shortcut}</span> : null}
    </button>
  );
});

export const DropdownMenuLabel = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function DropdownMenuLabel(
  { className, ...props },
  ref,
) {
  return <div ref={ref} role="presentation" className={cx(menuLabelClass, className)} {...props} />;
});

export const DropdownMenuSeparator = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function DropdownMenuSeparator(
  { className, ...props },
  ref,
) {
  return <div ref={ref} role="separator" className={cx(menuSeparatorClass, className)} {...props} />;
});
