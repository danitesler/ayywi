import { PlusSignIcon, UserAdd01Icon } from "@hugeicons/core-free-icons";
import { Button, Icon } from "ayywi/react";

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
      <Button variant="outline" size="icon" aria-label="Add">
        <Icon icon={PlusSignIcon} />
      </Button>
      <Button variant="ghost" size="icon-sm" aria-label="Add">
        <Icon icon={PlusSignIcon} />
      </Button>
    </>
  );
}
