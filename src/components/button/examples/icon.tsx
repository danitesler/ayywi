import { Button } from "ayywi/react";

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export default function Example() {
  return (
    <>
      <Button>
        <PlusIcon />
        New project
      </Button>
      <Button variant="secondary">
        <PlusIcon />
        Invite member
      </Button>
      <Button variant="outline" size="icon" aria-label="Add">
        <PlusIcon />
      </Button>
      <Button variant="ghost" size="icon-sm" aria-label="Add">
        <PlusIcon />
      </Button>
    </>
  );
}
