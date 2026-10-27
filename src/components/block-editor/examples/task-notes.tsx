import { useState } from "react";
import { BlockEditor, Card, CardContent, CardDescription, CardHeader, CardTitle, Field, Label, Switch, type BlockEditorBlock } from "@danitesler/ayywi/react";

const NOTES: BlockEditorBlock[] = [
  { id: "n1", type: "text", html: "Customers on the old plan keep their price until renewal." },
  { id: "n2", type: "bullet", html: "Email them <strong>30 days</strong> before" },
  { id: "n3", type: "bullet", html: "Link the <a href=\"https://example.com/pricing\">new pricing page</a>" },
  { id: "n4", type: "todo", html: "Draft the email" },
  { id: "n5", type: "toggle", html: "What customers will ask", open: false },
  { id: "n6", type: "text", indent: 1, html: "<strong>Will my price change?</strong> Not until your next renewal." },
  { id: "n7", type: "text", indent: 1, html: "<strong>Can I switch early?</strong> Yes, from Settings → Billing." },
  {
    id: "n8",
    type: "table",
    rows: [
      ["Plan", "Old price", "New price"],
      ["Starter", "$9", "$12"],
      ["Team", "$24", "$29"],
    ],
    align: ["start", "end", "end"],
    headerColumn: true,
  },
];

export default function Example() {
  const [notes, setNotes] = useState(NOTES);
  const [locked, setLocked] = useState(false);
  return (
    <Card style={{ maxInlineSize: "34rem" }}>
      <CardHeader>
        <CardTitle>Migrate legacy plans</CardTitle>
        <CardDescription>Due 14 Nov · Billing</CardDescription>
      </CardHeader>
      <CardContent className="ayy-stack">
        <BlockEditor aria-label="Notes" inset value={notes} onChange={setNotes} readOnly={locked} placeholder="Add notes… type / for headings, lists and more" />
        <Field inline>
          <Switch id="notes-locked" checked={locked} onCheckedChange={setLocked} />
          <Label htmlFor="notes-locked">Read only</Label>
        </Field>
      </CardContent>
    </Card>
  );
}
