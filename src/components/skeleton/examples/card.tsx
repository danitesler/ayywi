import type { CSSProperties } from "react";
import { Card, CardContent, CardHeader, Skeleton } from "ayywi/react";

export default function Example() {
  return (
    <Card style={{ inlineSize: "20rem" }} role="status" aria-busy="true" aria-label="Loading project">
      <CardHeader>
        <div className="ayy-cluster" style={{ "--ayy-gap": "var(--ayy-space-3)", flexWrap: "nowrap" } as CSSProperties}>
          <Skeleton shape="circle" />
          <div className="ayy-stack" style={{ flex: 1, "--ayy-gap": "var(--ayy-space-2)" } as CSSProperties}>
            <Skeleton shape="text" style={{ inlineSize: "60%" }} />
            <Skeleton shape="text" style={{ inlineSize: "40%" }} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton style={{ blockSize: "6rem" }} />
      </CardContent>
    </Card>
  );
}
