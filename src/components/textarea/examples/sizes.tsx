import { Textarea } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 26.25rem)" }}>
      <Textarea size="sm" placeholder="Small: a quick reply" aria-label="Small textarea" />
      <Textarea placeholder="Medium: a short description" aria-label="Medium textarea" />
      <Textarea size="lg" placeholder="Large: a long-form answer" aria-label="Large textarea" />
    </div>
  );
}
