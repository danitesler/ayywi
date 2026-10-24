import { Clock01Icon, CodeIcon, Globe02Icon, ServerStack01Icon } from "@hugeicons/core-free-icons";
import { Icon, PropertyList, PropertyRow } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div style={{ inlineSize: "min(100%, 32rem)" }}>
      <PropertyList compact>
        <PropertyRow label="Environment" icon={<Icon icon={ServerStack01Icon} className="ayy-property-list__icon" />}>
          Production
        </PropertyRow>
        <PropertyRow label="Region" icon={<Icon icon={Globe02Icon} className="ayy-property-list__icon" />}>
          eu-west-1
        </PropertyRow>
        <PropertyRow label="Updated" icon={<Icon icon={Clock01Icon} className="ayy-property-list__icon" />} empty />
        <PropertyRow label="Checksum" icon={<Icon icon={CodeIcon} className="ayy-property-list__icon" />}>
          sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08
        </PropertyRow>
      </PropertyList>
    </div>
  );
}
