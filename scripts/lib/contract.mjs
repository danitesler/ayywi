// The parts of ayywi's public contract that aren't components. Used by the manifest, `pnpm check` and the CLI linter.

/** Custom properties consumers may set. Everything else starting with --ayy- must be a token. */
export const PUBLIC_HOOKS = {
  "--ayy-spot": "The content's accent colour, inherited by everything inside (usually an --ayy-accent-* token). Set it on a card or page: it lights card spotlights, the active contents item, icon tiles, the scroll-progress bar and .ayy-accent-text.",
  "--ayy-mx": "Card spotlight pointer X in px (set by React Card or @danitesler/ayywi/elements).",
  "--ayy-my": "Card spotlight pointer Y in px (set by React Card or @danitesler/ayywi/elements).",
  "--ayy-dot": "Badge status-dot colour override.",
  "--ayy-value": "A unitless number 0–100: the Progress bar's or ring's value, a Slider's position, a chart bar's height or tick's position, a bar-list row's length.",
  "--ayy-chart-color": "Colour of a chart bar, series, legend item, bar list or sparkline, instead of the next --ayy-chart-* token.",
  "--ayy-chart-height": "Height of a chart's plot (default 12rem).",
  "--ayy-from": "Start of a slider range's fill, 0–100 (kept in sync by React and @danitesler/ayywi/elements).",
  "--ayy-to": "End of a slider range's fill, 0–100.",
  "--ayy-sidebar-w": "App shell sidebar width (default 15rem), set on the .ayy-app-shell. An __resize handle sets it in px while dragging; start the next session with the saved value.",
  "--ayy-detail-w": "App shell detail pane width (default 22rem), set on the .ayy-app-shell. The detail __resize handle sets it in px.",
  "--ayy-check-color": "A checkbox's colour, set on the .ayy-checkbox (a token: var(--ayy-accent-brand)…): the border when empty, the fill when checked.",
  "--ayy-check-fg": "The tick on a checkbox with --ayy-check-color, when primary-fg doesn't read on that colour.",
  "--ayy-progress-color": "Progress bar and ring fill colour override.",
  "--ayy-swatch": "A swatch's colour, set on the .ayy-swatch (a token: var(--ayy-chart-1), var(--ayy-accent-brand)…).",
  "--ayy-swipe-bg": "Background of a swipe row's content, which must hide the action trays under it. Default the page colour; set it to the surface the list sits on (var(--ayy-color-surface) in a card).",
  "--ayy-gap": "Gap for .ayy-stack / .ayy-cluster / .ayy-grid / .ayy-spread / .ayy-split and the carousel track.",
  "--ayy-min": "Narrowest column of .ayy-grid (default 16rem) before it drops a column; the aside width of .ayy-split (default 18rem).",
  "--ayy-ratio": "A picture's shape, width ÷ height (1.6, or 1440 / 900), set on a card toast or a view Card's .ayy-card__view-media: the card follows it, within its own minimum and maximum height. Default 16 / 10.",
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
  "ayy-lead": "Intro paragraph (alias of .ayy-lede), 18px soft text.",
  "ayy-body": "Body paragraph style (14px).",
  "ayy-small": "Small text style (13px).",
  "ayy-xs": "Extra-small text style (12px).",
  "ayy-muted": "Muted text colour.",
  "ayy-faint": "Soft text colour (var(--ayy-color-text-soft)).",
  "ayy-eyebrow": "Small uppercase label above a heading.",
  "ayy-signature": "Handwritten accent font.",
  "ayy-mono": "Monospace font.",
  "ayy-tabular": "Tabular numbers (tabular-nums font variant).",
  "ayy-display": "Hero title: heading font at the fluid display size (44px on a phone to 200px), tight leading.",
  "ayy-text-outline": "Hollow letters stroked in the text colour. For big display words and numbers; combine with .ayy-muted to dim.",
  "ayy-accent-text": "Text in the local accent (--ayy-spot), darkened on light themes so accent tokens keep 4.5:1.",
  "ayy-gradient-text": "Text clipped to a gradient from text colour to accent/soft text.",
  "ayy-link": "Inline text link: underlined, text colour, focus ring.",
  "ayy-text-highlight": "Subtle inline text highlight with clean underline. Mark elements take this by default.",
  "ayy-prose": "Long-form reading (articles, case studies): 18px soft text at a readable measure; styles the headings, lists, links, quotes, code and images inside.",
  "ayy-container": "Centred page width (--ayy-size-container, 1400px) with a 24px gutter, 16px on tablets and phones.",
  "ayy-grid": "Responsive grid: as many columns of at least --ayy-min (16rem) as fit; gap via --ayy-gap (16px).",
  "ayy-stack": "Vertical flex stack; gap via --ayy-gap (default 12px). Children lose their block margins (true of every layout helper), so a <p> or heading inside needs no margin reset.",
  "ayy-cluster": "Wrapping horizontal row; gap via --ayy-gap (default 8px).",
  "ayy-spread": "Wrapping row with its items pushed to both ends: a title and its meta, a label and a value, a toolbar's filters and actions. Gap via --ayy-gap (default 8px).",
  "ayy-split": "Main content (first child) and an aside (last child) side by side; the aside drops below once the main would be narrower than 60%. Aside width via --ayy-min (default 18rem). No media query, so it adapts to the box it's in.",
  "ayy-center": "Centered layout container aligning items horizontally and vertically.",
  "ayy-bleed": "Bleeds out into container gutter by negative gap margin.",
  "ayy-divider": "Hairline horizontal divider.",
  "ayy-surface": "Surface background container with default text color.",
  "ayy-glass": "Translucent frosted-glass backdrop with blur.",
  "ayy-dot-grid": "Decorative ambient dot grid pattern.",
  "ayy-glow": "Glow box shadow on featured cards or elements.",
  "ayy-sr-only": "Visually hidden, still read by screen readers.",
  "ayy-truncate": "One line, cut with an ellipsis (also inside a flex row).",
  "ayy-clamp-2": "Multi-line text clamp to 2 lines with ellipsis.",
  "ayy-clamp-3": "Multi-line text clamp to 3 lines with ellipsis.",
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

/** Component order within a category (categories themselves follow CATEGORIES), for the manifest and llms*.txt
    (the preview sidebar sorts each category alphabetically). Unlisted slugs sort last, alphabetically. */
export const ORDER = [
  "button", "hover-actions", "toolbar", "action-bar", "menu", "command", "fab",
  "navbar", "app-shell", "bottom-nav", "top-bar", "footer", "breadcrumb", "pagination", "steps", "toc",
  "field", "input", "search-bar", "filter-bar", "sorting", "textarea", "select", "combobox", "tag-input", "date-time-picker", "color-picker", "checkbox", "radio", "segmented-control", "chip", "swatch", "choice-card", "slider", "number-field", "dropzone", "switch", "shortcut", "settings",
  "page-header", "showcase", "card", "tabs", "accordion", "carousel", "separator",
  "dialog", "popover", "tooltip",
  "alert", "toast", "progress", "progress-ring", "spinner", "skeleton", "empty-state",
  "badge", "status-dot", "kbd", "text-highlight", "avatar", "icon", "icon-tile", "stat", "list", "swipe", "timeline", "frame", "chat", "code-block", "table", "grid", "chart",
];

/** Screens built from several components that every app should build the same way. Each is rendered into the manifest
    ("patterns"), llms-full.txt, llms.txt and the MCP server's get_rules, so agents follow one recipe instead of inventing one.
    `example` is "<component slug>/<example id>". `specs` are the measurements apps must not restyle. */
export const PATTERNS = [
  {
    name: "Settings",
    slug: "settings",
    summary:
      "Settings open over the app in a near-full-screen dialog, as Notion's and Claude's do: a Settings title and the settings sections in its sidebar, one section in its main, a close button in the corner. Full screen on phones. Never a small or side dialog, never tabs inside a page.",
    components: ["app-shell", "top-bar", "settings", "switch", "select", "segmented-control", "shortcut", "button", "dialog", "toast"],
    example: "app-shell/playground",
    steps: [
      "Entry: a Settings link in the sidebar's AppShellFooter (an icon and \"Settings\"). On phones, the same link in the More drawer, or a settings icon button in the AppShellBar. Desktop apps also open it on ⌘, (Ctrl+, elsewhere).",
      "Open: a Dialog with <DialogContent size=\"full\" aria-labelledby=\"<the title's id>\"> (class ayy-dialog--full) over the page the user was on, holding an AppShell with settings (class ayy-app-shell--settings). Its AppShellSidebar holds, in order: AppShellTitle (\"Settings\", with the id the dialog points at) and an AppShellNav aria-label=\"Settings\" of AppShellGroups (\"Account\": profile, preferences, notifications; \"Workspace\" or \"App\": the app's own areas; \"About\" last). Its main is <AppShellMain as=\"div\"> (the page keeps its one <main>). No AppShellBack, AppShellBar, BottomNav or brand: the dialog's close button is the way out.",
      "Sections: the open section's AppShellLink has current (aria-current=\"page\"); a link click switches the section in place. On wide screens settings open on the first section; on phones on the section list.",
      "Section: the main starts with a TopBar (title = the section's name, its <h1>; onBack returns to the section list, backLabel = \"Settings\"; its back button shows on phones only), then one Settings group per topic (title, optional description) holding SettingsRows (a Switch, Select, SegmentedControl, Shortcut recorder or Button at the end) and SettingsLinks (rows that open a sub-page or run an action). The content column is --ayy-size-measure wide, centred; the shell does that.",
      "Saving: switches, selects and segmented controls apply at once; confirm with a Toast only when the effect isn't visible. Free text (a name, a folder path) saves on blur or Enter. Anything that must be submitted together (a password change) is a Dialog opened from a SettingsLink.",
      "Danger: Sign out, Reset and Delete account go last, in their own Settings group, as destructive SettingsLinks; destructive ones confirm in a Dialog.",
      "Leave: the dialog's close button, Esc or a click on the backdrop. The dialog puts focus back on the Settings link the user came from.",
    ],
    phone: [
      "Below 48rem the dialog fills the screen and the settings shell is two screens, picked by aria-current: with no section current, the sidebar is the screen (a large \"Settings\" title, the sections as rows with chevrons); with one current, the section fills it and its TopBar's back returns to the list. Move focus to the section when it opens and back to its link when it closes.",
      "Settings rows wrap the control under the label when there isn't room; never shrink a control below its size.",
      "For a choice with more than five options on a phone, use a SettingsLink with the current value that opens a sub-page with a radio list, instead of a long Select.",
      "Touch density (data-density=\"touch\") raises sidebar items and rows to 52px; nothing is sized by hand.",
    ],
    specs: {
      "Sidebar item (.ayy-app-shell__link, in the app and in settings)":
        "--ayy-size-control-lg high (40px compact, 48px comfortable, 52px touch), padding-inline --ayy-space-3, a --ayy-size-icon-md (20px) icon then --ayy-space-2, --ayy-control-text-lg, medium weight, --ayy-radius-pill. Muted text; hover: --ayy-color-wash and the text colour; current (aria-current=\"page\"): --ayy-color-wash-hover, the text colour, semibold. Items --ayy-space-0-5 apart. Groups: an uppercase --ayy-text-s label, and a hairline with --ayy-space-4 margin and --ayy-space-5 padding above every group after the first.",
      "Settings group (.ayy-settings)":
        "A <section> labelled by its <h2> (--ayy-text-md, semibold), an optional muted --ayy-text-sm description, then the rows in a card: a 1px --ayy-color-line border, --ayy-radius-card, --ayy-color-surface. Groups are --ayy-space-6 apart. .ayy-settings--plain (no card) only in a sheet or dialog that already has a surface.",
      "Settings row (.ayy-settings__row)":
        "At least --ayy-size-control-lg high, padding --ayy-space-3 block and --ayy-space-4 inline, --ayy-space-4 between the text and the control. Label --ayy-text-sm medium; hint --ayy-text-xs muted, one line. The control sits at the inline end. A 1px --ayy-color-hairline between rows only: none above the first or below the last.",
      "Section header (.ayy-top-bar in the settings main)":
        "Sticky, the page colour with a hairline under it; title semibold (--ayy-text-xl in the dialog on wide screens, --ayy-text-md on phones), lined up with the content column. One <h1> per section.",
      "Settings dialog (.ayy-dialog--full)":
        "Up to 72rem by 50rem, 4rem clear of the viewport on each axis, no padding: the settings shell fills it, the sidebar 15rem. The whole screen below 48rem, without border or radius. The close button sits in the top-end corner over the section's Top bar.",
    },
    do: [
      "Use this pattern for every settings, preferences or account screen in an app, however few settings there are.",
      "Name sections with one noun (General, Appearance, Notifications, Shortcuts, Data, About) and give each a Hugeicons icon in the sidebar.",
      "Keep every setting's label short and put the why in its hint.",
    ],
    dont: [
      "Don't put settings in a small or side Dialog, a Popover or Tabs inside a page: they can't hold a growing list of sections, and they end up looking different in every app.",
      "Don't put the app's destinations, bar or bottom nav inside the settings dialog; its close button is the way out.",
      "Don't restyle sidebar items or settings rows (radius, padding, dividers) in app CSS: the specs above are the contract, and they follow density on their own.",
      "Don't add a Save button for settings that apply at once.",
    ],
  },
  {
    name: "Data explorer",
    slug: "data-explorer",
    summary:
      "A searchable, filterable, sortable view of records or media assets with multi-select and bulk actions: a Page header at the top, a Filter bar with status tabs, faceted dropdowns, search and sorting, a Table (for columns) or Grid (for cards and media) with inline quick actions and a ⋯ menu, a floating Action bar while items are selected, and Skeleton / Empty state / Alert states.",
    components: ["page-header", "filter-bar", "search-bar", "sorting", "chip", "table", "grid", "action-bar", "menu", "pagination", "skeleton", "empty-state", "alert"],
    example: "table/actions",
    steps: [
      "Header: start the screen with a PageHeader (PageHeaderTitle as the one <h1>, PageHeaderDescription, and PageHeaderActions with at most one primary create Button and optional export/view controls).",
      "Controls: place a FilterBar below the header. Its FilterBarMain holds FilterBarTabs (quick status tabs with counts), a FilterBarGroup of faceted FilterBarTriggers (opening DropdownMenus with DropdownMenuSelectedItem checkboxes), a SearchBar to filter by text, and a Sorting trigger (opening a DropdownMenu of sort fields and directions). When faceted filters are active, render FilterBarActive with ChipRemovable pills and a FilterBarClear button.",
      "Records: render a Table (when comparing attributes across columns) or a Grid (when browsing media assets, screenshots, social posts or cards). Include a select-all Checkbox in the header/toolbar and a selection Checkbox on each row (TableCell select) or card (GridItemSelect).",
      "Item actions: put 1–2 common inline icon Buttons (Edit, Copy) and a ⋯ DropdownMenu trigger (Duplicate, Archive, Delete last as destructive) inside TableRowActions (in a trailing TableCell actions) or GridItemActions (with reveal on desktop so actions show on hover, focus-within or selection).",
      "Bulk actions: mount an ActionBar (open={selected.size > 0}) with ActionBarSelection (ActionBarCount + ActionBarClose for Esc/clear) and ActionBarActions of ActionBarButtons (Edit, Duplicate, Copy, Archive, and destructive Delete last).",
      "States & paging: render Skeleton rows or cards with aria-busy=\"true\" while loading, an EmptyState (with a \"Clear filters\" action when filters match nothing, or a primary create action when the collection is empty), an Alert variant=\"destructive\" with a retry Button when loading fails, and Pagination below the table.",
    ],
    phone: [
      "FilterBarMain and FilterBarActive wrap naturally; when a chip strip sits alone on a phone, use ChipGroup scroll so it scrolls horizontally without wrapping into a tall block.",
      "Table scrolls horizontally inside .ayy-table-wrap; Grid drops columns automatically down to a single column below 48rem.",
      "Reveal actions (.ayy-table__row-actions--reveal and .ayy-grid__actions--reveal) stay visible on touch screens (@media (hover: none)) so every item's actions remain tappable without hover.",
      "The floating ActionBar stays anchored at the bottom of the viewport above safe areas; keep its action labels concise.",
    ],
    specs: {
      "Filter bar (.ayy-filter-bar)":
        "Vertical stack (--ayy-space-2 gap) with --ayy-space-3 padding, 1px --ayy-color-line border, --ayy-radius-card, --ayy-color-surface (or .ayy-filter-bar--flush inside a card). Tabs sit in a wash track; faceted triggers use --ayy-size-control-md height (--ayy-size-control-sm in sm).",
      "Table row & Grid card selection":
        "Selected table rows (tr[aria-selected=\"true\"]) get --ayy-color-wash-hover; selected grid cards (.ayy-grid__item[aria-selected=\"true\"]) get a 2px --ayy-color-text border, 1px ring and 4% text tint.",
      "Item actions (.ayy-table__row-actions, .ayy-grid__actions)":
        "Inline-flex cluster (--ayy-space-1 gap). With --reveal, opacity is 0 at rest on hover-capable devices and 1 on row/card :hover, :focus-within, [aria-selected=\"true\"], or when a menu trigger inside has [aria-expanded=\"true\"].",
      "Action bar (.ayy-action-bar)":
        "Fixed bottom-center pill (--ayy-space-6 from the bottom, z-index 40), --ayy-color-surface-raised, 1px --ayy-color-line-hover border, --ayy-radius-card, --ayy-shadow-lg. Selection count pill at the start, hairline divider, action buttons (--ayy-control-pad-md) with 8px gap.",
    },
    do: [
      "Use this pattern for every table, directory, asset library, inbox list or record manager in an app.",
      "Keep the same actions in the per-item ⋯ DropdownMenu and the bulk ActionBar so single and multi-item workflows match.",
      "Distinguish an empty collection (offer the create button) from an empty filter result (offer \"Clear filters\").",
    ],
    dont: [
      "Don't build custom filter rows out of raw selects or unstyled buttons — use FilterBar, SearchBar and Sorting.",
      "Don't place static bulk action buttons above the table that sit disabled when nothing is selected — use the floating ActionBar.",
      "Don't hide row or card actions with display: none on hover, which removes them from keyboard Tab order and touch screens.",
    ],
  },
  {
    name: "Marketing page",
    slug: "marketing-page",
    summary:
      "A public website, landing page or product site: a skip link, a sticky glass Navbar that folds into a menu on phones, sections at .ayy-container width separated by fading Separators (hero with .ayy-bg-grid, feature Cards with IconTiles, pricing Cards with a Segmented control, FAQ Accordion), and a multi-column Footer.",
    components: ["navbar", "button", "badge", "card", "icon-tile", "frame", "segmented-control", "list", "accordion", "separator", "footer"],
    example: "navbar/site",
    steps: [
      "Top of page: start <body> with an .ayy-skip-link pointing to #main (and an empty .ayy-scroll-progress div for long reads), followed by a Navbar (NavbarBrand, NavbarNav of NavbarLinks with current on the active page, NavbarActions with a theme DropdownMenu and one small ring Button for the primary CTA, and a NavbarToggle last).",
      "Hero: inside <main id=\"main\">, open with a hero section wrapped in .ayy-bg-grid and .ayy-container: a status or announcement Badge, a heading in .ayy-display or .ayy-h1 (with .ayy-gradient-text or .ayy-accent-text on the key phrase), an .ayy-lede intro paragraph (capped at --ayy-size-measure), a cluster with one ring Button and one outline Button, and the product visual inside a Frame.",
      "Sections: separate major blocks with <Separator fade /> inside .ayy-container. Give each section an .ayy-eyebrow label, an .ayy-h2 heading, and an .ayy-lede description before its content grid, and add .ayy-reveal to blocks so they fade and lift in on scroll.",
      "Features & spotlights: lay out features in an .ayy-grid of Cards (interactive and spotlight when clickable, with --ayy-spot set to a distinct --ayy-accent-* token per card) holding an IconTile, CardTitle and CardDescription.",
      "Pricing & FAQ: build pricing with a SegmentedControl (Monthly / Yearly) above an .ayy-grid of plan Cards (the recommended plan gets featured and a Badge; perks use a List compact with check icons). Build the FAQ with an Accordion single centered at --ayy-size-measure.",
      "Footer: close the page with a Footer containing FooterBrand (logo, tagline), FooterNav of FooterGroups (Product, Docs, Company, Legal), and FooterBottom (copyright and secondary links).",
    ],
    phone: [
      "Below 48rem the Navbar automatically hides inline links and opens them in a surface panel below the header when NavbarToggle is pressed; NavbarBrand and NavbarActions stay visible in the bar.",
      ".ayy-container switches its inline gutter from 24px to 16px below 64rem, and .ayy-display scales fluidly down to 44px on phones without custom media queries.",
      "Feature and pricing .ayy-grid layouts collapse to a single column automatically when the viewport is narrower than two --ayy-min tracks.",
    ],
    specs: {
      "Site header (.ayy-navbar)":
        "Sticky top 0, --ayy-size-header (72px) tall, --ayy-color-glass backdrop with 16px blur, 1px --ayy-color-hairline bottom border. Inner row centred at --ayy-size-container (1400px) with 24px gutter (16px below 64rem).",
      "Hero & section typography":
        "Hero title uses .ayy-display (fluid 2.75rem to 12.5rem, tight leading) or .ayy-h1 (3rem). Section titles use .ayy-eyebrow (12px uppercase, tracked) above .ayy-h2 (2.25rem) and .ayy-lede (1.125rem, --ayy-color-text-soft, max-inline-size --ayy-size-measure).",
      "Primary call to action (.ayy-button--ring)":
        "Marketing pages use the ring variant for the primary CTA in the hero and repeat it (size sm) in NavbarActions; supporting actions use outline or ghost.",
      "Footer (.ayy-footer)":
        "1px --ayy-color-hairline top border, --ayy-space-12 block padding, inner content at --ayy-size-container width.",
    },
    do: [
      "Use this anatomy for every landing page, marketing site, documentation home or portfolio.",
      "Keep the chrome (Navbar, Footer, page background) monochrome and let colour come from content via --ayy-spot (--ayy-accent-*) on cards, icon tiles and section highlights.",
      "Include a NavbarToggle in every Navbar so phone navigation works without custom CSS.",
    ],
    dont: [
      "Don't use a Navbar in a signed-in product or dashboard — use AppShell with BottomNav.",
      "Don't tint the Navbar, Footer or page background per section.",
      "Don't put more than one ring CTA button in the Navbar or hero.",
    ],
  },
];

/** What to reach for, by what the UI has to do. `use` names components by slug (checked by the build); `not` is what
    agents tend to hand-build instead. Rendered into llms-full.txt, ai/ and the MCP `pick_component` tool; `ayywi lint`
    catches the hand-built versions (raw-control, bare-control, clickable-element, rebuilt-component). */
export const NEEDS = [
  { need: "Run an action (save, create, delete, open)", use: ["button"], how: "Button: one primary per view, outline/ghost for the rest, destructive for delete, size icon + aria-label for icon-only.", not: "<button> with your own classes or none, a <div>/<span> with onClick, a link styled as a button for an action" },
  { need: "Choose one value from a list (theme, country, role, sort order)", use: ["select", "segmented-control", "combobox"], how: "Select for a list (it opens ayywi's own options list; touch screens keep the OS picker), Segmented control for two to five short options shown at once, Combobox for many values people type to find.", not: "a raw <select>, a button that opens a hand-built <div> of choices, a Dropdown menu used as a picker" },
  { need: "Choose between options that each need a sentence, an icon or a price (plans, delivery, time slots)", use: ["choice-card"], how: "ChoiceGroup of ChoiceCards (compact for time slots, scroll for a day strip).", not: "Cards with onClick and a selected class" },
  { need: "Switch between views or ranges of the same content (list/grid, 7d/30d)", use: ["segmented-control"], how: "SegmentedControl, two to five options.", not: "a row of buttons with aria-pressed or an active class" },
  { need: "Show one of several panels of content", use: ["tabs"], how: "Tabs (TabsList, TabsTrigger, TabsContent).", not: "a Segmented control or buttons that swap panels" },
  { need: "Turn a setting on or off (a toggle: notifications, dark mode, auto-save)", use: ["switch", "checkbox"], how: "Switch when it applies at once; Checkbox in a form that's submitted, or to agree to something.", not: "<input type=\"checkbox\"> unstyled, a toggle drawn with divs" },
  { need: "Pick one of a few options in a form", use: ["radio", "segmented-control"], how: "Radio group; a Segmented control when the options are short.", not: "raw <input type=\"radio\">" },
  { need: "Filter a list or tag things", use: ["chip", "tag-input"], how: "Chips (checkbox, radio or ChipButton, with counts) above the results, the active ones as removable chips; Tag input for free-text tags or recipients.", not: "pills built from <span>s or buttons with an active class" },
  { need: "Filter a list, table or feed (status tabs, faceted dropdowns, active chips)", use: ["filter-bar", "chip"], how: "FilterBar with quick filter tabs (FilterBarTabs), faceted dropdown triggers (FilterBarTrigger) with count badges, and active filter chips with a Clear all button.", not: "a row of custom buttons with active classes, hand-built filter bars" },
  { need: "Sort a list, table or feed by field and direction", use: ["sorting", "table"], how: "Sorting with SortingTrigger opening a DropdownMenu of sort options, or sortable Table column headers.", not: "a button that flips a state with no accessible label, hand-drawn sort arrows" },
  { need: "Type text, an email, a number or a password", use: ["field", "input", "textarea", "number-field"], how: "Field + Label + Input (Input group for an icon or a unit, Textarea for long text, Number field for small counts), FieldHint and FieldError under it.", not: "a raw <input>/<textarea>, a placeholder instead of a label" },
  { need: "Search or filter by typing", use: ["search-bar", "combobox", "command"], how: "Search bar to filter what's on screen, Combobox to pick a value, Command palette (⌘K) to jump anywhere.", not: "an <input> with a hand-drawn magnifier" },
  { need: "Pick a date or time", use: ["date-time-picker", "input"], how: "DatePicker or DatePickerGrid for one date near today; DateRange or DateRangePicker for a start and end span; TimePicker or TimePickerTrigger for discrete hours and minutes; DateTimePicker or DateTimePickerTrigger for combined date and time; Input type=\"date\" for a birth date, type=\"time\" for rapid keyboard entry.", not: "a hand-built month grid or time dropdown" },
  { need: "Pick a colour", use: ["swatch", "color-picker"], how: "ColorSwatches for a fixed set of choices, ColorSwatchCustom or ColorPicker for any custom colour with hue/alpha/hex.", not: "a raw <input type=\"color\">, coloured buttons" },
  { need: "Set an amount or a range", use: ["slider", "number-field"], how: "Slider / SliderRange for a rough amount or a price range, Number field for exact small counts.", not: "a raw <input type=\"range\">" },
  { need: "Upload files", use: ["dropzone", "list", "progress"], how: "Dropzone (compact in a form), then a List divided of the files with a Progress each.", not: "a raw <input type=\"file\">, a dashed div" },
  { need: "Record a keyboard shortcut or show one", use: ["shortcut", "kbd"], how: "Shortcut recorder to set one; Kbd / Shortcut to show one.", not: "a <kbd> or <span> styled by hand" },
  { need: "Show a code snippet, command or config file", use: ["code-block"], how: "CodeBlock with CodeBlockHeader, CodeBlockFilename, CodeBlockCopy, CodeBlockPre and CodeBlockCode (numbered for line numbers, .ayy-token-* for syntax tokens).", not: "a raw <pre> with custom background and copy button" },
  { need: "Show activity history, audit log or chronological events", use: ["timeline"], how: "Timeline of TimelineItems (TimelineMarker with pulse on live events, TimelineTime, TimelineTitle, TimelineBody; alternate for wide milestone pages).", not: "divs with a border-left line and absolute dots" },
  { need: "Show more actions behind a button (⋯, a user menu)", use: ["menu"], how: "DropdownMenu of items; destructive item last.", not: "a hand-built absolutely positioned <div>" },
  { need: "Ask to confirm, or collect a few fields over the page", use: ["dialog"], how: "Dialog (DialogContent, title, body, footer with the primary action last).", not: "window.confirm(), a fixed <div> with a backdrop" },
  { need: "A side panel, drawer or bottom sheet", use: ["dialog"], how: "Dialog with side=\"end\", \"start\" or \"bottom\".", not: "a custom fixed div that slides in" },
  { need: "Settings for an app", use: ["dialog", "app-shell", "settings", "top-bar"], how: "The Settings pattern: a full-size Dialog holding the App shell in settings mode, Settings groups of SettingsRow / SettingsLink.", not: "a settings page with Tabs, a small dialog, rows built from divs" },
  { need: "Small extra content on click (details, a mini form)", use: ["popover"], how: "Popover.", not: "a hand-positioned div" },
  { need: "Explain an icon button on hover or focus", use: ["tooltip"], how: "Tooltip (the button keeps its aria-label); add a Shortcut inside for its keyboard hint.", not: "title=\"\" or a CSS-only bubble" },
  { need: "Confirm something happened, or offer undo", use: ["toast"], how: "toast.success() / toast() with an action.", not: "a hand-built fixed banner" },
  { need: "Show a capture, video or file preview with quick corner actions", use: ["toast"], how: "toast.card() or CardToast for screen captures, video thumbnails and quick actions.", not: "a custom corner popup, fixed floating card without a toaster stack" },
  { need: "Tell people about a problem or a state on the page", use: ["alert"], how: "Alert (destructive with a retry for a failed load or save).", not: "a coloured <div>" },
  { need: "Show loading", use: ["skeleton", "spinner", "progress", "button"], how: "Skeleton in the shape of the content (aria-busy on the region), Spinner for a small area, Button loading for an action, Progress for a known amount.", not: "\"Loading…\" text, a hand-drawn spinner" },
  { need: "Nothing to show yet, or no results", use: ["empty-state"], how: "Empty state with the action that fills it (compact inside a card or table).", not: "a centred muted paragraph" },
  { need: "Group content in a box", use: ["card"], how: "Card with CardHeader / CardTitle / CardDescription, CardContent, CardFooter; CardLink when the whole card opens something.", not: "a <div> with a border, radius and padding" },
  { need: "Rows of things (members, files, threads, settings)", use: ["list", "settings", "swipe"], how: "List (ListLink for clickable rows, divided for settings-style rows); Settings for preference rows; Swipe actions on phones.", not: "<ul>/<div> rows with your own borders and hover, <li onClick>" },
  { need: "Records compared across columns", use: ["table", "action-bar", "menu", "pagination"], how: "Table (sortable headers, a select column, TableRowActions with inline quick buttons and a ⋯ DropdownMenu), ActionBar when rows are selected, Pagination under it.", not: "a raw <table>, a CSS grid of divs" },
  { need: "Captures, recordings or pictures to open, with their details and actions on hover (a screenshot history, a media library)", use: ["card", "hover-actions", "menu"], how: "Cards of the view type (Card view) in a .ayy-grid: CardViewMedia (a button or link that opens it) with CardViewImage letterboxed over a blurred copy, CardViewBadge for a recording's length, CardViewBody for title, details and badges, and grouped HoverActions with a ⋯ DropdownMenu. Use Grid instead when people select several.", not: "a plain Card with CardMedia and an <img>, a hand-built gradient caption, absolutely positioned buttons that appear on hover" },
  { need: "Icon actions over a picture, a video frame or a card (copy, annotate, pin, delete)", use: ["hover-actions"], how: "HoverActions in a corner (position) of the picture's box, reveal to show them on hover and focus, group to put them on one glass bar; each HoverAction has a label that is also its tooltip.", not: "ghost buttons restyled with a translucent background, title=\"\" tooltips, buttons that only appear on :hover with no keyboard way to reach them" },
  { need: "Selectable cards of media assets, screenshots, social posts, projects or user records", use: ["grid", "action-bar", "menu"], how: "Grid of GridItems (GridItemSelect checkbox, GridItemActions with inline quick actions and a ⋯ DropdownMenu, GridItemMedia for previews), ActionBar when items are selected.", not: "Cards with custom onClick selection state or hand-built floating checkboxes" },
  { need: "Run bulk actions on selected table rows or grid items (edit, duplicate, copy, archive, delete)", use: ["action-bar", "table", "grid"], how: "ActionBar (open when selection count > 0) with ActionBarSelection, ActionBarCount, ActionBarClose and ActionBarActions of ActionBarButtons (destructive last).", not: "a hand-built fixed bottom bar or static buttons above the table" },
  { need: "A number that matters (KPI)", use: ["stat", "card", "badge", "chart"], how: "Card + Stat + a status Badge, a Sparkline beside it.", not: "big bold text in a div" },
  { need: "A chart", use: ["chart"], how: "LineChart, BarChart, BarList, Sparkline, coloured from --ayy-chart-1… in order.", not: "a chart library's default palette, divs as bars" },
  { need: "A status, count or label on something", use: ["badge"], how: "Badge (status variants).", not: "a coloured <span> pill" },
  { need: "Show live status, online presence or server health as a compact dot", use: ["status-dot"], how: "StatusDot (neutral, success, warning, destructive, info variants; pulse for live activity).", not: "a coloured <span> or <div> with border-radius: 50%, hand-drawn ping keyframes" },
  { need: "A person or a team", use: ["avatar"], how: "Avatar (image with initials fallback), AvatarGroup.", not: "a round <img> or initials in a div" },
  { need: "Collapsible sections or FAQ", use: ["accordion"], how: "Accordion (single to keep one open).", not: "a raw <details>, a div toggled by a button" },
  { need: "A multi-step flow", use: ["steps"], how: "Steps above the form, one primary Continue per step.", not: "numbered circles drawn by hand" },
  { need: "The frame of an app", use: ["app-shell", "bottom-nav", "page-header"], how: "App shell (sidebar, a bar and a Bottom nav on phones), each screen starting with a Page header.", not: "a hand-built sidebar, header or bottom tab bar" },
  { need: "The top of a website", use: ["navbar"], how: "Navbar with a NavbarToggle so links fold into a menu on phones.", not: "a <header> of links with a hand-built burger menu" },
  { need: "Where you are, or which page of results", use: ["breadcrumb", "pagination"], how: "Breadcrumb for nested pages, Pagination for pages of results.", not: "links separated by slashes, numbered buttons" },
  { need: "A screen pushed from a list on a phone", use: ["top-bar"], how: "Top bar (back, title, actions).", not: "a hand-built header with a back arrow" },
  { need: "A screenshot or picture of the product", use: ["frame"], how: "Frame around it.", not: "an <img> with a border and shadow" },
  { need: "Preview UI across responsive viewports with device switcher", use: ["showcase"], how: "Showcase with ShowcaseHeader, ShowcaseTitle, ShowcaseActions, ShowcaseStage, and ShowcaseViewport (desktop, tablet, mobile).", not: "hand-built iframe wrappers or ad-hoc responsive preview containers" },
  { need: "Light/dark switch", use: ["menu"], how: "Dropdown menu of themes (radio items) that calls setTheme(); an icon trigger shows the current one.", not: "a button that flips a class" },
];

/** Attributes ayywi reads on any element. */
export const ATTRIBUTES = {
  "data-theme": "\"dark\" | \"light\" | \"dark-contrast\" | \"light-gray\" — force a theme on this element and its subtree. None = follow the OS (dark or light). dark-contrast is a pure-black theme (a #000000 page, #0a0a0a cards, white text); light-gray puts white cards and panels on a grey page.",
  "data-density": "\"compact\" | \"comfortable\" | \"touch\" — control sizes for this subtree. None = compact, or touch on touch-first devices.",
  "data-brand": "A brand's name — its colours, corners and fonts for this subtree, in every theme. Needs the brand's stylesheet (@danitesler/ayywi/brands/<name>.css, or brandCss() / `npx @danitesler/ayywi brand` output); setBrand() sets both. None = ayywi's monochrome default.",
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

/** How a project installs, imports and updates ayywi. Rendered next to RULES in llms-full.txt, ai/ and get_rules; `ayywi lint` checks the first two. */
export const SETUP = [
  "Install from npm: `pnpm add @danitesler/ayywi` (or npm/yarn), then `npx @danitesler/ayywi init`. Import only from \"@danitesler/ayywi\" and its subpaths (\"/react\", \"/elements\", \"/css\", \"/fonts.css\", \"/brands/*\", \"/fonts/*\"). Never from \"ayywi\": that name is only the CLI. Never reach into node_modules/@danitesler/ayywi/dist by path.",
  "Never vendor ayywi: no copy of its dist/ in the repo, no .tgz, no file: or link: dependency in a committed package.json. A fresh clone must install with the package manager alone.",
  "To change ayywi while building an app, point the app's bundler at a local ayywi checkout only for that session (a Vite resolve.alias read from an AYYWI_DIR environment variable, with resolve.dedupe for react and react-dom), and run `pnpm build` in the checkout after each change. Never commit that link.",
  "Upgrade with `pnpm up @danitesler/ayywi`, then `npx @danitesler/ayywi init --force` so the skill, rules and AGENTS.md section match the installed version, and read the CHANGELOG between the two versions.",
  "When ayywi has no component or variant for something, compose it from ayywi pieces in the app, mark it with a `// ayywi-candidate: <what it is>` comment, and add it to ayywi itself when a second screen or app needs it. Never fork, copy or restyle an ayywi component inside the app.",
];

/** Rules every agent (and human) must follow. Rendered into llms-full.txt and ai/; enforced by `pnpm check` and `ayywi lint`. */
export const RULES = [
  "Use existing ayywi classes/components and their variants before writing any custom CSS. Never rebuild one under your own name (a .x-chip, .x-card, a <button> styled by hand) or restyle one: your class next to its ayy- class sets only layout (margin, size, position). If nothing fits, compose ayywi pieces. Never add a second UI kit. Never write a raw native control (<button>, <select>, <input>, <textarea>, <table>, <dialog>, <details>) or a <div>/<span> with a click handler: each is an ayywi component. Before writing a screen, name the component for every piece by what it has to do (the Need → component map, or the MCP pick_component tool).",
  "Never hardcode colours (hex, rgb, hsl, named) — in stylesheets or in inline styles. Use var(--ayy-color-*) tokens; for tints use color-mix(in srgb, var(--ayy-color-text) N%, transparent) or the wash/line tokens.",
  "Use logical properties only: margin-inline-start, padding-inline, inset-inline-end, text-align: start, inline-size. Never left/right/margin-left/padding-right, so RTL works.",
  "Spacing, sizes, radius, type and motion come from tokens (--ayy-space-*, --ayy-size-*, --ayy-radius-*, --ayy-text-*, --ayy-weight-*, --ayy-leading-*, --ayy-control-*, --ayy-shadow-*, --ayy-ease-*, --ayy-duration-*). Control sizes follow data-density — don't hardcode heights.",
  "Theme with data-theme=\"dark|light|dark-contrast|light-gray\" (or nothing = follow OS). Never write separate dark-mode colours; tokens already switch. To restyle, override semantic tokens rather than editing components.",
  "Brand a product with a generated brand, never hand-picked colours: `npx @danitesler/ayywi brand <#seed> --name <name>` (or createBrand()/setBrand() from \"@danitesler/ayywi\", or the MCP create_brand tool) makes the colour scale, primary, primary-fg and ring for every theme with contrast checked, plus fonts and corners (--shape pill|round|soft|sharp). Load its CSS and set data-brand. Colour beyond primary comes from --ayy-brand-50…950 (the scale) for illustrations and brand moments, never on navigation or page backgrounds.",
  "Every interactive element keeps its visible :focus-visible ring. Icon-only buttons need aria-label. Form controls need a label. State lives in native/ARIA attributes (disabled, checked, aria-selected, aria-current, aria-expanded, aria-invalid, aria-busy, open).",
  "Toolbar items and icon-only buttons get a Tooltip explaining their action on hover and keyboard focus, paired with a keyboard hint element (<Shortcut keys=\"...\" /> in React, .ayy-shortcut in HTML) whenever a shortcut exists. Never use native title=\"\" attributes.",
  "Every component's spec lists its states (default, hover, pressed, focus, disabled, selected, error, loading, plus its own such as open) and its sizes, in manifest/components.json, llms/<slug>.md and get_component. Reach a state only through the attribute or prop its spec names. Where a state says it doesn't apply, do what it says instead; never style a state a component doesn't have.",
  "Stateful styles need a @media (forced-colors: active) fallback (Windows High Contrast erases fills).",
  "Prefer animating transform and opacity (use a logical property like inset-inline-start only when the motion must follow text direction). Everything must still work under prefers-reduced-motion — base.css collapses ayy animations. Scroll-in motion comes from .ayy-reveal, not a script; nothing loops unless it shows a live state. Movement on :hover (lifts, zooms, spins) goes inside @media (hover: hover), because a tap leaves :hover stuck on touch screens.",
  "The frame is monochrome; colour comes from the content. Set --ayy-spot (to an --ayy-accent-* token) on the card or page that shows the content, and the spotlight, contents bar, icon tiles and .ayy-accent-text inside pick it up. Never tint the navbar, sidebar, buttons or page background per page.",
  "Websites follow one anatomy: .ayy-skip-link, a Navbar (with a NavbarToggle so its links fold into a menu on phones), then <main> at .ayy-container width (fading Separators between marketing sections), then the Footer. The page's call to action is a ring button (the navbar's repeats the same action); everything else outline or ghost.",
  "Apps (anything signed-in) follow one frame: .ayy-skip-link, then the App shell — a sidebar on wide screens; on phones an __bar (brand plus one or two actions) and a Bottom nav with the sidebar's top destinations, same icons and order (four and a More tab when there are more). Each screen in its main starts with a Page header: the one h1, a line of description, at most one primary button; on phones a screen pushed from a list starts with a Top bar (back, title, actions) instead, and a screen's one main create action can be a Floating action button. Lists of rows on phones get Swipe actions for their two or three most common actions, which are also reachable elsewhere. Settings open over the app in a near-full-screen Dialog (size=\"full\") holding the App shell in settings mode (the Settings pattern: a Settings title and the sections in its sidebar; one section of Settings rows in its main; on phones the dialog fills the screen and the section list and a section are two screens), never in a small or side dialog; desktop apps add a Command palette on ⌘K. Never put a Navbar in an app.",
  "An app screen fills the main. Don't wrap it in .ayy-container or a max-inline-size — a max-inline-size on an example only sizes that example in the docs, it is not page layout. Long text (a description, .ayy-prose) may stop at --ayy-size-measure. Settings mode already centres its column; don't add a second cap.",
  "Every list, table and page has three more states: loading (Skeleton in the shape of the content with aria-busy; a Spinner or <Button loading> for an action), empty (an Empty state with the action that fills it) and error (an Alert with a retry for a failed load or save; FieldError next to a field).",
  "Data views use ayywi's own pieces: Chart (BarChart, LineChart), Bar list and Sparkline for charts, coloured from --ayy-chart-1… in order; filters as Chips (with counts) above the results and the active ones as removable chips; sortable Table columns with a .ayy-table__sort button and aria-sort on the <th>. With a chart library, colour it with var(--ayy-chart-N) (SVG) or chartColors() and chartTheme() (canvas); never its default palette.",
  "Pick form controls by the choice: a Segmented control for two to five short options, Choice cards when each option needs a sentence or a price (compact for time slots), a Select for a short list, a Combobox for many known values, a Number field for small counts, a Slider for a rough amount, a DatePicker or DatePickerGrid for a date near today (DateRange / DateRangePicker for a date span, TimePicker / TimePickerTrigger for stepped times, DateTimePicker / DateTimePickerTrigger for date and time, native type=\"date\" for a birth date, type=\"time\" for rapid typing), ColorSwatches for a fixed palette or ColorPicker for any custom colour, a Tag input for free-text tags or recipients, a Search bar to filter a list, a Shortcut recorder for key bindings, File upload for files.",
  "Don't write breakpoints for navigation or layout: App shell, Navbar and Pagination switch at 48rem on their own, and .ayy-grid and .ayy-split adapt to their container. If you truly need one, use 48rem (phone) or 64rem (tablet).",
  "Every <img> gets width and height (its real size) so nothing jumps while it loads. Product screenshots go in a Frame. Draw small product visuals as SVG with tokens instead of images with text baked in.",
  "No :dir() selectors — minifiers rewrite them into :lang() lists that ignore dir=\"rtl\". Logical properties make direction checks unnecessary.",
  "Body text must fall back to system fonts — never remove the system-ui stack from --ayy-font-body (CJK/Arabic/Cyrillic rely on it).",
  "Icons come from Hugeicons (@hugeicons/core-free-icons): <Icon icon={Search01Icon} /> in React, iconSvg(Search01Icon) or the pasted SVG with class=\"ayy-icon\" elsewhere. Don't add another icon set. Icons are decorative (aria-hidden) unless you give them a label; arrows that point along the reading direction take directional.",
  "In React import from \"@danitesler/ayywi/react\"; in other frameworks and plain HTML use the class names, the class helpers from \"@danitesler/ayywi\" (buttonClass…) and the custom elements from \"@danitesler/ayywi/elements\" (<ayy-app-shell>, <ayy-navbar>, <ayy-tabs>, <ayy-combobox>, <ayy-date-picker>, <ayy-date-range>, <ayy-time-picker>, <ayy-date-time-picker>, <ayy-color-picker>, <ayy-toolbar>, <ayy-action-bar>, <ayy-shortcut-recorder>, <ayy-command>, <ayy-tag-input>, <ayy-swipe>, <ayy-dialog>, <ayy-menu>, <ayy-popover>, <ayy-tooltip>, <ayy-toc>, <ayy-carousel>, <ayy-table>, <ayy-grid>).",
  "Run `npx @danitesler/ayywi lint` after UI changes and fix every finding it reports, warnings included: raw-control, bare-control, clickable-element and rebuilt-component mean an ayywi component was skipped.",
];
