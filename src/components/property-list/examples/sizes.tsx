import { Calendar03Icon, CheckmarkBadge01Icon, UserIcon } from "@hugeicons/core-free-icons";
import { Badge, Icon, PropertyList, PropertyRow } from "@danitesler/ayywi/react";

const rows = (
  <>
    <PropertyRow label="Status" icon={<Icon icon={CheckmarkBadge01Icon} name="badge-check" className="ayy-property-list__icon" />}>
      <Badge variant="success">Live</Badge>
    </PropertyRow>
    <PropertyRow label="Owner" icon={<Icon icon={UserIcon} name="user" className="ayy-property-list__icon" />}>
      Maya Chen
    </PropertyRow>
    <PropertyRow label="Due date" icon={<Icon icon={Calendar03Icon} name="calendar" className="ayy-property-list__icon" />}>
      24 Nov 2026
    </PropertyRow>
  </>
);

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 32rem)" }}>
      <PropertyList size="sm">{rows}</PropertyList>
      <PropertyList>{rows}</PropertyList>
      <PropertyList size="lg">{rows}</PropertyList>
    </div>
  );
}
