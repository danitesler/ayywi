import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 22.5rem)" }}>
      <Card size="sm">
        <CardHeader>
          <CardTitle>Weekly report</CardTitle>
          <CardDescription>Activity across your workspace.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="ayy-muted">12 projects · updated 2 minutes ago</p>
        </CardContent>
        <CardFooter>
          <Button size="sm">Open report</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Weekly report</CardTitle>
          <CardDescription>Activity across your workspace.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="ayy-muted">12 projects · updated 2 minutes ago</p>
        </CardContent>
        <CardFooter>
          <Button size="sm">Open report</Button>
        </CardFooter>
      </Card>
      <Card size="lg">
        <CardHeader>
          <CardTitle>Weekly report</CardTitle>
          <CardDescription>Activity across your workspace.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="ayy-muted">12 projects · updated 2 minutes ago</p>
        </CardContent>
        <CardFooter>
          <Button size="sm">Open report</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
