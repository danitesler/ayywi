import { ChoiceCard, ChoiceGroup } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 36rem)" }}>
      <ChoiceGroup legend="Small" name="delivery-sm" size="sm" defaultValue="standard">
        <ChoiceCard value="standard" title="Standard" description="3–5 days" meta="Free" />
        <ChoiceCard value="express" title="Express" description="Next day" meta="$9" />
      </ChoiceGroup>
      <ChoiceGroup legend="Medium" name="delivery-md" defaultValue="standard">
        <ChoiceCard value="standard" title="Standard" description="3–5 days" meta="Free" />
        <ChoiceCard value="express" title="Express" description="Next day" meta="$9" />
      </ChoiceGroup>
      <ChoiceGroup legend="Large" name="delivery-lg" size="lg" defaultValue="standard">
        <ChoiceCard value="standard" title="Standard" description="3–5 days" meta="Free" />
        <ChoiceCard value="express" title="Express" description="Next day" meta="$9" />
      </ChoiceGroup>
    </div>
  );
}
