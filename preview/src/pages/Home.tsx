import { useEffect, useRef, useState, type CSSProperties } from "react";
import { DashboardSquare01Icon, SparklesIcon } from "@hugeicons/core-free-icons";
import { Badge, Button, buttonClass, Icon, Sparkline, Stat } from "@danitesler/ayywi/react";
import { THEME_PRESETS } from "@danitesler/ayywi";
import "./home.css";

function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  return reduce;
}

/** True while the element is on screen: the loop pauses when it isn't. */
function useOnScreen<T extends Element>(ref: { current: T | null }) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setOn(entry.isIntersecting), { rootMargin: "80px" });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return on;
}

type Rgb = [number, number, number];

/** The colours the hero drifts through: the ready-made themes' brand colours. */
const PALETTE = THEME_PRESETS.flatMap((preset) => (preset.brand ? [preset.brand.color] : []));
/** Seconds the colour spends on each stop, easing into the next. */
const COLOR_SECONDS = 7;

const toRgb = (hex: string): Rgb => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const rgbToHsl = ([r, g, b]: Rgb): Rgb => {
  const R = r / 255;
  const G = g / 255;
  const B = b / 255;
  const max = Math.max(R, G, B);
  const min = Math.min(R, G, B);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return [0, 0, l];
  const sat = d / (1 - Math.abs(2 * l - 1));
  const h = max === R ? ((G - B) / d) % 6 : max === G ? (B - R) / d + 2 : (R - G) / d + 4;
  return [(h * 60 + 360) % 360, sat, l];
};

const hslToRgb = ([h, sat, l]: Rgb): Rgb => {
  const c = (1 - Math.abs(2 * l - 1)) * sat;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
};

const PALETTE_HSL = PALETTE.map((hex) => rgbToHsl(toRgb(hex)));

/** The colour at a moment of the loop: the stops blended through hue, so green to blue passes teal, not grey. */
function colorAt(seconds: number): Rgb {
  const position = (seconds / COLOR_SECONDS) % PALETTE_HSL.length;
  const from = PALETTE_HSL[Math.floor(position)];
  const to = PALETTE_HSL[(Math.floor(position) + 1) % PALETTE_HSL.length];
  const f = position % 1;
  const ease = f * f * (3 - 2 * f);
  let dh = to[0] - from[0];
  if (dh > 180) dh -= 360;
  if (dh < -180) dh += 360;
  return hslToRgb([(from[0] + dh * ease + 360) % 360, from[1] + (to[1] - from[1]) * ease, from[2] + (to[2] - from[2]) * ease]);
}

/**
 * One colour drifting through the palette. It is written to a ref for the pixel waves and, as the brand variables, onto
 * the preview's stage, so the app being built changes theme in step with the pixels. No re-render per frame.
 */
function useHeroColor(stage: { current: HTMLElement | null }, color: { current: Rgb }, active: boolean, reduce: boolean) {
  useEffect(() => {
    const apply = (rgb: Rgb) => {
      color.current = rgb;
      const el = stage.current;
      if (!el) return;
      const css = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
      const luminance = (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255;
      el.style.setProperty("--ayy-color-primary", css);
      el.style.setProperty("--ayy-color-ring", css);
      el.style.setProperty("--ayy-color-glow", css);
      el.style.setProperty("--ayy-color-primary-fg", luminance > 0.55 ? "var(--ayy-color-bg)" : "var(--ayy-color-text)");
    };
    if (reduce) {
      apply(colorAt(COLOR_SECONDS));
      return;
    }
    if (!active) return;
    const start = performance.now() - 2000;
    let frame = 0;
    let last = 0;
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (now - last < 50) return;
      last = now;
      apply(colorAt((now - start) / 1000));
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [stage, color, active, reduce]);
}

interface BuildApp {
  id: "tracker" | "dashboard" | "store";
  prompt: string;
}

/** Three apps, one after another. Their colours come from the drifting hero colour, not from the prompt. */
const BUILD_APPS: BuildApp[] = [
  { id: "tracker", prompt: "Build me a release tracker for my team. Use my brand colours." },
  { id: "dashboard", prompt: "Build an analytics dashboard for my SaaS. Use my brand colours." },
  { id: "store", prompt: "Build an online coffee shop. Use my brand colours." },
];

/** The timeline: the prompt types while the preview builds in four beats alongside it, hold, then the next app. */
function useBuild(active: boolean, reduce: boolean) {
  const [chars, setChars] = useState(0);
  const [phase, setPhase] = useState(0);
  const [app, setApp] = useState(0);
  const next = useRef(0);
  useEffect(() => {
    if (reduce) {
      setChars(BUILD_APPS[0].prompt.length);
      setPhase(4);
      return;
    }
    if (!active) return;
    let typing = 0;
    const timers: number[] = [];
    const cycle = () => {
      timers.length = 0;
      const index = next.current;
      next.current = (index + 1) % BUILD_APPS.length;
      const text = BUILD_APPS[index].prompt;
      setApp(index);
      setChars(0);
      setPhase(0);
      let n = 0;
      typing = window.setInterval(() => {
        n += 1;
        setChars(n);
        if (n >= text.length) clearInterval(typing);
      }, 28);
      // The app starts building while the prompt is still being typed.
      timers.push(window.setTimeout(() => setPhase(1), 400));
      timers.push(window.setTimeout(() => setPhase(2), 1100));
      timers.push(window.setTimeout(() => setPhase(3), 1800));
      timers.push(window.setTimeout(() => setPhase(4), 2900));
      timers.push(window.setTimeout(cycle, 8200));
    };
    cycle();
    return () => {
      clearInterval(typing);
      timers.forEach(clearTimeout);
      // Start this app over when the loop resumes, rather than skipping ahead.
      next.current = (next.current + BUILD_APPS.length - 1) % BUILD_APPS.length;
    };
  }, [active, reduce]);
  return { chars, phase, app };
}

const BUILD_CARDS: [string, string][][] = [
  [["Write release notes", "Docs"], ["Fix tooltip flicker", "Bug"], ["Update screenshots", "Docs"]],
  [["Table column order", "Feature"], ["Dark mode pass", "Design"]],
  [["Search bar", "Feature"], ["Event calendar", "Feature"]],
];
const BUILD_COLUMNS = ["To do", "In progress", "Done"];

const VISITORS = [12, 18, 15, 24, 22, 31, 29, 38, 36, 44, 41, 52, 49, 58, 55, 63];
const KPIS: [string, string, string, number[]][] = [
  ["Visitors", "49.3K", "+11.5%", [12, 18, 15, 24, 22, 31, 29, 38]],
  ["Conversion", "3.8", "%", [20, 22, 19, 25, 24, 28, 27, 31]],
  ["Revenue", "$92.4K", "+8.1%", [10, 14, 13, 20, 18, 26, 30, 35]],
];
const PRODUCTS: [string, string, string, string][] = [
  ["Ethiopia Guji", "Blueberry, jasmine", "$18", "var(--ayy-accent-ai)"],
  ["Colombia Huila", "Red apple, caramel", "$16", "var(--ayy-accent-marketing)"],
  ["Kenya Kiambu AA", "Blackcurrant, grapefruit", "$21", "var(--ayy-accent-brand)"],
  ["House blend", "Milk chocolate, hazelnut", "$13", "var(--ayy-accent-research)"],
  ["Night shift", "Dark chocolate, molasses", "$14", "var(--ayy-accent-product)"],
  ["Swiss water decaf", "Cocoa, plum", "$15", "var(--ayy-accent-system)"],
];

function BuiltApp({ phase, kind }: { phase: number; kind: BuildApp["id"] }) {
  const nav = kind === "dashboard" ? ["Overview", "Reports", "Audiences", "Settings"] : ["Board", "Calendar", "Checklist", "Settings"];
  return (
    <div className="pv-home-built" data-phase={phase} data-kind={kind}>
      <div className="pv-home-built__skeleton" aria-hidden="true">
        <span style={{ "--w": "34%" } as CSSProperties} />
        <span style={{ "--w": "100%", "--h": "5rem" } as CSSProperties} />
        <span style={{ "--w": "78%" } as CSSProperties} />
        <span style={{ "--w": "56%" } as CSSProperties} />
      </div>
      <aside className="pv-home-built__side">
        <strong>{kind === "dashboard" ? "Pulse" : "Releases"}</strong>
        {nav.map((item, i) => (
          <span key={item} data-current={i === 0 ? "" : undefined} style={{ "--i": i } as CSSProperties}>
            {item}
          </span>
        ))}
      </aside>
      <div className="pv-home-built__main">
        {kind === "tracker" && (
          <>
            <div className="pv-home-built__top">
              <strong>Release board</strong>
              <Button size="sm" tabIndex={-1}>
                New card
              </Button>
            </div>
            <div className="pv-home-built__cols">
              {BUILD_COLUMNS.map((title, c) => (
                <div key={title} className="pv-home-built__col">
                  <span className="pv-home-built__col-title">{title}</span>
                  {BUILD_CARDS[c].map(([text, tag], i) => (
                    <div key={text} className="pv-home-built__card" style={{ "--i": c * 2 + i } as CSSProperties}>
                      <span>{text}</span>
                      <Badge variant="muted">{tag}</Badge>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
        {kind === "dashboard" && (
          <>
            <div className="pv-home-built__top">
              <strong>Overview</strong>
              <Button size="sm" variant="outline" tabIndex={-1}>
                Export
              </Button>
            </div>
            <div className="pv-home-built__kpis">
              {KPIS.map(([label, value, unit, values], i) => (
                <div key={label} className="pv-home-built__card" style={{ "--i": i } as CSSProperties}>
                  <Stat size="sm" label={label} value={value} unit={unit} labelFirst />
                  <Sparkline values={values} area color="var(--ayy-color-primary)" label={`${label}, trending up`} />
                </div>
              ))}
            </div>
            <div className="pv-home-built__card pv-home-built__chart" style={{ "--i": 3 } as CSSProperties}>
              <span className="pv-home-built__col-title">Visitors, last 30 days</span>
              <Sparkline className="pv-home-built__spark" values={VISITORS} area color="var(--ayy-color-primary)" label="Visitors, last 30 days, up" />
            </div>
          </>
        )}
        {kind === "store" && (
          <>
            <div className="pv-home-built__top">
              <strong>Ember coffee</strong>
              <Button size="sm" tabIndex={-1}>
                Cart · 2
              </Button>
            </div>
            <div className="pv-home-built__products">
              {PRODUCTS.map(([name, notes, price, spot], i) => (
                <div key={name} className="pv-home-built__card pv-home-built__product" style={{ "--i": i } as CSSProperties}>
                  <span className="pv-home-built__swatch" style={{ "--spot": spot } as CSSProperties} />
                  <b>{name}</b>
                  <span className="ayy-muted">{notes}</span>
                  <span className="pv-home-built__price">
                    {price}
                    <Button size="sm" variant="outline" tabIndex={-1}>
                      Add
                    </Button>
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
        <div className="pv-home-built__foot">
          <Badge dot>0 lint errors</Badge>
          <span className="ayy-muted">dark and light · right-to-left · phone layout</span>
        </div>
      </div>
    </div>
  );
}

/**
 * The hero's backdrop: a grid of small squares whose size and brightness follow a few slow sine waves, so soft bands of
 * pixels roll across it. On top of that weave: ripples spreading from the wordmark, a diagonal band that sweeps across
 * now and then, and a swell around the pointer. Those highlights wear the hero colour, which also themes the preview. Drawn on one
 * canvas at about 30 frames a second, paused off screen, a single still frame under prefers-reduced-motion. The base
 * takes the page's text colour, so it follows the theme.
 */
function PixelWaves({ color, reduce }: { color: { current: Rgb }; reduce: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const CELL = 18;
    let width = 0;
    let height = 0;
    let base: Rgb = [255, 255, 255];
    const origin = { x: 0, y: 0 };
    const pointer = { x: -9999, y: -9999 };
    let frame = 0;
    let last = 0;
    let visible = true;

    const readColor = () => {
      const [r, g, b] = (getComputedStyle(canvas).color.match(/[\d.]+/g) ?? []).slice(0, 3);
      if (r !== undefined && g !== undefined && b !== undefined) base = [Math.round(+r), Math.round(+g), Math.round(+b)];
    };

    const draw = (clock: number) => {
      const t = clock * 1.1;
      // The highlights wear the hero colour, the same one the preview app is themed with.
      const accent = color.current;
      const baseStyle = `${base[0]},${base[1]},${base[2]}`;
      ctx.clearRect(0, 0, width, height);
      const cols = Math.ceil(width / CELL);
      const rows = Math.ceil(height / CELL);
      for (let cy = 0; cy < rows; cy++) {
        const down = 1 - (cy / rows) * 0.95;
        if (down <= 0) break;
        for (let cx = 0; cx < cols; cx++) {
          const x = cx * CELL + CELL / 2;
          const y = cy * CELL + CELL / 2;
          // Three waves crossing at different angles and speeds, summed into 0..1.
          const sum =
            Math.sin(cx * 0.21 + t * 0.9) +
            Math.sin(cy * 0.3 - t * 0.65 + cx * 0.07) +
            Math.sin((cx + cy) * 0.11 + t * 0.45);
          const wave = ((sum + 3) / 6) ** 2;
          // Thin rings spreading from the wordmark.
          const dist = Math.hypot(x - origin.x, y - origin.y);
          const ripple = Math.max(0, Math.sin(dist * 0.03 - t * 2.4)) ** 6 * Math.exp(-dist / 560);
          // A diagonal band that sweeps across.
          let along = (cx * 0.7 + cy * 0.45 - t * 7) % 70;
          if (along < 0) along += 70;
          const sweep = Math.exp(-((along - 35) ** 2) / 36);
          // A swell around the pointer.
          const near = Math.hypot(x - pointer.x, y - pointer.y);
          const touch = near < 150 ? (1 - near / 150) ** 2 : 0;
          const lift = Math.min(1, ripple * 1.5 + sweep * 0.85 + touch);
          const energy = Math.min(1, wave + lift * 0.7);
          const alpha = (0.018 + 0.14 * energy) * down * (0.8 + 0.2 * Math.sin((cx / cols) * Math.PI));
          if (alpha < 0.009) continue;
          const size = CELL * (0.09 + 0.5 * energy);
          if (lift > 0.03) {
            const k = Math.min(1, lift * 1.3);
            const r = Math.round(base[0] + (accent[0] - base[0]) * k);
            const g = Math.round(base[1] + (accent[1] - base[1]) * k);
            const b = Math.round(base[2] + (accent[2] - base[2]) * k);
            ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(0.45, alpha * (1 + lift * 0.85)).toFixed(3)})`;
          } else {
            ctx.fillStyle = `rgba(${baseStyle},${alpha.toFixed(3)})`;
          }
          ctx.fillRect(x - size / 2, y - size / 2, size, size);
        }
      }
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (!visible || now - last < 33) return;
      last = now;
      draw(now / 1000);
    };

    const resize = () => {
      const box = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = box.width;
      height = box.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      readColor();
      // The rings spread from the middle of the wordmark.
      const mark = canvas.closest(".pv-home")?.querySelector(".pv-home-hero__title");
      const m = mark?.getBoundingClientRect();
      origin.x = m ? m.left + m.width / 2 - box.left : width / 2;
      origin.y = m ? m.top + m.height / 2 - box.top : height * 0.25;
      draw(reduce ? 4 : performance.now() / 1000);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const box = canvas.getBoundingClientRect();
      pointer.x = event.clientX - box.left;
      pointer.y = event.clientY - box.top;
    };
    const onLeave = () => {
      pointer.x = pointer.y = -9999;
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const view = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      readColor();
    });
    view.observe(canvas);
    // The theme can change under the page: look at the colour again now and then.
    const recolor = window.setInterval(readColor, 2000);
    if (!reduce) {
      frame = requestAnimationFrame(tick);
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(recolor);
      observer.disconnect();
      view.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [color, reduce]);
  return <canvas ref={ref} />;
}

/** #/: a prompt types itself while the app it describes is built, three apps in turn. */
export function Home() {
  const reduce = useReducedMotion();
  const win = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(win);
  const { chars, phase, app } = useBuild(onScreen, reduce);
  const current = BUILD_APPS[app];
  const stage = useRef<HTMLDivElement>(null);
  const color = useRef<Rgb>(toRgb(PALETTE[0]));
  useHeroColor(stage, color, onScreen, reduce);
  return (
    <article className="pv-page pv-landing pv-home">
      <div className="pv-home-hero-bg" aria-hidden="true">
        <PixelWaves color={color} reduce={reduce} />
      </div>
      <header className="pv-home-hero pv-home-hero--tight">
        <h1 className="pv-home-hero__title pv-home-hero__title--mark">ayywi</h1>
        <p className="pv-home-hero__tagline">Make your app look consistent, in one paste</p>
        <div className="ayy-cluster pv-home-center pv-home-hero__actions">
          <a className={buttonClass({ size: "lg" })} href="#/docs/get-started">
            Get the prompt
          </a>
          <a className={buttonClass({ variant: "outline", size: "lg" })} href="#/components">
            Browse components
          </a>
        </div>
      </header>

      <div className="pv-home-win" ref={win}>
        <section className="pv-home-win__pane pv-home-win__pane--prompt" aria-label="The prompt">
          <div className="pv-home-win__label">
            <Icon icon={SparklesIcon} name="sparkles" /> Your prompt
          </div>
          <p className="pv-home-win__prompt">
            <span className="ayy-sr-only">{current.prompt}</span>
            <span aria-hidden="true">
              {current.prompt.slice(0, chars)}
              <i className="pv-home-caret" data-done={chars >= current.prompt.length ? "" : undefined} />
            </span>
          </p>
          <ol className="pv-home-win__steps" aria-hidden="true">
            {["Reading the ayywi rules", "Choosing components", "Applying your brand", "Linting"].map((text, i) => (
              <li key={text} data-state={phase > i + 0 ? "done" : phase === i ? "active" : undefined}>
                <span className="pv-home-win__tick" />
                {text}
              </li>
            ))}
          </ol>
        </section>
        <section className="pv-home-win__pane pv-home-win__pane--preview" aria-label="The app it builds">
          <div className="pv-home-win__label">
            <Icon icon={DashboardSquare01Icon} name="layout-dashboard" /> Preview
          </div>
          <div className="pv-home-win__stage" ref={stage} inert>
            <BuiltApp phase={phase} kind={current.id} />
          </div>
        </section>
      </div>
    </article>
  );
}
