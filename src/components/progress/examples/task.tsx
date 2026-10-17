import { Badge, Card, CardContent, CardHeader, CardTitle, Progress } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Card style={{ inlineSize: "min(100%, 26rem)" }}>
      <CardHeader>
        <div className="ayy-spread">
          <CardTitle>Exporting data</CardTitle>
          <Badge variant="muted">Running</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="ayy-stack" style={{ "--ayy-gap": "var(--ayy-space-4)" } as any}>
          <div className="ayy-stack" style={{ "--ayy-gap": "var(--ayy-space-1-5)" } as any}>
            <div className="ayy-spread">
              <span id="task-export-label">Customer records</span>
              <span className="ayy-muted ayy-mono">68%</span>
            </div>
            <Progress value={68} aria-labelledby="task-export-label" />
            <div className="ayy-spread ayy-muted" style={{ fontSize: "var(--ayy-text-xs)" }}>
              <span>Step 3 of 4 · 6,800 of 10,000 rows</span>
              <span>~25s left</span>
            </div>
          </div>

          <div className="ayy-stack" style={{ "--ayy-gap": "var(--ayy-space-1-5)" } as any}>
            <div className="ayy-spread">
              <span id="task-backup-label">Database backup</span>
              <span className="ayy-muted ayy-mono">100%</span>
            </div>
            <Progress value={100} variant="success" aria-labelledby="task-backup-label" />
            <p className="ayy-muted" style={{ fontSize: "var(--ayy-text-xs)" }}>
              Complete · Saved to cold storage
            </p>
          </div>

          <div className="ayy-stack" style={{ "--ayy-gap": "var(--ayy-space-1-5)" } as any}>
            <div className="ayy-spread">
              <span id="task-ai-label">AI summary</span>
              <span className="ayy-muted">In progress</span>
            </div>
            <Progress variant="ai" size="sm" aria-labelledby="task-ai-label" />
            <p className="ayy-muted" style={{ fontSize: "var(--ayy-text-xs)" }}>
              Extracting key takeaways…
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
