import { useState } from "react";
import { Icon, IconPicker, Popover, PopoverContent, PopoverTrigger, type IconPickerIcon } from "@danitesler/ayywi/react";
import { Folder01Icon, Rocket01Icon, StarIcon, Target02Icon } from "@hugeicons/core-free-icons";

const icons: IconPickerIcon[] = [
  { value: "folder", label: "Folder", icon: Folder01Icon, name: "folder" },
  { value: "rocket", label: "Rocket", icon: Rocket01Icon, name: "rocket-launch", keywords: ["launch"] },
  { value: "target", label: "Target", icon: Target02Icon, name: "target", keywords: ["goal"] },
  { value: "star", label: "Star", icon: StarIcon, name: "star" },
];

export default function Example() {
  const [icon, setIcon] = useState("🚀");
  const picked = icons.find((item) => item.value === icon);
  return (
    <div className="ayy-cluster">
      <Popover>
        <PopoverTrigger variant="outline" size="icon" aria-label="Project icon">
          {picked ? <Icon icon={picked.icon as typeof StarIcon} name={picked.name} /> : icon || <Icon icon={Folder01Icon} name="folder" />}
        </PopoverTrigger>
        <PopoverContent align="start" aria-label="Project icon">
          <IconPicker value={icon} onValueChange={setIcon} icons={icons} />
        </PopoverContent>
      </Popover>
      <span className="ayy-h6">Q3 launch</span>
    </div>
  );
}
