import { ChoiceCard, ChoiceGroup } from "ayywi/react";

export default function Example() {
  return (
    <ChoiceGroup legend="Plan" name="plan" defaultValue="pro" style={{ inlineSize: "100%" }}>
      <ChoiceCard value="starter" title="Starter" description="One project, community support" meta="Free" />
      <ChoiceCard value="pro" title="Pro" description="Unlimited projects, AI replies, priority support" meta="$24 / editor / month" />
      <ChoiceCard value="business" title="Business" description="SSO, audit log, a success manager" meta="$48 / editor / month" />
    </ChoiceGroup>
  );
}
