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
