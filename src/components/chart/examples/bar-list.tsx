import { BarList, Card, CardContent, CardHeader, CardTitle } from "ayywi/react";

export default function Example() {
  return (
    <Card style={{ inlineSize: "100%", maxInlineSize: "26rem" }}>
      <CardHeader>
        <div className="ayy-spread">
          <CardTitle>Top pages</CardTitle>
          <span className="ayy-muted">Views</span>
        </div>
      </CardHeader>
      <CardContent>
        <BarList
          items={[
            { label: "/pricing", value: 8210, href: "#pricing" },
            { label: "/", value: 6930, href: "#home" },
            { label: "/blog/launch-week", value: 4120, href: "#launch-week" },
            { label: "/docs/getting-started", value: 2980, href: "#getting-started" },
            { label: "/changelog", value: 1210, href: "#changelog" },
          ]}
        />
      </CardContent>
    </Card>
  );
}
