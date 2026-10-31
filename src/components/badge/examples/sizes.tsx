import { Badge } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <>
      <Badge size="sm" variant="success">Synced</Badge>
      <Badge variant="success">Synced</Badge>
      <Badge size="lg" variant="success">Synced</Badge>
      <Badge size="sm" variant="warning" dot>Pending</Badge>
      <Badge variant="warning" dot>Pending</Badge>
      <Badge size="lg" variant="warning" dot>Pending</Badge>
    </>
  );
}
