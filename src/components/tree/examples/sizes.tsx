import { File02Icon, Folder01Icon } from "@hugeicons/core-free-icons";
import { Icon, Tree, type TreeNode } from "@danitesler/ayywi/react";

const nodes: TreeNode[] = [
  {
    id: "projects",
    label: "Projects",
    icon: <Icon icon={Folder01Icon} name="folder" className="ayy-tree__icon" />,
    children: [
      { id: "q4", label: "Q4 launch", icon: <Icon icon={File02Icon} name="file-text" className="ayy-tree__icon" /> },
      { id: "brief", label: "Campaign brief", icon: <Icon icon={File02Icon} name="file-text" className="ayy-tree__icon" /> },
    ],
  },
  { id: "team", label: "Team", icon: <Icon icon={Folder01Icon} name="folder" className="ayy-tree__icon" /> },
];

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 22rem)" }}>
      <Tree size="sm" label="Folders, small" nodes={nodes} defaultExpandedIds={["projects"]} defaultSelectedId="q4" />
      <Tree label="Folders, medium" nodes={nodes} defaultExpandedIds={["projects"]} defaultSelectedId="q4" />
      <Tree size="lg" label="Folders, large" nodes={nodes} defaultExpandedIds={["projects"]} defaultSelectedId="q4" />
    </div>
  );
}
