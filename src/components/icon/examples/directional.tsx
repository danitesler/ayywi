import { ArrowLeft02Icon, ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { Button, Icon } from "ayywi/react";

// directional mirrors an icon in right-to-left text. The same buttons, then inside dir="rtl":
export default function Example() {
  return (
    <div className="ayy-stack">
      <nav className="ayy-cluster" aria-label="Pagination">
        <Button variant="outline">
          <Icon icon={ArrowLeft02Icon} directional />
          Previous
        </Button>
        <Button variant="outline">
          Next
          <Icon icon={ArrowRight02Icon} directional />
        </Button>
      </nav>
      <nav className="ayy-cluster" aria-label="עימוד" dir="rtl" lang="he">
        <Button variant="outline">
          <Icon icon={ArrowLeft02Icon} directional />
          הקודם
        </Button>
        <Button variant="outline">
          הבא
          <Icon icon={ArrowRight02Icon} directional />
        </Button>
      </nav>
    </div>
  );
}
