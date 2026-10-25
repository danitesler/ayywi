import { useState } from "react";
import { Rating } from "@danitesler/ayywi/react";

export default function Example() {
  const [score, setScore] = useState(4);
  const [halfScore, setHalfScore] = useState(3.5);

  return (
    <div className="ayy-stack" style={{ "--ayy-gap": "var(--ayy-space-4)" } as React.CSSProperties}>
      <div className="ayy-cluster" style={{ "--ayy-gap": "var(--ayy-space-3)" } as React.CSSProperties}>
        <Rating aria-label="Overall rating" name="rating-demo" value={score} onValueChange={setScore} clearable />
        <span className="ayy-small ayy-muted ayy-tabular">{score ? `${score} of 5` : "No rating"}</span>
      </div>

      <div className="ayy-cluster" style={{ "--ayy-gap": "var(--ayy-space-3)" } as React.CSSProperties}>
        <Rating aria-label="Half-star rating" name="rating-half-demo" half value={halfScore} onValueChange={setHalfScore} />
        <span className="ayy-small ayy-muted ayy-tabular">{halfScore.toFixed(1)} of 5</span>
      </div>

      <div className="ayy-cluster" style={{ "--ayy-gap": "var(--ayy-space-2)" } as React.CSSProperties}>
        <Rating value={4.5} readOnly size="sm" />
        <span className="ayy-small ayy-tabular">4.5</span>
        <span className="ayy-small ayy-muted">(128 reviews)</span>
      </div>
    </div>
  );
}
