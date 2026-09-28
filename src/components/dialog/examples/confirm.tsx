import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "ayywi/react";

export default function Example() {
  return (
    <Dialog>
      <DialogTrigger variant="destructive">Delete project</DialogTrigger>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Delete Marketing site?</DialogTitle>
          <DialogDescription>Its deployments and settings are removed. This can't be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
          <DialogClose variant="destructive">Delete</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
