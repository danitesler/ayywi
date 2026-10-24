import { useState } from "react";
import { Folder01Icon, Folder02Icon, Megaphone01Icon, PaintBrush01Icon } from "@hugeicons/core-free-icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Icon, Tree, type TreeNode } from "@danitesler/ayywi/react";

const nodes: TreeNode[] = [
  {
    id: "team",
    label: "Team",
    icon: <Icon icon={Folder01Icon} className="ayy-tree__icon" />,
    children: [
      { id: "marketing", label: "Marketing", icon: <Icon icon={Megaphone01Icon} className="ayy-tree__icon" /> },
      { id: "design", label: "Design", icon: <Icon icon={PaintBrush01Icon} className="ayy-tree__icon" /> },
    ],
  },
  {
    id: "projects",
    label: "Projects",
    icon: <Icon icon={Folder02Icon} className="ayy-tree__icon" />,
    children: [{ id: "q4", label: "Q4 launch", icon: <Icon icon={Megaphone01Icon} className="ayy-tree__icon" /> }],
  },
  { id: "archive", label: "Archive", icon: <Icon icon={Folder02Icon} className="ayy-tree__icon" /> },
];

export default function Example() {
  const [selected, setSelected] = useState("design");

  return (
    <Card style={{ inlineSize: "min(100%, 22rem)" }}>
      <CardHeader>
        <CardTitle>Choose a folder</CardTitle>
        <CardDescription>Pick a folder for the Q4 launch.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tree
          label="Choose a folder"
          nodes={nodes}
          defaultExpandedIds={["team"]}
          selectedId={selected}
          onSelectedChange={(id) => setSelected(id ?? "")}
        />
      </CardContent>
    </Card>
  );
}
