import type { MouseEvent } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@danitesler/ayywi/react";
import { CodeBlock } from "./CodeBlock";
import type { ExampleEntry } from "./data";
import type { Renderer } from "./settings";

function HtmlStage({ html }: { html: string }) {
  // <ayy-*> elements upgrade themselves on insertion, exactly like a server-rendered page.
  return <div className="pv-stage__inner" dangerouslySetInnerHTML={{ __html: html }} />;
}

/** In-page anchors in examples (contents links, "#work") scroll to their target instead of changing the preview's route. */
function onStageClick(event: MouseEvent<HTMLDivElement>) {
  const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
  if (!link || link.getAttribute("href")?.startsWith("#/")) return;
  event.preventDefault();
  const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
  const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
}

export function Example({ example, renderer }: { example: ExampleEntry; renderer: Renderer }) {
  const { Component } = example;
  const showHtml = renderer === "html" || !Component;
  return (
    <section className="pv-example" aria-labelledby={`ex-${example.id}`}>
      <h3 className="pv-example__title" id={`ex-${example.id}`}>
        {example.title}
      </h3>
      <div className="pv-stage" data-renderer={showHtml ? "html" : "react"} onClick={onStageClick}>
        {showHtml ? (
          <HtmlStage key={example.id} html={example.htmlSource} />
        ) : (
          <div className="pv-stage__inner">{Component ? <Component /> : null}</div>
        )}
      </div>
      <details className="pv-source">
        <summary className="pv-source__toggle">Code</summary>
        <Tabs key={renderer} defaultValue={renderer}>
          <TabsList aria-label={`${example.title} code`}>
            <TabsTrigger value="react">React</TabsTrigger>
            <TabsTrigger value="html">HTML · Vue · Svelte · any</TabsTrigger>
          </TabsList>
          <TabsContent value="react">
            <CodeBlock code={example.reactSource} label="tsx" />
          </TabsContent>
          <TabsContent value="html">
            <CodeBlock code={example.htmlSource} label="html" />
          </TabsContent>
        </Tabs>
      </details>
    </section>
  );
}
