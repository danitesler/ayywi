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
