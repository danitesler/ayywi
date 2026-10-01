---
file: invoices.tsx
expect: EmptyState
expect: Skeleton
expect: Alert
expect: variant="destructive"
expect: aria-busy
reject: style=\{\{[^}]*(color|background)
---
Write invoices.tsx, a React component (ayywi is installed; import from "ayywi/react") that lists invoices from a
hook `useInvoices()` returning { data, isLoading, error, retry }. Show a proper state for each case: while it
loads, when the request failed (with a way to try again), when there are no invoices yet (with a way to create
one), and the list itself (number, client, amount, status).
