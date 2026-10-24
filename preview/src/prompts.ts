// Copy-paste prompts for people who build with AI tools. Every prompt is a short request the person can read and edit,
// followed by one setup block and the ayywi rules, so any AI builder (Lovable, Bolt, v0, Replit, a chat) needs nothing else.

/** The public site, for prompts copied from a local preview: an AI tool can't reach localhost. The Pages build sets VITE_AYYWI_SITE. */
const PUBLIC_SITE: string = (import.meta.env.VITE_AYYWI_SITE ?? "https://danitesler.github.io/ayywi/").replace(/\/*$/, "/");

export interface Links {
  /** Where the docs are read from (llms files, rules): the latest. */
  docs: string;
  /** Where an app loads ayywi from: this release's copies, at a path whose files never change, so a later release can't restyle it. */
  files: string;
}

/** The two bases the prompts use. From a local preview, the public site's latest: this build isn't published. */
export function links(): Links {
  const here = new URL(".", window.location.href);
  if (/^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(here.hostname)) return { docs: PUBLIC_SITE, files: `${PUBLIC_SITE}dist/` };
  return { docs: here.href, files: `${here.href}v/${__AYYWI_RELEASE__}/dist/` };
}

/** The tags an app needs, in order: the saved theme before the first paint, the fonts, the styles, then the elements. */
export const headTags = ({ files }: Links, indent = "") =>
  [
    `<script src="${files}theme-init.js"></script>`,
    `<link rel="stylesheet" href="${files}fonts.css">`,
    `<link rel="stylesheet" href="${files}ayywi.min.css">`,
    `<script src="${files}elements.global.js" defer></script>`,
  ]
    .map((tag) => indent + tag)
    .join("\n");

/** The rules that make an app look built with ayywi, short enough to sit in any prompt. */
const RULES = `Rules:
- Only ayywi classes (ayy-*), tokens (--ayy-*) and <ayy-*> elements. No hardcoded colours, no made-up classes, no left/right CSS.
- An app: .ayy-app-shell with a sidebar on wide screens and a top bar plus .ayy-bottom-nav on phones. A website: .ayy-navbar, content at .ayy-container width, and an .ayy-footer.
- Every screen starts with .ayy-page-header. Every list and table has a loading (.ayy-skeleton), an empty (.ayy-empty-state) and an error state (.ayy-alert--destructive).
- One main .ayy-button per screen; everything else outline or ghost. Icons: Hugeicons inline SVG with class="ayy-icon".`;

/** How to build with ayywi, for any AI tool that takes a prompt: the files to load, what to use, where the docs are. */
const SETUP = (l: Links) => `Style everything with the ayywi design system. Nothing to install: load these in the app's HTML <head>.
${headTags(l, "  ")}
- Dark and light mode come from data-theme on <html>, never a .dark class.
- Every component, with copy-ready HTML and React: ${l.docs}llms.txt (all of it in one file: ${l.docs}llms-full.txt).`;

/** The whole prompt: the person's request, then how to build it with ayywi. Short enough for any AI builder. */
export function buildPrompt(request: string, l = links()): string {
  return `${request.trim()}

---
How to build it (for the AI):

${SETUP(l)}

${RULES}`;
}

/** What people build most, with a sentence to start from. */
export const STARTERS = [
  { id: "dashboard", label: "Dashboard", hint: "Numbers, charts and tables", what: "dashboard", who: "a small marketing team", needs: "traffic and revenue numbers, a table of top pages, and goals with progress bars", showcase: "dashboard" },
  { id: "landing", label: "Landing page", hint: "Sell a product or an idea", what: "landing page", who: "a new note-taking app", needs: "a hero, three features, pricing with a monthly and yearly switch, an FAQ and an email signup", showcase: "landing" },
  { id: "booking", label: "Booking app", hint: "Schedules and sign-ups", what: "booking app", who: "a yoga studio", needs: "a weekly class schedule, a sign-up form with confirmation, and a page for my bookings", showcase: "booking" },
  { id: "internal", label: "Internal tool", hint: "Lists, details, actions", what: "support tool", who: "our customer support team", needs: "a list of tickets with status, a ticket view with the conversation and a reply box, and customer details", showcase: "inbox" },
  { id: "store", label: "Online store", hint: "Products, cart, checkout", what: "online store", who: "a small coffee roaster", needs: "a product grid with filters, a product page, a cart and a checkout form", showcase: "store" },
  { id: "settings", label: "Account pages", hint: "Profile, billing, settings", what: "account section", who: "my app's customers", needs: "a profile form, notification switches, a plan and billing page with invoices", showcase: "settings" },
] as const;

export type StarterId = (typeof STARTERS)[number]["id"];

/** "Build me a … for … It needs …" from the three slots. */
export const request = (what: string, who: string, needs: string) =>
  `Build me ${/^[aeiou]/i.test(what.trim()) ? "an" : "a"} ${what.trim() || "app"}${who.trim() ? ` for ${who.trim()}` : ""}.${needs.trim() ? ` It needs ${needs.trim().replace(/\.$/, "")}.` : ""} Make it look finished: dark and light themes, phones, and every empty, loading and error state.`;

/** Follow-ups for when something looks off, after the first prompt. */
export const FIXES = [
  {
    title: "Make it look right on my phone",
    prompt: `Check every screen at phone width (390px). An app should swap its sidebar for the ayywi bottom tab bar (.ayy-bottom-nav inside .ayy-app-shell, with an .ayy-app-shell__bar on top); a website's navbar links should fold into its menu button (.ayy-navbar__toggle). Nothing may scroll sideways: replace fixed widths with .ayy-grid and .ayy-split.`,
  },
  {
    title: "Add a dark mode switch",
    prompt: `Add a theme switcher to the navbar, or to the sidebar footer in an app, switching data-theme on <html> (with setTheme() or setting data-theme directly). It remembers the choice; load ayywi's theme-init.js first thing in <head> so the saved theme applies before the page paints. Don't write dark colours yourself or use a .dark class: the ayywi tokens switch with data-theme on <html>.`,
  },
  {
    title: "Use ayywi instead of custom styles",
    prompt: `Find every button, input, card, badge, table, menu and dialog styled with custom CSS or inline styles, and replace it with the ayywi component. Replace hardcoded colours, font sizes and spacing with ayywi tokens (--ayy-color-*, --ayy-text-*, --ayy-space-*). Keep the behaviour and the text as they are.`,
  },
  {
    title: "The buttons look inconsistent",
    prompt: `Make the buttons consistent: one main ayy-button per screen for the main action, everything else ayy-button--outline or ayy-button--ghost, sizes only from ayy-button--sm and --lg, icons from Hugeicons, and an aria-label on every icon-only button.`,
  },
  {
    title: "Add loading, empty and error states",
    prompt: `For every list, table and page add the missing states: .ayy-skeleton shapes while it loads (aria-busy="true" on the area), an .ayy-empty-state with the button that fills it when there's nothing, and an .ayy-alert--destructive with a Try again button when loading fails. Buttons that save show a spinner (aria-busy="true" and an .ayy-spinner inside).`,
  },
  {
    title: "Add filters, search and sorting",
    prompt: `Above the main list or table, add a filter bar using .ayy-filter-bar (FilterBar in React) with an .ayy-search-bar (SearchBar in React), filter chips (.ayy-chip) for active filters with count badges, and .ayy-sorting (Sorting in React) for sort options. For bulk actions on selected rows, show a floating .ayy-action-bar (ActionBar in React) with selection count and action buttons. Make table columns sortable with .ayy-table__sort buttons and aria-sort (<ayy-table> in plain HTML; TableHead sort/onSort in React). Keep the empty state (.ayy-empty-state) for "no results".`,
  },
  {
    title: "Add date and color pickers",
    prompt: `Use ayywi's first-class date and color components: .ayy-date-picker (<ayy-date-picker> in HTML, DatePicker in React) for calendar dates, .ayy-date-range for date ranges, and .ayy-color-picker (<ayy-color-picker> in HTML, ColorPicker in React) with preset swatches for picking colors.`,
  },
  {
    title: "Make the charts match",
    prompt: `Redo the charts with ayywi: .ayy-chart for bars and lines (BarChart and LineChart in React), .ayy-bar-list for rankings, .ayy-sparkline next to a number. If a chart needs a library (zoom, maps), colour its series with the ayywi chart tokens: var(--ayy-chart-1), var(--ayy-chart-2)… in SVG libraries like Recharts, window.ayywi.chartColors() for canvas ones like Chart.js, and window.ayywi.chartTheme() for its text, grid lines and tooltip. Every chart sits in a Card with a title and the key number.`,
  },
  {
    title: "The spacing looks messy",
    prompt: `Fix the spacing with ayywi's layout helpers instead of one-off margins: .ayy-page-header at the top of each screen, .ayy-stack and .ayy-cluster with --ayy-gap set to an --ayy-space-* token, .ayy-grid for responsive card grids (Grid in React), .ayy-split for a main column with a side panel.`,
  },
];

/** A follow-up prompt, with a reminder of where the rules are. */
export const fixPrompt = (prompt: string, l = links()) =>
  `${prompt}\n\nThis project uses the ayywi design system: stick to its classes and tokens (each component, with examples: ${l.docs}llms/<component>.md; everything: ${l.docs}llms-full.txt).`;

export interface ComponentPromptMeta {
  name: string;
  slug: string;
  description: string;
  aka?: string[];
  classes?: Record<string, string>;
  react?: { import: string; components?: Record<string, unknown> };
  element?: { tag: string };
  elements?: { tag: string }[];
  do?: string[];
  dont?: string[];
}

export interface ExamplePromptMeta {
  title: string;
  reactSource?: string;
  htmlSource?: string;
}

/** Generate an actionable AI prompt to build a component example with ayywi. */
export function componentPrompt(
  component: ComponentPromptMeta,
  example: ExamplePromptMeta,
  renderer: "react" | "html" = "react",
  l = links(),
): string {
  const isHtml = renderer === "html" && Boolean(example.htmlSource);
  const lines = [
    `Build ${/^[aeiou]/i.test(component.name) ? "an" : "a"} ${component.name} component (${example.title}) using the ayywi design system.`,
    ``,
    `Context:`,
    component.description,
    ``,
    `Implementation:`,
  ];

  if (!isHtml && component.react?.import) {
    lines.push(`- React: ${component.react.import}`);
  }
  const tags = [
    ...(component.element?.tag ? [component.element.tag] : []),
    ...(component.elements?.map((e) => e.tag) ?? []),
  ];
  if (tags.length) {
    lines.push(`- Element${tags.length > 1 ? "s" : ""}: ${tags.map((t) => `<${t}>`).join(", ")} (from "@danitesler/ayywi/elements")`);
  }
  if (component.aka?.length) {
    lines.push(`- Also known as: ${component.aka.join(", ")}`);
  }
  const keyClasses = Object.keys(component.classes ?? {}).slice(0, 5).map((c) => `.${c}`).join(", ");
  if (keyClasses) {
    lines.push(`- Classes: ${keyClasses}`);
  }

  if (component.do?.length || component.dont?.length) {
    lines.push(``, `Key guidelines:`);
    if (component.do?.length) lines.push(`- Do: ${component.do[0]}`);
    if (component.dont?.length) lines.push(`- Don't: ${component.dont[0]}`);
  }

  lines.push(
    `- Rules: Tokens only (var(--ayy-*)). No hardcoded hex/rgb colours, no made-up ayy- classes.`,
    `- Docs: ${l.docs}llms/${component.slug}.md`,
  );

  const snippet = isHtml ? example.htmlSource : (example.reactSource || example.htmlSource);
  if (snippet) {
    lines.push(
      ``,
      `Reference code:`,
      `\`\`\`${isHtml ? "html" : "tsx"}`,
      snippet,
      `\`\`\``,
    );
  }

  return lines.join("\n");
}
