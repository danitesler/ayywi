import { GridViewIcon, ListViewIcon } from "@hugeicons/core-free-icons";
import { Icon, SegmentedControl, SegmentedControlItem } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 24rem)" }}>
      <SegmentedControl aria-label="Date range" defaultValue="30d">
        <SegmentedControlItem value="7d">7 days</SegmentedControlItem>
        <SegmentedControlItem value="30d">30 days</SegmentedControlItem>
        <SegmentedControlItem value="90d">90 days</SegmentedControlItem>
      </SegmentedControl>
      <SegmentedControl aria-label="View" defaultValue="list" size="sm">
        <SegmentedControlItem value="list">
          <Icon icon={ListViewIcon} />
          List
        </SegmentedControlItem>
        <SegmentedControlItem value="grid">
          <Icon icon={GridViewIcon} />
          Grid
        </SegmentedControlItem>
      </SegmentedControl>
      <SegmentedControl aria-label="Billing cycle" defaultValue="yearly" full>
        <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
        <SegmentedControlItem value="yearly">Yearly · save 20%</SegmentedControlItem>
      </SegmentedControl>
    </div>
  );
}
