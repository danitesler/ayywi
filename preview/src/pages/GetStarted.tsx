import { useState } from "react";
import { ChatGptIcon, ClaudeIcon } from "@hugeicons/core-free-icons";
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
  Chip,
  ChipGroup,
  Combobox,
  Icon,
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
import { buildPrompt, headTags, links, request, STARTERS, TOOLS, type Links, type StarterId, type Tool } from "../prompts";
import { showcaseApps } from "../showcase/apps";
import { themeOptions } from "../themes";
import agentsSnippet from "../../../ai/AGENTS.snippet.md?raw";

const ROUTE = "";

type Setup = "package" | "files";

/** For a codebase: the agent sets ayywi up. Chat and AI builders are covered by the tool picker above. */
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
2. Before writing any UI, read ${l.docs}llms-full.txt: the rules, the tokens, and every component with copy-ready HTML and React (or ${l.docs}llms.txt and one page per component, ${l.docs}llms/<component>.md). Use only its classes (ayy-*), tokens (--ayy-*) and <ayy-*> elements. No hardcoded colours, no made-up classes, no left/right CSS.
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
      {example ? (
        <p className="pv-note">
          Something like it:{" "}
          <a className="ayy-link" href={`#/apps/${example.id}`}>
            {example.name}, {example.kind.toLowerCase()}
          </a>
          .
        </p>
      ) : null}

      <div className="ayy-cluster">
        <span className="ayy-label" id="pv-tool-label">
          Pick your AI tool:
        </span>
        <ChipGroup role="radiogroup" aria-labelledby="pv-tool-label">
          {TOOL_LOGOS.map((t) => (
            <Chip key={t.id} type="radio" name="pv-tool" value={t.id} checked={tool === t.id} onCheckedChange={(on) => on && onToolChange(t.id)}>
              {t.svg}
              {t.name}
            </Chip>
          ))}
        </ChipGroup>
      </div>

      <p className="pv-note pv-tool-note">
        {TOOLS[tool].where}
      </p>

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
  const [tool, setTool] = useState<Tool>("lovable");
  return (
    <article className="pv-page pv-page--compact">
      <header className="pv-hero">
        <div className="pv-hero__main">
          <h1 className="ayy-display">ayywi</h1>
          <p className="pv-tagline">Make your app look designed, in one paste</p>
          <p className="ayy-lede">Describe your app, pick your AI tool, paste one prompt. Dark mode and phones included.</p>
        </div>
        <TryIt {...appearance} />
      </header>

      <Examples tool={tool} />

      <BuilderGuide tool={tool} onToolChange={setTool} />

      <DeveloperGuide />
    </article>
  );
}
