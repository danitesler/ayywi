import { Kbd } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack">
      <p>
        Small, inside a menu row: Save <Kbd size="sm" keyName="mod" /> <Kbd size="sm">S</Kbd>
      </p>
      <p>
        Medium, in a sentence: press <Kbd>/</Kbd> to search.
      </p>
      <p>
        Large, in a help page: jump to the next section with <Kbd size="lg">J</Kbd>.
      </p>
    </div>
  );
}
