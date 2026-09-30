import { useState } from "react";
import { Button } from "ayywi/react";

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.append(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

export function CopyButton({ text, label = "Copy", variant = "ghost" }: { text: string; label?: string; variant?: "ghost" | "outline" }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      size="sm"
      variant={variant}
      onClick={async () => {
        if (await copyText(text)) {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1400);
        }
      }}
    >
      {copied ? "Copied" : label}
    </Button>
  );
}

export function CodeBlock({ code, label, wrap }: { code: string; label?: string; wrap?: boolean }) {
  return (
    <div className="pv-code">
      <div className="pv-code__bar">
        <span className="ayy-eyebrow">{label}</span>
        <CopyButton text={code} />
      </div>
      <pre className={`pv-code__pre ayy-scroll${wrap ? " pv-code__pre--wrap" : ""}`} dir="ltr">
        <code>{code}</code>
      </pre>
    </div>
  );
}
