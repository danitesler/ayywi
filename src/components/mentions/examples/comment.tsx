import { useState } from "react";
import { Avatar, Field, FieldHint, Label, Mentions, type MentionOption } from "@danitesler/ayywi/react";

const SUGGESTIONS: MentionOption[] = [
  { id: "ada", label: "Ada Lovelace", icon: <Avatar name="Ada Lovelace" size="sm" />, keywords: "engineering lead" },
  { id: "grace", label: "Grace Hopper", icon: <Avatar name="Grace Hopper" size="sm" />, keywords: "compiler infra" },
  { id: "alan", label: "Alan Turing", icon: <Avatar name="Alan Turing" size="sm" />, keywords: "security" },
  { id: "margaret", label: "Margaret Hamilton", icon: <Avatar name="Margaret Hamilton" size="sm" />, keywords: "flight systems" },
  { id: "142", label: "Auth token refresh race", trigger: "#" },
  { id: "158", label: "RTL sidebar resize handle", trigger: "#" },
];

export default function Example() {
  const [comment, setComment] = useState("Looping in @ada to review #142 before Friday’s release. ");

  return (
    <div style={{ maxInlineSize: "30rem" }}>
      <Field>
        <Label htmlFor="review-comment">Release note</Label>
        <Mentions
          id="review-comment"
          rows={3}
          autosize
          triggers={["@", "#"]}
          options={SUGGESTIONS}
          value={comment}
          onValueChange={setComment}
          placeholder="Type @ to mention someone or # to link an issue…"
        />
        <FieldHint>Type @ for teammates or # for issues; arrows and Enter insert.</FieldHint>
      </Field>
    </div>
  );
}
