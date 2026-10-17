import { TextHighlight } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack">
      <p>
        <TextHighlight text="The Input component lets users enter and edit text." query="input" />
      </p>
      <p className="ayy-muted">
        Callout: <TextHighlight>Subtle gray highlight with underline</TextHighlight> for inline emphasis.
      </p>
    </div>
  );
}
