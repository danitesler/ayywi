import { cx } from "../../lib/cx";

export const iconSizes = ["auto", "sm", "md", "lg", "xl"] as const;
export type IconSize = (typeof iconSizes)[number];

/**
 * An icon in Hugeicons' format: what `@hugeicons/core-free-icons` and the Hugeicons Pro packages export.
 * A list of [tag, attributes] pairs drawn on a 24×24 grid, attribute names in camelCase (strokeWidth).
 */
export type IconData = readonly (readonly [string, { readonly [attribute: string]: string | number }])[];

export interface IconClassOptions {
  /** "auto" (default) is 1.25em, so the icon follows the text around it. The others are fixed: 16, 20, 24, 32px. */
  size?: IconSize;
  className?: string;
}

export function iconClass({ size = "auto", className }: IconClassOptions = {}): string {
  return cx("ayy-icon", size !== "auto" && `ayy-icon--${size}`, className);
}

export interface IconSvgOptions extends IconClassOptions {
  /** Accessible name. Without one the icon is decorative and hidden from screen readers. */
  label?: string;
  /** Stroke width of every stroked shape. Hugeicons draw at 1.5 on the 24px grid. */
  strokeWidth?: number;
}

// SVG attributes that really are camelCase. Every other camelCase key is a presentation attribute (strokeWidth → stroke-width).
const CAMEL_CASE = new Set([
  "viewBox", "preserveAspectRatio", "pathLength", "gradientUnits", "gradientTransform", "spreadMethod",
  "patternUnits", "patternContentUnits", "patternTransform", "clipPathUnits", "maskUnits", "maskContentUnits",
  "markerUnits", "markerWidth", "markerHeight", "refX", "refY", "stdDeviation", "filterUnits", "primitiveUnits",
]);

const attributeName = (key: string) => (CAMEL_CASE.has(key) ? key : key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`));
const escape = (value: string | number) => String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/**
 * SVG markup for an icon, for everything that isn't React: innerHTML, v-html, {@html}, server templates.
 * iconSvg(Search01Icon) → '<svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">…</svg>'
 */
export function iconSvg(icon: IconData, { size, className, label, strokeWidth }: IconSvgOptions = {}): string {
  const a11y = label ? `role="img" aria-label="${escape(label)}"` : 'aria-hidden="true"';
  const shapes = icon.map(([tag, { key: _key, ...attributes }]) => {
    // strokeWidth only replaces existing strokes: filled shapes (dots, two-tone layers) keep their look.
    const merged = strokeWidth !== undefined && "strokeWidth" in attributes ? { ...attributes, strokeWidth } : attributes;
    const attrs = Object.entries(merged)
      .map(([k, v]) => ` ${attributeName(k)}="${escape(v)}"`)
      .join("");
    return `<${tag}${attrs}/>`;
  });
  return `<svg class="${escape(iconClass({ size, className }))}" viewBox="0 0 24 24" fill="none" ${a11y}>${shapes.join("")}</svg>`;
}
