/**
 * ayywi preset for Tailwind CSS v3.4+. Maps utilities to ayywi tokens, so `bg-surface`, `text-muted`,
 * `border-line`, `rounded-card`, `shadow-lift`, `ease-spring`… follow the active theme automatically.
 *
 *   // tailwind.config.js
 *   module.exports = { presets: [require("@danitesler/ayywi/tailwind-preset")], content: [...] };
 *
 * You still need the ayywi CSS (at least tokens.css) loaded for the variables to exist.
 * Tailwind v4? Use `@import "@danitesler/ayywi/tailwind.css";` instead.
 */

const v = (name) => `var(--ayy-${name})`;

/** Colour that supports Tailwind opacity modifiers (bg-surface/50) via color-mix. */
const c = (name) => ({ opacityValue }) =>
  opacityValue === undefined ? v(name) : `color-mix(in srgb, ${v(name)} calc(${opacityValue} * 100%), transparent)`;

module.exports = {
  darkMode: [
    "variant",
    [
      "@media (prefers-color-scheme: dark) { &:not(:where([data-theme^=light], [data-theme^=light] *, .light, .light *)) }",
      "&:where([data-theme^=dark], [data-theme^=dark] *, .dark, .dark *)",
    ],
  ],
  theme: {
    extend: {
      colors: {
        bg: c("color-bg"),
        surface: { DEFAULT: c("color-surface"), raised: c("color-surface-raised") },
        fg: { DEFAULT: c("color-text"), soft: c("color-text-soft") },
        muted: c("color-muted"),
        border: c("color-border"),
        ring: c("color-ring"),
        primary: { DEFAULT: c("color-primary"), fg: c("color-primary-fg") },
        destructive: c("color-destructive"),
        success: c("color-success"),
        warning: c("color-warning"),
        info: c("color-info"),
        ai: { DEFAULT: c("color-ai"), active: c("color-ai-active") },
        wash: { DEFAULT: v("color-wash"), hover: v("color-wash-hover") },
        hairline: v("color-hairline"),
        line: { DEFAULT: v("color-line"), strong: v("color-line-strong"), hover: v("color-line-hover") },
        overlay: v("color-overlay"),
        glass: v("color-glass"),
        accent: {
          research: c("accent-research"),
          product: c("accent-product"),
          ai: c("accent-ai"),
          system: c("accent-system"),
          brand: c("accent-brand"),
          marketing: c("accent-marketing"),
        },
        brand: Object.fromEntries([50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((s) => [s, c(`brand-${s}`)])),
        chart: { 1: c("chart-1"), 2: c("chart-2"), 3: c("chart-3"), 4: c("chart-4"), 5: c("chart-5"), 6: c("chart-6") },
      },
      fontFamily: {
        sans: [v("font-body")],
        heading: [v("font-heading")],
        signature: [v("font-signature")],
        mono: [v("font-mono")],
      },
      fontSize: {
        "2xs": v("text-2xs"),
        display: [v("text-display"), { lineHeight: v("leading-display"), letterSpacing: v("tracking-display") }],
      },
      maxWidth: {
        page: v("size-container"),
        measure: v("size-measure"),
      },
      borderRadius: {
        control: v("radius-control"),
        card: v("radius-card"),
        button: v("radius-button"),
        pill: v("radius-pill"),
      },
      boxShadow: {
        rest: v("shadow-rest"),
        lift: v("shadow-lift"),
        overlay: v("shadow-overlay"),
        glow: v("shadow-glow"),
        frame: v("shadow-frame"),
      },
      transitionTimingFunction: {
        standard: v("ease-standard"),
        spring: v("ease-spring"),
        expo: v("ease-out-expo"),
        menu: v("ease-menu"),
      },
      transitionDuration: {
        fast: v("duration-fast"),
        base: v("duration-base"),
        slow: v("duration-slow"),
        slower: v("duration-slower"),
      },
      height: {
        "control-sm": v("size-control-sm"),
        control: v("size-control-md"),
        "control-lg": v("size-control-lg"),
      },
      zIndex: {
        sticky: v("z-sticky"),
        overlay: v("z-overlay"),
        tooltip: v("z-tooltip"),
      },
    },
  },
};
