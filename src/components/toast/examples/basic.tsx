import { Button, toast } from "ayywi/react";

export default function Example() {
  return (
    <>
      <Button variant="outline" onClick={() => toast("Changes saved")}>
        Default
      </Button>
      <Button variant="outline" onClick={() => toast.success("Deployed", { description: "Marketing site is live." })}>
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast("Project archived", {
            action: { label: "Undo", onClick: () => toast.info("Project restored") },
          })
        }
      >
        With action
      </Button>
      <Button variant="outline" onClick={() => toast.error("Build failed", { description: "3 type errors in api/server.ts" })}>
        Error
      </Button>
    </>
  );
}
