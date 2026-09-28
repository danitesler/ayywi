import { Button, Tooltip } from "ayywi/react";

export default function Example() {
  return (
    <>
      <Tooltip content="Save changes (⌘S)">
        <Button variant="outline">Top</Button>
      </Tooltip>
      <Tooltip content="Opens in a new window" side="bottom">
        <Button variant="outline">Bottom</Button>
      </Tooltip>
      <Tooltip content="Start side" side="start">
        <Button variant="outline">Start</Button>
      </Tooltip>
      <Tooltip content="End side" side="end">
        <Button variant="outline">End</Button>
      </Tooltip>
    </>
  );
}
