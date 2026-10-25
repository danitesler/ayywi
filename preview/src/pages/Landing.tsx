import type { ReactNode } from "react";
import { ArrowRight01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { buttonClass, Footer, FooterBottom, FooterBrand, FooterGroup, FooterLink, FooterNav, Icon, Shortcut } from "@danitesler/ayywi/react";
import { themes } from "@danitesler/ayywi";
import { version } from "../../../package.json";
import { CodeBlock } from "../CodeBlock";
import { components } from "../data";
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

const INIT = `npx @danitesler/ayywi init
npx @danitesler/ayywi lint`;

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

      <Feature title="A design system your agent can use" href="#/docs/get-started" link="Set up your agent" visual={<CodeBlock code={INIT} label="terminal" language="sh" />}>
        One command installs a skill, the rules, a hook that lints every UI file the agent writes and an MCP server, so it looks
        components up instead of inventing them.
      </Feature>

      <Feature
        title={`${showcaseApps.length} example apps`}
        href="#/examples"
        link="See the examples"
        visual={
          <div className="pv-feature__shots">
            {showcaseApps.slice(0, 3).map((app) => (
              <img key={app.id} src={app.screenshot} alt="" loading="lazy" width={1280} height={800} />
            ))}
          </div>
        }
      >
        A dashboard, an inbox, a store and more, each in its own theme and density, at desktop, tablet and phone sizes, with the
        prompt that builds it.
      </Feature>

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
