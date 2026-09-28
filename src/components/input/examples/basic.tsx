import { Input } from "ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ width: "100%", maxWidth: 320 }}>
      <Input size="sm" placeholder="Small" aria-label="Small input" />
      <Input placeholder="you@example.com" type="email" aria-label="Email" />
      <Input size="lg" type="search" placeholder="Search projects…" aria-label="Search projects" />
      <Input disabled placeholder="Disabled" aria-label="Disabled input" />
    </div>
  );
}
