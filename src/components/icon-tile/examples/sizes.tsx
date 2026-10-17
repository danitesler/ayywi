import { Icon, IconTile } from "@danitesler/ayywi/react";
import { Globe02Icon, GridViewIcon, Layers01Icon } from "@hugeicons/core-free-icons";

export default function Example() {
  return (
    <>
      <IconTile size="lg" spotColor="var(--ayy-accent-brand)">
        <Icon icon={Globe02Icon} />
      </IconTile>
      <IconTile spotColor="var(--ayy-accent-system)">
        <Icon icon={Layers01Icon} />
      </IconTile>
      <IconTile size="sm" spotColor="var(--ayy-accent-marketing)" aria-label="Autogrid">
        <Icon icon={GridViewIcon} />
      </IconTile>
    </>
  );
}
