import { cx } from "../../lib/cx";

/** Chart types with a layout of their own (a modifier on .ayy-chart). Columns, lines, scatters and donuts need none. */
export const chartTypes = ["histogram", "combo", "waterfall", "pie", "gauge", "radar"] as const;
export type ChartType = (typeof chartTypes)[number];

export interface ChartClassOptions {
  /** Bars of a column sit on top of each other; areas stack on the series below. */
  stacked?: boolean;
  /** Always show each bar's data-value above it (otherwise on hover). */
  values?: boolean;
  /** One row per label, the bars running along the reading direction. */
  horizontal?: boolean;
  /** A chart type with its own layout: histogram, combo, waterfall, pie, gauge or radar. */
  type?: ChartType;
  className?: string;
}

export function chartClass({ stacked, values, horizontal, type, className }: ChartClassOptions = {}): string {
  return cx(
    "ayy-chart",
    stacked && "ayy-chart--stacked",
    values && "ayy-chart--values",
    horizontal && "ayy-chart--horizontal",
    type && `ayy-chart--${type}`,
    className,
  );
}

export interface ChartSeriesClassOptions {
  compare?: boolean;
  className?: string;
}

export function chartSeriesClass({ compare, className }: ChartSeriesClassOptions = {}): string {
  return cx("ayy-chart__series", compare && "ayy-chart__series--compare", className);
}

export interface ChartLegendItemClassOptions {
  compare?: boolean;
  /** A line swatch, for a line drawn over columns (a combo). */
  line?: boolean;
  className?: string;
}

export function chartLegendItemClass({ compare, line, className }: ChartLegendItemClassOptions = {}): string {
  return cx("ayy-chart__legend-item", compare && "ayy-chart__legend-item--compare", line && "ayy-chart__legend-item--line", className);
}

export const chartGradientClass = "ayy-chart__gradient";
export const chartPlotClass = "ayy-chart__plot";
export const chartTickClass = "ayy-chart__tick";
export const chartBarsClass = "ayy-chart__bars";
export const chartColumnClass = "ayy-chart__column";
export const chartBarClass = "ayy-chart__bar";
export const chartBarUpClass = "ayy-chart__bar--up";
export const chartBarDownClass = "ayy-chart__bar--down";
export const chartSvgClass = "ayy-chart__svg";
export const chartLineClass = "ayy-chart__line";
export const chartAreaClass = "ayy-chart__area";
export const chartLabelsClass = "ayy-chart__labels";
export const chartLegendClass = "ayy-chart__legend";
export const chartLegendToggleClass = "ayy-chart__legend-toggle";
export const chartTooltipClass = "ayy-chart__tooltip";
export const chartTooltipTitleClass = "ayy-chart__tooltip-title";
export const chartTooltipRowClass = "ayy-chart__tooltip-row";
export const chartTooltipNameClass = "ayy-chart__tooltip-name";
export const chartTooltipValueClass = "ayy-chart__tooltip-value";
export const chartHitsClass = "ayy-chart__hits";
export const chartHitClass = "ayy-chart__hit";
export const chartMarkerClass = "ayy-chart__marker";
export const chartSwatchClass = "ayy-chart__swatch";
export const chartLegendValueClass = "ayy-chart__legend-value";
export const chartAxisClass = "ayy-chart__axis";
export const chartDotClass = "ayy-chart__dot";
export const chartRingClass = "ayy-chart__ring";
export const chartTrackClass = "ayy-chart__track";
export const chartSliceClass = "ayy-chart__slice";
export const chartTotalClass = "ayy-chart__total";
export const chartTotalValueClass = "ayy-chart__total-value";
export const chartGridClass = "ayy-chart__grid";
export const chartLabelClass = "ayy-chart__label";
export const barListClass = "ayy-bar-list";
export const barListItemClass = "ayy-bar-list__item";
export const barListLabelClass = "ayy-bar-list__label";
export const barListValueClass = "ayy-bar-list__value";
export const sparklineClass = "ayy-sparkline";
export const heatmapClass = "ayy-heatmap";
export const heatmapRowClass = "ayy-heatmap__row";
export const heatmapLabelClass = "ayy-heatmap__label";
export const heatmapCellClass = "ayy-heatmap__cell";
export const heatmapKeyClass = "ayy-heatmap__key";
export const funnelClass = "ayy-funnel";
export const funnelStepClass = "ayy-funnel__step";
export const funnelLabelClass = "ayy-funnel__label";
export const funnelBarClass = "ayy-funnel__bar";
export const funnelValueClass = "ayy-funnel__value";
export const funnelRateClass = "ayy-funnel__rate";

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
  const step = max !== undefined ? (max - min) / (count - 1) : niceStep((values.reduce((a, b) => Math.max(a, b), min) - min) / (count - 1));
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
  /** Steps instead of slopes: each value holds until halfway to the next. Wins over smooth. */
  step?: boolean;
  /** Points at the centres of n equal bands ((i + 0.5) / n) instead of from edge to edge, to sit over columns (a combo). */
  band?: boolean;
  /** The area's floor follows these values (the series below, for stacked areas) instead of the bottom of the scale. */
  base?: readonly number[];
}

const r2 = (v: number) => Math.round(v * 100) / 100;

/** Path commands from the first point to the last (without the opening M). xs needn't increase: a base runs backwards. */
function trace(xs: number[], ys: number[], smooth: boolean, step: boolean): string {
  const n = xs.length;
  let out = "";
  if (step) {
    for (let i = 1; i < n; i++) {
      const mid = r2((xs[i - 1] + xs[i]) / 2);
      out += ` L${mid},${r2(ys[i - 1])} L${mid},${r2(ys[i])}`;
    }
    return n > 1 ? `${out} L${r2(xs[n - 1])},${r2(ys[n - 1])}` : out;
  }
  if (!smooth || n < 3) {
    for (let i = 1; i < n; i++) out += ` L${r2(xs[i])},${r2(ys[i])}`;
    return out;
  }
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
    out += ` C${r2(xs[i] + c)},${r2(ys[i] + m[i] * c)} ${r2(xs[i + 1] - c)},${r2(ys[i + 1] - m[i + 1] * c)} ${r2(xs[i + 1])},${r2(ys[i + 1])}`;
  }
  return out;
}

/**
 * SVG path data for a line through `values`, evenly spaced, in the 0 0 100 100 box that .ayy-chart__svg and
 * .ayy-sparkline use (y = 0 is the top), and for the area under it. Use with vector-effect: non-scaling-stroke
 * (the line class sets it) so the stretched box keeps a 2px line.
 */
export function chartPath(
  values: readonly number[],
  { min = 0, max, smooth = false, step = false, band = false, base }: ChartPathOptions = {},
): { line: string; area: string } {
  if (!values.length) return { line: "", area: "" };
  // reduce, not Math.max(...values): spreading a long series overflows the call stack.
  const top = max ?? values.reduce((a, b) => Math.max(a, b), -Infinity);
  const span = top - min || 1;
  const n = values.length;
  const xs = values.map((_, i) => (band ? ((i + 0.5) / n) * 100 : n === 1 ? 50 : (i / (n - 1)) * 100));
  const y = (v: number) => 100 - Math.min(100, Math.max(0, ((v - min) / span) * 100));
  const ys = values.map(y);
  const line = `M${r2(xs[0])},${r2(ys[0])}${trace(xs, ys, smooth, step)}`;
  if (base?.length === n) {
    const bx = [...xs].reverse();
    const by = base.map(y).reverse();
    return { line, area: `${line} L${r2(bx[0])},${r2(by[0])}${trace(bx, by, smooth, step)} Z` };
  }
  return { line, area: `${line} L${r2(xs[n - 1])},100 L${r2(xs[0])},100 Z` };
}

/**
 * Running totals for stacked series: chartStack([[1, 2], [3, 4]]) → [[1, 2], [4, 6]], each series' top. With
 * percent, every point's total is 100 (a 100% stacked chart).
 */
export function chartStack(series: readonly (readonly number[])[], { percent = false }: { percent?: boolean } = {}): number[][] {
  const length = series.reduce((most, s) => Math.max(most, s.length), 0);
  const totals = Array.from({ length }, (_, i) => series.reduce((sum, s) => sum + (Number.isFinite(s[i]) ? s[i] : 0), 0));
  const running = new Array<number>(length).fill(0);
  return series.map((s) =>
    running.map((sum, i) => {
      const value = Number.isFinite(s[i]) ? s[i] : 0;
      running[i] = sum + (percent ? (totals[i] ? (value / totals[i]) * 100 : 0) : value);
      return tidy(running[i]);
    }),
  );
}

export interface ChartBins {
  /** Bin edges, one more than the counts: bin i holds values from edges[i] up to (not including) edges[i + 1]. */
  edges: number[];
  counts: number[];
}

/**
 * Counts of values in equal, round-edged bins, for a histogram: chartBins([12, 48, 51, 97], { bins: 5 }) → edges
 * 0, 20 … 100 and counts [1, 0, 2, 0, 1]. About √n bins by default (at most 20); the last bin includes the largest value.
 */
export function chartBins(values: readonly number[], { bins, min, max }: { bins?: number; min?: number; max?: number } = {}): ChartBins {
  const finite = values.filter(Number.isFinite);
  if (!finite.length) return { edges: [], counts: [] };
  const lo = min ?? finite.reduce((a, b) => Math.min(a, b), Infinity);
  const hi = max ?? finite.reduce((a, b) => Math.max(a, b), -Infinity);
  const want = Math.max(1, Math.round(bins ?? Math.min(20, Math.ceil(Math.sqrt(finite.length)))));
  const size = niceStep((hi - lo) / want || 1);
  const start = tidy(Math.floor(lo / size) * size);
  const count = Math.max(1, Math.ceil(tidy((hi - start) / size)) + (hi === start ? 1 : 0));
  const edges = Array.from({ length: count + 1 }, (_, i) => tidy(start + i * size));
  const counts = new Array<number>(count).fill(0);
  for (const v of finite) {
    if (v < start || v > edges[count]) continue;
    counts[Math.min(count - 1, Math.floor((v - start) / size))]++;
  }
  return { edges, counts };
}

/** Where each slice of a donut, pie or gauge starts and how long it is, as shares of the whole (0–100). */
export function chartSlices(values: readonly number[], { total }: { total?: number } = {}): { start: number; value: number }[] {
  const whole = total ?? values.reduce((sum, v) => sum + (v > 0 ? v : 0), 0);
  let start = 0;
  return values.map((v) => {
    const value = whole > 0 && v > 0 ? Math.round((v / whole) * 1000) / 10 : 0;
    const slice = { start: Math.round(start * 10) / 10, value };
    start += value;
    return slice;
  });
}

/** Where spoke i of n is, at a share of the radius (1 = the outer ring), in the 0 0 100 100 box: the first spoke points up. */
export function chartRadarPoint(index: number, count: number, share = 1, radius = 40): { x: number; y: number } {
  const angle = (index / Math.max(1, count)) * 2 * Math.PI - Math.PI / 2;
  return { x: r2(50 + Math.cos(angle) * radius * share), y: r2(50 + Math.sin(angle) * radius * share) };
}

/** A closed SVG path through one value per spoke, for a radar's __area and __line (0 0 100 100 box, radius 40). */
export function chartRadar(values: readonly number[], { min = 0, max }: { min?: number; max?: number } = {}): string {
  if (!values.length) return "";
  const top = max ?? values.reduce((a, b) => Math.max(a, b), -Infinity);
  const span = top - min || 1;
  const points = values.map((v, i) => chartRadarPoint(i, values.length, Math.min(1, Math.max(0, (v - min) / span))));
  return `${points.map((p, i) => `${i ? "L" : "M"}${p.x},${p.y}`).join(" ")} Z`;
}

export interface ChartWaterfallStep {
  value: number;
  /** A total (the start, a subtotal, the end): a bar from zero to this value, not a change. */
  total?: boolean;
}

/**
 * Where each waterfall bar runs, in data units: a total from 0 to its value; a change from the running total to
 * the running total plus the change. change says which way it went (undefined for a total).
 */
export function chartWaterfall(steps: readonly ChartWaterfallStep[]): { from: number; to: number; change?: "up" | "down" }[] {
  let running = 0;
  return steps.map((step) => {
    if (step.total) {
      running = step.value;
      return { from: 0, to: step.value };
    }
    const from = running;
    running = tidy(running + step.value);
    return { from, to: running, change: step.value < 0 ? "down" : "up" };
  });
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

/**
 * Page-wide behaviour for a legend that switches series off (the HTML twin of a chart's `toggle` prop): flips the entry's
 * aria-pressed and hides or shows the same-numbered series (data-hidden). The last one that's on stays on. Rings and stacked
 * areas need their shares worked out again, so they're left to the React charts.
 */
export function toggleChartLegend(button: Element): void {
  const item = button.closest(".ayy-chart__legend-item");
  const chart = button.closest(".ayy-chart");
  if (!item?.parentElement) return;
  if (!chart) {
    // A legend on its own: it only keeps the buttons' state, for the page to read.
    const pressedAlone = button.getAttribute("aria-pressed") === "true";
    if (!pressedAlone || [...item.parentElement.children].filter((li) => li.querySelector('[aria-pressed="true"]')).length > 1) button.setAttribute("aria-pressed", String(!pressedAlone));
    return;
  }
  if (chart.querySelector(".ayy-chart__ring") || chart.matches(".ayy-chart--stacked:has(.ayy-chart__svg)")) return;
  const items = [...item.parentElement.children];
  const pressed = button.getAttribute("aria-pressed") === "true";
  if (pressed && items.filter((li) => li.querySelector('[aria-pressed="true"]')).length < 2) return;
  button.setAttribute("aria-pressed", String(!pressed));
  const index = items.indexOf(item);
  const columns = [...chart.querySelectorAll(".ayy-chart__column")];
  const bars = columns[0]?.children.length ?? 0;
  const targets = index < bars ? columns.map((column) => column.children[index]) : [chart.querySelectorAll(".ayy-chart__plot .ayy-chart__series")[index - bars]];
  for (const target of targets) {
    if (pressed) target?.setAttribute("data-hidden", "");
    else target?.removeAttribute("data-hidden");
  }
}
