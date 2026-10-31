import { Field, Label, Switch } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack">
      <Field inline>
        <Switch id="sw-size-sm" size="sm" defaultChecked />
        <Label htmlFor="sw-size-sm">Small: rows in a dense settings list</Label>
      </Field>
      <Field inline>
        <Switch id="sw-size-md" defaultChecked />
        <Label htmlFor="sw-size-md">Medium: the default</Label>
      </Field>
      <Field inline>
        <Switch id="sw-size-lg" size="lg" defaultChecked />
        <Label htmlFor="sw-size-lg">Large: a main on/off setting</Label>
      </Field>
    </div>
  );
}
