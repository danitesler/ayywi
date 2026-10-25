import { useState } from "react";
import type { DensityMode, ThemeMode } from "@danitesler/ayywi";
import {
  buttonClass,
  SegmentedControl,
  SegmentedControlItem,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@danitesler/ayywi/react";
import { CodeBlock, CopyButton } from "../CodeBlock";
import { buildPrompt, headTags, links, QUICK_START, type Links } from "../prompts";
import { themeOptions } from "../themes";
import agentsSnippet from "../../../ai/AGENTS.snippet.md?raw";

const ROUTE = "get-started";

type Setup = "package" | "files";

/** For a codebase: the agent sets ayywi up. Chat and AI builders are covered by the prompt above. */
const SETUPS: Record<Setup, { label: string; prompt: (l: Links) => string }> = {
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

/** Set up by hand: each step is one short block. */
const MANUAL = {
  install: "npm install @danitesler/ayywi",
  css: `import "@danitesler/ayywi/fonts.css";
import "@danitesler/ayywi/css";`,
  component: `import { Button } from "@danitesler/ayywi/react";

export function App() {
  return <Button onClick={() => alert("Hi!")}>Hello ayywi</Button>;
}`,
  agent: "npx @danitesler/ayywi init",
};

const CLI = `npx @danitesler/ayywi lint              # check UI code against the contract
npx @danitesler/ayywi brand "#0ea5e9"   # a brand from one colour
npx @danitesler/ayywi init              # agent skill, rules, lint hook and MCP server
npx @danitesler/ayywi mcp               # the MCP server, for any MCP client
npx @danitesler/ayywi help              # every command and flag`;

export const getStarted = {
  route: ROUTE,
  title: "Get started",
  text: "start begin home overview setup install copy paste prompt no code vibe lovable bolt v0 replit cursor claude chatgpt no install cdn files link ai agent mcp llms use cases lint review quick start brand npm by hand cli",
};

export interface Appearance {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  density: DensityMode;
  setDensity: (density: DensityMode) => void;
}

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

/** For people who build with Lovable, Bolt, v0, Replit or a chat: one prompt, and the AI asks the rest. */
function QuickStart() {
  return (
    <>
      <h2 className="pv-h pv-h--section" id="quick-start">
        Quick start with AI
      </h2>
      <p className="pv-note">
        Paste this into Lovable, Bolt, v0, Replit or any AI chat. It asks what you're building, who it's for and your brand colour,
        then builds it.
      </p>
      <CodeBlock code={buildPrompt(QUICK_START)} label="prompt" copyLabel="Copy prompt" wrap />
    </>
  );
}

/** For a codebase: one setup prompt, plus the raw files for anything else. */
function DeveloperGuide() {
  const [setup, setSetup] = useState<Setup>("package");
  return (
    <>
      <h2 className="pv-h pv-h--section" id="developers">
        In your own codebase
      </h2>
      <p className="pv-note">
        Paste this into your coding agent. It sets ayywi up, saves the rules and builds a first screen.
      </p>
      <Tabs value={setup} onValueChange={(v) => setSetup(v as Setup)}>
        <TabsList aria-label="Setup">
          {(Object.keys(SETUPS) as Setup[]).map((s) => (
            <TabsTrigger key={s} value={s}>
              {SETUPS[s].label}
            </TabsTrigger>
          ))}
        </TabsList>
        {(Object.keys(SETUPS) as Setup[]).map((s) => (
          <TabsContent key={s} value={s}>
            <CodeBlock code={SETUPS[s].prompt(links())} label="prompt" copyLabel="Copy setup prompt" wrap />
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}

/** The same setup without an agent: four short steps. */
function ManualGuide() {
  return (
    <>
      <h2 className="pv-h pv-h--section" id="by-hand">
        Or set it up by hand
      </h2>
      <div className="ayy-stack">
        <p className="pv-note">1. Install the package. It has no runtime dependencies; React is optional.</p>
        <CodeBlock code={MANUAL.install} label="terminal" language="sh" />
      </div>
      <div className="ayy-stack">
        <p className="pv-note">2. Load the CSS once, at the app entry.</p>
        <CodeBlock code={MANUAL.css} label="main.tsx" language="tsx" />
      </div>
      <div className="ayy-stack">
        <p className="pv-note">
          3. Add your first component. Not using React? Import <code>@danitesler/ayywi/elements</code> and write the same markup (
          <code>class="ayy-button"</code>) in any framework or plain HTML.
        </p>
        <CodeBlock code={MANUAL.component} label="App.tsx" language="tsx" />
      </div>
      <div className="ayy-stack">
        <p className="pv-note">
          4. Set up your coding agent: the ayywi skill, rules for AGENTS.md and Cursor, a hook that lints every UI file it writes,
          and the MCP server.
        </p>
        <CodeBlock code={MANUAL.agent} label="terminal" language="sh" />
      </div>
    </>
  );
}

/** What the CLI does, and the raw files for anything else. */
function CliGuide() {
  return (
    <>
      <h2 className="pv-h pv-h--section" id="cli">
        Explore the CLI
      </h2>
      <p className="pv-note">The same commands your agent runs, plus the raw files for any other tool.</p>
      <CodeBlock code={CLI} label="terminal" language="sh" />
      <div className="pv-files">
        <CopyButton text={MCP_CONFIG} label="Copy MCP config" variant="outline" />
        <CopyButton text={agentsSnippet} label="Copy rules for AGENTS.md" variant="outline" />
        {(["llms.txt", "llms-full.txt", "dist/ayywi.min.css", "manifest/components.json"] as const).map((path) => (
          <a key={path} className={buttonClass({ variant: "ghost", size: "sm" })} href={path} target="_blank" rel="noreferrer">
            {path}
          </a>
        ))}
      </div>
    </>
  );
}

export function GetStartedPage(appearance: Appearance) {
  return (
    <article className="pv-page pv-page--compact">
      <header className="pv-page__header">
        <p className="ayy-eyebrow">Start</p>
        <h1 className="ayy-h2">Get started</h1>
        <p className="ayy-lede">Paste one prompt; your AI asks the rest. Dark mode and phones included.</p>
        <TryIt {...appearance} />
      </header>

      <QuickStart />

      <DeveloperGuide />

      <ManualGuide />

      <CliGuide />
    </article>
  );
}
