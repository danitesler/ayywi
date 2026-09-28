import { Button, Input, Popover, PopoverContent, PopoverTrigger } from "ayywi/react";

export default function Example() {
  return (
    <Popover>
      <PopoverTrigger variant="outline">Share</PopoverTrigger>
      <PopoverContent align="start" aria-labelledby="share-title">
        <div className="ayy-stack" style={{ width: 260 }}>
          <p id="share-title" style={{ margin: 0, fontWeight: 600 }}>
            Share this project
          </p>
          <p className="ayy-muted" style={{ margin: 0 }}>
            Anyone with the link can view.
          </p>
          <div className="ayy-cluster" style={{ flexWrap: "nowrap" }}>
            <Input size="sm" readOnly defaultValue="https://example.com/p/42" aria-label="Share link" />
            <Button size="sm">Copy</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
