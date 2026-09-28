import { Progress } from "ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ width: "100%", maxWidth: 360 }}>
      <Progress value={30} aria-label="Build progress" />
      <Progress value={72} tone="success" aria-label="Upload progress" />
      <Progress value={90} tone="warning" size="lg" aria-label="Storage used" />
      <Progress tone="ai" size="sm" aria-label="Generating" />
    </div>
  );
}
