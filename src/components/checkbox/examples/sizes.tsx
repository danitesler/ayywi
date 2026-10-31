import { Checkbox } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack">
      <label className="ayy-label">
        <Checkbox size="sm" defaultChecked /> Small: dense tables and menus
      </label>
      <label className="ayy-label">
        <Checkbox defaultChecked /> Medium: the default
      </label>
      <label className="ayy-label">
        <Checkbox size="lg" defaultChecked /> Large: forms people fill in on a phone
      </label>
    </div>
  );
}
