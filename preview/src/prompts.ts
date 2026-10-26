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

/** The quick-start request: the AI asks what to build, then builds it. The brand is one of its questions. */
export const QUICK_START = `Build me an app with the ayywi design system. Before you start, ask me these one at a time:
1. What are we building, and who is it for?
2. What does it need: the main screens or features?
3. Which brand colour and corners (pill, round, soft or sharp)? If I have no preference, keep ayywi's monochrome default.

Then build it and make it look finished: dark and light themes, phones, and every empty, loading and error state. Apply the brand with ayywi.setBrand({ name, color, shape }) on DOMContentLoaded, never as hardcoded colours.`;

/** The two ways into a codebase: the package, or the pinned files. */
export type Setup = "package" | "files";

/** For a codebase: the agent sets ayywi up. Chat and AI builders are covered by the quick start prompt. */
export const SETUPS: Record<Setup, { label: string; prompt: (l: Links) => string }> = {
  package: {
    label: "npm package",
    prompt: () => `Set up the ayywi design system in this project and build a first screen with it.

1. Run npx -y @danitesler/ayywi init. That configures the ayywi agent skill, Cursor rules, AGENTS.md instructions, and the MCP server (with get_component, search, get_tokens, get_rules, create_brand and lint tools).
2. Load ayywi once at the app entry: import "@danitesler/ayywi/css" (React: use "@danitesler/ayywi/react"; other frameworks: import "@danitesler/ayywi/elements" and use <ayy-*> elements).
3. Follow the ayywi rules: components and tokens only. No hardcoded colours, no made-up classes, no left/right CSS.
4. Ask me which brand colour and corners (pill, round, soft or sharp) to use, then run npx @danitesler/ayywi brand "<colour>" --name <app-name> --shape <corners> --out src/brand.css, load it after ayywi's CSS and set data-brand="<app-name>" on <html>. No preference: keep the monochrome default.
5. Build a first screen that fits this project: an app uses the App shell (sidebar on wide screens, top bar + bottom nav on phones); a website uses Navbar, .ayy-container content and Footer. Include empty, loading and error states.
6. Run npx @danitesler/ayywi lint and fix everything it reports. Then tell me which files you changed and how to open the screen.`,
  },
  files: {
    label: "No build (CDN)",
    prompt: (l) => `Set up the ayywi design system in this project and build a first screen with it. Don't install any packages.

1. Load these once from the app's HTML entry, in <head>. They're pinned to one release, so a later one can't change your app; to own them, download them into the project (for example public/vendor/ayywi/, with the fonts/ folder next to fonts.css). With a bundler you can import the CSS instead.
${headTags(l, "   ")}
2. Before writing any UI, read ${l.docs}llms-full.txt: the rules, the patterns, the tokens and every component's API. For copy-ready HTML and React, read the page of each component you use: ${l.docs}llms/<component>.md (all listed in ${l.docs}llms.txt). Use only its classes (ayy-*), tokens (--ayy-*) and <ayy-*> elements. No hardcoded colours, no made-up classes, no left/right CSS.
3. Save the rules at ${l.docs}ai/AGENTS.snippet.md into AGENTS.md (or CLAUDE.md, or .cursorrules) so later sessions follow them too.
4. Ask me which brand colour and corners (pill, round, soft or sharp) to use, and apply them with ayywi.setBrand({ name, color, shape }) on DOMContentLoaded. No preference: keep the monochrome default.
5. Build a first screen that fits this project. An app: the App shell (a sidebar on wide screens, a top bar and a Bottom nav on phones) with a Page header. A website: a Navbar, content at .ayy-container width and a Footer. Include its empty, loading and error states.
6. Tell me which files you changed and how to open the screen.`,
  },
};

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
