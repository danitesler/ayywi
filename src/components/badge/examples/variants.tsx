import { Badge } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <>
      <Badge>Default</Badge>
      <Badge variant="muted">Muted</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success">Synced</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="destructive">Failed</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="ai">AI</Badge>
    </>
  );
}
