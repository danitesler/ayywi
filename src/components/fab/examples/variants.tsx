import { Add01Icon, Mic01Icon, PencilEdit01Icon } from "@hugeicons/core-free-icons";
import { Fab, Icon } from "@danitesler/ayywi/react";

export default function Example() {
  // inline places them in the row for this page; in an app they float at the bottom corner.
  return (
    <div className="ayy-cluster" style={{ alignItems: "center", gap: "1.5rem" }}>
      <Fab inline aria-label="New task">
        <Icon icon={Add01Icon} />
      </Fab>
      <Fab inline extended>
        <Icon icon={PencilEdit01Icon} />
        Compose
      </Fab>
      <Fab inline variant="secondary" aria-label="Record a voice note">
        <Icon icon={Mic01Icon} />
      </Fab>
      <Fab inline size="sm" variant="secondary" aria-label="Quick note">
        <Icon icon={PencilEdit01Icon} />
      </Fab>
    </div>
  );
}
