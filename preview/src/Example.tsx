import type { MouseEvent } from "react";
import { Popover, PopoverContent, PopoverTrigger, Tabs, TabsContent, TabsList, TabsTrigger } from "@danitesler/ayywi/react";
import { CodeBlock } from "./CodeBlock";
import { components, type ComponentEntry, type ExampleEntry } from "./data";
import { componentPrompt } from "./prompts";
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

export function Example({
  example,
  component,
  renderer,
}: {
  example: ExampleEntry;
  component?: ComponentEntry;
  renderer: Renderer;
}) {
  const { Component } = example;
  const showHtml = renderer === "html" || !Component;
  const comp = component ?? components.find((c) => c.examples.some((e) => e.id === example.id));
  const prompt = comp ? componentPrompt(comp, example, renderer) : "";

  return (
    <section className="pv-example" aria-labelledby={`ex-${example.id}`}>
      <div className="pv-example__header">
        <h3 className="pv-example__title" id={`ex-${example.id}`}>
          {example.title}
        </h3>
        <Popover>
          <PopoverTrigger variant="outline" size="sm">
            Copy for...
          </PopoverTrigger>
          <PopoverContent side="bottom" align="end" aria-label={`Copy for ${example.title}`} className="pv-code-popover">
            <Tabs defaultValue="prompt">
              <TabsList aria-label={`Copy options for ${example.title}`}>
                <TabsTrigger value="prompt">AI prompt</TabsTrigger>
                <TabsTrigger value="react">React</TabsTrigger>
                <TabsTrigger value="html">HTML</TabsTrigger>
              </TabsList>
              {prompt ? (
                <TabsContent value="prompt">
                  <CodeBlock code={prompt} label="prompt" copyLabel="Copy prompt" wrap />
                </TabsContent>
              ) : null}
              <TabsContent value="react">
                <CodeBlock code={example.reactSource} label="tsx" />
              </TabsContent>
              <TabsContent value="html">
                <CodeBlock code={example.htmlSource} label="html" />
              </TabsContent>
            </Tabs>
          </PopoverContent>
        </Popover>
      </div>
      {/* ayywi-lint-disable-next-line -- not an action: it catches in-page links inside the example (see onStageClick) */}
      <div className="pv-stage" data-renderer={showHtml ? "html" : "react"} onClick={onStageClick}>
        {showHtml ? (
          <HtmlStage key={example.id} html={example.htmlSource} />
        ) : (
          <div className="pv-stage__inner">{Component ? <Component /> : null}</div>
        )}
      </div>
    </section>
  );
}
