import { useState, type CSSProperties } from "react";
import { File02Icon, Folder01Icon, FolderShared01Icon, Megaphone01Icon, PaintBrush01Icon } from "@hugeicons/core-free-icons";
import { Icon, Tree, type TreeNode } from "@danitesler/ayywi/react";

const nodes: TreeNode[] = [
  {
    id: "projects",
    label: "Projects",
    icon: <Icon icon={Folder01Icon} name="folder" className="ayy-tree__icon" />,
    children: [
      { id: "q4", label: "Q4 launch", icon: <Icon icon={Megaphone01Icon} name="megaphone" className="ayy-tree__icon" /> },
      {
        id: "avery",
        label: "Averyveryverylongcampaignbriefwithnospacesfinalversion",
        icon: <Icon icon={File02Icon} name="file-text" className="ayy-tree__icon" />,
      },
    ],
  },
  {
    id: "team",
    label: "Team",
    icon: <Icon icon={Folder01Icon} name="folder" className="ayy-tree__icon" />,
    children: [
      { id: "design", label: "Design", icon: <Icon icon={PaintBrush01Icon} name="paintbrush" className="ayy-tree__icon" /> },
      { id: "brand", label: "Brand kit", icon: <Icon icon={File02Icon} name="file-text" className="ayy-tree__icon" /> },
    ],
  },
  {
    id: "shared",
    label: "Shared with me",
    icon: <Icon icon={FolderShared01Icon} name="folder-user" className="ayy-tree__icon" />,
    disabled: true,
  },
];

const flat = (list: TreeNode[]): TreeNode[] => list.flatMap((node) => [node, ...(node.children ? flat(node.children) : [])]);
const labels = new Map(flat(nodes).map((node) => [node.id, node.label]));

export default function Example() {
  const [opened, setOpened] = useState<string | null>(null);

  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 22rem)", "--ayy-gap": "var(--ayy-space-3)" } as CSSProperties}>
      <Tree
        label="Folders"
        nodes={nodes}
        defaultExpandedIds={["projects"]}
        defaultSelectedId="q4"
        onActivate={(id) => setOpened(labels.get(id) ?? id)}
      />
      <output role="status" className="ayy-muted">
        {opened ? `Opened ${opened}` : "Pick a file to open"}
      </output>
    </div>
  );
}
