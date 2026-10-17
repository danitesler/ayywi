import { Input } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 20rem)", gap: "var(--ayy-space-3)" }}>
      <Input placeholder="Text input" aria-label="Text input" />
      <Input type="password" placeholder="Password input" defaultValue="secret-passphrase" aria-label="Password input" />
      <Input type="email" placeholder="Email input (you@example.com)" aria-label="Email input" />
      <Input type="tel" placeholder="Phone input (+1 555 000-0000)" aria-label="Phone input" />
      <Input type="url" placeholder="URL input (https://example.com)" aria-label="URL input" />
      <Input type="search" placeholder="Search input…" aria-label="Search input" />
      <Input type="file" aria-label="File upload" />
      <Input disabled placeholder="Disabled input" aria-label="Disabled input" />
    </div>
  );
}
