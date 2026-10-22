# Chart

Category: Data display. Charts drawn by CSS with no library: columns and bars (grouped, stacked, 100%, horizontal, with lines over them), histograms, waterfalls, lines and areas (stacked, stepped), scatters and bubbles, donuts, pies, gauges, radars, heatmaps, funnels, a ranked bar list and sparklines. Bars, slices, cells and ticks take --ayy-value (0–100), dots --ayy-x/--ayy-y, lines are SVG paths from chartPath(). Series colours are the chart tokens in order, so a chart library can match them. Also called: chart, bar-chart, line-chart, sparkline, graph, pie-chart, donut-chart, scatter-plot, bubble-chart, heatmap, funnel-chart, waterfall-chart, histogram, radar-chart, gauge.

**Classes**
- `.ayy-chart` — Root, usually a <figure>. A grid of the plot, the labels, the legend and the data table.
- `.ayy-chart--stacked` — A column's bars sit on top of each other; each bar's --ayy-value is its share of the top of the scale.
- `.ayy-chart--values` — Print every bar's data-value above it (otherwise only on hover).
- `.ayy-chart--horizontal` — One row per label with the bars along the reading direction: the __labels sit beside the plot, ticks become lines down it with their labels under it. Works with --stacked. Rows are 2rem.
- `.ayy-chart--histogram` — Columns touch (1px apart) and fill their bins, so they read as one distribution. Label each column with its bin's start; the labels sit at the start of their column.
- `.ayy-chart--combo` — Columns with lines over them: the columns split the width with no gap, so a line from chartPath(values, { band: true }) passes over their centres. Colour each line series with the next chart token (--ayy-chart-color on its __series).
- `.ayy-chart--waterfall` — Floating bars, solid and rounded at both ends: each __bar starts at --ayy-start (the running total before it, 0–100) and is --ayy-value tall. Use with --values so the signed changes show.
- `.ayy-chart--pie` — A solid pie: the __slice circles take r="25" and are stroked to the centre. No __total.
- `.ayy-chart--gauge` — A half ring over the top (viewBox="0 0 100 50"), filled from the start side: a __track behind one __slice (or a few), with a __total under the arc. Put role="meter" and its aria-value* on the __plot.
- `.ayy-chart--radar` — A square plot of an __svg with __grid rings and spokes, a __series per shape (closed __area and __line paths from chartRadar()) and an __label per spoke.
- `.ayy-chart__plot` — The drawing area (aria-hidden="true"). Height from --ayy-chart-height (default 12rem); square for a donut, pie or radar, half as tall for a gauge. Holds ticks and __bars, an __svg, __series of __dots or a __ring.
- `.ayy-chart__tick` — A value line across the plot, its text the label in the gutter. --ayy-value places it: 0 is the floor, 100 the top. The gutter only appears when there are ticks.
- `.ayy-chart__bars` — Row of columns filling the plot.
- `.ayy-chart__column` — One label's bars, side by side (or stacked).
- `.ayy-chart__bar` — A bar, fading toward its base (solid when stacked): --ayy-value is its height, data-value its text on hover, --ayy-start lifts it off the floor (a floating bar). Its colour is chart-1, chart-2… by position in the column; --ayy-chart-color overrides.
- `.ayy-chart__bar--up` — A waterfall's rise: the success colour.
- `.ayy-chart__bar--down` — A waterfall's drop: the destructive colour.
- `.ayy-chart__svg` — <svg viewBox="0 0 100 100" preserveAspectRatio="none"> stretched over the plot, for lines and areas. Mirrors in RTL.
- `.ayy-chart__series` — One series: a <g> around its area and line in an __svg, or a <div> of its __dots in a scatter. Coloured chart-1, chart-2… in order; --ayy-chart-color overrides.
- `.ayy-chart__series--compare` — A comparison series (last period, a target): dashed, quiet, no fill.
- `.ayy-chart__line` — <path> of the line, 2px whatever the stretch (vector-effect: non-scaling-stroke).
- `.ayy-chart__area` — <path> of the area under the line: a 16% tint of the series colour, or fill="url(#…)" an __gradient in its series to fade out toward the floor (React does).
- `.ayy-chart__gradient` — A <linearGradient x2="0" y2="1"> with two <stop>s, inside the series' <g> (in <defs>): its stops take the series colour, 32% at the top to none at the floor.
- `.ayy-chart__labels` — The labels under the plot (aria-hidden="true"), one per column (beside it when horizontal); under a line or a scatter they spread from the first value to the last.
- `.ayy-chart__axis` — An axis name (aria-hidden="true"): before the plot it names the vertical axis, after the __labels the horizontal one, at the end.
- `.ayy-chart__dot` — A scatter point (a <span> in a <div class="ayy-chart__series">): --ayy-x and --ayy-y (0–100) place it, --ayy-z (0–100) makes it a bubble up to 3rem across, data-value is its text on hover.
- `.ayy-chart__ring` — <svg viewBox="0 0 100 100"> of a donut or pie ("0 0 100 50" for a gauge), filling the __plot. Turned so slices start at the top and run clockwise.
- `.ayy-chart__track` — <circle cx="50" cy="50" r="40" pathLength="100"> behind a gauge's slices: the empty part, a faint wash.
- `.ayy-chart__slice` — <circle cx="50" cy="50" r="40" pathLength="100"> (r="25" in a pie): a dash --ayy-value long that starts --ayy-start along the ring (chartSlices() gives both), with a hairline gap after it. Coloured chart-1, chart-2… in order; --ayy-chart-color overrides.
- `.ayy-chart__total` — The number in the middle of a donut, or under a gauge's arc: an __total-value and a caption after it.
- `.ayy-chart__total-value` — The total itself, in the text colour and xl.
- `.ayy-chart__grid` — <path> of a radar's rings and spokes, a hairline.
- `.ayy-chart__label` — A label in the plot at --ayy-x / --ayy-y, set outward from the centre (a radar's spoke names).
- `.ayy-chart__legend` — List of the series, when there's more than one (aria-hidden="true" when a data table names them).
- `.ayy-chart__legend-item` — A series name with its swatch, coloured in the same order as the series.
- `.ayy-chart__legend-item--compare` — Legend entry for a comparison series: a dashed swatch.
- `.ayy-chart__legend-item--line` — Legend entry for a line over columns (a combo): a short solid line for a swatch.
- `.ayy-chart__swatch` — The colour square in a legend item.
- `.ayy-chart__legend-value` — A number at the end of a legend item (a slice's share), tabular digits.
- `.ayy-bar-list` — <ol> of ranked rows (top pages, sources) with the bar behind the text. Readable as it is.
- `.ayy-bar-list__item` — A row; --ayy-value is the bar's length (100 = the largest). The bar fades along the row.
- `.ayy-bar-list__label` — The row's name (or a link), cut with an ellipsis.
- `.ayy-bar-list__value` — The row's number, tabular digits.
- `.ayy-sparkline` — A small <svg viewBox="0 0 100 100" preserveAspectRatio="none"> line with no axes, for a stat or a table cell. Uses __line and __area paths.
- `.ayy-heatmap` — A grid of cells (aria-hidden="true", in a figure.ayy-chart with a data table): --ayy-columns says how many columns. Its __rows hold a row label and the cells; a last row of an empty span and __labels names the columns.
- `.ayy-heatmap__row` — A row: its first child is the row's __label, the rest are __cells (or column __labels). Lays its children on the heatmap's columns.
- `.ayy-heatmap__label` — A row's name (first in its row, at the end of its column) or a column's name, centred under it and free to spill into empty neighbours: name every other column when they're narrow.
- `.ayy-heatmap__cell` — A cell taking --ayy-value % of the series colour over a faint wash; data-value is its text on hover. --ayy-chart-color changes the colour.
- `.ayy-heatmap__key` — "Less □□□□□ More" under the heatmap: two words around a few __cells (--ayy-value 0, 25, 50, 75, 100). aria-hidden="true".
- `.ayy-funnel` — <ol> of the steps people drop out of, readable as it is: label, a centred bar, the value and the rate.
- `.ayy-funnel__step` — A step; --ayy-value is its bar's width (100 = the first, largest step).
- `.ayy-funnel__label` — The step's name, cut with an ellipsis.
- `.ayy-funnel__bar` — An empty <span>: the bar, centred, in the series colour.
- `.ayy-funnel__value` — The step's count, tabular digits.
- `.ayy-funnel__rate` — Its share of the step before (or of the first), muted. Add what it's a share of in an .ayy-sr-only span.

**States**
- `default` — Bars, lines, areas, dots, slices or cells in --ayy-chart-1… in order, muted s labels, hairline ticks; the drawing is aria-hidden and the numbers live in a table.
- `hover` (`.ayy-chart__column:hover, .ayy-chart__dot:hover, .ayy-chart__slice:hover, .ayy-heatmap__cell:hover`) — A column's bars and a slice mix 20% toward the text colour; bars show their data-value above them; a dot fills solid and a cell takes a text-colour outline, each with its data-value on a raised surface above it.
- `pressed` — doesn't apply: Not interactive.
- `focus` — doesn't apply: Not focusable; the data table (or the funnel's own text, or the gauge's meter) carries the numbers.
- `disabled` — doesn't apply: Not interactive.
- `selected` — doesn't apply: No selected bar or series.
- `error` — doesn't apply: No error look; show an Alert in its place.
- `loading` — doesn't apply: Use a block Skeleton of the chart's height while data loads; bars, slices and funnel steps grow from 0 when they appear.

**Sizes**
- Density — The plot is --ayy-chart-height (12rem) tall; a donut or pie is that wide and square, a gauge that wide and half as tall, a radar 16rem square; horizontal rows are 2rem; bar-list rows and funnel bars are the sm control height; a sparkline is 6rem × 1.75rem. Chart labels and legend text follow data-density via --ayy-text-s.
- Width — Fills its container; columns share the width (bars at most 2.5rem wide, histogram bins all of it). A donut's legend sits beside it and wraps under it in a narrow box; a radar leaves 5rem each side for its spoke names.

**React** — `import { BarChart, LineChart, HistogramChart, WaterfallChart, ScatterChart, DonutChart, GaugeChart, RadarChart, HeatmapChart, FunnelChart, Sparkline, BarList, TableChart } from "@danitesler/ayywi/react";`
- `<BarChart>` renders <figure class="ayy-chart"> with a plot of __column/__bar, labels, a legend and a visually hidden data table. Props: `label` string — what it shows ("Signups per day"); the data table's caption; `labels` string[] — one per column; `series` { name, values: number[], color? }[]; `stacked` boolean | "percent" — percent makes every column 100% (ticks read 0%–100%); `showValues` boolean — print values above the bars; `horizontal` boolean — one row per label, bars along the reading direction; `lines` { name, values: number[], color?, compare? }[] — lines over the columns on the same scale (a combo); not with horizontal; `max` number — top of the scale; rounded up from the data if omitted; `ticks` number of value lines, default 3; 0 for none; `format` (value: number) => string — ticks, hover values and the table; default compact (1.2K); `height` CSS length, default 12rem; `legend` boolean — default: more than one series
- `<LineChart>` renders <figure class="ayy-chart"> with an __svg of __series paths, labels, a legend and a visually hidden data table. Props: `label` string — the data table's caption; `labels` string[] — one per point; `series` { name, values: number[], color?, compare? }[] — compare draws a dashed comparison line; `min` number, default 0; `max` number; `area` boolean, default true; `smooth` boolean, default true (monotone: never overshoots a point); `step` boolean — steps, each value held until halfway to the next; `stacked` boolean — each area on the series before it, the top line the total; compare series stay apart; `ticks` number, default 3; `format` (value: number) => string; `height` CSS length; `legend` boolean
- `<HistogramChart>` renders <figure class="ayy-chart ayy-chart--histogram"> of touching columns, one per bin, each bin's start under it, and a data table of bin ranges. Props: `label` string — the data table's caption; `values` number[] — the raw values, counted into bins; `bins` number — about how many; edges are rounded. Default about √n, at most 20; `range` [min, max] — the values the bins cover; default the data's; `formatBin` (value: number) => string — bin edges; `name` string — what's counted, the table's column header; default label; `color` CSS colour, default chart-1; `max` number — top of the count scale; `ticks` number, default 3; `format` (value: number) => string — counts; `height` CSS length
- `<WaterfallChart>` renders <figure class="ayy-chart ayy-chart--values ayy-chart--waterfall"> of floating bars, signed values above them, and a data table. Props: `label` string — the data table's caption; `steps` { label, value, total? }[] — changes (negative for a drop) and totals (from zero); `name` string — the table's column header; default label; `min` number — default 0, or the lowest running total below it; `max` number; `ticks` number, default 3; `format` (value: number) => string — the sign is added for changes; `height` CSS length
- `<ScatterChart>` renders <figure class="ayy-chart"> with axis names, a plot of __series of __dots, x labels, a legend and a data table of the points. Props: `label` string — the data table's caption; `series` { name, points: { x, y, z?, label? }[], color? }[] — z sizes bubbles (by area); `xLabel` string — the horizontal axis's name; `yLabel` string — the vertical axis's name; `zLabel` string — the bubble size's name in the table; `xMin / xMax / yMin / yMax` number — the scales' ends; the minimums default to 0, the tops are rounded up; `ticks` number of values along each axis, default 3; 0 for none; `formatX / formatY / formatZ` (value: number) => string, default compact; `height` CSS length; `legend` boolean — default: more than one series
- `<DonutChart>` renders <figure class="ayy-chart"> with a __ring of __slices, the __total in the middle, a legend of shares beside it and a data table. Props: `label` string — the data table's caption; `items` { name, value, color? }[] — the parts; six at most; `pie` boolean — a solid pie, no total; `total` ReactNode — the number in the middle; default the formatted sum; `totalLabel` ReactNode — the words under it ("tickets"); `name` string — the table's column header; default label; `format` (value: number) => string, default grouped digits; `size` CSS length — the ring's width, default 12rem; `legend` boolean, default true
- `<GaugeChart>` renders <figure class="ayy-chart ayy-chart--gauge"> with a role="meter" plot: a half __ring, its __track and a __slice, the value under it. Props: `label` string — the meter's name ("Ad spend this month"); `value` number; `min` number, default 0; `max` number, default 100; `format` (value: number) => string, default grouped digits; `totalLabel` string — under the value and in aria-valuetext ("of $10K"); `color` CSS colour, default chart-1 (warning past a limit); `size` CSS length — the arc's width, default 12rem
- `<RadarChart>` renders <figure class="ayy-chart ayy-chart--radar"> with a square __svg of rings, spokes and __series shapes, spoke __labels, a legend and a data table. Props: `label` string — the data table's caption; `axes` string[] — one per spoke, clockwise from the top; `series` { name, values: number[], color?, compare? }[] — compare: dashed, no fill; `min` number, default 0; `max` number — the outer ring; rounded up from the data; `ticks` number of rings counting the centre, default 5; `format` (value: number) => string; `size` CSS length — the plot's width, default 16rem; `legend` boolean — default: more than one series
- `<HeatmapChart>` renders <figure class="ayy-chart"> with an .ayy-heatmap of rows, a Less–More key and a data table. Props: `label` string — the data table's caption; `rows` string[] — row names; `columns` string[] — column names, every other one shown past eight; `values` number[][] — values[row][column]; `max` number — the darkest cell; default the largest value; `format` (value: number) => string, default grouped digits; `color` CSS colour, default chart-1; `legend` [less, more] | false — the key's words, default ["Less", "More"]
- `<FunnelChart>` renders <ol class="ayy-funnel"> of steps with centred bars, values and rates. Props: `steps` { label: ReactNode, value }[]; `format` (value: number) => string, default grouped digits; `rate` "previous" | "first" — what each rate is a share of, default previous; `rateLabel` string — read after each rate by screen readers; default "of the step before" / "of the first step"; `color` CSS colour, default chart-1
- `<Sparkline>` renders <svg class="ayy-sparkline">. Props: `values` number[]; `label` string — makes it role="img" with this name; without it the sparkline is aria-hidden; `area` boolean; `color` CSS colour, default chart-1; `min` number, default the smallest value; `max` number, default the largest value
- `<BarList>` renders <ol class="ayy-bar-list">. Props: `items` { label: ReactNode, value: number, href? }[]; `max` number — value of a full bar, default the largest; `format` (value: number) => string, default grouped digits; `color` CSS colour, default chart-1
- `<TableChart>` renders <div class="ayy-table-wrap"><table class="ayy-table"> with headers, swatches and numeric cells. Props: `label` string — what it shows; the table's caption; `labels` string[] — one per row along the side; `series` { name, values: number[], color?, compare? }[]; `format` (value: number) => string — cell values; default compact (1.2K); `compact` boolean — tighter row padding

**Accessibility**
- The drawing is aria-hidden. The numbers go in a table with a <caption> saying what the chart shows, inside a <div class="ayy-sr-only"> (as React renders it): a table can't be narrower than its content, so hiding the table itself lets a long caption widen the page. Add a visible Table if people need to compare values.
- Don't rely on colour alone: a legend names the series in the same order, the comparison series is dashed, and a title or a Stat states the takeaway ("Up 12% on last week").
- Series tokens keep 3:1 against every surface in every theme. In High Contrast bars and lines take system colours, alternating between CanvasText and Highlight.
- A Sparkline with a label is an image with that name; give it the trend in words ("Revenue, last 14 days, up 12%").
- A gauge is one value, so it's a meter: role="meter" with aria-valuemin, aria-valuemax, aria-valuenow, an aria-valuetext in words ("$7.2K of $10K") and a name. A funnel and a bar list are text already and need no table.
- Waterfall changes are signed (+$6.4K, −$1.3K) as well as coloured, and a donut's legend gives each share as a number.

**Do**
- Use a chart to show a trend or a comparison at a glance: signups per day, revenue against last month, traffic by source. Put it in a Card with the title and the key number (a Stat) above it.
- Pick the form from the question: columns to compare amounts across periods (horizontal bars when the labels are long), stacked or 100% columns for parts over time, a line for a trend over many points (stacked areas for a total and its parts, steps for values that jump), a combo for amounts with their average or target, a histogram for how values spread, a waterfall for how one total became another, a scatter for how two measures relate (bubbles for a third), a donut or pie for a few parts of one whole, a gauge for one value against its limit, a radar to compare a few profiles over five to eight measures, a heatmap for activity by two dimensions (day × hour), a funnel for the steps people drop out of, a bar list for a ranking, a sparkline beside a number.
- Colour series with the chart tokens in order (React does it). With a chart library, pass var(--ayy-chart-1)… (SVG) or chartColors() (canvas), and chartTheme() for its text, grid and tooltip.
- Mark the previous period as a compare series instead of a second bright colour.
- Keep the scale honest: bars start at 0; let chartScale() round the top.

**Don't**
- Don't use a chart when the exact numbers matter more than the shape — use a Table.
- Don't use a donut or pie for more than five or six parts, for parts that are close in size, or to compare wholes — a Bar list or stacked columns are easier to read.
- Don't use a radar for more than three series or for measures on different scales — use columns or a Table.
- Don't use a gauge for a value with no meaningful maximum — use a Stat with a Sparkline.
- Don't pick series colours from the status or accent tokens unless the colour means something (success for a goal line).
- Don't draw more than six series; group the rest as Other.
- Don't add a second chart library just for a simple bar or line — these cover dashboards. Reach for one (Recharts, Chart.js) for zoom, brushing or maps, themed with the tokens.

## Chart — Columns with two series

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-card" style="inline-size: 100%; max-inline-size: 36rem">
  <div class="ayy-card__header">
    <h3 class="ayy-card__title">Signups by device</h3>
    <p class="ayy-card__description">Last six months · 21.2K in total</p>
  </div>
  <div class="ayy-card__content">
    <figure class="ayy-chart">
      <div class="ayy-chart__plot" aria-hidden="true">
        <span class="ayy-chart__tick" style="--ayy-value: 0">0</span>
        <span class="ayy-chart__tick" style="--ayy-value: 50">1.5K</span>
        <span class="ayy-chart__tick" style="--ayy-value: 100">3K</span>
        <div class="ayy-chart__bars">
          <div class="ayy-chart__column">
            <span class="ayy-chart__bar" data-value="1.8K" style="--ayy-value: 61.3"></span>
            <span class="ayy-chart__bar" data-value="920" style="--ayy-value: 30.7"></span>
          </div>
          <div class="ayy-chart__column">
            <span class="ayy-chart__bar" data-value="2.1K" style="--ayy-value: 70.7"></span>
            <span class="ayy-chart__bar" data-value="1.2K" style="--ayy-value: 39.3"></span>
          </div>
          <div class="ayy-chart__column">
            <span class="ayy-chart__bar" data-value="2K" style="--ayy-value: 65.3"></span>
            <span class="ayy-chart__bar" data-value="1.3K" style="--ayy-value: 44.7"></span>
          </div>
          <div class="ayy-chart__column">
            <span class="ayy-chart__bar" data-value="2.4K" style="--ayy-value: 80.3"></span>
            <span class="ayy-chart__bar" data-value="1.2K" style="--ayy-value: 40.3"></span>
          </div>
          <div class="ayy-chart__column">
            <span class="ayy-chart__bar" data-value="2.3K" style="--ayy-value: 76"></span>
            <span class="ayy-chart__bar" data-value="1.5K" style="--ayy-value: 49.7"></span>
          </div>
          <div class="ayy-chart__column">
            <span class="ayy-chart__bar" data-value="2.7K" style="--ayy-value: 89.7"></span>
            <span class="ayy-chart__bar" data-value="1.7K" style="--ayy-value: 57.7"></span>
          </div>
        </div>
      </div>
      <div class="ayy-chart__labels" aria-hidden="true">
        <span>Apr</span>
        <span>May</span>
        <span>Jun</span>
        <span>Jul</span>
        <span>Aug</span>
        <span>Sep</span>
      </div>
      <ul class="ayy-chart__legend" aria-hidden="true">
        <li class="ayy-chart__legend-item"><span class="ayy-chart__swatch"></span>Desktop</li>
        <li class="ayy-chart__legend-item"><span class="ayy-chart__swatch"></span>Mobile</li>
      </ul>
      <div class="ayy-sr-only">
        <table>
          <caption>Signups by device, April to September</caption>
          <thead>
            <tr>
              <td></td>
              <th scope="col">Desktop</th>
              <th scope="col">Mobile</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Apr</th>
              <td>1.8K</td>
              <td>920</td>
            </tr>
            <tr>
              <th scope="row">May</th>
              <td>2.1K</td>
              <td>1.2K</td>
            </tr>
            <tr>
              <th scope="row">Jun</th>
              <td>2K</td>
              <td>1.3K</td>
            </tr>
            <tr>
              <th scope="row">Jul</th>
              <td>2.4K</td>
              <td>1.2K</td>
            </tr>
            <tr>
              <th scope="row">Aug</th>
              <td>2.3K</td>
              <td>1.5K</td>
            </tr>
            <tr>
              <th scope="row">Sep</th>
              <td>2.7K</td>
              <td>1.7K</td>
            </tr>
          </tbody>
        </table>
      </div>
    </figure>
  </div>
</div>
```

React:

```tsx
import { BarChart, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Card style={{ inlineSize: "100%", maxInlineSize: "36rem" }}>
      <CardHeader>
        <CardTitle>Signups by device</CardTitle>
        <CardDescription>Last six months · 21.2K in total</CardDescription>
      </CardHeader>
      <CardContent>
        <BarChart
          label="Signups by device, April to September"
          labels={["Apr", "May", "Jun", "Jul", "Aug", "Sep"]}
          series={[
            { name: "Desktop", values: [1840, 2120, 1960, 2410, 2280, 2690] },
            { name: "Mobile", values: [920, 1180, 1340, 1210, 1490, 1730] },
          ]}
        />
      </CardContent>
    </Card>
  );
}
```

## Chart — Line against last period

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-card" style="inline-size: 100%; max-inline-size: 40rem">
  <div class="ayy-card__header">
    <div class="ayy-spread">
      <h3 class="ayy-card__title">Revenue</h3>
      <span class="ayy-badge ayy-badge--success">+13% on last period</span>
    </div>
    <div class="ayy-stat ayy-stat--sm">
      <p class="ayy-stat__value">$49.2K<span class="ayy-stat__unit">last 14 days</span></p>
    </div>
  </div>
  <div class="ayy-card__content">
    <figure class="ayy-chart">
      <div class="ayy-chart__plot" aria-hidden="true">
        <span class="ayy-chart__tick" style="--ayy-value: 0">$0</span>
        <span class="ayy-chart__tick" style="--ayy-value: 50">$2.5K</span>
        <span class="ayy-chart__tick" style="--ayy-value: 100">$5K</span>
        <svg class="ayy-chart__svg" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false"><g class="ayy-chart__series"><defs><linearGradient id="ayy-chart-line-1-0" class="ayy-chart__gradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0"></stop><stop offset="1"></stop></linearGradient></defs><path class="ayy-chart__area" d="M0,42 C2.56,40.67 5.13,38 7.69,38 C10.26,38 12.82,39 15.38,39 C17.95,39 20.51,32 23.08,32 C25.64,32 28.21,34 30.77,34 C33.33,34 35.9,27 38.46,27 C41.03,27 43.59,36 46.15,36 C48.72,36 51.28,32 53.85,30 C56.41,28 58.97,24 61.54,24 C64.1,24 66.67,26 69.23,26 C71.79,26 74.36,21 76.92,21 C79.49,21 82.05,28 84.62,28 C87.18,28 89.74,18 92.31,18 C94.87,18 97.44,20 100,21 L100,100 L0,100 Z" style="fill: url(#ayy-chart-line-1-0)"></path><path class="ayy-chart__line" d="M0,42 C2.56,40.67 5.13,38 7.69,38 C10.26,38 12.82,39 15.38,39 C17.95,39 20.51,32 23.08,32 C25.64,32 28.21,34 30.77,34 C33.33,34 35.9,27 38.46,27 C41.03,27 43.59,36 46.15,36 C48.72,36 51.28,32 53.85,30 C56.41,28 58.97,24 61.54,24 C64.1,24 66.67,26 69.23,26 C71.79,26 74.36,21 76.92,21 C79.49,21 82.05,28 84.62,28 C87.18,28 89.74,18 92.31,18 C94.87,18 97.44,20 100,21"></path></g><g class="ayy-chart__series ayy-chart__series--compare"><path class="ayy-chart__line" d="M0,46 C2.56,45 5.13,43.67 7.69,43 C10.26,42.33 12.82,42 15.38,42 C17.95,42 20.51,44 23.08,44 C25.64,44 28.21,38 30.77,38 C33.33,38 35.9,39.5 38.46,40 C41.03,40.5 43.59,41 46.15,41 C48.72,41 51.28,36 53.85,36 C56.41,36 58.97,37 61.54,37 C64.1,37 66.67,34 69.23,34 C71.79,34 74.36,35 76.92,35 C79.49,35 82.05,32 84.62,32 C87.18,32 89.74,33 92.31,33 C94.87,33 97.44,31 100,30"></path></g></svg>
      </div>
      <div class="ayy-chart__labels" aria-hidden="true">
        <span>Sep 1</span>
        <span>Sep 4</span>
        <span>Sep 8</span>
        <span>Sep 11</span>
        <span>Sep 14</span>
      </div>
      <ul class="ayy-chart__legend" aria-hidden="true">
        <li class="ayy-chart__legend-item"><span class="ayy-chart__swatch"></span>This period</li>
        <li class="ayy-chart__legend-item ayy-chart__legend-item--compare"><span class="ayy-chart__swatch"></span>Last period</li>
      </ul>
      <div class="ayy-sr-only">
        <table>
          <caption>Daily revenue in dollars, this period and the one before</caption>
          <thead>
            <tr>
              <td></td>
              <th scope="col">This period</th>
              <th scope="col">Last period</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Sep 1</th>
              <td>$2.9K</td>
              <td>$2.7K</td>
            </tr>
            <tr>
              <th scope="row">Sep 2</th>
              <td>$3.1K</td>
              <td>$2.9K</td>
            </tr>
            <tr>
              <th scope="row">Sep 3</th>
              <td>$3.1K</td>
              <td>$2.9K</td>
            </tr>
            <tr>
              <th scope="row">Sep 4</th>
              <td>$3.4K</td>
              <td>$2.8K</td>
            </tr>
            <tr>
              <th scope="row">Sep 5</th>
              <td>$3.3K</td>
              <td>$3.1K</td>
            </tr>
            <tr>
              <th scope="row">Sep 6</th>
              <td>$3.7K</td>
              <td>$3K</td>
            </tr>
            <tr>
              <th scope="row">Sep 7</th>
              <td>$3.2K</td>
              <td>$3K</td>
            </tr>
            <tr>
              <th scope="row">Sep 8</th>
              <td>$3.5K</td>
              <td>$3.2K</td>
            </tr>
            <tr>
              <th scope="row">Sep 9</th>
              <td>$3.8K</td>
              <td>$3.2K</td>
            </tr>
            <tr>
              <th scope="row">Sep 10</th>
              <td>$3.7K</td>
              <td>$3.3K</td>
            </tr>
            <tr>
              <th scope="row">Sep 11</th>
              <td>$4K</td>
              <td>$3.3K</td>
            </tr>
            <tr>
              <th scope="row">Sep 12</th>
              <td>$3.6K</td>
              <td>$3.4K</td>
            </tr>
            <tr>
              <th scope="row">Sep 13</th>
              <td>$4.1K</td>
              <td>$3.4K</td>
            </tr>
            <tr>
              <th scope="row">Sep 14</th>
              <td>$4K</td>
              <td>$3.5K</td>
            </tr>
          </tbody>
        </table>
      </div>
    </figure>
  </div>
</div>
```

React:

```tsx
import { Badge, Card, CardContent, CardHeader, CardTitle, LineChart, Stat } from "@danitesler/ayywi/react";

const dollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact" });
const days = ["Sep 1", "Sep 2", "Sep 3", "Sep 4", "Sep 5", "Sep 6", "Sep 7", "Sep 8", "Sep 9", "Sep 10", "Sep 11", "Sep 12", "Sep 13", "Sep 14"];

export default function Example() {
  return (
    <Card style={{ inlineSize: "100%", maxInlineSize: "40rem" }}>
      <CardHeader>
        <div className="ayy-spread">
          <CardTitle>Revenue</CardTitle>
          <Badge variant="success">+13% on last period</Badge>
        </div>
        <Stat size="sm" value="$49.2K" unit="last 14 days" />
      </CardHeader>
      <CardContent>
        <LineChart
          label="Daily revenue in dollars, this period and the one before"
          labels={days}
          format={(value) => dollars.format(value)}
          series={[
            { name: "This period", values: [2900, 3100, 3050, 3400, 3300, 3650, 3200, 3500, 3800, 3700, 3950, 3600, 4100, 3950] },
            { name: "Last period", compare: true, values: [2700, 2850, 2900, 2800, 3100, 3000, 2950, 3200, 3150, 3300, 3250, 3400, 3350, 3500] },
          ]}
        />
      </CardContent>
    </Card>
  );
}
```

## Chart — Stacked columns

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<figure class="ayy-chart ayy-chart--stacked" style="--ayy-chart-height: 10rem; inline-size: 100%; max-inline-size: 28rem">
  <div class="ayy-chart__plot" aria-hidden="true">
    <div class="ayy-chart__bars">
      <div class="ayy-chart__column">
        <span class="ayy-chart__bar" data-value="42" style="--ayy-value: 42"></span>
        <span class="ayy-chart__bar" data-value="28" style="--ayy-value: 28"></span>
        <span class="ayy-chart__bar" data-value="9" style="--ayy-value: 9"></span>
      </div>
      <div class="ayy-chart__column">
        <span class="ayy-chart__bar" data-value="38" style="--ayy-value: 38"></span>
        <span class="ayy-chart__bar" data-value="34" style="--ayy-value: 34"></span>
        <span class="ayy-chart__bar" data-value="12" style="--ayy-value: 12"></span>
      </div>
      <div class="ayy-chart__column">
        <span class="ayy-chart__bar" data-value="51" style="--ayy-value: 51"></span>
        <span class="ayy-chart__bar" data-value="30" style="--ayy-value: 30"></span>
        <span class="ayy-chart__bar" data-value="8" style="--ayy-value: 8"></span>
      </div>
      <div class="ayy-chart__column">
        <span class="ayy-chart__bar" data-value="47" style="--ayy-value: 47"></span>
        <span class="ayy-chart__bar" data-value="41" style="--ayy-value: 41"></span>
        <span class="ayy-chart__bar" data-value="10" style="--ayy-value: 10"></span>
      </div>
      <div class="ayy-chart__column">
        <span class="ayy-chart__bar" data-value="33" style="--ayy-value: 33"></span>
        <span class="ayy-chart__bar" data-value="26" style="--ayy-value: 26"></span>
        <span class="ayy-chart__bar" data-value="7" style="--ayy-value: 7"></span>
      </div>
    </div>
  </div>
  <div class="ayy-chart__labels" aria-hidden="true">
    <span>Mon</span>
    <span>Tue</span>
    <span>Wed</span>
    <span>Thu</span>
    <span>Fri</span>
  </div>
  <ul class="ayy-chart__legend" aria-hidden="true">
    <li class="ayy-chart__legend-item"><span class="ayy-chart__swatch"></span>Email</li>
    <li class="ayy-chart__legend-item"><span class="ayy-chart__swatch"></span>Chat</li>
    <li class="ayy-chart__legend-item"><span class="ayy-chart__swatch"></span>Phone</li>
  </ul>
  <div class="ayy-sr-only">
    <table>
      <caption>Support tickets per weekday, by channel</caption>
      <thead>
        <tr>
          <td></td>
          <th scope="col">Email</th>
          <th scope="col">Chat</th>
          <th scope="col">Phone</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Mon</th>
          <td>42</td>
          <td>28</td>
          <td>9</td>
        </tr>
        <tr>
          <th scope="row">Tue</th>
          <td>38</td>
          <td>34</td>
          <td>12</td>
        </tr>
        <tr>
          <th scope="row">Wed</th>
          <td>51</td>
          <td>30</td>
          <td>8</td>
        </tr>
        <tr>
          <th scope="row">Thu</th>
          <td>47</td>
          <td>41</td>
          <td>10</td>
        </tr>
        <tr>
          <th scope="row">Fri</th>
          <td>33</td>
          <td>26</td>
          <td>7</td>
        </tr>
      </tbody>
    </table>
  </div>
</figure>
```

React:

```tsx
import { BarChart } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <BarChart
      label="Support tickets per weekday, by channel"
      labels={["Mon", "Tue", "Wed", "Thu", "Fri"]}
      stacked
      ticks={0}
      height="10rem"
      style={{ inlineSize: "100%", maxInlineSize: "28rem" }}
      series={[
        { name: "Email", values: [42, 38, 51, 47, 33] },
        { name: "Chat", values: [28, 34, 30, 41, 26] },
        { name: "Phone", values: [9, 12, 8, 10, 7] },
      ]}
    />
  );
}
```

## Chart — 100% stacked columns

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-card" style="inline-size: 100%; max-inline-size: 36rem">
  <div class="ayy-card__header">
    <h3 class="ayy-card__title">Plan mix</h3>
    <p class="ayy-card__description">Share of customers on each plan · Team grew from 5% to 8%</p>
  </div>
  <div class="ayy-card__content">
    <figure class="ayy-chart ayy-chart--stacked">
      <div class="ayy-chart__plot" aria-hidden="true">
        <span class="ayy-chart__tick" style="--ayy-value: 0">0%</span>
        <span class="ayy-chart__tick" style="--ayy-value: 50">50%</span>
        <span class="ayy-chart__tick" style="--ayy-value: 100">100%</span>
        <div class="ayy-chart__bars">
          <div class="ayy-chart__column">
            <span class="ayy-chart__bar" data-value="6.2K" style="--ayy-value: 73.8"></span>
            <span class="ayy-chart__bar" data-value="1.8K" style="--ayy-value: 21.4"></span>
            <span class="ayy-chart__bar" data-value="400" style="--ayy-value: 4.8"></span>
          </div>
          <div class="ayy-chart__column">
            <span class="ayy-chart__bar" data-value="6.5K" style="--ayy-value: 72.8"></span>
            <span class="ayy-chart__bar" data-value="2K" style="--ayy-value: 22"></span>
            <span class="ayy-chart__bar" data-value="460" style="--ayy-value: 5.2"></span>
          </div>
          <div class="ayy-chart__column">
            <span class="ayy-chart__bar" data-value="6.6K" style="--ayy-value: 71"></span>
            <span class="ayy-chart__bar" data-value="2.2K" style="--ayy-value: 23.1"></span>
            <span class="ayy-chart__bar" data-value="540" style="--ayy-value: 5.8"></span>
          </div>
          <div class="ayy-chart__column">
            <span class="ayy-chart__bar" data-value="6.8K" style="--ayy-value: 70"></span>
            <span class="ayy-chart__bar" data-value="2.3K" style="--ayy-value: 23.7"></span>
            <span class="ayy-chart__bar" data-value="620" style="--ayy-value: 6.4"></span>
          </div>
          <div class="ayy-chart__column">
            <span class="ayy-chart__bar" data-value="7K" style="--ayy-value: 67.5"></span>
            <span class="ayy-chart__bar" data-value="2.6K" style="--ayy-value: 25.2"></span>
            <span class="ayy-chart__bar" data-value="750" style="--ayy-value: 7.3"></span>
          </div>
          <div class="ayy-chart__column">
            <span class="ayy-chart__bar" data-value="7.1K" style="--ayy-value: 65.3"></span>
            <span class="ayy-chart__bar" data-value="2.9K" style="--ayy-value: 26.7"></span>
            <span class="ayy-chart__bar" data-value="880" style="--ayy-value: 8.1"></span>
          </div>
        </div>
      </div>
      <div class="ayy-chart__labels" aria-hidden="true">
        <span>Apr</span>
        <span>May</span>
        <span>Jun</span>
        <span>Jul</span>
        <span>Aug</span>
        <span>Sep</span>
      </div>
      <ul class="ayy-chart__legend" aria-hidden="true">
        <li class="ayy-chart__legend-item"><span class="ayy-chart__swatch"></span>Free</li>
        <li class="ayy-chart__legend-item"><span class="ayy-chart__swatch"></span>Pro</li>
        <li class="ayy-chart__legend-item"><span class="ayy-chart__swatch"></span>Team</li>
      </ul>
      <div class="ayy-sr-only">
        <table>
          <caption>Customers by plan, April to September</caption>
          <thead>
            <tr>
              <td></td>
              <th scope="col">Free</th>
              <th scope="col">Pro</th>
              <th scope="col">Team</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Apr</th>
              <td>6.2K</td>
              <td>1.8K</td>
              <td>400</td>
            </tr>
            <tr>
              <th scope="row">May</th>
              <td>6.5K</td>
              <td>2K</td>
              <td>460</td>
            </tr>
            <tr>
              <th scope="row">Jun</th>
              <td>6.6K</td>
              <td>2.2K</td>
              <td>540</td>
            </tr>
            <tr>
              <th scope="row">Jul</th>
              <td>6.8K</td>
              <td>2.3K</td>
              <td>620</td>
            </tr>
            <tr>
              <th scope="row">Aug</th>
              <td>7K</td>
              <td>2.6K</td>
              <td>750</td>
            </tr>
            <tr>
              <th scope="row">Sep</th>
              <td>7.1K</td>
              <td>2.9K</td>
              <td>880</td>
            </tr>
          </tbody>
        </table>
      </div>
    </figure>
  </div>
</div>
```

React:

```tsx
import { BarChart, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Card style={{ inlineSize: "100%", maxInlineSize: "36rem" }}>
      <CardHeader>
        <CardTitle>Plan mix</CardTitle>
        <CardDescription>Share of customers on each plan · Team grew from 5% to 8%</CardDescription>
      </CardHeader>
      <CardContent>
        <BarChart
          stacked="percent"
          label="Customers by plan, April to September"
          labels={["Apr", "May", "Jun", "Jul", "Aug", "Sep"]}
          series={[
            { name: "Free", values: [6200, 6450, 6600, 6800, 6950, 7100] },
            { name: "Pro", values: [1800, 1950, 2150, 2300, 2600, 2900] },
            { name: "Team", values: [400, 460, 540, 620, 750, 880] },
          ]}
        />
      </CardContent>
    </Card>
  );
}
```

## Chart — Horizontal bars

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-card" style="inline-size: 100%; max-inline-size: 32rem">
  <div class="ayy-card__header">
    <h3 class="ayy-card__title">First response time</h3>
    <p class="ayy-card__description">Median hours by team · October against September</p>
  </div>
  <div class="ayy-card__content">
    <figure class="ayy-chart ayy-chart--horizontal">
      <div class="ayy-chart__plot" aria-hidden="true">
        <span class="ayy-chart__tick" style="--ayy-value: 0">0h</span>
        <span class="ayy-chart__tick" style="--ayy-value: 50">4h</span>
        <span class="ayy-chart__tick" style="--ayy-value: 100">8h</span>
        <div class="ayy-chart__bars">
          <div class="ayy-chart__column">
            <span class="ayy-chart__bar" data-value="2.4h" style="--ayy-value: 30"></span>
            <span class="ayy-chart__bar" data-value="3.1h" style="--ayy-value: 38.8"></span>
          </div>
          <div class="ayy-chart__column">
            <span class="ayy-chart__bar" data-value="5.8h" style="--ayy-value: 72.5"></span>
            <span class="ayy-chart__bar" data-value="6.4h" style="--ayy-value: 80"></span>
          </div>
          <div class="ayy-chart__column">
            <span class="ayy-chart__bar" data-value="1.6h" style="--ayy-value: 20"></span>
            <span class="ayy-chart__bar" data-value="2.2h" style="--ayy-value: 27.5"></span>
          </div>
          <div class="ayy-chart__column">
            <span class="ayy-chart__bar" data-value="3.1h" style="--ayy-value: 38.8"></span>
            <span class="ayy-chart__bar" data-value="2.9h" style="--ayy-value: 36.3"></span>
          </div>
          <div class="ayy-chart__column">
            <span class="ayy-chart__bar" data-value="4.2h" style="--ayy-value: 52.5"></span>
            <span class="ayy-chart__bar" data-value="5h" style="--ayy-value: 62.5"></span>
          </div>
        </div>
      </div>
      <div class="ayy-chart__labels" aria-hidden="true">
        <span>Billing</span>
        <span>Technical</span>
        <span>Onboarding</span>
        <span>Enterprise</span>
        <span>Partners</span>
      </div>
      <ul class="ayy-chart__legend" aria-hidden="true">
        <li class="ayy-chart__legend-item"><span class="ayy-chart__swatch"></span>October</li>
        <li class="ayy-chart__legend-item"><span class="ayy-chart__swatch"></span>September</li>
      </ul>
      <div class="ayy-sr-only">
        <table>
          <caption>Median first response time in hours, by team, October and September</caption>
          <thead>
            <tr>
              <td></td>
              <th scope="col">October</th>
              <th scope="col">September</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Billing</th>
              <td>2.4h</td>
              <td>3.1h</td>
            </tr>
            <tr>
              <th scope="row">Technical</th>
              <td>5.8h</td>
              <td>6.4h</td>
            </tr>
            <tr>
              <th scope="row">Onboarding</th>
              <td>1.6h</td>
              <td>2.2h</td>
            </tr>
            <tr>
              <th scope="row">Enterprise</th>
              <td>3.1h</td>
              <td>2.9h</td>
            </tr>
            <tr>
              <th scope="row">Partners</th>
              <td>4.2h</td>
              <td>5h</td>
            </tr>
          </tbody>
        </table>
      </div>
    </figure>
  </div>
</div>
```

React:

```tsx
import { BarChart, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Card style={{ inlineSize: "100%", maxInlineSize: "32rem" }}>
      <CardHeader>
        <CardTitle>First response time</CardTitle>
        <CardDescription>Median hours by team · October against September</CardDescription>
      </CardHeader>
      <CardContent>
        <BarChart
          horizontal
          label="Median first response time in hours, by team, October and September"
          labels={["Billing", "Technical", "Onboarding", "Enterprise", "Partners"]}
          format={(value) => `${value}h`}
          series={[
            { name: "October", values: [2.4, 5.8, 1.6, 3.1, 4.2] },
            { name: "September", values: [3.1, 6.4, 2.2, 2.9, 5] },
          ]}
        />
      </CardContent>
    </Card>
  );
}
```

## Chart — Columns with a line

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-card" style="inline-size: 100%; max-inline-size: 36rem">
  <div class="ayy-card__header">
    <h3 class="ayy-card__title">Orders</h3>
    <p class="ayy-card__description">Per month, with the average of the last three</p>
  </div>
  <div class="ayy-card__content">
    <figure class="ayy-chart ayy-chart--combo">
      <div class="ayy-chart__plot" aria-hidden="true">
        <span class="ayy-chart__tick" style="--ayy-value: 0">0</span>
        <span class="ayy-chart__tick" style="--ayy-value: 50">400</span>
        <span class="ayy-chart__tick" style="--ayy-value: 100">800</span>
        <div class="ayy-chart__bars">
          <div class="ayy-chart__column">
            <span class="ayy-chart__bar" data-value="420" style="--ayy-value: 52.5"></span>
          </div>
          <div class="ayy-chart__column">
            <span class="ayy-chart__bar" data-value="510" style="--ayy-value: 63.7"></span>
          </div>
          <div class="ayy-chart__column">
            <span class="ayy-chart__bar" data-value="480" style="--ayy-value: 60"></span>
          </div>
          <div class="ayy-chart__column">
            <span class="ayy-chart__bar" data-value="560" style="--ayy-value: 70"></span>
          </div>
          <div class="ayy-chart__column">
            <span class="ayy-chart__bar" data-value="610" style="--ayy-value: 76.3"></span>
          </div>
          <div class="ayy-chart__column">
            <span class="ayy-chart__bar" data-value="590" style="--ayy-value: 73.8"></span>
          </div>
          <div class="ayy-chart__column">
            <span class="ayy-chart__bar" data-value="670" style="--ayy-value: 83.8"></span>
          </div>
          <div class="ayy-chart__column">
            <span class="ayy-chart__bar" data-value="720" style="--ayy-value: 90"></span>
          </div>
        </div>
        <svg class="ayy-chart__svg" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false"><g class="ayy-chart__series" style="--ayy-chart-color: var(--ayy-chart-2)"><path class="ayy-chart__line" d="M6.25,47.5 C10.42,45.63 14.58,42.31 18.75,41.87 C22.92,41.44 27.08,41.7 31.25,41.25 C35.42,40.8 39.58,37.04 43.75,35.38 C47.92,33.71 52.08,32.71 56.25,31.25 C60.42,29.79 64.58,28.15 68.75,26.63 C72.92,25.1 77.08,23.65 81.25,22.13 C85.42,20.6 89.58,19.04 93.75,17.5"></path></g></svg>
      </div>
      <div class="ayy-chart__labels" aria-hidden="true">
        <span>Mar</span>
        <span>Apr</span>
        <span>May</span>
        <span>Jun</span>
        <span>Jul</span>
        <span>Aug</span>
        <span>Sep</span>
        <span>Oct</span>
      </div>
      <ul class="ayy-chart__legend" aria-hidden="true">
        <li class="ayy-chart__legend-item"><span class="ayy-chart__swatch"></span>Orders</li>
        <li class="ayy-chart__legend-item ayy-chart__legend-item--line"><span class="ayy-chart__swatch"></span>3-month average</li>
      </ul>
      <div class="ayy-sr-only">
        <table>
          <caption>Orders per month and their three-month average, March to October</caption>
          <thead>
            <tr>
              <td></td>
              <th scope="col">Orders</th>
              <th scope="col">3-month average</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Mar</th>
              <td>420</td>
              <td>420</td>
            </tr>
            <tr>
              <th scope="row">Apr</th>
              <td>510</td>
              <td>465</td>
            </tr>
            <tr>
              <th scope="row">May</th>
              <td>480</td>
              <td>470</td>
            </tr>
            <tr>
              <th scope="row">Jun</th>
              <td>560</td>
              <td>517</td>
            </tr>
            <tr>
              <th scope="row">Jul</th>
              <td>610</td>
              <td>550</td>
            </tr>
            <tr>
              <th scope="row">Aug</th>
              <td>590</td>
              <td>587</td>
            </tr>
            <tr>
              <th scope="row">Sep</th>
              <td>670</td>
              <td>623</td>
            </tr>
            <tr>
              <th scope="row">Oct</th>
              <td>720</td>
              <td>660</td>
            </tr>
          </tbody>
        </table>
      </div>
    </figure>
  </div>
</div>
```

React:

```tsx
import { BarChart, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Card style={{ inlineSize: "100%", maxInlineSize: "36rem" }}>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
        <CardDescription>Per month, with the average of the last three</CardDescription>
      </CardHeader>
      <CardContent>
        <BarChart
          label="Orders per month and their three-month average, March to October"
          labels={["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"]}
          series={[{ name: "Orders", values: [420, 510, 480, 560, 610, 590, 670, 720] }]}
          lines={[{ name: "3-month average", values: [420, 465, 470, 517, 550, 587, 623, 660] }]}
        />
      </CardContent>
    </Card>
  );
}
```

## Chart — Histogram

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-card" style="inline-size: 100%; max-inline-size: 36rem">
  <div class="ayy-card__header">
    <h3 class="ayy-card__title">Response times</h3>
    <p class="ayy-card__description">Last 80 requests · median 171ms, p95 304ms</p>
  </div>
  <div class="ayy-card__content">
    <figure class="ayy-chart ayy-chart--histogram">
      <div class="ayy-chart__plot" aria-hidden="true">
        <span class="ayy-chart__tick" style="--ayy-value: 0">0</span>
        <span class="ayy-chart__tick" style="--ayy-value: 50">10</span>
        <span class="ayy-chart__tick" style="--ayy-value: 100">20</span>
        <div class="ayy-chart__bars">
          <div class="ayy-chart__column">
            <span class="ayy-chart__bar" data-value="6" style="--ayy-value: 30"></span>
          </div>
          <div class="ayy-chart__column">
            <span class="ayy-chart__bar" data-value="13" style="--ayy-value: 65"></span>
          </div>
          <div class="ayy-chart__column">
            <span class="ayy-chart__bar" data-value="17" style="--ayy-value: 85"></span>
          </div>
          <div class="ayy-chart__column">
            <span class="ayy-chart__bar" data-value="14" style="--ayy-value: 70"></span>
          </div>
          <div class="ayy-chart__column">
            <span class="ayy-chart__bar" data-value="16" style="--ayy-value: 80"></span>
          </div>
          <div class="ayy-chart__column">
            <span class="ayy-chart__bar" data-value="6" style="--ayy-value: 30"></span>
          </div>
          <div class="ayy-chart__column">
            <span class="ayy-chart__bar" data-value="5" style="--ayy-value: 25"></span>
          </div>
          <div class="ayy-chart__column">
            <span class="ayy-chart__bar" data-value="2" style="--ayy-value: 10"></span>
          </div>
          <div class="ayy-chart__column">
            <span class="ayy-chart__bar" data-value="1" style="--ayy-value: 5"></span>
          </div>
        </div>
      </div>
      <div class="ayy-chart__labels" aria-hidden="true">
        <span>40ms</span>
        <span></span>
        <span>120ms</span>
        <span></span>
        <span>200ms</span>
        <span></span>
        <span>280ms</span>
        <span></span>
        <span>360ms</span>
      </div>
      <div class="ayy-sr-only">
        <table>
          <caption>Requests by response time in milliseconds</caption>
          <thead>
            <tr>
              <td></td>
              <th scope="col">Requests</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">40ms–80ms</th>
              <td>6</td>
            </tr>
            <tr>
              <th scope="row">80ms–120ms</th>
              <td>13</td>
            </tr>
            <tr>
              <th scope="row">120ms–160ms</th>
              <td>17</td>
            </tr>
            <tr>
              <th scope="row">160ms–200ms</th>
              <td>14</td>
            </tr>
            <tr>
              <th scope="row">200ms–240ms</th>
              <td>16</td>
            </tr>
            <tr>
              <th scope="row">240ms–280ms</th>
              <td>6</td>
            </tr>
            <tr>
              <th scope="row">280ms–320ms</th>
              <td>5</td>
            </tr>
            <tr>
              <th scope="row">320ms–360ms</th>
              <td>2</td>
            </tr>
            <tr>
              <th scope="row">360ms–400ms</th>
              <td>1</td>
            </tr>
          </tbody>
        </table>
      </div>
    </figure>
  </div>
</div>
```

React:

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle, HistogramChart } from "@danitesler/ayywi/react";

// Response times of the last 80 requests, in milliseconds.
const times = [
  139, 78, 179, 195, 69, 167, 230, 146, 110, 226, 112, 291, 80, 250, 304, 72, 154, 174, 139, 103, 221, 134, 215, 68, 152, 247, 148,
  122, 165, 214, 203, 218, 122, 129, 206, 190, 189, 118, 280, 190, 162, 279, 55, 214, 182, 264, 195, 96, 79, 88, 325, 129, 185, 127,
  134, 190, 118, 260, 206, 294, 203, 88, 213, 154, 200, 213, 368, 95, 306, 271, 200, 147, 114, 162, 138, 87, 224, 111, 325, 126,
];

export default function Example() {
  return (
    <Card style={{ inlineSize: "100%", maxInlineSize: "36rem" }}>
      <CardHeader>
        <CardTitle>Response times</CardTitle>
        <CardDescription>Last 80 requests · median 171ms, p95 304ms</CardDescription>
      </CardHeader>
      <CardContent>
        <HistogramChart
          label="Requests by response time in milliseconds"
          name="Requests"
          values={times}
          bins={8}
          formatBin={(value) => `${value}ms`}
        />
      </CardContent>
    </Card>
  );
}
```

## Chart — Waterfall

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-card" style="inline-size: 100%; max-inline-size: 36rem">
  <div class="ayy-card__header">
    <h3 class="ayy-card__title">MRR bridge</h3>
    <p class="ayy-card__description">September · up $4.5K, churn the largest drop</p>
  </div>
  <div class="ayy-card__content">
    <figure class="ayy-chart ayy-chart--values ayy-chart--waterfall">
      <div class="ayy-chart__plot" aria-hidden="true">
        <span class="ayy-chart__tick" style="--ayy-value: 0">$0</span>
        <span class="ayy-chart__tick" style="--ayy-value: 50">$30K</span>
        <span class="ayy-chart__tick" style="--ayy-value: 100">$60K</span>
        <div class="ayy-chart__bars">
          <div class="ayy-chart__column">
            <span class="ayy-chart__bar" data-value="$48.2K" style="--ayy-start: 0; --ayy-value: 80.3"></span>
          </div>
          <div class="ayy-chart__column">
            <span class="ayy-chart__bar ayy-chart__bar--up" data-value="+$6.4K" style="--ayy-start: 80.3; --ayy-value: 10.7"></span>
          </div>
          <div class="ayy-chart__column">
            <span class="ayy-chart__bar ayy-chart__bar--up" data-value="+$2.1K" style="--ayy-start: 91; --ayy-value: 3.5"></span>
          </div>
          <div class="ayy-chart__column">
            <span class="ayy-chart__bar ayy-chart__bar--down" data-value="−$1.3K" style="--ayy-start: 92.3; --ayy-value: 2.2"></span>
          </div>
          <div class="ayy-chart__column">
            <span class="ayy-chart__bar ayy-chart__bar--down" data-value="−$2.7K" style="--ayy-start: 87.8; --ayy-value: 4.5"></span>
          </div>
          <div class="ayy-chart__column">
            <span class="ayy-chart__bar" data-value="$52.7K" style="--ayy-start: 0; --ayy-value: 87.8"></span>
          </div>
        </div>
      </div>
      <div class="ayy-chart__labels" aria-hidden="true">
        <span>Sep 1</span>
        <span>New</span>
        <span>Expansion</span>
        <span>Contraction</span>
        <span>Churn</span>
        <span>Sep 30</span>
      </div>
      <div class="ayy-sr-only">
        <table>
          <caption>Monthly recurring revenue, September: from the start of the month to the end</caption>
          <thead>
            <tr>
              <td></td>
              <th scope="col">MRR</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Sep 1</th>
              <td>$48.2K</td>
            </tr>
            <tr>
              <th scope="row">New</th>
              <td>+$6.4K</td>
            </tr>
            <tr>
              <th scope="row">Expansion</th>
              <td>+$2.1K</td>
            </tr>
            <tr>
              <th scope="row">Contraction</th>
              <td>−$1.3K</td>
            </tr>
            <tr>
              <th scope="row">Churn</th>
              <td>−$2.7K</td>
            </tr>
            <tr>
              <th scope="row">Sep 30</th>
              <td>$52.7K</td>
            </tr>
          </tbody>
        </table>
      </div>
    </figure>
  </div>
</div>
```

React:

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle, WaterfallChart } from "@danitesler/ayywi/react";

const dollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 });

export default function Example() {
  return (
    <Card style={{ inlineSize: "100%", maxInlineSize: "36rem" }}>
      <CardHeader>
        <CardTitle>MRR bridge</CardTitle>
        <CardDescription>September · up $4.5K, churn the largest drop</CardDescription>
      </CardHeader>
      <CardContent>
        <WaterfallChart
          label="Monthly recurring revenue, September: from the start of the month to the end"
          name="MRR"
          format={(value) => dollars.format(value)}
          steps={[
            { label: "Sep 1", value: 48200, total: true },
            { label: "New", value: 6400 },
            { label: "Expansion", value: 2100 },
            { label: "Contraction", value: -1300 },
            { label: "Churn", value: -2700 },
            { label: "Sep 30", value: 52700, total: true },
          ]}
        />
      </CardContent>
    </Card>
  );
}
```

## Chart — Stacked areas

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-card" style="inline-size: 100%; max-inline-size: 40rem">
  <div class="ayy-card__header">
    <h3 class="ayy-card__title">Sessions by source</h3>
    <p class="ayy-card__description">Weekly · the top line is the total</p>
  </div>
  <div class="ayy-card__content">
    <figure class="ayy-chart ayy-chart--stacked">
      <div class="ayy-chart__plot" aria-hidden="true">
        <span class="ayy-chart__tick" style="--ayy-value: 0">0</span>
        <span class="ayy-chart__tick" style="--ayy-value: 50">6K</span>
        <span class="ayy-chart__tick" style="--ayy-value: 100">12K</span>
        <svg class="ayy-chart__svg" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false"><g class="ayy-chart__series"><path class="ayy-chart__area" d="M0,56.67 C3.03,56.11 6.06,55 9.09,55 C12.12,55 15.15,55.83 18.18,55.83 C21.21,55.83 24.24,53.33 27.27,52.5 C30.3,51.67 33.33,51.39 36.36,50.83 C39.39,50.28 42.42,49.17 45.45,49.17 C48.48,49.17 51.52,50 54.55,50 C57.58,50 60.61,47.64 63.64,46.67 C66.67,45.69 69.7,44.17 72.73,44.17 C75.76,44.17 78.79,45 81.82,45 C84.85,45 87.88,43.33 90.91,42.5 C93.94,41.67 96.97,40.83 100,40 L100,100 L0,100 Z"></path><path class="ayy-chart__line" d="M0,56.67 C3.03,56.11 6.06,55 9.09,55 C12.12,55 15.15,55.83 18.18,55.83 C21.21,55.83 24.24,53.33 27.27,52.5 C30.3,51.67 33.33,51.39 36.36,50.83 C39.39,50.28 42.42,49.17 45.45,49.17 C48.48,49.17 51.52,50 54.55,50 C57.58,50 60.61,47.64 63.64,46.67 C66.67,45.69 69.7,44.17 72.73,44.17 C75.76,44.17 78.79,45 81.82,45 C84.85,45 87.88,43.33 90.91,42.5 C93.94,41.67 96.97,40.83 100,40"></path></g><g class="ayy-chart__series"><path class="ayy-chart__area" d="M0,39.17 C3.03,38.33 6.06,36.67 9.09,36.67 C12.12,36.67 15.15,37.92 18.18,37.92 C21.21,37.92 24.24,34.31 27.27,33.33 C30.3,32.36 33.33,32.78 36.36,32.08 C39.39,31.39 42.42,29.17 45.45,29.17 C48.48,29.17 51.52,29.17 54.55,29.17 C57.58,29.17 60.61,27.36 63.64,26.25 C66.67,25.14 69.7,22.5 72.73,22.5 C75.76,22.5 78.79,22.5 81.82,22.5 C84.85,22.5 87.88,21.39 90.91,20.42 C93.94,19.44 96.97,17.92 100,16.67 L100,40 C96.97,40.83 93.94,41.67 90.91,42.5 C87.88,43.33 84.85,45 81.82,45 C78.79,45 75.76,44.17 72.73,44.17 C69.7,44.17 66.67,45.69 63.64,46.67 C60.61,47.64 57.58,50 54.55,50 C51.52,50 48.48,49.17 45.45,49.17 C42.42,49.17 39.39,50.28 36.36,50.83 C33.33,51.39 30.3,51.67 27.27,52.5 C24.24,53.33 21.21,55.83 18.18,55.83 C15.15,55.83 12.12,55 9.09,55 C6.06,55 3.03,56.11 0,56.67 Z"></path><path class="ayy-chart__line" d="M0,39.17 C3.03,38.33 6.06,36.67 9.09,36.67 C12.12,36.67 15.15,37.92 18.18,37.92 C21.21,37.92 24.24,34.31 27.27,33.33 C30.3,32.36 33.33,32.78 36.36,32.08 C39.39,31.39 42.42,29.17 45.45,29.17 C48.48,29.17 51.52,29.17 54.55,29.17 C57.58,29.17 60.61,27.36 63.64,26.25 C66.67,25.14 69.7,22.5 72.73,22.5 C75.76,22.5 78.79,22.5 81.82,22.5 C84.85,22.5 87.88,21.39 90.91,20.42 C93.94,19.44 96.97,17.92 100,16.67"></path></g><g class="ayy-chart__series"><path class="ayy-chart__area" d="M0,31.67 C3.03,30.28 6.06,27.5 9.09,27.5 C12.12,27.5 15.15,29.58 18.18,29.58 C21.21,29.58 24.24,22.07 27.27,21.67 C30.3,21.27 33.33,21.37 36.36,21.25 C39.39,21.13 42.42,19.93 45.45,19.17 C48.48,18.4 51.52,17.85 54.55,16.67 C57.58,15.49 60.61,13.33 63.64,12.08 C66.67,10.83 69.7,9.17 72.73,9.17 C75.76,9.17 78.79,10 81.82,10 C84.85,10 87.88,6.94 90.91,5.42 C93.94,3.89 96.97,2.36 100,0.83 L100,16.67 C96.97,17.92 93.94,19.44 90.91,20.42 C87.88,21.39 84.85,22.5 81.82,22.5 C78.79,22.5 75.76,22.5 72.73,22.5 C69.7,22.5 66.67,25.14 63.64,26.25 C60.61,27.36 57.58,29.17 54.55,29.17 C51.52,29.17 48.48,29.17 45.45,29.17 C42.42,29.17 39.39,31.39 36.36,32.08 C33.33,32.78 30.3,32.36 27.27,33.33 C24.24,34.31 21.21,37.92 18.18,37.92 C15.15,37.92 12.12,36.67 9.09,36.67 C6.06,36.67 3.03,38.33 0,39.17 Z"></path><path class="ayy-chart__line" d="M0,31.67 C3.03,30.28 6.06,27.5 9.09,27.5 C12.12,27.5 15.15,29.58 18.18,29.58 C21.21,29.58 24.24,22.07 27.27,21.67 C30.3,21.27 33.33,21.37 36.36,21.25 C39.39,21.13 42.42,19.93 45.45,19.17 C48.48,18.4 51.52,17.85 54.55,16.67 C57.58,15.49 60.61,13.33 63.64,12.08 C66.67,10.83 69.7,9.17 72.73,9.17 C75.76,9.17 78.79,10 81.82,10 C84.85,10 87.88,6.94 90.91,5.42 C93.94,3.89 96.97,2.36 100,0.83"></path></g></svg>
      </div>
      <div class="ayy-chart__labels" aria-hidden="true">
        <span>Jul 7</span>
        <span>Jul 28</span>
        <span>Aug 18</span>
        <span>Sep 1</span>
        <span>Sep 22</span>
      </div>
      <ul class="ayy-chart__legend" aria-hidden="true">
        <li class="ayy-chart__legend-item"><span class="ayy-chart__swatch"></span>Organic</li>
        <li class="ayy-chart__legend-item"><span class="ayy-chart__swatch"></span>Direct</li>
        <li class="ayy-chart__legend-item"><span class="ayy-chart__swatch"></span>Referral</li>
      </ul>
      <div class="ayy-sr-only">
        <table>
          <caption>Weekly sessions by source, July to September</caption>
          <thead>
            <tr>
              <td></td>
              <th scope="col">Organic</th>
              <th scope="col">Direct</th>
              <th scope="col">Referral</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Jul 7</th>
              <td>5.2K</td>
              <td>2.1K</td>
              <td>900</td>
            </tr>
            <tr>
              <th scope="row">Jul 14</th>
              <td>5.4K</td>
              <td>2.2K</td>
              <td>1.1K</td>
            </tr>
            <tr>
              <th scope="row">Jul 21</th>
              <td>5.3K</td>
              <td>2.2K</td>
              <td>1K</td>
            </tr>
            <tr>
              <th scope="row">Jul 28</th>
              <td>5.7K</td>
              <td>2.3K</td>
              <td>1.4K</td>
            </tr>
            <tr>
              <th scope="row">Aug 4</th>
              <td>5.9K</td>
              <td>2.3K</td>
              <td>1.3K</td>
            </tr>
            <tr>
              <th scope="row">Aug 11</th>
              <td>6.1K</td>
              <td>2.4K</td>
              <td>1.2K</td>
            </tr>
            <tr>
              <th scope="row">Aug 18</th>
              <td>6K</td>
              <td>2.5K</td>
              <td>1.5K</td>
            </tr>
            <tr>
              <th scope="row">Aug 25</th>
              <td>6.4K</td>
              <td>2.5K</td>
              <td>1.7K</td>
            </tr>
            <tr>
              <th scope="row">Sep 1</th>
              <td>6.7K</td>
              <td>2.6K</td>
              <td>1.6K</td>
            </tr>
            <tr>
              <th scope="row">Sep 8</th>
              <td>6.6K</td>
              <td>2.7K</td>
              <td>1.5K</td>
            </tr>
            <tr>
              <th scope="row">Sep 15</th>
              <td>6.9K</td>
              <td>2.7K</td>
              <td>1.8K</td>
            </tr>
            <tr>
              <th scope="row">Sep 22</th>
              <td>7.2K</td>
              <td>2.8K</td>
              <td>1.9K</td>
            </tr>
          </tbody>
        </table>
      </div>
    </figure>
  </div>
</div>
```

React:

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle, LineChart } from "@danitesler/ayywi/react";

const weeks = ["Jul 7", "Jul 14", "Jul 21", "Jul 28", "Aug 4", "Aug 11", "Aug 18", "Aug 25", "Sep 1", "Sep 8", "Sep 15", "Sep 22"];

export default function Example() {
  return (
    <Card style={{ inlineSize: "100%", maxInlineSize: "40rem" }}>
      <CardHeader>
        <CardTitle>Sessions by source</CardTitle>
        <CardDescription>Weekly · the top line is the total</CardDescription>
      </CardHeader>
      <CardContent>
        <LineChart
          stacked
          label="Weekly sessions by source, July to September"
          labels={weeks}
          series={[
            { name: "Organic", values: [5200, 5400, 5300, 5700, 5900, 6100, 6000, 6400, 6700, 6600, 6900, 7200] },
            { name: "Direct", values: [2100, 2200, 2150, 2300, 2250, 2400, 2500, 2450, 2600, 2700, 2650, 2800] },
            { name: "Referral", values: [900, 1100, 1000, 1400, 1300, 1200, 1500, 1700, 1600, 1500, 1800, 1900] },
          ]}
        />
      </CardContent>
    </Card>
  );
}
```

## Chart — Step line

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-card" style="inline-size: 100%; max-inline-size: 36rem">
  <div class="ayy-card__header">
    <h3 class="ayy-card__title">Paid seats</h3>
    <p class="ayy-card__description">Seats change on the billing date, so the line steps</p>
  </div>
  <div class="ayy-card__content">
    <figure class="ayy-chart">
      <div class="ayy-chart__plot" aria-hidden="true">
        <span class="ayy-chart__tick" style="--ayy-value: 0">0</span>
        <span class="ayy-chart__tick" style="--ayy-value: 50">25</span>
        <span class="ayy-chart__tick" style="--ayy-value: 100">50</span>
        <svg class="ayy-chart__svg" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false"><g class="ayy-chart__series"><defs><linearGradient id="ayy-chart-step-1-0" class="ayy-chart__gradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0"></stop><stop offset="1"></stop></linearGradient></defs><path class="ayy-chart__area" d="M0,80 L4.55,80 L4.55,80 L13.64,80 L13.64,70 L22.73,70 L22.73,70 L31.82,70 L31.82,70 L40.91,70 L40.91,50 L50,50 L50,50 L59.09,50 L59.09,50 L68.18,50 L68.18,50 L77.27,50 L77.27,20 L86.36,20 L86.36,20 L95.45,20 L95.45,0 L100,0 L100,100 L0,100 Z" style="fill: url(#ayy-chart-step-1-0)"></path><path class="ayy-chart__line" d="M0,80 L4.55,80 L4.55,80 L13.64,80 L13.64,70 L22.73,70 L22.73,70 L31.82,70 L31.82,70 L40.91,70 L40.91,50 L50,50 L50,50 L59.09,50 L59.09,50 L68.18,50 L68.18,50 L77.27,50 L77.27,20 L86.36,20 L86.36,20 L95.45,20 L95.45,0 L100,0"></path></g></svg>
      </div>
      <div class="ayy-chart__labels" aria-hidden="true">
        <span>Nov</span>
        <span>Feb</span>
        <span>May</span>
        <span>Jul</span>
        <span>Oct</span>
      </div>
      <div class="ayy-sr-only">
        <table>
          <caption>Paid seats per month, November to October</caption>
          <thead>
            <tr>
              <td></td>
              <th scope="col">Paid seats</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Nov</th>
              <td>10</td>
            </tr>
            <tr>
              <th scope="row">Dec</th>
              <td>10</td>
            </tr>
            <tr>
              <th scope="row">Jan</th>
              <td>15</td>
            </tr>
            <tr>
              <th scope="row">Feb</th>
              <td>15</td>
            </tr>
            <tr>
              <th scope="row">Mar</th>
              <td>15</td>
            </tr>
            <tr>
              <th scope="row">Apr</th>
              <td>25</td>
            </tr>
            <tr>
              <th scope="row">May</th>
              <td>25</td>
            </tr>
            <tr>
              <th scope="row">Jun</th>
              <td>25</td>
            </tr>
            <tr>
              <th scope="row">Jul</th>
              <td>25</td>
            </tr>
            <tr>
              <th scope="row">Aug</th>
              <td>40</td>
            </tr>
            <tr>
              <th scope="row">Sep</th>
              <td>40</td>
            </tr>
            <tr>
              <th scope="row">Oct</th>
              <td>50</td>
            </tr>
          </tbody>
        </table>
      </div>
    </figure>
  </div>
</div>
```

React:

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle, LineChart } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Card style={{ inlineSize: "100%", maxInlineSize: "36rem" }}>
      <CardHeader>
        <CardTitle>Paid seats</CardTitle>
        <CardDescription>Seats change on the billing date, so the line steps</CardDescription>
      </CardHeader>
      <CardContent>
        <LineChart
          step
          label="Paid seats per month, November to October"
          labels={["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"]}
          series={[{ name: "Paid seats", values: [10, 10, 15, 15, 15, 25, 25, 25, 25, 40, 40, 50] }]}
        />
      </CardContent>
    </Card>
  );
}
```

## Chart — Scatter

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-card" style="inline-size: 100%; max-inline-size: 36rem">
  <div class="ayy-card__header">
    <h3 class="ayy-card__title">Deals closed this quarter</h3>
    <p class="ayy-card__description">Bigger deals take longer, and the slowest ones are lost</p>
  </div>
  <div class="ayy-card__content">
    <figure class="ayy-chart">
      <span class="ayy-chart__axis" aria-hidden="true">Days to close</span>
      <div class="ayy-chart__plot" aria-hidden="true">
        <span class="ayy-chart__tick" style="--ayy-value: 0">0</span>
        <span class="ayy-chart__tick" style="--ayy-value: 50">50</span>
        <span class="ayy-chart__tick" style="--ayy-value: 100">100</span>
        <div class="ayy-chart__series">
          <span class="ayy-chart__dot" data-value="$8K, 12" style="--ayy-x: 10; --ayy-y: 12"></span>
          <span class="ayy-chart__dot" data-value="$12K, 18" style="--ayy-x: 15; --ayy-y: 18"></span>
          <span class="ayy-chart__dot" data-value="$15K, 15" style="--ayy-x: 18.8; --ayy-y: 15"></span>
          <span class="ayy-chart__dot" data-value="$22K, 26" style="--ayy-x: 27.5; --ayy-y: 26"></span>
          <span class="ayy-chart__dot" data-value="$26K, 31" style="--ayy-x: 32.5; --ayy-y: 31"></span>
          <span class="ayy-chart__dot" data-value="$31K, 28" style="--ayy-x: 38.8; --ayy-y: 28"></span>
          <span class="ayy-chart__dot" data-value="$38K, 42" style="--ayy-x: 47.5; --ayy-y: 42"></span>
          <span class="ayy-chart__dot" data-value="$44K, 39" style="--ayy-x: 55; --ayy-y: 39"></span>
          <span class="ayy-chart__dot" data-value="$52K, 55" style="--ayy-x: 65; --ayy-y: 55"></span>
          <span class="ayy-chart__dot" data-value="$61K, 48" style="--ayy-x: 76.3; --ayy-y: 48"></span>
        </div>
        <div class="ayy-chart__series">
          <span class="ayy-chart__dot" data-value="$9K, 34" style="--ayy-x: 11.3; --ayy-y: 34"></span>
          <span class="ayy-chart__dot" data-value="$18K, 47" style="--ayy-x: 22.5; --ayy-y: 47"></span>
          <span class="ayy-chart__dot" data-value="$24K, 58" style="--ayy-x: 30; --ayy-y: 58"></span>
          <span class="ayy-chart__dot" data-value="$35K, 66" style="--ayy-x: 43.8; --ayy-y: 66"></span>
          <span class="ayy-chart__dot" data-value="$47K, 72" style="--ayy-x: 58.8; --ayy-y: 72"></span>
          <span class="ayy-chart__dot" data-value="$58K, 81" style="--ayy-x: 72.5; --ayy-y: 81"></span>
          <span class="ayy-chart__dot" data-value="$72K, 64" style="--ayy-x: 90; --ayy-y: 64"></span>
        </div>
      </div>
      <div class="ayy-chart__labels" aria-hidden="true">
        <span>$0</span>
        <span>$40K</span>
        <span>$80K</span>
      </div>
      <span class="ayy-chart__axis" aria-hidden="true">Deal size</span>
      <ul class="ayy-chart__legend" aria-hidden="true">
        <li class="ayy-chart__legend-item"><span class="ayy-chart__swatch"></span>Won</li>
        <li class="ayy-chart__legend-item"><span class="ayy-chart__swatch"></span>Lost</li>
      </ul>
      <div class="ayy-sr-only">
        <table>
          <caption>Deals closed this quarter, by size and days to close</caption>
          <thead>
            <tr>
              <td></td>
              <th scope="col">Deal size</th>
              <th scope="col">Days to close</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Won 1</th>
              <td>$8K</td>
              <td>12</td>
            </tr>
            <tr>
              <th scope="row">Won 2</th>
              <td>$12K</td>
              <td>18</td>
            </tr>
            <tr>
              <th scope="row">Won 3</th>
              <td>$15K</td>
              <td>15</td>
            </tr>
            <tr>
              <th scope="row">Won 4</th>
              <td>$22K</td>
              <td>26</td>
            </tr>
            <tr>
              <th scope="row">Won 5</th>
              <td>$26K</td>
              <td>31</td>
            </tr>
            <tr>
              <th scope="row">Won 6</th>
              <td>$31K</td>
              <td>28</td>
            </tr>
            <tr>
              <th scope="row">Won 7</th>
              <td>$38K</td>
              <td>42</td>
            </tr>
            <tr>
              <th scope="row">Won 8</th>
              <td>$44K</td>
              <td>39</td>
            </tr>
            <tr>
              <th scope="row">Won 9</th>
              <td>$52K</td>
              <td>55</td>
            </tr>
            <tr>
              <th scope="row">Won 10</th>
              <td>$61K</td>
              <td>48</td>
            </tr>
            <tr>
              <th scope="row">Lost 1</th>
              <td>$9K</td>
              <td>34</td>
            </tr>
            <tr>
              <th scope="row">Lost 2</th>
              <td>$18K</td>
              <td>47</td>
            </tr>
            <tr>
              <th scope="row">Lost 3</th>
              <td>$24K</td>
              <td>58</td>
            </tr>
            <tr>
              <th scope="row">Lost 4</th>
              <td>$35K</td>
              <td>66</td>
            </tr>
            <tr>
              <th scope="row">Lost 5</th>
              <td>$47K</td>
              <td>72</td>
            </tr>
            <tr>
              <th scope="row">Lost 6</th>
              <td>$58K</td>
              <td>81</td>
            </tr>
            <tr>
              <th scope="row">Lost 7</th>
              <td>$72K</td>
              <td>64</td>
            </tr>
          </tbody>
        </table>
      </div>
    </figure>
  </div>
</div>
```

React:

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle, ScatterChart } from "@danitesler/ayywi/react";

const dollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact" });

export default function Example() {
  return (
    <Card style={{ inlineSize: "100%", maxInlineSize: "36rem" }}>
      <CardHeader>
        <CardTitle>Deals closed this quarter</CardTitle>
        <CardDescription>Bigger deals take longer, and the slowest ones are lost</CardDescription>
      </CardHeader>
      <CardContent>
        <ScatterChart
          label="Deals closed this quarter, by size and days to close"
          xLabel="Deal size"
          yLabel="Days to close"
          formatX={(value) => dollars.format(value)}
          series={[
            {
              name: "Won",
              points: [
                { x: 8000, y: 12 }, { x: 12000, y: 18 }, { x: 15000, y: 15 }, { x: 22000, y: 26 }, { x: 26000, y: 31 },
                { x: 31000, y: 28 }, { x: 38000, y: 42 }, { x: 44000, y: 39 }, { x: 52000, y: 55 }, { x: 61000, y: 48 },
              ],
            },
            {
              name: "Lost",
              points: [
                { x: 9000, y: 34 }, { x: 18000, y: 47 }, { x: 24000, y: 58 }, { x: 35000, y: 66 }, { x: 47000, y: 72 },
                { x: 58000, y: 81 }, { x: 72000, y: 64 },
              ],
            },
          ]}
        />
      </CardContent>
    </Card>
  );
}
```

## Chart — Bubbles

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-card" style="inline-size: 100%; max-inline-size: 36rem">
  <div class="ayy-card__header">
    <h3 class="ayy-card__title">Markets</h3>
    <p class="ayy-card__description">Cost to win a customer against what they spend · bubbles sized by customers</p>
  </div>
  <div class="ayy-card__content">
    <figure class="ayy-chart">
      <span class="ayy-chart__axis" aria-hidden="true">Lifetime value</span>
      <div class="ayy-chart__plot" aria-hidden="true">
        <span class="ayy-chart__tick" style="--ayy-value: 0">$0</span>
        <span class="ayy-chart__tick" style="--ayy-value: 50">$2K</span>
        <span class="ayy-chart__tick" style="--ayy-value: 100">$4K</span>
        <div class="ayy-chart__series">
          <span class="ayy-chart__dot" data-value="Germany: $210, $2.9K, 4.2K" style="--ayy-x: 42; --ayy-y: 72.5; --ayy-z: 100"></span>
          <span class="ayy-chart__dot" data-value="France: $260, $2.4K, 2.6K" style="--ayy-x: 52; --ayy-y: 60; --ayy-z: 78.7"></span>
          <span class="ayy-chart__dot" data-value="Spain: $150, $1.5K, 1.4K" style="--ayy-x: 30; --ayy-y: 37.5; --ayy-z: 57.7"></span>
          <span class="ayy-chart__dot" data-value="Italy: $190, $1.7K, 900" style="--ayy-x: 38; --ayy-y: 42.5; --ayy-z: 46.3"></span>
          <span class="ayy-chart__dot" data-value="Netherlands: $320, $3.2K, 1.1K" style="--ayy-x: 64; --ayy-y: 80; --ayy-z: 51.2"></span>
          <span class="ayy-chart__dot" data-value="Poland: $110, $950, 600" style="--ayy-x: 22; --ayy-y: 23.8; --ayy-z: 37.8"></span>
          <span class="ayy-chart__dot" data-value="Sweden: $410, $2.7K, 450" style="--ayy-x: 82; --ayy-y: 67.5; --ayy-z: 32.7"></span>
        </div>
      </div>
      <div class="ayy-chart__labels" aria-hidden="true">
        <span>$0</span>
        <span>$250</span>
        <span>$500</span>
      </div>
      <span class="ayy-chart__axis" aria-hidden="true">Acquisition cost</span>
      <div class="ayy-sr-only">
        <table>
          <caption>Markets by acquisition cost, lifetime value and customers</caption>
          <thead>
            <tr>
              <td></td>
              <th scope="col">Acquisition cost</th>
              <th scope="col">Lifetime value</th>
              <th scope="col">Customers</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Germany</th>
              <td>$210</td>
              <td>$2.9K</td>
              <td>4.2K</td>
            </tr>
            <tr>
              <th scope="row">France</th>
              <td>$260</td>
              <td>$2.4K</td>
              <td>2.6K</td>
            </tr>
            <tr>
              <th scope="row">Spain</th>
              <td>$150</td>
              <td>$1.5K</td>
              <td>1.4K</td>
            </tr>
            <tr>
              <th scope="row">Italy</th>
              <td>$190</td>
              <td>$1.7K</td>
              <td>900</td>
            </tr>
            <tr>
              <th scope="row">Netherlands</th>
              <td>$320</td>
              <td>$3.2K</td>
              <td>1.1K</td>
            </tr>
            <tr>
              <th scope="row">Poland</th>
              <td>$110</td>
              <td>$950</td>
              <td>600</td>
            </tr>
            <tr>
              <th scope="row">Sweden</th>
              <td>$410</td>
              <td>$2.7K</td>
              <td>450</td>
            </tr>
          </tbody>
        </table>
      </div>
    </figure>
  </div>
</div>
```

React:

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle, ScatterChart } from "@danitesler/ayywi/react";

const dollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact" });

export default function Example() {
  return (
    <Card style={{ inlineSize: "100%", maxInlineSize: "36rem" }}>
      <CardHeader>
        <CardTitle>Markets</CardTitle>
        <CardDescription>Cost to win a customer against what they spend · bubbles sized by customers</CardDescription>
      </CardHeader>
      <CardContent>
        <ScatterChart
          label="Markets by acquisition cost, lifetime value and customers"
          xLabel="Acquisition cost"
          yLabel="Lifetime value"
          zLabel="Customers"
          formatX={(value) => dollars.format(value)}
          formatY={(value) => dollars.format(value)}
          series={[
            {
              name: "Markets",
              points: [
                { label: "Germany", x: 210, y: 2900, z: 4200 },
                { label: "France", x: 260, y: 2400, z: 2600 },
                { label: "Spain", x: 150, y: 1500, z: 1400 },
                { label: "Italy", x: 190, y: 1700, z: 900 },
                { label: "Netherlands", x: 320, y: 3200, z: 1100 },
                { label: "Poland", x: 110, y: 950, z: 600 },
                { label: "Sweden", x: 410, y: 2700, z: 450 },
              ],
            },
          ]}
        />
      </CardContent>
    </Card>
  );
}
```

## Chart — Donut

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-card" style="inline-size: 100%; max-inline-size: 30rem">
  <div class="ayy-card__header">
    <h3 class="ayy-card__title">Tickets by channel</h3>
  </div>
  <div class="ayy-card__content">
    <figure class="ayy-chart" style="--ayy-chart-height: 10rem">
      <div class="ayy-chart__plot" aria-hidden="true">
        <svg class="ayy-chart__ring" viewBox="0 0 100 100" focusable="false"><circle class="ayy-chart__slice" cx="50" cy="50" r="40" pathLength="100" style="--ayy-start: 0; --ayy-value: 43.7"></circle><circle class="ayy-chart__slice" cx="50" cy="50" r="40" pathLength="100" style="--ayy-start: 43.7; --ayy-value: 30.3"></circle><circle class="ayy-chart__slice" cx="50" cy="50" r="40" pathLength="100" style="--ayy-start: 74; --ayy-value: 14.8"></circle><circle class="ayy-chart__slice" cx="50" cy="50" r="40" pathLength="100" style="--ayy-start: 88.8; --ayy-value: 11.3"></circle></svg>
        <p class="ayy-chart__total"><span class="ayy-chart__total-value">2,840</span>tickets</p>
      </div>
      <ul class="ayy-chart__legend" aria-hidden="true">
        <li class="ayy-chart__legend-item"><span class="ayy-chart__swatch"></span>Email<span class="ayy-chart__legend-value">43.7%</span></li>
        <li class="ayy-chart__legend-item"><span class="ayy-chart__swatch"></span>Chat<span class="ayy-chart__legend-value">30.3%</span></li>
        <li class="ayy-chart__legend-item"><span class="ayy-chart__swatch"></span>Phone<span class="ayy-chart__legend-value">14.8%</span></li>
        <li class="ayy-chart__legend-item"><span class="ayy-chart__swatch"></span>Social<span class="ayy-chart__legend-value">11.3%</span></li>
      </ul>
      <div class="ayy-sr-only">
        <table>
          <caption>Support tickets by channel, September</caption>
          <thead>
            <tr>
              <td></td>
              <th scope="col">Tickets</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Email</th>
              <td>1,240 (43.7%)</td>
            </tr>
            <tr>
              <th scope="row">Chat</th>
              <td>860 (30.3%)</td>
            </tr>
            <tr>
              <th scope="row">Phone</th>
              <td>420 (14.8%)</td>
            </tr>
            <tr>
              <th scope="row">Social</th>
              <td>320 (11.3%)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </figure>
  </div>
</div>
```

React:

```tsx
import { Card, CardContent, CardHeader, CardTitle, DonutChart } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Card style={{ inlineSize: "100%", maxInlineSize: "30rem" }}>
      <CardHeader>
        <CardTitle>Tickets by channel</CardTitle>
      </CardHeader>
      <CardContent>
        <DonutChart
          label="Support tickets by channel, September"
          name="Tickets"
          totalLabel="tickets"
          size="10rem"
          items={[
            { name: "Email", value: 1240 },
            { name: "Chat", value: 860 },
            { name: "Phone", value: 420 },
            { name: "Social", value: 320 },
          ]}
        />
      </CardContent>
    </Card>
  );
}
```

## Chart — Pie

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-card" style="inline-size: 100%; max-inline-size: 30rem">
  <div class="ayy-card__header">
    <h3 class="ayy-card__title">Storage</h3>
    <p class="ayy-card__description">100 GB used of 200 GB</p>
  </div>
  <div class="ayy-card__content">
    <figure class="ayy-chart ayy-chart--pie" style="--ayy-chart-height: 9rem">
      <div class="ayy-chart__plot" aria-hidden="true">
        <svg class="ayy-chart__ring" viewBox="0 0 100 100" focusable="false"><circle class="ayy-chart__slice" cx="50" cy="50" r="25" pathLength="100" style="--ayy-start: 0; --ayy-value: 48"></circle><circle class="ayy-chart__slice" cx="50" cy="50" r="25" pathLength="100" style="--ayy-start: 48; --ayy-value: 31"></circle><circle class="ayy-chart__slice" cx="50" cy="50" r="25" pathLength="100" style="--ayy-start: 79; --ayy-value: 12"></circle><circle class="ayy-chart__slice" cx="50" cy="50" r="25" pathLength="100" style="--ayy-start: 91; --ayy-value: 9"></circle></svg>
      </div>
      <ul class="ayy-chart__legend" aria-hidden="true">
        <li class="ayy-chart__legend-item"><span class="ayy-chart__swatch"></span>Photos<span class="ayy-chart__legend-value">48%</span></li>
        <li class="ayy-chart__legend-item"><span class="ayy-chart__swatch"></span>Videos<span class="ayy-chart__legend-value">31%</span></li>
        <li class="ayy-chart__legend-item"><span class="ayy-chart__swatch"></span>Documents<span class="ayy-chart__legend-value">12%</span></li>
        <li class="ayy-chart__legend-item"><span class="ayy-chart__swatch"></span>Other<span class="ayy-chart__legend-value">9%</span></li>
      </ul>
      <div class="ayy-sr-only">
        <table>
          <caption>Storage used by file type</caption>
          <thead>
            <tr>
              <td></td>
              <th scope="col">Storage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Photos</th>
              <td>48 GB (48%)</td>
            </tr>
            <tr>
              <th scope="row">Videos</th>
              <td>31 GB (31%)</td>
            </tr>
            <tr>
              <th scope="row">Documents</th>
              <td>12 GB (12%)</td>
            </tr>
            <tr>
              <th scope="row">Other</th>
              <td>9 GB (9%)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </figure>
  </div>
</div>
```

React:

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle, DonutChart } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Card style={{ inlineSize: "100%", maxInlineSize: "30rem" }}>
      <CardHeader>
        <CardTitle>Storage</CardTitle>
        <CardDescription>100 GB used of 200 GB</CardDescription>
      </CardHeader>
      <CardContent>
        <DonutChart
          pie
          label="Storage used by file type"
          name="Storage"
          size="9rem"
          format={(value) => `${value} GB`}
          items={[
            { name: "Photos", value: 48 },
            { name: "Videos", value: 31 },
            { name: "Documents", value: 12 },
            { name: "Other", value: 9 },
          ]}
        />
      </CardContent>
    </Card>
  );
}
```

## Chart — Gauges

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-card" style="inline-size: 100%; max-inline-size: 32rem">
  <div class="ayy-card__header">
    <h3 class="ayy-card__title">October limits</h3>
  </div>
  <div class="ayy-card__content">
    <div class="ayy-grid" style="--ayy-min: 10rem">
      <figure class="ayy-chart ayy-chart--gauge" style="--ayy-chart-height: 10rem">
        <div class="ayy-chart__plot" role="meter" aria-label="Ad spend this month" aria-valuemin="0" aria-valuemax="10000" aria-valuenow="7240" aria-valuetext="$7.2K of $10K ad spend">
          <svg class="ayy-chart__ring" viewBox="0 0 100 50" focusable="false" aria-hidden="true"><circle class="ayy-chart__track" cx="50" cy="50" r="40" pathLength="100"></circle><circle class="ayy-chart__slice" cx="50" cy="50" r="40" pathLength="100" style="--ayy-value: 72.4"></circle></svg>
          <p class="ayy-chart__total"><span class="ayy-chart__total-value">$7.2K</span>of $10K ad spend</p>
        </div>
      </figure>
      <figure class="ayy-chart ayy-chart--gauge" style="--ayy-chart-height: 10rem">
        <div class="ayy-chart__plot" role="meter" aria-label="API calls this month" aria-valuemin="0" aria-valuemax="100000" aria-valuenow="92000" aria-valuetext="92K of 100K API calls">
          <svg class="ayy-chart__ring" viewBox="0 0 100 50" focusable="false" aria-hidden="true"><circle class="ayy-chart__track" cx="50" cy="50" r="40" pathLength="100"></circle><circle class="ayy-chart__slice" cx="50" cy="50" r="40" pathLength="100" style="--ayy-value: 92; --ayy-chart-color: var(--ayy-color-warning)"></circle></svg>
          <p class="ayy-chart__total"><span class="ayy-chart__total-value">92K</span>of 100K API calls</p>
        </div>
      </figure>
    </div>
  </div>
</div>
```

React:

```tsx
import type { CSSProperties } from "react";
import { Card, CardContent, CardHeader, CardTitle, GaugeChart } from "@danitesler/ayywi/react";

const dollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 });
const compact = new Intl.NumberFormat("en-US", { notation: "compact" });

export default function Example() {
  return (
    <Card style={{ inlineSize: "100%", maxInlineSize: "32rem" }}>
      <CardHeader>
        <CardTitle>October limits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="ayy-grid" style={{ "--ayy-min": "10rem" } as CSSProperties}>
          <GaugeChart
            label="Ad spend this month"
            value={7240}
            max={10000}
            size="10rem"
            format={(value) => dollars.format(value)}
            totalLabel="of $10K ad spend"
          />
          <GaugeChart
            label="API calls this month"
            value={92000}
            max={100000}
            size="10rem"
            color="var(--ayy-color-warning)"
            format={(value) => compact.format(value)}
            totalLabel="of 100K API calls"
          />
        </div>
      </CardContent>
    </Card>
  );
}
```

## Chart — Radar

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-card" style="inline-size: 100%; max-inline-size: 32rem">
  <div class="ayy-card__header">
    <h3 class="ayy-card__title">Customer survey</h3>
    <p class="ayy-card__description">Average score out of 10 · support slipped, docs caught up</p>
  </div>
  <div class="ayy-card__content">
    <figure class="ayy-chart ayy-chart--radar">
      <div class="ayy-chart__plot" aria-hidden="true">
        <svg class="ayy-chart__svg" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false"><path class="ayy-chart__grid" d="M50,40 L58.66,45 L58.66,55 L50,60 L41.34,55 L41.34,45 Z M50,30 L67.32,40 L67.32,60 L50,70 L32.68,60 L32.68,40 Z M50,20 L75.98,35 L75.98,65 L50,80 L24.02,65 L24.02,35 Z M50,10 L84.64,30 L84.64,70 L50,90 L15.36,70 L15.36,30 Z M50,50 L50,10 M50,50 L84.64,30 M50,50 L84.64,70 M50,50 L50,90 M50,50 L15.36,70 M50,50 L15.36,30"></path><g class="ayy-chart__series"><path class="ayy-chart__area" d="M50,17.2 L76.33,34.8 L80.48,67.6 L50,77.6 L24.37,64.8 L28.87,37.8 Z"></path><path class="ayy-chart__line" d="M50,17.2 L76.33,34.8 L80.48,67.6 L50,77.6 L24.37,64.8 L28.87,37.8 Z"></path></g><g class="ayy-chart__series ayy-chart__series--compare"><path class="ayy-chart__area" d="M50,20.4 L74.6,35.8 L79.44,67 L50,80.4 L26.44,63.6 L31.99,39.6 Z"></path><path class="ayy-chart__line" d="M50,20.4 L74.6,35.8 L79.44,67 L50,80.4 L26.44,63.6 L31.99,39.6 Z"></path></g></svg>
        <span class="ayy-chart__label" style="--ayy-x: 50; --ayy-y: 92">Ease of use</span>
        <span class="ayy-chart__label" style="--ayy-x: 86.37; --ayy-y: 71">Speed</span>
        <span class="ayy-chart__label" style="--ayy-x: 86.37; --ayy-y: 29">Reliability</span>
        <span class="ayy-chart__label" style="--ayy-x: 50; --ayy-y: 8">Support</span>
        <span class="ayy-chart__label" style="--ayy-x: 13.63; --ayy-y: 29">Value</span>
        <span class="ayy-chart__label" style="--ayy-x: 13.63; --ayy-y: 71">Docs</span>
      </div>
      <ul class="ayy-chart__legend" aria-hidden="true">
        <li class="ayy-chart__legend-item"><span class="ayy-chart__swatch"></span>2026</li>
        <li class="ayy-chart__legend-item ayy-chart__legend-item--compare"><span class="ayy-chart__swatch"></span>2025</li>
      </ul>
      <div class="ayy-sr-only">
        <table>
          <caption>Customer survey scores out of 10, this year and last</caption>
          <thead>
            <tr>
              <td></td>
              <th scope="col">2026</th>
              <th scope="col">2025</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Ease of use</th>
              <td>8.2</td>
              <td>7.4</td>
            </tr>
            <tr>
              <th scope="row">Speed</th>
              <td>7.6</td>
              <td>7.1</td>
            </tr>
            <tr>
              <th scope="row">Reliability</th>
              <td>8.8</td>
              <td>8.5</td>
            </tr>
            <tr>
              <th scope="row">Support</th>
              <td>6.9</td>
              <td>7.6</td>
            </tr>
            <tr>
              <th scope="row">Value</th>
              <td>7.4</td>
              <td>6.8</td>
            </tr>
            <tr>
              <th scope="row">Docs</th>
              <td>6.1</td>
              <td>5.2</td>
            </tr>
          </tbody>
        </table>
      </div>
    </figure>
  </div>
</div>
```

React:

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle, RadarChart } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Card style={{ inlineSize: "100%", maxInlineSize: "32rem" }}>
      <CardHeader>
        <CardTitle>Customer survey</CardTitle>
        <CardDescription>Average score out of 10 · support slipped, docs caught up</CardDescription>
      </CardHeader>
      <CardContent>
        <RadarChart
          label="Customer survey scores out of 10, this year and last"
          axes={["Ease of use", "Speed", "Reliability", "Support", "Value", "Docs"]}
          max={10}
          format={(value) => value.toFixed(1)}
          series={[
            { name: "2026", values: [8.2, 7.6, 8.8, 6.9, 7.4, 6.1] },
            { name: "2025", compare: true, values: [7.4, 7.1, 8.5, 7.6, 6.8, 5.2] },
          ]}
        />
      </CardContent>
    </Card>
  );
}
```

## Chart — Heatmap

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-card" style="inline-size: 100%; max-inline-size: 36rem">
  <div class="ayy-card__header">
    <h3 class="ayy-card__title">When tickets arrive</h3>
    <p class="ayy-card__description">Last four weeks, by day and two-hour slot · busiest Monday 12–2pm</p>
  </div>
  <div class="ayy-card__content">
    <figure class="ayy-chart">
      <div class="ayy-heatmap" aria-hidden="true" style="--ayy-columns: 12">
        <div class="ayy-heatmap__row">
          <span class="ayy-heatmap__label">Mon</span>
          <span class="ayy-heatmap__cell" data-value="Mon, 12am: 3" style="--ayy-value: 6.5"></span>
          <span class="ayy-heatmap__cell" data-value="Mon, 2am: 1" style="--ayy-value: 2.2"></span>
          <span class="ayy-heatmap__cell" data-value="Mon, 4am: 4" style="--ayy-value: 8.7"></span>
          <span class="ayy-heatmap__cell" data-value="Mon, 6am: 5" style="--ayy-value: 10.9"></span>
          <span class="ayy-heatmap__cell" data-value="Mon, 8am: 23" style="--ayy-value: 50"></span>
          <span class="ayy-heatmap__cell" data-value="Mon, 10am: 42" style="--ayy-value: 91.3"></span>
          <span class="ayy-heatmap__cell" data-value="Mon, 12pm: 46" style="--ayy-value: 100"></span>
          <span class="ayy-heatmap__cell" data-value="Mon, 2pm: 41" style="--ayy-value: 89.1"></span>
          <span class="ayy-heatmap__cell" data-value="Mon, 4pm: 37" style="--ayy-value: 80.4"></span>
          <span class="ayy-heatmap__cell" data-value="Mon, 6pm: 21" style="--ayy-value: 45.7"></span>
          <span class="ayy-heatmap__cell" data-value="Mon, 8pm: 10" style="--ayy-value: 21.7"></span>
          <span class="ayy-heatmap__cell" data-value="Mon, 10pm: 2" style="--ayy-value: 4.3"></span>
        </div>
        <div class="ayy-heatmap__row">
          <span class="ayy-heatmap__label">Tue</span>
          <span class="ayy-heatmap__cell" data-value="Tue, 12am: 2" style="--ayy-value: 4.3"></span>
          <span class="ayy-heatmap__cell" data-value="Tue, 2am: 4" style="--ayy-value: 8.7"></span>
          <span class="ayy-heatmap__cell" data-value="Tue, 4am: 1" style="--ayy-value: 2.2"></span>
          <span class="ayy-heatmap__cell" data-value="Tue, 6am: 3" style="--ayy-value: 6.5"></span>
          <span class="ayy-heatmap__cell" data-value="Tue, 8am: 20" style="--ayy-value: 43.5"></span>
          <span class="ayy-heatmap__cell" data-value="Tue, 10am: 39" style="--ayy-value: 84.8"></span>
          <span class="ayy-heatmap__cell" data-value="Tue, 12pm: 42" style="--ayy-value: 91.3"></span>
          <span class="ayy-heatmap__cell" data-value="Tue, 2pm: 35" style="--ayy-value: 76.1"></span>
          <span class="ayy-heatmap__cell" data-value="Tue, 4pm: 31" style="--ayy-value: 67.4"></span>
          <span class="ayy-heatmap__cell" data-value="Tue, 6pm: 18" style="--ayy-value: 39.1"></span>
          <span class="ayy-heatmap__cell" data-value="Tue, 8pm: 7" style="--ayy-value: 15.2"></span>
          <span class="ayy-heatmap__cell" data-value="Tue, 10pm: 7" style="--ayy-value: 15.2"></span>
        </div>
        <div class="ayy-heatmap__row">
          <span class="ayy-heatmap__label">Wed</span>
          <span class="ayy-heatmap__cell" data-value="Wed, 12am: 1" style="--ayy-value: 2.2"></span>
          <span class="ayy-heatmap__cell" data-value="Wed, 2am: 2" style="--ayy-value: 4.3"></span>
          <span class="ayy-heatmap__cell" data-value="Wed, 4am: 3" style="--ayy-value: 6.5"></span>
          <span class="ayy-heatmap__cell" data-value="Wed, 6am: 6" style="--ayy-value: 13"></span>
          <span class="ayy-heatmap__cell" data-value="Wed, 8am: 21" style="--ayy-value: 45.7"></span>
          <span class="ayy-heatmap__cell" data-value="Wed, 10am: 39" style="--ayy-value: 84.8"></span>
          <span class="ayy-heatmap__cell" data-value="Wed, 12pm: 39" style="--ayy-value: 84.8"></span>
          <span class="ayy-heatmap__cell" data-value="Wed, 2pm: 37" style="--ayy-value: 80.4"></span>
          <span class="ayy-heatmap__cell" data-value="Wed, 4pm: 30" style="--ayy-value: 65.2"></span>
          <span class="ayy-heatmap__cell" data-value="Wed, 6pm: 20" style="--ayy-value: 43.5"></span>
          <span class="ayy-heatmap__cell" data-value="Wed, 8pm: 8" style="--ayy-value: 17.4"></span>
          <span class="ayy-heatmap__cell" data-value="Wed, 10pm: 2" style="--ayy-value: 4.3"></span>
        </div>
        <div class="ayy-heatmap__row">
          <span class="ayy-heatmap__label">Thu</span>
          <span class="ayy-heatmap__cell" data-value="Thu, 12am: 2" style="--ayy-value: 4.3"></span>
          <span class="ayy-heatmap__cell" data-value="Thu, 2am: 1" style="--ayy-value: 2.2"></span>
          <span class="ayy-heatmap__cell" data-value="Thu, 4am: 2" style="--ayy-value: 4.3"></span>
          <span class="ayy-heatmap__cell" data-value="Thu, 6am: 5" style="--ayy-value: 10.9"></span>
          <span class="ayy-heatmap__cell" data-value="Thu, 8am: 24" style="--ayy-value: 52.2"></span>
          <span class="ayy-heatmap__cell" data-value="Thu, 10am: 40" style="--ayy-value: 87"></span>
          <span class="ayy-heatmap__cell" data-value="Thu, 12pm: 39" style="--ayy-value: 84.8"></span>
          <span class="ayy-heatmap__cell" data-value="Thu, 2pm: 33" style="--ayy-value: 71.7"></span>
          <span class="ayy-heatmap__cell" data-value="Thu, 4pm: 29" style="--ayy-value: 63"></span>
          <span class="ayy-heatmap__cell" data-value="Thu, 6pm: 20" style="--ayy-value: 43.5"></span>
          <span class="ayy-heatmap__cell" data-value="Thu, 8pm: 7" style="--ayy-value: 15.2"></span>
          <span class="ayy-heatmap__cell" data-value="Thu, 10pm: 4" style="--ayy-value: 8.7"></span>
        </div>
        <div class="ayy-heatmap__row">
          <span class="ayy-heatmap__label">Fri</span>
          <span class="ayy-heatmap__cell" data-value="Fri, 12am: 3" style="--ayy-value: 6.5"></span>
          <span class="ayy-heatmap__cell" data-value="Fri, 2am: 4" style="--ayy-value: 8.7"></span>
          <span class="ayy-heatmap__cell" data-value="Fri, 4am: 3" style="--ayy-value: 6.5"></span>
          <span class="ayy-heatmap__cell" data-value="Fri, 6am: 3" style="--ayy-value: 6.5"></span>
          <span class="ayy-heatmap__cell" data-value="Fri, 8am: 17" style="--ayy-value: 37"></span>
          <span class="ayy-heatmap__cell" data-value="Fri, 10am: 33" style="--ayy-value: 71.7"></span>
          <span class="ayy-heatmap__cell" data-value="Fri, 12pm: 34" style="--ayy-value: 73.9"></span>
          <span class="ayy-heatmap__cell" data-value="Fri, 2pm: 32" style="--ayy-value: 69.6"></span>
          <span class="ayy-heatmap__cell" data-value="Fri, 4pm: 27" style="--ayy-value: 58.7"></span>
          <span class="ayy-heatmap__cell" data-value="Fri, 6pm: 14" style="--ayy-value: 30.4"></span>
          <span class="ayy-heatmap__cell" data-value="Fri, 8pm: 10" style="--ayy-value: 21.7"></span>
          <span class="ayy-heatmap__cell" data-value="Fri, 10pm: 1" style="--ayy-value: 2.2"></span>
        </div>
        <div class="ayy-heatmap__row">
          <span class="ayy-heatmap__label">Sat</span>
          <span class="ayy-heatmap__cell" data-value="Sat, 12am: 0" style="--ayy-value: 0"></span>
          <span class="ayy-heatmap__cell" data-value="Sat, 2am: 0" style="--ayy-value: 0"></span>
          <span class="ayy-heatmap__cell" data-value="Sat, 4am: 0" style="--ayy-value: 0"></span>
          <span class="ayy-heatmap__cell" data-value="Sat, 6am: 1" style="--ayy-value: 2.2"></span>
          <span class="ayy-heatmap__cell" data-value="Sat, 8am: 11" style="--ayy-value: 23.9"></span>
          <span class="ayy-heatmap__cell" data-value="Sat, 10am: 14" style="--ayy-value: 30.4"></span>
          <span class="ayy-heatmap__cell" data-value="Sat, 12pm: 11" style="--ayy-value: 23.9"></span>
          <span class="ayy-heatmap__cell" data-value="Sat, 2pm: 15" style="--ayy-value: 32.6"></span>
          <span class="ayy-heatmap__cell" data-value="Sat, 4pm: 10" style="--ayy-value: 21.7"></span>
          <span class="ayy-heatmap__cell" data-value="Sat, 6pm: 7" style="--ayy-value: 15.2"></span>
          <span class="ayy-heatmap__cell" data-value="Sat, 8pm: 5" style="--ayy-value: 10.9"></span>
          <span class="ayy-heatmap__cell" data-value="Sat, 10pm: 0" style="--ayy-value: 0"></span>
        </div>
        <div class="ayy-heatmap__row">
          <span class="ayy-heatmap__label">Sun</span>
          <span class="ayy-heatmap__cell" data-value="Sun, 12am: 0" style="--ayy-value: 0"></span>
          <span class="ayy-heatmap__cell" data-value="Sun, 2am: 2" style="--ayy-value: 4.3"></span>
          <span class="ayy-heatmap__cell" data-value="Sun, 4am: 0" style="--ayy-value: 0"></span>
          <span class="ayy-heatmap__cell" data-value="Sun, 6am: 4" style="--ayy-value: 8.7"></span>
          <span class="ayy-heatmap__cell" data-value="Sun, 8am: 7" style="--ayy-value: 15.2"></span>
          <span class="ayy-heatmap__cell" data-value="Sun, 10am: 14" style="--ayy-value: 30.4"></span>
          <span class="ayy-heatmap__cell" data-value="Sun, 12pm: 12" style="--ayy-value: 26.1"></span>
          <span class="ayy-heatmap__cell" data-value="Sun, 2pm: 15" style="--ayy-value: 32.6"></span>
          <span class="ayy-heatmap__cell" data-value="Sun, 4pm: 12" style="--ayy-value: 26.1"></span>
          <span class="ayy-heatmap__cell" data-value="Sun, 6pm: 6" style="--ayy-value: 13"></span>
          <span class="ayy-heatmap__cell" data-value="Sun, 8pm: 5" style="--ayy-value: 10.9"></span>
          <span class="ayy-heatmap__cell" data-value="Sun, 10pm: 0" style="--ayy-value: 0"></span>
        </div>
        <div class="ayy-heatmap__row">
          <span></span>
          <span class="ayy-heatmap__label">12am</span>
          <span class="ayy-heatmap__label"></span>
          <span class="ayy-heatmap__label">4am</span>
          <span class="ayy-heatmap__label"></span>
          <span class="ayy-heatmap__label">8am</span>
          <span class="ayy-heatmap__label"></span>
          <span class="ayy-heatmap__label">12pm</span>
          <span class="ayy-heatmap__label"></span>
          <span class="ayy-heatmap__label">4pm</span>
          <span class="ayy-heatmap__label"></span>
          <span class="ayy-heatmap__label">8pm</span>
          <span class="ayy-heatmap__label"></span>
        </div>
      </div>
      <p class="ayy-heatmap__key" aria-hidden="true">
        <span>Less</span>
        <span class="ayy-heatmap__cell" style="--ayy-value: 0"></span>
        <span class="ayy-heatmap__cell" style="--ayy-value: 25"></span>
        <span class="ayy-heatmap__cell" style="--ayy-value: 50"></span>
        <span class="ayy-heatmap__cell" style="--ayy-value: 75"></span>
        <span class="ayy-heatmap__cell" style="--ayy-value: 100"></span>
        <span>More</span>
      </p>
      <div class="ayy-sr-only">
        <table>
          <caption>Support tickets by day and time, last four weeks</caption>
          <thead>
            <tr>
              <td></td>
              <th scope="col">12am</th>
              <th scope="col">2am</th>
              <th scope="col">4am</th>
              <th scope="col">6am</th>
              <th scope="col">8am</th>
              <th scope="col">10am</th>
              <th scope="col">12pm</th>
              <th scope="col">2pm</th>
              <th scope="col">4pm</th>
              <th scope="col">6pm</th>
              <th scope="col">8pm</th>
              <th scope="col">10pm</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Mon</th>
              <td>3</td>
              <td>1</td>
              <td>4</td>
              <td>5</td>
              <td>23</td>
              <td>42</td>
              <td>46</td>
              <td>41</td>
              <td>37</td>
              <td>21</td>
              <td>10</td>
              <td>2</td>
            </tr>
            <tr>
              <th scope="row">Tue</th>
              <td>2</td>
              <td>4</td>
              <td>1</td>
              <td>3</td>
              <td>20</td>
              <td>39</td>
              <td>42</td>
              <td>35</td>
              <td>31</td>
              <td>18</td>
              <td>7</td>
              <td>7</td>
            </tr>
            <tr>
              <th scope="row">Wed</th>
              <td>1</td>
              <td>2</td>
              <td>3</td>
              <td>6</td>
              <td>21</td>
              <td>39</td>
              <td>39</td>
              <td>37</td>
              <td>30</td>
              <td>20</td>
              <td>8</td>
              <td>2</td>
            </tr>
            <tr>
              <th scope="row">Thu</th>
              <td>2</td>
              <td>1</td>
              <td>2</td>
              <td>5</td>
              <td>24</td>
              <td>40</td>
              <td>39</td>
              <td>33</td>
              <td>29</td>
              <td>20</td>
              <td>7</td>
              <td>4</td>
            </tr>
            <tr>
              <th scope="row">Fri</th>
              <td>3</td>
              <td>4</td>
              <td>3</td>
              <td>3</td>
              <td>17</td>
              <td>33</td>
              <td>34</td>
              <td>32</td>
              <td>27</td>
              <td>14</td>
              <td>10</td>
              <td>1</td>
            </tr>
            <tr>
              <th scope="row">Sat</th>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>1</td>
              <td>11</td>
              <td>14</td>
              <td>11</td>
              <td>15</td>
              <td>10</td>
              <td>7</td>
              <td>5</td>
              <td>0</td>
            </tr>
            <tr>
              <th scope="row">Sun</th>
              <td>0</td>
              <td>2</td>
              <td>0</td>
              <td>4</td>
              <td>7</td>
              <td>14</td>
              <td>12</td>
              <td>15</td>
              <td>12</td>
              <td>6</td>
              <td>5</td>
              <td>0</td>
            </tr>
          </tbody>
        </table>
      </div>
    </figure>
  </div>
</div>
```

React:

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle, HeatmapChart } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Card style={{ inlineSize: "100%", maxInlineSize: "36rem" }}>
      <CardHeader>
        <CardTitle>When tickets arrive</CardTitle>
        <CardDescription>Last four weeks, by day and two-hour slot · busiest Monday 12–2pm</CardDescription>
      </CardHeader>
      <CardContent>
        <HeatmapChart
          label="Support tickets by day and time, last four weeks"
          rows={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
          columns={["12am", "2am", "4am", "6am", "8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm", "10pm"]}
          values={[
            [3, 1, 4, 5, 23, 42, 46, 41, 37, 21, 10, 2],
            [2, 4, 1, 3, 20, 39, 42, 35, 31, 18, 7, 7],
            [1, 2, 3, 6, 21, 39, 39, 37, 30, 20, 8, 2],
            [2, 1, 2, 5, 24, 40, 39, 33, 29, 20, 7, 4],
            [3, 4, 3, 3, 17, 33, 34, 32, 27, 14, 10, 1],
            [0, 0, 0, 1, 11, 14, 11, 15, 10, 7, 5, 0],
            [0, 2, 0, 4, 7, 14, 12, 15, 12, 6, 5, 0],
          ]}
        />
      </CardContent>
    </Card>
  );
}
```

## Chart — Funnel

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-card" style="inline-size: 100%; max-inline-size: 36rem">
  <div class="ayy-card__header">
    <h3 class="ayy-card__title">Signup funnel</h3>
    <p class="ayy-card__description">Last 30 days · rates are of the step before</p>
  </div>
  <div class="ayy-card__content">
    <ol class="ayy-funnel" aria-label="Signup funnel, last 30 days">
      <li class="ayy-funnel__step" style="--ayy-value: 100">
        <span class="ayy-funnel__label">Visited pricing</span>
        <span class="ayy-funnel__bar"></span>
        <span class="ayy-funnel__value">12,400</span>
        <span class="ayy-funnel__rate">100%</span>
      </li>
      <li class="ayy-funnel__step" style="--ayy-value: 39">
        <span class="ayy-funnel__label">Started signup</span>
        <span class="ayy-funnel__bar"></span>
        <span class="ayy-funnel__value">4,830</span>
        <span class="ayy-funnel__rate">39%<span class="ayy-sr-only"> of the step before</span></span>
      </li>
      <li class="ayy-funnel__step" style="--ayy-value: 29.1">
        <span class="ayy-funnel__label">Verified email</span>
        <span class="ayy-funnel__bar"></span>
        <span class="ayy-funnel__value">3,610</span>
        <span class="ayy-funnel__rate">74.7%<span class="ayy-sr-only"> of the step before</span></span>
      </li>
      <li class="ayy-funnel__step" style="--ayy-value: 18.1">
        <span class="ayy-funnel__label">Created a workspace</span>
        <span class="ayy-funnel__bar"></span>
        <span class="ayy-funnel__value">2,240</span>
        <span class="ayy-funnel__rate">62%<span class="ayy-sr-only"> of the step before</span></span>
      </li>
      <li class="ayy-funnel__step" style="--ayy-value: 9">
        <span class="ayy-funnel__label">Invited a teammate</span>
        <span class="ayy-funnel__bar"></span>
        <span class="ayy-funnel__value">1,120</span>
        <span class="ayy-funnel__rate">50%<span class="ayy-sr-only"> of the step before</span></span>
      </li>
    </ol>
  </div>
</div>
```

React:

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle, FunnelChart } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Card style={{ inlineSize: "100%", maxInlineSize: "36rem" }}>
      <CardHeader>
        <CardTitle>Signup funnel</CardTitle>
        <CardDescription>Last 30 days · rates are of the step before</CardDescription>
      </CardHeader>
      <CardContent>
        <FunnelChart
          aria-label="Signup funnel, last 30 days"
          steps={[
            { label: "Visited pricing", value: 12400 },
            { label: "Started signup", value: 4830 },
            { label: "Verified email", value: 3610 },
            { label: "Created a workspace", value: 2240 },
            { label: "Invited a teammate", value: 1120 },
          ]}
        />
      </CardContent>
    </Card>
  );
}
```

## Chart — Bar list: top pages

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-card" style="inline-size: 100%; max-inline-size: 26rem">
  <div class="ayy-card__header">
    <div class="ayy-spread">
      <h3 class="ayy-card__title">Top pages</h3>
      <span class="ayy-muted">Views</span>
    </div>
  </div>
  <div class="ayy-card__content">
    <ol class="ayy-bar-list">
      <li class="ayy-bar-list__item" style="--ayy-value: 100">
        <span class="ayy-bar-list__label"><a class="ayy-link" href="#pricing">/pricing</a></span>
        <span class="ayy-bar-list__value">8,210</span>
      </li>
      <li class="ayy-bar-list__item" style="--ayy-value: 84.4">
        <span class="ayy-bar-list__label"><a class="ayy-link" href="#home">/</a></span>
        <span class="ayy-bar-list__value">6,930</span>
      </li>
      <li class="ayy-bar-list__item" style="--ayy-value: 50.2">
        <span class="ayy-bar-list__label"><a class="ayy-link" href="#launch-week">/blog/launch-week</a></span>
        <span class="ayy-bar-list__value">4,120</span>
      </li>
      <li class="ayy-bar-list__item" style="--ayy-value: 36.3">
        <span class="ayy-bar-list__label"><a class="ayy-link" href="#getting-started">/docs/getting-started</a></span>
        <span class="ayy-bar-list__value">2,980</span>
      </li>
      <li class="ayy-bar-list__item" style="--ayy-value: 14.7">
        <span class="ayy-bar-list__label"><a class="ayy-link" href="#changelog">/changelog</a></span>
        <span class="ayy-bar-list__value">1,210</span>
      </li>
    </ol>
  </div>
</div>
```

React:

```tsx
import { BarList, Card, CardContent, CardHeader, CardTitle } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Card style={{ inlineSize: "100%", maxInlineSize: "26rem" }}>
      <CardHeader>
        <div className="ayy-spread">
          <CardTitle>Top pages</CardTitle>
          <span className="ayy-muted">Views</span>
        </div>
      </CardHeader>
      <CardContent>
        <BarList
          items={[
            { label: "/pricing", value: 8210, href: "#pricing" },
            { label: "/", value: 6930, href: "#home" },
            { label: "/blog/launch-week", value: 4120, href: "#launch-week" },
            { label: "/docs/getting-started", value: 2980, href: "#getting-started" },
            { label: "/changelog", value: 1210, href: "#changelog" },
          ]}
        />
      </CardContent>
    </Card>
  );
}
```

## Chart — Sparklines in stats

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-grid" style="--ayy-min: 12rem; inline-size: 100%">
  <div class="ayy-card">
    <div class="ayy-card__content">
      <div class="ayy-spread" style="align-items: end">
        <div class="ayy-stat ayy-stat--sm">
          <p class="ayy-stat__label">Visitors</p>
          <p class="ayy-stat__value">12.8k</p>
        </div>
        <svg class="ayy-sparkline" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false" role="img" aria-label="Visitors, last 10 days, up 9%"><defs><linearGradient id="ayy-chart-sparkline-1" class="ayy-chart__gradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0"></stop><stop offset="1"></stop></linearGradient></defs><path class="ayy-chart__area" d="M0,100 C3.7,93.06 7.41,79.17 11.11,79.17 C14.81,79.17 18.52,89.58 22.22,89.58 C25.93,89.58 29.63,58.33 33.33,58.33 C37.04,58.33 40.74,62.5 44.44,62.5 C48.15,62.5 51.85,37.5 55.56,37.5 C59.26,37.5 62.96,45.83 66.67,45.83 C70.37,45.83 74.07,26.03 77.78,20.83 C81.48,15.63 85.19,18.05 88.89,14.58 C92.59,11.12 96.3,4.86 100,0 L100,100 L0,100 Z" style="fill: url(#ayy-chart-sparkline-1)"></path><path class="ayy-chart__line" d="M0,100 C3.7,93.06 7.41,79.17 11.11,79.17 C14.81,79.17 18.52,89.58 22.22,89.58 C25.93,89.58 29.63,58.33 33.33,58.33 C37.04,58.33 40.74,62.5 44.44,62.5 C48.15,62.5 51.85,37.5 55.56,37.5 C59.26,37.5 62.96,45.83 66.67,45.83 C70.37,45.83 74.07,26.03 77.78,20.83 C81.48,15.63 85.19,18.05 88.89,14.58 C92.59,11.12 96.3,4.86 100,0"></path></svg>
      </div>
    </div>
  </div>
  <div class="ayy-card">
    <div class="ayy-card__content">
      <div class="ayy-spread" style="align-items: end">
        <div class="ayy-stat ayy-stat--sm">
          <p class="ayy-stat__label">Conversion</p>
          <p class="ayy-stat__value">3.4%</p>
        </div>
        <svg class="ayy-sparkline" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false" role="img" aria-label="Conversion, last 10 days, up 0.3 points"><defs><linearGradient id="ayy-chart-sparkline-2" class="ayy-chart__gradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0"></stop><stop offset="1"></stop></linearGradient></defs><path class="ayy-chart__area" d="M0,100 C3.7,88.89 7.41,66.67 11.11,66.67 C14.81,66.67 18.52,100 22.22,100 C25.93,100 29.63,77.78 33.33,66.67 C37.04,55.56 40.74,33.33 44.44,33.33 C48.15,33.33 51.85,66.67 55.56,66.67 C59.26,66.67 62.96,44.44 66.67,33.33 C70.37,22.22 74.07,0 77.78,0 C81.48,0 85.19,33.33 88.89,33.33 C92.59,33.33 96.3,11.11 100,0 L100,100 L0,100 Z" style="fill: url(#ayy-chart-sparkline-2)"></path><path class="ayy-chart__line" d="M0,100 C3.7,88.89 7.41,66.67 11.11,66.67 C14.81,66.67 18.52,100 22.22,100 C25.93,100 29.63,77.78 33.33,66.67 C37.04,55.56 40.74,33.33 44.44,33.33 C48.15,33.33 51.85,66.67 55.56,66.67 C59.26,66.67 62.96,44.44 66.67,33.33 C70.37,22.22 74.07,0 77.78,0 C81.48,0 85.19,33.33 88.89,33.33 C92.59,33.33 96.3,11.11 100,0"></path></svg>
      </div>
    </div>
  </div>
  <div class="ayy-card">
    <div class="ayy-card__content">
      <div class="ayy-spread" style="align-items: end">
        <div class="ayy-stat ayy-stat--sm">
          <p class="ayy-stat__label">Churn</p>
          <p class="ayy-stat__value">1.9%</p>
        </div>
        <svg class="ayy-sparkline" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false" role="img" aria-label="Churn, last 10 days, down 0.4 points" style="--ayy-chart-color: var(--ayy-color-success)"><defs><linearGradient id="ayy-chart-sparkline-3" class="ayy-chart__gradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0"></stop><stop offset="1"></stop></linearGradient></defs><path class="ayy-chart__area" d="M0,0 C3.7,6.67 7.41,20 11.11,20 C14.81,20 18.52,20 22.22,20 C25.93,20 29.63,33.33 33.33,40 C37.04,46.67 40.74,60 44.44,60 C48.15,60 51.85,40 55.56,40 C59.26,40 62.96,80 66.67,80 C70.37,80 74.07,80 77.78,80 C81.48,80 85.19,100 88.89,100 C92.59,100 96.3,100 100,100 L100,100 L0,100 Z" style="fill: url(#ayy-chart-sparkline-3)"></path><path class="ayy-chart__line" d="M0,0 C3.7,6.67 7.41,20 11.11,20 C14.81,20 18.52,20 22.22,20 C25.93,20 29.63,33.33 33.33,40 C37.04,46.67 40.74,60 44.44,60 C48.15,60 51.85,40 55.56,40 C59.26,40 62.96,80 66.67,80 C70.37,80 74.07,80 77.78,80 C81.48,80 85.19,100 88.89,100 C92.59,100 96.3,100 100,100"></path></svg>
      </div>
    </div>
  </div>
</div>
```

React:

```tsx
import type { CSSProperties } from "react";
import { Card, CardContent, Sparkline, Stat } from "@danitesler/ayywi/react";

const stats = [
  { label: "Visitors", value: "12.8k", trend: "up 9%", values: [8, 9, 8.5, 10, 9.8, 11, 10.6, 11.8, 12.1, 12.8], color: undefined },
  { label: "Conversion", value: "3.4%", trend: "up 0.3 points", values: [3.1, 3.2, 3.1, 3.2, 3.3, 3.2, 3.3, 3.4, 3.3, 3.4], color: undefined },
  { label: "Churn", value: "1.9%", trend: "down 0.4 points", values: [2.4, 2.3, 2.3, 2.2, 2.1, 2.2, 2, 2, 1.9, 1.9], color: "var(--ayy-color-success)" },
];

export default function Example() {
  return (
    <div className="ayy-grid" style={{ "--ayy-min": "12rem", inlineSize: "100%" } as CSSProperties}>
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent>
            <div className="ayy-spread" style={{ alignItems: "end" } as CSSProperties}>
              <Stat labelFirst size="sm" label={stat.label} value={stat.value} />
              <Sparkline
                values={stat.values}
                area
                label={`${stat.label}, last 10 days, ${stat.trend}`}
                color={stat.color}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

## Chart — Table chart

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-card" style="inline-size: 100%; max-inline-size: 36rem">
  <div class="ayy-card__header">
    <h3 class="ayy-card__title">Signups by device</h3>
    <p class="ayy-card__description">Last six months · 21.2K in total</p>
  </div>
  <div class="ayy-card__content">
    <div class="ayy-table-wrap">
      <table class="ayy-table">
        <caption>Signups by device, April to September</caption>
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col" class="ayy-table__num">
              <span class="ayy-chart__legend-item" style="--ayy-chart-color: var(--ayy-chart-1)"><span class="ayy-chart__swatch"></span>Desktop</span>
            </th>
            <th scope="col" class="ayy-table__num">
              <span class="ayy-chart__legend-item" style="--ayy-chart-color: var(--ayy-chart-2)"><span class="ayy-chart__swatch"></span>Mobile</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Apr</th>
            <td class="ayy-table__num">1.8K</td>
            <td class="ayy-table__num">920</td>
          </tr>
          <tr>
            <th scope="row">May</th>
            <td class="ayy-table__num">2.1K</td>
            <td class="ayy-table__num">1.2K</td>
          </tr>
          <tr>
            <th scope="row">Jun</th>
            <td class="ayy-table__num">2K</td>
            <td class="ayy-table__num">1.3K</td>
          </tr>
          <tr>
            <th scope="row">Jul</th>
            <td class="ayy-table__num">2.4K</td>
            <td class="ayy-table__num">1.2K</td>
          </tr>
          <tr>
            <th scope="row">Aug</th>
            <td class="ayy-table__num">2.3K</td>
            <td class="ayy-table__num">1.5K</td>
          </tr>
          <tr>
            <th scope="row">Sep</th>
            <td class="ayy-table__num">2.7K</td>
            <td class="ayy-table__num">1.7K</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
```

React:

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle, TableChart } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Card style={{ inlineSize: "100%", maxInlineSize: "36rem" }}>
      <CardHeader>
        <CardTitle>Signups by device</CardTitle>
        <CardDescription>Last six months · 21.2K in total</CardDescription>
      </CardHeader>
      <CardContent>
        <TableChart
          label="Signups by device, April to September"
          labels={["Apr", "May", "Jun", "Jul", "Aug", "Sep"]}
          series={[
            { name: "Desktop", values: [1840, 2120, 1960, 2410, 2280, 2690] },
            { name: "Mobile", values: [920, 1180, 1340, 1210, 1490, 1730] },
          ]}
        />
      </CardContent>
    </Card>
  );
}
```

---
Part of @danitesler/ayywi 0.1.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
