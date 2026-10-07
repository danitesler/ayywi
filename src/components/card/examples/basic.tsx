import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Card style={{ maxInlineSize: "22.5rem" }}>
      <CardHeader>
        <CardTitle>Weekly report</CardTitle>
        <CardDescription>A summary of activity across your workspace.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="ayy-muted">12 projects · updated 2 minutes ago</p>
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
