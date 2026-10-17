import { useState } from "react";
import { toast } from "@danitesler/ayywi";
import {
  Button,
  CodeBlock as AyyCodeBlock,
  CodeBlockCode,
  CodeBlockCopy,
  CodeBlockFilename,
  CodeBlockHeader,
  CodeBlockPre,
} from "@danitesler/ayywi/react";

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

export function CopyButton({
  text,
  label = "Copy",
  variant = "ghost",
  size = "sm",
}: {
  text: string;
  label?: string;
  variant?: "ghost" | "outline" | "primary";
  size?: "sm" | "md";
}) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      size={size}
      variant={variant}
      onClick={async () => {
        if (await copyText(text)) {
          setCopied(true);
          toast.success(label === "Copy" ? "Copied to clipboard" : `${label.replace(/^Copy\s*/, "") || "Copied"} copied`);
          window.setTimeout(() => setCopied(false), 1400);
        }
      }}
    >
      {copied ? "Copied" : label}
    </Button>
  );
}

export function CodeBlock({
  code,
  label,
  language,
  wrap,
  copyLabel = "Copy",
}: {
  code: string;
  label?: string;
  language?: string;
  wrap?: boolean;
  copyLabel?: string;
}) {
  const lang = language ?? (label === "prompt" ? "markdown" : label);
  return (
    <AyyCodeBlock className="pv-code">
      <CodeBlockHeader className="pv-code__bar">
        {label ? <CodeBlockFilename className="ayy-eyebrow">{label}</CodeBlockFilename> : <span />}
        <CodeBlockCopy
          code={code}
          label={copyLabel}
          onCopy={() => toast.success(copyLabel === "Copy" ? "Copied to clipboard" : `${copyLabel.replace(/^Copy\s*/, "") || "Copied"} copied`)}
        />
      </CodeBlockHeader>
      {/* Focusable so keyboard users can scroll long code (axe: scrollable-region-focusable). */}
      <CodeBlockPre
        className={`pv-code__pre ayy-scroll${wrap ? " pv-code__pre--wrap" : ""}`}
        dir="ltr"
        tabIndex={0}
        aria-label={label ? `${label} code` : "Code"}
      >
        <CodeBlockCode language={lang} code={code} />
      </CodeBlockPre>
    </AyyCodeBlock>
  );
}
