import { InlineEdit } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 24rem)" }}>
      <InlineEdit label="Rename the project" defaultValue="Q4 launch" variant="title" />
      <p className="ayy-small ayy-muted">Click the title, then Enter to save or Esc to cancel.</p>
    </div>
  );
}
