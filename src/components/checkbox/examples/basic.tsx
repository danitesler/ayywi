import { Checkbox } from "ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack">
      <label className="ayy-label">
        <Checkbox defaultChecked />
        Email me when a deploy fails
      </label>
      <label className="ayy-label">
        <Checkbox />
        Weekly summary
      </label>
      <label className="ayy-label">
        <Checkbox indeterminate />
        Select all projects
      </label>
      <label className="ayy-label">
        <Checkbox disabled defaultChecked />
        Security alerts (always on)
      </label>
    </div>
  );
}
