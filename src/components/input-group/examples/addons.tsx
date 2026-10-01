import { Copy01Icon, ViewIcon } from "@hugeicons/core-free-icons";
import type { CSSProperties } from "react";
import { Button, Field, FieldHint, Icon, Input, InputGroup, InputGroupAddon, Label } from "ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 24rem)", "--ayy-gap": "var(--ayy-space-4)" } as CSSProperties}>
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
        <Label htmlFor="ig-key">API key</Label>
        <InputGroup>
          <Input id="ig-key" type="password" defaultValue="sk_live_8f2c1d" readOnly className="ayy-mono" />
          <Button variant="ghost" size="icon-sm" aria-label="Show key">
            <Icon icon={ViewIcon} />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Copy key">
            <Icon icon={Copy01Icon} />
          </Button>
        </InputGroup>
      </Field>
    </div>
  );
}
