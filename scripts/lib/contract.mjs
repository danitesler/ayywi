// The parts of ayywi's public contract that aren't components. Used by the manifest, `pnpm check` and the CLI linter.

/** Custom properties consumers may set. Everything else starting with --ayy- must be a token. */
export const PUBLIC_HOOKS = {
  "--ayy-spot": "Card spotlight colour (any colour, usually an --ayy-accent-* token).",
  "--ayy-mx": "Card spotlight pointer X in px (set by React Card or ayywi/elements).",
  "--ayy-my": "Card spotlight pointer Y in px (set by React Card or ayywi/elements).",
  "--ayy-dot": "Badge status-dot colour override.",
  "--ayy-value": "Progress value, a unitless number 0–100.",
  "--ayy-progress-color": "Progress fill colour override.",
  "--ayy-gap": "Gap for .ayy-stack / .ayy-cluster.",
};

/** Classes defined in src/css/base.css. */
export const UTILITIES = {
  "ayy-h1": "Heading 1 style (48px, heading font).",
  "ayy-h2": "Heading 2 style (36px).",
  "ayy-h3": "Heading 3 style (28px).",
  "ayy-h4": "Heading 4 style (22px).",
  "ayy-lede": "Intro paragraph, 18px soft text.",
  "ayy-muted": "Muted text colour.",
  "ayy-eyebrow": "Small uppercase label above a heading.",
  "ayy-signature": "Handwritten accent font.",
  "ayy-mono": "Monospace font.",
  "ayy-stack": "Vertical flex stack; gap via --ayy-gap (default 12px).",
  "ayy-cluster": "Wrapping horizontal row; gap via --ayy-gap (default 8px).",
  "ayy-sr-only": "Visually hidden, still read by screen readers.",
  "ayy-scroll": "Thin, quiet scrollbars on a scroll container.",
};

/** Component categories, in display order. Every component's meta.json has one "category" from this list. */
export const CATEGORIES = {
  Actions: "Things people click to do something.",
  Forms: "Inputs, choices and their labels.",
  Layout: "Containers and ways to organise content.",
  Overlays: "Content that floats above the page.",
  Feedback: "Status, progress and messages.",
  "Data display": "Values, people and records.",
};

/** Attributes ayywi reads on any element. */
export const ATTRIBUTES = {
  "data-theme": "\"dark\" | \"light\" | \"dark-soft\" | \"light-soft\" — force a theme on this element and its subtree. None = follow the OS (dark or light). The -soft themes have lower contrast: charcoal/off-white instead of black/white.",
  "data-density": "\"compact\" | \"comfortable\" | \"touch\" — control sizes for this subtree. None = compact, or touch on touch-first devices.",
  "data-brand": "Brand name (e.g. \"violet\"); needs ayywi/brands/<name>.css loaded.",
  dir: "\"rtl\" mirrors every component (logical properties throughout).",
};

/** Rules every agent (and human) must follow. Rendered into llms-full.txt and ai/; enforced by `pnpm check` and `ayywi lint`. */
export const RULES = [
  "Use existing ayywi classes/components and their variants before writing any custom CSS. Never add a second UI kit.",
  "Never hardcode colours (hex, rgb, hsl, named). Use var(--ayy-color-*) tokens; for tints use color-mix(in srgb, var(--ayy-color-text) N%, transparent) or the wash/line tokens.",
  "Use logical properties only: margin-inline-start, padding-inline, inset-inline-end, text-align: start. Never left/right/margin-left/padding-right, so RTL works.",
  "Spacing, radius, font size, shadows and motion come from tokens (--ayy-space-*, --ayy-radius-*, --ayy-text-*, --ayy-control-*, --ayy-shadow-*, --ayy-ease-*, --ayy-duration-*). Control sizes follow data-density — don't hardcode heights.",
  "Theme with data-theme=\"dark|light|dark-soft|light-soft\" (or nothing = follow OS). Never write separate dark-mode colours; tokens already switch. Rebrand by overriding semantic tokens or loading a brand file, not by restyling components.",
  "Every interactive element keeps its visible :focus-visible ring. Icon-only buttons need aria-label. Form controls need a label. State lives in native/ARIA attributes (disabled, checked, aria-selected, aria-invalid, open).",
  "Stateful styles need a @media (forced-colors: active) fallback (Windows High Contrast erases fills).",
  "Prefer animating transform and opacity (use a logical property like inset-inline-start only when the motion must follow text direction). Everything must still work under prefers-reduced-motion — base.css collapses ayy animations.",
  "No :dir() selectors — minifiers rewrite them into :lang() lists that ignore dir=\"rtl\". Logical properties make direction checks unnecessary.",
  "Body text must fall back to system fonts — never remove the system-ui stack from --ayy-font-body (CJK/Arabic/Cyrillic rely on it).",
  "In React import from \"ayywi/react\"; in other frameworks and plain HTML use the class names, the class helpers from \"ayywi\" (buttonClass…) and the custom elements from \"ayywi/elements\" (<ayy-tabs>, <ayy-dialog>, <ayy-menu>, <ayy-popover>, <ayy-tooltip>).",
  "Run `npx ayywi lint` after UI changes and fix every error it reports.",
];
