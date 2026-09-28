---
name: ayywi
description: Build and edit UI with the ayywi design system. Use whenever you create or change components, pages, forms, dialogs, tables or styles in a project that depends on ayywi, or when the user mentions ayywi, design tokens, theming, dark mode or RTL.
---

# Building UI with ayywi

ayywi is a CSS class contract (`.ayy-*`) plus design tokens (`--ayy-*`), with typed React components on top. The same markup works in React, Vue, Svelte, Angular, Astro, plain HTML and server templates.

## 1. Load the right context first

- If the `ayywi` MCP server is connected, use it: `list_components`, `get_component` (spec + copy-ready examples), `get_tokens`, `get_rules`, and `lint` to check what you wrote.
- Quick lookup: [reference.md](reference.md) — every component's classes, React props and a11y in one screen.
- Full detail for a component you're about to use: find its entry in `node_modules/ayywi/manifest/components.json` (or the matching section of `node_modules/ayywi/llms-full.txt`). It has variants, states, do/don't and copy-ready HTML + React examples. Start from an example rather than from scratch.
- Tokens: the `tokens` array in the same manifest (name, css var, dark + light values, purpose).

## 2. Pick the integration style the project already uses

| Project | Write |
|---|---|
| React / Next / Remix | `import { Button, Dialog, … } from "ayywi/react"` |
| Vue, Svelte, Solid, Angular, Lit | markup with `ayy-` classes (or `buttonClass()` from `"ayywi"`); `<ayy-tabs>`, `<ayy-dialog>`, `<ayy-popover>`, `<ayy-menu>`, `<ayy-tooltip>` from `"ayywi/elements"` for interactive parts; `toast()` from `"ayywi"` |
| Plain HTML, Rails, Django, Laravel, Go, .NET, PHP | same markup + `dist/elements.global.js` (also gives `window.ayywi.toast`) |
| Tailwind | keep ayywi components; use the preset utilities (`bg-surface`, `border-line`, `rounded-card`) for layout glue |

Check `package.json` and existing components before choosing. Match what's there.

## 3. Rules

1. Reuse ayywi components and their variants before writing custom CSS. Never add a second UI kit.
2. No hardcoded colours: `var(--ayy-color-*)`, the wash/line tokens, or `color-mix(in srgb, var(--ayy-color-text) N%, transparent)`.
3. Logical properties only (`margin-inline-start`, `padding-inline`, `inset-inline-end`, `text-align: start`). No `left`/`right`, no `:dir()`.
4. Spacing, radius, type, shadow and motion from tokens (`--ayy-space-*`, `--ayy-radius-*`, `--ayy-text-*`, `--ayy-shadow-*`, `--ayy-ease-*`, `--ayy-duration-*`).
5. No per-theme colour code. Tokens switch with `data-theme` (`dark`, `light`, `dark-soft`, `light-soft`) or the OS preference on their own. Same for `data-density` and `data-brand` — don't hand-size controls.
6. Accessibility is part of the component: labels for every control, `aria-label` on icon-only buttons, never remove focus rings, keep dialog titles.
7. State goes in native/ARIA attributes (`disabled`, `checked`, `aria-selected`, `aria-invalid`, `open`) — the CSS reads them.

## 4. When something is missing

Compose it from existing components and tokens in the app's own code, following the ayywi conventions (`ayy-`-style BEM naming is not required locally, but tokens are). If it's generic enough to belong in the system, say so and suggest adding it to ayywi.

## 5. Before you finish

- Run `npx ayywi lint <changed files>` (or the MCP `lint` tool) and fix every error. It catches invented classes, unknown tokens and variants, raw colours, `left/right` and unlabeled icon buttons.
- If the app has a theme switch, check the screen in both themes. If it supports RTL, check with `dir="rtl"`.
- Interactive pieces work by keyboard: Tab to reach, Enter/Space to activate, Esc closes dialogs and tooltips, arrows move between tabs.
