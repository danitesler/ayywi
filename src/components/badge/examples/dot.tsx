import type { CSSProperties } from "react";
import { Badge } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <>
      <Badge dot>Live</Badge>
      <Badge variant="warning" dot>
        Syncing
      </Badge>
      <Badge variant="destructive" dot="static">
        Offline
      </Badge>
      <Badge variant="muted" dot="static" style={{ "--ayy-dot": "var(--ayy-accent-brand)" } as CSSProperties}>
        Custom dot
      </Badge>
    </>
  );
}
