import { SearchBar } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 24rem)" }}>
      <SearchBar placeholder="Search tasks" label="Search tasks" />
      <SearchBar placeholder="Search tasks" label="Search tasks" defaultValue="milk" />
    </div>
  );
}
