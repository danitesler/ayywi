import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Dialog>
      <DialogTrigger variant="secondary">Sort projects</DialogTrigger>
      <DialogContent side="bottom" size="sm" hideClose>
        <DialogHeader>
          <DialogTitle>Sort projects</DialogTitle>
          <DialogDescription>Applies to the list on this page.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose variant="primary">Last updated</DialogClose>
          <DialogClose>Name</DialogClose>
          <DialogClose>Date created</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
