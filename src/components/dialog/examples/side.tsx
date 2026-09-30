import { useState, type CSSProperties } from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  FieldHint,
  Input,
  Label,
  Select,
  Switch,
  toast,
} from "ayywi/react";

export default function Example() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger variant="outline">Project settings</DialogTrigger>
      {/* side="end": a full-height panel on the inline-end edge. Only the body scrolls. */}
      <DialogContent side="end">
        <DialogHeader>
          <DialogTitle>Project settings</DialogTitle>
          <DialogDescription>Marketing site. Changes apply to the next deployment.</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <form
            id="project-settings-form"
            className="ayy-stack"
            style={{ "--ayy-gap": "1.25rem" } as CSSProperties}
            onSubmit={(event) => {
              event.preventDefault();
              setOpen(false);
              toast.success("Settings saved");
            }}
          >
            <Field>
              <Label htmlFor="settings-name">Project name</Label>
              <Input id="settings-name" name="name" defaultValue="marketing-site" required />
            </Field>
            <Field>
              <Label htmlFor="settings-region">Region</Label>
              <Select id="settings-region" name="region" defaultValue="fra1">
                <option value="fra1">Frankfurt (fra1)</option>
                <option value="iad1">Washington, D.C. (iad1)</option>
                <option value="hnd1">Tokyo (hnd1)</option>
              </Select>
            </Field>
            <Field>
              <Label htmlFor="settings-build">Build command</Label>
              <Input id="settings-build" name="build" defaultValue="pnpm build" aria-describedby="settings-build-hint" />
              <FieldHint id="settings-build-hint">Runs in the project root after install.</FieldHint>
            </Field>
            <Field>
              <Label htmlFor="settings-output">Output directory</Label>
              <Input id="settings-output" name="output" defaultValue="dist" />
            </Field>
            <Field inline>
              <Switch id="settings-autodeploy" name="autodeploy" defaultChecked />
              <Label htmlFor="settings-autodeploy">Deploy every push to main</Label>
            </Field>
            <Field inline>
              <Switch id="settings-previews" name="previews" defaultChecked />
              <Label htmlFor="settings-previews">Preview deployments for pull requests</Label>
            </Field>
          </form>
        </DialogBody>
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
          {/* A submit button outside the form reaches it through the form attribute. */}
          <Button type="submit" form="project-settings-form">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
