import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft01Icon, ArrowRight01Icon, ComputerIcon, DashboardSquare01Icon, LinkSquare01Icon, SmartPhone01Icon, Tablet01Icon } from "@hugeicons/core-free-icons";
import { buttonClass, Card, CardDescription, CardHeader, CardLink, CardMedia, Icon, SegmentedControl, SegmentedControlItem } from "@danitesler/ayywi/react";
import type { BrandInput, ThemeMode } from "@danitesler/ayywi";
import { CodeBlock } from "../CodeBlock";
import { showcaseApps, type ShowcaseApp } from "../showcase/apps";

const ROUTE = "examples";

export const showcaseAppsPage = {
  route: ROUTE,
  title: "Examples",
  text: `examples showcase templates apps screens prompt dashboard landing inbox tracker desktop tablet mobile ${showcaseApps.map((a) => `${a.name} ${a.kind} ${a.preset}`).join(" ")}`,
};
export const showcase = showcaseAppsPage;

const DEVICES = {
  desktop: { label: "Desktop", icon: ComputerIcon, iconName: "monitor", width: 1280, height: 800 },
  tablet: { label: "Tablet", icon: Tablet01Icon, iconName: "tablet", width: 834, height: 1112 },
  mobile: { label: "Mobile", icon: SmartPhone01Icon, iconName: "smartphone", width: 390, height: 844 },
} as const;
type Device = keyof typeof DEVICES;

/** A theme and brand for the app inside a ScaledFrame (the Themes page), instead of its own. */
export interface Look {
  theme: ThemeMode;
  brand: BrandInput | null;
}

const frameSrc = (app: ShowcaseApp) => `?app=${app.id}`;

/** Each preset's accent as the nearest palette colour, for the card's hover spotlight. Default is monochrome. */
const PRESET_ACCENTS: Record<string, string> = {
  default: "var(--ayy-color-text)",
  ember: "var(--ayy-palette-orange-65)",
  forest: "var(--ayy-palette-green-51)",
  arctic: "var(--ayy-palette-blue-68)",
  twilight: "var(--ayy-palette-violet-58)",
  wine: "var(--ayy-palette-red-71)",
};
const spot = (app: ShowcaseApp) => ({ "--ayy-spot": PRESET_ACCENTS[app.preset] }) as CSSProperties;

/** The app at a real device size, scaled down to fit its box. `maxHeight` caps tall devices so they fit the window. */
export function ScaledFrame({ app, width, height, maxHeight, lazy, title, look }: { app: ShowcaseApp; width: number; height: number; maxHeight?: number; lazy?: boolean; title?: string; look?: Look }) {
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const post = useCallback(() => {
    if (look) frame.current?.contentWindow?.postMessage({ type: "ayywi-look", ...look }, window.location.origin);
  }, [look]);
  useEffect(post, [post]);
  const [available, setAvailable] = useState(width);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setAvailable(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const scale = Math.min(1, available / width, maxHeight ? maxHeight / height : 1);
  return (
    // Scaling is physical (top-left origin), so the box itself stays left-to-right; the app inside has its own document.
    <div ref={box} className="pv-scaled" dir="ltr">
      <div className="pv-scaled__viewport" style={{ inlineSize: width * scale, blockSize: height * scale }}>
        <iframe
          ref={frame}
          onLoad={post}
          className="pv-scaled__frame"
          src={frameSrc(app)}
          title={title ?? app.kind}
          loading={lazy ? "lazy" : undefined}
          style={{ inlineSize: width, blockSize: height, transform: `scale(${scale})` }}
        />
      </div>
    </div>
  );
}

function Gallery() {
  return (
    <article className="pv-page">
      <header className="pv-page__header pv-page__header--center">
        <h1 className="ayy-h1">Examples</h1>
        <p className="ayy-lede">
          {showcaseApps.length} screens built with ayywi only, each wearing one of its themes. Open one to see it at desktop, tablet and
          phone sizes, with the prompt that builds it.
        </p>
      </header>
      <ul className="pv-showcase">
        {showcaseApps.map((app) => (
          <li key={app.id}>
            <Card interactive spotlight className="pv-showcase__card" style={spot(app)} aria-describedby={`sc-${app.id}-desc`}>
              <CardMedia className="pv-showcase__thumb">
                <img src={app.screenshot} alt={app.kind} loading="lazy" width={1280} height={800} />
              </CardMedia>
              <CardHeader>
                {/* CardTitle's markup on an h2: the cards sit straight under the page's h1. */}
                <h2 className="ayy-card__title">
                  <CardLink href={`#/${ROUTE}/${app.id}`}>{app.kind}</CardLink>
                </h2>
                <CardDescription id={`sc-${app.id}-desc`}>{app.description}</CardDescription>
              </CardHeader>
            </Card>
          </li>
        ))}
      </ul>
    </article>
  );
}

function Detail({ app }: { app: ShowcaseApp }) {
  const [device, setDevice] = useState<Device>("desktop");
  const [maxHeight, setMaxHeight] = useState(() => window.innerHeight);
  useEffect(() => {
    const onResize = () => setMaxHeight(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const d = DEVICES[device];
  const i = showcaseApps.indexOf(app);
  const prev = showcaseApps[(i - 1 + showcaseApps.length) % showcaseApps.length];
  const next = showcaseApps[(i + 1) % showcaseApps.length];

  return (
    <article className="pv-page">
      <header className="pv-page__header pv-page__header--center">
        <h1 className="ayy-h1">{app.kind}</h1>
        <p className="ayy-lede">{app.description}</p>
      </header>
      <nav className="pv-example-nav" aria-label="Examples">
        <a className={buttonClass({ variant: "outline" })} href={`#/${ROUTE}/${prev.id}`} rel="prev" aria-label={`Previous: ${prev.kind}`}>
          <Icon icon={ArrowLeft01Icon} name="chevron-left" directional />
          <span className="pv-example-nav__name">{prev.kind}</span>
        </a>
        <a className={buttonClass({ variant: "outline" })} href={`#/${ROUTE}`}>
          <Icon icon={DashboardSquare01Icon} name="layout-dashboard" />
          All examples
        </a>
        <a className={buttonClass({ variant: "outline" })} href={`#/${ROUTE}/${next.id}`} rel="next" aria-label={`Next: ${next.kind}`}>
          <span className="pv-example-nav__name">{next.kind}</span>
          <Icon icon={ArrowRight01Icon} name="chevron-right" directional />
        </a>
      </nav>
      <div className="pv-device-bar">
        <SegmentedControl size="sm" aria-label="Device" value={device} onValueChange={(v) => setDevice(v as Device)}>
          {(Object.keys(DEVICES) as Device[]).map((key) => (
            <SegmentedControlItem key={key} value={key}>
              <Icon icon={DEVICES[key].icon} name={DEVICES[key].iconName} />
              {DEVICES[key].label}
            </SegmentedControlItem>
          ))}
        </SegmentedControl>
        <span className="ayy-muted ayy-mono pv-device-bar__size">
          {d.width} × {d.height}
        </span>
        <a className={buttonClass({ variant: "outline", size: "sm" })} href={frameSrc(app)} target="_blank" rel="noreferrer">
          <Icon icon={LinkSquare01Icon} name="external-link" />
          Open full screen
        </a>
      </div>

      <div className="pv-device" data-device={device}>
        <ScaledFrame
          key={device}
          app={app}
          width={d.width}
          height={d.height}
          maxHeight={device === "desktop" ? undefined : Math.max(480, maxHeight - 120)}
          title={`${app.kind} on ${d.label.toLowerCase()}`}
        />
      </div>

      <h2 className="pv-h pv-h--section">Build it with AI</h2>
      <p className="pv-note">
        Paste into your agent in a project with ayywi set up (see Get started). It names the components.
      </p>
      <CodeBlock code={app.prompt} label="prompt" wrap />

    </article>
  );
}

export function ShowcasePage({ id }: { id?: string }) {
  const app = id ? showcaseApps.find((a) => a.id === id) : undefined;
  return app ? <Detail key={app.id} app={app} /> : <Gallery />;
}
