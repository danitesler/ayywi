import { Radio, RadioGroup } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <>
      <RadioGroup label="Small" name="plan-sm" size="sm" defaultValue="team">
        <label className="ayy-label">
          <Radio value="solo" /> Solo
        </label>
        <label className="ayy-label">
          <Radio value="team" /> Team
        </label>
      </RadioGroup>
      <RadioGroup label="Medium" name="plan-md" defaultValue="team">
        <label className="ayy-label">
          <Radio value="solo" /> Solo
        </label>
        <label className="ayy-label">
          <Radio value="team" /> Team
        </label>
      </RadioGroup>
      <RadioGroup label="Large" name="plan-lg" size="lg" defaultValue="team">
        <label className="ayy-label">
          <Radio value="solo" /> Solo
        </label>
        <label className="ayy-label">
          <Radio value="team" /> Team
        </label>
      </RadioGroup>
    </>
  );
}
