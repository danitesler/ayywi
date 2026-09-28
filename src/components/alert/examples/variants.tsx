import { Alert, AlertActions, AlertDescription, AlertTitle, Button } from "ayywi/react";

const InfoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </svg>
);

export default function Example() {
  return (
    <div className="ayy-stack" style={{ width: "100%", maxWidth: 520 }}>
      <Alert>
        <InfoIcon />
        <AlertTitle>Read-only mode</AlertTitle>
        <AlertDescription>You're viewing a shared project. Ask the owner for edit access.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <InfoIcon />
        <AlertTitle>Your trial ends in 3 days</AlertTitle>
        <AlertDescription>Add a payment method to keep your projects online.</AlertDescription>
        <AlertActions>
          <Button size="sm">Add payment method</Button>
          <Button size="sm" variant="ghost">
            Later
          </Button>
        </AlertActions>
      </Alert>
      <Alert variant="destructive" role="alert">
        <AlertTitle>Deploy failed</AlertTitle>
        <AlertDescription>The build ran out of memory. Increase the limit or split the job.</AlertDescription>
      </Alert>
    </div>
  );
}
