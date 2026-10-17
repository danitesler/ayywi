import { useState, useEffect, type ReactNode } from "react";
import {
  CodeBlock,
  CodeBlockCode,
  CodeBlockCopy,
  CodeBlockFilename,
  CodeBlockHeader,
  CodeBlockPre,
  Label,
  Switch,
} from "@danitesler/ayywi/react";

export default function Example({
  setControls,
}: {
  setControls?: (node: ReactNode) => void;
} = {}) {
  const [showHeader, setShowHeader] = useState(true);
  const [showCopy, setShowCopy] = useState(true);
  const [numbered, setNumbered] = useState(false);

  useEffect(() => {
    return () => setControls?.(null);
  }, [setControls]);

  useEffect(() => {
    if (!setControls) return;
    setControls(
      <div className="pv-props-list">
        <div className="pv-props-group">
          <div className="pv-props-item">
            <Label htmlFor="cb-header" className="pv-props-label">Header</Label>
            <Switch id="cb-header" checked={showHeader} onCheckedChange={setShowHeader} />
          </div>
          <div className="pv-props-item">
            <Label htmlFor="cb-copy" className="pv-props-label">Copy button</Label>
            <Switch id="cb-copy" checked={showCopy} onCheckedChange={setShowCopy} disabled={!showHeader} />
          </div>
          <div className="pv-props-item">
            <Label htmlFor="cb-numbered" className="pv-props-label">Line numbers</Label>
            <Switch id="cb-numbered" checked={numbered} onCheckedChange={setNumbered} />
          </div>
        </div>
      </div>
    );
  }, [setControls, showHeader, showCopy, numbered]);

  return (
    <CodeBlock numbered={numbered} style={{ inlineSize: "100%", maxInlineSize: "36rem" }}>
      {showHeader ? (
        <CodeBlockHeader>
          <CodeBlockFilename>button.ts</CodeBlockFilename>
          {showCopy ? <CodeBlockCopy /> : null}
        </CodeBlockHeader>
      ) : null}
      <CodeBlockPre tabIndex={0}>
        <CodeBlockCode>
          <span className="ayy-token-keyword">import</span> &#123; cx &#125; <span className="ayy-token-keyword">from</span> <span className="ayy-token-string">"@danitesler/ayywi"</span>;
          {"\n\n"}
          <span className="ayy-token-comment">// Action button helper</span>
          {"\n"}
          <span className="ayy-token-keyword">export</span> <span className="ayy-token-keyword">function</span> <span className="ayy-token-function">createButton</span>() &#123;
          {"\n"}
          {"  "}<span className="ayy-token-keyword">return</span> <span className="ayy-token-function">cx</span>(<span className="ayy-token-string">"ayy-button"</span>, <span className="ayy-token-string">"ayy-button--primary"</span>);
          {"\n"}
          &#125;
        </CodeBlockCode>
      </CodeBlockPre>
    </CodeBlock>
  );
}
