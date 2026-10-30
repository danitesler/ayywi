import { forwardRef, useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { ArrowRight01Icon } from "../../lib/icons";
import { mergeRefs } from "../../lib/refs";
import { Icon } from "../icon/icon.react";
import { connectTree, treeClass, treeGroupClass, treeItemClass, treeLabelClass, treeRowClass, treeToggleClass, type TreeController } from "./tree";

export interface TreeNode {
  id: string;
  label: string;
  /** A decorative icon drawn before the label, e.g. `<Icon icon={Folder01Icon} className="ayy-tree__icon" />`. */
  icon?: ReactNode;
  /** Nested nodes; their group opens and closes with the toggle. */
  children?: TreeNode[];
  /** aria-disabled: the row can't be selected or activated. */
  disabled?: boolean;
}

export interface TreeProps extends Omit<HTMLAttributes<HTMLUListElement>, "onSelect"> {
  /** Accessible name of the tree, e.g. "Folders". */
  label: string;
  nodes: TreeNode[];
  /** Ids of the open groups. Controlled when set. */
  expandedIds?: string[];
  /** Open groups when uncontrolled. Default none. */
  defaultExpandedIds?: string[];
  /** Called with the new list of open ids. */
  onExpandedChange?: (ids: string[]) => void;
  /** Id of the selected node. Controlled when set. */
  selectedId?: string;
  /** Starting selection when uncontrolled. */
  defaultSelectedId?: string;
  /** Called with the selected id. */
  onSelectedChange?: (id: string | null) => void;
  /** Double-click or Enter on a node. */
  onActivate?: (id: string) => void;
  /** Tighter rows, a smaller indent and the small control text. */
  compact?: boolean;
}

/** A tree of folders, files or records: expandable groups, one selection and arrow-key navigation. */
export const Tree = forwardRef<HTMLUListElement, TreeProps>(function Tree(
  {
    label,
    nodes,
    expandedIds,
    defaultExpandedIds,
    onExpandedChange,
    selectedId,
    defaultSelectedId,
    onSelectedChange,
    onActivate,
    compact,
    className,
    ...props
  },
  ref,
) {
  const local = useRef<HTMLUListElement>(null);
  const controllerRef = useRef<TreeController | null>(null);
  const [localExpanded, setLocalExpanded] = useState<string[]>(defaultExpandedIds ?? []);
  const [localSelected, setLocalSelected] = useState<string | null>(defaultSelectedId ?? null);

  const expanded = expandedIds ?? localExpanded;
  const selected = selectedId !== undefined ? selectedId : localSelected;

  const latest = useRef({ expanded, expandedIds, selectedId, onExpandedChange, onSelectedChange, onActivate });
  latest.current = { expanded, expandedIds, selectedId, onExpandedChange, onSelectedChange, onActivate };

  useEffect(() => {
    if (!local.current) return;
    const controller = connectTree(local.current, {
      onSelect: (id) => {
        const state = latest.current;
        if (state.selectedId === undefined) setLocalSelected(id);
        state.onSelectedChange?.(id);
      },
      onActivate: (id) => latest.current.onActivate?.(id),
      onToggle: (id, open) => {
        const state = latest.current;
        const next = open ? [...state.expanded.filter((x) => x !== id), id] : state.expanded.filter((x) => x !== id);
        if (state.expandedIds === undefined) setLocalExpanded(next);
        state.onExpandedChange?.(next);
      },
    });
    controllerRef.current = controller;
    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, []);

  // Nodes that arrive or go after the first render (loaded later, filtered) can leave the tree without a tab stop.
  useEffect(() => {
    controllerRef.current?.refresh();
  }, [nodes, expanded]);

  const render = (list: TreeNode[], level: number): ReactNode =>
    list.map((node) => {
      const hasChildren = Boolean(node.children?.length);
      const open = hasChildren && expanded.includes(node.id);
      return (
        <li
          key={node.id}
          className={treeItemClass}
          role="treeitem"
          aria-level={level}
          aria-expanded={hasChildren ? open : undefined}
          aria-selected={selected === node.id ? "true" : "false"}
          aria-disabled={node.disabled ? "true" : undefined}
          aria-label={node.label}
          data-id={node.id}
          tabIndex={-1}
        >
          <div className={treeRowClass}>
            {hasChildren ? (
              <span className={treeToggleClass} aria-hidden="true">
                <Icon icon={ArrowRight01Icon} name="chevron-right" directional />
              </span>
            ) : null}
            {node.icon}
            <span className={treeLabelClass}>{node.label}</span>
          </div>
          {hasChildren ? (
            <ul className={treeGroupClass} role="group" hidden={!open}>
              {render(node.children ?? [], level + 1)}
            </ul>
          ) : null}
        </li>
      );
    });

  return (
    <ul ref={mergeRefs(ref, local)} className={treeClass({ compact, className })} role="tree" aria-label={label} {...props}>
      {render(nodes, 1)}
    </ul>
  );
});
