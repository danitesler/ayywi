import { Checkbox } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack">
      <label className="ayy-label">
        <Checkbox defaultChecked style={{ "--ayy-check-color": "var(--ayy-color-destructive)" } as React.CSSProperties} />
        High priority: send the invoice
      </label>
      <label className="ayy-label">
        <Checkbox style={{ "--ayy-check-color": "var(--ayy-color-warning)" } as React.CSSProperties} />
        Medium priority: book the venue
      </label>
      <label className="ayy-label">
        <Checkbox defaultChecked style={{ "--ayy-check-color": "var(--ayy-color-info)" } as React.CSSProperties} />
        Low priority: tidy the shared drive
      </label>
    </div>
  );
}
