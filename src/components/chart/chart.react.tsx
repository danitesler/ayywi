import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode, type SVGAttributes } from "react";
import { cx } from "../../lib/cx";
import {
  barListClass,
  barListItemClass,
  barListLabelClass,
  barListValueClass,
  chartClass,
  chartLegendItemClass,
  chartPath,
  chartPercent,
  chartScale,
  chartSeriesClass,
  sparklineClass,
} from "./chart";

export interface ChartSeries {
  name: string;
  /** One number per label. */
  values: number[];
  /** Any CSS colour instead of the next chart token, e.g. "var(--ayy-color-success)" for a goal. */
  color?: string;
}

const compact = new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 });
const formatCompact = (value: number) => compact.format(value);

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

interface DataTableProps {
  label: string;
  labels: string[];
  series: { name: string; values: number[] }[];
  format: (value: number) => string;
}

/** The numbers behind the drawing, for screen readers (the drawing itself is aria-hidden). */
function ChartData({ label, labels, series, format }: DataTableProps) {
  return (
    <table className="ayy-sr-only">
      <caption>{label}</caption>
      <thead>
        <tr>
          <td />
          {series.map((s) => (
            <th key={s.name} scope="col">
              {s.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {labels.map((name, i) => (
          <tr key={`${name}-${i}`}>
            <th scope="row">{name}</th>
            {series.map((s) => (
              <td key={s.name}>{Number.isFinite(s.values[i]) ? format(s.values[i]) : ""}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Legend({ series }: { series: { name: string; color?: string; compare?: boolean }[] }) {
  return (
    <ul className="ayy-chart__legend" aria-hidden="true">
      {series.map((s) => (
        <li key={s.name} className={chartLegendItemClass({ compare: s.compare })} style={vars({ "--ayy-chart-color": s.color })}>
          <span className="ayy-chart__swatch" />
          {s.name}
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

function Ticks({ scale, format }: { scale: { min: number; max: number; ticks: number[] }; format: (value: number) => string }) {
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
  /** Stack each column's bars instead of putting them side by side. */
  stacked?: boolean;
  /** Print every bar's value above it, not only on hover. */
  showValues?: boolean;
}

/** Columns drawn by CSS: one column per label, one bar per series, with value lines, a legend and a data table. */
export const BarChart = forwardRef<HTMLElement, BarChartProps>(function BarChart(
  { label, labels, series, stacked, showValues, max, ticks = 3, format = formatCompact, height, legend, className, style, ...props },
  ref,
) {
  const totals = labels.map((_, i) => series.reduce((sum, s) => sum + (s.values[i] || 0), 0));
  const scale = chartScale(stacked ? totals : series.flatMap((s) => s.values), { ticks: Math.max(2, ticks), max });
  const shown = shownLabels(labels.length, 8, false);
  return (
    <figure ref={ref} className={chartClass({ stacked, values: showValues, className })} style={vars({ "--ayy-chart-height": height }, style)} {...props}>
      <div className="ayy-chart__plot" aria-hidden="true">
        {ticks > 0 && <Ticks scale={scale} format={format} />}
        <div className="ayy-chart__bars">
          {labels.map((name, i) => (
            <div key={`${name}-${i}`} className="ayy-chart__column">
              {series.map((s) => (
                <span
                  key={s.name}
                  className="ayy-chart__bar"
                  data-value={Number.isFinite(s.values[i]) ? format(s.values[i]) : undefined}
                  style={vars({ "--ayy-value": chartPercent(s.values[i] ?? 0, scale.max), "--ayy-chart-color": s.color })}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="ayy-chart__labels" aria-hidden="true">
        {labels.map((name, i) => (
          <span key={`${name}-${i}`}>{shown.has(i) ? name : ""}</span>
        ))}
      </div>
      {(legend ?? series.length > 1) && <Legend series={series} />}
      <ChartData label={label} labels={labels} series={series} format={format} />
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
}

/** Lines (and the area under them) over evenly spaced points, as SVG paths stretched to the plot. */
export const LineChart = forwardRef<HTMLElement, LineChartProps>(function LineChart(
  { label, labels, series, min = 0, max, ticks = 3, area = true, smooth = true, format = formatCompact, height, legend, className, style, ...props },
  ref,
) {
  const scale = chartScale(series.flatMap((s) => s.values), { ticks: Math.max(2, ticks), min, max });
  const shown = shownLabels(labels.length, 5, true);
  return (
    <figure ref={ref} className={chartClass({ className })} style={vars({ "--ayy-chart-height": height }, style)} {...props}>
      <div className="ayy-chart__plot" aria-hidden="true">
        {ticks > 0 && <Ticks scale={scale} format={format} />}
        <svg className="ayy-chart__svg" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
          {series.map((s) => {
            const path = chartPath(s.values, { min: scale.min, max: scale.max, smooth });
            return (
              <g key={s.name} className={chartSeriesClass({ compare: s.compare })} style={vars({ "--ayy-chart-color": s.color })}>
                {area && !s.compare && <path className="ayy-chart__area" d={path.area} />}
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
      <ChartData label={label} labels={labels} series={series} format={format} />
    </figure>
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
  const low = min ?? Math.min(...values);
  const path = chartPath(values, { min: low, max: max ?? Math.max(...values), smooth: true });
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
      {area && <path className="ayy-chart__area" d={path.area} />}
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

const grouped = new Intl.NumberFormat();

/** Ranked rows with the bar behind the text: top pages, sources, countries. Readable as is, no table needed. */
export const BarList = forwardRef<HTMLOListElement, BarListProps>(function BarList(
  { items, max, format = (value) => grouped.format(value), color, className, style, ...props },
  ref,
) {
  const top = max ?? Math.max(0, ...items.map((item) => item.value));
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
