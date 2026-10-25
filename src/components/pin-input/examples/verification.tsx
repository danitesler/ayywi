import { useState } from "react";
import { Field, FieldError, FieldHint, Label, PinInput, toast } from "@danitesler/ayywi/react";

export default function Example() {
  const [code, setCode] = useState("");
  const invalid = code.length === 6 && code !== "482910";

  return (
    <div className="ayy-stack" style={{ "--ayy-gap": "var(--ayy-space-5)", maxInlineSize: "24rem" } as React.CSSProperties}>
      <Field>
        <Label id="otp-label" htmlFor="otp-code">
          Authenticator code
        </Label>
        <PinInput
          id="otp-code"
          aria-labelledby="otp-label"
          groups={[3, 3]}
          value={code}
          invalid={invalid}
          onValueChange={setCode}
          onComplete={(next) => {
            if (next === "482910") toast.success("Code verified");
          }}
        />
        {invalid ? (
          <FieldError>That code didn’t match. Try 482910.</FieldError>
        ) : (
          <FieldHint>Enter or paste the 6-digit code (try 482910).</FieldHint>
        )}
      </Field>

      <Field>
        <Label id="pin-mask-label" htmlFor="card-pin">
          Card PIN
        </Label>
        <PinInput id="card-pin" aria-labelledby="pin-mask-label" length={4} mask defaultValue="1984" />
      </Field>

      <Field>
        <Label id="backup-label" htmlFor="invite-code">
          Invite code (alphanumeric)
        </Label>
        <PinInput id="invite-code" aria-labelledby="backup-label" groups={[4, 4]} type="alphanumeric" size="sm" placeholder="·" />
      </Field>
    </div>
  );
}
