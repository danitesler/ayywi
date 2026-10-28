import { Badge, Card, CardDescription, CardHeader, CardTitle } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <>
      <Card interactive spotlight spotColor="var(--ayy-accent-product)" style={{ inlineSize: "15rem" }}>
        <CardHeader>
          <Badge variant="info">Product</Badge>
          <CardTitle>Roadmap</CardTitle>
          <CardDescription>Move your pointer over me.</CardDescription>
        </CardHeader>
      </Card>
      <Card interactive spotlight transparent spotColor="var(--ayy-accent-ai)" style={{ inlineSize: "15rem" }}>
        <CardHeader>
          <Badge variant="ai">AI</Badge>
          <CardTitle>Assistant</CardTitle>
          <CardDescription>No fill: just the glow and border.</CardDescription>
        </CardHeader>
      </Card>
    </>
  );
}
