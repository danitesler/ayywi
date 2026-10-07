# Table

Category: Data display. Data table with quiet hairlines, uppercase headers and hover rows. Styles plain table elements under .ayy-table.

**Classes**
- `.ayy-table-wrap` — Scroll container around the table (horizontal overflow).
- `.ayy-table` — On the <table>. Styles thead/tbody/tfoot/tr/th/td/caption inside.
- `.ayy-table--compact` — Tighter rows.
- `.ayy-table__num` — On th/td with numbers: end-aligned, tabular digits.
- `.ayy-table__sort` — A <button> inside a sortable <th>, with an arrow drawn after the text. aria-sort="ascending" or "descending" on the <th> marks the sorted column; the others show both arrows, faint.
- `.ayy-table__select` — On the th/td holding a row's checkbox (and the select-all box in the header): as narrow as the box.

**States**
- `default` — Collapsed table, xs text; header row on a wash fill with muted 2xs uppercase labels; hairlines between rows.
- `hover` (`tbody tr:hover; .ayy-table__sort:hover`) — Row gets a wash fill; a sort button's label turns text colour.
- `pressed` — doesn't apply: No pressed look.
- `focus` (`.ayy-table__sort:focus-visible`) — 2px ring on the sort button.
- `disabled` — doesn't apply: Rows aren't disabled; disable the controls in them.
- `selected` (`tr[aria-selected="true"] (with a Checkbox in .ayy-table__select)`) — Wash-hover row fill. Forced colours: Highlight.
- `error` — doesn't apply: Show a failed load as an Alert with a retry instead of the rows.
- `loading` — doesn't apply: No loading look; render Skeleton rows in the column layout with aria-busy on the table.
- `sorted` (`th[aria-sort="ascending" | "descending"]`) — Header label turns text colour and only the arrow that applies shows, at full strength. Forced colours: underlined.

**Sizes**
- Density — Doesn't follow data-density. Header cells are 2.25rem tall, cells padded 12px; compact makes headers 2rem and cells tighter.
- Width — Fills its .ayy-table-wrap, which scrolls sideways when the columns don't fit.

**JS (framework-free)**: tableClass({ compact?, className? }); tableWrapClass, tableNumClass, tableSortClass, tableSelectClass constants; nextSortDirection(current) → "ascending" | "descending"; compareValues(a, b) sorts numbers (also "$1,240", "12 GB") by value and text with digits read as numbers; connectTable(table, { onSort?, onSelectionChange? }) wires sort buttons and row checkboxes on plain markup (used by <ayy-table>).

**Custom element** `<ayy-table>` (ayywi/elements) — 
- event `ayy-sort`: { column, key, direction } before the rows move — key is the <th>'s data-sort-key. Call preventDefault() to sort them yourself (on the server).
- event `ayy-selection-change`: { rows } — the selected <tr> elements.

**React** — `import { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption } from "ayywi/react";`
- `<Table>` renders <div class="ayy-table-wrap"><table>. Props: `compact` boolean
- `<TableHeader>` renders <thead>.
- `<TableBody>` renders <tbody>.
- `<TableFooter>` renders <tfoot>.
- `<TableRow>` renders <tr>. Props: `selected` boolean — aria-selected
- `<TableHead>` renders <th scope="col">, with a <button class="ayy-table__sort"> inside when sortable. Props: `numeric` boolean; `select` boolean — the checkbox column; `sort` "ascending" | "descending" | "none" — makes the header a sort button; "none" for a sortable column that isn't sorted; `onSort` () => void — flip with nextSortDirection() and sort your rows (compareValues helps)
- `<TableCell>` renders <td>. Props: `numeric` boolean; `select` boolean — the checkbox column
- `<TableCaption>` renders <caption>.

**Accessibility**
- Use real <th> header cells with scope (React sets scope="col").
- A <caption> or aria-label names the table for screen readers.
- Sorting is a button inside the header, so it's reachable by Tab and announced with the column's aria-sort. Only the sorted column carries aria-sort.
- Every row checkbox needs an aria-label naming its row ("Select INV-1042"); the select-all box is indeterminate when some rows are selected.

**Do**
- Use a table to compare items across the same attributes (projects × status × builds).
- End-align numbers with numeric/ayy-table__num.
- Keep cell content short; truncate with a tooltip if needed.
- Make the columns people scan sortable (names, dates, amounts), and start sorted by the most useful one. Put the real value in data-sort-value when the cell shows a formatted one (a date, a currency).
- Add a checkbox column only when rows have bulk actions, and show the count and the actions above the table.
- Filter a table with Chips and a search InputGroup above it; page a long one with Pagination below.

**Don't**
- Don't use tables for layout.
- Don't use a table for rows with one attribute — use a List.
- Don't zebra-stripe; hairlines + hover are enough.
- Don't nest interactive controls in every cell — one action column is plenty.

## Table — Basic

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-table-wrap">
  <table class="ayy-table">
    <caption>Deployments</caption>
    <thead>
      <tr>
        <th scope="col">Project</th>
        <th scope="col">Status</th>
        <th scope="col" class="ayy-table__num">Builds</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Marketing site</td>
        <td><span class="ayy-badge ayy-badge--success">Live</span></td>
        <td class="ayy-table__num">128</td>
      </tr>
      <tr>
        <td>Mobile API</td>
        <td><span class="ayy-badge ayy-badge--warning">Building</span></td>
        <td class="ayy-table__num">42</td>
      </tr>
      <tr>
        <td>Docs</td>
        <td><span class="ayy-badge ayy-badge--destructive">Failed</span></td>
        <td class="ayy-table__num">7</td>
      </tr>
    </tbody>
  </table>
</div>
```

React:

```tsx
import { Badge, Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "ayywi/react";

const deployments = [
  { project: "Marketing site", status: "Live", variant: "success", builds: 128 },
  { project: "Mobile API", status: "Building", variant: "warning", builds: 42 },
  { project: "Docs", status: "Failed", variant: "destructive", builds: 7 },
] as const;

export default function Example() {
  return (
    <Table>
      <TableCaption>Deployments</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead>Status</TableHead>
          <TableHead numeric>Builds</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {deployments.map((d) => (
          <TableRow key={d.project}>
            <TableCell>{d.project}</TableCell>
            <TableCell>
              <Badge variant={d.variant}>{d.status}</Badge>
            </TableCell>
            <TableCell numeric>{d.builds}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

## Table — Sortable columns and selectable rows

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-table> sorts the rows and ticks the checkboxes; listen for ayy-sort and ayy-selection-change. -->
<div class="ayy-stack" style="inline-size: 100%">
  <div class="ayy-spread">
    <span class="ayy-muted">1 selected</span>
    <button type="button" class="ayy-button ayy-button--outline ayy-button--sm">Send reminder</button>
  </div>
  <ayy-table>
    <div class="ayy-table-wrap">
      <table class="ayy-table">
        <caption class="ayy-sr-only">Invoices, sortable by customer, due date and amount</caption>
        <thead>
          <tr>
            <th scope="col" class="ayy-table__select"><input type="checkbox" class="ayy-checkbox" aria-label="Select all invoices"/></th>
            <th scope="col">Invoice</th>
            <th scope="col"><button type="button" class="ayy-table__sort">Customer</button></th>
            <th scope="col" aria-sort="ascending"><button type="button" class="ayy-table__sort">Due</button></th>
            <th scope="col" class="ayy-table__num"><button type="button" class="ayy-table__sort">Amount</button></th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr aria-selected="true">
            <td class="ayy-table__select"><input type="checkbox" class="ayy-checkbox" aria-label="Select INV-1043" checked=""/></td>
            <td class="ayy-mono">INV-1043</td>
            <td>Acme Studio</td>
            <td data-sort-value="2026-08-28"><time datetime="2026-08-28">Aug 28</time></td>
            <td class="ayy-table__num" data-sort-value="860">$860.00</td>
            <td><span class="ayy-badge ayy-badge--destructive">Overdue</span></td>
          </tr>
          <tr aria-selected="false">
            <td class="ayy-table__select"><input type="checkbox" class="ayy-checkbox" aria-label="Select INV-1042"/></td>
            <td class="ayy-mono">INV-1042</td>
            <td>Northwind</td>
            <td data-sort-value="2026-09-02"><time datetime="2026-09-02">Sep 2</time></td>
            <td class="ayy-table__num" data-sort-value="1240">$1,240.00</td>
            <td><span class="ayy-badge ayy-badge--success">Paid</span></td>
          </tr>
          <tr aria-selected="false">
            <td class="ayy-table__select"><input type="checkbox" class="ayy-checkbox" aria-label="Select INV-1045"/></td>
            <td class="ayy-mono">INV-1045</td>
            <td>Brightside</td>
            <td data-sort-value="2026-09-15"><time datetime="2026-09-15">Sep 15</time></td>
            <td class="ayy-table__num" data-sort-value="420">$420.00</td>
            <td><span class="ayy-badge ayy-badge--info">Sent</span></td>
          </tr>
          <tr aria-selected="false">
            <td class="ayy-table__select"><input type="checkbox" class="ayy-checkbox" aria-label="Select INV-1044"/></td>
            <td class="ayy-mono">INV-1044</td>
            <td>Lumen Labs</td>
            <td data-sort-value="2026-09-30"><time datetime="2026-09-30">Sep 30</time></td>
            <td class="ayy-table__num" data-sort-value="3150">$3,150.00</td>
            <td><span class="ayy-badge ayy-badge--muted">Draft</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </ayy-table>
</div>
```

React:

```tsx
import { useState } from "react";
import {
  Badge,
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  compareValues,
  nextSortDirection,
  type SortDirection,
} from "ayywi/react";

const invoices = [
  { id: "INV-1042", customer: "Northwind", status: "Paid", variant: "success", amount: 1240, due: "2026-09-02" },
  { id: "INV-1043", customer: "Acme Studio", status: "Overdue", variant: "destructive", amount: 860, due: "2026-08-28" },
  { id: "INV-1044", customer: "Lumen Labs", status: "Draft", variant: "muted", amount: 3150, due: "2026-09-30" },
  { id: "INV-1045", customer: "Brightside", status: "Sent", variant: "info", amount: 420, due: "2026-09-15" },
] as const;

type Key = "customer" | "amount" | "due";

const COLUMNS: { key: Key; label: string; numeric?: boolean }[] = [
  { key: "customer", label: "Customer" },
  { key: "due", label: "Due" },
  { key: "amount", label: "Amount", numeric: true },
];

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export default function Example() {
  const [sort, setSort] = useState<{ key: Key; direction: SortDirection }>({ key: "due", direction: "ascending" });
  const [selected, setSelected] = useState<string[]>(["INV-1043"]);
  const rows = [...invoices].sort((a, b) => (sort.direction === "ascending" ? 1 : -1) * compareValues(a[sort.key], b[sort.key]));
  const all = selected.length === invoices.length;
  const toggle = (id: string, on: boolean) => setSelected((list) => (on ? [...list, id] : list.filter((x) => x !== id)));

  return (
    <div className="ayy-stack" style={{ inlineSize: "100%" }}>
      <div className="ayy-spread">
        <span className="ayy-muted">{selected.length ? `${selected.length} selected` : `${invoices.length} invoices`}</span>
        <Button size="sm" variant="outline" disabled={!selected.length}>
          Send reminder
        </Button>
      </div>
      <Table>
        <TableCaption className="ayy-sr-only">Invoices, sortable by customer, due date and amount</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead select>
              <Checkbox
                aria-label="Select all invoices"
                checked={all}
                indeterminate={selected.length > 0 && !all}
                onCheckedChange={(on) => setSelected(on ? invoices.map((i) => i.id) : [])}
              />
            </TableHead>
            <TableHead>Invoice</TableHead>
            {COLUMNS.map((column) => (
              <TableHead
                key={column.key}
                numeric={column.numeric}
                sort={sort.key === column.key ? sort.direction : "none"}
                onSort={() =>
                  setSort({ key: column.key, direction: sort.key === column.key ? nextSortDirection(sort.direction) : "ascending" })
                }
              >
                {column.label}
              </TableHead>
            ))}
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((invoice) => (
            <TableRow key={invoice.id} selected={selected.includes(invoice.id)}>
              <TableCell select>
                <Checkbox
                  aria-label={`Select ${invoice.id}`}
                  checked={selected.includes(invoice.id)}
                  onCheckedChange={(on) => toggle(invoice.id, on)}
                />
              </TableCell>
              <TableCell className="ayy-mono">{invoice.id}</TableCell>
              <TableCell>{invoice.customer}</TableCell>
              <TableCell data-sort-value={invoice.due}>
                <time dateTime={invoice.due}>{new Date(`${invoice.due}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</time>
              </TableCell>
              <TableCell numeric data-sort-value={invoice.amount}>
                {money.format(invoice.amount)}
              </TableCell>
              <TableCell>
                <Badge variant={invoice.variant}>{invoice.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

---
Part of ayywi 0.4.0: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
