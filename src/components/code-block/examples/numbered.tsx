import {
  CodeBlock,
  CodeBlockCode,
  CodeBlockCopy,
  CodeBlockFilename,
  CodeBlockHeader,
  CodeBlockPre,
} from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <CodeBlock numbered style={{ inlineSize: "100%", maxInlineSize: "36rem" }}>
      <CodeBlockHeader>
        <CodeBlockFilename>theme.ts</CodeBlockFilename>
        <CodeBlockCopy />
      </CodeBlockHeader>
      <CodeBlockPre tabIndex={0}>
        <CodeBlockCode>
          <span><span className="ayy-token-keyword">import</span> &#123; setTheme, setDensity &#125; <span className="ayy-token-keyword">from</span> <span className="ayy-token-string">"@danitesler/ayywi"</span>;</span>
          <span><span className="ayy-token-comment">// Apply appearance preferences</span></span>
          <span><span className="ayy-token-function">setTheme</span>(<span className="ayy-token-string">"dark-contrast"</span>);</span>
          <span><span className="ayy-token-function">setDensity</span>(<span className="ayy-token-string">"comfortable"</span>);</span>
        </CodeBlockCode>
      </CodeBlockPre>
    </CodeBlock>
  );
}
