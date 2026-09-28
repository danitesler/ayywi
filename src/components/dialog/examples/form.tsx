import { useState } from "react";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Field,
  Input,
  Label,
} from "ayywi/react";

export default function Example() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("marketing-site");

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Rename project ({name})
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <form
            className="ayy-stack"
            style={{ gap: "1rem" }}
            onSubmit={(event) => {
              event.preventDefault();
              setName(String(new FormData(event.currentTarget).get("name") ?? ""));
              setOpen(false);
            }}
          >
            <DialogHeader>
              <DialogTitle>Rename project</DialogTitle>
            </DialogHeader>
            <Field>
              <Label htmlFor="project-name">Name</Label>
              <Input id="project-name" name="name" defaultValue={name} autoFocus />
            </Field>
            <DialogFooter>
              <DialogClose>Cancel</DialogClose>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
