import { Add01Icon } from "@hugeicons/core-free-icons";
import { Button, Icon, SearchBar, TopBar } from "@danitesler/ayywi/react";

export default function Example() {
  // A tab's first screen: a big title under the actions, and a search bar as the bar's second row.
  return (
    <div style={{ inlineSize: "min(100%, 24rem)", border: "1px solid var(--ayy-color-line)", borderRadius: "var(--ayy-radius-xl)", overflow: "hidden" }}>
      <TopBar
        large
        title="Inbox"
        actions={
          <Button variant="ghost" size="icon" aria-label="New task">
            <Icon icon={Add01Icon} />
          </Button>
        }
      >
        <SearchBar placeholder="Search tasks" label="Search tasks" />
      </TopBar>
      <p className="ayy-muted" style={{ padding: "var(--ayy-space-4)", margin: 0 }}>
        12 tasks
      </p>
    </div>
  );
}
