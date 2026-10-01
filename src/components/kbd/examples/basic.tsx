import { Kbd } from "ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack">
      <p>
        Press <Kbd>/</Kbd> to search, or <Kbd aria-label="Command K">⌘K</Kbd> to open the command menu.
      </p>
      <p className="ayy-muted">
        Save a draft with <Kbd>Ctrl</Kbd> + <Kbd>S</Kbd>.
      </p>
    </div>
  );
}
