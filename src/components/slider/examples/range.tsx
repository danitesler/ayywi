import { useState } from "react";
import { SliderRange } from "ayywi/react";

export default function Example() {
  const [[low, high], setPrice] = useState<[number, number]>([18, 64]);
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 22rem)" }}>
      <div className="ayy-spread">
        <span className="ayy-label" id="price-label">
          Price
        </span>
        <span className="ayy-muted">
          ${low} – ${high}
        </span>
      </div>
      <SliderRange
        aria-labelledby="price-label"
        min={0}
        max={100}
        step={2}
        value={[low, high]}
        onValueChange={setPrice}
        labels={["Minimum price", "Maximum price"]}
        names={["price_min", "price_max"]}
      />
    </div>
  );
}
