import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { Alert, AlertDescription, AlertTitle, Icon } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 32.5rem)" }}>
      <Alert size="sm" variant="info">
        <Icon icon={InformationCircleIcon} name="info" />
        <AlertTitle>Autosave is on</AlertTitle>
        <AlertDescription>Changes are saved as you type.</AlertDescription>
      </Alert>
      <Alert variant="info">
        <Icon icon={InformationCircleIcon} name="info" />
        <AlertTitle>Autosave is on</AlertTitle>
        <AlertDescription>Changes are saved as you type.</AlertDescription>
      </Alert>
      <Alert size="lg" variant="info">
        <Icon icon={InformationCircleIcon} name="info" />
        <AlertTitle>Autosave is on</AlertTitle>
        <AlertDescription>Changes are saved as you type.</AlertDescription>
      </Alert>
    </div>
  );
}
