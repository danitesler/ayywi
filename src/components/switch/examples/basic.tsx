import { Field, Label, Switch } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack">
      <Field inline>
        <Switch id="sw-sync" defaultChecked />
        <Label htmlFor="sw-sync">Sync on save</Label>
      </Field>
      <Field inline>
        <Switch id="sw-telemetry" />
        <Label htmlFor="sw-telemetry">Share anonymous usage</Label>
      </Field>
      <Field inline>
        <Switch id="sw-disabled" disabled defaultChecked />
        <Label htmlFor="sw-disabled">Managed by your organisation</Label>
      </Field>
    </div>
  );
}
