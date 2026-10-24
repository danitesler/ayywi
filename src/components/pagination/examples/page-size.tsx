import { useState } from "react";
import { Pagination } from "@danitesler/ayywi/react";

const TOTAL = 1280;

export default function Example() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const first = (page - 1) * pageSize + 1;
  return (
    <div className="ayy-spread" style={{ inlineSize: "100%" }}>
      <p className="ayy-muted">{`${first}–${Math.min(page * pageSize, TOTAL)} of 1,280 invoices`}</p>
      <Pagination
        page={page}
        count={Math.ceil(TOTAL / pageSize)}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
    </div>
  );
}
