import { useState } from "react";
import {
  Badge, Checkbox, Table, TableBody, TableCell, TableContainer, TableDescription,
  TableHead, TableHeader, TableHeading, TableRow, TableTitle, TableToolbar,
  compareValues, nextSortDirection, type SortDirection,
} from "@danitesler/ayywi/react";

const accounts = [
  { name: "Northwind Traders", plan: "Enterprise", status: "Active", seats: 240 },
  { name: "Lumen Labs", plan: "Team", status: "Past due", seats: 32 },
  { name: "Acme Studio", plan: "Team", status: "Trial", seats: 12 },
  { name: "Brightside Health", plan: "Enterprise", status: "Active", seats: 610 },
  { name: "Kestrel Logistics", plan: "Starter", status: "Closed", seats: 4 },
  { name: "Orchard & Pine", plan: "Team", status: "Active", seats: 48 },
] as const;
const statusBadge = { Active: "success", Trial: "info", "Past due": "destructive", Closed: "muted" } as const;

export default function Example() {
  const [sort, setSort] = useState<{ key: "name" | "seats"; direction: SortDirection } | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const rows = sort ? [...accounts].sort((a, b) => compareValues(a[sort.key], b[sort.key], sort.direction)) : accounts;
  const sortBy = (key: "name" | "seats") => {
    setSort((current) => ({ key, direction: nextSortDirection(current?.key === key ? current.direction : null) }));
  };

  return (
    <TableContainer style={{ inlineSize: "100%" }}>
      <TableToolbar>
        <TableHeading>
          <TableTitle id="tm-title">Accounts</TableTitle>
          <TableDescription>Sort by account or seats, and select rows.</TableDescription>
        </TableHeading>
      </TableToolbar>
      <Table aria-labelledby="tm-title">
        <TableHeader>
          <TableRow>
            <TableHead select>
              <Checkbox
                aria-label="Select all accounts"
                checked={selected.length === accounts.length}
                indeterminate={selected.length > 0 && selected.length < accounts.length}
                onCheckedChange={(checked) => setSelected(checked ? accounts.map((account) => account.name) : [])}
              />
            </TableHead>
            <TableHead sort={sort?.key === "name" ? sort.direction : "none"} onSort={() => sortBy("name")}>Account</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead numeric sort={sort?.key === "seats" ? sort.direction : "none"} onSort={() => sortBy("seats")}>Seats</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((account) => (
            <TableRow key={account.name} selected={selected.includes(account.name)}>
              <TableCell select>
                <Checkbox
                  aria-label={`Select ${account.name}`}
                  checked={selected.includes(account.name)}
                  onCheckedChange={(checked) => setSelected((current) => checked ? [...current, account.name] : current.filter((name) => name !== account.name))}
                />
              </TableCell>
              <TableCell>{account.name}</TableCell>
              <TableCell>{account.plan}</TableCell>
              <TableCell><Badge variant={statusBadge[account.status]}>{account.status}</Badge></TableCell>
              <TableCell numeric>{account.seats}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
