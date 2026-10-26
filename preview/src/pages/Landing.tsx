import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft01Icon, ArrowRight01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import {
  Button,
  buttonClass,
  Footer,
  FooterBottom,
  FooterBrand,
  FooterGroup,
  FooterLink,
  FooterNav,
  Icon,
  Shortcut,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@danitesler/ayywi/react";
import { themes } from "@danitesler/ayywi";
import { version } from "../../../package.json";
import { CodeBlock } from "../CodeBlock";
import { components } from "../data";
import { buildPrompt, links, QUICK_START, SETUPS } from "../prompts";
import { GITHUB } from "../routes";
import { showcaseApps } from "../showcase/apps";
import { BrandDemo } from "./BrandDemo";
import { Thumb } from "./Components";

const example = (ref: string) => {
  const [slug, id] = ref.split("/");
  return components.find((c) => c.slug === slug)?.examples.find((e) => e.id === id)?.Component ?? null;
};

/** The hero's collage: real examples, small, in the page's theme and brand. Columns read top to bottom. */
const COLLAGE: { ref: string; zoom?: number }[][] = [
  [{ ref: "card/media" }, { ref: "stat/row", zoom: 0.7 }],
  [{ ref: "chat/conversation" }, { ref: "chart/donut", zoom: 0.7 }],
  [{ ref: "settings/preferences" }, { ref: "list/inbox" }],
];

const MANUAL = `npm install @danitesler/ayywi
npx @danitesler/ayywi init
npx @danitesler/ayywi lint`;

/** The same choices as Get started, on the home page: ask the AI, or do it yourself. */
type AgentTab = "quick" | "package" | "files" | "manual";

const AGENT_TABS: { id: AgentTab; label: string }[] = [
  { id: "quick", label: "Quick start" },
  { id: "package", label: "npm package" },
  { id: "files", label: "No build" },
  { id: "manual", label: "By hand" },
];

function AgentSetup() {
  const [tab, setTab] = useState<AgentTab>("quick");
  const panels: Record<AgentTab, { code: string; label: string; wrap?: boolean; language?: string }> = {
    quick: { code: buildPrompt(QUICK_START), label: "prompt", wrap: true },
    package: { code: SETUPS.package.prompt(links()), label: "prompt", wrap: true },
    files: { code: SETUPS.files.prompt(links()), label: "prompt", wrap: true },
    manual: { code: MANUAL, label: "terminal", language: "sh" },
  };

  return (
    <div className="pv-agent-setup">
      <Tabs value={tab} onValueChange={(value) => setTab(value as AgentTab)}>
        <TabsList aria-label="Set up ayywi">
          {AGENT_TABS.map(({ id, label }) => (
            <TabsTrigger key={id} value={id}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        {AGENT_TABS.map(({ id }) => (
          <TabsContent key={id} value={id}>
            <CodeBlock
              code={panels[id].code}
              label={panels[id].label}
              language={panels[id].language}
              wrap={panels[id].wrap}
              copyLabel={panels[id].wrap ? "Copy prompt" : "Copy"}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function Feature({ title, children, href, link, visual }: { title: string; children: ReactNode; href: string; link: string; visual: ReactNode }) {
  return (
    <section className="pv-feature">
      <div className="pv-feature__text">
        <h2 className="ayy-h3">{title}</h2>
        <p className="ayy-lede">{children}</p>
        <a className={buttonClass({ variant: "link" })} href={href}>
          {link}
          <Icon icon={ArrowRight01Icon} directional />
        </a>
      </div>
      <div className="pv-feature__visual">{visual}</div>
    </section>
  );
}

/** How far the example strip travels each second, in pixels. */
const STRIP_SPEED = 36;

/**
 * Every example in one strip that scrolls itself in a loop, with previous/next buttons under it for the way back.
 * It holds two identical rows, so the loop restarts unseen. Paused while the pointer, a press or focus is on it, and
 * still for prefers-reduced-motion (the buttons then jump instead of gliding).
 */
function AppStrip() {
  const strip = useRef<HTMLDivElement>(null);
  const controls = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = strip.current;
    const buttons = controls.current;
    if (!el || !buttons) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)");
    const held = new Set<"hover" | "press" | "focus" | "step">();
    let period = 0;
    let frame = 0;
    let last = performance.now();
    let stepTimer = 0;
    // Only travel while the strip is on screen: reading the rest of the page shouldn't cost a frame callback.
    let onScreen = true;
    // The strip's own position, as a fraction. Browsers snap scrollLeft to device pixels, which would round a slow
    // 0.3px a frame up to 0.5 or down to nothing, so the speed is measured here and only the result is written.
    let position = 0;

    /** One row's width plus the gap: the distance after which the content repeats. */
    const measure = () => {
      const rows = el.querySelectorAll<HTMLElement>("[data-pv-copy]");
      period = rows.length === 2 ? Math.abs(rows[1].offsetLeft - rows[0].offsetLeft) : 0;
    };

    const tick = (now: number) => {
      // A frame lost to a background tab must not make the strip jump.
      const elapsed = Math.min(now - last, 64);
      last = now;
      if (onScreen && !still.matches && held.size === 0 && period > 0) {
        const actual = Math.abs(el.scrollLeft);
        // A scroll of our own lands within a pixel; anything further came from the user, so pick theirs up.
        if (Math.abs(actual - position) > 1) position = actual;
        position = (position + (elapsed / 1000) * STRIP_SPEED) % period;
        // scrollLeft runs negative in RTL, so the travel takes its sign from the track (and follows a direction flip).
        const sign = getComputedStyle(el).direction === "rtl" ? -1 : 1;
        el.scrollLeft = sign * position;
      }
      frame = requestAnimationFrame(tick);
    };

    const hold = (why: "hover" | "press" | "focus", on: boolean) => () => {
      if (on) held.add(why);
      else held.delete(why);
    };
    const handlers = {
      pointerenter: hold("hover", true),
      pointerleave: hold("hover", false),
      pointerdown: hold("press", true),
      pointerup: hold("press", false),
      pointercancel: hold("press", false),
      focusin: hold("focus", true),
      focusout: (event: FocusEvent) => {
        if (!el.contains(event.relatedTarget as Node | null)) held.delete("focus");
      },
    };

    /** One card back or on, wrapped around the loop. The strip waits while it glides, then picks up from there. */
    const step = (direction: 1 | -1) => {
      const card = el.querySelector<HTMLElement>(".pv-apps__shot");
      const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
      const amount = card ? card.offsetWidth + gap : el.clientWidth * 0.8;
      const sign = getComputedStyle(el).direction === "rtl" ? -1 : 1;
      const max = el.scrollWidth - el.clientWidth;
      let from = Math.abs(el.scrollLeft);
      // A step back from the start would animate a whole lap: hop to the same spot one row over first, then step.
      if (direction < 0 && from < amount && from + period <= max) {
        from += period;
        el.scrollLeft = sign * from;
      }
      const to = Math.min(max, Math.max(0, from + direction * amount));
      held.add("step");
      clearTimeout(stepTimer);
      stepTimer = window.setTimeout(() => held.delete("step"), 700);
      el.scrollTo({ left: sign * to, behavior: still.matches ? "auto" : "smooth" });
    };
    const onClick = (event: Event) => {
      const button = (event.target as Element | null)?.closest<HTMLElement>("[data-pv-step]");
      if (!button || !buttons.contains(button)) return;
      step(button.dataset.pvStep === "next" ? 1 : -1);
    };

    for (const [type, handler] of Object.entries(handlers)) el.addEventListener(type, handler as EventListener);
    buttons.addEventListener("click", onClick);
    const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver((entries) => {
            onScreen = entries.some((entry) => entry.isIntersecting);
          });
    resize?.observe(el);
    observer?.observe(el);
    measure();
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(stepTimer);
      resize?.disconnect();
      observer?.disconnect();
      buttons.removeEventListener("click", onClick);
      for (const [type, handler] of Object.entries(handlers)) el.removeEventListener(type, handler as EventListener);
    };
  }, []);

  return (
    <div className="pv-apps__scroll">
      <div className="pv-apps__viewport">
        <div
          className="pv-apps__strip"
          id="pv-apps-strip"
          ref={strip}
          role="region"
          aria-roledescription="carousel"
          aria-label="Apps built with ayywi"
          tabIndex={0}
        >
          {["shown", "repeat"].map((copy) => (
            <div key={copy} className="pv-apps__row" data-pv-copy="" aria-hidden={copy === "repeat" || undefined}>
              {showcaseApps.map((app) => (
                <a key={app.id} className="pv-apps__shot" href={`#/examples/${app.id}`} tabIndex={copy === "repeat" ? -1 : undefined}>
                  <img src={app.screenshot} alt={`${app.name}, ${app.kind}`} loading="lazy" width={1280} height={800} />
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="pv-apps__controls" ref={controls}>
        <Button variant="outline" size="icon" aria-label="Previous apps" aria-controls="pv-apps-strip" data-pv-step="prev">
          <Icon icon={ArrowLeft01Icon} directional />
        </Button>
        <Button variant="outline" size="icon" aria-label="Next apps" aria-controls="pv-apps-strip" data-pv-step="next">
          <Icon icon={ArrowRight01Icon} directional />
        </Button>
      </div>
    </div>
  );
}

/** #/: what ayywi is, shown with its own components. */
export function Landing({ onSearch }: { onSearch: () => void }) {
  return (
    <article className="pv-page pv-landing">
      <header className="pv-hero pv-hero--center">
        <h1 className="ayy-display pv-hero__mark">ayywi</h1>
        <p className="pv-tagline">Make your app look designed, in one paste</p>
        <p className="ayy-lede">
          A design system of plain CSS classes, React components and custom elements, written so AI coding tools build with it
          correctly. Dark mode, right-to-left and phones included.
        </p>
        <div className="ayy-cluster pv-hero__actions">
          <a className={buttonClass({ size: "lg" })} href="#/docs/get-started">
            Get started
          </a>
          <a className={buttonClass({ variant: "outline", size: "lg" })} href="#/components">
            Browse components
          </a>
        </div>
        <p className="pv-hero__meta ayy-muted">
          v{version} · MIT · zero runtime dependencies · React optional
        </p>
      </header>

      <div className="pv-collage" aria-hidden="true">
        {COLLAGE.map((column, i) => (
          <div key={i} className="pv-collage__column">
            {column.map((tile) => (
              <div key={tile.ref} className="pv-collage__tile">
                <Thumb Component={example(tile.ref)} zoom={tile.zoom ?? 0.8} />
              </div>
            ))}
          </div>
        ))}
      </div>

      <Feature
        title="Themes that fit your brand"
        href="#/themes"
        link="Explore themes"
        visual={<BrandDemo />}
      >
        Pick one colour and a corner style. ayywi builds the shades, readable button text and a focus ring for all {themes.length} themes, and the
        components stay the same.
      </Feature>

      <Feature
        title={`${components.length} components`}
        href="#/components"
        link="Browse components"
        visual={
          <div className="pv-feature__thumbs">
            {["button/variants", "switch/basic", "badge/variants", "progress/basic"].map((ref) => (
              <Thumb key={ref} Component={example(ref)} zoom={0.7} />
            ))}
          </div>
        }
      >
        Each one is a set of CSS classes, a React component and, where it has behaviour, a custom element, so the same markup works
        in React, any other framework or plain HTML.
      </Feature>

      <Feature title="A design system your agent can use" href="#/docs/get-started" link="Set up your agent" visual={<AgentSetup />}>
        One command installs a skill, the rules, a hook that lints every UI file the agent writes and an MCP server, so it looks
        components up instead of inventing them.
      </Feature>

      <section className="pv-apps" aria-labelledby="pv-apps-title">
        <header className="pv-apps__head">
          <h2 className="ayy-h2" id="pv-apps-title">
            Apps built with ayywi
          </h2>
          <p className="ayy-lede">
            A dashboard, an inbox, a store and more, each in its own theme and density, at desktop, tablet and phone sizes,
            with the prompt that builds it.
          </p>
          <a className={buttonClass({ variant: "link" })} href="#/examples">
            See the examples
            <Icon icon={ArrowRight01Icon} directional />
          </a>
        </header>
        <AppStrip />
      </section>

      <section className="pv-closing">
        <h2 className="ayy-h2">Start with one prompt</h2>
        <p className="ayy-lede">Paste it into your AI tool. It asks what you're building and your brand colour, then builds it with ayywi.</p>
        <div className="ayy-cluster pv-hero__actions">
          <a className={buttonClass({ size: "lg" })} href="#/docs/get-started">
            Get started
          </a>
          <button type="button" className={buttonClass({ variant: "outline", size: "lg" })} onClick={onSearch}>
            <Icon icon={Search01Icon} />
            Search the docs
            <Shortcut keys="Mod+E" />
          </button>
        </div>
      </section>
    </article>
  );
}

/** Under the full-width pages (home, examples, themes). */
export function SiteFooter() {
  return (
    <Footer className="pv-footer">
      <FooterBrand>
        <a href="#/">
          <svg className="ayy-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="3" />
          </svg>
          ayywi
        </a>
        <p>A framework-agnostic design system that AI tools can follow.</p>
      </FooterBrand>
      <FooterNav>
        <FooterGroup label="Docs">
          <FooterLink href="#/docs/get-started">Get started</FooterLink>
          <FooterLink href="#/docs/colors">Foundations</FooterLink>
          <FooterLink href="#/docs/changelog">Changelog</FooterLink>
        </FooterGroup>
        <FooterGroup label="Explore">
          <FooterLink href="#/components">Components</FooterLink>
          <FooterLink href="#/examples">Examples</FooterLink>
          <FooterLink href="#/themes">Themes</FooterLink>
        </FooterGroup>
        <FooterGroup label="For AI tools">
          <FooterLink href="llms.txt">llms.txt</FooterLink>
          <FooterLink href="llms-full.txt">llms-full.txt</FooterLink>
          <FooterLink href="manifest/components.json">components.json</FooterLink>
        </FooterGroup>
      </FooterNav>
      <FooterBottom>
        <p>MIT licence · v{version}</p>
        <div className="ayy-cluster">
          <a className="ayy-link" href={GITHUB} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="ayy-link" href="https://www.npmjs.com/package/@danitesler/ayywi" target="_blank" rel="noreferrer">
            npm
          </a>
        </div>
      </FooterBottom>
    </Footer>
  );
}
