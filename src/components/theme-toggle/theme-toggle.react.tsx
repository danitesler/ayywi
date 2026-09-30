import { forwardRef, useEffect, useId, useRef, type ButtonHTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { mergeRefs } from "../../lib/refs";
import type { ThemeMode } from "../../theme";
import { buttonClass } from "../button/button";
import { menuClass, menuItemClass } from "../menu/menu";
import { connectThemeToggle, themeToggleClass, themeToggleItemClass, themeToggleMoonClass, themeToggleOptions, themeToggleSunClass } from "./theme-toggle";

export interface ThemeToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Called with the theme just applied ("system" clears the override). */
  onValueChange?: (theme: ThemeMode) => void;
}

/** An outline icon button that opens a menu of every theme (and "system"), applies the choice and remembers it. */
export const ThemeToggle = forwardRef<HTMLButtonElement, ThemeToggleProps>(function ThemeToggle(
  { onValueChange, className, "aria-label": label = "Theme", ...props },
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
        <svg className={themeToggleMoonClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
        </svg>
        <svg className={themeToggleSunClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
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
            {text}
          </button>
        ))}
      </div>
    </>
  );
});
