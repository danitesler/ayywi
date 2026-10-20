import test from "node:test";
import assert from "node:assert/strict";
import {
  highlightCode,
  tokenizeCode,
  codeBlockSelectorClass,
  codeBlockChevronClass,
  codeBlockMenuClass,
  codeBlockActionsClass,
  SUPPORTED_LANGUAGES,
  LANGUAGE_SNIPPETS,
  tokenKeywordClass,
  tokenStringClass,
  tokenCommentClass,
  tokenFunctionClass,
  tokenNumberClass,
  tokenOperatorClass,
  tokenTagClass,
  tokenAttributeClass,
  tokenPropertyClass,
  tokenPunctuationClass,
  tokenBooleanClass,
  syncCodeBlockSelector,
} from "../../dist/index.js";

test("token classes are exported with standard ayy-token prefixes", () => {
  assert.equal(tokenKeywordClass, "ayy-token-keyword");
  assert.equal(tokenStringClass, "ayy-token-string");
  assert.equal(tokenCommentClass, "ayy-token-comment");
  assert.equal(tokenFunctionClass, "ayy-token-function");
  assert.equal(tokenNumberClass, "ayy-token-number");
  assert.equal(tokenOperatorClass, "ayy-token-operator");
  assert.equal(tokenTagClass, "ayy-token-tag");
  assert.equal(tokenAttributeClass, "ayy-token-attribute");
  assert.equal(tokenPropertyClass, "ayy-token-property");
  assert.equal(tokenPunctuationClass, "ayy-token-punctuation");
  assert.equal(tokenBooleanClass, "ayy-token-boolean");
});

test("highlightCode escapes HTML entities safely", () => {
  const result = highlightCode("<script>alert('xss')</script>", "html");
  assert.doesNotMatch(result, /<script>/);
  assert.match(result, /&lt;/);
  assert.match(result, /&gt;/);
});

test("highlightCode highlights HTML markup: tags, attributes, strings, comments", () => {
  const html = `<!-- comment --><div class="ayy-card" id="main">Text</div>`;
  const highlighted = highlightCode(html, "html");
  assert.match(highlighted, /class="ayy-token-comment">&lt;!-- comment --&gt;<\/span>/);
  assert.match(highlighted, /class="ayy-token-tag">&lt;div<\/span>/);
  assert.match(highlighted, /class="ayy-token-attribute">class<\/span>/);
  assert.match(highlighted, /class="ayy-token-string">&quot;ayy-card&quot;<\/span>/);
  assert.match(highlighted, /class="ayy-token-tag">&lt;\/div&gt;<\/span>/);
});

test("highlightCode highlights React / TSX: imports, keywords, JSX tags, attributes, strings", () => {
  const tsx = `import React from "react";
// comment
export function App() {
  return <Button size="sm" numbered={true}>Click</Button>;
}`;
  const highlighted = highlightCode(tsx, "tsx");
  assert.match(highlighted, /class="ayy-token-keyword">import<\/span>/);
  assert.match(highlighted, /class="ayy-token-string">&quot;react&quot;<\/span>/);
  assert.match(highlighted, /class="ayy-token-comment">\/\/ comment<\/span>/);
  assert.match(highlighted, /class="ayy-token-keyword">export<\/span>/);
  assert.match(highlighted, /class="ayy-token-keyword">function<\/span>/);
  assert.match(highlighted, /class="ayy-token-function">App<\/span>/);
  assert.match(highlighted, /class="ayy-token-tag">&lt;Button<\/span>/);
  assert.match(highlighted, /class="ayy-token-attribute">size<\/span>/);
  assert.match(highlighted, /class="ayy-token-boolean">true<\/span>/);
});

test("highlightCode highlights CSS / SCSS: properties, units, selectors", () => {
  const css = `/* layout */
.ayy-button {
  display: flex;
  padding: 10px;
  color: var(--ayy-color-text);
}`;
  const highlighted = highlightCode(css, "css");
  assert.match(highlighted, /class="ayy-token-comment">\/\* layout \*\/<\/span>/);
  assert.match(highlighted, /class="ayy-token-property">display<\/span>/);
  assert.match(highlighted, /class="ayy-token-number">10px<\/span>/);
  assert.match(highlighted, /class="ayy-token-function">var<\/span>/);
});

test("highlightCode highlights JSON: keys, strings, numbers, booleans", () => {
  const json = `{
  "name": "ayywi",
  "count": 42,
  "active": false
}`;
  const highlighted = highlightCode(json, "json");
  assert.match(highlighted, /class="ayy-token-property">&quot;name&quot;<\/span>/);
  assert.match(highlighted, /class="ayy-token-string">&quot;ayywi&quot;<\/span>/);
  assert.match(highlighted, /class="ayy-token-number">42<\/span>/);
  assert.match(highlighted, /class="ayy-token-boolean">false<\/span>/);
});

test("highlightCode highlights Markdown (.md, .markdown): headings, code fences, inline code, bold, links", () => {
  const md = `# Heading 1
Here is **bold** text, \`code\`, and [link](https://example.com).
\`\`\`ts
const x = 1;
\`\`\``;
  const highlighted = highlightCode(md, "md");
  assert.match(highlighted, /class="ayy-token-keyword"># Heading 1<\/span>/);
  assert.match(highlighted, /class="ayy-token-keyword">\*\*bold\*\*<\/span>/);
  assert.match(highlighted, /class="ayy-token-string">`code`<\/span>/);
  assert.match(highlighted, /class="ayy-token-string">\[link\]\(https:\/\/example\.com\)<\/span>/);
});

test("highlightCode highlights Shell / Bash: commands, comments, flags, strings", () => {
  const sh = `#!/bin/bash
# install
pnpm install --save-dev "@danitesler/ayywi"`;
  const highlighted = highlightCode(sh, "bash");
  assert.match(highlighted, /class="ayy-token-comment"># install<\/span>/);
  assert.match(highlighted, /class="ayy-token-keyword">pnpm<\/span>/);
  assert.match(highlighted, /class="ayy-token-operator">--save-dev<\/span>/);
});

test("highlightCode highlights Python: keywords, strings, comments, numbers", () => {
  const py = `# Python script
def greet(name: str):
    return f"Hello {name}"
`;
  const highlighted = highlightCode(py, "py");
  assert.match(highlighted, /class="ayy-token-comment"># Python script<\/span>/);
  assert.match(highlighted, /class="ayy-token-keyword">def<\/span>/);
  assert.match(highlighted, /class="ayy-token-function">greet<\/span>/);
  assert.match(highlighted, /class="ayy-token-keyword">return<\/span>/);
});

test("highlightCode highlights SQL: keywords, strings, comments", () => {
  const sql = `-- select query
SELECT id, name FROM users WHERE active = 1;`;
  const highlighted = highlightCode(sql, "sql");
  assert.match(highlighted, /class="ayy-token-comment">-- select query<\/span>/);
  assert.match(highlighted, /class="ayy-token-keyword">SELECT<\/span>/);
  assert.match(highlighted, /class="ayy-token-keyword">FROM<\/span>/);
  assert.match(highlighted, /class="ayy-token-keyword">WHERE<\/span>/);
});

test("highlightCode handles language aliases and fallbacks gracefully", () => {
  // Alias mapping
  const jsAliased = highlightCode(`const a = "test";`, "javascript");
  const jsShort = highlightCode(`const a = "test";`, "js");
  assert.equal(jsAliased, jsShort);

  // Unknown language fallback
  const fallback = highlightCode(`/* comment */ "hello" 123`, "unknown-lang");
  assert.match(fallback, /class="ayy-token-comment"/);
  assert.match(fallback, /class="ayy-token-string"/);
  assert.match(fallback, /class="ayy-token-number"/);
});

test("tokenizeCode returns token objects", () => {
  const tokens = tokenizeCode(`const x = 10;`, "ts");
  assert(Array.isArray(tokens));
  assert(tokens.some((t) => t.type === "keyword" && t.value === "const"));
  assert(tokens.some((t) => t.type === "number" && t.value === "10"));
});

test("codeBlockSelectorClass, codeBlockChevronClass, and codeBlockMenuClass produce correct classes", () => {
  assert.equal(codeBlockSelectorClass(), "ayy-code-block__selector");
  assert.equal(codeBlockSelectorClass("custom"), "ayy-code-block__selector custom");
  assert.equal(codeBlockChevronClass(), "ayy-code-block__chevron");
  assert.equal(codeBlockChevronClass("custom"), "ayy-code-block__chevron custom");
  assert.equal(codeBlockMenuClass(), "ayy-code-block__menu");
  assert.equal(codeBlockMenuClass("custom"), "ayy-code-block__menu custom");
  assert.equal(codeBlockActionsClass(), "ayy-code-block__actions");
});

test("SUPPORTED_LANGUAGES and LANGUAGE_SNIPPETS cover all common languages with color formatting", () => {
  assert(Array.isArray(SUPPORTED_LANGUAGES));
  assert(SUPPORTED_LANGUAGES.length >= 14);

  for (const lang of SUPPORTED_LANGUAGES) {
    assert(lang.id, "language must have id");
    assert(lang.label, "language must have label");
    const snippet = LANGUAGE_SNIPPETS[lang.id];
    assert(snippet, `language ${lang.id} must have a sample snippet`);
    const highlighted = highlightCode(snippet, lang.id);
    assert.match(highlighted, /class="ayy-token-/, `snippet for ${lang.id} must have syntax tokens`);
  }
});

// A code block stand-in: its file name, its code, and the <template data-language> blocks it carries.
function fakeCodeBlock(templates) {
  const container = {
    querySelector(selector) {
      if (selector === ".ayy-code-block__filename") return this.filename;
      if (selector === ".ayy-code-block__code, code") return this.code;
      return null;
    },
    querySelectorAll(selector) {
      return selector === "template[data-language]" ? templates : [];
    },
    filename: { textContent: "install.sh" },
    code: { dataset: { language: "bash" }, innerHTML: "pip install my-package" },
  };
  const select = {
    value: "python",
    closest(selector) {
      return selector === ".ayy-code-block" ? container : null;
    },
  };
  return { container, select };
}

test("syncCodeBlockSelector switches to the block's own template: file name, language and highlighted code", () => {
  const python = { dataset: { language: "python", filename: "install.py" }, content: { textContent: "import my_package\nprint(True)" } };
  const { container, select } = fakeCodeBlock([python]);
  syncCodeBlockSelector(select);
  assert.equal(container.filename.textContent, "install.py");
  assert.equal(container.code.dataset.language, "python");
  assert.match(container.code.innerHTML, /class="ayy-token-keyword">import</);
  assert.match(container.code.innerHTML, /my_package/);
});

test("syncCodeBlockSelector never puts ayywi's sample code in a block that has no template for the language", () => {
  const { container, select } = fakeCodeBlock([]);
  syncCodeBlockSelector(select);
  assert.equal(container.filename.textContent, "install.sh");
  assert.equal(container.code.dataset.language, "bash");
  assert.equal(container.code.innerHTML, "pip install my-package");
});

