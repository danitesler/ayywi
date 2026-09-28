import { Tabs, TabsContent, TabsList, TabsTrigger } from "ayywi/react";
import { CodeBlock } from "./CodeBlock";
import type { ExampleEntry } from "./data";
import type { Renderer } from "./settings";

function HtmlStage({ html }: { html: string }) {
  // <ayy-*> elements upgrade themselves on insertion, exactly like a server-rendered page.
  return <div className="pv-stage__inner" dangerouslySetInnerHTML={{ __html: html }} />;
}

export function Example({ example, renderer }: { example: ExampleEntry; renderer: Renderer }) {
  const { Component } = example;
  const showHtml = renderer === "html" || !Component;
  return (
    <section className="pv-example" aria-labelledby={`ex-${example.id}`}>
      <h3 className="pv-example__title" id={`ex-${example.id}`}>
        {example.title}
      </h3>
      <div className="pv-stage" data-renderer={showHtml ? "html" : "react"}>
        {showHtml ? (
          <HtmlStage key={example.id} html={example.htmlSource} />
        ) : (
          <div className="pv-stage__inner">{Component ? <Component /> : null}</div>
        )}
      </div>
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
    </section>
  );
}
