import { forwardRef, useEffect, useRef, type ButtonHTMLAttributes, type HTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { mergeRefs } from "../../lib/refs";
import {
  connectToolbar,
  toolbarButtonClass,
  toolbarClass,
  toolbarGroupClass,
  toolbarSeparatorClass,
  toolbarSpacerClass,
  type ToolbarController,
  type ToolbarSize,
} from "./toolbar";

export interface ToolbarProps extends HTMLAttributes<HTMLDivElement> {
  /** A column of tools (an editor's side rail). Sets aria-orientation="vertical". */
  vertical?: boolean;
  /** A raised pill with a shadow, over a canvas or a photo. */
  floating?: boolean;
  /** One line that scrolls sideways (phones). */
  scroll?: boolean;
  size?: ToolbarSize;
}

/** role="toolbar": one Tab stop, arrow keys between its buttons. Give it an aria-label ("Text formatting"). */
export const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(function Toolbar({ vertical, floating, scroll, size, className, children, ...props }, ref) {
  const inner = useRef<HTMLDivElement>(null);
  const controller = useRef<ToolbarController | null>(null);
  useEffect(() => {
    if (!inner.current) return;
    const c = connectToolbar(inner.current);
    controller.current = c;
    return () => {
      c.destroy();
      controller.current = null;
    };
  }, []);
  // Items come and go with state (a tool shown only for a selection): keep one Tab stop.
  useEffect(() => controller.current?.refresh());
  return (
    <div
      ref={mergeRefs(ref, inner)}
      role="toolbar"
      aria-orientation={vertical ? "vertical" : undefined}
      className={toolbarClass({ vertical, floating, scroll, size, className })}
      {...props}
    >
      {children}
    </div>
  );
});

export interface ToolbarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** A tool that stays on (the current pen, bold): aria-pressed. Leave undefined for one-off actions. */
  pressed?: boolean;
}

/** A tool: an icon (give it aria-label) or an icon and a short label. */
export const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(function ToolbarButton(
  { pressed, type = "button", className, ...props },
  ref,
) {
  return <button ref={ref} type={type} aria-pressed={pressed} className={cx(toolbarButtonClass, className)} {...props} />;
});

/** Tools that belong together. role="group" with an aria-label when the group has a name ("Shapes"). */
export const ToolbarGroup = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function ToolbarGroup({ className, ...props }, ref) {
  return <div ref={ref} role="group" className={cx(toolbarGroupClass, className)} {...props} />;
});

/** A line between groups. */
export const ToolbarSeparator = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function ToolbarSeparator({ className, ...props }, ref) {
  return <div ref={ref} role="separator" className={cx(toolbarSeparatorClass, className)} {...props} />;
});

/** Pushes the items after it to the far end. */
export const ToolbarSpacer = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function ToolbarSpacer({ className, ...props }, ref) {
  return <div ref={ref} aria-hidden="true" className={cx(toolbarSpacerClass, className)} {...props} />;
});
