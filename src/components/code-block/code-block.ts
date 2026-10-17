import { cx } from "../../lib/cx";
import { Copy01Icon, Tick02Icon } from "../../lib/icons";
import { iconSvg } from "../icon/icon";

export interface CodeBlockClassOptions {
  /** Line numbers using CSS counters. */
  numbered?: boolean;
  className?: string;
}

export function codeBlockClass({ numbered, className }: CodeBlockClassOptions = {}): string {
  return cx("ayy-code-block", numbered && "ayy-code-block--numbered", className);
}

export type ClassOptionsOrString = string | { className?: string };

function toClassName(options?: ClassOptionsOrString): string | undefined {
  if (typeof options === "string") return options;
  return options?.className;
}

export function codeBlockHeaderClass(options?: ClassOptionsOrString): string {
  return cx("ayy-code-block__header", toClassName(options));
}

export function codeBlockFilenameClass(options?: ClassOptionsOrString): string {
  return cx("ayy-code-block__filename", toClassName(options));
}

export function codeBlockActionsClass(options?: ClassOptionsOrString): string {
  return cx("ayy-code-block__actions", toClassName(options));
}

export function codeBlockSelectorClass(options?: ClassOptionsOrString): string {
  return cx("ayy-code-block__selector", toClassName(options));
}

export function codeBlockChevronClass(options?: ClassOptionsOrString): string {
  return cx("ayy-code-block__chevron", toClassName(options));
}

export function codeBlockMenuClass(options?: ClassOptionsOrString): string {
  return cx("ayy-code-block__menu", toClassName(options));
}

export function codeBlockCopyClass(options?: ClassOptionsOrString): string {
  return cx("ayy-code-block__copy", toClassName(options));
}

export function codeBlockPreClass(options?: ClassOptionsOrString): string {
  return cx("ayy-code-block__pre", toClassName(options));
}

export function codeBlockCodeClass(options?: ClassOptionsOrString): string {
  return cx("ayy-code-block__code", toClassName(options));
}

export const tokenKeywordClass = "ayy-token-keyword";
export const tokenStringClass = "ayy-token-string";
export const tokenCommentClass = "ayy-token-comment";
export const tokenFunctionClass = "ayy-token-function";
export const tokenNumberClass = "ayy-token-number";
export const tokenOperatorClass = "ayy-token-operator";
export const tokenTagClass = "ayy-token-tag";
export const tokenAttributeClass = "ayy-token-attribute";
export const tokenPropertyClass = "ayy-token-property";
export const tokenPunctuationClass = "ayy-token-punctuation";
export const tokenBooleanClass = "ayy-token-boolean";

export const codeBlockCopyIcon = /* @__PURE__ */ iconSvg(Copy01Icon);
export const codeBlockCheckIcon = /* @__PURE__ */ iconSvg(Tick02Icon);

const copyTimers = new WeakMap<Element, ReturnType<typeof setTimeout>>();

/** Copy the code inside a .ayy-code-block from its .ayy-code-block__copy button, showing the copied state for `timeout` ms. */
export async function copyCodeBlock(
  button: Element,
  {
    code,
    timeout = 2000,
    label,
    copiedLabel = "Copied!",
  }: { code?: string; timeout?: number; label?: string; copiedLabel?: string } = {},
): Promise<string | undefined> {
  const text =
    code ??
    button.getAttribute("data-code") ??
    button.closest(".ayy-code-block")?.querySelector(".ayy-code-block__code, code")?.textContent ??
    undefined;
  if (text === undefined) return undefined;
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    }
  } catch {
    // Clipboard access may fail in insecure contexts; still show visual feedback.
  }
  const initialLabel = label ?? button.getAttribute("data-label") ?? button.getAttribute("aria-label") ?? "Copy code";
  button.setAttribute("data-label", initialLabel);
  button.setAttribute("data-copied", "true");
  button.setAttribute("aria-label", copiedLabel);
  button.innerHTML = codeBlockCheckIcon;
  const prev = copyTimers.get(button);
  if (prev) clearTimeout(prev);
  copyTimers.set(
    button,
    setTimeout(() => {
      button.removeAttribute("data-copied");
      button.setAttribute("aria-label", initialLabel);
      button.innerHTML = codeBlockCopyIcon;
      copyTimers.delete(button);
    }, timeout),
  );
  return text;
}

// ---------------------------------------------------------------------------
// Syntax Tokenizer & Language Mapping
// ---------------------------------------------------------------------------

export type TokenType =
  | "keyword"
  | "string"
  | "comment"
  | "function"
  | "number"
  | "operator"
  | "tag"
  | "attribute"
  | "property"
  | "punctuation"
  | "boolean"
  | "text";

export interface CodeToken {
  type: TokenType;
  value: string;
}

export interface LanguagePreset {
  id: string;
  label: string;
  extension?: string;
}

export const SUPPORTED_LANGUAGES: LanguagePreset[] = [
  { id: "tsx", label: "React (TSX)", extension: ".tsx" },
  { id: "html", label: "HTML", extension: ".html" },
  { id: "css", label: "CSS", extension: ".css" },
  { id: "json", label: "JSON", extension: ".json" },
  { id: "markdown", label: "Markdown", extension: ".md" },
  { id: "bash", label: "Bash / Shell", extension: ".sh" },
  { id: "python", label: "Python", extension: ".py" },
  { id: "sql", label: "SQL", extension: ".sql" },
  { id: "yaml", label: "YAML", extension: ".yaml" },
  { id: "graphql", label: "GraphQL", extension: ".graphql" },
  { id: "dockerfile", label: "Dockerfile", extension: "Dockerfile" },
  { id: "toml", label: "TOML", extension: ".toml" },
  { id: "rust", label: "Rust", extension: ".rs" },
  { id: "go", label: "Go", extension: ".go" },
];

export const LANGUAGE_SNIPPETS: Record<string, string> = {
  tsx: `import { useState } from "react";
import { Button } from "@danitesler/ayywi/react";

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    <Button size="sm" onClick={() => setCount(count + 1)}>
      Count: {count}
    </Button>
  );
}`,
  html: `<!-- Notification card -->
<div class="ayy-card" role="region" aria-label="Announcement">
  <div class="ayy-card__header">
    <h3 class="ayy-h3">Release 2.0</h3>
  </div>
  <p class="ayy-text-muted">Zero runtime dependencies.</p>
</div>`,
  css: `/* Button primary state */
.ayy-button--primary {
  display: inline-flex;
  align-items: center;
  padding-inline: var(--ayy-space-4);
  background-color: var(--ayy-color-primary);
  color: var(--ayy-color-primary-fg);
  font-weight: var(--ayy-weight-medium);
}`,
  json: `{
  "name": "@danitesler/ayywi",
  "version": "0.1.0",
  "private": false,
  "features": ["tokens", "elements", "highlighter"],
  "license": "MIT"
}`,
  markdown: `# Design System

A **framework-agnostic** design system driven by tokens.

- Zero dependencies
- Logical properties only
- WCAG AA contrast

See [documentation](https://ayywi.com) for setup.`,
  bash: `#!/bin/bash
# Install ayywi design system
pnpm add "@danitesler/ayywi"

# Start the interactive component preview
pnpm preview --port 5173`,
  python: `# Theme configuration
from dataclasses import dataclass
from typing import Optional

@dataclass
class ThemeConfig:
    name: str = "dark"
    contrast: bool = True

    def get_theme(self) -> str:
        return f"{self.name}-contrast" if self.contrast else self.name`,
  sql: `-- Query active users with role
SELECT id, username, email, created_at
FROM users
WHERE status = 'active' AND role IN ('admin', 'editor')
ORDER BY created_at DESC
LIMIT 50;`,
  yaml: `# CI verification workflow
name: CI
on:
  push:
    branches: [main]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm check`,
  graphql: `# Fetch user profile and repositories
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
}`,
  dockerfile: `# Production container
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

EXPOSE 3000
CMD ["node", "dist/server.js"]`,
  toml: `[package]
name = "ayywi"
version = "0.1.0"
edition = "2021"

[dependencies]
serde = { version = "1.0", features = ["derive"] }`,
  rust: `// Token parser implementation
#[derive(Debug, Clone)]
pub struct Token {
    pub kind: String,
    pub text: String,
}

pub fn parse_input(source: &str) -> Vec<Token> {
    vec![Token { kind: "ident".into(), text: source.to_string() }]
}`,
  go: `package main

import (
	"fmt"
	"net/http"
)

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "status: ok")
}`,
};

LANGUAGE_SNIPPETS.js = LANGUAGE_SNIPPETS.tsx;
LANGUAGE_SNIPPETS.ts = LANGUAGE_SNIPPETS.tsx;
LANGUAGE_SNIPPETS.jsx = LANGUAGE_SNIPPETS.tsx;
LANGUAGE_SNIPPETS.sh = LANGUAGE_SNIPPETS.bash;
LANGUAGE_SNIPPETS.md = LANGUAGE_SNIPPETS.markdown;
LANGUAGE_SNIPPETS.py = LANGUAGE_SNIPPETS.python;
LANGUAGE_SNIPPETS.yml = LANGUAGE_SNIPPETS.yaml;
LANGUAGE_SNIPPETS.rs = LANGUAGE_SNIPPETS.rust;


const TOKEN_CLASSES: Record<TokenType, string | undefined> = {
  keyword: tokenKeywordClass,
  string: tokenStringClass,
  comment: tokenCommentClass,
  function: tokenFunctionClass,
  number: tokenNumberClass,
  operator: tokenOperatorClass,
  tag: tokenTagClass,
  attribute: tokenAttributeClass,
  property: tokenPropertyClass,
  punctuation: tokenPunctuationClass,
  boolean: tokenBooleanClass,
  text: undefined,
};

interface Rule {
  type: TokenType;
  pattern: string;
}

interface LanguageDef {
  rules: Rule[];
  caseInsensitive?: boolean;
}

const ALIASES: Record<string, string> = {
  js: "javascript",
  javascript: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  ts: "typescript",
  typescript: "typescript",
  mts: "typescript",
  cts: "typescript",
  jsx: "jsx",
  tsx: "tsx",
  html: "html",
  htm: "html",
  xml: "xml",
  svg: "xml",
  css: "css",
  scss: "scss",
  sass: "scss",
  less: "css",
  json: "json",
  json5: "json",
  md: "markdown",
  markdown: "markdown",
  mdx: "markdown",
  sh: "bash",
  bash: "bash",
  zsh: "bash",
  shell: "bash",
  yaml: "yaml",
  yml: "yaml",
  toml: "toml",
  ini: "toml",
  env: "toml",
  dotenv: "toml",
  py: "python",
  python: "python",
  rs: "rust",
  rust: "rust",
  go: "go",
  golang: "go",
  sql: "sql",
  graphql: "graphql",
  gql: "graphql",
  docker: "dockerfile",
  dockerfile: "dockerfile",
  c: "c",
  cpp: "cpp",
  "c++": "cpp",
  h: "c",
  hpp: "cpp",
  cs: "csharp",
  csharp: "csharp",
  java: "java",
  kt: "kotlin",
  kotlin: "kotlin",
  swift: "swift",
  php: "php",
  rb: "ruby",
  ruby: "ruby",
};

/** Normalize language name or extension into its canonical identifier. */
export function normalizeLanguage(lang?: string): string {
  if (!lang) return "fallback";
  const clean = lang.trim().toLowerCase().replace(/^[.]+/, "");
  return ALIASES[clean] ?? "fallback";
}

// Language rule definitions
const JS_RULES: Rule[] = [
  { type: "comment", pattern: "\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/" },
  { type: "string", pattern: `"(?:\\\\.|[^"\\\\])*"|'(?:\\\\.|[^'\\\\])*'|\`(?:\\\\.|[^\`\\\\])*\`` },
  { type: "tag", pattern: "<\\/[A-Za-z0-9_.:-]+>|<[A-Za-z0-9_.:-]+|\\/>" },
  { type: "attribute", pattern: "\\b[A-Za-z0-9_:-]+(?=\\s*=)" },
  {
    type: "keyword",
    pattern:
      "\\b(?:import|export|from|as|default|function|const|let|var|return|if|else|switch|case|break|continue|for|while|do|try|catch|finally|throw|new|typeof|instanceof|void|delete|in|of|yield|await|async|class|extends|super|this|interface|type|enum|implements|package|private|protected|public|static|readonly|abstract|declare|namespace)\\b",
  },
  { type: "boolean", pattern: "\\b(?:true|false|null|undefined|NaN|Infinity)\\b" },
  { type: "number", pattern: "\\b0x[0-9a-fA-F]+\\b|\\b\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?\\b" },
  { type: "function", pattern: "\\b[a-zA-Z_$][a-zA-Z0-9_$]*(?=\\s*\\()" },
  { type: "operator", pattern: "=>|===|!==|==|!=|<=|>=|&&|\\|\\||\\+\\+|--|[+\\-*/%=&|^!~?:]" },
  { type: "punctuation", pattern: "[{}()\\[\\],;.]" },
];

const HTML_RULES: Rule[] = [
  { type: "comment", pattern: "<!--[\\s\\S]*?-->" },
  { type: "keyword", pattern: "<!DOCTYPE[^>]*>|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>" },
  { type: "tag", pattern: "<\\/[a-zA-Z0-9:-]+>|<[a-zA-Z0-9:-]+|\\/?>" },
  { type: "attribute", pattern: "\\b[a-zA-Z0-9_:-]+(?=\\s*=)" },
  { type: "string", pattern: `"(?:\\\\.|[^"\\\\])*"|'(?:\\\\.|[^'\\\\])*'` },
  { type: "operator", pattern: "[=]" },
];

const CSS_RULES: Rule[] = [
  { type: "comment", pattern: "\\/\\*[\\s\\S]*?\\*\\/|\\/\\/[^\\n]*" },
  { type: "string", pattern: `"(?:\\\\.|[^"\\\\])*"|'(?:\\\\.|[^'\\\\])*'` },
  { type: "keyword", pattern: "@[a-zA-Z-]+" },
  {
    type: "function",
    pattern: "\\b(?:var|calc|rgb|rgba|hsl|hsla|url|linear-gradient|radial-gradient|min|max|clamp)(?=\\s*\\()|::?[a-zA-Z-]+",
  },
  { type: "property", pattern: "\\b[a-zA-Z-]+(?=\\s*:)" },
  { type: "number", pattern: "#[0-9a-fA-F]{3,8}\\b|\\b\\d+(?:\\.\\d+)?(?:px|rem|em|%|vh|vw|ms|s|deg|fr)?\\b" },
  { type: "operator", pattern: "!important|[>+~*]" },
  { type: "punctuation", pattern: "[{}();,:]" },
];

const JSON_RULES: Rule[] = [
  { type: "property", pattern: `"(?:\\\\.|[^"\\\\])*"(?=\\s*:)` },
  { type: "string", pattern: `"(?:\\\\.|[^"\\\\])*"` },
  { type: "number", pattern: "-?\\b\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?\\b" },
  { type: "boolean", pattern: "\\b(?:true|false|null)\\b" },
  { type: "punctuation", pattern: "[{}()\\[\\],:]" },
];

const MARKDOWN_RULES: Rule[] = [
  { type: "string", pattern: "```[\\s\\S]*?```|`[^`\\n]+`|\\[[^\\]\\n]+\\]\\([^)\\n]+\\)" },
  { type: "keyword", pattern: "^#{1,6}\\s+[^\\n]*|\\*\\*[^*\\n]+\\*\\*|__[^_\\n]+__" },
  { type: "comment", pattern: "^>[^\\n]*" },
  { type: "attribute", pattern: "\\*[^*\\n]+\\*|_[^_\\n]+_" },
  { type: "operator", pattern: "^[\\t ]*(?:[-*+]|\\d+\\.)\\s+" },
];

const BASH_RULES: Rule[] = [
  { type: "comment", pattern: "#[^\\n]*" },
  { type: "string", pattern: `"(?:\\\\.|[^"\\\\])*"|'(?:\\\\.|[^'\\\\])*'` },
  { type: "attribute", pattern: "\\$[a-zA-Z0-9_]+|\\$\\{[^}]+\\}" },
  { type: "operator", pattern: "--?[a-zA-Z0-9_-]+|[|&;><=]" },
  {
    type: "keyword",
    pattern:
      "\\b(?:npm|pnpm|npx|yarn|bun|git|cd|ls|mkdir|rm|cp|mv|cat|grep|echo|exit|export|source|sudo|curl|chmod|chown|if|then|else|elif|fi|for|while|in|do|done|case|esac|function)\\b",
  },
  { type: "number", pattern: "\\b\\d+\\b" },
];

const PYTHON_RULES: Rule[] = [
  { type: "comment", pattern: "#[^\\n]*" },
  { type: "string", pattern: `"""[\\s\\S]*?"""|'''[\\s\\S]*?'''|"(?:\\\\.|[^"\\\\])*"|'(?:\\\\.|[^'\\\\])*'` },
  { type: "function", pattern: "@[a-zA-Z0-9_.]+|\\b[a-zA-Z_][a-zA-Z0-9_]*(?=\\s*\\()" },
  {
    type: "keyword",
    pattern:
      "\\b(?:def|class|import|from|return|if|elif|else|while|for|in|try|except|finally|raise|with|as|pass|break|continue|lambda|yield|async|await|global|nonlocal|assert|del|is|not|and|or)\\b",
  },
  { type: "boolean", pattern: "\\b(?:True|False|None)\\b" },
  { type: "number", pattern: "\\b0x[0-9a-fA-F]+\\b|\\b\\d+(?:\\.\\d+)?\\b" },
  { type: "operator", pattern: "[+\\-*/%=&|^!~<>:]" },
];

const SQL_RULES: Rule[] = [
  { type: "comment", pattern: "--[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/" },
  { type: "string", pattern: `'(?:''|[^'])*'` },
  {
    type: "keyword",
    pattern:
      "\\b(?:SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|JOIN|LEFT|RIGHT|INNER|OUTER|CROSS|ON|GROUP\\s+BY|ORDER\\s+BY|HAVING|LIMIT|OFFSET|UNION|ALL|CREATE|TABLE|DROP|ALTER|ADD|COLUMN|PRIMARY\\s+KEY|FOREIGN\\s+KEY|REFERENCES|INDEX|VIEW|TRIGGER|CASE|WHEN|THEN|ELSE|END|AS|AND|OR|NOT|IN|IS|NULL|LIKE|BETWEEN|EXISTS|COUNT|SUM|AVG|MIN|MAX|DISTINCT|BY|ASC|DESC)\\b",
  },
  { type: "number", pattern: "\\b\\d+(?:\\.\\d+)?\\b" },
  { type: "operator", pattern: "[=<>!+\\-*/%]" },
  { type: "punctuation", pattern: "[(),;.]" },
];

const YAML_RULES: Rule[] = [
  { type: "comment", pattern: "#[^\\n]*" },
  { type: "property", pattern: "^[ \\t]*[a-zA-Z0-9_.-]+(?=\\s*:)" },
  { type: "string", pattern: `"(?:\\\\.|[^"\\\\])*"|'(?:\\\\.|[^'\\\\])*'` },
  { type: "boolean", pattern: "\\b(?:true|false|yes|no|null)\\b" },
  { type: "number", pattern: "\\b\\d+(?:\\.\\d+)?\\b" },
  { type: "punctuation", pattern: "[\\[\\]{},:]" },
];

const GRAPHQL_RULES: Rule[] = [
  { type: "comment", pattern: "#[^\\n]*" },
  {
    type: "keyword",
    pattern: "\\b(?:query|mutation|subscription|fragment|on|type|input|interface|union|enum|scalar|schema|implements|directive)\\b",
  },
  { type: "attribute", pattern: "\\$[a-zA-Z0-9_]+" },
  { type: "string", pattern: `"(?:\\\\.|[^"\\\\])*"` },
  { type: "boolean", pattern: "\\b(?:true|false|null)\\b" },
  { type: "number", pattern: "\\b\\d+(?:\\.\\d+)?\\b" },
  { type: "punctuation", pattern: "[{}()\\[\\]!:=]" },
];

const DOCKERFILE_RULES: Rule[] = [
  { type: "comment", pattern: "#[^\\n]*" },
  {
    type: "keyword",
    pattern: "\\b(?:FROM|RUN|CMD|LABEL|MAINTAINER|EXPOSE|ENV|ADD|COPY|ENTRYPOINT|VOLUME|USER|WORKDIR|ARG|ONBUILD|STOPSIGNAL|HEALTHCHECK|SHELL)\\b",
  },
  { type: "attribute", pattern: "\\$[a-zA-Z0-9_]+|\\$\\{[^}]+\\}" },
  { type: "string", pattern: `"(?:\\\\.|[^"\\\\])*"|'(?:\\\\.|[^'\\\\])*'` },
];

const TOML_RULES: Rule[] = [
  { type: "comment", pattern: "[#;][^\\n]*" },
  { type: "keyword", pattern: "^\\s*\\[[^\\]\\n]+\\]" },
  { type: "property", pattern: "^\\s*[a-zA-Z0-9_.-]+(?=\\s*=)" },
  { type: "string", pattern: `"(?:\\\\.|[^"\\\\])*"|'(?:\\\\.|[^'\\\\])*'` },
  { type: "boolean", pattern: "\\b(?:true|false)\\b" },
  { type: "number", pattern: "\\b\\d+(?:\\.\\d+)?\\b" },
];

const RUST_RULES: Rule[] = [
  { type: "comment", pattern: "\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/" },
  { type: "string", pattern: `r#"(?:[\\s\\S]*?)"#|"(?:\\\\.|[^"\\\\])*"` },
  {
    type: "keyword",
    pattern:
      "\\b(?:fn|let|mut|const|static|struct|enum|trait|impl|type|where|pub|crate|super|self|Self|mod|use|as|if|else|match|while|loop|for|in|return|break|continue|unsafe|async|await|dyn|ref|move)\\b",
  },
  { type: "boolean", pattern: "\\b(?:true|false)\\b" },
  {
    type: "number",
    pattern:
      "\\b\\d+(?:_\\d+)*(?:\\.\\d+(?:_\\d+)*)?(?:[eE][+-]?\\d+)?(?:u8|u16|u32|u64|u128|usize|i8|i16|i32|i64|i128|isize|f32|f64)?\\b",
  },
  { type: "function", pattern: "\\b[a-zA-Z_][a-zA-Z0-9_]*!|\\b[a-zA-Z_][a-zA-Z0-9_]*(?=\\s*\\()" },
  { type: "operator", pattern: "=>|->|::|[+\\-*/%=&|^!~<>:]" },
  { type: "punctuation", pattern: "[{}()\\[\\],;.]" },
];

const GO_RULES: Rule[] = [
  { type: "comment", pattern: "\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/" },
  { type: "string", pattern: `"(?:\\\\.|[^"\\\\])*"|\`[^\`]*\`` },
  {
    type: "keyword",
    pattern:
      "\\b(?:package|import|func|return|var|const|type|struct|interface|map|chan|go|defer|if|else|switch|case|default|for|range|break|continue|fallthrough|select)\\b",
  },
  { type: "boolean", pattern: "\\b(?:true|false|nil|iota)\\b" },
  { type: "number", pattern: "\\b\\d+(?:\\.\\d+)?\\b" },
  { type: "function", pattern: "\\b[a-zA-Z_][a-zA-Z0-9_]*(?=\\s*\\()" },
  { type: "operator", pattern: ":=|<-|==|!=|<=|>=|&&|\\|\\||[+\\-*/%=&|^!~<>:]" },
  { type: "punctuation", pattern: "[{}()\\[\\],;.]" },
];

const FALLBACK_RULES: Rule[] = [
  { type: "comment", pattern: "\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/|#[^\\n]*" },
  { type: "string", pattern: `"(?:\\\\.|[^"\\\\])*"|'(?:\\\\.|[^'\\\\])*'` },
  { type: "boolean", pattern: "\\b(?:true|false|null|nil|None)\\b" },
  { type: "number", pattern: "\\b\\d+(?:\\.\\d+)?\\b" },
  {
    type: "keyword",
    pattern: "\\b(?:function|def|class|import|export|return|if|else|for|while|const|let|var|val|pub|private)\\b",
  },
  { type: "function", pattern: "\\b[a-zA-Z_][a-zA-Z0-9_]*(?=\\s*\\()" },
];

const LANGUAGE_MAP: Record<string, LanguageDef> = {
  javascript: { rules: JS_RULES },
  typescript: { rules: JS_RULES },
  jsx: { rules: JS_RULES },
  tsx: { rules: JS_RULES },
  html: { rules: HTML_RULES },
  xml: { rules: HTML_RULES },
  css: { rules: CSS_RULES },
  scss: { rules: CSS_RULES },
  json: { rules: JSON_RULES },
  markdown: { rules: MARKDOWN_RULES },
  bash: { rules: BASH_RULES },
  python: { rules: PYTHON_RULES },
  sql: { rules: SQL_RULES, caseInsensitive: true },
  yaml: { rules: YAML_RULES },
  graphql: { rules: GRAPHQL_RULES },
  dockerfile: { rules: DOCKERFILE_RULES },
  toml: { rules: TOML_RULES },
  rust: { rules: RUST_RULES },
  go: { rules: GO_RULES },
  c: { rules: JS_RULES },
  cpp: { rules: JS_RULES },
  csharp: { rules: JS_RULES },
  java: { rules: JS_RULES },
  kotlin: { rules: JS_RULES },
  swift: { rules: JS_RULES },
  php: { rules: JS_RULES },
  ruby: { rules: PYTHON_RULES },
  fallback: { rules: FALLBACK_RULES },
};

const COMPILED_CACHE = new Map<string, { regex: RegExp; types: TokenType[] }>();

function getCompiledLanguage(canonical: string): { regex: RegExp; types: TokenType[] } {
  const cached = COMPILED_CACHE.get(canonical);
  if (cached) return cached;
  const def = LANGUAGE_MAP[canonical] ?? LANGUAGE_MAP.fallback;
  const flags = "gm" + (def.caseInsensitive ? "i" : "");
  const pattern = def.rules.map((r) => `(${r.pattern})`).join("|");
  const compiled = {
    regex: new RegExp(pattern, flags),
    types: def.rules.map((r) => r.type),
  };
  COMPILED_CACHE.set(canonical, compiled);
  return compiled;
}

/** Tokenize code into typed tokens for the specified language. */
export function tokenizeCode(code: string, language?: string): CodeToken[] {
  if (!code) return [];
  const canonical = normalizeLanguage(language);
  const { regex, types } = getCompiledLanguage(canonical);
  regex.lastIndex = 0;

  const tokens: CodeToken[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(code)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: "text", value: code.slice(lastIndex, match.index) });
    }
    for (let i = 0; i < types.length; i++) {
      if (match[i + 1] !== undefined) {
        tokens.push({ type: types[i], value: match[0] });
        break;
      }
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < code.length) {
    tokens.push({ type: "text", value: code.slice(lastIndex) });
  }

  return tokens;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Highlight a code string with .ayy-token-* span tags for the given language. */
export function highlightCode(code: string, language?: string): string {
  if (!code) return "";
  const tokens = tokenizeCode(code, language);
  return tokens
    .map((token) => {
      const cls = TOKEN_CLASSES[token.type];
      const escaped = escapeHtml(token.value);
      return cls ? `<span class="${cls}">${escaped}</span>` : escaped;
    })
    .join("");
}

/** Highlight all code elements with [data-language] inside .ayy-code-block under root. */
export function highlightCodeBlocks(root: ParentNode = document): void {
  if (typeof document === "undefined") return;
  for (const block of root.querySelectorAll<HTMLElement>(".ayy-code-block[data-language]")) {
    const lang = block.dataset.language;
    const codeEl = block.querySelector<HTMLElement>(".ayy-code-block__code, code");
    if (lang && codeEl && !codeEl.dataset.highlighted) {
      codeEl.dataset.highlighted = "true";
      codeEl.innerHTML = highlightCode(codeEl.textContent ?? "", lang);
    }
  }
  for (const codeEl of root.querySelectorAll<HTMLElement>(".ayy-code-block__code[data-language], code[data-language]")) {
    const lang = codeEl.dataset.language;
    if (lang && !codeEl.dataset.highlighted) {
      codeEl.dataset.highlighted = "true";
      codeEl.innerHTML = highlightCode(codeEl.textContent ?? "", lang);
    }
  }
}

/** Update a code block element based on its selector dropdown value. */
export function syncCodeBlockSelector(selectOrLang: HTMLElement | string, codeBlock?: HTMLElement): void {
  let lang: string;
  let container: HTMLElement | null = null;
  if (typeof selectOrLang === "string") {
    lang = selectOrLang;
    container = codeBlock ?? null;
  } else if ("value" in selectOrLang && typeof (selectOrLang as any).value === "string" && (selectOrLang as any).value) {
    lang = (selectOrLang as any).value;
    container = selectOrLang.closest(".ayy-code-block");
  } else {
    lang = selectOrLang.dataset.value ?? selectOrLang.textContent?.trim() ?? "";
    container = selectOrLang.closest(".ayy-code-block");
  }
  if (!container) return;
  const preset = SUPPORTED_LANGUAGES.find((l) => l.id === lang);
  const snippet = LANGUAGE_SNIPPETS[lang];
  if (preset) {
    const filenameEl = container.querySelector(".ayy-code-block__filename");
    if (filenameEl) {
      filenameEl.textContent = preset.extension?.startsWith(".")
        ? `example${preset.extension}`
        : preset.extension ?? `example.${preset.id}`;
    }
  }
  const codeEl = container.querySelector<HTMLElement>(".ayy-code-block__code, code");
  if (codeEl && snippet) {
    codeEl.dataset.language = lang;
    codeEl.dataset.highlighted = "true";
    codeEl.innerHTML = highlightCode(snippet, lang);
  }
}
