import { Pagination } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-spread" style={{ inlineSize: "100%" }}>
      <p className="ayy-muted">41–60 of 1,280 invoices</p>
      <Pagination page={3} count={64} href={(page) => `?page=${page}`} />
    </div>
  );
}
