# Block editor: more block options Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use code-run-plan to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add callout colours, a highlight mark, a record link block and an equation block (with an app-supplied renderer) to the block editor.

**Architecture:** Each feature has the same five layers in `block-editor.ts`:
1. the value model: `BlockEditorBlock` fields, `blockEditorBlockTypes`, the `TYPES` table and `blockEditorNormalize`;
2. the DOM-free converters: `blockEditorFromMarkdown`, `blockEditorToMarkdown`, `blockEditorToHtml`, `blockEditorToText`, `blockEditorCleanHtml`;
3. rendering: `buildBlock`, `decorate` and `signature`;
4. input: the slash menu, `shortcut()`, the formatting toolbar and `actionItems`;
5. CSS and meta.

Each task does all five for one feature, so it ships whole.

**Tech Stack:** TypeScript, plain DOM, CSS tokens, node:test against `dist/`, Playwright e2e.

**Spec:** `docs/superpowers/specs/2026-10-27-block-editor-tables-and-blocks.md` (Part B)

## Global Constraints

- Work on a branch, after the table-editing plan's branch or a sibling of it. This plan doesn't depend on that plan, but both edit `block-editor.ts` and `block-editor.meta.json`, so run them one after the other, not in parallel.
- Zero runtime dependencies: no KaTeX or any math library in `package.json`. Tokens only, logical properties only, no `:dir()`, `ayy-` prefix, state in attributes, a `forced-colors` rule for colour-shown state.
- Stored inline HTML stays a whitelist. `blockEditorCleanHtml` (string-based) and `cleanDom` (DOM-based) must both keep exactly the new tags or attributes and nothing else.
- Never edit generated files. Run `pnpm build` (which runs `pnpm generate`) and commit its output.
- Every new block type gets: a `TYPES` entry (label, hint, icon from `src/lib/icons.ts`, keywords), normalize rules, all four converters, a meta `classes` entry for each new class, and a line in the meta's `description`.
- An icon not yet in `src/lib/icons.ts` is copied from `node_modules/@hugeicons/core-free-icons/dist/esm/<Name>.js` in the same one-line-per-path format. Never draw one by hand.
- CHANGELOG: amend the existing Block editor line under `## Unreleased`.
- e2e: `export E2E_PORT=$((4200 + $$ % 300))`, then `pnpm preview --port "$E2E_PORT" --strictPort --host 127.0.0.1` in a second terminal, and `E2E_REUSE=1 pnpm exec playwright test … -g …`.

## Review Focus

1. **Pasted HTML with `<mark style=…>` or `<mark onclick=…>`.** Only a bare `<mark>` survives. Pinned in Task 2's node test.
2. **`renderMath` throwing, or returning an empty string.** The equation shows its TeX source and the editor keeps working. Pinned in Task 4's e2e test.
3. **A record link block when `mentions` is later removed through `setOptions`.** The block still renders its stored label. It never looks the option up again. Pinned in Task 3's e2e test.
4. **Markdown round trip of a toned callout that contains `**bold**`.** The tone and the formatting both survive. Pinned in Task 1's node test.
5. **Read-only.** No "Colour ›" entry, no editable TeX line, and the record card is still clickable (it fires `onMentionClick`). Pinned in Tasks 1, 3 and 4.

---

### Task 1: Callout colours

**Files:**
- Modify: `src/components/block-editor/block-editor.ts`: `BlockEditorBlock`, normalize, `blockEditorToMarkdown`, `blockEditorFromMarkdown`, `blockEditorToHtml`, `buildBlock` (callout icon), `decorate`, `signature`, `actionItems`
- Modify: `block-editor.css` (callout rules near `.ayy-block-editor__block[data-type="callout"]`), `block-editor.meta.json`
- Modify: `src/lib/icons.ts`: add `InformationCircleIcon`, `CheckmarkCircle02Icon`, `Alert02Icon` and `CancelCircleIcon` only if they're missing (the toast already uses them, so most are there)
- Test: `tests/node/block-editor.test.mjs`, `tests/e2e/interactions.spec.ts`

**Interfaces:**
- Produces: `export type BlockEditorTone = "default" | "info" | "success" | "warning" | "destructive";` and the field `tone?: BlockEditorTone` on callouts. Normalize keeps it only on callouts and only when it isn't `"default"`. The block element gets `data-tone`.
- Markdown map (from the spec): info `[!NOTE]`, success `[!TIP]`, warning `[!WARNING]`, destructive `[!CAUTION]`, written as `> [!NOTE]` followed by `> text`. Import also accepts `[!IMPORTANT]` as info. A default callout still exports as a plain `> text` (a quote).
- Colours: reuse Alert's tokens. Read `src/components/alert/alert.css` for which `--ayy-color-*` tokens each variant uses for the background tint and icon, and use the same ones.

- [ ] **Step 1: Write the failing node tests**

```js
test("callout tones survive normalize, Markdown and HTML", () => {
  const c = { id: "c", type: "callout", tone: "warning", html: "Freeze is <strong>Friday</strong>" };
  assert.equal(blockEditorNormalize([c])[0].tone, "warning");
  assert.equal(blockEditorNormalize([{ ...c, tone: "default" }])[0].tone, undefined);
  assert.equal(blockEditorNormalize([{ ...c, type: "text" }])[0].tone, undefined);
  const md = blockEditorToMarkdown([c]);
  assert.equal(md, "> [!WARNING]\n> Freeze is **Friday**");
  const [back] = blockEditorFromMarkdown(md);
  assert.equal(back.type, "callout");
  assert.equal(back.tone, "warning");
  assert.equal(back.html, "Freeze is <strong>Friday</strong>");
  assert.match(blockEditorToHtml([c]), /^<aside data-tone="warning">/);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm build && node --test tests/node/block-editor.test.mjs`
Expected: FAIL on `tone` being `undefined`.

- [ ] **Step 3: Implement the model, the converters, rendering and CSS**

- Each tone's icon: default `BulbIcon` (as now), info `InformationCircleIcon`, success `CheckmarkCircle02Icon`, warning `Alert02Icon`, destructive `CancelCircleIcon`.
- Add `tone` to `signature`, so a tone change rebuilds the icon.
- In `actionItems`, for a single editable callout, add "Colour ›" with a submenu (the `sub` mechanism): Default, Info, Success, Warning, Destructive, with `current` on the active one. Each one commits `{ ...b, tone }`.

- [ ] **Step 4: Write and run the e2e test**

`test("block editor callouts change colour from block actions", …)` on the `page` example (its block 2 is a callout):
- Open its handle menu, then "Colour", then "Warning". Expect `data-tone="warning"`.
- `Control+z`. Expect no `data-tone`.
- In the `task-notes` example, type `/callout` and press Enter in a new line, then turn on its "Read only" switch. Expect the callout to have no `.ayy-block-editor__handle` (read-only has no gutter, so no "Colour ›").

Run: `pnpm build && pnpm check && pnpm exec playwright test tests/e2e/interactions.spec.ts -g "callouts change colour"`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src tests manifest llms llms.txt llms-full.txt ai
git commit -m "Block editor: callout colours"
```

---

### Task 2: Highlight mark

**Files:**
- Modify: `block-editor.ts`: `INLINE_TAGS`, `MARKS`, `blockEditorCleanHtml` (already keyed off `INLINE_TAGS`), `cleanDom`, `inlineToMarkdown`, `markdownInline`, the toolbar's format list (search `formatGroup`), `onTextKey`'s format shortcuts, `autoformat` (`==text==` as you type)
- Modify: `block-editor.css`: `.ayy-block-editor__text mark` uses Text highlight's default look. Copy the token choices from `src/components/text-highlight/text-highlight.css`; don't add the `.ayy-text-highlight` class to stored HTML.
- Modify: `src/lib/icons.ts`: add `HighlighterIcon` from the Hugeicons package
- Test: `tests/node/block-editor.test.mjs`, `tests/e2e/interactions.spec.ts`

**Interfaces:**
- Produces: `mark` is a stored inline tag, like `strong`. The toolbar button has `data-command="mark"`, label "Highlight", shortcut `Mod+Shift+H`, and sits after the strikethrough button. `toggleMark("mark")` works through the existing code path.

- [ ] **Step 1: Write the failing node tests**

```js
test("highlight is a stored mark: cleaned, and ==text== in Markdown", () => {
  assert.equal(blockEditorCleanHtml('a <mark style="color:red" onclick="x()">b</mark> c'), "a <mark>b</mark> c");
  assert.equal(blockEditorToMarkdown([{ id: "a", type: "text", html: "a <mark>b</mark>" }]), "a ==b==");
  assert.equal(blockEditorFromMarkdown("a ==b== c")[0].html, "a <mark>b</mark> c");
  assert.equal(blockEditorFromMarkdown("a == b")[0].html, "a == b");
});
```
Add `blockEditorCleanHtml` to the test file's import.

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm build && node --test tests/node/block-editor.test.mjs`
Expected: FAIL (`<mark>` is stripped).

- [ ] **Step 3: Implement it** across the files listed. In `markdownInline`, match `/==([^=\s][^=]*?)==/g` after the `~~` rule. In `inlineToMarkdown`, write `==` for both the opening and the closing `mark` tag.

- [ ] **Step 4: Write and run the e2e test**

`test("block editor highlights a selection from the bar and with Mod+Shift+H", …)` on the `page` example:
- Select a word in line 1, using `selectText` through `evaluate`, as the existing formatting test does. Press `Control+Shift+h`. Expect `line(1).locator("mark")` to have that word as its text.
- Press it again. Expect count 0.
- Type `==hi==` in an empty line. Expect a `mark` with "hi".

Run: `pnpm build && pnpm check && pnpm exec playwright test tests/e2e/interactions.spec.ts -g "highlights a selection"`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src tests manifest llms llms.txt llms-full.txt ai
git commit -m "Block editor: highlight mark"
```

---

### Task 3: Record link block

**Files:**
- Modify: `block-editor.ts`: `blockEditorBlockTypes` (add `"record"` after `"file"`), `TYPES` (label "Link to record", icon `ArrowUpRight01Icon`), `isText` (exclude `"record"` the way `"table"` is excluded; don't set `media`, which would give it the media upload panel), `BlockEditorBlock.record`, normalize, the four converters, `buildBlock` (a `buildRecord`), `slashItems`, `applySlash`, `applyMention`, `onClick`
- Modify: `block-editor.css`, `block-editor.meta.json`
- Test: node and e2e

**Interfaces:**
- Consumes: `BlockEditorMention` (`{ trigger, id, label }`), `opts.mentions`, `openMention`, `applyMention`, `opts.onMentionClick`.
- Produces:
  - The field `record?: BlockEditorMention` (normalize keeps it only when `label` is non-empty; a record block with no `record` stays, showing "Pick a record").
  - Classes `ayy-block-editor__record` (a `<button type="button">` card row: icon, `__record-label`, `__record-source`) and `ayy-block-editor__record-label` / `ayy-block-editor__record-source`.
  - A closure variable `let recordPending: string | null` (the id of the line that will become a record).
- Flow:
  1. `slashItems` adds one item per mention source, `"Link to " + (source.label ?? source.trigger)`, with key `record:<trigger>`.
  2. Running it sets the line's html to the trigger, the caret after it, and `recordPending = id`, then calls `detectMenus(el)` so the mention list opens.
  3. In `applyMention`, when `recordPending === menu.id`, the whole line is replaced with `blockEditorBlock("record", { record: { trigger, id, label } })` and a new empty text line after it.
  4. Closing the menu (Esc, or moving away) clears `recordPending` and leaves the typed text alone.
- Converters: text and Markdown write `${trigger}${label}`; HTML writes `<p data-record="${trigger}${id}">${label}</p>`. Markdown import does not recreate it (that's expected; note it in the meta).

- [ ] **Step 1: Write the failing node test**

```js
test("record blocks keep their link and export as the label", () => {
  const r = { id: "r", type: "record", record: { trigger: "#", id: "142", label: "Auth token refresh race" } };
  assert.deepEqual(blockEditorNormalize([r])[0].record, r.record);
  assert.equal(blockEditorNormalize([{ ...r, record: { trigger: "#", id: "1", label: "" } }])[0].record, undefined);
  assert.equal(blockEditorToMarkdown([r]), "#Auth token refresh race");
  assert.equal(blockEditorToHtml([r]), '<p data-record="#142">Auth token refresh race</p>');
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm build && node --test tests/node/block-editor.test.mjs`
Expected: FAIL.

- [ ] **Step 3: Implement it** following the flow above. Clicking the card calls `opts.onMentionClick(record, event)`, in read-only too (`<ayy-block-editor>` already turns that into `ayy-mention-click`).

- [ ] **Step 4: Write and run the e2e test**

`test("block editor links a record from / and fires the mention click", …)` on the `page` example (its mentions have People `@` and Issues `#`):
- In an empty line, type `/link to iss` and press Enter. Expect the mention menu to be visible.
- Type `onb` and press Enter. Expect a `[data-type="record"]` with text "Onboarding checklist copy".
- HTML renderer only: through `evaluate`, add an `ayy-mention-click` listener on `<ayy-block-editor>` that stores `e.detail` on `window.__clicked`. Click the card. Expect `window.__clicked.id` to be `"158"`.
- HTML renderer only: through `evaluate`, set `el.mentions = []`. Expect the card's text to be unchanged.

Run: `pnpm build && pnpm check && pnpm exec playwright test tests/e2e/interactions.spec.ts -g "links a record"`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src tests manifest llms llms.txt llms-full.txt ai
git commit -m "Block editor: record link block"
```

---

### Task 4: Equation block with an app-supplied renderer

**Files:**
- Modify: `block-editor.ts`: types (add `"equation"` after `"code"`), `TYPES` (label "Equation", hint "TeX, shown by your math renderer", icon: add `FunctionIcon` from Hugeicons, `markdown: "$$"`), a new `const isPlain = (type: BlockEditorBlockType) => type === "code" || type === "equation"`. Use it in place of `=== "code"` wherever the check is about plain-text editing: escaping in normalize and `syncText`/`syncAll`, `plaintext-only` in `buildText`, Enter inserting a newline, the toolbar hiding, and merging on Backspace/Delete. Keep `=== "code"` for the language, highlighting and copy bar, normalize (escape like code), the converters, `buildBlock`, `shortcut()` (`$$` at the start of an empty line), `BlockEditorOptions.renderMath`, `setOptions`
- Modify: `block-editor.react.tsx` (a `renderMath` prop), `block-editor.element.ts` (a `renderMath` property), `block-editor.css`, `block-editor.meta.json` (props, element properties, classes)
- Test: node and e2e

**Interfaces:**
- Produces:
  - `renderMath?: (tex: string) => string` on `BlockEditorOptions`, `BlockEditorProps` and the element.
  - Class `ayy-block-editor__math`: the rendered output, a sibling after the `.ayy-block-editor__text` line, `aria-hidden="true"`. The line keeps `aria-label="Equation"`, so screen readers get the TeX.
  - The block gets `data-rendered` when the output is non-empty.
- Behaviour:
  - Rendering happens in `decorate` when `renderMath` is set and the TeX changed. Cache the last TeX per block id in a `Map`. Wrap the call in `try/catch`: on a throw or an empty result, remove `data-rendered`.
  - CSS: `[data-rendered]:not(:focus-within) > .ayy-block-editor__text` is visually hidden (clip pattern, not `display: none`, so it stays focusable), and `.ayy-block-editor__math` shows only while `[data-rendered]:not(:focus-within)`. Clicking the rendered math focuses the line.
  - Converters: Markdown is `$$\n<tex>\n$$`, imported back from a `$$` fence the same way `\`\`\`` fences are. HTML is `<div data-math>\\[<escaped tex>\\]</div>`. Text is the TeX.

- [ ] **Step 1: Write the failing node test**

```js
test("equations keep their TeX through Markdown and export it to HTML", () => {
  const eq = { id: "e", type: "equation", html: "E = mc^2 &lt; x" };
  assert.equal(blockEditorToMarkdown([eq]), "$$\nE = mc^2 < x\n$$");
  const [back] = blockEditorFromMarkdown("$$\nE = mc^2 < x\n$$");
  assert.equal(back.type, "equation");
  assert.equal(back.html, "E = mc^2 &lt; x");
  assert.equal(blockEditorToHtml([eq]), "<div data-math>\\[E = mc^2 &lt; x\\]</div>");
  assert.equal(blockEditorNormalize([{ type: "equation", html: "<b>x</b>" }])[0].html, "x");
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm build && node --test tests/node/block-editor.test.mjs`
Expected: FAIL.

- [ ] **Step 3: Implement it** as specified. React: pass `renderMath` through `setOptions` like `upload`. Element: a `renderMath` property setter that calls `setOptions`.

- [ ] **Step 4: Write and run the e2e test**

`test("block editor equations show the app's rendering, edit as TeX, and fall back to the source", …)` in the HTML renderer of the `page` example:
- Through `evaluate`, set `el.renderMath` to a function that throws when `tex === "boom"` and otherwise returns `` `<span class="fake-math">${tex}</span>` ``.
- In an empty line, type `$$`. Expect the line to become `[data-type="equation"]`. Type `x^2`, then click another line. Expect `.ayy-block-editor__math .fake-math` to have text "x^2".
- Click it. Expect the `.ayy-block-editor__text` line to be focused, with text "x^2".
- Replace the text with `boom` and blur. Expect no `data-rendered`, the source line visible, and no page errors (use the `errors` array that `open()` returns).

Run: `pnpm build && pnpm check && pnpm exec playwright test tests/e2e/interactions.spec.ts -g "equations show"`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src tests manifest llms llms.txt llms-full.txt ai
git commit -m "Block editor: equation block with an app-supplied renderer"
```

---

### Task 5: Docs and the full gate

**Files:**
- Modify: `block-editor.meta.json`: `description`, `do` (a line on passing `renderMath`, e.g. KaTeX's `renderToString`, and on keeping the bundle size in the app), and `a11y` (Mod+Shift+H, and that TeX is what screen readers hear).
- Modify: `CHANGELOG.md`: amend the Block editor line ("…callout colours, highlight, record links, equations with your own renderer…").
- Modify: `examples/page.tsx` and `examples/page.html`: turn the existing callout into `tone: "warning"` (HTML: `data-tone="warning"`). Don't add blocks to `page`; its e2e test counts them.

- [ ] **Step 1: Run the whole gate**

Run: `pnpm build && pnpm typecheck && pnpm check && pnpm test && pnpm preview:build && pnpm test:e2e`
Expected: every command exits 0, and the e2e summary shows `0 failed`.

- [ ] **Step 2: Look at it** in dark, light and `dark-contrast` themes, RTL and touch density: the callout tints, highlight contrast, and the record card.

- [ ] **Step 3: Commit**

```bash
git add -A src CHANGELOG.md manifest llms llms.txt llms-full.txt ai
git commit -m "Block editor: document callout colours, highlight, record links and equations"
```
