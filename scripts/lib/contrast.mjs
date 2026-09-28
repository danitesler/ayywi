// WCAG 2 contrast for opaque #rrggbb colours.

function channel(c) {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

/** Relative luminance, 0 (black) – 1 (white). */
export function luminance(hex) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) throw new Error(`${hex} isn't an opaque #rrggbb colour`);
  const [r, g, b] = [0, 2, 4].map((i) => channel(parseInt(m[1].slice(i, i + 2), 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Contrast ratio between two colours, 1 – 21. Body text needs 4.5 (AA). */
export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** color-mix(in srgb, a p, b): what a tint like `color-mix(in srgb, var(--c) 15%, transparent)` looks like over b. */
export function mix(a, b, p) {
  const ch = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const [x, y] = [ch(a), ch(b)];
  return `#${x.map((v, i) => Math.round(v * p + y[i] * (1 - p)).toString(16).padStart(2, "0")).join("")}`;
}
