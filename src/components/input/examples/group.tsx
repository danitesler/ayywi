import { Copy01Icon, Search01Icon, ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons";
import { type CSSProperties, useState } from "react";
import { Button, Field, FieldHint, Icon, Input, InputGroup, InputGroupAddon, Kbd, Label, Tooltip, toast } from "@danitesler/ayywi/react";

export default function Example() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 24rem)", "--ayy-gap": "var(--ayy-space-4)" } as CSSProperties}>
      <Field>
        <Label htmlFor="ig-search">Search</Label>
        <InputGroup>
          <Icon icon={Search01Icon} name="search" />
          <Input id="ig-search" type="search" placeholder="Search conversations" aria-keyshortcuts="/" />
          <InputGroupAddon>
            <Kbd>/</Kbd>
          </InputGroupAddon>
        </InputGroup>
      </Field>

      <Field>
        <Label htmlFor="ig-site">Website</Label>
        <InputGroup>
          <InputGroupAddon>https://</InputGroupAddon>
          <Input id="ig-site" placeholder="northwind.app" autoComplete="url" />
        </InputGroup>
      </Field>

      <Field>
        <Label htmlFor="ig-price">Price</Label>
        <InputGroup>
          <Input id="ig-price" inputMode="decimal" defaultValue="24.00" aria-describedby="ig-price-hint" />
          <InputGroupAddon>USD</InputGroupAddon>
        </InputGroup>
        <FieldHint id="ig-price-hint">Per editor, per month.</FieldHint>
      </Field>

      <Field>
        <Label htmlFor="ig-token">Access token</Label>
        <InputGroup>
          <Input id="ig-token" defaultValue="ayy_tok_9x8f7d6e5c" readOnly className="ayy-mono" />
          <Tooltip content="Copy token">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Copy token"
              onClick={() => {
                navigator.clipboard?.writeText("ayy_tok_9x8f7d6e5c");
                toast("Access token copied to clipboard");
              }}
            >
              <Icon icon={Copy01Icon} name="copy" />
            </Button>
          </Tooltip>
        </InputGroup>
      </Field>

      <Field>
        <Label htmlFor="ig-password">Password</Label>
        <InputGroup>
          <Input
            id="ig-password"
            type={showPassword ? "text" : "password"}
            defaultValue="secret-passphrase"
            autoComplete="current-password"
          />
          <Tooltip content={showPassword ? "Hide password" : "Show password"}>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              onClick={() => {
                const next = !showPassword;
                setShowPassword(next);
                toast(next ? "Password revealed" : "Password hidden");
              }}
            >
              <Icon icon={showPassword ? ViewOffSlashIcon : ViewIcon} name={showPassword ? "eye-off" : "eye"} />
            </Button>
          </Tooltip>
          <Tooltip content="Copy password">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Copy password"
              onClick={() => {
                navigator.clipboard?.writeText("secret-passphrase");
                toast("Password copied to clipboard");
              }}
            >
              <Icon icon={Copy01Icon} name="copy" />
            </Button>
          </Tooltip>
        </InputGroup>
      </Field>
    </div>
  );
}
