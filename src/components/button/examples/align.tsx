import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
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

export default function Example({
  setControls,
}: {
  setControls?: (node: ReactNode) => void;
} = {}) {
  const [size, setSize] = useState<ButtonSize>("md");
  const [variant, setVariant] = useState<ButtonVariant>("secondary");

  useEffect(() => {
    return () => setControls?.(null);
  }, [setControls]);

  useEffect(() => {
    if (!setControls) return;
    setControls(
      <div className="pv-props-list">
        <div className="pv-props-group">
          <div className="pv-props-item">
            <Label htmlFor="btn-align-size" className="pv-props-label">
              Size
            </Label>
            <div style={{ inlineSize: "7.5rem" }}>
              <Select
                id="btn-align-size"
                size="sm"
                value={size}
                onChange={(e) => setSize(e.target.value as ButtonSize)}
              >
                <option value="sm">Small (sm)</option>
                <option value="md">Medium (md)</option>
                <option value="lg">Large (lg)</option>
              </Select>
            </div>
          </div>
          <div className="pv-props-item">
            <Label htmlFor="btn-align-variant" className="pv-props-label">
              Variant
            </Label>
            <div style={{ inlineSize: "7.5rem" }}>
              <Select
                id="btn-align-variant"
                size="sm"
                value={variant}
                onChange={(e) => setVariant(e.target.value as ButtonVariant)}
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="outline">Outline</option>
                <option value="ghost">Ghost</option>
              </Select>
            </div>
          </div>
        </div>
      </div>
    );
  }, [setControls, size, variant]);

  return (
    <div
      className="ayy-stack"
      style={{
        inlineSize: "100%",
        alignItems: "center",
        "--ayy-gap": "var(--ayy-space-4)",
      } as CSSProperties}
    >
      {!setControls ? (
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
      ) : null}

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
