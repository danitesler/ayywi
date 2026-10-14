# Code block

Category: Data display. Formatted code container with header, filename, copy button, line numbers, and token styling for syntax highlighting. Also called: code-block, codeblock, syntax-highlighter, code-snippet, code-view, code-box.

**Classes**
- `.ayy-code-block` — Bordered container for code with rounded corners and surface background.
- `.ayy-code-block--numbered` — Adds line numbers using CSS counters.
- `.ayy-code-block__header` — Top toolbar with filename and copy button.
- `.ayy-code-block__filename` — File title, path, or language indicator.
- `.ayy-code-block__copy` — Copy button with icon, copied feedback, and tooltip.
- `.ayy-code-block__pre` — Scrollable preformatted text container.
- `.ayy-code-block__code` — Code element with monospace font and preformatted whitespace.
- `.ayy-token-keyword` — Syntax token for language keywords.
- `.ayy-token-string` — Syntax token for string literals.
- `.ayy-token-comment` — Syntax token for comments.
- `.ayy-token-function` — Syntax token for function and method names.
- `.ayy-token-number` — Syntax token for numeric literals.
- `.ayy-token-operator` — Syntax token for operators and punctuation.

**States**
- `default` — Surface background, line border, card radius; preformatted code area.
- `hover` (`.ayy-code-block__copy:hover`) — Copy button text colour and wash-hover background; tooltip appears after a short delay.
- `pressed` (`.ayy-code-block__copy:active`) — Copy button scales down to 0.96 for tactile feedback.
- `focus` (`.ayy-code-block__copy:focus-visible`) — Copy button shows 2px ring outline with 2px offset.
- `disabled` — doesn't apply: Code blocks display readable content and are not disabled; copy button remains usable.
- `selected` — doesn't apply: Code blocks have no selected or checked state; use Choice card or Checkbox for selectable items.
- `error` — doesn't apply: No error look; show an Alert above the code block for syntax or execution failures.
- `loading` — doesn't apply: No loading look; show a Skeleton in the shape of the code block while fetching code.
- `copied` (`.ayy-code-block__copy[data-copied="true"]`) — Copy button turns success colour and displays checkmark feedback icon and "Copied!" tooltip.

**Sizes**
- Density — Padding and copy button follow data-density.
- Width — Fills its container width; code pre scrolls horizontally when lines overflow.

**JS (framework-free)**: codeBlockClass({ numbered?, className? }) → string; codeBlockHeaderClass(); codeBlockFilenameClass(); codeBlockCopyClass(); codeBlockPreClass(); codeBlockCodeClass(); copyCodeBlock(button, { code?, timeout?, label?, copiedLabel? }) copies the code and shows the copied state; codeBlockCopyIcon, codeBlockCheckIcon (SVG markup).

**React** — `import { CodeBlock, CodeBlockHeader, CodeBlockFilename, CodeBlockCopy, CodeBlockPre, CodeBlockCode } from "@danitesler/ayywi/react";`
- `<CodeBlock>` renders <div class="ayy-code-block">. Props: `numbered` boolean — display line numbers with CSS counters
- `<CodeBlockHeader>` renders <div class="ayy-code-block__header">. Props: 
- `<CodeBlockFilename>` renders <span class="ayy-code-block__filename">. Props: 
- `<CodeBlockCopy>` renders <button class="ayy-code-block__copy">. Props: `code` string — code string to copy; if omitted, copies text from the nearest code element; `timeout` number — duration in ms to show the copied state (default 2000); `onCopy` (code: string) => void — callback fired when code is copied; `label` string — accessible label and tooltip before copy (default "Copy code"); `copiedLabel` string — accessible label and tooltip after copy (default "Copied!")
- `<CodeBlockPre>` renders <pre class="ayy-code-block__pre">. Props: 
- `<CodeBlockCode>` renders <code class="ayy-code-block__code">. Props: 

**Accessibility**
- Pre element is scrollable via keyboard by adding tabindex="0".
- Copy button has an accessible label (aria-label) and announces state changes.
- Line numbers use CSS counters with user-select: none to avoid being copied into the clipboard.
- Syntax token classes maintain WCAG AA 4.5:1 contrast against the surface background in light and dark themes.

**Do**
- Use CodeBlock to display snippets, examples, configs, and commands with syntax highlighting.
- Include a CodeBlockFilename in the header when showing multiple files or language context.
- Include CodeBlockCopy so readers can easily copy snippet contents to clipboard.
- Use numbered on multi-line snippets when referencing specific lines in accompanying text.

**Don't**
- Don't use CodeBlock for short inline code references — use <code class="ayy-mono"> or Kbd instead.
- Don't bake line numbers into the text content — use the numbered variant with CSS counters.
- Don't hardcode syntax highlighting colors — use the semantic token classes (.ayy-token-keyword, .ayy-token-string, etc.).

## Code block — Code block with filename and copy

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-code-block" style="inline-size: 100%; max-inline-size: 36rem">
  <div class="ayy-code-block__header">
    <span class="ayy-code-block__filename">button.ts</span>
    <button type="button" class="ayy-code-block__copy" aria-label="Copy code">
      <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
    </button>
  </div>
  <pre class="ayy-code-block__pre" tabindex="0"><code class="ayy-code-block__code"><span class="ayy-token-keyword">import</span> { cx } <span class="ayy-token-keyword">from</span> <span class="ayy-token-string">"@danitesler/ayywi"</span>;

<span class="ayy-token-comment">// Action button helper</span>
<span class="ayy-token-keyword">export</span> <span class="ayy-token-keyword">function</span> <span class="ayy-token-function">createButton</span>() {
  <span class="ayy-token-keyword">return</span> <span class="ayy-token-function">cx</span>(<span class="ayy-token-string">"ayy-button"</span>, <span class="ayy-token-string">"ayy-button--primary"</span>);
}</code></pre>
</div>
```

React:

```tsx
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
```

## Code block — Numbered lines

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-code-block ayy-code-block--numbered" style="inline-size: 100%; max-inline-size: 36rem">
  <div class="ayy-code-block__header">
    <span class="ayy-code-block__filename">theme.ts</span>
    <button type="button" class="ayy-code-block__copy" aria-label="Copy code">
      <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
    </button>
  </div>
  <pre class="ayy-code-block__pre" tabindex="0"><code class="ayy-code-block__code"><span><span class="ayy-token-keyword">import</span> { setTheme, setDensity } <span class="ayy-token-keyword">from</span> <span class="ayy-token-string">"@danitesler/ayywi"</span>;</span>
<span><span class="ayy-token-comment">// Apply appearance preferences</span></span>
<span><span class="ayy-token-function">setTheme</span>(<span class="ayy-token-string">"dark-contrast"</span>);</span>
<span><span class="ayy-token-function">setDensity</span>(<span class="ayy-token-string">"comfortable"</span>);</span></code></pre>
</div>
```

React:

```tsx
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
```

---
Part of @danitesler/ayywi 0.0.3: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
