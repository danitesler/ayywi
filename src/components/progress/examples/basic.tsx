import { Progress } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 22.5rem)" }}>
      <Progress value={30} aria-label="Build progress" />
      <Progress value={72} variant="success" aria-label="Upload progress" />
      <Progress value={90} variant="warning" size="lg" aria-label="Storage used" />
      <Progress variant="ai" size="sm" aria-label="Generating" />
    </div>
  );
}
