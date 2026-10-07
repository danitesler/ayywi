import type { CSSProperties } from "react";
import { Button, Spinner } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ "--ayy-gap": "var(--ayy-space-5)" } as CSSProperties}>
      <div className="ayy-cluster" style={{ "--ayy-gap": "var(--ayy-space-5)" } as CSSProperties}>
        <Spinner size="sm" label="Loading comments" />
        <Spinner label="Loading invoices" />
        <Spinner size="lg" label="Loading report" />
      </div>
      <div className="ayy-cluster">
        <Button loading>Saving…</Button>
        <Button variant="outline" loading>
          Refreshing
        </Button>
      </div>
    </div>
  );
}
