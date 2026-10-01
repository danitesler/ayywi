import { Search01Icon } from "@hugeicons/core-free-icons";
import { Icon, Input, InputGroup, InputGroupAddon, Kbd } from "ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 22rem)" }}>
      <InputGroup>
        <Icon icon={Search01Icon} />
        <Input type="search" placeholder="Search conversations" aria-label="Search conversations" aria-keyshortcuts="/" />
        <InputGroupAddon>
          <Kbd>/</Kbd>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup size="sm">
        <Icon icon={Search01Icon} />
        <Input type="search" placeholder="Filter" aria-label="Filter invoices" />
      </InputGroup>
    </div>
  );
}
