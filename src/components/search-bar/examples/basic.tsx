import { SearchBar } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 24rem)" }}>
      <SearchBar placeholder="Search tasks" label="Search tasks" />
      <SearchBar placeholder="Search tasks" label="Search tasks" defaultValue="milk" />
      <SearchBar size="sm" placeholder="Filter this table" label="Filter this table" defaultValue="Mira" />
      <SearchBar size="lg" placeholder="Search everything" label="Search everything" />
    </div>
  );
}
