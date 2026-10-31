import { Pagination } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack">
      <Pagination size="sm" page={3} count={64} href={(page) => `?page=${page}`} aria-label="Small pagination" />
      <Pagination page={3} count={64} href={(page) => `?page=${page}`} aria-label="Medium pagination" />
      <Pagination size="lg" page={3} count={64} href={(page) => `?page=${page}`} aria-label="Large pagination" />
    </div>
  );
}
