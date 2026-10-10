import { useState } from "react";
import { ArrowDown01Icon, ArrowRight01Icon, ChatGptIcon, ClaudeIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { themes, tokens, type DensityMode, type ThemeMode } from "@danitesler/ayywi";
import {
  Accordion,
  AccordionItem,
  buttonClass,
  Card,
  CardFooter,
  CardHeader,
  CardMedia,
  CardTitle,
  Carousel,
  CarouselSlide,
  Combobox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon,
  SegmentedControl,
  SegmentedControlItem,
} from "@danitesler/ayywi/react";
import { CodeBlock, CopyButton } from "../CodeBlock";
import { components } from "../data";
import { buildPrompt, FIXES, fixPrompt, headTags, links, request, STARTERS, TOOLS, type Links, type StarterId, type Tool } from "../prompts";
import { showcaseApps } from "../showcase/apps";
import { themeOptions } from "../themes";
import agentsSnippet from "../../../ai/AGENTS.snippet.md?raw";
import llmsIndex from "../../../llms.txt?raw";

const ROUTE = "";

type Setup = "files" | "package" | "chat";

/** Same shape for every tab: who it's for, then what the copied prompt contains. */
interface TabIntro {
  label: string;
  when: string;
  includes: string[];
}

const BUILDER_INTRO: TabIntro = {
  label: "AI Builders",
  when: "For Lovable, Bolt, v0, Cursor, Claude Code or ChatGPT. Describe what you want, pick your tool, and paste one prompt.",
  includes: [
    "Your request, customized from the sentence above",
    "Tailored setup instructions for your chosen AI tool",
    "The design rules: ayywi classes and tokens only, no hardcoded colours",
    "Every component class and responsive layout rules",
  ],
};

const SETUPS: Record<Setup, TabIntro & { prompt: (l: Links) => string }> = {
  files: {
    label: "No-Build / CDN",
    when: "For an existing site or app with no package manager or build step: plain HTML, Astro, a CMS theme. The agent links the files straight from this site.",
    includes: [
      "The <head> tags for the stylesheet, fonts and script, pinned to one release",
      "A link to the full rules and every component (llms-full.txt)",
      "The rules to save in AGENTS.md, so later sessions follow them",
      "A first screen with its empty, loading and error states",
    ],
    prompt: (l) => `Set up the ayywi design system in this project and build a first screen with it. Don't install any packages.

1. Load these once from the app's HTML entry, in <head>. They're pinned to one release, so a later one can't change your app; to own them, download them into the project (for example public/vendor/ayywi/, with the fonts/ folder next to fonts.css). With a bundler you can import the CSS instead.
${headTags(l, "   ")}
2. Before writing any UI, read ${l.docs}llms-full.txt: the rules, the tokens, and every component with copy-ready HTML and React (or ${l.docs}llms.txt and one page per component, ${l.docs}llms/<component>.md). Use only its classes (ayy-*), tokens (--ayy-*) and <ayy-*> elements. No hardcoded colours, no made-up classes, no left/right CSS.
3. Save the rules at ${l.docs}ai/AGENTS.snippet.md into AGENTS.md (or CLAUDE.md, or .cursorrules) so later sessions follow them too.
4. Build a first screen that fits this project. An app: the App shell (a sidebar on wide screens, a top bar and a Bottom nav on phones) with a Page header. A website: a Navbar, Sections and a Footer. Include its empty, loading and error states.
5. Tell me which files you changed and how to open the screen.`,
  },
  package: {
    label: "Agent & MCP",
    when: "For Cursor, Claude Code, Windsurf, or existing codebases: tell your agent to set up ayywi and connect the MCP server.",
    includes: [
      "npx -y @danitesler/ayywi init (or npx @danitesler/ayywi mcp)",
      "A skill, Cursor rules and an AGENTS.md guide",
      "An MCP server with get_component, search and lint tools",
      "Automatic responsive shell and complete UI states",
      "A final npx ayywi lint pass",
    ],
    prompt: () => `Set up the ayywi design system in this project and build a first screen with it.

1. Run npx -y @danitesler/ayywi init. That configures the ayywi agent skill, Cursor rules, AGENTS.md instructions, and the MCP server (with get_component, search, get_tokens, get_rules, create_brand and lint tools).
2. Load ayywi once at the app entry: import "@danitesler/ayywi/css" (React: use "@danitesler/ayywi/react"; other frameworks: import "@danitesler/ayywi/elements" and use <ayy-*> elements).
3. Follow the ayywi rules: components and tokens only. No hardcoded colours, no made-up classes, no left/right CSS.
4. Build a first screen that fits this project: an app uses the App shell (sidebar on wide screens, top bar + bottom nav on phones); a website uses Navbar, Sections and Footer. Include empty, loading and error states.
5. Run npx ayywi lint and fix everything it reports. Then tell me which files you changed and how to open the screen.`,
  },
  chat: {
    label: "Web Chat",
    when: "For Claude, ChatGPT or Gemini in the browser. You get one HTML file that loads ayywi from this site: good for a prototype or a quick mock.",
    includes: [
      "Links to llms.txt and the page of each component",
      "The <head> tags for the stylesheet, fonts and script",
      "The rules: one self-contained HTML file, ayywi only, inline icons",
      "A sample first screen: a pricing page",
    ],
    prompt: (l) => `You're helping me build UI with the ayywi design system. Read ${l.docs}llms.txt, then the page of each component you need (${l.docs}llms/<component>.md). If you can't open links, ask me to paste the component sections.

Answer with one self-contained HTML file that has these in its <head>
${headTags(l, "  ")}
and uses only ayywi classes (ayy-*), tokens (--ayy-*) and <ayy-*> elements. No other CSS framework, no hardcoded colours, no left/right CSS. Icons are inline Hugeicons SVGs with class="ayy-icon".

My first screen: a pricing page with three plans (the middle one recommended), a monthly/yearly switch and an FAQ.`,
  },
};

/** Use cases beyond the showcase apps. */
const MORE = [
  {
    id: "migrate",
    title: "Clean up an existing page",
    why: "Five shades of grey, three button styles and a hand-rolled modal. Converge on one system without a rewrite.",
    prompt: `Migrate src/pages/Billing.tsx to ayywi. Replace hand-written buttons, inputs, cards, tabs and the confirm modal with ayywi components, and hardcoded colours, spacing and font sizes with ayywi tokens. Keep the behaviour and the copy exactly as they are.

Lint the file (npx ayywi lint, or check it against the rules), fix what it reports, and list anything you couldn't map to an ayywi component so I can decide.`,
  },
  {
    id: "flow",
    title: "A sign-up flow",
    why: "Three screens, one form each, and a clear sense of how much is left.",
    prompt: `Build a three-step sign-up flow with ayywi: Account (name, email, password with a show/hide button in an Input group), Team (invite emails, a Segmented control for team size), and Plan (plan cards, the chosen one featured). Steps at the top shows where you are; each step has one primary Continue button and a ghost Back button, and Continue shows loading while it saves. Validation errors go in a FieldError under the field with aria-invalid on the input. Use the ayywi components and tokens only.`,
  },
  {
    id: "component",
    title: "Add one piece to a screen",
    why: "Most days you ask for one thing. The agent should reach for the component, not write new CSS.",
    prompt: `On the Projects page, add a dialog that asks before deleting a project: the project name in the title, one sentence on what's lost, a destructive Delete button and a ghost Cancel. While it deletes, the button shows loading; afterwards show a toast with Undo. Use the ayywi Dialog, Button and toast().`,
  },
];

const REVIEW = [
  "Switch the theme and density (the Theme menu at the top of the sidebar, or of the screen on a phone), then do the same in your app. Everything should still read well.",
  "Narrow the window below 48rem. An app should swap its sidebar for a bottom nav; a site's navbar links should fold into a menu.",
  "Tab through the page. Every button, link and field should show a focus ring.",
  "Look for one main button per view. Everything else should be quieter.",
  "Empty the list, slow the network and break the request: each of those needs its own state.",
  "Run the linter (npx ayywi lint) where the package is installed. It catches made-up classes, hardcoded colours and layouts that break in right-to-left languages.",
];

export const getStarted = {
  route: ROUTE,
  title: "Get started",
  text: "start begin home overview setup install copy paste prompt no code vibe lovable bolt v0 replit cursor claude chatgpt no install cdn files link ai agent mcp llms use cases lint review",
};

export interface Appearance {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  density: DensityMode;
  setDensity: (density: DensityMode) => void;
}

/** Audiences to suggest in the sentence; anything typed works too. */
const WHO_OPTIONS = STARTERS.map((s) => ({ value: s.who, label: s.who, meta: s.label }));

/** Change the theme and density of this whole page, right in the hero. */
function TryIt({ theme, setTheme, density, setDensity }: Appearance) {
  const resolved = theme === "system" ? (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark") : theme;
  return (
    <div className="pv-try">
      <span className="ayy-muted">Try it on this page:</span>
      <SegmentedControl size="sm" aria-label="Theme" value={resolved} onValueChange={(v) => setTheme(v as ThemeMode)}>
        {themeOptions.map((t) => (
          <SegmentedControlItem key={t.name} value={t.name}>
            {t.label}
          </SegmentedControlItem>
        ))}
      </SegmentedControl>
      <SegmentedControl size="sm" aria-label="Density" value={density === "auto" ? "" : density} onValueChange={(v) => setDensity(v as DensityMode)}>
        <SegmentedControlItem value="compact">Compact</SegmentedControlItem>
        <SegmentedControlItem value="comfortable">Comfortable</SegmentedControlItem>
        <SegmentedControlItem value="touch">Touch</SegmentedControlItem>
      </SegmentedControl>
    </div>
  );
}

/** The showcase apps, each with the prompt that builds it in the chosen tool. */
function Examples({ tool }: { tool: Tool }) {
  return (
    <Carousel label="Example apps" slideWidth="min(20rem, 85%)" className="pv-examples">
      {showcaseApps.map((app) => (
        <CarouselSlide key={app.id}>
          <Card interactive spotlight className="pv-example-card">
            <CardMedia className="pv-showcase__thumb">
              <img src={app.screenshot} alt={`${app.name}, ${app.kind}`} loading="lazy" width={1280} height={800} />
            </CardMedia>
            <CardHeader>
              <CardTitle>
                {app.name} <span className="ayy-muted">· {app.kind}</span>
              </CardTitle>
            </CardHeader>
            <CardFooter>
              <CopyButton text={buildPrompt(app.prompt, tool)} label="Copy prompt to build this" variant="outline" />
              <a className={buttonClass({ variant: "ghost", size: "sm" })} href={`#/showcase/${app.id}`}>
                See it
              </a>
            </CardFooter>
          </Card>
        </CarouselSlide>
      ))}
    </Carousel>
  );
}

const TOOL_LOGOS: { id: Tool; name: string; svg: React.ReactNode }[] = [
  {
    id: "lovable",
    name: "Lovable",
    svg: (
      <svg className="ayy-icon" viewBox="0 0 122 122" aria-hidden="true">
        <path
          fill="currentColor"
          d="M36.07 0C55.99 0 72.14 16.16 72.14 36.08v13.72h12C104.06 49.8 120.21 65.95 120.21 85.88c0 19.93-16.15 36.08-36.07 36.08H0V36.08C0 16.16 16.15 0 36.07 0Z"
        />
      </svg>
    ),
  },
  {
    id: "bolt",
    name: "Bolt",
    svg: (
      <svg className="ayy-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M10.797 14.182H3.635L16.728 0l-3.525 9.818h7.162L7.272 24l3.524-9.818Z"
        />
      </svg>
    ),
  },
  {
    id: "v0",
    name: "v0",
    svg: (
      <svg className="ayy-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M14.066 6.028v2.22h5.729q.075-.001.148.005l-5.853 5.752a2 2 0 0 1-.024-.309V8.247h-2.353v5.45c0 2.322 1.935 4.222 4.258 4.222h5.675v-2.22h-5.675q-.03 0-.059-.003l5.729-5.629q.006.082.006.166v5.465H24v-5.465a4.204 4.204 0 0 0-4.205-4.205zM0 8.245l8.28 9.266c.839.94 2.396.346 2.396-.914V8.245H8.19v5.44l-4.86-5.44Z"
        />
      </svg>
    ),
  },
  {
    id: "cursor",
    name: "Cursor",
    svg: (
      <svg className="ayy-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23"
        />
      </svg>
    ),
  },
  {
    id: "claude-code",
    name: "Claude Code",
    svg: <Icon icon={ClaudeIcon} aria-hidden />,
  },
  {
    id: "replit",
    name: "Replit",
    svg: (
      <svg className="ayy-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M2 1.5A1.5 1.5 0 0 1 3.5 0h7A1.5 1.5 0 0 1 12 1.5V8H3.5A1.5 1.5 0 0 1 2 6.5ZM12 8h8.5A1.5 1.5 0 0 1 22 9.5v5a1.5 1.5 0 0 1-1.5 1.5H12ZM2 17.5A1.5 1.5 0 0 1 3.5 16H12v6.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 2 22.5Z"
        />
      </svg>
    ),
  },
  {
    id: "chat",
    name: "ChatGPT",
    svg: <Icon icon={ChatGptIcon} aria-hidden />,
  },
];

const MCP_CONFIG = JSON.stringify(
  {
    mcpServers: {
      ayywi: {
        command: "npx",
        args: ["-y", "@danitesler/ayywi", "mcp"],
      },
    },
  },
  null,
  2,
);

/** Who a tab is for and what its copied prompt contains. */
function TabSummary({ intro }: { intro: TabIntro }) {
  return (
    <section className="pv-intro" aria-label={`${intro.label}: what you get`}>
      <p className="pv-intro__when">{intro.when}</p>
      <p className="pv-intro__title">Included when you copy</p>
      <ul className="pv-intro__list">
        {intro.includes.map((item) => (
          <li key={item}>
            <Icon icon={Tick02Icon} className="pv-intro__check" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

interface BuilderGuideProps {
  tool: Tool;
  onToolChange: (tool: Tool) => void;
}

/** For people who build with Lovable, Bolt, v0, Cursor or a chat: copy one prompt, no code. */
function BuilderGuide({ tool, onToolChange }: BuilderGuideProps) {
  const [starter, setStarter] = useState<StarterId>("booking");
  const first = STARTERS.find((s) => s.id === starter)!;
  const [what, setWhat] = useState<string>(first.what);
  const [who, setWho] = useState<string>(first.who);
  const [needs, setNeeds] = useState<string>(first.needs);
  const pick = (id: StarterId) => {
    const s = STARTERS.find((x) => x.id === id)!;
    setStarter(id);
    setWhat(s.what);
    setWho(s.who);
    setNeeds(s.needs);
  };
  const ask = request(what, who, needs);
  const prompt = buildPrompt(ask, tool);
  const example = showcaseApps.find((a) => a.id === first.showcase);
  const article = /^[aeiou]/i.test(what.trim()) ? "an" : "a";

  return (
    <>
      <div className="pv-madlib">
        Build me {article}{" "}
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="What you're building"
            variant="ghost"
            className="pv-slot pv-slot--trigger"
          >
            <span>{what}</span>
            <Icon icon={ArrowDown01Icon} className="pv-slot__chevron" />
          </DropdownMenuTrigger>
          <DropdownMenuContent aria-label="What you're building">
            {STARTERS.map((s) => (
              <DropdownMenuItem
                key={s.id}
                role="menuitemradio"
                aria-checked={s.id === starter}
                onSelect={() => pick(s.id)}
              >
                {s.what}
                {s.id === starter ? <Icon icon={Tick02Icon} className="pv-picker__check" /> : null}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>{" "}
        for{" "}
        <Combobox
          aria-label="Who it's for"
          key={starter}
          options={WHO_OPTIONS}
          defaultValue={who}
          placeholder="a yoga studio"
          onInputChange={setWho}
          onValueChange={(v) => setWho(v)}
          className="pv-slot"
        />
        . It needs:
        <textarea
          className="ayy-textarea pv-slot pv-slot--long"
          aria-label="What it needs"
          rows={1}
          value={needs}
          placeholder="a schedule and a sign-up form"
          onChange={(e) => setNeeds(e.target.value)}
        />
      </div>
      {example ? (
        <p className="pv-note">
          Something like it:{" "}
          <a className="ayy-link" href={`#/showcase/${example.id}`}>
            {example.name}, {example.kind.toLowerCase()}
          </a>
          .
        </p>
      ) : null}

      <div className="pv-supported">
        <span className="pv-supported__badge">
          <Icon icon={Tick02Icon} className="pv-supported__check" />
          <span>Pick your AI tool:</span>
        </span>
        <div className="pv-supported__icons" role="radiogroup" aria-label="AI tools">
          {TOOL_LOGOS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={tool === t.id}
              className="pv-tool-btn"
              onClick={() => onToolChange(t.id)}
            >
              <span className="pv-supported__icon">{t.svg}</span>
              <span>{t.name}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="pv-note pv-tool-note">
        {TOOLS[tool].where}
      </p>

      <CodeBlock code={prompt} label="prompt" copyLabel="Copy prompt" wrap />

      <div className="pv-mcp-box">
        <div className="pv-mcp-box__header">
          <div>
            <strong>Or connect via MCP</strong>
            <span className="ayy-muted"> · Cursor, Claude Code, Windsurf</span>
          </div>
          <CopyButton text={MCP_CONFIG} label="Copy MCP config" variant="outline" />
        </div>
        <p className="pv-note">
          Give your agent native tools: <code>get_component</code>, <code>search</code>, <code>get_tokens</code>, <code>create_brand</code>, and real-time <code>lint</code> without pasting full prompts.
        </p>
      </div>

      <h2 className="pv-h pv-h--section" id="refine">
        Refine with follow-up prompts
      </h2>
      <p className="pv-note">
        When something looks off, don't write custom CSS. Paste one of these into your chat to guide the agent:
      </p>
      <Accordion single>
        {FIXES.map((fix) => (
          <AccordionItem key={fix.title} label={fix.title}>
            <CodeBlock code={fixPrompt(fix.prompt)} label="prompt" copyLabel="Copy prompt" wrap />
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}

/** The guide for developers: install paths, use-case prompts, checks and the raw files. */
function DeveloperGuide({ setup }: { setup: Setup }) {
  const l = links();
  const chosen = SETUPS[setup];
  const stable = components.filter((c) => c.status === "stable").length;
  const facts = [`${components.length} components (${stable} stable)`, `${Object.keys(tokens).length} tokens`, `${themes.length} themes`, "any framework", "0 runtime dependencies"];
  return (
    <>
      <p className="pv-facts">{facts.join(" · ")}</p>
      <CodeBlock code={chosen.prompt(l)} label="prompt" copyLabel="Copy prompt" wrap />

      <h2 className="pv-h pv-h--section" id="build">
        Ask for a screen
      </h2>
      <p className="pv-note">
        After setup the agent knows the rules, so plain words work. These prompts name the components, so nothing is left to guess; the
        first seven are the screens in What you can build.
      </p>
      <Accordion single>
        {showcaseApps.map((app) => (
          <AccordionItem key={app.id} label={`${app.kind} — like ${app.name}`}>
            <p>{app.description}</p>
            <CodeBlock code={app.prompt} label="prompt" wrap />
            <p>
              <a className="ayy-link" href={`#/showcase/${app.id}`}>
                See {app.name} on desktop, tablet and phone
              </a>
            </p>
          </AccordionItem>
        ))}
        {MORE.map((u) => (
          <AccordionItem key={u.id} label={u.title}>
            <p>{u.why}</p>
            <CodeBlock code={u.prompt} label="prompt" wrap />
          </AccordionItem>
        ))}
      </Accordion>

      <h2 className="pv-h pv-h--section" id="check">
        Check what it built
      </h2>
      <ul className="pv-list">
        {REVIEW.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>

      <h2 className="pv-h pv-h--section" id="context">
        The raw context
      </h2>
      <p className="pv-note">
        Everything the prompts point at is on this site, so you can paste it into any tool. With the package installed,{" "}
        <code>npx ayywi mcp</code> serves the same over MCP and <code>npx ayywi lint</code> checks the result.
      </p>
      <div className="pv-files">
        <CopyButton text={agentsSnippet} label="Copy the rules for AGENTS.md" variant="outline" />
        <CopyButton text={llmsIndex} label="Copy llms.txt (index)" variant="outline" />
        <CopyButton text={MCP_CONFIG} label="Copy MCP config" variant="outline" />
        {(["llms-full.txt", "dist/ayywi.min.css", "dist/elements.global.js", "manifest/components.json"] as const).map((path) => (
          <a key={path} className={buttonClass({ variant: "ghost", size: "sm" })} href={path} target="_blank" rel="noreferrer">
            {path}
          </a>
        ))}
      </div>

      <h2 className="pv-h pv-h--section" id="inside">
        What's in it
      </h2>
      <nav className="pv-chips" aria-label="Components">
        {components.map((c) => (
          <a key={c.slug} href={`#/${c.slug}`} className="pv-chip">
            {c.name}
          </a>
        ))}
      </nav>
    </>
  );
}

type Tab = "builder" | Setup;

export function GetStartedPage(appearance: Appearance) {
  const [tab, setTab] = useState<Tab>("builder");
  const [tool, setTool] = useState<Tool>("lovable");
  return (
    <article className="pv-page pv-page--compact">
      <header className="pv-hero">
        <div className="pv-hero__main">
          <h1 className="ayy-display">ayywi</h1>
          <p className="pv-tagline">Make your app look designed, in one paste</p>
          <p className="ayy-lede">
            Pick what you're building, copy one prompt into Lovable, Bolt, v0, Cursor or ChatGPT, and get screens that match: the same
            buttons, spacing and colours everywhere, with dark mode and phones handled.
          </p>
        </div>
        <TryIt {...appearance} />
      </header>

      <Examples tool={tool} />

      <div className="pv-doors">
        <SegmentedControl aria-label="How you build" value={tab} onValueChange={(v) => setTab(v as Tab)}>
          <SegmentedControlItem value="builder">{BUILDER_INTRO.label}</SegmentedControlItem>
          <SegmentedControlItem value="files">{SETUPS.files.label}</SegmentedControlItem>
          <SegmentedControlItem value="package">{SETUPS.package.label}</SegmentedControlItem>
          <SegmentedControlItem value="chat">{SETUPS.chat.label}</SegmentedControlItem>
        </SegmentedControl>
      </div>

      <TabSummary intro={tab === "builder" ? BUILDER_INTRO : SETUPS[tab]} />

      {tab === "builder" ? <BuilderGuide tool={tool} onToolChange={setTool} /> : <DeveloperGuide setup={tab} />}

      <div>
        <a href="#/showcase" className={buttonClass({ variant: "outline" })}>
          What you can build
          <Icon icon={ArrowRight01Icon} directional />
        </a>
      </div>
    </article>
  );
}
