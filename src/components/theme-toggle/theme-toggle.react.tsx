import { forwardRef, useEffect, useId, useRef, type ButtonHTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { Moon02Icon, Sun03Icon } from "../../lib/icons";
import { mergeRefs } from "../../lib/refs";
import type { ThemeMode } from "../../theme";
import { buttonClass } from "../button/button";
import { Icon } from "../icon/icon.react";
import { menuClass, menuItemClass } from "../menu/menu";
import { connectThemeToggle, themeToggleClass, themeToggleItemClass, themeToggleMoonClass, themeToggleOptions, themeToggleSunClass } from "./theme-toggle";

export interface ThemeToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Called with the theme just applied ("system" clears the override). */
  onValueChange?: (theme: ThemeMode) => void;
  /** Menu item text per theme, for translation, e.g. { system: "Système", dark: "Sombre" }. Defaults: System, Dark, Dark contrast… */
  labels?: Partial<Record<ThemeMode, string>>;
}

/** An outline icon button that opens a menu of every theme (and "system"), applies the choice and remembers it. */
export const ThemeToggle = forwardRef<HTMLButtonElement, ThemeToggleProps>(function ThemeToggle(
  { onValueChange, labels, className, "aria-label": label = "Theme", ...props },
  ref,
) {
  const local = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const onChange = useRef(onValueChange);
  onChange.current = onValueChange;
  useEffect(
    () => (local.current && menu.current ? connectThemeToggle(local.current, menu.current, { onChange: (t) => onChange.current?.(t) }) : undefined),
    [],
  );
  return (
    <>
      <button
        ref={mergeRefs(ref, local)}
        type="button"
        className={buttonClass({ variant: "outline", size: "icon", className: cx(themeToggleClass, className) })}
        aria-label={label}
        aria-haspopup="menu"
        popoverTarget={menuId}
        {...props}
      >
        <Icon icon={Moon02Icon} className={themeToggleMoonClass} />
        <Icon icon={Sun03Icon} className={themeToggleSunClass} />
      </button>
      <div ref={menu} id={menuId} className={menuClass} popover="auto" role="menu" aria-label={label}>
        {themeToggleOptions.map(({ value, label: text }) => (
          <button
            key={value}
            type="button"
            role="menuitemradio"
            aria-checked={value === "system"}
            tabIndex={-1}
            className={menuItemClass({ className: themeToggleItemClass })}
            data-value={value}
          >
            {labels?.[value] ?? text}
          </button>
        ))}
      </div>
    </>
  );
});
