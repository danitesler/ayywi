import { useState } from "react";
import { ArrowRight01Icon, Calendar03Icon, ChartLineData01Icon, DashboardSquare01Icon, Message01Icon, Settings01Icon, ShoppingBag01Icon } from "@hugeicons/core-free-icons";
import { themes, tokens, type DensityMode, type ThemeMode } from "ayywi";
import {
  Accordion,
  AccordionItem,
  Avatar,
  Badge,
  Button,
  buttonClass,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Carousel,
  CarouselSlide,
  Chat,
  ChatMessage,
  ChatTyping,
  Frame,
  Icon,
  IconTile,
  List,
  ListContent,
  ListDescription,
  ListItem,
  ListTitle,
  SegmentedControl,
  SegmentedControlItem,
} from "ayywi/react";
import { CodeBlock, CopyButton } from "../CodeBlock";
import { components } from "../data";
import { buildPrompt, FIXES, fixPrompt, request, site, STARTERS, TOOLS, type StarterId, type Tool } from "../prompts";
import { showcaseApps } from "../showcase/apps";
import { themeOptions } from "../themes";
import { ScaledFrame } from "./Showcase";
import agentsSnippet from "../../../ai/AGENTS.snippet.md?raw";
import llmsIndex from "../../../llms.txt?raw";

const ROUTE = "";

type Setup = "files" | "package" | "chat";

const SETUPS: Record<Setup, { label: string; note: string; prompt: (base: string) => string }> = {
  files: {
    label: "Link files",
    note: "No install. The agent downloads the stylesheet and the script from this site and reads the rules from here too. Works in any project, with or without a build step.",
    prompt: (base) => `Set up the ayywi design system in this project and build a first screen with it. Don't install any packages.

1. Download these two files into the project (for example public/vendor/ayywi/) and load them once from the app's HTML entry: the stylesheet in <head>, the script with defer. With a bundler you can import the CSS instead.
   ${base}dist/ayywi.min.css
   ${base}dist/elements.global.js
2. Before writing any UI, read ${base}llms-full.txt: the rules, the tokens, and every component with copy-ready HTML and React. Use only its classes (ayy-*), tokens (--ayy-*) and <ayy-*> elements. No hardcoded colours, no made-up classes, no left/right CSS.
3. Save the rules at ${base}ai/AGENTS.snippet.md into AGENTS.md (or CLAUDE.md, or .cursorrules) so later sessions follow them too.
4. Build a first screen that fits this project. An app: the App shell (a sidebar on wide screens, a top bar and a Bottom nav on phones) with a Page header. A website: a Navbar, Sections and a Footer. Include its empty, loading and error states.
5. Tell me which files you changed and how to open the screen.`,
  },
  package: {
    label: "Install",
    note: "Adds a skill, a rule file, an AGENTS.md section and an MCP server, so the agent looks components up instead of guessing, and it can run the linter.",
    prompt: () => `Set up the ayywi design system in this project and build a first screen with it.

1. Install it with npm i github:danitesler/ayywi (it becomes npm i ayywi once it's on npm), then run npx ayywi init. That adds the ayywi skill, a rule file, an AGENTS.md section and an MCP server with get_component, search and lint tools.
2. Load it once at the app entry. React: import "ayywi/css" and use components from "ayywi/react". Vue, Svelte, Angular or plain HTML: import "ayywi/css" and "ayywi/elements" and write the same markup.
3. Follow the ayywi rules: components and tokens only. No hardcoded colours, no made-up classes, no left/right CSS.
4. Build a first screen that fits this project. An app: the App shell (a sidebar on wide screens, a top bar and a Bottom nav on phones) with a Page header. A website: a Navbar, Sections and a Footer. Include its empty, loading and error states.
5. Run npx ayywi lint and fix everything it reports. Then tell me which files you changed and how to open the screen.`,
  },
  chat: {
    label: "Chat only",
    note: "For Claude, ChatGPT or Gemini in the browser: you get one HTML file that loads ayywi from this site. Good for a prototype or a quick mock.",
    prompt: (base) => `You're helping me build UI with the ayywi design system. Read ${base}llms.txt, then the parts of ${base}llms-full.txt you need. If you can't open links, ask me to paste the component sections.

Answer with one self-contained HTML file that loads
  <link rel="stylesheet" href="${base}dist/ayywi.min.css">
  <script src="${base}dist/elements.global.js" defer></script>
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
  text: "start begin home overview setup install copy paste prompt no code vibe lovable bolt v0 replit cursor claude chatgpt no install cdn files link ai agent mcp llms use cases fix lint review before after",
};

export interface Appearance {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  density: DensityMode;
  setDensity: (density: DensityMode) => void;
}

const STARTER_ICONS: Record<StarterId, typeof DashboardSquare01Icon> = {
  dashboard: ChartLineData01Icon,
  landing: DashboardSquare01Icon,
  booking: Calendar03Icon,
  internal: Message01Icon,
  store: ShoppingBag01Icon,
  settings: Settings01Icon,
};

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

/** The five showcase apps, each with the prompt that builds it in the chosen tool. */
function Examples({ tool }: { tool: Tool }) {
  return (
    <Carousel label="Example apps" slideWidth="min(20rem, 85%)" className="pv-examples">
      {showcaseApps.map((app) => (
        <CarouselSlide key={app.id}>
          <Card className="pv-example-card">
            <div className="pv-showcase__thumb" inert>
              <ScaledFrame app={app} width={1280} height={800} lazy title={`${app.name}, ${app.kind}`} />
            </div>
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

/** An input inside the sentence, as wide as what's typed in it. */
function Slot({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return <input className="ayy-input pv-slot" aria-label={label} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />;
}

/** Where the prompt goes, drawn with ayywi: the tool's window with the request pasted in. */
function PasteDemo({ tool, text }: { tool: Tool; text: string }) {
  const host = { lovable: "lovable.dev", bolt: "bolt.new", v0: "v0.app", replit: "replit.com", cursor: "Cursor · Agent", "claude-code": "Terminal · claude", chat: "chatgpt.com · claude.ai" }[tool];
  return (
    <Frame title={host} className="pv-paste" aria-label={`The prompt pasted into ${TOOLS[tool].label}`}>
      <Chat aria-label="Example conversation">
        <ChatMessage direction="out">{text}</ChatMessage>
        <ChatMessage avatar={<Avatar name="AI" size="sm" fallback="AI" />}>On it. Loading ayywi and building the first screens with its components.</ChatMessage>
        <ChatTyping avatar={<Avatar name="AI" size="sm" fallback="AI" />} label="Building" />
      </Chat>
    </Frame>
  );
}

const MEMBERS = [
  { name: "Maya Chen", email: "maya@studio.co", role: "Owner" },
  { name: "Ravi Shah", email: "ravi@studio.co", role: "Editor" },
  { name: "Eli Stone", email: "eli@studio.co", role: "Viewer" },
];

/** The same screen as an AI tool writes it with no system, and with ayywi. */
function BeforeAfter() {
  return (
    <div className="pv-compare">
      <figure className="pv-compare__side">
        <figcaption className="pv-compare__label">Without a design system</figcaption>
        <div className="pv-before" aria-hidden="true">
          <div className="pv-before__head">
            <span className="pv-before__title">TEAM MEMBERS</span>
            <span className="pv-before__btn pv-before__btn--a">+ Invite</span>
          </div>
          {MEMBERS.map((m, i) => (
            <div key={m.name} className={`pv-before__row pv-before__row--${i}`}>
              <span>{m.name}</span>
              <span className={`pv-before__tag pv-before__tag--${i}`}>{m.role}</span>
            </div>
          ))}
          <div className="pv-before__foot">
            <span className="pv-before__btn pv-before__btn--b">Save changes</span>
            <span className="pv-before__btn pv-before__btn--c">cancel</span>
          </div>
        </div>
      </figure>
      <figure className="pv-compare__side">
        <figcaption className="pv-compare__label">With ayywi</figcaption>
        <Card>
          <CardHeader>
            <div className="ayy-spread">
              <CardTitle>Team members</CardTitle>
              <Button size="sm" variant="outline">
                Invite
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <List divided aria-label="Team members">
              {MEMBERS.map((m) => (
                <ListItem key={m.name}>
                  <Avatar name={m.name} size="sm" />
                  <ListContent>
                    <ListTitle>{m.name}</ListTitle>
                    <ListDescription>{m.email}</ListDescription>
                  </ListContent>
                  <Badge variant={m.role === "Owner" ? "default" : "muted"}>{m.role}</Badge>
                </ListItem>
              ))}
            </List>
          </CardContent>
          <CardFooter>
            <Button size="sm">Save changes</Button>
            <Button size="sm" variant="ghost">
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </figure>
    </div>
  );
}

/** For people who build with Lovable, Bolt, v0, Cursor or a chat: three steps, no jargon. */
function BuilderGuide({ tool, setTool }: { tool: Tool; setTool: (t: Tool) => void }) {
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

  return (
    <>
      <h2 className="pv-h pv-h--section" id="what">
        <span className="pv-step">1</span> What are you building?
      </h2>
      <div className="pv-picks" role="radiogroup" aria-label="What are you building?">
        {STARTERS.map((s) => (
          <label key={s.id} className={`ayy-card pv-pick${s.id === starter ? " ayy-card--featured" : ""}`}>
            <input type="radio" name="pv-starter" className="ayy-sr-only" checked={s.id === starter} onChange={() => pick(s.id)} />
            <IconTile size="sm">
              <Icon icon={STARTER_ICONS[s.id]} />
            </IconTile>
            <span className="pv-pick__label">{s.label}</span>
            <span className="pv-pick__hint">{s.hint}</span>
          </label>
        ))}
      </div>
      <p className="pv-note">Now make it yours. Change the highlighted words:</p>
      <p className="pv-madlib">
        Build me a <Slot label="What you're building" value={what} onChange={setWhat} placeholder="booking app" /> for{" "}
        <Slot label="Who it's for" value={who} onChange={setWho} placeholder="a yoga studio" />. It needs:
        <textarea
          className="ayy-textarea pv-slot pv-slot--long"
          aria-label="What it needs"
          rows={1}
          value={needs}
          placeholder="a schedule and a sign-up form"
          onChange={(e) => setNeeds(e.target.value)}
        />
      </p>
      {example ? (
        <p className="pv-note">
          Something like it:{" "}
          <a className="ayy-link" href={`#/showcase/${example.id}`}>
            {example.name}, {example.kind.toLowerCase()}
          </a>
          .
        </p>
      ) : null}

      <h2 className="pv-h pv-h--section" id="tool">
        <span className="pv-step">2</span> Copy it into your tool
      </h2>
      <SegmentedControl aria-label="Your tool" value={tool} onValueChange={(v) => setTool(v as Tool)}>
        {(Object.keys(TOOLS) as Tool[]).map((key) => (
          <SegmentedControlItem key={key} value={key}>
            {TOOLS[key].label}
          </SegmentedControlItem>
        ))}
      </SegmentedControl>
      <div className="ayy-split pv-copy">
        <div className="ayy-stack">
          <p className="pv-copy__where">{TOOLS[tool].where}</p>
          <div className="ayy-cluster">
            <CopyButton text={prompt} label="Copy prompt" variant="primary" size="md" />
            <span className="ayy-muted pv-note">Using something else? Pick the closest tool; the prompt works anywhere.</span>
          </div>
          <details className="pv-included">
            <summary>What's in the prompt</summary>
            <p className="pv-note">
              Your sentence, then instructions for the AI: how to load ayywi in {TOOLS[tool].label}, the rules (one main button, phones
              handled, empty and error states), and every ayywi class name. You don't need to read or change this part.
            </p>
            <CodeBlock code={prompt} label="prompt" wrap />
          </details>
        </div>
        <PasteDemo tool={tool} text={ask} />
      </div>

      <h2 className="pv-h pv-h--section" id="fix">
        <span className="pv-step">3</span> Fix anything that looks off
      </h2>
      <p className="pv-note">Paste one of these into the same chat whenever something doesn't look right.</p>
      <div className="pv-fixes">
        {FIXES.map((f) => (
          <Card key={f.title} className="pv-fix">
            <CardHeader>
              <CardTitle>“{f.title}”</CardTitle>
            </CardHeader>
            <CardFooter>
              <CopyButton text={fixPrompt(f.prompt)} label="Copy" variant="outline" />
            </CardFooter>
          </Card>
        ))}
      </div>

      <h2 className="pv-h pv-h--section" id="why">
        Why it looks better
      </h2>
      <p className="pv-note">
        The same screen, asked for in the same words. Without a system the AI invents a new style every time; with ayywi it reuses the same
        buttons, spacing and colours on every screen.
      </p>
      <BeforeAfter />
    </>
  );
}

/** The guide for developers: install paths, use-case prompts, checks and the raw files. */
function DeveloperGuide() {
  const [setup, setSetup] = useState<Setup>("files");
  const base = site();
  const chosen = SETUPS[setup];
  const stable = components.filter((c) => c.status === "stable").length;
  const facts = [`${components.length} components (${stable} stable)`, `${Object.keys(tokens).length} tokens`, `${themes.length} themes`, "any framework", "0 runtime dependencies"];
  return (
    <>
      <p className="pv-facts">{facts.join(" · ")}</p>
      <h2 className="pv-h pv-h--section" id="setup">
        <span className="pv-step">1</span> Pick how ayywi gets into your project
      </h2>
      <SegmentedControl aria-label="Setup" value={setup} onValueChange={(v) => setSetup(v as Setup)}>
        {(Object.keys(SETUPS) as Setup[]).map((key) => (
          <SegmentedControlItem key={key} value={key}>
            {SETUPS[key].label}
          </SegmentedControlItem>
        ))}
      </SegmentedControl>
      <p className="pv-note">{chosen.note}</p>
      <CodeBlock code={chosen.prompt(base)} label="prompt" wrap />

      <h2 className="pv-h pv-h--section" id="build">
        <span className="pv-step">2</span> Ask for a screen
      </h2>
      <p className="pv-note">
        After setup the agent knows the rules, so plain words work. These prompts name the components, so nothing is left to guess; the
        first five are the screens in What you can build.
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
        <span className="pv-step">3</span> Check what it built
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
        Everything the prompts point at is on this site, so you can paste it into any tool. Each component page has a Copy for AI button
        with its classes, props, rules and examples. With the package installed, <code>npx ayywi mcp</code> serves the same over MCP and{" "}
        <code>npx ayywi lint</code> checks the result.
      </p>
      <div className="pv-files">
        <CopyButton text={agentsSnippet} label="Copy the rules for AGENTS.md" variant="outline" />
        <CopyButton text={llmsIndex} label="Copy llms.txt (index)" variant="outline" />
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

type Door = "builder" | "developer";

export function GetStartedPage(appearance: Appearance) {
  const [door, setDoor] = useState<Door>("builder");
  const [tool, setTool] = useState<Tool>("lovable");
  return (
    <article className="pv-page pv-page--compact">
      <header className="pv-hero">
        <div className="pv-hero__main">
          <p className="ayy-eyebrow">ayywi · a design system for AI-built apps</p>
          <h1 className="ayy-h1">Make your app look designed, in one paste</h1>
          <p className="ayy-lede">
            Pick what you're building, copy one prompt into Lovable, Bolt, v0, Cursor or ChatGPT, and get screens that match: the same
            buttons, spacing and colours everywhere, with dark mode and phones handled.
          </p>
        </div>
        <TryIt {...appearance} />
      </header>

      <Examples tool={tool} />

      <div className="pv-doors">
        <SegmentedControl aria-label="How you build" value={door} onValueChange={(v) => setDoor(v as Door)}>
          <SegmentedControlItem value="builder">I build with AI tools</SegmentedControlItem>
          <SegmentedControlItem value="developer">I'm a developer</SegmentedControlItem>
        </SegmentedControl>
        <span className="ayy-muted pv-note">
          {door === "builder" ? "No code needed. Three steps." : "Install paths, prompts for coding agents, MCP, lint and the raw files."}
        </span>
      </div>

      {door === "builder" ? <BuilderGuide tool={tool} setTool={setTool} /> : <DeveloperGuide />}

      <div>
        <a href="#/showcase" className={buttonClass({ variant: "outline" })}>
          What you can build
          <Icon icon={ArrowRight01Icon} directional />
        </a>
      </div>
    </article>
  );
}
