import type { CSSProperties } from "react";
import { Card, CardContent, CardHeader, Skeleton } from "ayywi/react";

export default function Example() {
  return (
    <Card style={{ width: 320 }} role="status" aria-busy="true" aria-label="Loading project">
      <CardHeader style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Skeleton shape="circle" />
        <div className="ayy-stack" style={{ flex: 1, "--ayy-gap": "0.5rem" } as CSSProperties}>
          <Skeleton shape="text" style={{ width: "60%" }} />
          <Skeleton shape="text" style={{ width: "40%" }} />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton style={{ height: 96 }} />
      </CardContent>
    </Card>
  );
}
