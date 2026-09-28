import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "ayywi/react";

export default function Example() {
  return (
    <Card style={{ maxWidth: 360 }}>
      <CardHeader>
        <CardTitle>Weekly report</CardTitle>
        <CardDescription>A summary of activity across your workspace.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="ayy-muted" style={{ margin: 0 }}>
          12 projects · updated 2 minutes ago
        </p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Open report</Button>
        <Button size="sm" variant="ghost">
          Share
        </Button>
      </CardFooter>
    </Card>
  );
}
