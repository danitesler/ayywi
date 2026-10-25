import { useState } from "react";
import { TransferList, type TransferListOption } from "@danitesler/ayywi/react";

const PERMISSIONS: TransferListOption[] = [
  { id: "projects:read", label: "View projects", description: "Read project boards, roadmaps and status updates" },
  { id: "projects:write", label: "Edit projects", description: "Create, archive and rename workspace projects" },
  { id: "deploys:trigger", label: "Trigger deployments", description: "Promote builds to preview and production" },
  { id: "billing:read", label: "View billing", description: "Download invoices and inspect seat usage" },
  { id: "billing:manage", label: "Manage billing", description: "Update payment methods and plan tiers" },
  { id: "members:invite", label: "Invite members", description: "Send workspace invitations and assign roles" },
  { id: "audit:export", label: "Export audit log", description: "Download security events as CSV or JSON" },
];

export default function Example() {
  const [assigned, setAssigned] = useState<string[]>(["projects:read", "projects:write", "deploys:trigger"]);

  return (
    <TransferList
      aria-label="Role permissions"
      options={PERMISSIONS}
      value={assigned}
      onValueChange={setAssigned}
      sourceTitle="Available"
      targetTitle="Assigned"
      searchable
    />
  );
}
