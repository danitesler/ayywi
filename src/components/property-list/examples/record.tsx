import {
  Calendar03Icon,
  CheckmarkBadge01Icon,
  GitBranchIcon,
  Tag01Icon,
  TextIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { Avatar, Badge, Icon, InlineEdit, PropertyList, PropertyRow } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div style={{ inlineSize: "min(100%, 32rem)" }}>
      <PropertyList>
        <PropertyRow label="Status" icon={<Icon icon={CheckmarkBadge01Icon} name="badge-check" className="ayy-property-list__icon" />}>
          <Badge variant="success">Live</Badge>
        </PropertyRow>
        <PropertyRow label="Owner" icon={<Icon icon={UserIcon} name="user" className="ayy-property-list__icon" />}>
          <span className="ayy-cluster">
            <Avatar name="Maya Chen" size="sm" aria-hidden="true" />
            Maya Chen
          </span>
        </PropertyRow>
        <PropertyRow label="Version" icon={<Icon icon={GitBranchIcon} name="git-branch" className="ayy-property-list__icon" />}>
          <InlineEdit label="Change the version" defaultValue="1.4.0" />
        </PropertyRow>
        <PropertyRow label="Due date" icon={<Icon icon={Calendar03Icon} name="calendar" className="ayy-property-list__icon" />}>
          <bdi>
            <time dateTime="2026-11-24">24 Nov 2026</time>
          </bdi>
        </PropertyRow>
        <PropertyRow label="Tags" icon={<Icon icon={Tag01Icon} name="tag" className="ayy-property-list__icon" />}>
          <span className="ayy-cluster">
            <Badge variant="muted">Design</Badge>
            <Badge variant="muted">Engineering</Badge>
          </span>
        </PropertyRow>
        <PropertyRow label="Description" icon={<Icon icon={TextIcon} name="text" className="ayy-property-list__icon" />}>
          Averyveryverylongunbrokendescriptionoftheworkspacewithoutspaces.
        </PropertyRow>
      </PropertyList>
    </div>
  );
}
