import { useState, type CSSProperties } from "react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import {
  Button,
  Field,
  Icon,
  Label,
  Select,
  type ButtonSize,
  type ButtonVariant,
} from "@danitesler/ayywi/react";

export default function Example() {
  const [size, setSize] = useState<ButtonSize>("md");
  const [variant, setVariant] = useState<ButtonVariant>("secondary");

  return (
    <div
      className="ayy-stack"
      style={{
        inlineSize: "100%",
        alignItems: "center",
        "--ayy-gap": "var(--ayy-space-4)",
      } as CSSProperties}
    >
      <div
        className="ayy-cluster"
        style={{
          "--ayy-gap": "var(--ayy-space-3)",
          justifyContent: "center",
        } as CSSProperties}
      >
        <Field inline>
          <Label htmlFor="btn-align-size-inline">Size</Label>
          <Select
            id="btn-align-size-inline"
            size="sm"
            value={size}
            onChange={(e) => setSize(e.target.value as ButtonSize)}
          >
            <option value="sm">Small (sm)</option>
            <option value="md">Medium (md)</option>
            <option value="lg">Large (lg)</option>
          </Select>
        </Field>
        <Field inline>
          <Label htmlFor="btn-align-variant-inline">Variant</Label>
          <Select
            id="btn-align-variant-inline"
            size="sm"
            value={variant}
            onChange={(e) => setVariant(e.target.value as ButtonVariant)}
          >
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="outline">Outline</option>
            <option value="ghost">Ghost</option>
          </Select>
        </Field>
      </div>

      <div
        className="ayy-stack"
        style={{
          inlineSize: "min(100%, 20rem)",
          "--ayy-gap": "var(--ayy-space-2)",
        } as CSSProperties}
      >
        <Button variant={variant} size={size} block align="start">
          <Icon icon={PlusSignIcon} />
          Align start
        </Button>
        <Button variant={variant} size={size} block align="center">
          <Icon icon={PlusSignIcon} />
          Align center (default)
        </Button>
        <Button variant={variant} size={size} block align="end">
          <Icon icon={PlusSignIcon} />
          Align end
        </Button>
      </div>
    </div>
  );
}
