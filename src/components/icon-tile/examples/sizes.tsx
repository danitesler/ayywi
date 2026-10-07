import { IconTile } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <>
      <IconTile size="lg" spotColor="var(--ayy-accent-brand)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M5 7c4 1 9 5 11 13M3 13c5-2 11-2 17 1M9 3.5c3 3 5 6 6 8" />
        </svg>
      </IconTile>
      <IconTile spotColor="var(--ayy-accent-system)">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <rect x="4" y="4" width="7" height="7" rx="2" />
          <rect x="13" y="4" width="7" height="7" rx="2" />
          <rect x="4" y="13" width="7" height="7" rx="2" />
          <circle cx="16.5" cy="16.5" r="3.5" />
        </svg>
      </IconTile>
      <IconTile size="sm" spotColor="var(--ayy-accent-marketing)" aria-label="Autogrid">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <rect x="4" y="4" width="7" height="7" rx="1.5" />
          <rect x="13" y="4" width="7" height="7" rx="1.5" />
          <rect x="4" y="13" width="7" height="7" rx="1.5" />
          <rect x="13" y="13" width="7" height="7" rx="1.5" />
        </svg>
      </IconTile>
    </>
  );
}
