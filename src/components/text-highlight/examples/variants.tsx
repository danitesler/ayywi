import { TextHighlight } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack">
      <p>Default (neutral): <TextHighlight>Subtle gray wash with underline</TextHighlight></p>
      <p>Yellow (warning): <TextHighlight variant="warning">Attention required</TextHighlight></p>
      <p>Red (destructive): <TextHighlight variant="destructive">Critical action</TextHighlight></p>
      <p>Green (success): <TextHighlight variant="success">Completed</TextHighlight></p>
      <p>Blue (info): <TextHighlight variant="info">Note</TextHighlight></p>
      <p>Orange: <TextHighlight variant="orange">Spotlight</TextHighlight></p>
    </div>
  );
}
