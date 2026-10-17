# Table

Category: Data display. Data table with quiet hairlines, uppercase headers, hover rows, inline row actions and multi-select. Styles plain table elements under .ayy-table. Also called: table, data-table, datagrid.

**Classes**
- `.ayy-table-wrap` — Scroll container around the table (horizontal overflow).
- `.ayy-table` — On the <table>. Styles thead/tbody/tfoot/tr/th/td/caption inside.
- `.ayy-table--compact` — Tighter rows.
- `.ayy-table__num` — On th/td with numbers: end-aligned, tabular digits.
- `.ayy-table__sort` — A <button> inside a sortable <th>, with an arrow drawn after the text. aria-sort="ascending" or "descending" on the <th> marks the sorted column; the others show both arrows, faint.
- `.ayy-table__select` — On the th/td holding a row's checkbox (and the select-all box in the header): as narrow as the box.
- `.ayy-table__actions` — On the trailing th/td holding a row's inline action buttons and ⋯ overflow menu trigger: end-aligned, as narrow as its controls.
- `.ayy-table__row-actions` — Inline-flex cluster of row action buttons and overflow menu trigger inside an .ayy-table__actions cell.
- `.ayy-table__row-actions--reveal` — Reveals quick actions when the row is hovered, focused within, selected or has an open menu (stays visible on touch screens).

**States**
- `default` — Collapsed table, xs text; header row on a wash fill with muted xs uppercase labels; hairlines between rows.
- `hover` (`tbody tr:hover; .ayy-table__sort:hover`) — Row gets a wash fill and reveals .ayy-table__row-actions--reveal; a sort button's label turns text colour.
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

**Custom element** `<ayy-table>` (@danitesler/ayywi/elements) — 
- event `ayy-sort`: { column, key, direction } before the rows move — key is the <th>'s data-sort-key. Call preventDefault() to sort them yourself (on the server).
- event `ayy-selection-change`: { rows } — the selected <tr> elements.

**React** — `import { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableRowActions, TableCaption } from "@danitesler/ayywi/react";`
- `<Table>` renders <div class="ayy-table-wrap"><table>. Props: `compact` boolean
- `<TableHeader>` renders <thead>.
- `<TableBody>` renders <tbody>.
- `<TableFooter>` renders <tfoot>.
- `<TableRow>` renders <tr>. Props: `selected` boolean — aria-selected
- `<TableHead>` renders <th scope="col">, with a <button class="ayy-table__sort"> inside when sortable. Props: `numeric` boolean; `select` boolean — the checkbox column; `actions` boolean — the trailing row actions column; `sort` "ascending" | "descending" | "none" — makes the header a sort button; "none" for a sortable column that isn't sorted; `onSort` () => void — flip with nextSortDirection() and sort your rows (compareValues helps)
- `<TableCell>` renders <td>. Props: `numeric` boolean; `select` boolean — the checkbox column; `actions` boolean — the trailing row actions column
- `<TableRowActions>` renders <div class="ayy-table__row-actions">. Props: `reveal` boolean — reveal on row hover, focus-within or selection (stays visible on touch)
- `<TableCaption>` renders <caption>.

**Accessibility**
- Use real <th> header cells with scope (React sets scope="col").
- A <caption> or aria-label names the table for screen readers.
- Sorting is a button inside the header, so it's reachable by Tab and announced with the column's aria-sort. Only the sorted column carries aria-sort.
- Every row checkbox needs an aria-label naming its row ("Select INV-1042"); the select-all box is indeterminate when some rows are selected.
- Row action icon buttons and ⋯ menu triggers need an aria-label that names the row ("Edit Northwind", "More actions for Northwind").

**Do**
- Use a table to compare items across the same attributes (projects × status × builds).
- End-align numbers with numeric/ayy-table__num.
- Keep cell content short; truncate with a tooltip if needed.
- Make the columns people scan sortable (names, dates, amounts), and start sorted by the most useful one. Put the real value in data-sort-value when the cell shows a formatted one (a date, a currency).
- Put per-row quick actions (Edit, Copy) and a ⋯ DropdownMenu for secondary actions (Duplicate, Archive, Delete) in a trailing TableCell actions with TableRowActions.
- Pair a selectable table with an ActionBar at the bottom for bulk actions on selected rows.

**Don't**
- Don't use tables for layout.
- Don't use a table for rows with one attribute — use a List.
- Don't zebra-stripe; hairlines + hover are enough.
- Don't nest interactive controls in every cell — one trailing actions column is plenty.

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
import { useState, useEffect, type ReactNode } from "react";
import {
  Badge,
  Label,
  Switch,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@danitesler/ayywi/react";

const deployments = [
  { project: "Marketing site", status: "Live", variant: "success", builds: 128 },
  { project: "Mobile API", status: "Building", variant: "warning", builds: 42 },
  { project: "Docs", status: "Failed", variant: "destructive", builds: 7 },
] as const;

export default function Example({
  setControls,
}: {
  setControls?: (node: ReactNode) => void;
} = {}) {
  const [compact, setCompact] = useState(false);
  const [showCaption, setShowCaption] = useState(true);
  const [showBuilds, setShowBuilds] = useState(true);
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    return () => setControls?.(null);
  }, [setControls]);

  useEffect(() => {
    if (!setControls) return;
    setControls(
      <div className="pv-props-list">
        <div className="pv-props-group">
          <div className="pv-props-item">
            <Label htmlFor="tbl-compact" className="pv-props-label">Compact rows</Label>
            <Switch id="tbl-compact" checked={compact} onCheckedChange={setCompact} />
          </div>
          <div className="pv-props-item">
            <Label htmlFor="tbl-caption" className="pv-props-label">Caption</Label>
            <Switch id="tbl-caption" checked={showCaption} onCheckedChange={setShowCaption} />
          </div>
          <div className="pv-props-item">
            <Label htmlFor="tbl-builds" className="pv-props-label">Numeric column</Label>
            <Switch id="tbl-builds" checked={showBuilds} onCheckedChange={setShowBuilds} />
          </div>
          <div className="pv-props-item">
            <Label htmlFor="tbl-footer" className="pv-props-label">Footer</Label>
            <Switch id="tbl-footer" checked={showFooter} onCheckedChange={setShowFooter} />
          </div>
        </div>
      </div>
    );
  }, [setControls, compact, showCaption, showBuilds, showFooter]);

  return (
    <Table compact={compact}>
      {showCaption ? <TableCaption>Deployments</TableCaption> : null}
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead>Status</TableHead>
          {showBuilds ? <TableHead numeric>Builds</TableHead> : null}
        </TableRow>
      </TableHeader>
      <TableBody>
        {deployments.map((d) => (
          <TableRow key={d.project}>
            <TableCell>{d.project}</TableCell>
            <TableCell>
              <Badge variant={d.variant}>{d.status}</Badge>
            </TableCell>
            {showBuilds ? <TableCell numeric>{d.builds}</TableCell> : null}
          </TableRow>
        ))}
      </TableBody>
      {showFooter ? (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={showBuilds ? 2 : 1}>Total deployments</TableCell>
            {showBuilds ? <TableCell numeric>177</TableCell> : null}
          </TableRow>
        </TableFooter>
      ) : null}
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
} from "@danitesler/ayywi/react";

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

## Table — Row actions, secondary menu and bulk action bar

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-table> manages row selection and syncs with the sibling <ayy-action-bar>; <ayy-menu> wires the per-row ⋯ menus. -->
<div class="ayy-stack" style="inline-size:100%"><ayy-table><div class="ayy-table-wrap"><table class="ayy-table"><caption class="ayy-sr-only">Projects with inline actions, secondary menus and bulk selection</caption><thead><tr><th scope="col" class="ayy-table__select"><input type="checkbox" class="ayy-checkbox" aria-label="Select all projects"/></th><th scope="col">Project</th><th scope="col">Owner</th><th scope="col">Status</th><th scope="col">Updated</th><th scope="col" class="ayy-table__actions"><span class="ayy-sr-only">Actions</span></th></tr></thead><tbody><tr aria-selected="true"><td class="ayy-table__select"><input type="checkbox" class="ayy-checkbox" aria-label="Select Brand Kit 2026" checked=""/></td><td>Brand Kit 2026</td><td class="ayy-muted">Maya Lin</td><td><span class="ayy-badge ayy-badge--success">Active</span></td><td class="ayy-muted">2h ago</td><td class="ayy-table__actions"><div class="ayy-table__row-actions"><button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" aria-label="Edit Brand Kit 2026"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" aria-label="Copy link to Brand Kit 2026"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.5563 13.2183C13.514 14.2606 11.8241 14.2606 10.7817 13.2183C9.73942 12.1759 9.73942 10.486 10.7817 9.44364L13.1409 7.0845C14.1357 6.08961 15.7206 6.04433 16.7692 6.94866M16.4437 3.78175C17.486 2.73942 19.1759 2.73942 20.2183 3.78175C21.2606 4.82408 21.2606 6.51403 20.2183 7.55636L17.8591 9.9155C16.8643 10.9104 15.2794 10.9557 14.2308 10.0513" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10.4999 3C7.21257 3 5.56889 3 4.46256 3.9079C4.25998 4.07414 4.07423 4.25989 3.90798 4.46247C3.00007 5.56879 3.00006 7.21247 3.00002 10.4998L3 12.9999C2.99996 16.7712 2.99995 18.6568 4.17152 19.8284C5.3431 21 7.22873 21 11 21H13.4999C16.7874 21 18.4311 21 19.5375 20.092C19.74 19.9258 19.9257 19.7401 20.092 19.5376C20.9999 18.4312 20.9999 16.7875 20.9999 13.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><ayy-menu><button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" aria-haspopup="menu" aria-label="More actions for Brand Kit 2026"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.00449 12.5V12M18.0045 12.5V12M12.0045 12.5V12M7.00449 12.5C7.00449 11.9477 6.55677 11.5 6.00449 11.5C5.4522 11.5 5.00449 11.9477 5.00449 12.5C5.00449 13.0523 5.4522 13.5 6.00449 13.5C6.55677 13.5 7.00449 13.0523 7.00449 12.5ZM19.0045 12.5C19.0045 11.9477 18.5568 11.5 18.0045 11.5C17.4522 11.5 17.0045 11.9477 17.0045 12.5C17.0045 13.0523 17.4522 13.5 18.0045 13.5C18.5568 13.5 19.0045 13.0523 19.0045 12.5ZM13.0045 12.5C13.0045 11.9477 12.5568 11.5 12.0045 11.5C11.4522 11.5 11.0045 11.9477 11.0045 12.5C11.0045 13.0523 11.4522 13.5 12.0045 13.5C12.5568 13.5 13.0045 13.0523 13.0045 12.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><div id="_R_3ot_" role="menu" class="ayy-menu" popover="auto"><div role="presentation" class="ayy-menu__label">Brand Kit 2026</div><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Edit</button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Duplicate<span class="ayy-menu__shortcut"><span class="ayy-shortcut" data-keys="Mod+D"><span class="ayy-sr-only">Ctrl D</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">D</kbd></span></span></button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.5563 13.2183C13.514 14.2606 11.8241 14.2606 10.7817 13.2183C9.73942 12.1759 9.73942 10.486 10.7817 9.44364L13.1409 7.0845C14.1357 6.08961 15.7206 6.04433 16.7692 6.94866M16.4437 3.78175C17.486 2.73942 19.1759 2.73942 20.2183 3.78175C21.2606 4.82408 21.2606 6.51403 20.2183 7.55636L17.8591 9.9155C16.8643 10.9104 15.2794 10.9557 14.2308 10.0513" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10.4999 3C7.21257 3 5.56889 3 4.46256 3.9079C4.25998 4.07414 4.07423 4.25989 3.90798 4.46247C3.00007 5.56879 3.00006 7.21247 3.00002 10.4998L3 12.9999C2.99996 16.7712 2.99995 18.6568 4.17152 19.8284C5.3431 21 7.22873 21 11 21H13.4999C16.7874 21 18.4311 21 19.5375 20.092C19.74 19.9258 19.9257 19.7401 20.092 19.5376C20.9999 18.4312 20.9999 16.7875 20.9999 13.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Copy link<span class="ayy-menu__shortcut"><span class="ayy-shortcut" data-keys="Mod+C"><span class="ayy-sr-only">Ctrl C</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">C</kbd></span></span></button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 21H16.9999C19.3569 21 20.5354 21 21.2677 20.2678C21.9999 19.5355 21.9999 18.357 21.9999 16C21.9999 13.643 21.9999 12.4645 21.2677 11.7322C20.5354 11 19.3569 11 16.9999 11H7C4.64302 11 3.46453 11 2.7323 11.7322C2.00007 12.4644 2.00005 13.6429 2 15.9999C1.99995 18.357 1.99993 19.5355 2.73217 20.2677C3.4644 21 4.64294 21 7 21Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M4 11C4.00005 9.59977 4.00008 8.89966 4.27263 8.36485C4.5123 7.89455 4.89469 7.51218 5.365 7.27253C5.89981 7 6.59993 7 8.00015 7H16C17.4001 7 18.1002 7 18.635 7.27248C19.1054 7.51217 19.4878 7.89462 19.7275 8.36502C20 8.8998 20 9.59987 20 11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M6 7C6.00004 5.5998 6.00006 4.89969 6.27259 4.3649C6.51227 3.89457 6.89467 3.51218 7.36501 3.27252C7.89981 3 8.59991 3 10.0001 3H14C15.4001 3 16.1002 3 16.635 3.27248C17.1054 3.51217 17.4878 3.89462 17.7275 4.36502C18 4.8998 18 5.59987 18 7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M16 15L15.7 15.4C15.1111 16.1851 14.8167 16.5777 14.3944 16.7889C13.9721 17 13.4814 17 12.5 17H11.5C10.5186 17 10.0279 17 9.60557 16.7889C9.18328 16.5777 8.88885 16.1851 8.3 15.4L8 15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Archive</button><div role="separator" class="ayy-menu__separator"></div><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item ayy-menu__item--destructive"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M9.5 16.5L9.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M14.5 16.5L14.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg>Delete</button></div></div></ayy-menu></td></tr><tr aria-selected="false"><td class="ayy-table__select"><input type="checkbox" class="ayy-checkbox" aria-label="Select Mobile Onboarding Screenshots"/></td><td>Mobile Onboarding Screenshots</td><td class="ayy-muted">Ari Cohen</td><td><span class="ayy-badge ayy-badge--warning">Review</span></td><td class="ayy-muted">5h ago</td><td class="ayy-table__actions"><div class="ayy-table__row-actions"><button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" aria-label="Edit Mobile Onboarding Screenshots"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" aria-label="Copy link to Mobile Onboarding Screenshots"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.5563 13.2183C13.514 14.2606 11.8241 14.2606 10.7817 13.2183C9.73942 12.1759 9.73942 10.486 10.7817 9.44364L13.1409 7.0845C14.1357 6.08961 15.7206 6.04433 16.7692 6.94866M16.4437 3.78175C17.486 2.73942 19.1759 2.73942 20.2183 3.78175C21.2606 4.82408 21.2606 6.51403 20.2183 7.55636L17.8591 9.9155C16.8643 10.9104 15.2794 10.9557 14.2308 10.0513" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10.4999 3C7.21257 3 5.56889 3 4.46256 3.9079C4.25998 4.07414 4.07423 4.25989 3.90798 4.46247C3.00007 5.56879 3.00006 7.21247 3.00002 10.4998L3 12.9999C2.99996 16.7712 2.99995 18.6568 4.17152 19.8284C5.3431 21 7.22873 21 11 21H13.4999C16.7874 21 18.4311 21 19.5375 20.092C19.74 19.9258 19.9257 19.7401 20.092 19.5376C20.9999 18.4312 20.9999 16.7875 20.9999 13.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><ayy-menu><button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" aria-haspopup="menu" aria-label="More actions for Mobile Onboarding Screenshots"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.00449 12.5V12M18.0045 12.5V12M12.0045 12.5V12M7.00449 12.5C7.00449 11.9477 6.55677 11.5 6.00449 11.5C5.4522 11.5 5.00449 11.9477 5.00449 12.5C5.00449 13.0523 5.4522 13.5 6.00449 13.5C6.55677 13.5 7.00449 13.0523 7.00449 12.5ZM19.0045 12.5C19.0045 11.9477 18.5568 11.5 18.0045 11.5C17.4522 11.5 17.0045 11.9477 17.0045 12.5C17.0045 13.0523 17.4522 13.5 18.0045 13.5C18.5568 13.5 19.0045 13.0523 19.0045 12.5ZM13.0045 12.5C13.0045 11.9477 12.5568 11.5 12.0045 11.5C11.4522 11.5 11.0045 11.9477 11.0045 12.5C11.0045 13.0523 11.4522 13.5 12.0045 13.5C12.5568 13.5 13.0045 13.0523 13.0045 12.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><div id="_R_3pd_" role="menu" class="ayy-menu" popover="auto"><div role="presentation" class="ayy-menu__label">Mobile Onboarding Screenshots</div><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Edit</button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Duplicate<span class="ayy-menu__shortcut"><span class="ayy-shortcut" data-keys="Mod+D"><span class="ayy-sr-only">Ctrl D</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">D</kbd></span></span></button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.5563 13.2183C13.514 14.2606 11.8241 14.2606 10.7817 13.2183C9.73942 12.1759 9.73942 10.486 10.7817 9.44364L13.1409 7.0845C14.1357 6.08961 15.7206 6.04433 16.7692 6.94866M16.4437 3.78175C17.486 2.73942 19.1759 2.73942 20.2183 3.78175C21.2606 4.82408 21.2606 6.51403 20.2183 7.55636L17.8591 9.9155C16.8643 10.9104 15.2794 10.9557 14.2308 10.0513" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10.4999 3C7.21257 3 5.56889 3 4.46256 3.9079C4.25998 4.07414 4.07423 4.25989 3.90798 4.46247C3.00007 5.56879 3.00006 7.21247 3.00002 10.4998L3 12.9999C2.99996 16.7712 2.99995 18.6568 4.17152 19.8284C5.3431 21 7.22873 21 11 21H13.4999C16.7874 21 18.4311 21 19.5375 20.092C19.74 19.9258 19.9257 19.7401 20.092 19.5376C20.9999 18.4312 20.9999 16.7875 20.9999 13.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Copy link<span class="ayy-menu__shortcut"><span class="ayy-shortcut" data-keys="Mod+C"><span class="ayy-sr-only">Ctrl C</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">C</kbd></span></span></button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 21H16.9999C19.3569 21 20.5354 21 21.2677 20.2678C21.9999 19.5355 21.9999 18.357 21.9999 16C21.9999 13.643 21.9999 12.4645 21.2677 11.7322C20.5354 11 19.3569 11 16.9999 11H7C4.64302 11 3.46453 11 2.7323 11.7322C2.00007 12.4644 2.00005 13.6429 2 15.9999C1.99995 18.357 1.99993 19.5355 2.73217 20.2677C3.4644 21 4.64294 21 7 21Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M4 11C4.00005 9.59977 4.00008 8.89966 4.27263 8.36485C4.5123 7.89455 4.89469 7.51218 5.365 7.27253C5.89981 7 6.59993 7 8.00015 7H16C17.4001 7 18.1002 7 18.635 7.27248C19.1054 7.51217 19.4878 7.89462 19.7275 8.36502C20 8.8998 20 9.59987 20 11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M6 7C6.00004 5.5998 6.00006 4.89969 6.27259 4.3649C6.51227 3.89457 6.89467 3.51218 7.36501 3.27252C7.89981 3 8.59991 3 10.0001 3H14C15.4001 3 16.1002 3 16.635 3.27248C17.1054 3.51217 17.4878 3.89462 17.7275 4.36502C18 4.8998 18 5.59987 18 7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M16 15L15.7 15.4C15.1111 16.1851 14.8167 16.5777 14.3944 16.7889C13.9721 17 13.4814 17 12.5 17H11.5C10.5186 17 10.0279 17 9.60557 16.7889C9.18328 16.5777 8.88885 16.1851 8.3 15.4L8 15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Archive</button><div role="separator" class="ayy-menu__separator"></div><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item ayy-menu__item--destructive"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M9.5 16.5L9.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M14.5 16.5L14.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg>Delete</button></div></div></ayy-menu></td></tr><tr aria-selected="false"><td class="ayy-table__select"><input type="checkbox" class="ayy-checkbox" aria-label="Select Q4 Social Campaign"/></td><td>Q4 Social Campaign</td><td class="ayy-muted">Noa Levi</td><td><span class="ayy-badge ayy-badge--muted">Draft</span></td><td class="ayy-muted">Yesterday</td><td class="ayy-table__actions"><div class="ayy-table__row-actions"><button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" aria-label="Edit Q4 Social Campaign"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" aria-label="Copy link to Q4 Social Campaign"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.5563 13.2183C13.514 14.2606 11.8241 14.2606 10.7817 13.2183C9.73942 12.1759 9.73942 10.486 10.7817 9.44364L13.1409 7.0845C14.1357 6.08961 15.7206 6.04433 16.7692 6.94866M16.4437 3.78175C17.486 2.73942 19.1759 2.73942 20.2183 3.78175C21.2606 4.82408 21.2606 6.51403 20.2183 7.55636L17.8591 9.9155C16.8643 10.9104 15.2794 10.9557 14.2308 10.0513" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10.4999 3C7.21257 3 5.56889 3 4.46256 3.9079C4.25998 4.07414 4.07423 4.25989 3.90798 4.46247C3.00007 5.56879 3.00006 7.21247 3.00002 10.4998L3 12.9999C2.99996 16.7712 2.99995 18.6568 4.17152 19.8284C5.3431 21 7.22873 21 11 21H13.4999C16.7874 21 18.4311 21 19.5375 20.092C19.74 19.9258 19.9257 19.7401 20.092 19.5376C20.9999 18.4312 20.9999 16.7875 20.9999 13.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><ayy-menu><button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" aria-haspopup="menu" aria-label="More actions for Q4 Social Campaign"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.00449 12.5V12M18.0045 12.5V12M12.0045 12.5V12M7.00449 12.5C7.00449 11.9477 6.55677 11.5 6.00449 11.5C5.4522 11.5 5.00449 11.9477 5.00449 12.5C5.00449 13.0523 5.4522 13.5 6.00449 13.5C6.55677 13.5 7.00449 13.0523 7.00449 12.5ZM19.0045 12.5C19.0045 11.9477 18.5568 11.5 18.0045 11.5C17.4522 11.5 17.0045 11.9477 17.0045 12.5C17.0045 13.0523 17.4522 13.5 18.0045 13.5C18.5568 13.5 19.0045 13.0523 19.0045 12.5ZM13.0045 12.5C13.0045 11.9477 12.5568 11.5 12.0045 11.5C11.4522 11.5 11.0045 11.9477 11.0045 12.5C11.0045 13.0523 11.4522 13.5 12.0045 13.5C12.5568 13.5 13.0045 13.0523 13.0045 12.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><div id="_R_3pt_" role="menu" class="ayy-menu" popover="auto"><div role="presentation" class="ayy-menu__label">Q4 Social Campaign</div><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Edit</button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Duplicate<span class="ayy-menu__shortcut"><span class="ayy-shortcut" data-keys="Mod+D"><span class="ayy-sr-only">Ctrl D</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">D</kbd></span></span></button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.5563 13.2183C13.514 14.2606 11.8241 14.2606 10.7817 13.2183C9.73942 12.1759 9.73942 10.486 10.7817 9.44364L13.1409 7.0845C14.1357 6.08961 15.7206 6.04433 16.7692 6.94866M16.4437 3.78175C17.486 2.73942 19.1759 2.73942 20.2183 3.78175C21.2606 4.82408 21.2606 6.51403 20.2183 7.55636L17.8591 9.9155C16.8643 10.9104 15.2794 10.9557 14.2308 10.0513" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10.4999 3C7.21257 3 5.56889 3 4.46256 3.9079C4.25998 4.07414 4.07423 4.25989 3.90798 4.46247C3.00007 5.56879 3.00006 7.21247 3.00002 10.4998L3 12.9999C2.99996 16.7712 2.99995 18.6568 4.17152 19.8284C5.3431 21 7.22873 21 11 21H13.4999C16.7874 21 18.4311 21 19.5375 20.092C19.74 19.9258 19.9257 19.7401 20.092 19.5376C20.9999 18.4312 20.9999 16.7875 20.9999 13.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Copy link<span class="ayy-menu__shortcut"><span class="ayy-shortcut" data-keys="Mod+C"><span class="ayy-sr-only">Ctrl C</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">C</kbd></span></span></button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 21H16.9999C19.3569 21 20.5354 21 21.2677 20.2678C21.9999 19.5355 21.9999 18.357 21.9999 16C21.9999 13.643 21.9999 12.4645 21.2677 11.7322C20.5354 11 19.3569 11 16.9999 11H7C4.64302 11 3.46453 11 2.7323 11.7322C2.00007 12.4644 2.00005 13.6429 2 15.9999C1.99995 18.357 1.99993 19.5355 2.73217 20.2677C3.4644 21 4.64294 21 7 21Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M4 11C4.00005 9.59977 4.00008 8.89966 4.27263 8.36485C4.5123 7.89455 4.89469 7.51218 5.365 7.27253C5.89981 7 6.59993 7 8.00015 7H16C17.4001 7 18.1002 7 18.635 7.27248C19.1054 7.51217 19.4878 7.89462 19.7275 8.36502C20 8.8998 20 9.59987 20 11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M6 7C6.00004 5.5998 6.00006 4.89969 6.27259 4.3649C6.51227 3.89457 6.89467 3.51218 7.36501 3.27252C7.89981 3 8.59991 3 10.0001 3H14C15.4001 3 16.1002 3 16.635 3.27248C17.1054 3.51217 17.4878 3.89462 17.7275 4.36502C18 4.8998 18 5.59987 18 7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M16 15L15.7 15.4C15.1111 16.1851 14.8167 16.5777 14.3944 16.7889C13.9721 17 13.4814 17 12.5 17H11.5C10.5186 17 10.0279 17 9.60557 16.7889C9.18328 16.5777 8.88885 16.1851 8.3 15.4L8 15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Archive</button><div role="separator" class="ayy-menu__separator"></div><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item ayy-menu__item--destructive"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M9.5 16.5L9.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M14.5 16.5L14.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg>Delete</button></div></div></ayy-menu></td></tr><tr aria-selected="false"><td class="ayy-table__select"><input type="checkbox" class="ayy-checkbox" aria-label="Select Customer Directory Sync"/></td><td>Customer Directory Sync</td><td class="ayy-muted">Danilo Silva</td><td><span class="ayy-badge ayy-badge--success">Active</span></td><td class="ayy-muted">Sep 14</td><td class="ayy-table__actions"><div class="ayy-table__row-actions"><button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" aria-label="Edit Customer Directory Sync"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" aria-label="Copy link to Customer Directory Sync"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.5563 13.2183C13.514 14.2606 11.8241 14.2606 10.7817 13.2183C9.73942 12.1759 9.73942 10.486 10.7817 9.44364L13.1409 7.0845C14.1357 6.08961 15.7206 6.04433 16.7692 6.94866M16.4437 3.78175C17.486 2.73942 19.1759 2.73942 20.2183 3.78175C21.2606 4.82408 21.2606 6.51403 20.2183 7.55636L17.8591 9.9155C16.8643 10.9104 15.2794 10.9557 14.2308 10.0513" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10.4999 3C7.21257 3 5.56889 3 4.46256 3.9079C4.25998 4.07414 4.07423 4.25989 3.90798 4.46247C3.00007 5.56879 3.00006 7.21247 3.00002 10.4998L3 12.9999C2.99996 16.7712 2.99995 18.6568 4.17152 19.8284C5.3431 21 7.22873 21 11 21H13.4999C16.7874 21 18.4311 21 19.5375 20.092C19.74 19.9258 19.9257 19.7401 20.092 19.5376C20.9999 18.4312 20.9999 16.7875 20.9999 13.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><ayy-menu><button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" aria-haspopup="menu" aria-label="More actions for Customer Directory Sync"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.00449 12.5V12M18.0045 12.5V12M12.0045 12.5V12M7.00449 12.5C7.00449 11.9477 6.55677 11.5 6.00449 11.5C5.4522 11.5 5.00449 11.9477 5.00449 12.5C5.00449 13.0523 5.4522 13.5 6.00449 13.5C6.55677 13.5 7.00449 13.0523 7.00449 12.5ZM19.0045 12.5C19.0045 11.9477 18.5568 11.5 18.0045 11.5C17.4522 11.5 17.0045 11.9477 17.0045 12.5C17.0045 13.0523 17.4522 13.5 18.0045 13.5C18.5568 13.5 19.0045 13.0523 19.0045 12.5ZM13.0045 12.5C13.0045 11.9477 12.5568 11.5 12.0045 11.5C11.4522 11.5 11.0045 11.9477 11.0045 12.5C11.0045 13.0523 11.4522 13.5 12.0045 13.5C12.5568 13.5 13.0045 13.0523 13.0045 12.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><div id="_R_3qd_" role="menu" class="ayy-menu" popover="auto"><div role="presentation" class="ayy-menu__label">Customer Directory Sync</div><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Edit</button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Duplicate<span class="ayy-menu__shortcut"><span class="ayy-shortcut" data-keys="Mod+D"><span class="ayy-sr-only">Ctrl D</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">D</kbd></span></span></button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.5563 13.2183C13.514 14.2606 11.8241 14.2606 10.7817 13.2183C9.73942 12.1759 9.73942 10.486 10.7817 9.44364L13.1409 7.0845C14.1357 6.08961 15.7206 6.04433 16.7692 6.94866M16.4437 3.78175C17.486 2.73942 19.1759 2.73942 20.2183 3.78175C21.2606 4.82408 21.2606 6.51403 20.2183 7.55636L17.8591 9.9155C16.8643 10.9104 15.2794 10.9557 14.2308 10.0513" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10.4999 3C7.21257 3 5.56889 3 4.46256 3.9079C4.25998 4.07414 4.07423 4.25989 3.90798 4.46247C3.00007 5.56879 3.00006 7.21247 3.00002 10.4998L3 12.9999C2.99996 16.7712 2.99995 18.6568 4.17152 19.8284C5.3431 21 7.22873 21 11 21H13.4999C16.7874 21 18.4311 21 19.5375 20.092C19.74 19.9258 19.9257 19.7401 20.092 19.5376C20.9999 18.4312 20.9999 16.7875 20.9999 13.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Copy link<span class="ayy-menu__shortcut"><span class="ayy-shortcut" data-keys="Mod+C"><span class="ayy-sr-only">Ctrl C</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">C</kbd></span></span></button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 21H16.9999C19.3569 21 20.5354 21 21.2677 20.2678C21.9999 19.5355 21.9999 18.357 21.9999 16C21.9999 13.643 21.9999 12.4645 21.2677 11.7322C20.5354 11 19.3569 11 16.9999 11H7C4.64302 11 3.46453 11 2.7323 11.7322C2.00007 12.4644 2.00005 13.6429 2 15.9999C1.99995 18.357 1.99993 19.5355 2.73217 20.2677C3.4644 21 4.64294 21 7 21Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M4 11C4.00005 9.59977 4.00008 8.89966 4.27263 8.36485C4.5123 7.89455 4.89469 7.51218 5.365 7.27253C5.89981 7 6.59993 7 8.00015 7H16C17.4001 7 18.1002 7 18.635 7.27248C19.1054 7.51217 19.4878 7.89462 19.7275 8.36502C20 8.8998 20 9.59987 20 11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M6 7C6.00004 5.5998 6.00006 4.89969 6.27259 4.3649C6.51227 3.89457 6.89467 3.51218 7.36501 3.27252C7.89981 3 8.59991 3 10.0001 3H14C15.4001 3 16.1002 3 16.635 3.27248C17.1054 3.51217 17.4878 3.89462 17.7275 4.36502C18 4.8998 18 5.59987 18 7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M16 15L15.7 15.4C15.1111 16.1851 14.8167 16.5777 14.3944 16.7889C13.9721 17 13.4814 17 12.5 17H11.5C10.5186 17 10.0279 17 9.60557 16.7889C9.18328 16.5777 8.88885 16.1851 8.3 15.4L8 15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Archive</button><div role="separator" class="ayy-menu__separator"></div><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item ayy-menu__item--destructive"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M9.5 16.5L9.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M14.5 16.5L14.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg>Delete</button></div></div></ayy-menu></td></tr></tbody></table></div></ayy-table><ayy-action-bar><div role="toolbar" aria-label="Bulk actions" open="" class="ayy-action-bar"><div class="ayy-action-bar__selection"><span class="ayy-action-bar__count">1 selected</span><button type="button" aria-label="Clear selection" class="ayy-action-bar__close"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button></div><div role="separator" class="ayy-action-bar__separator"></div><div role="group" class="ayy-action-bar__actions"><button type="button" class="ayy-action-bar__button"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Edit</button><button type="button" class="ayy-action-bar__button"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Duplicate</button><button type="button" class="ayy-action-bar__button"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.5563 13.2183C13.514 14.2606 11.8241 14.2606 10.7817 13.2183C9.73942 12.1759 9.73942 10.486 10.7817 9.44364L13.1409 7.0845C14.1357 6.08961 15.7206 6.04433 16.7692 6.94866M16.4437 3.78175C17.486 2.73942 19.1759 2.73942 20.2183 3.78175C21.2606 4.82408 21.2606 6.51403 20.2183 7.55636L17.8591 9.9155C16.8643 10.9104 15.2794 10.9557 14.2308 10.0513" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10.4999 3C7.21257 3 5.56889 3 4.46256 3.9079C4.25998 4.07414 4.07423 4.25989 3.90798 4.46247C3.00007 5.56879 3.00006 7.21247 3.00002 10.4998L3 12.9999C2.99996 16.7712 2.99995 18.6568 4.17152 19.8284C5.3431 21 7.22873 21 11 21H13.4999C16.7874 21 18.4311 21 19.5375 20.092C19.74 19.9258 19.9257 19.7401 20.092 19.5376C20.9999 18.4312 20.9999 16.7875 20.9999 13.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Copy</button><button type="button" class="ayy-action-bar__button"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 21H16.9999C19.3569 21 20.5354 21 21.2677 20.2678C21.9999 19.5355 21.9999 18.357 21.9999 16C21.9999 13.643 21.9999 12.4645 21.2677 11.7322C20.5354 11 19.3569 11 16.9999 11H7C4.64302 11 3.46453 11 2.7323 11.7322C2.00007 12.4644 2.00005 13.6429 2 15.9999C1.99995 18.357 1.99993 19.5355 2.73217 20.2677C3.4644 21 4.64294 21 7 21Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M4 11C4.00005 9.59977 4.00008 8.89966 4.27263 8.36485C4.5123 7.89455 4.89469 7.51218 5.365 7.27253C5.89981 7 6.59993 7 8.00015 7H16C17.4001 7 18.1002 7 18.635 7.27248C19.1054 7.51217 19.4878 7.89462 19.7275 8.36502C20 8.8998 20 9.59987 20 11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M6 7C6.00004 5.5998 6.00006 4.89969 6.27259 4.3649C6.51227 3.89457 6.89467 3.51218 7.36501 3.27252C7.89981 3 8.59991 3 10.0001 3H14C15.4001 3 16.1002 3 16.635 3.27248C17.1054 3.51217 17.4878 3.89462 17.7275 4.36502C18 4.8998 18 5.59987 18 7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M16 15L15.7 15.4C15.1111 16.1851 14.8167 16.5777 14.3944 16.7889C13.9721 17 13.4814 17 12.5 17H11.5C10.5186 17 10.0279 17 9.60557 16.7889C9.18328 16.5777 8.88885 16.1851 8.3 15.4L8 15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Archive</button><div role="separator" class="ayy-action-bar__separator"></div><button type="button" class="ayy-action-bar__button ayy-action-bar__button--destructive"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M9.5 16.5L9.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M14.5 16.5L14.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg>Delete</button></div></div></ayy-action-bar></div>
```

React:

```tsx
import { useState } from "react";
import {
  Archive02Icon,
  Copy01Icon,
  CopyLinkIcon,
  Delete02Icon,
  MoreHorizontalIcon,
  PencilEdit02Icon,
} from "@hugeicons/core-free-icons";
import {
  ActionBar,
  ActionBarActions,
  ActionBarButton,
  ActionBarClose,
  ActionBarCount,
  ActionBarSelection,
  ActionBarSeparator,
  Badge,
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Icon,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableRowActions,
  toast,
} from "@danitesler/ayywi/react";

const records = [
  { id: "PRJ-101", name: "Brand Kit 2026", owner: "Maya Lin", status: "Active", variant: "success", updated: "2h ago" },
  { id: "PRJ-102", name: "Mobile Onboarding Screenshots", owner: "Ari Cohen", status: "Review", variant: "warning", updated: "5h ago" },
  { id: "PRJ-103", name: "Q4 Social Campaign", owner: "Noa Levi", status: "Draft", variant: "muted", updated: "Yesterday" },
  { id: "PRJ-104", name: "Customer Directory Sync", owner: "Danilo Silva", status: "Active", variant: "success", updated: "Sep 14" },
] as const;

export default function Example() {
  const [selected, setSelected] = useState<string[]>(["PRJ-101"]);
  const all = selected.length === records.length;
  const toggle = (id: string, on: boolean) =>
    setSelected((list) => (on ? [...list, id] : list.filter((x) => x !== id)));

  return (
    <div className="ayy-stack" style={{ inlineSize: "100%" }}>
      <Table>
        <TableCaption className="ayy-sr-only">Projects with inline actions, secondary menus and bulk selection</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead select>
              <Checkbox
                aria-label="Select all projects"
                checked={all}
                indeterminate={selected.length > 0 && !all}
                onCheckedChange={(on) => setSelected(on ? records.map((r) => r.id) : [])}
              />
            </TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead actions>
              <span className="ayy-sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((item) => (
            <TableRow key={item.id} selected={selected.includes(item.id)}>
              <TableCell select>
                <Checkbox
                  aria-label={`Select ${item.name}`}
                  checked={selected.includes(item.id)}
                  onCheckedChange={(on) => toggle(item.id, on)}
                />
              </TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell className="ayy-muted">{item.owner}</TableCell>
              <TableCell>
                <Badge variant={item.variant}>{item.status}</Badge>
              </TableCell>
              <TableCell className="ayy-muted">{item.updated}</TableCell>
              <TableCell actions>
                <TableRowActions>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Edit ${item.name}`}
                    onClick={() => toast(`Edit ${item.name}`)}
                  >
                    <Icon icon={PencilEdit02Icon} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Copy link to ${item.name}`}
                    onClick={() => toast.success(`Copied link to ${item.name}`)}
                  >
                    <Icon icon={CopyLinkIcon} />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`More actions for ${item.name}`}
                    >
                      <Icon icon={MoreHorizontalIcon} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{item.name}</DropdownMenuLabel>
                      <DropdownMenuItem onSelect={() => toast(`Edit ${item.name}`)}>
                        <Icon icon={PencilEdit02Icon} />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => toast.success(`Duplicated ${item.name}`)} shortcut="Mod+D">
                        <Icon icon={Copy01Icon} />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => toast.success(`Copied ${item.name}`)} shortcut="Mod+C">
                        <Icon icon={CopyLinkIcon} />
                        Copy link
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => toast(`Archived ${item.name}`)}>
                        <Icon icon={Archive02Icon} />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem destructive onSelect={() => toast.error(`Deleted ${item.name}`)}>
                        <Icon icon={Delete02Icon} />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableRowActions>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ActionBar open={selected.length > 0} onClear={() => setSelected([])}>
        <ActionBarSelection>
          <ActionBarCount>{selected.length} selected</ActionBarCount>
          <ActionBarClose />
        </ActionBarSelection>
        <ActionBarSeparator />
        <ActionBarActions>
          <ActionBarButton onClick={() => toast(`Editing ${selected.length} selected`)}>
            <Icon icon={PencilEdit02Icon} />
            Edit
          </ActionBarButton>
          <ActionBarButton onClick={() => toast.success(`Duplicated ${selected.length} selected`)}>
            <Icon icon={Copy01Icon} />
            Duplicate
          </ActionBarButton>
          <ActionBarButton onClick={() => toast.success(`Copied ${selected.length} links`)}>
            <Icon icon={CopyLinkIcon} />
            Copy
          </ActionBarButton>
          <ActionBarButton onClick={() => toast(`Archived ${selected.length} selected`)}>
            <Icon icon={Archive02Icon} />
            Archive
          </ActionBarButton>
          <ActionBarSeparator />
          <ActionBarButton
            destructive
            onClick={() => {
              toast.error(`Deleted ${selected.length} selected`);
              setSelected([]);
            }}
          >
            <Icon icon={Delete02Icon} />
            Delete
          </ActionBarButton>
        </ActionBarActions>
      </ActionBar>
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.0.3: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
