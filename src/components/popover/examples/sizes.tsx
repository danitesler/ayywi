import { Popover, PopoverContent, PopoverTrigger } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-cluster">
      <Popover>
        <PopoverTrigger variant="outline" size="sm">
          Small
        </PopoverTrigger>
        <PopoverContent size="sm" align="start" aria-labelledby="popover-sm-title">
          <p id="popover-sm-title" className="ayy-h6">
            Autosave is on
          </p>
          <p className="ayy-muted">Changes are saved as you type.</p>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger variant="outline">Medium</PopoverTrigger>
        <PopoverContent align="start" aria-labelledby="popover-md-title">
          <p id="popover-md-title" className="ayy-h6">
            Autosave is on
          </p>
          <p className="ayy-muted">Changes are saved as you type.</p>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger variant="outline" size="lg">
          Large
        </PopoverTrigger>
        <PopoverContent size="lg" align="start" aria-labelledby="popover-lg-title">
          <p id="popover-lg-title" className="ayy-h6">
            Autosave is on
          </p>
          <p className="ayy-muted">Changes are saved as you type.</p>
        </PopoverContent>
      </Popover>
    </div>
  );
}
