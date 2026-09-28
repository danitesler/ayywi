import { Radio, RadioGroup } from "ayywi/react";

export default function Example() {
  return (
    <>
      <RadioGroup label="Visibility" defaultValue="team">
        <label className="ayy-label">
          <Radio value="private" /> Only me
        </label>
        <label className="ayy-label">
          <Radio value="team" /> My team
        </label>
        <label className="ayy-label">
          <Radio value="public" /> Anyone with the link
        </label>
      </RadioGroup>
      <RadioGroup label="Billing" defaultValue="monthly" orientation="horizontal">
        <label className="ayy-label">
          <Radio value="monthly" /> Monthly
        </label>
        <label className="ayy-label">
          <Radio value="yearly" /> Yearly
        </label>
      </RadioGroup>
    </>
  );
}
