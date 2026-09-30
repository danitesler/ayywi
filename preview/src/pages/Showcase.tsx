import { useEffect, useRef, useState } from "react";
import { ArrowLeft01Icon, ComputerIcon, LinkSquare01Icon, SmartPhone01Icon, Tablet01Icon } from "@hugeicons/core-free-icons";
import { Badge, Button, buttonClass, Icon } from "ayywi/react";
import { components } from "../data";
import { showcaseApps, type ShowcaseApp } from "../showcase/apps";
import { themeOptions } from "../themes";

const ROUTE = "showcase";

export const showcase = {
  route: ROUTE,
  title: "What you can build",
  text: `examples showcase templates apps screens dashboard landing inbox settings desktop tablet mobile ${showcaseApps.map((a) => `${a.name} ${a.kind}`).join(" ")}`,
};

const DEVICES = {
  desktop: { label: "Desktop", icon: ComputerIcon, width: 1280, height: 800 },
  tablet: { label: "Tablet", icon: Tablet01Icon, width: 834, height: 1112 },
  mobile: { label: "Mobile", icon: SmartPhone01Icon, width: 390, height: 844 },
} as const;
type Device = keyof typeof DEVICES;

const frameSrc = (app: ShowcaseApp) => `?app=${app.id}`;
const themeLabel = (app: ShowcaseApp) => themeOptions.find((t) => t.name === app.theme)?.label ?? app.theme;
const densityLabel = (app: ShowcaseApp) => app.density.charAt(0).toUpperCase() + app.density.slice(1);

/** The app at a real device size, scaled down to fit its box. `maxHeight` caps tall devices so they fit the window. */
function ScaledFrame({ app, width, height, maxHeight, lazy, title }: { app: ShowcaseApp; width: number; height: number; maxHeight?: number; lazy?: boolean; title?: string }) {
  const box = useRef<HTMLDivElement>(null);
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
          className="pv-scaled__frame"
          src={frameSrc(app)}
          title={title ?? `${app.name}, ${app.kind}`}
          loading={lazy ? "lazy" : undefined}
          style={{ inlineSize: width, blockSize: height, transform: `scale(${scale})` }}
        />
      </div>
    </div>
  );
}

function Modes({ app }: { app: ShowcaseApp }) {
  return (
    <span className="ayy-cluster">
      <Badge variant="outline">{themeLabel(app)}</Badge>
      <Badge variant="outline">{densityLabel(app)}</Badge>
    </span>
  );
}

function Gallery() {
  return (
    <article className="pv-page">
      <header className="pv-page__header">
        <p className="ayy-eyebrow">Start</p>
        <h1 className="ayy-h2">What you can build</h1>
        <p className="ayy-lede">
          Four screens made only from ayywi components, each in its own theme and density. Open one to see it on desktop, tablet and mobile.
        </p>
      </header>
      <ul className="pv-showcase">
        {showcaseApps.map((app) => (
          <li key={app.id}>
            <a className="pv-showcase__card" href={`#/${ROUTE}/${app.id}`} aria-describedby={`sc-${app.id}-desc`}>
              <div className="pv-showcase__thumb" inert>
                <ScaledFrame app={app} width={DEVICES.desktop.width} height={DEVICES.desktop.height} lazy />
              </div>
              <span className="pv-showcase__body">
                <span className="pv-showcase__title">
                  <span className="pv-showcase__name">{app.name}</span>
                  <span className="ayy-muted">{app.kind}</span>
                </span>
                <span className="pv-showcase__desc" id={`sc-${app.id}-desc`}>
                  {app.description}
                </span>
                <Modes app={app} />
              </span>
            </a>
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
  const used = app.uses.map((slug) => components.find((c) => c.slug === slug)).filter((c) => c !== undefined);
  const i = showcaseApps.indexOf(app);
  const next = showcaseApps[(i + 1) % showcaseApps.length];

  return (
    <article className="pv-page">
      <div>
        <a className={buttonClass({ variant: "ghost", size: "sm" })} href={`#/${ROUTE}`}>
          <Icon icon={ArrowLeft01Icon} directional />
          All examples
        </a>
      </div>
      <header className="pv-page__header">
        <p className="ayy-eyebrow">{app.kind}</p>
        <h1 className="ayy-h2">{app.name}</h1>
        <p className="ayy-lede">{app.description}</p>
        <Modes app={app} />
      </header>

      <div className="pv-device-bar">
        <div className="ayy-cluster" role="group" aria-label="Device">
          {(Object.keys(DEVICES) as Device[]).map((key) => (
            <Button key={key} size="sm" variant={key === device ? "secondary" : "ghost"} aria-pressed={key === device} onClick={() => setDevice(key)}>
              <Icon icon={DEVICES[key].icon} />
              {DEVICES[key].label}
            </Button>
          ))}
        </div>
        <span className="ayy-muted ayy-mono pv-device-bar__size">
          {d.width} × {d.height}
        </span>
        <a className={buttonClass({ variant: "outline", size: "sm" })} href={frameSrc(app)} target="_blank" rel="noreferrer">
          <Icon icon={LinkSquare01Icon} />
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
          title={`${app.name} on ${d.label.toLowerCase()}`}
        />
      </div>

      <h2 className="pv-h pv-h--section">Built with</h2>
      <nav className="pv-chips" aria-label={`Components in ${app.name}`}>
        {used.map((c) => (
          <a key={c.slug} href={`#/${c.slug}`} className="pv-chip">
            {c.name}
          </a>
        ))}
      </nav>

      <div>
        <a className={buttonClass({ variant: "outline" })} href={`#/${ROUTE}/${next.id}`}>
          Next: {next.name}, {next.kind.toLowerCase()}
        </a>
      </div>
    </article>
  );
}

export function ShowcasePage({ id }: { id?: string }) {
  const app = id ? showcaseApps.find((a) => a.id === id) : undefined;
  return app ? <Detail key={app.id} app={app} /> : <Gallery />;
}
