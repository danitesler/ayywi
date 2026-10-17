import { Button } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <>
      <Button loading>Saving…</Button>
      <Button variant="secondary" loading>
        Uploading…
      </Button>
      <Button variant="outline" loading>
        Refreshing
      </Button>
      <Button variant="ghost" size="sm" loading>
        Syncing
      </Button>
      <Button variant="outline" size="icon" loading aria-label="Refreshing" />
    </>
  );
}
