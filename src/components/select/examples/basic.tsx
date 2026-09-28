import { Field, Label, Select } from "ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ width: "100%", maxWidth: 320 }}>
      <Field>
        <Label htmlFor="region">Region</Label>
        <Select id="region" defaultValue="eu">
          <option value="us">United States</option>
          <option value="eu">Europe</option>
          <option value="apac">Asia Pacific</option>
        </Select>
      </Field>
      <Select size="sm" aria-label="Sort by" defaultValue="recent">
        <option value="recent">Most recent</option>
        <option value="name">Name</option>
      </Select>
      <Select disabled aria-label="Plan">
        <option>Enterprise</option>
      </Select>
    </div>
  );
}
