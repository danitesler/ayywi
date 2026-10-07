# Chart

Category: Data display. Charts drawn by CSS with no library: columns (grouped or stacked), lines and areas, a ranked bar list and sparklines. Bars and ticks take --ayy-value (0–100), lines are SVG paths from chartPath(). Series colours are the chart tokens in order, so a chart library can match them.

**Classes**
- `.ayy-chart` — Root, usually a <figure>. A grid of the plot, the labels, the legend and the data table.
- `.ayy-chart--stacked` — A column's bars sit on top of each other; each bar's --ayy-value is its share of the top of the scale.
- `.ayy-chart--values` — Print every bar's data-value above it (otherwise only on hover).
- `.ayy-chart__plot` — The drawing area (aria-hidden="true"). Height from --ayy-chart-height (default 12rem). Holds ticks and either __bars or an __svg.
- `.ayy-chart__tick` — A value line across the plot, its text the label in the gutter. --ayy-value places it: 0 is the floor, 100 the top. The gutter only appears when there are ticks.
- `.ayy-chart__bars` — Row of columns filling the plot.
- `.ayy-chart__column` — One label's bars, side by side (or stacked).
- `.ayy-chart__bar` — A bar, fading toward its base (solid when stacked): --ayy-value is its height, data-value its text on hover. Its colour is chart-1, chart-2… by position in the column; --ayy-chart-color overrides.
- `.ayy-chart__svg` — <svg viewBox="0 0 100 100" preserveAspectRatio="none"> stretched over the plot, for lines and areas. Mirrors in RTL.
- `.ayy-chart__series` — <g> around one series' area and line. Coloured chart-1, chart-2… in order; --ayy-chart-color overrides.
- `.ayy-chart__series--compare` — A comparison series (last period, a target): dashed, quiet, no fill.
- `.ayy-chart__line` — <path> of the line, 2px whatever the stretch (vector-effect: non-scaling-stroke).
- `.ayy-chart__area` — <path> of the area under the line: a 16% tint of the series colour, or fill="url(#…)" an __gradient in its series to fade out toward the floor (React does).
- `.ayy-chart__gradient` — A <linearGradient x2="0" y2="1"> with two <stop>s, inside the series' <g> (in <defs>): its stops take the series colour, 32% at the top to none at the floor.
- `.ayy-chart__labels` — The labels under the plot (aria-hidden="true"), one per column; under a line they spread from the first point to the last.
- `.ayy-chart__legend` — List of the series, when there's more than one (aria-hidden="true" when a data table names them).
- `.ayy-chart__legend-item` — A series name with its swatch, coloured in the same order as the series.
- `.ayy-chart__legend-item--compare` — Legend entry for a comparison series: a dashed swatch.
- `.ayy-chart__swatch` — The colour square in a legend item.
- `.ayy-bar-list` — <ol> of ranked rows (top pages, sources) with the bar behind the text. Readable as it is.
- `.ayy-bar-list__item` — A row; --ayy-value is the bar's length (100 = the largest). The bar fades along the row.
- `.ayy-bar-list__label` — The row's name (or a link), cut with an ellipsis.
- `.ayy-bar-list__value` — The row's number, tabular digits.
- `.ayy-sparkline` — A small <svg viewBox="0 0 100 100" preserveAspectRatio="none"> line with no axes, for a stat or a table cell. Uses __line and __area paths.

**JS (framework-free)**: chartScale(values, { ticks?, min?, max? }) → { min, max, ticks } with a round top; chartPercent(value, max, min?) → 0–100 for --ayy-value; chartPath(values, { min?, max?, smooth? }) → { line, area } path data for the 0 0 100 100 box; chartColors(target?, count?) → resolved rgb() strings and chartTheme(target?) → { colors, text, muted, grid, surface, fontFamily } for canvas libraries (Chart.js, ECharts); chartClass({ stacked?, values?, className? }), chartSeriesClass({ compare? }), chartLegendItemClass({ compare? }) and part class constants.

**React** — `import { BarChart, LineChart, Sparkline, BarList } from "@danitesler/ayywi/react";`
- `<BarChart>` renders <figure class="ayy-chart"> with a plot of __column/__bar, labels, a legend and a visually hidden data table. Props: `label` string — what it shows ("Signups per day"); the data table's caption; `labels` string[] — one per column; `series` { name, values: number[], color? }[]; `stacked` boolean; `showValues` boolean — print values above the bars; `max` number — top of the scale; rounded up from the data if omitted; `ticks` number of value lines, default 3; 0 for none; `format` (value: number) => string — ticks, hover values and the table; default compact (1.2K); `height` CSS length, default 12rem; `legend` boolean — default: more than one series
- `<LineChart>` renders <figure class="ayy-chart"> with an __svg of __series paths, labels, a legend and a visually hidden data table. Props: `label` string — the data table's caption; `labels` string[] — one per point; `series` { name, values: number[], color?, compare? }[] — compare draws a dashed comparison line; `min` number, default 0; `max` number; `area` boolean, default true; `smooth` boolean, default true (monotone: never overshoots a point); `ticks` number, default 3; `format` (value: number) => string; `height` CSS length; `legend` boolean
- `<Sparkline>` renders <svg class="ayy-sparkline">. Props: `values` number[]; `label` string — makes it role="img" with this name; without it the sparkline is aria-hidden; `area` boolean; `color` CSS colour, default chart-1; `min` number, default the smallest value; `max` number, default the largest value
- `<BarList>` renders <ol class="ayy-bar-list">. Props: `items` { label: ReactNode, value: number, href? }[]; `max` number — value of a full bar, default the largest; `format` (value: number) => string, default grouped digits; `color` CSS colour, default chart-1

**Accessibility**
- The drawing is aria-hidden. The numbers go in a table (React renders one with .ayy-sr-only; add a visible Table if people need to compare values), with a <caption> saying what the chart shows.
- Don't rely on colour alone: a legend names the series in the same order, the comparison series is dashed, and a title or a Stat states the takeaway ("Up 12% on last week").
- Series tokens keep 3:1 against every surface in every theme. In High Contrast bars and lines take system colours, alternating between CanvasText and Highlight.
- A Sparkline with a label is an image with that name; give it the trend in words ("Revenue, last 14 days, up 12%").

**Do**
- Use a chart to show a trend or a comparison at a glance: signups per day, revenue against last month, traffic by source. Put it in a Card with the title and the key number (a Stat) above it.
- Use a bar chart to compare amounts across a few categories or periods, a line chart for a trend over many points, a bar list for a ranking, a sparkline beside a number.
- Colour series with the chart tokens in order (React does it). With a chart library, pass var(--ayy-chart-1)… (SVG) or chartColors() (canvas), and chartTheme() for its text, grid and tooltip.
- Mark the previous period as a compare series instead of a second bright colour.
- Keep the scale honest: bars start at 0; let chartScale() round the top.

**Don't**
- Don't use a chart when the exact numbers matter more than the shape — use a Table or a Data list.
- Don't use a pie or donut for parts of a whole — a Bar list or a stacked bar is easier to read.
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
      <table class="ayy-sr-only">
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
        <svg class="ayy-chart__svg" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false"><g class="ayy-chart__series"><defs><linearGradient id="ayy-chart-line-1-0" class="ayy-chart__gradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0"></stop><stop offset="1"></stop></lineargradient></defs><path class="ayy-chart__area" d="M0,42 C2.56,40.67 5.13,38 7.69,38 C10.26,38 12.82,39 15.38,39 C17.95,39 20.51,32 23.08,32 C25.64,32 28.21,34 30.77,34 C33.33,34 35.9,27 38.46,27 C41.03,27 43.59,36 46.15,36 C48.72,36 51.28,32 53.85,30 C56.41,28 58.97,24 61.54,24 C64.1,24 66.67,26 69.23,26 C71.79,26 74.36,21 76.92,21 C79.49,21 82.05,28 84.62,28 C87.18,28 89.74,18 92.31,18 C94.87,18 97.44,20 100,21 L100,100 L0,100 Z" style="fill: url(#ayy-chart-line-1-0)"></path><path class="ayy-chart__line" d="M0,42 C2.56,40.67 5.13,38 7.69,38 C10.26,38 12.82,39 15.38,39 C17.95,39 20.51,32 23.08,32 C25.64,32 28.21,34 30.77,34 C33.33,34 35.9,27 38.46,27 C41.03,27 43.59,36 46.15,36 C48.72,36 51.28,32 53.85,30 C56.41,28 58.97,24 61.54,24 C64.1,24 66.67,26 69.23,26 C71.79,26 74.36,21 76.92,21 C79.49,21 82.05,28 84.62,28 C87.18,28 89.74,18 92.31,18 C94.87,18 97.44,20 100,21"></path></g><g class="ayy-chart__series ayy-chart__series--compare"><path class="ayy-chart__line" d="M0,46 C2.56,45 5.13,43.67 7.69,43 C10.26,42.33 12.82,42 15.38,42 C17.95,42 20.51,44 23.08,44 C25.64,44 28.21,38 30.77,38 C33.33,38 35.9,39.5 38.46,40 C41.03,40.5 43.59,41 46.15,41 C48.72,41 51.28,36 53.85,36 C56.41,36 58.97,37 61.54,37 C64.1,37 66.67,34 69.23,34 C71.79,34 74.36,35 76.92,35 C79.49,35 82.05,32 84.62,32 C87.18,32 89.74,33 92.31,33 C94.87,33 97.44,31 100,30"></path></g></svg>
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
      <table class="ayy-sr-only">
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
  <table class="ayy-sr-only">
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
        <svg class="ayy-sparkline" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false" role="img" aria-label="Visitors, last 10 days, up 9%"><defs><linearGradient id="ayy-chart-sparkline-1" class="ayy-chart__gradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0"></stop><stop offset="1"></stop></lineargradient></defs><path class="ayy-chart__area" d="M0,100 C3.7,93.06 7.41,79.17 11.11,79.17 C14.81,79.17 18.52,89.58 22.22,89.58 C25.93,89.58 29.63,58.33 33.33,58.33 C37.04,58.33 40.74,62.5 44.44,62.5 C48.15,62.5 51.85,37.5 55.56,37.5 C59.26,37.5 62.96,45.83 66.67,45.83 C70.37,45.83 74.07,26.03 77.78,20.83 C81.48,15.63 85.19,18.05 88.89,14.58 C92.59,11.12 96.3,4.86 100,0 L100,100 L0,100 Z" style="fill: url(#ayy-chart-sparkline-1)"></path><path class="ayy-chart__line" d="M0,100 C3.7,93.06 7.41,79.17 11.11,79.17 C14.81,79.17 18.52,89.58 22.22,89.58 C25.93,89.58 29.63,58.33 33.33,58.33 C37.04,58.33 40.74,62.5 44.44,62.5 C48.15,62.5 51.85,37.5 55.56,37.5 C59.26,37.5 62.96,45.83 66.67,45.83 C70.37,45.83 74.07,26.03 77.78,20.83 C81.48,15.63 85.19,18.05 88.89,14.58 C92.59,11.12 96.3,4.86 100,0"></path></svg>
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
        <svg class="ayy-sparkline" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false" role="img" aria-label="Conversion, last 10 days, up 0.3 points"><defs><linearGradient id="ayy-chart-sparkline-2" class="ayy-chart__gradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0"></stop><stop offset="1"></stop></lineargradient></defs><path class="ayy-chart__area" d="M0,100 C3.7,88.89 7.41,66.67 11.11,66.67 C14.81,66.67 18.52,100 22.22,100 C25.93,100 29.63,77.78 33.33,66.67 C37.04,55.56 40.74,33.33 44.44,33.33 C48.15,33.33 51.85,66.67 55.56,66.67 C59.26,66.67 62.96,44.44 66.67,33.33 C70.37,22.22 74.07,0 77.78,0 C81.48,0 85.19,33.33 88.89,33.33 C92.59,33.33 96.3,11.11 100,0 L100,100 L0,100 Z" style="fill: url(#ayy-chart-sparkline-2)"></path><path class="ayy-chart__line" d="M0,100 C3.7,88.89 7.41,66.67 11.11,66.67 C14.81,66.67 18.52,100 22.22,100 C25.93,100 29.63,77.78 33.33,66.67 C37.04,55.56 40.74,33.33 44.44,33.33 C48.15,33.33 51.85,66.67 55.56,66.67 C59.26,66.67 62.96,44.44 66.67,33.33 C70.37,22.22 74.07,0 77.78,0 C81.48,0 85.19,33.33 88.89,33.33 C92.59,33.33 96.3,11.11 100,0"></path></svg>
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
        <svg class="ayy-sparkline" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false" role="img" aria-label="Churn, last 10 days, down 0.4 points" style="--ayy-chart-color: var(--ayy-color-success)"><defs><linearGradient id="ayy-chart-sparkline-3" class="ayy-chart__gradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0"></stop><stop offset="1"></stop></lineargradient></defs><path class="ayy-chart__area" d="M0,0 C3.7,6.67 7.41,20 11.11,20 C14.81,20 18.52,20 22.22,20 C25.93,20 29.63,33.33 33.33,40 C37.04,46.67 40.74,60 44.44,60 C48.15,60 51.85,40 55.56,40 C59.26,40 62.96,80 66.67,80 C70.37,80 74.07,80 77.78,80 C81.48,80 85.19,100 88.89,100 C92.59,100 96.3,100 100,100 L100,100 L0,100 Z" style="fill: url(#ayy-chart-sparkline-3)"></path><path class="ayy-chart__line" d="M0,0 C3.7,6.67 7.41,20 11.11,20 C14.81,20 18.52,20 22.22,20 C25.93,20 29.63,33.33 33.33,40 C37.04,46.67 40.74,60 44.44,60 C48.15,60 51.85,40 55.56,40 C59.26,40 62.96,80 66.67,80 C70.37,80 74.07,80 77.78,80 C81.48,80 85.19,100 88.89,100 C92.59,100 96.3,100 100,100"></path></svg>
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

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
