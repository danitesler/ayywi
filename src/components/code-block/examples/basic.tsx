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
    <CodeBlock style={{ inlineSize: "100%", maxInlineSize: "36rem" }}>
      <CodeBlockHeader>
        <CodeBlockFilename>button.ts</CodeBlockFilename>
        <CodeBlockCopy />
      </CodeBlockHeader>
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
