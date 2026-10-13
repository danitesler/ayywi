import { useState } from "react";
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Progress } from "@danitesler/ayywi/react";

export default function Example() {
  const [progress, setProgress] = useState(45);

  const step = (delta: number) => {
    setProgress((prev) => Math.min(100, Math.max(0, prev + delta)));
  };

  const isComplete = progress === 100;

  return (
    <Card style={{ inlineSize: "min(100%, 26rem)" }}>
      <CardHeader>
        <div className="ayy-spread">
          <CardTitle>File upload</CardTitle>
          <span className="ayy-mono ayy-muted">{progress}%</span>
        </div>
        <CardDescription>
          {isComplete ? "Upload complete. File is ready to share." : "Uploading client-presentation-v2.pdf…"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Progress
          value={progress}
          variant={isComplete ? "success" : progress > 80 ? "warning" : "default"}
          aria-label="File upload progress"
        />
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="outline" onClick={() => step(-25)} disabled={progress <= 0}>
          -25%
        </Button>
        <Button size="sm" onClick={() => step(25)} disabled={progress >= 100}>
          +25%
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setProgress(0)} disabled={progress === 0}>
          Reset
        </Button>
      </CardFooter>
    </Card>
  );
}
