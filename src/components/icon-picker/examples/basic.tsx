import { useState } from "react";
import { IconPicker, type IconPickerIcon } from "@danitesler/ayywi/react";
import {
  Attachment01Icon,
  Briefcase01Icon,
  Bug01Icon,
  Building03Icon,
  Calendar03Icon,
  Call02Icon,
  ChartIncreaseIcon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  DollarCircleIcon,
  Flag01Icon,
  Folder01Icon,
  Globe02Icon,
  Link01Icon,
  Location01Icon,
  LockIcon,
  Mail01Icon,
  Notification01Icon,
  Rocket01Icon,
  StarIcon,
  Tag01Icon,
  Target02Icon,
  TextIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";

const icons: IconPickerIcon[] = [
  { value: "star", label: "Star", icon: StarIcon, keywords: ["favourite", "important"] },
  { value: "tag", label: "Tag", icon: Tag01Icon, keywords: ["label", "category"] },
  { value: "calendar", label: "Calendar", icon: Calendar03Icon, keywords: ["date"] },
  { value: "text", label: "Text", icon: TextIcon, keywords: ["note"] },
  { value: "folder", label: "Folder", icon: Folder01Icon, keywords: ["project"] },
  { value: "flag", label: "Flag", icon: Flag01Icon, keywords: ["priority"] },
  { value: "dollar", label: "Dollar", icon: DollarCircleIcon, keywords: ["money", "revenue", "price"] },
  { value: "chart", label: "Chart", icon: ChartIncreaseIcon, keywords: ["growth", "trend"] },
  { value: "user", label: "User", icon: UserIcon, keywords: ["person", "owner"] },
  { value: "company", label: "Company", icon: Building03Icon, keywords: ["account", "office"] },
  { value: "work", label: "Briefcase", icon: Briefcase01Icon, keywords: ["work", "job"] },
  { value: "mail", label: "Mail", icon: Mail01Icon, keywords: ["email"] },
  { value: "phone", label: "Phone", icon: Call02Icon, keywords: ["call"] },
  { value: "link", label: "Link", icon: Link01Icon, keywords: ["url"] },
  { value: "done", label: "Done", icon: CheckmarkCircle02Icon, keywords: ["check", "complete"] },
  { value: "clock", label: "Clock", icon: Clock01Icon, keywords: ["time", "due"] },
  { value: "location", label: "Location", icon: Location01Icon, keywords: ["place", "address"] },
  { value: "globe", label: "Globe", icon: Globe02Icon, keywords: ["region", "world"] },
  { value: "rocket", label: "Rocket", icon: Rocket01Icon, keywords: ["launch"] },
  { value: "target", label: "Target", icon: Target02Icon, keywords: ["goal"] },
  { value: "attachment", label: "Attachment", icon: Attachment01Icon, keywords: ["file"] },
  { value: "lock", label: "Lock", icon: LockIcon, keywords: ["private"] },
  { value: "bell", label: "Bell", icon: Notification01Icon, keywords: ["notification", "reminder"] },
  { value: "bug", label: "Bug", icon: Bug01Icon, keywords: ["issue"] },
];

export default function Example() {
  const [icon, setIcon] = useState("star");
  return <IconPicker value={icon} onValueChange={setIcon} icons={icons} />;
}
