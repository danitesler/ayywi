import { forwardRef, useEffect, useRef, type ButtonHTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { mergeRefs } from "../../lib/refs";
import type { ThemeName } from "../../tokens";
import { buttonClass } from "../button/button";
import { connectThemeToggle, themeToggleClass, themeToggleMoonClass, themeToggleSunClass } from "./theme-toggle";

export interface ThemeToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Theme used for dark. Default "dark". */
  dark?: ThemeName;
  /** Theme used for light. Default "light". */
  light?: ThemeName;
  /** Called with the theme just applied. */
  onValueChange?: (theme: ThemeName) => void;
}

/** An outline icon button that switches between a dark and a light theme and remembers the choice. */
export const ThemeToggle = forwardRef<HTMLButtonElement, ThemeToggleProps>(function ThemeToggle(
  { dark, light, onValueChange, className, "aria-label": label = "Dark theme", ...props },
  ref,
) {
  const local = useRef<HTMLButtonElement>(null);
  const onChange = useRef(onValueChange);
  onChange.current = onValueChange;
  useEffect(
    () => (local.current ? connectThemeToggle(local.current, { dark, light, onChange: (t) => onChange.current?.(t) }) : undefined),
    [dark, light],
  );
  return (
    <button
      ref={mergeRefs(ref, local)}
      type="button"
      className={buttonClass({ variant: "outline", size: "icon", className: cx(themeToggleClass, className) })}
      aria-label={label}
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
  );
});
