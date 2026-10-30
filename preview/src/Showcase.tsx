import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  ComputerIcon,
  SmartPhone01Icon,
  Tablet01Icon,
  SlidersHorizontalIcon,
} from "@hugeicons/core-free-icons";
import {
  Icon,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SegmentedControl,
  SegmentedControlItem,
  Showcase as AyyShowcase,
  ShowcaseActions,
  ShowcaseBody,
  ShowcaseHeader,
  ShowcaseStage,
  ShowcaseTitle,
  ShowcaseViewport,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
} from "@danitesler/ayywi/react";
import { CodeBlock } from "./CodeBlock";
import { components, useExample, type ComponentEntry, type ExampleEntry, type LoadedExample } from "./data";
import { componentPrompt } from "./prompts";
import type { Renderer } from "./settings";

export type Device = "desktop" | "tablet" | "mobile";

const DEVICES = [
  { id: "desktop" as const, label: "Desktop", icon: ComputerIcon, iconName: "monitor" as const },
  { id: "tablet" as const, label: "Tablet", icon: Tablet01Icon, iconName: "tablet" as const },
  { id: "mobile" as const, label: "Mobile", icon: SmartPhone01Icon, iconName: "smartphone" as const },
];

function HtmlStage({ html }: { html: string }) {
  // <ayy-*> elements upgrade themselves on insertion, exactly like a server-rendered page.
  return <ShowcaseBody className="pv-stage__inner" dangerouslySetInnerHTML={{ __html: html }} />;
}

/** In-page anchors in examples (contents links, "#work") scroll to their target instead of changing the preview's route. */
function onStageClick(event: MouseEvent<HTMLElement>) {
  const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
  if (!link || link.getAttribute("href")?.startsWith("#/")) return;
  event.preventDefault();
  const doc = link.ownerDocument;
  const target = doc.getElementById(decodeURIComponent(link.hash.slice(1)));
  const smooth = !(doc.defaultView ?? window).matchMedia("(prefers-reduced-motion: reduce)").matches;
  target?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
}

function DeviceIframe({
  children,
  title,
  minHeight = 0,
}: {
  children: ReactNode;
  title?: string;
  minHeight?: number;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument;
    if (!doc) return;

    if (!doc.head || !doc.body) {
      doc.open();
      doc.write("<!DOCTYPE html><html><head></head><body style='margin:0;padding:0;'></body></html>");
      doc.close();
    }

    const syncAttrs = () => {
      const root = document.documentElement;
      const target = doc.documentElement;
      target.className = root.className;
      for (const attr of ["data-theme", "data-density", "data-ayy-icons", "data-brand", "data-ayy-custom-theme", "dir", "lang"]) {
        const val = root.getAttribute(attr);
        if (val !== null) target.setAttribute(attr, val);
        else target.removeAttribute(attr);
      }
    };
    syncAttrs();

    const syncStyles = () => {
      doc.head.innerHTML = "";
      document.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
        doc.head.appendChild(node.cloneNode(true));
      });
      const baseStyle = doc.createElement("style");
      baseStyle.textContent = `
        html, body {
          margin: 0;
          padding: 0;
          background: transparent;
          font-family: var(--ayy-font-body);
          color: var(--ayy-color-text);
          display: flow-root;
        }
      `;
      doc.head.appendChild(baseStyle);
    };
    syncStyles();

    const syncBrandStyle = () => {
      const brandStyle = document.head.querySelector<HTMLStyleElement>("style[data-ayy-brand]");
      let iframeBrandStyle = doc.head.querySelector<HTMLStyleElement>("style[data-ayy-brand]");
      if (brandStyle) {
        if (!iframeBrandStyle) {
          iframeBrandStyle = doc.createElement("style");
          iframeBrandStyle.setAttribute("data-ayy-brand", brandStyle.getAttribute("data-ayy-brand") ?? "");
          doc.head.appendChild(iframeBrandStyle);
        } else {
          iframeBrandStyle.setAttribute("data-ayy-brand", brandStyle.getAttribute("data-ayy-brand") ?? "");
        }
        iframeBrandStyle.textContent = brandStyle.textContent;
      } else if (iframeBrandStyle) {
        iframeBrandStyle.remove();
      }
    };
    const syncCustomizationStyles = () => {
      doc.head.querySelectorAll("style[data-ayy-theme-customization]").forEach((style) => style.remove());
      document.head.querySelectorAll("style[data-ayy-theme-customization]").forEach((style) => doc.head.appendChild(style.cloneNode(true)));
    };
    syncBrandStyle();
    syncCustomizationStyles();

    const observer = new MutationObserver(syncAttrs);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "data-density", "data-ayy-icons", "data-brand", "data-ayy-custom-theme", "dir", "lang"],
    });

    const brandObserver = new MutationObserver((records) => {
      syncBrandStyle();
      syncCustomizationStyles();
      // Stylesheets that load later (an icon pack the page just asked for) reach the iframe too.
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          const sheet = (node instanceof HTMLLinkElement && node.rel === "stylesheet") || (node instanceof HTMLStyleElement && node.hasAttribute("data-vite-dev-id"));
          if (sheet) doc.head.prepend(node.cloneNode(true));
        });
      }
    });
    brandObserver.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
    });

    const updateHeight = () => {
      if (doc.body) {
        const h = Math.max(doc.body.scrollHeight, doc.body.offsetHeight);
        if (h > 0) iframe.style.blockSize = `${Math.max(minHeight, h)}px`;
      }
    };

    const ro = new ResizeObserver(updateHeight);
    ro.observe(doc.body);

    setMountNode(doc.body);
    requestAnimationFrame(updateHeight);

    return () => {
      observer.disconnect();
      brandObserver.disconnect();
      ro.disconnect();
    };
  }, [minHeight]);

  return (
    <>
      <iframe
        ref={iframeRef}
        className="pv-stage__iframe"
        title={title ?? "Device preview"}
        style={{
          inlineSize: "100%",
          blockSize: minHeight ? `${minHeight}px` : undefined,
          border: "none",
        }}
      />
      {mountNode ? createPortal(children, mountNode) : null}
    </>
  );
}

const RESPONSIVE_SLUGS = new Set([
  "app-shell",
  "navbar",
  "top-bar",
  "footer",
  "page-header",
  "toc",
  "pagination",
  "breadcrumb",
  "showcase",
]);

const RESPONSIVE_EXAMPLES = new Set([
  "fab/app",
]);

const NON_RESPONSIVE_EXAMPLES = new Set([
  "fab/variants",
]);

function isExampleResponsive(slug?: string, exampleId?: string): boolean {
  if (!slug || !exampleId) return false;
  const fullId = `${slug}/${exampleId}`;
  if (NON_RESPONSIVE_EXAMPLES.has(fullId)) return false;
  if (RESPONSIVE_EXAMPLES.has(fullId)) return true;
  return RESPONSIVE_SLUGS.has(slug);
}

interface ShowcaseProps {
  example: ExampleEntry;
  component?: ComponentEntry;
  renderer: Renderer;
}

/** One example, shown once its code has loaded; until then its title over an empty stage, so the page keeps its layout. */
export function Showcase(props: ShowcaseProps) {
  const { example } = props;
  const fallback = (
    <AyyShowcase className="pv-example" aria-labelledby={`ex-${example.id}`} aria-busy="true">
      <ShowcaseHeader className="pv-example__header">
        <ShowcaseTitle className="pv-example__title" id={`ex-${example.id}`}>
          {example.title}
        </ShowcaseTitle>
      </ShowcaseHeader>
      <ShowcaseStage className="pv-stage" />
    </AyyShowcase>
  );
  const loaded = useExample(example);
  return loaded ? <LoadedShowcase {...props} loaded={loaded} /> : fallback;
}

function LoadedShowcase({ example: entry, loaded, component, renderer }: ShowcaseProps & { loaded: LoadedExample }) {
  const example = { ...entry, ...loaded };
  const { Component } = example;
  const showHtml = renderer === "html" || !Component;
  const comp = component ?? components.find((c) => c.examples.some((e) => e.id === example.id));
  const prompt = comp ? componentPrompt(comp) : "";
  const isResponsive = Boolean(comp && isExampleResponsive(comp.slug, example.id));

  const [device, setDevice] = useState<Device>(() => {
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 48rem)").matches) {
      return "mobile";
    }
    return "desktop";
  });
  const [controlsNode, setControlsNode] = useState<ReactNode | null>(null);
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSetControls = useCallback((node: ReactNode) => {
    if (clearTimerRef.current) {
      clearTimeout(clearTimerRef.current);
      clearTimerRef.current = null;
    }
    if (node === null) {
      clearTimerRef.current = setTimeout(() => {
        setControlsNode(null);
      }, 100);
    } else {
      setControlsNode(node);
    }
  }, []);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 48rem)");
    const handler = (e: MediaQueryListEvent) => {
      setDevice(e.matches ? "mobile" : "desktop");
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const activeDevice = isResponsive ? device : "desktop";

  const chooseDevice = (next: Device) => {
    setDevice(next);
  };

  const isNarrowScreen = typeof window !== "undefined" && window.matchMedia("(max-width: 48rem)").matches;
  const useIframe = renderer === "react" && isResponsive && activeDevice === "mobile" && !isNarrowScreen;

  const stageContent = showHtml ? (
    <HtmlStage key={example.id} html={example.htmlSource} />
  ) : (
    <ShowcaseBody className="pv-stage__inner">
      {Component ? (
        (() => {
          const Comp = Component as any;
          return <Comp device={activeDevice} onDeviceChange={chooseDevice} setControls={handleSetControls} />;
        })()
      ) : null}
    </ShowcaseBody>
  );

  return (
    <AyyShowcase className="pv-example" aria-labelledby={`ex-${example.id}`} device={activeDevice}>
      <ShowcaseHeader className="pv-example__header">
        <ShowcaseTitle className="pv-example__title" id={`ex-${example.id}`}>
          {example.title}
        </ShowcaseTitle>

        <ShowcaseActions className="pv-example__actions">
          {/* Device tabs (shown only if the component has responsive layouts) */}
          {isResponsive ? (
            <SegmentedControl
              size="sm"
              aria-label="Device view"
              value={device}
              onValueChange={(v) => chooseDevice(v as Device)}
            >
              {DEVICES.map((d) => (
                <Tooltip key={d.id} content={d.label}>
                  <SegmentedControlItem value={d.id} aria-label={d.label}>
                    <Icon icon={d.icon} name={d.iconName} />
                  </SegmentedControlItem>
                </Tooltip>
              ))}
            </SegmentedControl>
          ) : null}

          {/* Props popover (shown when example registers controls) */}
          {controlsNode ? (
            <Popover>
              <Tooltip content="Props">
                <PopoverTrigger variant="outline" size="icon-sm" aria-label="Props">
                  <Icon icon={SlidersHorizontalIcon} name="sliders-horizontal" />
                </PopoverTrigger>
              </Tooltip>
              <PopoverContent
                side="bottom"
                align="end"
                aria-label={`Controls for ${example.title}`}
                className="pv-props-popover"
              >
                <div className="pv-props-popover__header">
                  <span className="pv-props-popover__title">Properties</span>
                  <span className="ayy-muted ayy-mono pv-props-popover__device">
                    {activeDevice}
                  </span>
                </div>
                {controlsNode}
              </PopoverContent>
            </Popover>
          ) : null}

          {/* Copy popover */}
          <Popover>
            <PopoverTrigger variant="outline" size="sm">
              Copy for...
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              align="end"
              aria-label={`Copy for ${example.title}`}
              className="pv-code-popover"
            >
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
        </ShowcaseActions>
      </ShowcaseHeader>

      {/* ayywi-lint-disable-next-line -- not an action: it catches in-page links inside the example */}
      <ShowcaseStage
        className="pv-stage"
        data-renderer={showHtml ? "html" : "react"}
        onClick={onStageClick}
      >
        <ShowcaseViewport className="pv-stage__viewport" device={activeDevice}>
          {useIframe ? (
            <DeviceIframe
              title={`${example.title} (${activeDevice})`}
              minHeight={comp?.slug === "app-shell" ? 576 : 0}
            >
              {stageContent}
            </DeviceIframe>
          ) : (
            stageContent
          )}
        </ShowcaseViewport>
      </ShowcaseStage>
    </AyyShowcase>
  );
}

// Re-export as Example for backwards compatibility
export { Showcase as Example };
