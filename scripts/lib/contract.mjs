// The parts of ayywi's public contract that aren't components. Used by the manifest, `pnpm check` and the CLI linter.

/** Custom properties consumers may set. Everything else starting with --ayy- must be a token. */
export const PUBLIC_HOOKS = {
  "--ayy-spot": "The content's accent colour, inherited by everything inside (usually an --ayy-accent-* token). Set it on a card, section or page: it lights card spotlights, the active contents item, section numbers, icon tiles, the scroll-progress bar and .ayy-accent-text.",
  "--ayy-mx": "Card spotlight pointer X in px (set by React Card or @danitesler/ayywi/elements).",
  "--ayy-my": "Card spotlight pointer Y in px (set by React Card or @danitesler/ayywi/elements).",
  "--ayy-dot": "Badge status-dot colour override.",
  "--ayy-value": "A unitless number 0–100: the Progress value, a Slider's position, a chart bar's height or tick's position, a bar-list row's length.",
  "--ayy-chart-color": "Colour of a chart bar, series, legend item, bar list or sparkline, instead of the next --ayy-chart-* token.",
  "--ayy-chart-height": "Height of a chart's plot (default 12rem).",
  "--ayy-from": "Start of a slider range's fill, 0–100 (kept in sync by React and @danitesler/ayywi/elements).",
  "--ayy-to": "End of a slider range's fill, 0–100.",
  "--ayy-progress-color": "Progress fill colour override.",
  "--ayy-gap": "Gap for .ayy-stack / .ayy-cluster / .ayy-grid / .ayy-spread / .ayy-split and the carousel track.",
  "--ayy-min": "Narrowest column of .ayy-grid (default 16rem) or of .ayy-data-list--row (default 9rem) before it drops a column; the aside width of .ayy-split (default 18rem).",
  "--ayy-slide": "Width of each carousel slide (default min(22rem, 85%)).",
};

/** Classes defined in src/css/base.css. */
export const UTILITIES = {
  "ayy-h1": "Heading 1 style (48px, heading font).",
  "ayy-h2": "Heading 2 style (36px).",
  "ayy-h3": "Heading 3 style (28px).",
  "ayy-h4": "Heading 4 style (22px).",
  "ayy-h5": "Heading 5 style (18px).",
  "ayy-h6": "Heading 6 style (16px, semibold).",
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
  "ayy-stack": "Vertical flex stack; gap via --ayy-gap (default 12px). Children lose their block margins (true of every layout helper), so a <p> or heading inside needs no margin reset.",
  "ayy-cluster": "Wrapping horizontal row; gap via --ayy-gap (default 8px).",
  "ayy-spread": "Wrapping row with its items pushed to both ends: a title and its meta, a label and a value, a toolbar's filters and actions. Gap via --ayy-gap (default 8px).",
  "ayy-split": "Main content (first child) and an aside (last child) side by side; the aside drops below once the main would be narrower than 60%. Aside width via --ayy-min (default 18rem). No media query, so it adapts to the box it's in.",
  "ayy-sr-only": "Visually hidden, still read by screen readers.",
  "ayy-truncate": "One line, cut with an ellipsis (also inside a flex row).",
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

/** Component order within a category (categories themselves follow CATEGORIES), for the manifest, llms files and preview.
    Unlisted slugs sort last, alphabetically. */
export const ORDER = [
  "button", "menu", "theme-toggle",
  "navbar", "app-shell", "bottom-nav", "footer", "breadcrumb", "pagination", "steps", "toc",
  "field", "input", "input-group", "textarea", "select", "combobox", "checkbox", "radio", "segmented-control", "chip", "choice-card", "slider", "number-field", "dropzone", "switch",
  "page-header", "section", "card", "tabs", "accordion", "carousel", "separator",
  "dialog", "popover", "tooltip",
  "alert", "toast", "progress", "spinner", "skeleton", "empty-state",
  "badge", "kbd", "avatar", "icon", "icon-tile", "stat", "list", "data-list", "frame", "chat", "table", "chart",
];

/** Attributes ayywi reads on any element. */
export const ATTRIBUTES = {
  "data-theme": "\"dark\" | \"light\" | \"dark-soft\" | \"light-gray\" — force a theme on this element and its subtree. None = follow the OS (dark or light). dark-soft is a near-black theme (a #0a0a0a page, #141414 cards, white text); light-gray puts white cards and panels on a grey page.",
  "data-density": "\"compact\" | \"comfortable\" | \"touch\" — control sizes for this subtree. None = compact, or touch on touch-first devices.",
  dir: "\"rtl\" mirrors every component (logical properties throughout).",
};

/** The states every component's meta.json documents, in this order. Each is { when, looks } (how you get it, what it
    looks like) or { none } (why it doesn't apply and what to use instead); default has only looks. A component may add
    its own after these (open, indeterminate, sorted…), always as { when, looks }. `pnpm check` enforces it. */
export const STATES = {
  default: "At rest: nothing hovered, focused or set.",
  hover: "The pointer is over it. Touch screens have no hover, so never put information only there.",
  pressed: "While it's held down (:active).",
  focus: "It has keyboard focus (:focus-visible): the 2px --ayy-color-ring outline.",
  disabled: "It can't be used: disabled on native controls, aria-disabled=\"true\" on links and on buttons that must keep focus.",
  selected: "On, checked, current or chosen: :checked, aria-selected, aria-current, aria-pressed=\"true\", aria-checked.",
  error: "Its value is invalid or its action failed: aria-invalid=\"true\" with a FieldError, or a destructive variant.",
  loading: "Waiting on work: aria-busy=\"true\" with a Spinner, a Skeleton, or an indeterminate Progress.",
};

/** Rules every agent (and human) must follow. Rendered into llms-full.txt and ai/; enforced by `pnpm check` and `ayywi lint`. */
export const RULES = [
  "Use existing ayywi classes/components and their variants before writing any custom CSS. Never add a second UI kit.",
  "Never hardcode colours (hex, rgb, hsl, named) — in stylesheets or in inline styles. Use var(--ayy-color-*) tokens; for tints use color-mix(in srgb, var(--ayy-color-text) N%, transparent) or the wash/line tokens.",
  "Use logical properties only: margin-inline-start, padding-inline, inset-inline-end, text-align: start, inline-size. Never left/right/margin-left/padding-right, so RTL works.",
  "Spacing, sizes, radius, type and motion come from tokens (--ayy-space-*, --ayy-size-*, --ayy-radius-*, --ayy-text-*, --ayy-weight-*, --ayy-leading-*, --ayy-control-*, --ayy-shadow-*, --ayy-ease-*, --ayy-duration-*). Control sizes follow data-density — don't hardcode heights.",
  "Theme with data-theme=\"dark|light|dark-soft|light-gray\" (or nothing = follow OS). Never write separate dark-mode colours; tokens already switch. To restyle, override semantic tokens rather than editing components.",
  "Every interactive element keeps its visible :focus-visible ring. Icon-only buttons need aria-label. Form controls need a label. State lives in native/ARIA attributes (disabled, checked, aria-selected, aria-current, aria-expanded, aria-invalid, aria-busy, open).",
  "Every component's spec lists its states (default, hover, pressed, focus, disabled, selected, error, loading, plus its own such as open) and its sizes, in manifest/components.json, llms/<slug>.md and get_component. Reach a state only through the attribute or prop its spec names. Where a state says it doesn't apply, do what it says instead; never style a state a component doesn't have.",
  "Stateful styles need a @media (forced-colors: active) fallback (Windows High Contrast erases fills).",
  "Prefer animating transform and opacity (use a logical property like inset-inline-start only when the motion must follow text direction). Everything must still work under prefers-reduced-motion — base.css collapses ayy animations. Scroll-in motion comes from .ayy-reveal, not a script; nothing loops unless it shows a live state.",
  "The frame is monochrome; colour comes from the content. Set --ayy-spot (to an --ayy-accent-* token) on the card, section or page that shows the content, and the spotlight, contents bar, section numbers, icon tiles and .ayy-accent-text inside pick it up. Never tint the navbar, sidebar, buttons or page background per page.",
  "Websites follow one anatomy: .ayy-skip-link, a Navbar (with a NavbarToggle so its links fold into a menu on phones), then <main> made of .ayy-section blocks at .ayy-container width (fading Separators between marketing sections), then the Footer. The page's call to action is a ring button (the navbar's repeats the same action); everything else outline or ghost.",
  "Apps (anything signed-in) follow one frame: .ayy-skip-link, then the App shell — a sidebar on wide screens; on phones an __bar (brand plus one or two actions) and a Bottom nav with the sidebar's top destinations, same icons and order (four and a More tab when there are more). Each screen in its main starts with a Page header: the one h1, a line of description, at most one primary button. Never put a Navbar in an app.",
  "Every list, table and page has three more states: loading (Skeleton in the shape of the content with aria-busy; a Spinner or <Button loading> for an action), empty (an Empty state with the action that fills it) and error (an Alert with a retry for a failed load or save; FieldError next to a field).",
  "Data views use ayywi's own pieces: Chart (BarChart, LineChart), Bar list and Sparkline for charts, coloured from --ayy-chart-1… in order; filters as Chips (with counts) above the results and the active ones as removable chips; sortable Table columns with a .ayy-table__sort button and aria-sort on the <th>. With a chart library, colour it with var(--ayy-chart-N) (SVG) or chartColors() and chartTheme() (canvas); never its default palette.",
  "Pick form controls by the choice: a Segmented control for two to five short options, Choice cards when each option needs a sentence or a price (compact for time slots), a Select for a short list, a Combobox for many known values, a Number field for small counts, a Slider for a rough amount, native type=\"date\"/\"time\" Inputs for dates, File upload for files.",
  "Don't write breakpoints for navigation or layout: App shell, Navbar and Pagination switch at 48rem on their own, and .ayy-grid and .ayy-split adapt to their container. If you truly need one, use 48rem (phone) or 64rem (tablet).",
  "Every <img> gets width and height (its real size) so nothing jumps while it loads. Product screenshots go in a Frame. Draw small product visuals as SVG with tokens instead of images with text baked in.",
  "No :dir() selectors — minifiers rewrite them into :lang() lists that ignore dir=\"rtl\". Logical properties make direction checks unnecessary.",
  "Body text must fall back to system fonts — never remove the system-ui stack from --ayy-font-body (CJK/Arabic/Cyrillic rely on it).",
  "Icons come from Hugeicons (@hugeicons/core-free-icons): <Icon icon={Search01Icon} /> in React, iconSvg(Search01Icon) or the pasted SVG with class=\"ayy-icon\" elsewhere. Don't add another icon set. Icons are decorative (aria-hidden) unless you give them a label; arrows that point along the reading direction take directional.",
  "In React import from \"@danitesler/ayywi/react\"; in other frameworks and plain HTML use the class names, the class helpers from \"ayywi\" (buttonClass…) and the custom elements from \"@danitesler/ayywi/elements\" (<ayy-app-shell>, <ayy-navbar>, <ayy-tabs>, <ayy-combobox>, <ayy-dialog>, <ayy-menu>, <ayy-popover>, <ayy-tooltip>, <ayy-toc>, <ayy-carousel>, <ayy-table>, <ayy-theme-toggle>).",
  "Run `npx ayywi lint` after UI changes and fix every error it reports.",
];
