import { useState } from "react";
import {
  buttonClass,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@danitesler/ayywi/react";
import { CodeBlock, CopyButton } from "../CodeBlock";
import { buildPrompt, links, QUICK_START, SETUPS, type Setup } from "../prompts";
import agentsSnippet from "../../../ai/AGENTS.snippet.md?raw";

const ROUTE = "get-started";

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

export function GetStartedPage() {
  return (
    <article className="pv-page pv-page--compact">
      <header className="pv-page__header pv-page__header--center">
        <h1 className="ayy-h2">Get started</h1>
        <p className="ayy-lede">Paste one prompt; your AI asks the rest. Dark mode and phones included.</p>
      </header>

      <QuickStart />

      <DeveloperGuide />

      <ManualGuide />

      <CliGuide />
    </article>
  );
}
