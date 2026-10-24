import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@danitesler/ayywi/react";

const accounts = [
  { name: "Northwind Traders", plan: "Enterprise", status: "Active", seats: 240 },
  { name: "Lumen Labs", plan: "Team", status: "Past due", seats: 32 },
  { name: "Acme Studio", plan: "Team", status: "Trial", seats: 12 },
  { name: "Brightside Health", plan: "Enterprise", status: "Active", seats: 610 },
];

export default function Example() {
  return (
    <Table>
      <TableCaption className="ayy-sr-only">Accounts</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Account</TableHead>
          <TableHead>Plan</TableHead>
          <TableHead>Status</TableHead>
          <TableHead numeric>Seats</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {accounts.map((account) => (
          <TableRow key={account.name}>
            <TableCell>{account.name}</TableCell>
            <TableCell>{account.plan}</TableCell>
            <TableCell>{account.status}</TableCell>
            <TableCell numeric>{account.seats}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
