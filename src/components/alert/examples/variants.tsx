import { Alert02Icon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import { Alert, AlertActions, AlertDescription, AlertTitle, Button, Icon } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 32.5rem)" }}>
      <Alert>
        <Icon icon={InformationCircleIcon} />
        <AlertTitle>Read-only mode</AlertTitle>
        <AlertDescription>You're viewing a shared project. Ask the owner for edit access.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <Icon icon={Alert02Icon} />
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
