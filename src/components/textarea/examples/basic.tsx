import { Textarea } from "ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ width: "100%", maxWidth: 420 }}>
      <Textarea placeholder="Write a short description…" aria-label="Description" />
      <Textarea autosize rows={2} placeholder="I grow as you type" aria-label="Notes" />
      <Textarea mono rows={3} defaultValue={'{\n  "theme": "dark"\n}'} aria-label="Config" />
    </div>
  );
}
