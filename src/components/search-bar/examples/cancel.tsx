import { SearchBar } from "@danitesler/ayywi/react";

export default function Example() {
  // While searching on a phone: Cancel ends the search and goes back to the list.
  return (
    <div style={{ inlineSize: "min(100%, 24rem)" }}>
      <SearchBar size="lg" placeholder="Search notes" label="Search notes" defaultValue="trip" onCancel={() => {}} />
    </div>
  );
}
