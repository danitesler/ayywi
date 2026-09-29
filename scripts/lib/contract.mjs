// The parts of ayywi's public contract that aren't components. Used by the manifest, `pnpm check` and the CLI linter.

/** Custom properties consumers may set. Everything else starting with --ayy- must be a token. */
export const PUBLIC_HOOKS = {
  "--ayy-spot": "The content's accent colour, inherited by everything inside (usually an --ayy-accent-* token). Set it on a card, section or page: it lights card spotlights, the active contents item, section numbers, icon tiles, the scroll-progress bar and .ayy-accent-text.",
  "--ayy-mx": "Card spotlight pointer X in px (set by React Card or ayywi/elements).",
  "--ayy-my": "Card spotlight pointer Y in px (set by React Card or ayywi/elements).",
  "--ayy-dot": "Badge status-dot colour override.",
  "--ayy-value": "Progress value, a unitless number 0–100.",
  "--ayy-progress-color": "Progress fill colour override.",
  "--ayy-gap": "Gap for .ayy-stack / .ayy-cluster / .ayy-grid and the carousel track.",
  "--ayy-min": "Narrowest column of .ayy-grid (default 16rem) or of .ayy-data-list--row (default 9rem) before it drops a column.",
  "--ayy-slide": "Width of each carousel slide (default min(22rem, 85%)).",
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
  "ayy-display": "Hero title: heading font at the fluid display size (44px on a phone to 200px), tight leading.",
  "ayy-text-outline": "Hollow letters stroked in the text colour. For big display words and numbers; combine with .ayy-muted to dim.",
  "ayy-accent-text": "Text in the local accent (--ayy-spot), darkened on light themes so accent tokens keep 4.5:1.",
  "ayy-link": "Inline text link: underlined, text colour, focus ring.",
  "ayy-prose": "Long-form reading (articles, case studies): 18px soft text at a readable measure; styles the headings, lists, links, quotes, code and images inside.",
  "ayy-container": "Centred page width (--ayy-size-container, 1400px) with a 24px gutter, 16px on tablets and phones.",
  "ayy-grid": "Responsive grid: as many columns of at least --ayy-min (16rem) as fit; gap via --ayy-gap (16px).",
  "ayy-stack": "Vertical flex stack; gap via --ayy-gap (default 12px).",
  "ayy-cluster": "Wrapping horizontal row; gap via --ayy-gap (default 8px).",
  "ayy-sr-only": "Visually hidden, still read by screen readers.",
  "ayy-scroll": "Thin, quiet scrollbars on a scroll container.",
  "ayy-skip-link": "\"Skip to content\" link: hidden above the viewport until it gets keyboard focus. Make it the first thing in <body>.",
  "ayy-bg-grid": "Decorative ambient grid behind a hero or closing section, fading out towards the edges. Sets position: relative.",
  "ayy-scroll-progress": "Reading-progress bar fixed to the top of the viewport, in --ayy-spot. Put an empty aria-hidden <div> with it at the start of <body>. CSS scroll timelines only; hidden where unsupported.",
  "ayy-reveal": "Fades and lifts the element in as it scrolls into view. CSS only; off under reduced motion.",
};

/** Component categories, in display order. Every component's meta.json has one "category" from this list. */
export const CATEGORIES = {
  Actions: "Things people click to do something.",
  Navigation: "Getting around a site and a page.",
  Forms: "Inputs, choices and their labels.",
  Layout: "Containers and ways to organise content.",
  Overlays: "Content that floats above the page.",
  Feedback: "Status, progress and messages.",
  "Data display": "Values, people and records.",
};

/** Attributes ayywi reads on any element. */
export const ATTRIBUTES = {
  "data-theme": "\"dark\" | \"light\" | \"dark-soft\" | \"light-gray\" — force a theme on this element and its subtree. None = follow the OS (dark or light). dark-soft lowers the contrast (charcoal instead of black); light-gray puts white cards and panels on a grey page.",
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
  "Theme with data-theme=\"dark|light|dark-soft|light-gray\" (or nothing = follow OS). Never write separate dark-mode colours; tokens already switch. Rebrand by overriding semantic tokens or loading a brand file, not by restyling components.",
  "Every interactive element keeps its visible :focus-visible ring. Icon-only buttons need aria-label. Form controls need a label. State lives in native/ARIA attributes (disabled, checked, aria-selected, aria-invalid, open).",
  "Stateful styles need a @media (forced-colors: active) fallback (Windows High Contrast erases fills).",
  "Prefer animating transform and opacity (use a logical property like inset-inline-start only when the motion must follow text direction). Everything must still work under prefers-reduced-motion — base.css collapses ayy animations. Scroll-in motion comes from .ayy-reveal, not a script; nothing loops unless it shows a live state.",
  "The frame is monochrome; colour comes from the content. Set --ayy-spot (to an --ayy-accent-* token) on the card, section or page that shows the content, and the spotlight, contents bar, section numbers, icon tiles and .ayy-accent-text inside pick it up. Never tint the navbar, buttons or page background per page.",
  "Pages follow one anatomy: .ayy-skip-link, Navbar, then <main> made of .ayy-section blocks at .ayy-container width (fading Separators between marketing sections), then the footer. One call to action per view: a ring (marketing) or primary (app) button; everything else outline or ghost.",
  "Every <img> gets width and height (its real size) so nothing jumps while it loads. Product screenshots go in a Frame. Draw small product visuals as SVG with tokens instead of images with text baked in.",
  "No :dir() selectors — minifiers rewrite them into :lang() lists that ignore dir=\"rtl\". Logical properties make direction checks unnecessary.",
  "Body text must fall back to system fonts — never remove the system-ui stack from --ayy-font-body (CJK/Arabic/Cyrillic rely on it).",
  "In React import from \"ayywi/react\"; in other frameworks and plain HTML use the class names, the class helpers from \"ayywi\" (buttonClass…) and the custom elements from \"ayywi/elements\" (<ayy-tabs>, <ayy-dialog>, <ayy-menu>, <ayy-popover>, <ayy-tooltip>, <ayy-toc>, <ayy-carousel>, <ayy-theme-toggle>).",
  "Run `npx ayywi lint` after UI changes and fix every error it reports.",
];
