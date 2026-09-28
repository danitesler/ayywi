import { Badge, Card, CardDescription, CardHeader, CardTitle } from "ayywi/react";

export default function Example() {
  return (
    <>
      <Card interactive spotlight spotColor="var(--ayy-accent-product)" style={{ width: 240 }}>
        <CardHeader>
          <Badge variant="info">Product</Badge>
          <CardTitle>Roadmap</CardTitle>
          <CardDescription>Move your pointer over me.</CardDescription>
        </CardHeader>
      </Card>
      <Card interactive spotlight spotColor="var(--ayy-accent-ai)" style={{ width: 240 }}>
        <CardHeader>
          <Badge variant="ai">AI</Badge>
          <CardTitle>Assistant</CardTitle>
          <CardDescription>Colour comes from the content.</CardDescription>
        </CardHeader>
      </Card>
    </>
  );
}
