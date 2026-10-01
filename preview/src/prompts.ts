// Copy-paste prompts for people who build with AI tools. Every prompt is a short request the person can read and edit,
// followed by a setup block for their tool and the ayywi rules, so the tool needs nothing else.
import { components } from "./data";

/** The public site, for prompts copied from a local preview: an AI tool can't reach localhost. Override with VITE_AYYWI_SITE. */
const PUBLIC_SITE: string = import.meta.env.VITE_AYYWI_SITE ?? "https://danitesler.github.io/ayywi/";

/** Where the files the prompts point at live: this site, unless it's running on this machine. */
export function site(): string {
  const here = new URL(".", window.location.href);
  return /^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(here.hostname) ? PUBLIC_SITE : here.href;
}

export type Tool = "lovable" | "bolt" | "v0" | "replit" | "cursor" | "claude-code" | "chat";

const webBuilder = (base: string, entry: string) => `Style everything with the ayywi design system. It's two files, nothing to install:
- ${entry}
  <link rel="stylesheet" href="${base}dist/ayywi.min.css">
  <script src="${base}dist/elements.global.js" defer></script>
- Build the UI from ayywi's class names (ayy-*) on plain elements (className in React). Don't use shadcn/ui, Tailwind component styles or any other UI kit for buttons, inputs, cards, dialogs or navigation. Tailwind is fine for one-off spacing, never for colours.`;

export const TOOLS: Record<Tool, { label: string; where: string; setup: (base: string) => string }> = {
  lovable: {
    label: "Lovable",
    where: "Paste it into the Lovable chat when you start a project, or into an existing one.",
    setup: (base) => webBuilder(base, "Add these two lines to index.html, inside <head>:"),
  },
  bolt: {
    label: "Bolt",
    where: "Paste it into Bolt's prompt box. It works for a new project and for an open one.",
    setup: (base) => webBuilder(base, "Add these two lines to index.html, inside <head>:"),
  },
  v0: {
    label: "v0",
    where: "Paste it into a new v0 chat.",
    setup: (base) => webBuilder(base, "In app/layout.tsx, put the stylesheet <link> in <head> and load the script with next/script (strategy=\"afterInteractive\"):"),
  },
  replit: {
    label: "Replit",
    where: "Paste it into Replit Agent when you create the app.",
    setup: (base) => webBuilder(base, "Add these two lines to the app's main HTML page, inside <head>:"),
  },
  cursor: {
    label: "Cursor",
    where: "Open your project in Cursor and paste it into the Agent chat.",
    setup: (base) => `Set up the ayywi design system in this project. No package to install:
- Download ${base}dist/ayywi.min.css and ${base}dist/elements.global.js into the project (for example public/vendor/ayywi/) and load them once from the app's HTML entry: the stylesheet in <head>, the script with defer. With a bundler you can import the CSS instead.
- Save ${base}ai/cursor/ayywi.mdc as .cursor/rules/ayywi.mdc, so every chat in this project follows the ayywi rules.
- Before writing UI, read ${base}llms-full.txt: every component with copy-ready HTML and React.`,
  },
  "claude-code": {
    label: "Claude Code",
    where: "Run Claude Code in your project folder and paste it in.",
    setup: (base) => `Set up the ayywi design system in this project. No package to install:
- Download ${base}dist/ayywi.min.css and ${base}dist/elements.global.js into the project (for example public/vendor/ayywi/) and load them once from the app's HTML entry: the stylesheet in <head>, the script with defer. With a bundler you can import the CSS instead.
- Add the rules at ${base}ai/AGENTS.snippet.md to CLAUDE.md, so later sessions follow them too.
- Before writing UI, read ${base}llms-full.txt: every component with copy-ready HTML and React.`,
  },
  chat: {
    label: "ChatGPT or Claude",
    where: "Paste it into a new chat. You'll get one HTML file: save it and open it in your browser.",
    setup: (base) => `Answer with one self-contained HTML file that uses the ayywi design system:
  <link rel="stylesheet" href="${base}dist/ayywi.min.css">
  <script src="${base}dist/elements.global.js" defer></script>
Use only ayywi's class names (ayy-*), tokens (--ayy-*) and <ayy-*> elements. No other CSS framework. If you can open links, read ${base}llms-full.txt for copy-ready examples.`,
  },
};

const RULES = `Rules:
- Only ayywi components and tokens. No hardcoded colours (use var(--ayy-color-*)), no made-up ayy- classes, no left/right CSS (margin-inline-start, not margin-left).
- An app gets a sidebar on wide screens, and a top bar plus a bottom tab bar on phones: .ayy-app-shell with a .ayy-app-shell__bar and a .ayy-bottom-nav inside. A website gets an .ayy-navbar with a menu button for phones (.ayy-navbar__toggle), .ayy-section blocks and an .ayy-footer.
- Each screen starts with a page header (.ayy-page-header). Every list and table has a loading state (.ayy-skeleton), an empty state (.ayy-empty-state) and an error state (.ayy-alert--destructive with a Try again button).
- One main button per screen (.ayy-button); everything else .ayy-button--outline or --ghost.
- Icons: Hugeicons (hugeicons.com) as inline SVG with class="ayy-icon".`;

/** Every component and its classes on one line each: the contract, for tools that can't open the docs. */
const CLASSES = components.map((c) => `- ${c.name}: ${Object.keys(c.classes).join(" ")}`).join("\n");

/** The whole prompt: the person's request, then how to build it in their tool. */
export function buildPrompt(request: string, tool: Tool, base = site()): string {
  return `${request.trim()}

---
How to build it (for the AI):

${TOOLS[tool].setup(base)}

${RULES}

ayywi classes (copy-ready examples of each: ${base}llms-full.txt):
${CLASSES}`;
}

/** What people build most, with a sentence to start from. */
export const STARTERS = [
  { id: "dashboard", label: "Dashboard", hint: "Numbers, charts and tables", what: "dashboard", who: "a small marketing team", needs: "traffic and revenue numbers, a table of top pages, and goals with progress bars", showcase: "dashboard" },
  { id: "landing", label: "Landing page", hint: "Sell a product or an idea", what: "landing page", who: "a new note-taking app", needs: "a hero, three features, pricing with a monthly and yearly switch, an FAQ and an email signup", showcase: "landing" },
  { id: "booking", label: "Booking app", hint: "Schedules and sign-ups", what: "booking app", who: "a yoga studio", needs: "a weekly class schedule, a sign-up form with confirmation, and a page for my bookings", showcase: null },
  { id: "internal", label: "Internal tool", hint: "Lists, details, actions", what: "support tool", who: "our customer support team", needs: "a list of tickets with status, a ticket view with the conversation and a reply box, and customer details", showcase: "inbox" },
  { id: "store", label: "Online store", hint: "Products, cart, checkout", what: "online store", who: "a small coffee roaster", needs: "a product grid with filters, a product page, a cart and a checkout form", showcase: null },
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
    prompt: `Add the ayywi theme toggle (.ayy-theme-toggle inside <ayy-theme-toggle>, or ThemeToggle in React) to the navbar, or to the sidebar footer in an app. Don't write dark colours yourself: the ayywi tokens switch with data-theme on their own.`,
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
    title: "The spacing looks messy",
    prompt: `Fix the spacing with ayywi's layout helpers instead of one-off margins: .ayy-page-header at the top of each screen, .ayy-stack and .ayy-cluster with --ayy-gap set to an --ayy-space-* token, .ayy-grid for cards, .ayy-split for a main column with a side panel.`,
  },
];

/** A follow-up prompt, with a reminder of where the rules are. */
export const fixPrompt = (prompt: string, base = site()) =>
  `${prompt}\n\nThis project uses the ayywi design system: stick to its classes and tokens (all of them, with examples: ${base}llms-full.txt).`;
