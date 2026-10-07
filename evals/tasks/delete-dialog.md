---
file: DeleteProject.tsx
expect: from "@danitesler/ayywi/react"
expect: <Dialog\b
expect: <DialogTitle\b
expect: variant="destructive"
reject: className="[^"]*\b(fixed|absolute)\b
---
Write a React component DeleteProject.tsx using ayywi (import from "@danitesler/ayywi/react"). It renders a destructive
"Delete project" button that opens a confirmation dialog with a title, a one-line description, and Cancel /
Delete buttons. Delete calls an onDelete prop.
