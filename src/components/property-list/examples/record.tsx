import {
  Calendar03Icon,
  CheckmarkBadge01Icon,
  GitBranchIcon,
  Tag01Icon,
  TextIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { Avatar, Badge, Chip, ChipGroup, Icon, InlineEdit, PropertyList, PropertyRow } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div style={{ inlineSize: "min(100%, 32rem)" }}>
      <PropertyList>
        <PropertyRow label="Status" icon={<Icon icon={CheckmarkBadge01Icon} className="ayy-property-list__icon" />}>
          <Badge variant="success">Live</Badge>
        </PropertyRow>
        <PropertyRow label="Owner" icon={<Icon icon={UserIcon} className="ayy-property-list__icon" />}>
          <span className="ayy-cluster">
            <Avatar name="Maya Chen" size="sm" />
            Maya Chen
          </span>
        </PropertyRow>
        <PropertyRow label="Version" icon={<Icon icon={GitBranchIcon} className="ayy-property-list__icon" />}>
          <InlineEdit label="Change the version" defaultValue="1.4.0" />
        </PropertyRow>
        <PropertyRow label="Due date" icon={<Icon icon={Calendar03Icon} className="ayy-property-list__icon" />}>
          24 Nov 2026
        </PropertyRow>
        <PropertyRow label="Tags" icon={<Icon icon={Tag01Icon} className="ayy-property-list__icon" />}>
          <ChipGroup aria-label="Tags">
            <Chip name="tags" value="design" defaultChecked>
              Design
            </Chip>
            <Chip name="tags" value="engineering" defaultChecked>
              Engineering
            </Chip>
          </ChipGroup>
        </PropertyRow>
        <PropertyRow label="Description" icon={<Icon icon={TextIcon} className="ayy-property-list__icon" />}>
          Averyveryverylongunbrokendescriptionoftheworkspacewithoutspaces.
        </PropertyRow>
      </PropertyList>
    </div>
  );
}
