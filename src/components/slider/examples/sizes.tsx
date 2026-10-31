import { Slider, SliderRange } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 22rem)" }}>
      <Slider size="sm" defaultValue={30} aria-label="Small slider" />
      <Slider defaultValue={50} aria-label="Medium slider" />
      <Slider size="lg" defaultValue={70} aria-label="Large slider" />
      <SliderRange size="sm" defaultValue={[20, 60]} labels={["Small range minimum", "Small range maximum"]} aria-label="Small range" />
      <SliderRange size="lg" defaultValue={[20, 60]} labels={["Large range minimum", "Large range maximum"]} aria-label="Large range" />
    </div>
  );
}
