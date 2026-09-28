import { createElement, forwardRef, type SVGAttributes } from "react";
import { iconClass, type IconData, type IconSize } from "./icon";

export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, "strokeWidth"> {
  /** Icon data, e.g. `import { Search01Icon } from "@hugeicons/core-free-icons"`. */
  icon: IconData;
  /** "auto" (default) follows the text size; sm, md, lg and xl are 16, 20, 24 and 32px. */
  size?: IconSize;
  /** Accessible name. Without one the icon is decorative and hidden from screen readers. */
  label?: string;
  /** Stroke width of every stroked shape. Hugeicons draw at 1.5. */
  strokeWidth?: number;
}

/** A Hugeicons icon (or any icon in the same format) as inline SVG. It takes the text colour. */
export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon({ icon, size, label, strokeWidth, className, ...props }, ref) {
  return (
    <svg
      ref={ref}
      className={iconClass({ size, className })}
      viewBox="0 0 24 24"
      fill="none"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      {...props}
    >
      {icon.map(([tag, { key, ...attributes }], i) =>
        // strokeWidth only replaces existing strokes: filled shapes (dots, two-tone layers) keep their look.
        createElement(tag, { key: key ?? i, ...attributes, ...(strokeWidth !== undefined && "strokeWidth" in attributes ? { strokeWidth } : null) }),
      )}
    </svg>
  );
});
