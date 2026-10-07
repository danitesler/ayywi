import { MoreHorizontalIcon, Share08Icon } from "@hugeicons/core-free-icons";
import { Button, Icon, TopBar } from "@danitesler/ayywi/react";

export default function Example() {
  // A pushed screen: back to the list it came from, its title, two actions. Sticky at the top of its scroll container.
  return (
    <div style={{ inlineSize: "min(100%, 24rem)", border: "1px solid var(--ayy-color-line)", borderRadius: "var(--ayy-radius-xl)", overflow: "hidden" }}>
      <TopBar
        backHref="#lists"
        backLabel="Lists"
        title="Groceries"
        subtitle="8 items, 3 done"
        actions={
          <>
            <Button variant="ghost" size="icon" aria-label="Share">
              <Icon icon={Share08Icon} />
            </Button>
            <Button variant="ghost" size="icon" aria-label="More">
              <Icon icon={MoreHorizontalIcon} />
            </Button>
          </>
        }
      />
      <p className="ayy-muted" style={{ padding: "var(--ayy-space-4)", margin: 0 }}>
        The list's items go here.
      </p>
    </div>
  );
}
