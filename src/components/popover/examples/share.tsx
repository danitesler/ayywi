import { Button, Input, Popover, PopoverContent, PopoverTrigger } from "ayywi/react";

export default function Example() {
  return (
    <Popover>
      <PopoverTrigger variant="outline">Share</PopoverTrigger>
      <PopoverContent align="start" aria-labelledby="share-title">
        <div className="ayy-stack" style={{ inlineSize: "16.25rem" }}>
          <p id="share-title" className="ayy-h6">
            Share this project
          </p>
          <p className="ayy-muted">Anyone with the link can view.</p>
          <div className="ayy-cluster" style={{ flexWrap: "nowrap" }}>
            <Input size="sm" readOnly defaultValue="https://example.com/p/42" aria-label="Share link" />
            <Button size="sm">Copy</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
