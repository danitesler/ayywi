import { useState } from "react";
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockCode,
  CodeBlockCopy,
  CodeBlockFilename,
  CodeBlockHeader,
  CodeBlockPre,
  CodeBlockSelector,
} from "@danitesler/ayywi/react";
import { LANGUAGE_SNIPPETS, SUPPORTED_LANGUAGES } from "@danitesler/ayywi";

export default function Example() {
  const [lang, setLang] = useState("tsx");
  const current = SUPPORTED_LANGUAGES.find((l) => l.id === lang) ?? SUPPORTED_LANGUAGES[0];
  const filename = current.extension?.startsWith(".")
    ? `example${current.extension}`
    : current.extension ?? `example.${current.id}`;
  const code = LANGUAGE_SNIPPETS[lang] ?? LANGUAGE_SNIPPETS.tsx;

  return (
    <CodeBlock style={{ inlineSize: "100%", maxInlineSize: "40rem" }}>
      <CodeBlockHeader>
        <CodeBlockFilename>{filename}</CodeBlockFilename>
        <CodeBlockActions>
          <CodeBlockSelector value={lang} onValueChange={setLang} />
          <CodeBlockCopy code={code} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockPre tabIndex={0}>
        <CodeBlockCode language={lang} code={code} />
      </CodeBlockPre>
    </CodeBlock>
  );
}
