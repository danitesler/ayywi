import { Add01Icon, Mic01Icon, PencilEdit01Icon } from "@hugeicons/core-free-icons";
import type { CSSProperties } from "react";
import { Fab, Icon } from "@danitesler/ayywi/react";

export default function Example() {
  // inline places them in the row for this page; in an app they float at the bottom corner.
  return (
    <div className="ayy-cluster" style={{ alignItems: "center", "--ayy-gap": "var(--ayy-space-6)" } as CSSProperties}>
      <Fab inline aria-label="New task">
        <Icon icon={Add01Icon} name="add" />
      </Fab>
      <Fab inline extended>
        <Icon icon={PencilEdit01Icon} name="pencil-line" />
        Compose
      </Fab>
      <Fab inline variant="secondary" aria-label="Record a voice note">
        <Icon icon={Mic01Icon} name="mic" />
      </Fab>
      <Fab inline size="sm" variant="secondary" aria-label="Quick note">
        <Icon icon={PencilEdit01Icon} name="pencil-line" />
      </Fab>
    </div>
  );
}
