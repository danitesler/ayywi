# Code block

Category: Data display. A container for showing code, with a header, a file name, a copy button and optional line numbers. It styles syntax highlighting without tying you to a particular highlighter. Also called: code-block, codeblock, syntax-highlighter, code-snippet, code-view, code-box.

**Classes**
- `.ayy-code-block` — Bordered container for code with rounded corners and surface background.
- `.ayy-code-block--numbered` — Adds line numbers using CSS counters.
- `.ayy-code-block__header` — Top toolbar with filename and copy button.
- `.ayy-code-block__filename` — File title, path, or language indicator.
- `.ayy-code-block__actions` — Container for header controls such as language selector and copy button.
- `.ayy-code-block__selector` — Language selector trigger button in the top toolbar.
- `.ayy-code-block__chevron` — Chevron icon inside the language selector button.
- `.ayy-code-block__menu` — Dropdown menu listing supported languages for the code block.
- `.ayy-code-block__copy` — Copy button with icon, copied feedback, and tooltip.
- `.ayy-code-block__pre` — Scrollable preformatted text container.
- `.ayy-code-block__code` — Code element with monospace font and preformatted whitespace.
- `.ayy-code-block__line` — Line wrapper inside the code element; receives line numbers when numbered.
- `.ayy-token-keyword` — Syntax token for language keywords.
- `.ayy-token-string` — Syntax token for string literals.
- `.ayy-token-comment` — Syntax token for comments.
- `.ayy-token-function` — Syntax token for function and method names.
- `.ayy-token-number` — Syntax token for numeric literals.
- `.ayy-token-operator` — Syntax token for operators and punctuation.
- `.ayy-token-tag` — Syntax token for HTML/JSX element tags.
- `.ayy-token-attribute` — Syntax token for HTML attributes and JSX props.
- `.ayy-token-property` — Syntax token for object keys and CSS properties.
- `.ayy-token-punctuation` — Syntax token for punctuation, braces, and delimiters.
- `.ayy-token-boolean` — Syntax token for boolean literals and nullish values.

**States**
- `default` — Surface background, line border, card radius; preformatted code area.
- `hover` (`.ayy-code-block__copy:hover, .ayy-code-block__selector:hover`) — Copy button and selector text colour and wash-hover background; tooltip appears after a short delay.
- `pressed` (`.ayy-code-block__copy:active`) — Copy button scales down to 0.96 for tactile feedback.
- `focus` (`.ayy-code-block__copy:focus-visible, .ayy-code-block__selector:focus-visible`) — Copy button and selector show ring outline with offset.
- `disabled` — doesn't apply: Code blocks display readable content and are not disabled; copy button remains usable.
- `selected` — doesn't apply: Code blocks have no selected or checked state; use Choice card or Checkbox for selectable items.
- `error` — doesn't apply: No error look; show an Alert above the code block for syntax or execution failures.
- `loading` — doesn't apply: No loading look; show a Skeleton in the shape of the code block while fetching code.
- `copied` (`.ayy-code-block__copy[data-copied="true"]`) — Copy button turns success colour and displays checkmark feedback icon and "Copied!" tooltip.

**Sizes**
- Density — Padding and copy button follow data-density.
- Width — Fills its container width; code pre scrolls horizontally when lines overflow.

**React** — `import { CodeBlock, CodeBlockHeader, CodeBlockFilename, CodeBlockActions, CodeBlockSelector, CodeBlockCopy, CodeBlockPre, CodeBlockCode } from "@danitesler/ayywi/react";`
- `<CodeBlock>` renders <div class="ayy-code-block">. Props: `numbered` boolean — display line numbers with CSS counters
- `<CodeBlockHeader>` renders <div class="ayy-code-block__header">. Props: 
- `<CodeBlockFilename>` renders <span class="ayy-code-block__filename">. Props: 
- `<CodeBlockActions>` renders <div class="ayy-code-block__actions">. Props: 
- `<CodeBlockSelector>` renders <button class="ayy-code-block__selector"> and <div class="ayy-menu ayy-code-block__menu">. Props: `value` string — currently selected language ID; `defaultValue` string — initial language ID when uncontrolled; `onValueChange` (value: string) => void — callback fired when a language is selected; `onChange` (event: { target: { value: string } }) => void — change event handler for compatibility; `languages` LanguagePreset[] — optional array of languages to populate options; defaults to SUPPORTED_LANGUAGES; `className` string — additional CSS class names for the trigger button; `disabled` boolean — whether the selector is disabled
- `<CodeBlockCopy>` renders <button class="ayy-code-block__copy">. Props: `code` string — code string to copy; if omitted, copies text from the nearest code element; `timeout` number — duration in ms to show the copied state (default 2000); `onCopy` (code: string) => void — callback fired when code is copied; `label` string — accessible label and tooltip before copy (default "Copy code"); `copiedLabel` string — accessible label and tooltip after copy (default "Copied!")
- `<CodeBlockPre>` renders <pre class="ayy-code-block__pre">. Props: 
- `<CodeBlockCode>` renders <code class="ayy-code-block__code">. Props: `language` string — language name or file extension for syntax highlighting (e.g. tsx, html, css, json, bash, md, python); `code` string — code content to highlight and display; if omitted, renders children

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
- Don't use CodeBlock for short inline code references — use <code class="ayy-code"> or Kbd instead.
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
      <div className="ayy-stack">
        <div className="ayy-stack">
          <div className="ayy-spread">
            <Label htmlFor="cb-header">Header</Label>
            <Switch id="cb-header" checked={showHeader} onCheckedChange={setShowHeader} />
          </div>
          <div className="ayy-spread">
            <Label htmlFor="cb-copy">Copy button</Label>
            <Switch id="cb-copy" checked={showCopy} onCheckedChange={setShowCopy} disabled={!showHeader} />
          </div>
          <div className="ayy-spread">
            <Label htmlFor="cb-numbered">Line numbers</Label>
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
          <span className="ayy-code-block__line"><span className="ayy-token-keyword">import</span> &#123; cx &#125; <span className="ayy-token-keyword">from</span> <span className="ayy-token-string">"@danitesler/ayywi"</span>;</span>
          {"\n"}
          <span className="ayy-code-block__line"></span>
          {"\n"}
          <span className="ayy-code-block__line"><span className="ayy-token-comment">// Action button helper</span></span>
          {"\n"}
          <span className="ayy-code-block__line"><span className="ayy-token-keyword">export</span> <span className="ayy-token-keyword">function</span> <span className="ayy-token-function">createButton</span>() &#123;</span>
          {"\n"}
          <span className="ayy-code-block__line">{"  "}<span className="ayy-token-keyword">return</span> <span className="ayy-token-function">cx</span>(<span className="ayy-token-string">"ayy-button"</span>, <span className="ayy-token-string">"ayy-button--primary"</span>);</span>
          {"\n"}
          <span className="ayy-code-block__line">&#125;</span>
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
  <pre class="ayy-code-block__pre" tabindex="0"><code class="ayy-code-block__code"><span class="ayy-code-block__line"><span class="ayy-token-keyword">import</span> { setTheme, setDensity } <span class="ayy-token-keyword">from</span> <span class="ayy-token-string">"@danitesler/ayywi"</span>;</span>
<span class="ayy-code-block__line"><span class="ayy-token-comment">// Apply appearance preferences</span></span>
<span class="ayy-code-block__line"><span class="ayy-token-function">setTheme</span>(<span class="ayy-token-string">"dark-contrast"</span>);</span>
<span class="ayy-code-block__line"><span class="ayy-token-function">setDensity</span>(<span class="ayy-token-string">"comfortable"</span>);</span></code></pre>
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
          <span className="ayy-code-block__line"><span className="ayy-token-keyword">import</span> &#123; setTheme, setDensity &#125; <span className="ayy-token-keyword">from</span> <span className="ayy-token-string">"@danitesler/ayywi"</span>;</span>
          <span className="ayy-code-block__line"><span className="ayy-token-comment">// Apply appearance preferences</span></span>
          <span className="ayy-code-block__line"><span className="ayy-token-function">setTheme</span>(<span className="ayy-token-string">"dark-contrast"</span>);</span>
          <span className="ayy-code-block__line"><span className="ayy-token-function">setDensity</span>(<span className="ayy-token-string">"comfortable"</span>);</span>
        </CodeBlockCode>
      </CodeBlockPre>
    </CodeBlock>
  );
}
```

## Code block — Language selector

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-code-block" style="inline-size: 100%; max-inline-size: 40rem">
  <div class="ayy-code-block__header">
    <span class="ayy-code-block__filename">example.tsx</span>
    <div class="ayy-code-block__actions">
      <!-- <ayy-menu> (@danitesler/ayywi/elements) wires placement, popover toggle, and keyboard navigation. -->
      <ayy-menu align="end">
        <button type="button" class="ayy-code-block__selector" aria-label="Select language" aria-haspopup="menu" popovertarget="code-block-lang-menu">
          <span>React (TSX)</span>
          <svg class="ayy-icon ayy-code-block__chevron" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
        </button>
        <div id="code-block-lang-menu" role="menu" class="ayy-menu ayy-code-block__menu" popover="auto">
          <div role="group">
            <button type="button" role="menuitemradio" tabindex="-1" data-close-on-select="true" aria-checked="true" class="ayy-menu__item ayy-menu__item--selected" data-value="tsx">React (TSX)</button>
            <button type="button" role="menuitemradio" tabindex="-1" data-close-on-select="true" aria-checked="false" class="ayy-menu__item" data-value="html">HTML</button>
            <button type="button" role="menuitemradio" tabindex="-1" data-close-on-select="true" aria-checked="false" class="ayy-menu__item" data-value="css">CSS</button>
            <button type="button" role="menuitemradio" tabindex="-1" data-close-on-select="true" aria-checked="false" class="ayy-menu__item" data-value="json">JSON</button>
            <button type="button" role="menuitemradio" tabindex="-1" data-close-on-select="true" aria-checked="false" class="ayy-menu__item" data-value="md">Markdown</button>
            <button type="button" role="menuitemradio" tabindex="-1" data-close-on-select="true" aria-checked="false" class="ayy-menu__item" data-value="bash">Bash / Shell</button>
            <button type="button" role="menuitemradio" tabindex="-1" data-close-on-select="true" aria-checked="false" class="ayy-menu__item" data-value="python">Python</button>
            <button type="button" role="menuitemradio" tabindex="-1" data-close-on-select="true" aria-checked="false" class="ayy-menu__item" data-value="sql">SQL</button>
            <button type="button" role="menuitemradio" tabindex="-1" data-close-on-select="true" aria-checked="false" class="ayy-menu__item" data-value="yaml">YAML</button>
            <button type="button" role="menuitemradio" tabindex="-1" data-close-on-select="true" aria-checked="false" class="ayy-menu__item" data-value="graphql">GraphQL</button>
            <button type="button" role="menuitemradio" tabindex="-1" data-close-on-select="true" aria-checked="false" class="ayy-menu__item" data-value="dockerfile">Dockerfile</button>
            <button type="button" role="menuitemradio" tabindex="-1" data-close-on-select="true" aria-checked="false" class="ayy-menu__item" data-value="toml">TOML</button>
            <button type="button" role="menuitemradio" tabindex="-1" data-close-on-select="true" aria-checked="false" class="ayy-menu__item" data-value="rust">Rust</button>
            <button type="button" role="menuitemradio" tabindex="-1" data-close-on-select="true" aria-checked="false" class="ayy-menu__item" data-value="go">Go</button>
          </div>
        </div>
      </ayy-menu>
      <button type="button" class="ayy-code-block__copy" aria-label="Copy code" data-code="import { useState } from &quot;react&quot;;
import { Button } from &quot;@danitesler/ayywi/react&quot;;

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    &lt;Button size=&quot;sm&quot; onClick={() =&gt; setCount(count + 1)}&gt;
      Count: {count}
    &lt;/Button&gt;
  );
}">
        <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
      </button>
    </div>
  </div>
  <pre class="ayy-code-block__pre" tabindex="0"><code class="ayy-code-block__code" data-language="tsx"><span class="ayy-code-block__line"><span class="ayy-token-keyword">import</span> <span class="ayy-token-punctuation">{</span> useState <span class="ayy-token-punctuation">}</span> <span class="ayy-token-keyword">from</span> <span class="ayy-token-string">&quot;react&quot;</span><span class="ayy-token-punctuation">;</span></span>
<span class="ayy-code-block__line"><span class="ayy-token-keyword">import</span> <span class="ayy-token-punctuation">{</span> Button <span class="ayy-token-punctuation">}</span> <span class="ayy-token-keyword">from</span> <span class="ayy-token-string">&quot;@danitesler/ayywi/react&quot;</span><span class="ayy-token-punctuation">;</span></span>
<span class="ayy-code-block__line"></span>
<span class="ayy-code-block__line"><span class="ayy-token-keyword">export</span> <span class="ayy-token-keyword">function</span> <span class="ayy-token-function">Counter</span><span class="ayy-token-punctuation">(</span><span class="ayy-token-punctuation">)</span> <span class="ayy-token-punctuation">{</span></span>
<span class="ayy-code-block__line">  <span class="ayy-token-keyword">const</span> <span class="ayy-token-punctuation">[</span>count<span class="ayy-token-punctuation">,</span> setCount<span class="ayy-token-punctuation">]</span> <span class="ayy-token-operator">=</span> <span class="ayy-token-function">useState</span><span class="ayy-token-punctuation">(</span><span class="ayy-token-number">0</span><span class="ayy-token-punctuation">)</span><span class="ayy-token-punctuation">;</span></span>
<span class="ayy-code-block__line">  <span class="ayy-token-keyword">return</span> <span class="ayy-token-punctuation">(</span></span>
<span class="ayy-code-block__line">    <span class="ayy-token-tag">&lt;Button</span> <span class="ayy-token-attribute">size</span><span class="ayy-token-operator">=</span><span class="ayy-token-string">&quot;sm&quot;</span> <span class="ayy-token-attribute">onClick</span><span class="ayy-token-operator">=</span><span class="ayy-token-punctuation">{</span><span class="ayy-token-punctuation">(</span><span class="ayy-token-punctuation">)</span> <span class="ayy-token-operator">=&gt;</span> <span class="ayy-token-function">setCount</span><span class="ayy-token-punctuation">(</span>count <span class="ayy-token-operator">+</span> <span class="ayy-token-number">1</span><span class="ayy-token-punctuation">)</span><span class="ayy-token-punctuation">}</span>&gt;</span>
<span class="ayy-code-block__line">      Count<span class="ayy-token-operator">:</span> <span class="ayy-token-punctuation">{</span>count<span class="ayy-token-punctuation">}</span></span>
<span class="ayy-code-block__line">    &lt;/Button&gt;</span>
<span class="ayy-code-block__line">  <span class="ayy-token-punctuation">)</span><span class="ayy-token-punctuation">;</span></span>
<span class="ayy-code-block__line"><span class="ayy-token-punctuation">}</span></span></code></pre>
  <!-- The code for each language in the selector: <ayy-menu> swaps it in (and the file name) when one is chosen. -->
  <template data-language="tsx" data-filename="example.tsx">import { useState } from "react";
import { Button } from "@danitesler/ayywi/react";

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    &lt;Button size="sm" onClick={() =&gt; setCount(count + 1)}&gt;
      Count: {count}
    &lt;/Button&gt;
  );
}</template>
  <template data-language="html" data-filename="example.html">&lt;!-- Notification card --&gt;
&lt;div class="ayy-card" role="region" aria-label="Announcement"&gt;
  &lt;div class="ayy-card__header"&gt;
    &lt;h3 class="ayy-h3"&gt;Release 2.0&lt;/h3&gt;
  &lt;/div&gt;
  &lt;p class="ayy-muted"&gt;Zero runtime dependencies.&lt;/p&gt;
&lt;/div&gt;</template>
  <template data-language="css" data-filename="example.css">/* Button primary state */
.ayy-button--primary {
  display: inline-flex;
  align-items: center;
  padding-inline: var(--ayy-space-4);
  background-color: var(--ayy-color-primary);
  color: var(--ayy-color-primary-fg);
  font-weight: var(--ayy-weight-medium);
}</template>
  <template data-language="json" data-filename="example.json">{
  "name": "@danitesler/ayywi",
  "version": "0.1.0",
  "private": false,
  "features": ["tokens", "elements", "highlighter"],
  "license": "MIT"
}</template>
  <template data-language="md" data-filename="example.md"># Design System

A **framework-agnostic** design system driven by tokens.

- Zero dependencies
- Logical properties only
- WCAG AA contrast

See [documentation](https://ayywi.com) for setup.</template>
  <template data-language="bash" data-filename="example.sh">#!/bin/bash
# Install ayywi design system
pnpm add "@danitesler/ayywi"

# Start the interactive component preview
pnpm preview --port 5173</template>
  <template data-language="python" data-filename="example.py"># Theme configuration
from dataclasses import dataclass
from typing import Optional

@dataclass
class ThemeConfig:
    name: str = "dark"
    contrast: bool = True

    def get_theme(self) -&gt; str:
        return f"{self.name}-contrast" if self.contrast else self.name</template>
  <template data-language="sql" data-filename="example.sql">-- Query active users with role
SELECT id, username, email, created_at
FROM users
WHERE status = 'active' AND role IN ('admin', 'editor')
ORDER BY created_at DESC
LIMIT 50;</template>
  <template data-language="yaml" data-filename="example.yaml"># CI verification workflow
name: CI
on:
  push:
    branches: [main]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm check</template>
  <template data-language="graphql" data-filename="example.graphql"># Fetch user profile and repositories
query GetUserProfile($login: String!) {
  user(login: $login) {
    id
    name
    bio
    repositories(first: 10) {
      nodes {
        name
        stargazerCount
      }
    }
  }
}</template>
  <template data-language="dockerfile" data-filename="Dockerfile"># Production container
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

EXPOSE 3000
CMD ["node", "dist/server.js"]</template>
  <template data-language="toml" data-filename="example.toml">[package]
name = "ayywi"
version = "0.1.0"
edition = "2021"

[dependencies]
serde = { version = "1.0", features = ["derive"] }</template>
  <template data-language="rust" data-filename="example.rs">// Token parser implementation
#[derive(Debug, Clone)]
pub struct Token {
    pub kind: String,
    pub text: String,
}

pub fn parse_input(source: &amp;str) -&gt; Vec&lt;Token&gt; {
    vec![Token { kind: "ident".into(), text: source.to_string() }]
}</template>
  <template data-language="go" data-filename="example.go">package main

import (
	"fmt"
	"net/http"
)

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "status: ok")
}</template>
</div>
```

React:

```tsx
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
```

---
Part of @danitesler/ayywi 0.1.2: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
