import { useState } from "react";
import { blockEditorMentionHtml } from "@danitesler/ayywi";
import { BlockEditor, type BlockEditorBlock, type BlockEditorMentionSource } from "@danitesler/ayywi/react";

const MENTIONS: BlockEditorMentionSource[] = [
  {
    trigger: "@",
    label: "People",
    options: [
      { id: "ada", label: "Ada Lovelace", hint: "Engineering lead", avatar: true },
      { id: "grace", label: "Grace Hopper", hint: "Platform", avatar: true },
      { id: "alan", label: "Alan Turing", hint: "Security", avatar: true },
      { id: "margaret", label: "Margaret Hamilton", hint: "Release manager", avatar: true },
    ],
  },
  {
    trigger: "#",
    label: "Issues",
    options: [
      { id: "142", label: "Auth token refresh race", hint: "#142 · In review" },
      { id: "158", label: "Onboarding checklist copy", hint: "#158 · To do" },
      { id: "163", label: "Activation event double-counts", hint: "#163 · In progress" },
    ],
  },
];

const FUNNEL =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='520' viewBox='0 0 1200 520'><defs><linearGradient id='f' x1='0' y1='0' x2='1' y2='0'><stop offset='0' stop-color='%236366f1'/><stop offset='1' stop-color='%2314b8a6'/></linearGradient></defs><rect width='1200' height='520' fill='%23f4f4f5'/><rect x='80' y='80' width='1040' height='70' rx='14' fill='url(%23f)'/><rect x='80' y='180' width='780' height='70' rx='14' fill='url(%23f)' fill-opacity='.8'/><rect x='80' y='280' width='520' height='70' rx='14' fill='url(%23f)' fill-opacity='.6'/><rect x='80' y='380' width='410' height='70' rx='14' fill='url(%23f)' fill-opacity='.45'/></svg>";

const ada = blockEditorMentionHtml({ trigger: "@", id: "ada", label: "Ada Lovelace" });
const margaret = blockEditorMentionHtml({ trigger: "@", id: "margaret", label: "Margaret Hamilton" });
const race = blockEditorMentionHtml({ trigger: "#", id: "142", label: "Auth token refresh race" });

const START: BlockEditorBlock[] = [
  { id: "title", type: "heading-1", html: "Q3 onboarding launch" },
  { id: "intro", type: "text", html: `Ship the new onboarding to <strong>every workspace</strong> by 30 September. ${ada} owns the rollout, ${margaret} the release notes.` },
  { id: "freeze", type: "callout", tone: "warning", html: "Code freeze is <strong>12 September</strong>. Anything not merged by then moves to Q4." },
  { id: "h-milestones", type: "heading-2", html: "Milestones" },
  { id: "m1", type: "todo", checked: true, html: "Finish the onboarding copy" },
  { id: "m2", type: "todo", html: `Fix ${race} before the beta` },
  { id: "m3", type: "todo", html: "Beta with 20 workspaces" },
  { id: "m4", type: "todo", indent: 1, html: "Pick workspaces that already talk to support" },
  { id: "h-rollout", type: "heading-2", html: "Rollout" },
  { id: "r1", type: "number", html: "Internal workspaces, behind a flag" },
  { id: "r2", type: "number", html: "10% of new sign-ups" },
  { id: "r3", type: "number", html: "Everyone, once activation holds at <em>40%</em> for a week" },
  { id: "quote", type: "quote", html: "Measure activation, not sign-ups." },
  { id: "funnel", type: "image", src: FUNNEL, caption: "Activation funnel from the last beta" },
  { id: "flag", type: "code", language: "typescript", html: "// Start with 10% of new sign-ups\nflags.enable(\"onboarding-v2\", { percent: 10 });" },
  { id: "rule", type: "divider" },
  { id: "end", type: "text", html: "" },
];

export default function Example() {
  const [doc, setDoc] = useState(START);
  return (
    <BlockEditor
      aria-label="Q3 onboarding launch"
      inset
      value={doc}
      onChange={setDoc}
      mentions={MENTIONS}
      placeholder="Write the plan, or type / for blocks"
      style={{ maxInlineSize: "46rem" }}
    />
  );
}
