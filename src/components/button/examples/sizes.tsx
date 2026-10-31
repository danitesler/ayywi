import { Add01Icon } from "@hugeicons/core-free-icons";
import { Button, Icon } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <>
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button>Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra large</Button>
      <Button variant="outline" size="xs">Extra small</Button>
      <Button variant="outline" size="sm">Small</Button>
      <Button variant="outline">Medium</Button>
      <Button variant="outline" size="lg">Large</Button>
      <Button variant="outline" size="xl">Extra large</Button>
      <Button variant="secondary" size="icon-xs" aria-label="Add, extra small">
        <Icon icon={Add01Icon} name="add" />
      </Button>
      <Button variant="secondary" size="icon-sm" aria-label="Add, small">
        <Icon icon={Add01Icon} name="add" />
      </Button>
      <Button variant="secondary" size="icon" aria-label="Add, medium">
        <Icon icon={Add01Icon} name="add" />
      </Button>
      <Button variant="secondary" size="icon-lg" aria-label="Add, large">
        <Icon icon={Add01Icon} name="add" />
      </Button>
      <Button variant="secondary" size="icon-xl" aria-label="Add, extra large">
        <Icon icon={Add01Icon} name="add" />
      </Button>
    </>
  );
}
