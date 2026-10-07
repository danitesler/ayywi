import { Button, TopBar } from "@danitesler/ayywi/react";

export default function Example() {
  // Centred title, as on iOS: back on one side, the screen's action on the other.
  return (
    <div style={{ inlineSize: "min(100%, 24rem)", border: "1px solid var(--ayy-color-line)", borderRadius: "var(--ayy-radius-xl)", overflow: "hidden" }}>
      <TopBar
        center
        title="Edit task"
        backHref="#task"
        actions={
          <Button variant="ghost" size="sm">
            Save
          </Button>
        }
      />
      <p className="ayy-muted" style={{ padding: "var(--ayy-space-4)", margin: 0 }}>
        The form goes here.
      </p>
    </div>
  );
}
