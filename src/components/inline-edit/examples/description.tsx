import { InlineEdit } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 28rem)" }}>
      <InlineEdit
        label="Edit the description"
        multiline
        defaultValue="The workspace shows its members, their roles and what each one worked on this week."
      />
      <p className="ayy-small ayy-muted">Click the description. Enter starts a line; ⌘Enter or Ctrl+Enter saves.</p>
    </div>
  );
}
