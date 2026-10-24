import { useState } from "react";
import type { DensityMode, ThemeMode } from "@danitesler/ayywi";
import {
  buttonClass,
  Card,
  CardFooter,
  CardHeader,
  CardMedia,
  CardTitle,
  Carousel,
  CarouselSlide,
  Combobox,
  SegmentedControl,
  SegmentedControlItem,
  Select,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@danitesler/ayywi/react";
import { CodeBlock, CopyButton } from "../CodeBlock";
import { buildPrompt, headTags, links, request, STARTERS, type Links, type StarterId } from "../prompts";
import { showcaseApps } from "../showcase/apps";
import { themeOptions } from "../themes";
import agentsSnippet from "../../../ai/AGENTS.snippet.md?raw";

const ROUTE = "";

type Setup = "package" | "files";

/** For a codebase: the agent sets ayywi up. Chat and AI builders are covered by the prompt above. */
const SETUPS: Record<Setup, { label: string; prompt: (l: Links) => string }> = {
  package: {
    label: "npm package",
    prompt: () => `Set up the ayywi design system in this project and build a first screen with it.

1. Run npx -y @danitesler/ayywi init. That configures the ayywi agent skill, Cursor rules, AGENTS.md instructions, and the MCP server (with get_component, search, get_tokens, get_rules, create_brand and lint tools).
2. Load ayywi once at the app entry: import "@danitesler/ayywi/css" (React: use "@danitesler/ayywi/react"; other frameworks: import "@danitesler/ayywi/elements" and use <ayy-*> elements).
3. Follow the ayywi rules: components and tokens only. No hardcoded colours, no made-up classes, no left/right CSS.
4. Build a first screen that fits this project: an app uses the App shell (sidebar on wide screens, top bar + bottom nav on phones); a website uses Navbar, .ayy-container content and Footer. Include empty, loading and error states.
5. Run npx @danitesler/ayywi lint and fix everything it reports. Then tell me which files you changed and how to open the screen.`,
  },
  files: {
    label: "No build (CDN)",
    prompt: (l) => `Set up the ayywi design system in this project and build a first screen with it. Don't install any packages.

1. Load these once from the app's HTML entry, in <head>. They're pinned to one release, so a later one can't change your app; to own them, download them into the project (for example public/vendor/ayywi/, with the fonts/ folder next to fonts.css). With a bundler you can import the CSS instead.
${headTags(l, "   ")}
2. Before writing any UI, read ${l.docs}llms-full.txt: the rules, the patterns, the tokens and every component's API. For copy-ready HTML and React, read the page of each component you use: ${l.docs}llms/<component>.md (all listed in ${l.docs}llms.txt). Use only its classes (ayy-*), tokens (--ayy-*) and <ayy-*> elements. No hardcoded colours, no made-up classes, no left/right CSS.
3. Save the rules at ${l.docs}ai/AGENTS.snippet.md into AGENTS.md (or CLAUDE.md, or .cursorrules) so later sessions follow them too.
4. Build a first screen that fits this project. An app: the App shell (a sidebar on wide screens, a top bar and a Bottom nav on phones) with a Page header. A website: a Navbar, content at .ayy-container width and a Footer. Include its empty, loading and error states.
5. Tell me which files you changed and how to open the screen.`,
  },
};

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

/** The showcase apps, each with the prompt that builds it. */
function Examples() {
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
              <CopyButton text={buildPrompt(app.prompt)} label="Copy prompt to build this" variant="outline" />
              <a className={buttonClass({ variant: "ghost", size: "sm" })} href={`#/apps/${app.id}`}>
                See it
              </a>
            </CardFooter>
          </Card>
        </CarouselSlide>
      ))}
    </Carousel>
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

/** For people who build with Lovable, Bolt, v0, Replit or a chat: copy one prompt, no code. */
function BuilderGuide() {
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
  const prompt = buildPrompt(ask);
  const article = /^[aeiou]/i.test(what.trim()) ? "an" : "a";

  return (
    <>
      <div className="pv-madlib">
        Build me {article}{" "}
        <Select aria-label="What you're building" value={starter} onChange={(e) => pick(e.target.value as StarterId)}>
          {STARTERS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.what}
            </option>
          ))}
        </Select>{" "}
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
        <Textarea
          autosize
          className="pv-slot pv-slot--long"
          aria-label="What it needs"
          rows={1}
          value={needs}
          placeholder="a schedule and a sign-up form"
          onChange={(e) => setNeeds(e.target.value)}
        />
      </div>

      <CodeBlock code={prompt} label="prompt" copyLabel="Copy prompt" wrap />
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
      <header className="pv-hero">
        <div className="pv-hero__main">
          <h1 className="ayy-display">ayywi</h1>
          <p className="pv-tagline">Make your app look designed, in one paste</p>
          <p className="ayy-lede">Describe your app and paste one prompt. Dark mode and phones included.</p>
        </div>
        <TryIt {...appearance} />
      </header>

      <Examples />

      <BuilderGuide />

      <DeveloperGuide />
    </article>
  );
}
