import { Input } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 20rem)", gap: "var(--ayy-space-3)" }}>
      <Input size="sm" placeholder="Small input" aria-label="Small input" />
      <Input placeholder="Medium input" aria-label="Medium input" />
      <Input size="lg" placeholder="Large input" aria-label="Large input" />
    </div>
  );
}
