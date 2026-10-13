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
import type { FloatingAlign, FloatingSide, PlaceBoundary } from "../../lib/position";
import { mergeRefs } from "../../lib/refs";
import { Button, type ButtonProps } from "../button/button.react";
import {
  connectMenu,
  menuChevronClass,
  menuClass,
  menuDescriptionClass,
  menuGroupInlineClass,
  menuItemClass,
  menuLabelClass,
  menuSeparatorClass,
  menuShortcutClass,
  menuValueClass,
  type MenuController,
  type MenuSubmenuLayout,
} from "./menu";

interface MenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  contentId: string;
  triggerRef: MutableRefObject<HTMLButtonElement | null>;
  contentRef: MutableRefObject<HTMLDivElement | null>;
  controllerRef: MutableRefObject<MenuController | null>;
  boundary?: PlaceBoundary;
  parentSub?: boolean;
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
  /** Anchor point in viewport coordinates for context menus. */
  anchorPoint?: { x: number; y: number };
  /** Optional boundary to constrain placement. */
  boundary?: PlaceBoundary;
  children: ReactNode;
}

/** State holder. Renders no element; put a DropdownMenuTrigger and a DropdownMenuContent inside. */
export function DropdownMenu({
  open: controlled,
  defaultOpen = false,
  onOpenChange,
  anchorPoint,
  boundary,
  children,
}: DropdownMenuProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const open = controlled ?? uncontrolled;
  const contentId = useId();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<MenuController | null>(null);

  const setOpen = useCallback(
    (next: boolean) => {
      if (controlled === undefined) setUncontrolled(next);
      onOpenChange?.(next);
    },
    [controlled, onOpenChange],
  );

  useEffect(() => {
    if (anchorPoint && controllerRef.current) {
      controllerRef.current.openAt(anchorPoint.x, anchorPoint.y);
    }
  }, [anchorPoint]);

  return (
    <MenuContext.Provider value={{ open, setOpen, contentId, triggerRef, contentRef, controllerRef, boundary }}>
      {children}
    </MenuContext.Provider>
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
  /** Static menu: stays visible in the normal layout without popover behavior. */
  static?: boolean;
  boundary?: PlaceBoundary;
  subSide?: FloatingSide;
  onSubmenuLayout?: (layout: MenuSubmenuLayout) => void;
}

export const DropdownMenuContent = forwardRef<HTMLDivElement, DropdownMenuContentProps>(function DropdownMenuContent(
  { side = "bottom", align = "start", static: isStatic, boundary, subSide, onSubmenuLayout, className, ...props },
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
    if (!content) return;
    const controller = connectMenu(trigger, content, {
      side,
      align,
      static: isStatic,
      boundary: boundary ?? ctx.boundary,
      subSide,
      onSubmenuLayout,
      onToggle: (open) => {
        if (open !== openRef.current) setOpenRef.current(open);
      },
    });
    ctx.controllerRef.current = controller;
    if (openRef.current && !isStatic) controller.open();
    return () => {
      controller.destroy();
      ctx.controllerRef.current = null;
    };
  }, []);

  useEffect(() => {
    ctx.controllerRef.current?.update({ side, align });
  }, [side, align, ctx.controllerRef]);

  useEffect(() => {
    const controller = ctx.controllerRef.current;
    if (!controller || isStatic) return;
    if (ctx.open) controller.open();
    else controller.close();
  }, [ctx.open, isStatic, ctx.controllerRef]);

  return (
    <div
      ref={mergeRefs(ref, ctx.contentRef)}
      id={ctx.contentId}
      role="menu"
      className={cx(menuClass, isStatic && "ayy-menu--static", className)}
      popover={isStatic ? undefined : "auto"}
      {...props}
    />
  );
});

export interface DropdownMenuItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  /** Called when the item is chosen (click, Enter, Space). The menu closes afterwards unless closeOnSelect is false. */
  onSelect?: () => void;
  destructive?: boolean;
  /** Keyboard shortcut hint shown at the end, e.g. "⌘D". */
  shortcut?: string;
  /** Value or badge text shown before shortcut/chevron. */
  value?: ReactNode;
  /** Description shown under the label. */
  description?: ReactNode;
  /** Icon shown at the start. */
  icon?: ReactNode;
  /** Close menu on select? Default true for normal items, false for check/radio items. */
  closeOnSelect?: boolean;
}

export const DropdownMenuItem = forwardRef<HTMLButtonElement, DropdownMenuItemProps>(function DropdownMenuItem(
  {
    onSelect,
    destructive,
    shortcut,
    value,
    description,
    icon,
    closeOnSelect,
    className,
    onClick,
    children,
    type = "button",
    ...props
  },
  ref,
) {
  const descId = useId();
  const hasDesc = Boolean(description);

  return (
    <button
      ref={ref}
      type={type}
      role="menuitem"
      tabIndex={-1}
      data-close-on-select={closeOnSelect !== undefined ? String(closeOnSelect) : undefined}
      aria-describedby={hasDesc ? descId : undefined}
      className={menuItemClass({ destructive, described: hasDesc, className })}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) onSelect?.();
      }}
      {...props}
    >
      {icon}
      {hasDesc ? (
        <span className="ayy-menu__item-text">
          <span>{children}</span>
          <span id={descId} className={menuDescriptionClass}>
            {description}
          </span>
        </span>
      ) : (
        children
      )}
      {value ? <span className={menuValueClass}>{value}</span> : null}
      {shortcut ? <span className={menuShortcutClass}>{shortcut}</span> : null}
    </button>
  );
});

/* ---- Submenu Components ---- */

interface SubmenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  subTriggerRef: MutableRefObject<HTMLButtonElement | null>;
  subContentRef: MutableRefObject<HTMLDivElement | null>;
  inline: boolean;
  subContentId: string;
}

const SubmenuContext = createContext<SubmenuContextValue | null>(null);

function useSubmenu(component: string): SubmenuContextValue {
  const ctx = useContext(SubmenuContext);
  if (!ctx) throw new Error(`<${component}> must be used inside <DropdownMenuSub>.`);
  return ctx;
}

export interface DropdownMenuSubProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Render as an inline accordion rather than a side flyout panel. */
  inline?: boolean;
  children: ReactNode;
}

export function DropdownMenuSub({
  open: controlled,
  defaultOpen = false,
  onOpenChange,
  inline = false,
  children,
}: DropdownMenuSubProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const open = controlled ?? uncontrolled;
  const subContentId = useId();
  const subTriggerRef = useRef<HTMLButtonElement | null>(null);
  const subContentRef = useRef<HTMLDivElement | null>(null);

  const setOpen = useCallback(
    (next: boolean) => {
      if (controlled === undefined) setUncontrolled(next);
      onOpenChange?.(next);
    },
    [controlled, onOpenChange],
  );

  return (
    <SubmenuContext.Provider value={{ open, setOpen, subTriggerRef, subContentRef, inline, subContentId }}>
      {children}
    </SubmenuContext.Provider>
  );
}

export interface DropdownMenuSubTriggerProps extends Omit<DropdownMenuItemProps, "shortcut"> {
  icon?: ReactNode;
}

export const DropdownMenuSubTrigger = forwardRef<HTMLButtonElement, DropdownMenuSubTriggerProps>(
  function DropdownMenuSubTrigger(
    { children, icon, value, description, className, onClick, ...props },
    ref,
  ) {
    const sub = useSubmenu("DropdownMenuSubTrigger");
    const descId = useId();
    const hasDesc = Boolean(description);

    return (
      <button
        ref={mergeRefs(ref, sub.subTriggerRef)}
        type="button"
        role="menuitem"
        tabIndex={-1}
        aria-haspopup="menu"
        aria-expanded={sub.open ? "true" : "false"}
        aria-controls={sub.subContentId}
        aria-describedby={hasDesc ? descId : undefined}
        className={menuItemClass({
          sub: !sub.inline,
          expand: sub.inline,
          described: hasDesc,
          className,
        })}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) sub.setOpen(!sub.open);
        }}
        {...props}
      >
        {icon}
        {hasDesc ? (
          <span className="ayy-menu__item-text">
            <span>{children}</span>
            <span id={descId} className={menuDescriptionClass}>
              {description}
            </span>
          </span>
        ) : (
          children
        )}
        {value ? <span className={menuValueClass}>{value}</span> : null}
        <span className={menuChevronClass} aria-hidden="true" />
      </button>
    );
  },
);

export interface DropdownMenuSubContentProps extends HTMLAttributes<HTMLDivElement> {
  side?: FloatingSide;
  align?: FloatingAlign;
}

export const DropdownMenuSubContent = forwardRef<HTMLDivElement, DropdownMenuSubContentProps>(
  function DropdownMenuSubContent({ className, children, ...props }, ref) {
    const sub = useSubmenu("DropdownMenuSubContent");

    if (sub.inline) {
      return (
        <div
          ref={mergeRefs(ref, sub.subContentRef)}
          id={sub.subContentId}
          role="group"
          hidden={!sub.open}
          className={cx(menuGroupInlineClass, className)}
          {...props}
        >
          {children}
        </div>
      );
    }

    return (
      <div
        ref={mergeRefs(ref, sub.subContentRef)}
        id={sub.subContentId}
        role="menu"
        popover="auto"
        className={cx(menuClass, "ayy-menu--sub", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

/* ---- Checkbox & Radio Items ---- */

export interface DropdownMenuCheckboxItemProps extends DropdownMenuItemProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const DropdownMenuCheckboxItem = forwardRef<HTMLButtonElement, DropdownMenuCheckboxItemProps>(
  function DropdownMenuCheckboxItem(
    { checked = false, onCheckedChange, onSelect, closeOnSelect = false, onClick, children, ...props },
    ref,
  ) {
    return (
      <DropdownMenuItem
        ref={ref}
        role="menuitemcheckbox"
        aria-checked={checked}
        closeOnSelect={closeOnSelect}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) {
            onCheckedChange?.(!checked);
          }
        }}
        onSelect={onSelect}
        {...props}
      >
        {children}
      </DropdownMenuItem>
    );
  },
);

interface RadioGroupContextValue {
  value?: string;
  onValueChange?: (val: string) => void;
  closeOnSelect?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface DropdownMenuRadioGroupProps extends HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
  closeOnSelect?: boolean;
}

export const DropdownMenuRadioGroup = forwardRef<HTMLDivElement, DropdownMenuRadioGroupProps>(
  function DropdownMenuRadioGroup({ value, onValueChange, closeOnSelect = false, children, ...props }, ref) {
    return (
      <RadioGroupContext.Provider value={{ value, onValueChange, closeOnSelect }}>
        <div ref={ref} role="group" {...props}>
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  },
);

export interface DropdownMenuRadioItemProps extends DropdownMenuItemProps {
  value: string;
}

export const DropdownMenuRadioItem = forwardRef<HTMLButtonElement, DropdownMenuRadioItemProps>(
  function DropdownMenuRadioItem({ value, onSelect, onClick, children, ...props }, ref) {
    const group = useContext(RadioGroupContext);
    const checked = group?.value === value;

    return (
      <DropdownMenuItem
        ref={ref}
        role="menuitemradio"
        aria-checked={checked}
        closeOnSelect={group?.closeOnSelect ?? false}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) {
            group?.onValueChange?.(value);
          }
        }}
        onSelect={onSelect}
        {...props}
      >
        {children}
      </DropdownMenuItem>
    );
  },
);

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
