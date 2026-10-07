import { Textarea } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 26.25rem)" }}>
      <Textarea placeholder="Write a short description…" aria-label="Description" />
      <Textarea autosize rows={2} placeholder="I grow as you type" aria-label="Notes" />
      <Textarea mono rows={3} defaultValue={'{\n  "theme": "dark"\n}'} aria-label="Config" />
    </div>
  );
}
