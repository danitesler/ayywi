import type { CSSProperties } from "react";
import { Scrollbar } from "@danitesler/ayywi/react";

const scroller = { maxBlockSize: "10rem", overflowY: "auto", paddingInlineEnd: "var(--ayy-space-2)" } as CSSProperties;

const notes = [
  "Q3 planning notes",
  "Launch checklist",
  "Brand review",
  "Customer interviews",
  "Roadmap draft",
  "Pricing experiments",
  "Onboarding feedback",
  "Release notes",
];

export default function Example() {
  return (
    <div className="ayy-split" style={{ "--ayy-gap": "var(--ayy-space-6)" } as CSSProperties}>
      <Scrollbar aria-label="Notes" style={scroller}>
        <ul className="ayy-stack" style={{ "--ayy-gap": "var(--ayy-space-3)" } as CSSProperties}>
          {notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </Scrollbar>
      <Scrollbar hover aria-label="Notes, scrollbar on hover" style={scroller}>
        <ul className="ayy-stack" style={{ "--ayy-gap": "var(--ayy-space-3)" } as CSSProperties}>
          {notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </Scrollbar>
    </div>
  );
}
