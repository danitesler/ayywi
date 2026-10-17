import { useState } from "react";
import { Command, CommandGroup, CommandItem, Kbd, TextHighlight } from "@danitesler/ayywi/react";

interface SearchItem {
  id: string;
  title: string;
  description: string;
  group: string;
  meta: string;
}

const ITEMS: SearchItem[] = [
  {
    id: "keyboard-hint",
    title: "Keyboard hint",
    description: "Visual key cap hints and shortcut labels for commands",
    group: "Data display",
    meta: "Data display",
  },
  {
    id: "text-highlight",
    title: "Text highlight",
    description: "Inline text callouts and search match styling",
    group: "Data display",
    meta: "Data display",
  },
  {
    id: "code-block",
    title: "Code block",
    description: "Formatted code container with header, filename, copy button, line numbers and syntax highlighting",
    group: "Data display",
    meta: "Data display",
  },
  {
    id: "timeline",
    title: "Timeline",
    description: "Chronological list of events, milestones, or history with vertical connections",
    group: "Data display",
    meta: "Data display",
  },
  {
    id: "chip",
    title: "Chip",
    description: "Compact interactive tag chips with dismiss actions",
    group: "Forms",
    meta: "Forms",
  },
  {
    id: "field",
    title: "Field",
    description: "Form field wrapper: Label + control + hint or error, stacked with consistent spacing",
    group: "Forms",
    meta: "Forms",
  },
  {
    id: "file-upload",
    title: "File upload",
    description: "Drop zone and file selector for attachments",
    group: "Forms",
    meta: "Forms",
  },
];

export default function Example() {
  const [query, setQuery] = useState("hi");

  const q = query.trim().toLowerCase();
  const isTitleMatch = (title: string) => q.length > 0 && title.toLowerCase().includes(q);
  const showDescription = (title: string, desc: string) =>
    !isTitleMatch(title) && q.length > 0 && desc.toLowerCase().includes(q);

  return (
    <Command
      style={{ maxInlineSize: "36rem" }}
      label="Search commands"
      inputProps={{
        value: query,
        onChange: (e) => setQuery(e.target.value),
      }}
      footer={
        <>
          <span>
            <Kbd>↑</Kbd> <Kbd>↓</Kbd> to move
          </span>
          <span>
            <Kbd>↵</Kbd> to select
          </span>
          <span>
            <Kbd>esc</Kbd> to close
          </span>
        </>
      }
    >
      <CommandGroup heading="Data display">
        {ITEMS.filter((i) => i.group === "Data display").map((item) => (
          <CommandItem
            key={item.id}
            value={item.id}
            data-description={item.description}
            description={
              showDescription(item.title, item.description) ? (
                <TextHighlight text={item.description} query={query} />
              ) : undefined
            }
            meta={item.meta}
          >
            {query ? <TextHighlight text={item.title} query={query} /> : item.title}
          </CommandItem>
        ))}
      </CommandGroup>
      <CommandGroup heading="Forms">
        {ITEMS.filter((i) => i.group === "Forms").map((item) => (
          <CommandItem
            key={item.id}
            value={item.id}
            data-description={item.description}
            description={
              showDescription(item.title, item.description) ? (
                <TextHighlight text={item.description} query={query} />
              ) : undefined
            }
            meta={item.meta}
          >
            {query ? <TextHighlight text={item.title} query={query} /> : item.title}
          </CommandItem>
        ))}
      </CommandGroup>
    </Command>
  );
}
