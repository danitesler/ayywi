import { forwardRef, useId, type CSSProperties, type HTMLAttributes, type ReactNode, type SVGAttributes, type TableHTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import {
  barListClass,
  barListItemClass,
  barListLabelClass,
  barListValueClass,
  CHART_SERIES,
  chartBarDownClass,
  chartBarUpClass,
  chartBins,
  chartClass,
  chartLegendItemClass,
  chartPath,
  chartPercent,
  chartRadar,
  chartRadarPoint,
  chartScale,
  chartSeriesClass,
  chartSlices,
  chartStack,
  chartWaterfall,
  funnelClass,
  heatmapClass,
  sparklineClass,
  type ChartScale,
} from "./chart";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../table/table.react";

export interface ChartSeries {
  name: string;
  /** One number per label. */
  values: number[];
  /** Any CSS colour instead of the next chart token, e.g. "var(--ayy-color-success)" for a goal. */
  color?: string;
}

const compact = new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 });
const formatCompact = (value: number) => compact.format(value);

/** An SVG-safe id (useId's colons and guillemets don't survive url(#…)). */
const svgId = (id: string) => `ayy-${id.replace(/[^a-zA-Z0-9_-]/g, "")}`;

/** The vertical fade an __area fills with: inside the series' <g>, so its stops take the series colour. */
function Fade({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} className="ayy-chart__gradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" />
        <stop offset="1" />
      </linearGradient>
    </defs>
  );
}

const vars = (values: Record<string, string | number | undefined>, style?: CSSProperties) => ({ ...values, ...style }) as CSSProperties;

/**
 * Indexes of the labels to print when they don't all fit: every nth under columns; under a line, evenly spaced
 * points from the first to the last, since those labels spread to both ends.
 */
function shownLabels(count: number, room: number, ends: boolean): Set<number> {
  if (count <= room) return new Set(Array.from({ length: count }, (_, i) => i));
  if (ends) return new Set(Array.from({ length: room }, (_, i) => Math.round((i * (count - 1)) / (room - 1))));
  const step = Math.ceil(count / room);
  return new Set(Array.from({ length: Math.ceil(count / step) }, (_, i) => i * step));
}

/** The n-th series colour token, for a series that doesn't take its colour from its position. */
const seriesColor = (i: number) => `var(--ayy-chart-${(i % CHART_SERIES) + 1})`;

const percentFormat = new Intl.NumberFormat(undefined, { style: "percent", maximumFractionDigits: 1 });
const grouped = new Intl.NumberFormat();
const formatGrouped = (value: number) => grouped.format(value);

interface DataTableProps {
  label: string;
  /** Row headers, one per row. */
  labels: string[];
  /** Column headers. */
  columns: string[];
  /** The cells' text, one array per row. */
  rows: string[][];
}

/**
 * The numbers behind the drawing, for screen readers (the drawing itself is aria-hidden). In a visually hidden div,
 * not a hidden table: a table can't be narrower than its content, so a long caption would widen the page.
 */
function ChartData({ label, labels, columns, rows }: DataTableProps) {
  return (
    <div className="ayy-sr-only">
      <table>
        <caption>{label}</caption>
        <thead>
          <tr>
            <td />
            {columns.map((name, i) => (
              <th key={`${name}-${i}`} scope="col">
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {labels.map((name, i) => (
            <tr key={`${name}-${i}`}>
              <th scope="row">{name}</th>
              {columns.map((column, j) => (
                <td key={`${column}-${j}`}>{rows[i]?.[j] ?? ""}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Each series' value at each label, formatted: the rows of a ChartData. */
const seriesRows = (labels: string[], series: { values: number[] }[], format: (value: number) => string) =>
  labels.map((_, i) => series.map((s) => (Number.isFinite(s.values[i]) ? format(s.values[i]) : "")));

interface LegendEntry {
  name: string;
  color?: string;
  compare?: boolean;
  line?: boolean;
  value?: string;
}

function Legend({ series }: { series: LegendEntry[] }) {
  return (
    <ul className="ayy-chart__legend" aria-hidden="true">
      {series.map((s, i) => (
        <li key={`${s.name}-${i}`} className={chartLegendItemClass({ compare: s.compare, line: s.line })} style={vars({ "--ayy-chart-color": s.color })}>
          <span className="ayy-chart__swatch" />
          {s.name}
          {s.value !== undefined && <span className="ayy-chart__legend-value">{s.value}</span>}
        </li>
      ))}
    </ul>
  );
}

export interface ChartBaseProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** What the chart shows ("Signups per day"). Becomes the caption of the data table screen readers get. */
  label: string;
  /** One per point or column, along the bottom. */
  labels: string[];
  /** Top of the scale. Rounded up from the data if omitted. */
  max?: number;
  /** How many value lines to draw (0 for none). Default 3. */
  ticks?: number;
  /** Formats tick labels, hover values and the data table. Default: compact numbers (1.2K). */
  format?: (value: number) => string;
  /** Plot height, any CSS length. Default 12rem. */
  height?: string;
  /** Show the legend. Default: when there's more than one series. */
  legend?: boolean;
}

function Ticks({ scale, format }: { scale: ChartScale; format: (value: number) => string }) {
  return (
    <>
      {scale.ticks.map((tick) => (
        <span key={tick} className="ayy-chart__tick" style={vars({ "--ayy-value": chartPercent(tick, scale.max, scale.min) })}>
          {format(tick)}
        </span>
      ))}
    </>
  );
}

export interface BarChartProps extends ChartBaseProps {
  series: ChartSeries[];
  /** Stack each column's bars instead of putting them side by side; "percent" makes every column 100%. */
  stacked?: boolean | "percent";
  /** Print every bar's value above it, not only on hover. */
  showValues?: boolean;
  /** One row per label with the bars along the reading direction, the labels beside them. */
  horizontal?: boolean;
  /** Lines over the columns, on the same scale (a combo): an average, or a target as a compare line. Not with horizontal. */
  lines?: LineChartSeries[];
}

interface ColumnChartProps extends BarChartProps {
  type?: "histogram";
  /** Names the rows of the data table, when they differ from the labels under the plot (a histogram's bin ranges). */
  rowLabels?: string[];
}

/** Columns or rows of bars: BarChart and HistogramChart. */
const ColumnChart = forwardRef<HTMLElement, ColumnChartProps>(function ColumnChart(
  { label, labels, series, stacked, showValues, horizontal, lines = [], max, ticks = 3, format = formatCompact, height, legend, type, rowLabels, className, style, ...props },
  ref,
) {
  const percent = stacked === "percent";
  const combo = !horizontal && lines.length > 0;
  const tops = stacked ? chartStack(series.map((s) => s.values), { percent }) : [];
  const scaled = stacked ? (tops[tops.length - 1] ?? []) : series.flatMap((s) => s.values);
  const scale = chartScale(combo ? [...scaled, ...lines.flatMap((s) => s.values)] : scaled, { ticks: Math.max(2, ticks), max: percent ? 100 : max });
  const shown = shownLabels(labels.length, horizontal ? labels.length : 8, false);
  // A stacked part's height: its share of the column (percent) or its own value.
  const part = (k: number, i: number) => (percent ? tops[k][i] - (k ? tops[k - 1][i] : 0) : (series[k].values[i] ?? 0));
  const all = combo ? [...series, ...lines] : series;
  return (
    <figure
      ref={ref}
      className={chartClass({ stacked: !!stacked, values: showValues, horizontal, type: combo ? "combo" : type, className })}
      style={vars({ "--ayy-chart-height": height }, style)}
      {...props}
    >
      <div className="ayy-chart__plot" aria-hidden="true">
        {ticks > 0 && <Ticks scale={scale} format={percent ? (value) => percentFormat.format(value / 100) : format} />}
        <div className="ayy-chart__bars">
          {labels.map((name, i) => (
            <div key={`${name}-${i}`} className="ayy-chart__column">
              {series.map((s, k) => (
                <span
                  key={s.name}
                  className="ayy-chart__bar"
                  data-value={Number.isFinite(s.values[i]) ? format(s.values[i]) : undefined}
                  style={vars({ "--ayy-value": chartPercent(part(k, i), scale.max), "--ayy-chart-color": s.color })}
                />
              ))}
            </div>
          ))}
        </div>
        {combo && (
          <svg className="ayy-chart__svg" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
            {lines.map((s, i) => (
              <g
                key={s.name}
                className={chartSeriesClass({ compare: s.compare })}
                style={vars({ "--ayy-chart-color": s.color ?? (s.compare ? undefined : seriesColor(series.length + i)) })}
              >
                <path className="ayy-chart__line" d={chartPath(s.values, { min: scale.min, max: scale.max, smooth: true, band: true }).line} />
              </g>
            ))}
          </svg>
        )}
      </div>
      <div className="ayy-chart__labels" aria-hidden="true">
        {labels.map((name, i) => (
          <span key={`${name}-${i}`}>{shown.has(i) ? name : ""}</span>
        ))}
      </div>
      {(legend ?? all.length > 1) && <Legend series={[...series, ...(combo ? lines.map((s) => ({ ...s, line: !s.compare })) : [])]} />}
      <ChartData label={label} labels={rowLabels ?? labels} columns={all.map((s) => s.name)} rows={seriesRows(labels, all, format)} />
    </figure>
  );
});

/** Columns drawn by CSS: one column per label, one bar per series, with value lines, a legend and a data table. */
export const BarChart = forwardRef<HTMLElement, BarChartProps>(function BarChart(props, ref) {
  return <ColumnChart ref={ref} {...props} />;
});

export interface HistogramChartProps extends Omit<ChartBaseProps, "labels" | "legend"> {
  /** The raw values: they're counted into bins. */
  values: number[];
  /** About how many bins; their edges are rounded. Default: about the square root of the count, at most 20. */
  bins?: number;
  /** The values the bins cover. Default: the lowest to the highest. */
  range?: [number, number];
  /** Formats the bin edges under the plot and in the data table. Default: compact numbers. */
  formatBin?: (value: number) => string;
  /** What's counted, the data table's column header ("Requests"). Default: the label. */
  name?: string;
  /** Any CSS colour instead of chart-1. */
  color?: string;
}

/** A distribution: values counted into equal bins, drawn as touching columns, each bin's start under it. */
export const HistogramChart = forwardRef<HTMLElement, HistogramChartProps>(function HistogramChart(
  { values, bins, range, formatBin = formatCompact, name, color, label, ...props },
  ref,
) {
  const { edges, counts } = chartBins(values, { bins, min: range?.[0], max: range?.[1] });
  return (
    <ColumnChart
      ref={ref}
      type="histogram"
      label={label}
      labels={counts.map((_, i) => formatBin(edges[i]))}
      rowLabels={counts.map((_, i) => `${formatBin(edges[i])}–${formatBin(edges[i + 1])}`)}
      series={[{ name: name ?? label, values: counts, color }]}
      legend={false}
      {...props}
    />
  );
});

export interface WaterfallStep {
  label: string;
  /** A change (negative for a drop), or a total's value. */
  value: number;
  /** A total (the start, a subtotal, the end): a bar from zero, not a change. */
  total?: boolean;
}

export interface WaterfallChartProps extends Omit<ChartBaseProps, "labels" | "legend"> {
  steps: WaterfallStep[];
  /** Bottom of the scale. Default 0, or the lowest running total if it goes below. */
  min?: number;
  /** What's measured, the data table's column header ("MRR"). Default: the label. */
  name?: string;
}

/** How a total becomes another: each change floats from the running total, rises in success and falls in destructive. */
export const WaterfallChart = forwardRef<HTMLElement, WaterfallChartProps>(function WaterfallChart(
  { label, steps, min, max, ticks = 3, format = formatCompact, height, name, className, style, ...props },
  ref,
) {
  const runs = chartWaterfall(steps);
  const lowest = runs.reduce((low, run) => Math.min(low, run.from, run.to), 0);
  const scale = chartScale(
    runs.map((run) => Math.max(run.from, run.to)),
    { ticks: Math.max(2, ticks), min: min ?? lowest, max },
  );
  const text = (step: WaterfallStep) => (step.total ? format(step.value) : step.value < 0 ? `\u2212${format(-step.value)}` : `+${format(step.value)}`);
  const shown = shownLabels(steps.length, 8, false);
  return (
    <figure
      ref={ref}
      className={chartClass({ values: true, type: "waterfall", className })}
      style={vars({ "--ayy-chart-height": height }, style)}
      {...props}
    >
      <div className="ayy-chart__plot" aria-hidden="true">
        {ticks > 0 && <Ticks scale={scale} format={format} />}
        <div className="ayy-chart__bars">
          {steps.map((step, i) => {
            const start = chartPercent(Math.min(runs[i].from, runs[i].to), scale.max, scale.min);
            const end = chartPercent(Math.max(runs[i].from, runs[i].to), scale.max, scale.min);
            return (
              <div key={`${step.label}-${i}`} className="ayy-chart__column">
                <span
                  className={cx("ayy-chart__bar", runs[i].change === "up" && chartBarUpClass, runs[i].change === "down" && chartBarDownClass)}
                  data-value={text(step)}
                  style={vars({ "--ayy-start": start, "--ayy-value": Math.round((end - start) * 10) / 10 })}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="ayy-chart__labels" aria-hidden="true">
        {steps.map((step, i) => (
          <span key={`${step.label}-${i}`}>{shown.has(i) ? step.label : ""}</span>
        ))}
      </div>
      <ChartData label={label} labels={steps.map((step) => step.label)} columns={[name ?? label]} rows={steps.map((step) => [text(step)])} />
    </figure>
  );
});

export interface LineChartSeries extends ChartSeries {
  /** A quiet dashed line to compare with (last period, a target), without a fill. */
  compare?: boolean;
}

export interface LineChartProps extends ChartBaseProps {
  series: LineChartSeries[];
  /** Bottom of the scale. Default 0. */
  min?: number;
  /** Fill under the lines. Default true. */
  area?: boolean;
  /** Smooth curves (monotone, never past a point). Default true. */
  smooth?: boolean;
  /** Steps instead of slopes: each value holds until halfway to the next (prices, plans, seats). */
  step?: boolean;
  /** Stack the areas, each series on the one before it, so the top line is the total. Compare series stay apart. */
  stacked?: boolean;
}

/** Lines (and the area under them) over evenly spaced points, as SVG paths stretched to the plot. */
export const LineChart = forwardRef<HTMLElement, LineChartProps>(function LineChart(
  { label, labels, series, min = 0, max, ticks = 3, area = true, smooth = true, step, stacked, format = formatCompact, height, legend, className, style, ...props },
  ref,
) {
  const layers = stacked ? series.filter((s) => !s.compare) : [];
  const tops = chartStack(layers.map((s) => s.values));
  const scaled = stacked ? [...(tops[tops.length - 1] ?? []), ...series.filter((s) => s.compare).flatMap((s) => s.values)] : series.flatMap((s) => s.values);
  const scale = chartScale(scaled, { ticks: Math.max(2, ticks), min, max });
  const uid = svgId(useId());
  const shown = shownLabels(labels.length, 5, true);
  return (
    <figure ref={ref} className={chartClass({ stacked, className })} style={vars({ "--ayy-chart-height": height }, style)} {...props}>
      <div className="ayy-chart__plot" aria-hidden="true">
        {ticks > 0 && <Ticks scale={scale} format={format} />}
        <svg className="ayy-chart__svg" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
          {series.map((s, i) => {
            const layer = layers.indexOf(s);
            const path = chartPath(layer < 0 ? s.values : tops[layer], {
              min: scale.min,
              max: scale.max,
              smooth,
              step,
              base: layer > 0 ? tops[layer - 1] : undefined,
            });
            return (
              <g key={s.name} className={chartSeriesClass({ compare: s.compare })} style={vars({ "--ayy-chart-color": s.color })}>
                {layer >= 0 ? (
                  <path className="ayy-chart__area" d={path.area} />
                ) : (
                  area &&
                  !s.compare && (
                    <>
                      <Fade id={`${uid}-${i}`} />
                      <path className="ayy-chart__area" d={path.area} style={{ fill: `url(#${uid}-${i})` }} />
                    </>
                  )
                )}
                <path className="ayy-chart__line" d={path.line} />
              </g>
            );
          })}
        </svg>
      </div>
      <div className="ayy-chart__labels" aria-hidden="true">
        {labels.map((name, i) => (shown.has(i) ? <span key={`${name}-${i}`}>{name}</span> : null))}
      </div>
      {(legend ?? series.length > 1) && <Legend series={series} />}
      <ChartData label={label} labels={labels} columns={series.map((s) => s.name)} rows={seriesRows(labels, series, format)} />
    </figure>
  );
});

export interface ScatterPoint {
  x: number;
  y: number;
  /** A bubble's size: its area grows with it. */
  z?: number;
  /** Names the point in its hover text and the data table ("Acme Corp"). */
  label?: string;
}

export interface ScatterSeries {
  name: string;
  points: ScatterPoint[];
  /** Any CSS colour instead of the next chart token. */
  color?: string;
}

export interface ScatterChartProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** What the chart shows ("Deals by size and days to close"). Becomes the caption of the data table. */
  label: string;
  series: ScatterSeries[];
  /** Names the horizontal axis, under the plot and in the data table ("Deal size"). */
  xLabel: string;
  /** Names the vertical axis, above the plot and in the data table ("Days to close"). */
  yLabel: string;
  /** Names a bubble's size in the data table ("Customers"). */
  zLabel?: string;
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
  /** How many value lines and labels along each axis (0 for none). Default 3. */
  ticks?: number;
  /** Formats x values. Default: compact numbers. */
  formatX?: (value: number) => string;
  /** Formats y values. Default: compact numbers. */
  formatY?: (value: number) => string;
  /** Formats bubble sizes. Default: compact numbers. */
  formatZ?: (value: number) => string;
  /** Plot height, any CSS length. Default 12rem. */
  height?: string;
  /** Show the legend. Default: when there's more than one series. */
  legend?: boolean;
}

/** Points by two values (a third sizes them as bubbles): how two measures relate, and the outliers. */
export const ScatterChart = forwardRef<HTMLElement, ScatterChartProps>(function ScatterChart(
  {
    label,
    series,
    xLabel,
    yLabel,
    zLabel,
    xMin,
    xMax,
    yMin,
    yMax,
    ticks = 3,
    formatX = formatCompact,
    formatY = formatCompact,
    formatZ = formatCompact,
    height,
    legend,
    className,
    style,
    ...props
  },
  ref,
) {
  const points = series.flatMap((s) => s.points);
  const count = Math.max(2, ticks);
  const xs = chartScale(points.map((p) => p.x), { ticks: count, min: xMin, max: xMax });
  const ys = chartScale(points.map((p) => p.y), { ticks: count, min: yMin, max: yMax });
  const sized = points.some((p) => p.z !== undefined);
  const zTop = Math.sqrt(points.reduce((most, p) => Math.max(most, p.z ?? 0), 0));
  const describe = (p: ScatterPoint) =>
    `${p.label ? `${p.label}: ` : ""}${formatX(p.x)}, ${formatY(p.y)}${p.z !== undefined ? `, ${formatZ(p.z)}` : ""}`;
  const rows = series.flatMap((s) =>
    s.points.map((p, i) => ({
      name: p.label ? (series.length > 1 ? `${p.label} (${s.name})` : p.label) : `${s.name} ${i + 1}`,
      cells: [formatX(p.x), formatY(p.y), ...(sized ? [p.z !== undefined ? formatZ(p.z) : ""] : [])],
    })),
  );
  return (
    <figure ref={ref} className={chartClass({ className })} style={vars({ "--ayy-chart-height": height }, style)} {...props}>
      <span className="ayy-chart__axis" aria-hidden="true">
        {yLabel}
      </span>
      <div className="ayy-chart__plot" aria-hidden="true">
        {ticks > 0 && <Ticks scale={ys} format={formatY} />}
        {series.map((s) => (
          <div key={s.name} className="ayy-chart__series" style={vars({ "--ayy-chart-color": s.color })}>
            {s.points.map((p, i) => (
              <span
                key={i}
                className="ayy-chart__dot"
                data-value={describe(p)}
                style={vars({
                  "--ayy-x": chartPercent(p.x, xs.max, xs.min),
                  "--ayy-y": chartPercent(p.y, ys.max, ys.min),
                  "--ayy-z": p.z !== undefined && zTop > 0 ? chartPercent(Math.sqrt(Math.max(0, p.z)), zTop) : undefined,
                })}
              />
            ))}
          </div>
        ))}
      </div>
      {ticks > 0 && (
        <div className="ayy-chart__labels" aria-hidden="true">
          {xs.ticks.map((tick) => (
            <span key={tick}>{formatX(tick)}</span>
          ))}
        </div>
      )}
      <span className="ayy-chart__axis" aria-hidden="true">
        {xLabel}
      </span>
      {(legend ?? series.length > 1) && <Legend series={series} />}
      <ChartData
        label={label}
        labels={rows.map((row) => row.name)}
        columns={[xLabel, yLabel, ...(sized ? [zLabel ?? ""] : [])]}
        rows={rows.map((row) => row.cells)}
      />
    </figure>
  );
});

export interface DonutChartItem {
  name: string;
  value: number;
  /** Any CSS colour instead of the next chart token. */
  color?: string;
}

export interface DonutChartProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** What the chart shows ("Support tickets by channel"). Becomes the caption of the data table. */
  label: string;
  /** The parts of the whole; at most six read well. */
  items: DonutChartItem[];
  /** A solid pie instead of a ring, with no total in the middle. */
  pie?: boolean;
  /** The number in the middle of the ring. Default: the sum, formatted. */
  total?: ReactNode;
  /** A word or two under the total ("tickets"). */
  totalLabel?: ReactNode;
  /** What the values count, the data table's column header ("Tickets"). Default: the label. */
  name?: string;
  /** Formats the total and the values. Default: grouped digits (2,840). */
  format?: (value: number) => string;
  /** Width of the ring, any CSS length. Default 12rem. */
  size?: string;
  /** Show the legend, each part's share at its end. Default true. */
  legend?: boolean;
}

/** Parts of one whole as slices of a ring (or a pie), with the total in the middle and the shares in the legend. */
export const DonutChart = forwardRef<HTMLElement, DonutChartProps>(function DonutChart(
  { label, items, pie, total, totalLabel, name, format = formatGrouped, size, legend = true, className, style, ...props },
  ref,
) {
  const slices = chartSlices(items.map((item) => item.value));
  const sum = items.reduce((all, item) => all + (item.value > 0 ? item.value : 0), 0);
  const share = (i: number) => percentFormat.format(slices[i].value / 100);
  return (
    <figure ref={ref} className={chartClass({ type: pie ? "pie" : undefined, className })} style={vars({ "--ayy-chart-height": size }, style)} {...props}>
      <div className="ayy-chart__plot" aria-hidden="true">
        <svg className="ayy-chart__ring" viewBox="0 0 100 100" focusable="false">
          {items.map((item, i) => (
            <circle
              key={`${item.name}-${i}`}
              className="ayy-chart__slice"
              cx="50"
              cy="50"
              r={pie ? 25 : 40}
              pathLength="100"
              style={vars({ "--ayy-start": slices[i].start, "--ayy-value": slices[i].value, "--ayy-chart-color": item.color })}
            />
          ))}
        </svg>
        {!pie && (
          <p className="ayy-chart__total">
            <span className="ayy-chart__total-value">{total ?? format(sum)}</span>
            {totalLabel}
          </p>
        )}
      </div>
      {legend && <Legend series={items.map((item, i) => ({ name: item.name, color: item.color, value: share(i) }))} />}
      <ChartData
        label={label}
        labels={items.map((item) => item.name)}
        columns={[name ?? label]}
        rows={items.map((item, i) => [`${format(item.value)} (${share(i)})`])}
      />
    </figure>
  );
});

export interface GaugeChartProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** What it measures ("Budget used this month"): the meter's accessible name. */
  label: string;
  value: number;
  /** Default 0. */
  min?: number;
  /** Default 100. */
  max?: number;
  /** Formats the value in the middle. Default: grouped digits. */
  format?: (value: number) => string;
  /** The text under the value ("of $10K"). Also read after the value by screen readers. */
  totalLabel?: string;
  /** Any CSS colour instead of chart-1 ("var(--ayy-color-warning)" past a limit). */
  color?: string;
  /** Width of the arc, any CSS length. Default 12rem. */
  size?: string;
}

/** One value against its range as a half ring: a budget, a quota, a score. A meter for screen readers. */
export const GaugeChart = forwardRef<HTMLElement, GaugeChartProps>(function GaugeChart(
  { label, value, min = 0, max = 100, format = formatGrouped, totalLabel, color, size, className, style, ...props },
  ref,
) {
  return (
    <figure ref={ref} className={chartClass({ type: "gauge", className })} style={vars({ "--ayy-chart-height": size }, style)} {...props}>
      <div
        className="ayy-chart__plot"
        role="meter"
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={totalLabel ? `${format(value)} ${totalLabel}` : format(value)}
      >
        <svg className="ayy-chart__ring" viewBox="0 0 100 50" focusable="false" aria-hidden="true">
          <circle className="ayy-chart__track" cx="50" cy="50" r="40" pathLength="100" />
          <circle
            className="ayy-chart__slice"
            cx="50"
            cy="50"
            r="40"
            pathLength="100"
            style={vars({ "--ayy-value": chartPercent(value, max, min), "--ayy-chart-color": color })}
          />
        </svg>
        <p className="ayy-chart__total">
          <span className="ayy-chart__total-value">{format(value)}</span>
          {totalLabel}
        </p>
      </div>
    </figure>
  );
});

export interface RadarChartProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** What the chart shows ("Survey scores, this year and last"). Becomes the caption of the data table. */
  label: string;
  /** One per spoke, clockwise from the top. */
  axes: string[];
  /** One value per axis; compare draws a dashed outline without a fill. */
  series: LineChartSeries[];
  /** Centre of the scale. Default 0. */
  min?: number;
  /** Outer ring. Rounded up from the data if omitted. */
  max?: number;
  /** How many rings, counting the centre. Default 5. */
  ticks?: number;
  /** Formats the data table. Default: compact numbers. */
  format?: (value: number) => string;
  /** Width of the plot, any CSS length. Default 16rem. */
  size?: string;
  /** Show the legend. Default: when there's more than one series. */
  legend?: boolean;
}

/** A few measures per series, one spoke each, as closed shapes: profiles to compare at a glance. */
export const RadarChart = forwardRef<HTMLElement, RadarChartProps>(function RadarChart(
  { label, axes, series, min = 0, max, ticks = 5, format = formatCompact, size, legend, className, style, ...props },
  ref,
) {
  const scale = chartScale(series.flatMap((s) => s.values), { ticks: Math.max(2, ticks), min, max });
  const n = axes.length;
  const rings = scale.ticks.slice(1).map((tick) => chartRadar(new Array<number>(n).fill(tick), { min: scale.min, max: scale.max }));
  const spokes = axes.map((_, i) => {
    const p = chartRadarPoint(i, n);
    return `M50,50 L${p.x},${p.y}`;
  });
  return (
    <figure ref={ref} className={chartClass({ type: "radar", className })} style={vars({ "--ayy-chart-height": size }, style)} {...props}>
      <div className="ayy-chart__plot" aria-hidden="true">
        <svg className="ayy-chart__svg" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
          <path className="ayy-chart__grid" d={[...rings, ...spokes].join(" ")} />
          {series.map((s) => {
            const d = chartRadar(s.values, { min: scale.min, max: scale.max });
            return (
              <g key={s.name} className={chartSeriesClass({ compare: s.compare })} style={vars({ "--ayy-chart-color": s.color })}>
                <path className="ayy-chart__area" d={d} />
                <path className="ayy-chart__line" d={d} />
              </g>
            );
          })}
        </svg>
        {axes.map((name, i) => {
          const p = chartRadarPoint(i, n, 1, 42);
          return (
            <span key={`${name}-${i}`} className="ayy-chart__label" style={vars({ "--ayy-x": p.x, "--ayy-y": Math.round((100 - p.y) * 100) / 100 })}>
              {name}
            </span>
          );
        })}
      </div>
      {(legend ?? series.length > 1) && <Legend series={series} />}
      <ChartData label={label} labels={axes} columns={series.map((s) => s.name)} rows={seriesRows(axes, series, format)} />
    </figure>
  );
});

export interface HeatmapChartProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** What the chart shows ("Support tickets by hour"). Becomes the caption of the data table. */
  label: string;
  /** One per row, down the start side. */
  rows: string[];
  /** One per column, along the bottom (thinned when there are many). */
  columns: string[];
  /** values[row][column]. */
  values: number[][];
  /** Value of the darkest cell. Default: the largest value. */
  max?: number;
  /** Formats hover values and the data table. Default: grouped digits. */
  format?: (value: number) => string;
  /** Any CSS colour instead of chart-1. */
  color?: string;
  /** The words at the ends of the key under it. Default ["Less", "More"]; false hides the key. */
  legend?: [ReactNode, ReactNode] | false;
}

/** A grid of cells shaded by value: activity by day and hour, usage by team and week. */
export const HeatmapChart = forwardRef<HTMLElement, HeatmapChartProps>(function HeatmapChart(
  { label, rows, columns, values, max, format = formatGrouped, color, legend = ["Less", "More"], className, style, ...props },
  ref,
) {
  const top = max ?? values.reduce((most, row) => row.reduce((m, v) => (Number.isFinite(v) ? Math.max(m, v) : m), most), 0);
  const shown = shownLabels(columns.length, 8, false);
  const cell = (r: number, c: number) => values[r]?.[c] ?? Number.NaN;
  return (
    <figure ref={ref} className={chartClass({ className })} style={vars({ "--ayy-chart-color": color }, style)} {...props}>
      <div className={heatmapClass} aria-hidden="true" style={vars({ "--ayy-columns": columns.length })}>
        {rows.map((row, r) => (
          <div key={`${row}-${r}`} className="ayy-heatmap__row">
            <span className="ayy-heatmap__label">{row}</span>
            {columns.map((column, c) => {
              const v = cell(r, c);
              const known = Number.isFinite(v);
              return (
                <span
                  key={`${column}-${c}`}
                  className="ayy-heatmap__cell"
                  data-value={known ? `${row}, ${column}: ${format(v)}` : undefined}
                  style={vars({ "--ayy-value": known ? chartPercent(v, top) : 0 })}
                />
              );
            })}
          </div>
        ))}
        <div className="ayy-heatmap__row">
          <span />
          {columns.map((column, c) => (
            <span key={`${column}-${c}`} className="ayy-heatmap__label">
              {shown.has(c) ? column : ""}
            </span>
          ))}
        </div>
      </div>
      {legend && (
        <p className="ayy-heatmap__key" aria-hidden="true">
          <span>{legend[0]}</span>
          {[0, 25, 50, 75, 100].map((v) => (
            <span key={v} className="ayy-heatmap__cell" style={vars({ "--ayy-value": v })} />
          ))}
          <span>{legend[1]}</span>
        </p>
      )}
      <ChartData
        label={label}
        labels={rows}
        columns={columns}
        rows={rows.map((_, r) => columns.map((__, c) => (Number.isFinite(cell(r, c)) ? format(cell(r, c)) : "")))}
      />
    </figure>
  );
});

export interface FunnelStep {
  label: ReactNode;
  value: number;
}

export interface FunnelChartProps extends Omit<HTMLAttributes<HTMLOListElement>, "children"> {
  steps: FunnelStep[];
  /** Formats the values. Default: grouped digits (12,400). */
  format?: (value: number) => string;
  /** What each step's rate is a share of: the step before (default) or the first step. */
  rate?: "previous" | "first";
  /** Read after each rate by screen readers so the number makes sense. Default: "of the step before" / "of the first step". */
  rateLabel?: string;
  /** Any CSS colour instead of chart-1. */
  color?: string;
}

/** Steps people drop out of (visited, signed up, paid): each bar as wide as its share of the first, with the rate. */
export const FunnelChart = forwardRef<HTMLOListElement, FunnelChartProps>(function FunnelChart(
  { steps, format = formatGrouped, rate = "previous", rateLabel, color, className, style, ...props },
  ref,
) {
  const top = steps.reduce((most, step) => Math.max(most, step.value), 0);
  const words = rateLabel ?? (rate === "first" ? "of the first step" : "of the step before");
  return (
    <ol ref={ref} className={cx(funnelClass, className)} style={vars({ "--ayy-chart-color": color }, style)} {...props}>
      {steps.map((step, i) => {
        const base = rate === "first" ? steps[0].value : (steps[i - 1]?.value ?? step.value);
        return (
          <li key={i} className="ayy-funnel__step" style={vars({ "--ayy-value": chartPercent(step.value, top) })}>
            <span className="ayy-funnel__label">{step.label}</span>
            <span className="ayy-funnel__bar" />
            <span className="ayy-funnel__value">{format(step.value)}</span>
            <span className="ayy-funnel__rate">
              {percentFormat.format(base ? step.value / base : 0)}
              {i > 0 && <span className="ayy-sr-only"> {words}</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
});

export interface SparklineProps extends Omit<SVGAttributes<SVGSVGElement>, "values"> {
  values: number[];
  /** Announced as an image with this name ("Revenue, last 14 days, up 12%"). Without it the sparkline is decoration. */
  label?: string;
  /** Fill under the line. */
  area?: boolean;
  /** Any CSS colour instead of chart-1. */
  color?: string;
  min?: number;
  max?: number;
}

/** A small line with no axes, for a Stat or a table cell. */
export const Sparkline = forwardRef<SVGSVGElement, SparklineProps>(function Sparkline(
  { values, label, area, color, min, max, className, style, ...props },
  ref,
) {
  const uid = svgId(useId());
  const low = min ?? values.reduce((a, b) => Math.min(a, b), Infinity);
  const path = chartPath(values, { min: low, max, smooth: true });
  return (
    <svg
      ref={ref}
      className={cx(sparklineClass, className)}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      focusable="false"
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
      style={vars({ "--ayy-chart-color": color }, style as CSSProperties)}
      {...props}
    >
      {area && (
        <>
          <Fade id={uid} />
          <path className="ayy-chart__area" d={path.area} style={{ fill: `url(#${uid})` }} />
        </>
      )}
      <path className="ayy-chart__line" d={path.line} />
    </svg>
  );
});

export interface BarListItem {
  label: ReactNode;
  value: number;
  /** Makes the label a link. */
  href?: string;
}

export interface BarListProps extends Omit<HTMLAttributes<HTMLOListElement>, "children"> {
  items: BarListItem[];
  /** Value of a full-width bar. Default: the largest value. */
  max?: number;
  /** Formats the values. Default: grouped digits (8,210). */
  format?: (value: number) => string;
  /** Any CSS colour instead of chart-1. */
  color?: string;
}

/** Ranked rows with the bar behind the text: top pages, sources, countries. Readable as is, no table needed. */
export const BarList = forwardRef<HTMLOListElement, BarListProps>(function BarList(
  { items, max, format = formatGrouped, color, className, style, ...props },
  ref,
) {
  const top = max ?? items.reduce((most, item) => Math.max(most, item.value), 0);
  return (
    <ol ref={ref} className={cx(barListClass, className)} style={vars({ "--ayy-chart-color": color }, style)} {...props}>
      {items.map((item, i) => (
        <li key={i} className={barListItemClass} style={vars({ "--ayy-value": chartPercent(item.value, top) })}>
          <span className={barListLabelClass}>
            {item.href ? (
              <a className="ayy-link" href={item.href}>
                {item.label}
              </a>
            ) : (
              item.label
            )}
          </span>
          <span className={barListValueClass}>{format(item.value)}</span>
        </li>
      ))}
    </ol>
  );
});

export interface TableChartProps extends Omit<TableHTMLAttributes<HTMLTableElement>, "children"> {
  /** What the chart shows ("Signups per day"). Becomes the table's caption. */
  label: string;
  /** One per row along the side. */
  labels: string[];
  /** Columns of data. */
  series: (ChartSeries & { compare?: boolean })[];
  /** Formats cell values. Default: compact numbers (1.2K). */
  format?: (value: number) => string;
  /** Tighter row padding. */
  compact?: boolean;
}

/** A table view of chart data with series swatches in the headers and tabular numeric cells, using ayywi's Table. */
export const TableChart = forwardRef<HTMLTableElement, TableChartProps>(function TableChart(
  { label, labels, series, format = formatCompact, compact, className, ...props },
  ref,
) {
  return (
    <Table ref={ref} compact={compact} className={className} {...props}>
      {label && <TableCaption>{label}</TableCaption>}
      <TableHeader>
        <TableRow>
          <TableHead scope="col" />
          {series.map((s, i) => (
            <TableHead key={s.name} scope="col" numeric>
              <span
                className={chartLegendItemClass({ compare: s.compare })}
                style={vars({ "--ayy-chart-color": s.color ?? `var(--ayy-chart-${(i % CHART_SERIES) + 1})` })}
              >
                <span className="ayy-chart__swatch" />
                {s.name}
              </span>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {labels.map((name, i) => (
          <TableRow key={`${name}-${i}`}>
            <TableHead scope="row">{name}</TableHead>
            {series.map((s) => (
              <TableCell key={s.name} numeric>
                {Number.isFinite(s.values[i]) ? format(s.values[i]) : ""}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
});
