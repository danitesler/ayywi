// Copy-paste prompts for people who build with AI tools. Every prompt is a short request the person can read and edit,
// followed by a setup block for their tool and the ayywi rules, so the tool needs nothing else.
import { components } from "./data";

/** The public site, for prompts copied from a local preview: an AI tool can't reach localhost. The Pages build sets VITE_AYYWI_SITE. */
const PUBLIC_SITE: string = (import.meta.env.VITE_AYYWI_SITE ?? "https://danitesler.github.io/ayywi/").replace(/\/*$/, "/");

export interface Links {
  /** Where the docs are read from (llms files, rules, Tailwind mappings): the latest. */
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

export type Tool = "lovable" | "bolt" | "v0" | "replit" | "cursor" | "claude-code" | "chat";

/** Web app builders start from React, Tailwind and shadcn/ui: work with that instead of against it. */
const webBuilder = (l: Links, entry: string) => `Style everything with the ayywi design system. Nothing to install: it's files on the web.
- ${entry}
${headTags(l, "  ")}
- Build the UI from ayywi's class names (ayy-*) on plain elements (className in React). Don't add shadcn/ui, Radix themes or another UI kit for buttons, inputs, cards, dialogs, tables or navigation.
- If the project already has shadcn/ui components, also link ${l.files}shadcn.css after ayywi.min.css so they take ayywi's colours, radius and font until you replace them (replace each one you touch). If its tailwind.config wraps colours in hsl(var(--…)), change them to var(--…).
- Tailwind is fine for layout. Give it ayywi's colours so it can't drift: copy the @theme block from ${l.docs}tailwind/theme.css into the main CSS (Tailwind 4), or add ${l.docs}tailwind/preset.cjs as a preset (Tailwind 3). Then bg-surface, text-muted, border-line follow the theme; never use Tailwind's own colour scale (bg-gray-900, text-blue-500).
- Dark and light mode come from data-theme on <html> (window.ayywi.setTheme("light")), not a .dark class.`;

export const TOOLS: Record<Tool, { label: string; where: string; setup: (l: Links) => string }> = {
  lovable: {
    label: "Lovable",
    where: "Paste it into the Lovable chat when you start a project, or into an existing one.",
    setup: (l) => webBuilder(l, "Add these lines to index.html, inside <head>:"),
  },
  bolt: {
    label: "Bolt",
    where: "Paste it into Bolt's prompt box. It works for a new project and for an open one.",
    setup: (l) => webBuilder(l, "Add these lines to index.html, inside <head>:"),
  },
  v0: {
    label: "v0",
    where: "Paste it into a new v0 chat.",
    setup: (l) =>
      webBuilder(
        l,
        'In app/layout.tsx, put the two stylesheet <link>s in <head>, load theme-init.js with next/script strategy="beforeInteractive" and elements.global.js with strategy="afterInteractive":',
      ),
  },
  replit: {
    label: "Replit",
    where: "Paste it into Replit Agent when you create the app.",
    setup: (l) => webBuilder(l, "Add these lines to the app's main HTML page, inside <head>:"),
  },
  cursor: {
    label: "Cursor",
    where: "Open your project in Cursor and paste it into the Agent chat.",
    setup: (l) => `Set up the ayywi design system in this project. No package to install:
- Load these once from the app's HTML entry, in <head> (or download them into the project, e.g. public/vendor/ayywi/, keeping the fonts/ folder next to fonts.css):
${headTags(l, "  ")}
- Save ${l.docs}ai/cursor/ayywi.mdc as .cursor/rules/ayywi.mdc, so every chat in this project follows the ayywi rules.
- Before writing UI, read ${l.docs}llms.txt, then the page of each component you use (${l.docs}llms/<component>.md): classes, props and copy-ready HTML and React.
- If the project uses Tailwind or shadcn/ui: map Tailwind's theme to ayywi (${l.docs}tailwind/theme.css for Tailwind 4, ${l.docs}tailwind/preset.cjs for Tailwind 3) and link ${l.files}shadcn.css so shadcn parts match until you replace them.`,
  },
  "claude-code": {
    label: "Claude Code",
    where: "Run Claude Code in your project folder and paste it in.",
    setup: (l) => `Set up the ayywi design system in this project. No package to install:
- Load these once from the app's HTML entry, in <head> (or download them into the project, e.g. public/vendor/ayywi/, keeping the fonts/ folder next to fonts.css):
${headTags(l, "  ")}
- Add the rules at ${l.docs}ai/AGENTS.snippet.md to CLAUDE.md, so later sessions follow them too.
- Before writing UI, read ${l.docs}llms.txt, then the page of each component you use (${l.docs}llms/<component>.md): classes, props and copy-ready HTML and React.
- If the project uses Tailwind or shadcn/ui: map Tailwind's theme to ayywi (${l.docs}tailwind/theme.css for Tailwind 4, ${l.docs}tailwind/preset.cjs for Tailwind 3) and link ${l.files}shadcn.css so shadcn parts match until you replace them.`,
  },
  chat: {
    label: "ChatGPT or Claude",
    where: "Paste it into a new chat. You'll get one HTML file: save it and open it in your browser.",
    setup: (l) => `Answer with one self-contained HTML file that uses the ayywi design system. Put these in its <head>:
${headTags(l, "  ")}
Use only ayywi's class names (ayy-*), tokens (--ayy-*) and <ayy-*> elements. No other CSS framework. If you can open links, read ${l.docs}llms.txt and the page of each component you use (${l.docs}llms/<component>.md) for copy-ready markup.`,
  },
};

const RULES = `Rules:
- Only ayywi components and tokens. No hardcoded colours (use var(--ayy-color-*)), no made-up ayy- classes, no left/right CSS (margin-inline-start, not margin-left).
- An app gets a sidebar on wide screens, and a top bar plus a bottom tab bar on phones: .ayy-app-shell with a .ayy-app-shell__bar and a .ayy-bottom-nav inside. A website gets an .ayy-navbar with a menu button for phones (.ayy-navbar__toggle), .ayy-section blocks and an .ayy-footer.
- Each screen starts with a page header (.ayy-page-header). Every list and table has a loading state (.ayy-skeleton), an empty state (.ayy-empty-state) and an error state (.ayy-alert--destructive with a Try again button).
- One main button per screen (.ayy-button); everything else .ayy-button--outline or --ghost.
- Charts are ayywi charts (.ayy-chart, .ayy-bar-list, .ayy-sparkline); with a chart library, colour series with var(--ayy-chart-1), var(--ayy-chart-2)…
- Icons: Hugeicons (hugeicons.com) as inline SVG with class="ayy-icon".`;

/** Every component and its classes on one line each: the contract, for tools that can't open the docs. */
const CLASSES = components.map((c) => `- ${c.name}: ${Object.keys(c.classes).join(" ")}`).join("\n");

/** The whole prompt: the person's request, then how to build it in their tool. */
export function buildPrompt(request: string, tool: Tool, l = links()): string {
  return `${request.trim()}

---
How to build it (for the AI):

${TOOLS[tool].setup(l)}

${RULES}

ayywi classes (each component has a page with copy-ready examples: ${l.docs}llms/<component>.md, e.g. ${l.docs}llms/table.md):
${CLASSES}`;
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
    prompt: `Add the ayywi theme toggle (.ayy-theme-toggle inside <ayy-theme-toggle>, or ThemeToggle in React) to the navbar, or to the sidebar footer in an app. It remembers the choice; load ayywi's theme-init.js first thing in <head> so the saved theme applies before the page paints. Don't write dark colours yourself or use a .dark class: the ayywi tokens switch with data-theme on <html>.`,
  },
  {
    title: "Use ayywi instead of custom styles",
    prompt: `Find every button, input, card, badge, table, menu and dialog styled with custom CSS, Tailwind colour classes or another UI kit, and replace it with the ayywi component. Replace hardcoded colours, font sizes and spacing with ayywi tokens (--ayy-color-*, --ayy-text-*, --ayy-space-*). Keep the behaviour and the text as they are.`,
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
    title: "Add filters and sorting",
    prompt: `Above the main list or table, add a filter bar: an .ayy-input-group search, .ayy-chip filters for the values people filter by (with an .ayy-chip__count each), and the filters in force as .ayy-chip--removable chips with a Clear all button. Make the table's columns sortable: an .ayy-table__sort button in each sortable <th>, aria-sort on the sorted one (<ayy-table> sorts the rows in plain HTML; TableHead sort and onSort in React). Keep the empty state for "no results".`,
  },
  {
    title: "Make the charts match",
    prompt: `Redo the charts with ayywi: .ayy-chart for bars and lines (BarChart and LineChart in React), .ayy-bar-list for rankings, .ayy-sparkline next to a number. If a chart needs a library (zoom, maps), colour its series with the ayywi chart tokens: var(--ayy-chart-1), var(--ayy-chart-2)… in SVG libraries like Recharts, window.ayywi.chartColors() for canvas ones like Chart.js, and window.ayywi.chartTheme() for its text, grid lines and tooltip. Every chart sits in a Card with a title and the key number.`,
  },
  {
    title: "The spacing looks messy",
    prompt: `Fix the spacing with ayywi's layout helpers instead of one-off margins: .ayy-page-header at the top of each screen, .ayy-stack and .ayy-cluster with --ayy-gap set to an --ayy-space-* token, .ayy-grid for cards, .ayy-split for a main column with a side panel.`,
  },
];

/** A follow-up prompt, with a reminder of where the rules are. */
export const fixPrompt = (prompt: string, l = links()) =>
  `${prompt}\n\nThis project uses the ayywi design system: stick to its classes and tokens (each component, with examples: ${l.docs}llms/<component>.md; everything: ${l.docs}llms-full.txt).`;
