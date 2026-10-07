import { Button } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <>
      <Button size="sm">Small</Button>
      <Button>Medium</Button>
      <Button size="lg">Large</Button>
      <Button variant="outline" size="sm">Small</Button>
      <Button variant="outline">Medium</Button>
      <Button variant="outline" size="lg">Large</Button>
    </>
  );
}
