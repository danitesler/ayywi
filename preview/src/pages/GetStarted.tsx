import { themes, tokens } from "ayywi";
import { Alert, AlertDescription, AlertTitle, Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Field, Input, Label, Switch, Tabs, TabsContent, TabsList, TabsTrigger, buttonClass } from "ayywi/react";
import { CodeBlock } from "../CodeBlock";
import { components } from "../data";

const ROUTE = "";

const INSTALL = {
  npm: `npm i ayywi
npx ayywi init`,
  cdn: `<!-- No build step. Pin a version in production. -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ayywi@0.4/dist/ayywi.min.css">
<script src="https://cdn.jsdelivr.net/npm/ayywi@0.4/dist/elements.global.js" defer></script>`,
};

const SETUP_PROMPT = `Set up the ayywi design system in this project and build a first page with it.

1. Install it: run \`npm i ayywi\`, then \`npx ayywi init\`. That adds a skill, a rule file and an MCP server so you can look up components instead of guessing class names.
2. Load it once at the app entry. React: \`import "ayywi/css"\` and import components from "ayywi/react". Vue, Svelte, Angular or plain HTML: import "ayywi/css" and "ayywi/elements" and write the same markup. No build step: use the CDN links from the ayywi README.
3. Read the ayywi skill (or AGENTS.md) before writing any UI. Use ayywi components and design tokens only. No hardcoded colours, no made-up classes, no physical left/right CSS.
4. Build a first page that fits this project: a settings screen with a form (name, email), a switch for notifications, one primary save button, and a confirmation toast.
5. Run \`npx ayywi lint src\` and fix everything it reports.
6. Tell me which files you changed and how to run the app to see the page.`;

const USE_CASES = [
  {
    id: "new-app",
    title: "Start a new product",
    why: "You have an empty repo and want a consistent, accessible UI from the first commit, not a pile of one-off styles to clean up later.",
    prompt: `Install ayywi (npm i ayywi, then npx ayywi init) and use it as the only UI layer for this new app.

Build the app shell: a sidebar with Dashboard, Projects and Settings, a navbar with a theme toggle, and a dashboard page with three stat cards and a table of recent projects. Empty, loading and error states included.

Use ayywi components and tokens only. Support dark and light themes. Run npx ayywi lint src when you are done and fix what it finds.`,
  },
  {
    id: "migrate",
    title: "Clean up an existing app",
    why: "Your screens use five shades of grey, three button styles and a hand-rolled modal. You want to converge on one system without a rewrite.",
    prompt: `Install ayywi (npm i ayywi, then npx ayywi init). Then migrate src/pages/Billing.tsx to it.

Replace hand-written buttons, inputs, cards, tabs and the confirm modal with ayywi components. Replace hardcoded colours, spacing and font sizes with ayywi tokens. Keep behaviour and copy exactly as they are.

Run npx ayywi lint on the file, fix what it reports, and list anything you could not map to an ayywi component so I can decide.`,
  },
  {
    id: "prototype",
    title: "Prototype with no build step",
    why: "You need a clickable page today: an internal tool, a landing page or a demo. One HTML file, no bundler, and it still has to look finished.",
    prompt: `Build a single index.html with ayywi loaded from the CDN. No build tools.

Load https://cdn.jsdelivr.net/npm/ayywi@0.4/dist/ayywi.min.css and https://cdn.jsdelivr.net/npm/ayywi@0.4/dist/elements.global.js (defer). Use only ayywi classes and <ayy-*> elements.

The page: a waitlist landing page with a hero, three feature cards, a pricing section with the middle plan recommended, an email signup form, and a dialog that confirms the signup. Make it work in dark mode and right-to-left.`,
  },
];

const REVIEW = [
  "Switch the theme and the density at the bottom of the sidebar here, then in your app. Everything should still read well.",
  "Tab through the page. Every button, link and field should show a focus ring.",
  "Look for one main button per view. Everything else should be quieter.",
  "Run the linter. It catches made-up classes, hardcoded colours and layouts that break in right-to-left languages.",
];

export const getStarted = {
  route: ROUTE,
  title: "Get started",
  text: "start begin home overview setup install guide ai agent claude cursor mcp prompt copy use cases lint review",
};

export function GetStartedPage() {
  const stable = components.filter((c) => c.status === "stable").length;
  const facts = [
    `${components.length} components (${stable} stable)`,
    `${Object.keys(tokens).length} tokens`,
    `${themes.length} themes`,
    "0 runtime dependencies",
  ];
  return (
    <article className="pv-page pv-page--compact">
      <header className="pv-hero">
        <div className="pv-hero__main">
          <p className="ayy-eyebrow">Design system</p>
          <h1 className="ayy-h1">Get started</h1>
          <p className="ayy-lede">
            ayywi is a small design system for product UIs that look and behave the same in any framework. Paste one prompt into your AI tool and
            it installs ayywi and builds a first page for you.
          </p>
        </div>
        <div className="pv-hero__actions">
          <a href="#/button" className={buttonClass({ variant: "outline" })}>
            Browse components
          </a>
        </div>
        <p className="pv-facts">{facts.join(" · ")}</p>
      </header>

      <Tabs defaultValue="prompt">
        <TabsList aria-label="Ways to get started">
          <TabsTrigger value="prompt">
            Copy a prompt <Badge variant="ai">AI-first</Badge>
          </TabsTrigger>
          <TabsTrigger value="use-cases">Use cases</TabsTrigger>
          <TabsTrigger value="manual">Install yourself</TabsTrigger>
        </TabsList>

        <TabsContent value="prompt">
          <p className="pv-note">
            Open Claude Code, Cursor, Codex or any coding agent in your project and paste this. It installs ayywi, connects the agent to the
            component docs, builds a first page and lints its own work.
          </p>
          <CodeBlock code={SETUP_PROMPT} label="prompt" wrap />
          <p className="pv-note">
            Afterwards the agent already knows the rules. Ask for screens in plain words: “Add a dialog that asks before deleting a project.”
          </p>
        </TabsContent>

        <TabsContent value="use-cases">
          <p className="pv-note">Three reasons to try it. Each prompt is ready to paste; swap in your own file names and screens.</p>
          <div className="pv-usecases">
            {USE_CASES.map((u) => (
              <section key={u.id} className="pv-usecase" aria-labelledby={`uc-${u.id}`}>
                <h2 className="pv-usecase__title" id={`uc-${u.id}`}>
                  {u.title}
                </h2>
                <p className="pv-usecase__why">{u.why}</p>
                <CodeBlock code={u.prompt} label="prompt" wrap />
              </section>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="manual">
          <p className="pv-note">
            <strong>init</strong> sets up Claude Code, Cursor and any agent that reads AGENTS.md: a skill, a rule and an MCP server that looks up
            components for the agent. No build step? Load the two files from the CDN instead.
          </p>
          <Tabs defaultValue="npm">
            <TabsList aria-label="Install method">
              <TabsTrigger value="npm">npm</TabsTrigger>
              <TabsTrigger value="cdn">CDN</TabsTrigger>
            </TabsList>
            {Object.entries(INSTALL).map(([key, code]) => (
              <TabsContent key={key} value={key}>
                <CodeBlock code={code} label={key} />
              </TabsContent>
            ))}
          </Tabs>
          <h2 className="pv-h pv-h--section" id="check">
            Check what it built
          </h2>
          <ul className="pv-list">
            {REVIEW.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <CodeBlock code="npx ayywi lint src" label="terminal" />
        </TabsContent>
      </Tabs>

      <h2 className="pv-h pv-h--section">See it</h2>
      <p className="pv-note">Real components. Change the theme and density at the bottom of the sidebar and they follow.</p>
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
          <Tabs defaultValue="a">
            <TabsList aria-label="Sample tabs">
              <TabsTrigger value="a">Overview</TabsTrigger>
              <TabsTrigger value="b">Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="a">
              <p className="ayy-muted" style={{ margin: 0 }}>
                Arrow keys, Home and End work out of the box.
              </p>
            </TabsContent>
            <TabsContent value="b">
              <p className="ayy-muted" style={{ margin: 0 }}>
                State comes from ARIA attributes, not framework code.
              </p>
            </TabsContent>
          </Tabs>
          <div className="pv-demo__badges">
            <Badge>Default</Badge>
            <Badge variant="success" dot>
              Synced
            </Badge>
            <Badge variant="ai">AI-first</Badge>
          </div>
        </div>
      </div>
    </article>
  );
}
