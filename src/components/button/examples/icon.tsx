import { PlusSignIcon, UserAdd01Icon } from "@hugeicons/core-free-icons";
import { Button, Icon, Tooltip } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <>
      <Button>
        <Icon icon={PlusSignIcon} />
        New project
      </Button>
      <Button variant="secondary">
        <Icon icon={UserAdd01Icon} />
        Invite member
      </Button>
      <Tooltip content="Add item (large)">
        <Button variant="outline" size="icon-lg" aria-label="Add item">
          <Icon icon={PlusSignIcon} />
        </Button>
      </Tooltip>
      <Tooltip content="Add item">
        <Button variant="outline" size="icon" aria-label="Add item">
          <Icon icon={PlusSignIcon} />
        </Button>
      </Tooltip>
      <Tooltip content="Add item (compact)">
        <Button variant="ghost" size="icon-sm" aria-label="Add item">
          <Icon icon={PlusSignIcon} />
        </Button>
      </Tooltip>
    </>
  );
}
