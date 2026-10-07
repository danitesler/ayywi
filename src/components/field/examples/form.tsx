import type { CSSProperties } from "react";
import { Button, Field, FieldHint, Input, Label, Switch, Textarea } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <form
      className="ayy-stack"
      style={{ inlineSize: "min(100%, 23.75rem)", "--ayy-gap": "var(--ayy-space-4)" } as CSSProperties}
      onSubmit={(e) => e.preventDefault()}
    >
      <Field>
        <Label htmlFor="project-slug">Project name</Label>
        <Input id="project-slug" placeholder="marketing-site" aria-describedby="project-slug-hint" />
        <FieldHint id="project-slug-hint">Lowercase, dashes allowed.</FieldHint>
      </Field>
      <Field>
        <Label htmlFor="project-description">Description</Label>
        <Textarea id="project-description" rows={3} placeholder="What is this project for?" />
      </Field>
      <Field inline>
        <Switch id="project-public" defaultChecked />
        <Label htmlFor="project-public">Anyone with the link can view</Label>
      </Field>
      <div className="ayy-cluster">
        <Button type="submit">Create project</Button>
        <Button variant="ghost">Cancel</Button>
      </div>
    </form>
  );
}
