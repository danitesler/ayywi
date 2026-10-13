import { Card, CardContent, CardDescription, CardHeader, CardTitle, Progress } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Card style={{ inlineSize: "min(100%, 26rem)" }}>
      <CardHeader>
        <CardTitle>Plan usage</CardTitle>
        <CardDescription>Resets in 12 days on November 1.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="ayy-stack" style={{ gap: "1rem" }}>
          <div className="ayy-stack" style={{ gap: "0.375rem" }}>
            <div className="ayy-spread">
              <span id="meter-storage">Cloud storage</span>
              <span className="ayy-muted ayy-mono">18.4 / 20 GB</span>
            </div>
            <Progress
              role="meter"
              value={92}
              variant="warning"
              aria-labelledby="meter-storage"
              aria-valuemin={0}
              aria-valuemax={20}
              aria-valuenow={18.4}
            />
            <p className="ayy-muted" style={{ fontSize: "var(--ayy-text-xs)" }}>
              92% used · Upgrade recommended
            </p>
          </div>

          <div className="ayy-stack" style={{ gap: "0.375rem" }}>
            <div className="ayy-spread">
              <span id="meter-api">Monthly API calls</span>
              <span className="ayy-muted ayy-mono">99,200 / 100k</span>
            </div>
            <Progress
              role="meter"
              value={99}
              variant="destructive"
              aria-labelledby="meter-api"
              aria-valuemin={0}
              aria-valuemax={100000}
              aria-valuenow={99200}
            />
            <p className="ayy-muted" style={{ fontSize: "var(--ayy-text-xs)" }}>
              99% used · Requests will throttle soon
            </p>
          </div>

          <div className="ayy-stack" style={{ gap: "0.375rem" }}>
            <div className="ayy-spread">
              <span id="meter-seats">Team seats</span>
              <span className="ayy-muted ayy-mono">12 / 50</span>
            </div>
            <Progress
              role="meter"
              value={24}
              aria-labelledby="meter-seats"
              aria-valuemin={0}
              aria-valuemax={50}
              aria-valuenow={12}
            />
            <p className="ayy-muted" style={{ fontSize: "var(--ayy-text-xs)" }}>
              38 seats available
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
