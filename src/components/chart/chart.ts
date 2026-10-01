import { cx } from "../../lib/cx";

export interface ChartClassOptions {
  /** Bars of a column sit on top of each other. */
  stacked?: boolean;
  /** Always show each bar's data-value above it (otherwise on hover). */
  values?: boolean;
  className?: string;
}

export function chartClass({ stacked, values, className }: ChartClassOptions = {}): string {
  return cx("ayy-chart", stacked && "ayy-chart--stacked", values && "ayy-chart--values", className);
}

export function chartSeriesClass({ compare, className }: { compare?: boolean; className?: string } = {}): string {
  return cx("ayy-chart__series", compare && "ayy-chart__series--compare", className);
}

export function chartLegendItemClass({ compare, className }: { compare?: boolean; className?: string } = {}): string {
  return cx("ayy-chart__legend-item", compare && "ayy-chart__legend-item--compare", className);
}

export const chartPlotClass = "ayy-chart__plot";
export const chartTickClass = "ayy-chart__tick";
export const chartBarsClass = "ayy-chart__bars";
export const chartColumnClass = "ayy-chart__column";
export const chartBarClass = "ayy-chart__bar";
export const chartSvgClass = "ayy-chart__svg";
export const chartLineClass = "ayy-chart__line";
export const chartAreaClass = "ayy-chart__area";
export const chartLabelsClass = "ayy-chart__labels";
export const chartLegendClass = "ayy-chart__legend";
export const chartSwatchClass = "ayy-chart__swatch";
export const barListClass = "ayy-bar-list";
export const barListItemClass = "ayy-bar-list__item";
export const barListLabelClass = "ayy-bar-list__label";
export const barListValueClass = "ayy-bar-list__value";
export const sparklineClass = "ayy-sparkline";

/** How many series colours the tokens define (--ayy-chart-1 … --ayy-chart-6). */
export const CHART_SERIES = 6;

const tidy = (n: number) => Number(n.toPrecision(12));

const STEPS = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];

/** Round a step up to a round multiple of a power of ten (1, 1.5, 2, 2.5, 3, 4, 5, 6 or 8). */
function niceStep(raw: number): number {
  if (!(raw > 0)) return 1;
  const power = 10 ** Math.floor(Math.log10(raw));
  return (STEPS.find((step) => raw / power <= step + 1e-9) ?? 10) * power;
}

export interface ChartScale {
  min: number;
  max: number;
  /** Evenly spaced values from min to max, for .ayy-chart__tick. */
  ticks: number[];
}

/**
 * A scale with a round top and evenly spaced ticks: chartScale([120, 340, 90]) → { min: 0, max: 400, ticks: [0, 200, 400] }.
 * Pass max to fix the top (a percentage, a goal) instead.
 */
export function chartScale(values: readonly number[], { ticks = 3, min = 0, max }: { ticks?: number; min?: number; max?: number } = {}): ChartScale {
  const count = Math.max(2, Math.round(ticks));
  const step = max !== undefined ? (max - min) / (count - 1) : niceStep((Math.max(min, ...values) - min) / (count - 1));
  return { min, max: tidy(min + step * (count - 1)), ticks: Array.from({ length: count }, (_, i) => tidy(min + step * i)) };
}

/** A value as a share of the scale, 0–100: the number --ayy-value takes. */
export function chartPercent(value: number, max: number, min = 0): number {
  if (!(max > min) || !Number.isFinite(value)) return 0;
  return Math.round(Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100)) * 10) / 10;
}

export interface ChartPathOptions {
  min?: number;
  /** Top of the scale; the largest value if omitted. */
  max?: number;
  /** A smooth curve that never overshoots the points (monotone cubic) instead of straight segments. */
  smooth?: boolean;
}

/**
 * SVG path data for a line through `values`, evenly spaced, in the 0 0 100 100 box that .ayy-chart__svg and
 * .ayy-sparkline use (y = 0 is the top), and for the area under it. Use with vector-effect: non-scaling-stroke
 * (the line class sets it) so the stretched box keeps a 2px line.
 */
export function chartPath(values: readonly number[], { min = 0, max, smooth = false }: ChartPathOptions = {}): { line: string; area: string } {
  if (!values.length) return { line: "", area: "" };
  const top = max ?? Math.max(...values);
  const span = top - min || 1;
  const n = values.length;
  const xs = values.map((_, i) => (n === 1 ? 50 : (i / (n - 1)) * 100));
  const ys = values.map((v) => 100 - Math.min(100, Math.max(0, ((v - min) / span) * 100)));
  const r = (v: number) => Math.round(v * 100) / 100;
  let line = `M${r(xs[0])},${r(ys[0])}`;
  if (!smooth || n < 3) {
    for (let i = 1; i < n; i++) line += ` L${r(xs[i])},${r(ys[i])}`;
  } else {
    // Fritsch–Carlson monotone tangents: the curve stays between neighbouring points, so peaks aren't exaggerated.
    const dx = xs[1] - xs[0];
    const d = ys.slice(1).map((y, i) => (y - ys[i]) / dx);
    const m = ys.map((_, i) => (i === 0 ? d[0] : i === n - 1 ? d[n - 2] : d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2));
    for (let i = 0; i < n - 1; i++) {
      if (d[i] === 0) {
        m[i] = 0;
        m[i + 1] = 0;
        continue;
      }
      const a = m[i] / d[i];
      const b = m[i + 1] / d[i];
      const s = a * a + b * b;
      if (s > 9) {
        const t = 3 / Math.sqrt(s);
        m[i] = t * a * d[i];
        m[i + 1] = t * b * d[i];
      }
    }
    for (let i = 0; i < n - 1; i++) {
      const c = dx / 3;
      line += ` C${r(xs[i] + c)},${r(ys[i] + m[i] * c)} ${r(xs[i + 1] - c)},${r(ys[i + 1] - m[i + 1] * c)} ${r(xs[i + 1])},${r(ys[i + 1])}`;
    }
  }
  return { line, area: `${line} L${r(xs[n - 1])},100 L${r(xs[0])},100 Z` };
}

/**
 * The series colours as the browser resolves them right now (rgb() strings), for canvas chart libraries (Chart.js,
 * ECharts) that can't read CSS variables. SVG libraries (Recharts, Nivo, D3) take var(--ayy-chart-1) directly.
 * Read them again after setTheme().
 */
export function chartColors(target: Element = document.documentElement, count = CHART_SERIES): string[] {
  return resolveColors(target, Array.from({ length: count }, (_, i) => `var(--ayy-chart-${(i % CHART_SERIES) + 1})`));
}

export interface ChartTheme {
  colors: string[];
  text: string;
  muted: string;
  grid: string;
  surface: string;
  fontFamily: string;
}

/** Everything a canvas chart needs to match the page: series colours, text, muted labels, grid lines, tooltip surface, font. */
export function chartTheme(target: Element = document.documentElement): ChartTheme {
  const [text, muted, grid, surface] = resolveColors(target, [
    "var(--ayy-color-text)",
    "var(--ayy-color-muted)",
    "var(--ayy-color-hairline)",
    "var(--ayy-color-surface-raised)",
  ]);
  return { colors: chartColors(target), text, muted, grid, surface, fontFamily: getComputedStyle(target).getPropertyValue("--ayy-font-body").trim() };
}

function resolveColors(target: Element, colors: string[]): string[] {
  // A probe inherits the target's theme; its computed colour is the resolved value, whatever the token is made of.
  const host = target === document.documentElement ? document.body ?? target : target;
  const probe = document.createElement("span");
  probe.style.display = "none";
  host.appendChild(probe);
  const out = colors.map((value) => {
    probe.style.color = value;
    return getComputedStyle(probe).color;
  });
  probe.remove();
  return out;
}
