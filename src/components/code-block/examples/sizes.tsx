import { CodeBlock, CodeBlockCode, CodeBlockPre } from "@danitesler/ayywi/react";

const lines = (
  <CodeBlockCode>
    <span className="ayy-code-block__line"><span className="ayy-token-keyword">const</span> theme = <span className="ayy-token-function">getTheme</span>();</span>
    <span className="ayy-code-block__line"><span className="ayy-token-function">setDensity</span>(<span className="ayy-token-string">"touch"</span>);</span>
    <span className="ayy-code-block__line"><span className="ayy-token-comment">// Controls grow a step</span></span>
  </CodeBlockCode>
);

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "100%", maxInlineSize: "36rem" }}>
      <CodeBlock size="sm" numbered>
        <CodeBlockPre tabIndex={0}>{lines}</CodeBlockPre>
      </CodeBlock>
      <CodeBlock numbered>
        <CodeBlockPre tabIndex={0}>{lines}</CodeBlockPre>
      </CodeBlock>
      <CodeBlock size="lg" numbered>
        <CodeBlockPre tabIndex={0}>{lines}</CodeBlockPre>
      </CodeBlock>
    </div>
  );
}
