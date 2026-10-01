import { useState } from "react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { themes, tokens } from "ayywi";
import {
  Accordion,
  AccordionItem,
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  buttonClass,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
  Icon,
  Input,
  Label,
  SegmentedControl,
  SegmentedControlItem,
  Switch,
} from "ayywi/react";
import { CodeBlock, CopyButton } from "../CodeBlock";
import { components } from "../data";
import { showcaseApps } from "../showcase/apps";
import agentsSnippet from "../../../ai/AGENTS.snippet.md?raw";
import llmsIndex from "../../../llms.txt?raw";

const ROUTE = "";

/** Where this site lives, so prompts can point agents at the files it hosts (see HOSTED in preview/vite.config.ts). */
const site = () => new URL(".", window.location.href).href;

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
  "Switch the theme and density from the palette menu (top of the sidebar here, or the top bar on a phone), then do the same in your app. Everything should still read well.",
  "Narrow the window below 48rem. An app should swap its sidebar for a bottom nav; a site's navbar links should fold into a menu.",
  "Tab through the page. Every button, link and field should show a focus ring.",
  "Look for one main button per view. Everything else should be quieter.",
  "Empty the list, slow the network and break the request: each of those needs its own state.",
  "Run the linter (npx ayywi lint) where the package is installed. It catches made-up classes, hardcoded colours and layouts that break in right-to-left languages.",
];

export const getStarted = {
  route: ROUTE,
  title: "Get started",
  text: "start begin home overview setup install copy paste prompt no install cdn files link ai agent claude cursor codex chatgpt mcp llms use cases lint review",
};

export function GetStartedPage() {
  const [setup, setSetup] = useState<Setup>("files");
  const base = site();
  const stable = components.filter((c) => c.status === "stable").length;
  const facts = [
    `${components.length} components (${stable} stable)`,
    `${Object.keys(tokens).length} tokens`,
    `${themes.length} themes`,
    "any framework",
    "0 runtime dependencies",
  ];
  const chosen = SETUPS[setup];

  return (
    <article className="pv-page pv-page--compact">
      <header className="pv-hero">
        <div className="pv-hero__main">
          <p className="ayy-eyebrow">AI-first design system</p>
          <h1 className="ayy-h1">Paste a prompt, get a UI that fits together</h1>
          <p className="ayy-lede">
            ayywi is a design system your coding agent already knows how to use. Copy one prompt into Claude Code, Cursor, Codex or a chat:
            it loads ayywi, reads the rules and builds your screen from real components, in any framework, with dark mode, phones and RTL
            handled.
          </p>
        </div>
        <p className="pv-facts">{facts.join(" · ")}</p>
      </header>

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
        After setup the agent knows the rules, so plain words work: “Add a dialog that asks before deleting a project.” These prompts name
        the components, so nothing is left to guess. The first five are the screens in What you can build.
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
        Hand the context over yourself
      </h2>
      <p className="pv-note">
        Everything the prompts point at is on this site, so you can paste it into any tool. Each component page also has a Copy for AI
        button with its classes, props, rules and examples.
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

      <h2 className="pv-h pv-h--section">See it</h2>
      <p className="pv-note">Real components. Switch the theme and density from the palette menu and they follow.</p>
      <div className="pv-demo">
        <Card>
          <CardHeader>
            <CardTitle>Invite a teammate</CardTitle>
            <CardDescription>They will get an email with a link to join.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="ayy-stack">
              <Field>
                <Label htmlFor="intro-email">Email</Label>
                <Input id="intro-email" type="email" placeholder="name@company.com" />
              </Field>
              <Field inline>
                <Switch id="intro-admin" />
                <Label htmlFor="intro-admin">Make them an admin</Label>
              </Field>
            </div>
          </CardContent>
          <CardFooter>
            <Button size="sm">Send invite</Button>
            <Button size="sm" variant="ghost">
              Cancel
            </Button>
          </CardFooter>
        </Card>
        <div className="ayy-stack">
          <Alert variant="success">
            <AlertTitle>Workspace synced</AlertTitle>
            <AlertDescription>Everything is up to date.</AlertDescription>
          </Alert>
          <SegmentedControl aria-label="Sample range" defaultValue="30d">
            <SegmentedControlItem value="7d">7 days</SegmentedControlItem>
            <SegmentedControlItem value="30d">30 days</SegmentedControlItem>
            <SegmentedControlItem value="90d">90 days</SegmentedControlItem>
          </SegmentedControl>
          <div className="ayy-cluster">
            <Badge>Default</Badge>
            <Badge variant="success" dot>
              Synced
            </Badge>
            <Badge variant="ai">AI-first</Badge>
          </div>
        </div>
      </div>
      <div>
        <a href="#/showcase" className={buttonClass({ variant: "outline" })}>
          What you can build
          <Icon icon={ArrowRight01Icon} directional />
        </a>
      </div>
    </article>
  );
}
