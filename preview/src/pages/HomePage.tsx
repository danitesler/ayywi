import { themes, tokens } from "ayywi";
import { Badge, Card, CardDescription, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger } from "ayywi/react";
import { CodeBlock } from "../CodeBlock";
import { componentGroups, components } from "../data";

const QUICKSTART = {
  html: `<!-- No build step. Swap @latest for a pinned version in production. -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ayywi@latest/dist/ayywi.min.css">
<script src="https://cdn.jsdelivr.net/npm/ayywi@latest/dist/elements.global.js" defer></script>

<button class="ayy-button">Save</button>
<button class="ayy-button ayy-button--outline ayy-button--sm" onclick="ayywi.toast('Saved')">Toast</button>

<!-- Interactive parts are custom elements: tabs, dialog, popover, menu, tooltip -->
<ayy-tooltip class="ayy-tooltip">
  <button class="ayy-button ayy-button--ghost">?</button>
  <span class="ayy-tooltip__content" role="tooltip">Keyboard and Esc just work</span>
</ayy-tooltip>`,
  react: `// npm i ayywi
import "ayywi/css";
import { Button, Badge } from "ayywi/react";

export function Toolbar() {
  return (
    <>
      <Badge variant="success" dot>Synced</Badge>
      <Button variant="outline" size="sm">Sync now</Button>
    </>
  );
}`,
  vue: `<script setup lang="ts">
import "ayywi/css";
import "ayywi/elements"; // <ayy-*> elements; set compilerOptions.isCustomElement: t => t.startsWith("ayy-")
import { buttonClass } from "ayywi";
</script>

<template>
  <button :class="buttonClass({ variant: 'outline' })">Sync now</button>
  <span class="ayy-badge ayy-badge--success">Synced</span>
</template>`,
  svelte: `<script lang="ts">
  import "ayywi/css";
  import "ayywi/elements"; // <ayy-tabs>, <ayy-dialog>, <ayy-menu>… work as-is in Svelte
  import { buttonClass } from "ayywi";
</script>

<button class={buttonClass({ variant: "outline" })}>Sync now</button>
<span class="ayy-badge ayy-badge--success">Synced</span>`,
  tailwind: `/* Tailwind v4 */
@import "tailwindcss";
@import "ayywi/css";
@import "ayywi/tailwind.css";

/* then: class="bg-surface text-fg border border-line rounded-card shadow-lift" */`,
};

export function HomePage() {
  return (
    <article className="pv-page">
      <header className="pv-hero">
        <p className="ayy-eyebrow">Design system</p>
        <h1 className="ayy-h1">ayywi</h1>
        <p className="ayy-lede">
          Lightweight, framework-agnostic and built to be read by AI. One CSS class contract for HTML, Vue, Svelte, Angular and server
          templates, typed React components on top, and a machine-readable manifest so agents use it right the first time.
        </p>
        <div className="ayy-cluster">
          <Badge dot="static" variant="success">
            {components.length} components
          </Badge>
          <Badge>{Object.keys(tokens).length} tokens</Badge>
          <Badge>{themes.length} themes</Badge>
          <Badge>0 runtime dependencies</Badge>
          <Badge variant="ai">AI-first</Badge>
        </div>
      </header>

      <h2 className="pv-h pv-h--section">Quick start</h2>
      <Tabs defaultValue="html">
        <TabsList aria-label="Framework">
          <TabsTrigger value="html">HTML</TabsTrigger>
          <TabsTrigger value="react">React</TabsTrigger>
          <TabsTrigger value="vue">Vue</TabsTrigger>
          <TabsTrigger value="svelte">Svelte</TabsTrigger>
          <TabsTrigger value="tailwind">Tailwind</TabsTrigger>
        </TabsList>
        {Object.entries(QUICKSTART).map(([key, code]) => (
          <TabsContent key={key} value={key}>
            <CodeBlock code={code} label={key} />
          </TabsContent>
        ))}
      </Tabs>

      <h2 className="pv-h pv-h--section">Built for AI agents</h2>
      <div className="pv-grid">
        {[
          ["llms.txt / llms-full.txt", "The whole system — rules, tokens, every component with examples — in one file an LLM can read."],
          ["manifest/components.json", "The same as structured JSON: classes, variants, props, a11y, do/don't, example code."],
          ["ai/", "A Claude skill, an AGENTS.md snippet and a Cursor rule to drop into any project that uses ayywi."],
          ["npx ayywi init", "Installs the skill, AGENTS.md snippet, Cursor rule and MCP config into your project in one go."],
          ["npx ayywi mcp", "An MCP server: agents look up components, tokens and rules, and lint their own output before showing you."],
          ["npx ayywi lint", "Catches unknown classes, tokens and variants, raw colours and left/right in your app code — with suggestions."],
          ["pnpm check", "Inside ayywi, rules are enforced: no raw colours, no physical left/right, docs must match CSS, props and elements."],
        ].map(([title, text]) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle className="pv-mono-title">{title}</CardTitle>
              <CardDescription>{text}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <h2 className="pv-h pv-h--section">Components</h2>
      {componentGroups.map((g, gi) => (
        <section key={g.category} className="pv-cat" aria-labelledby={`cat-${gi}`}>
          <div className="pv-cat__head">
            <h3 className="pv-cat__title" id={`cat-${gi}`}>
              {g.category}
            </h3>
            <p className="pv-note">{g.description}</p>
          </div>
          <div className="pv-grid">
            {g.components.map((c) => {
              const accents = ["product", "ai", "system", "brand", "marketing", "research"];
              const i = components.indexOf(c);
              return (
                <a key={c.slug} href={`#/${c.slug}`} className="pv-card-link">
                  <Card interactive spotlight spotColor={`var(--ayy-accent-${accents[i % accents.length]})`}>
                    <CardHeader>
                      <CardTitle>{c.name}</CardTitle>
                      <CardDescription>{c.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </a>
              );
            })}
          </div>
        </section>
      ))}
    </article>
  );
}
