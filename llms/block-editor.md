# Block editor

Category: Forms. A Notion-style document editor made of blocks: text, three headings, bulleted, numbered and to-do lists, toggles that hide the blocks nested under them, tables of plain-text cells (resizable, aligned columns, header row and column), quotes, callouts, code, dividers, images, embeds and files. Enter starts a new block and Backspace joins it to the one above, the arrows move between blocks as if they were one text, Markdown shortcuts and / turn a line into another block, a quiet bar formats a selection, @ inserts mention chips, and the handle in the gutter drags blocks (one or a selection of them) to a new place. Also called: block-editor, rich-text-editor, rich-text, wysiwyg, notion-editor, document-editor, notes-editor, page-editor.

**Classes**
- `.ayy-block-editor` — Root. The editor renders its blocks inside it, then the floating menu, formatting bar and caret anchor. Leave room at its inline start for the gutter (about 3.25rem of padding in its container), or use --inset.
- `.ayy-block-editor--inset` — Keeps the gutter inside the editor's own box, for containers with no padding to hang it in.
- `.ayy-block-editor__block` — One block. data-type says what it is; data-indent (1–4) nests it, data-checked marks a done to-do, data-open a toggle showing the blocks nested under it (a closed one hides them), data-selected a block in a block selection, data-dragging one being carried. In plain HTML you can write just <div class="ayy-block-editor__block" data-type="heading-1">Title</div>; the editor builds the rest.
- `.ayy-block-editor__gutter` — The + and the drag handle at the block's inline start; shown while the pointer is over the block (on touch screens, next to the line being written).
- `.ayy-block-editor__add` — The + button: a new line below with / typed, so the block menu opens. Alt-click adds it above.
- `.ayy-block-editor__handle` — The drag handle (.ayy-drag-handle): drag to move the block, or every selected block; click for block actions (duplicate, move, delete, turn into).
- `.ayy-block-editor__text` — The editable line of a text block (contenteditable, role="textbox"). Inline content: strong, em, u, s, code, links and mention chips. Shows data-placeholder while empty.
- `.ayy-block-editor__marker` — A list's bullet or number, drawn by the editor (1. a. i. by nesting level).
- `.ayy-block-editor__toggle` — A toggle's arrow button: points along the reading direction, turns down while the toggle is open (aria-expanded). Blocks indented under the toggle (data-indent greater than its own) are hidden while it is closed.
- `.ayy-block-editor__table-wrap` — A table block's box: the scrolling table, the + at its inline end (add a column) and the + under it (add a row).
- `.ayy-block-editor__table-scroll` — Scrolls the table sideways in a narrow column, with a hairline around it.
- `.ayy-block-editor__table` — The <table>. A header row is a <thead> of <th scope="col">; the rest is a <tbody>. In plain HTML a block with data-type="table" can hold a <table> and the editor reads its rows.
- `.ayy-block-editor__cell` — The editable plain-text line inside every cell (role="textbox", data-row, data-col). Tab and Shift+Tab move between cells, Enter goes down a row.
- `.ayy-block-editor__col-resize` — The handle on a table column's inline-end edge, in the first row (role="separator"): drag it to set the column's width. The same widths are set from the block actions menu (Width) for keyboard users.
- `.ayy-block-editor__table-add` — A table's + button (data-axis="column" or "row"): shown while the pointer or focus is in the block, always on touch screens.
- `.ayy-block-editor__row-grip` — The handle at a table row's inline start (data-row, aria-haspopup="menu"): lights the row while a cell in it is hovered or focused.
- `.ayy-block-editor__col-grip` — The handle over a table column's top (data-col, aria-haspopup="menu"): lights the column while a cell in it is hovered or focused.
- `.ayy-block-editor__check` — A to-do's checkbox (.ayy-checkbox).
- `.ayy-block-editor__icon` — A callout's icon.
- `.ayy-block-editor__code-bar` — A code block's header, over the top of the code: the language at the start, Copy at the end (shown on hover).
- `.ayy-block-editor__code-button` — A button in the code header: the language (opens a menu of languages; plain text in read-only) or Copy (a check while copied, data-copied).
- `.ayy-block-editor__rule` — A divider's line (<hr>).
- `.ayy-block-editor__media` — The <figure> of an image or embed block.
- `.ayy-block-editor__frame` — The box around an image, a player or a link card. data-ratio="video|audio|square" sizes a provider's player.
- `.ayy-block-editor__image` — An image block's <img>.
- `.ayy-block-editor__resize` — The handle on an image's inline-end edge (role="separator"): drag, or use the arrow keys, to set its width.
- `.ayy-block-editor__caption` — An image or embed's editable caption (also the image's alt text). Its placeholder shows on hover and focus.
- `.ayy-block-editor__bookmark` — An embed of a page that isn't a player: a quiet card with the site and the address.
- `.ayy-block-editor__bookmark-title` — The site's name in a link card.
- `.ayy-block-editor__bookmark-url` — The address in a link card, truncated.
- `.ayy-block-editor__file` — A file block: a link to download it, with its icon, name and size.
- `.ayy-block-editor__file-name` — A file's name, truncated.
- `.ayy-block-editor__file-size` — A file's size, muted.
- `.ayy-block-editor__empty` — An image, embed or file block with nothing in it yet: a muted panel with a link field and an Upload button. aria-busy="true" while a file uploads.
- `.ayy-block-editor__mention` — A mention chip inside text (contenteditable="false", data-trigger, data-id, data-label): text with a faint wash, never a loud pill.
- `.ayy-block-editor__mention-trigger` — The @ or # of a mention, muted.
- `.ayy-block-editor__menu` — The floating list (.ayy-combobox__listbox) for /, mentions, block actions and a code block's language. data-mode="slash|mention|actions|language".
- `.ayy-block-editor__menu-label` — A group heading in the menu (Basic blocks, Media, People, Turn into).
- `.ayy-block-editor__option` — One menu row (.ayy-combobox__option, role="option"). data-current marks a block's current type, data-destructive Delete.
- `.ayy-block-editor__option-icon` — The tile in front of a menu row: the block type's icon, or an Avatar for a person.
- `.ayy-block-editor__option-text` — A menu row's name and hint.
- `.ayy-block-editor__option-hint` — A menu row's muted second line.
- `.ayy-block-editor__toolbar` — The formatting bar (.ayy-toolbar--floating) over a text selection: bold, italic, underline, strikethrough, code, link. Over a link it shows the link's address.
- `.ayy-block-editor__link-form` — The link field in the formatting bar, with Open and Remove.
- `.ayy-block-editor__anchor` — A hidden box the script places over the caret or the selection for the menu and the bar to hang from.

**States**
- `default` — Plain text on the page: no borders or boxes; headings in --ayy-font-heading; lists, quotes, callouts and code in their own quiet styles. The gutter is hidden.
- `hover` (`:hover on a block (devices that hover)`) — Its gutter (+ and the drag handle) fades in at the inline start; a hovered image shows its resize handle and its caption placeholder; gutter buttons, link cards and file rows get --ayy-color-wash-hover.
- `pressed` — doesn't apply: No pressed look: pressing the handle starts a drag or opens block actions, pressing text places the caret.
- `focus` (`A line with the caret (:focus inside .ayy-block-editor__text), or the editor itself while blocks are selected; :focus-visible on the gutter buttons, the resize handle, link cards and file rows`) — The caret, and an empty line's hint (Type / for blocks). Selected blocks show their tint; buttons and handles get the 2px --ayy-color-ring outline.
- `disabled` — doesn't apply: Use readOnly to show a document that can't be edited.
- `selected` (`data-selected on blocks: Esc in a line, Shift+click, Mod+A twice, or the handle's menu`) — A 12% --ayy-color-primary tint behind the block; images, players and files also get the --ayy-color-ring outline. Forced colours: a Highlight outline.
- `error` — doesn't apply: No error look on the editor; a link that isn't a valid URL marks the link field (aria-invalid) instead. Say why a save failed in an Alert or a toast.
- `loading` (`aria-busy="true" on .ayy-block-editor__empty while a dropped, pasted or picked file uploads`) — The media panel dims to 60% and stops taking the pointer until the file's URL arrives.
- `checked` (`data-checked on a to-do block (its checkbox, or Mod+Enter in the line)`) — The checkbox is checked; the text turns --ayy-color-muted with a line through it.
- `open` (`data-open on a toggle block (its arrow, or Mod+Enter in the line)`) — The arrow turns down and the blocks nested under the toggle show; closed, they are hidden (hidden attribute) but stay in the value.
- `resizing` (`data-active on .ayy-block-editor__col-resize while a table column is dragged`) — A 2px --ayy-color-primary line shows on the column's edge; the columns follow the pointer live.
- `hot` (`data-hot on the grips of the hovered or focused cell's row and column`) — The two grips fade in
- `dragging` (`data-dragging on the blocks being carried by the handle`) — They dim to 40%; a raised copy (or a chip saying "3 blocks") follows the pointer and a 2px primary line shows where they'll land.
- `empty` (`data-empty on the root: the document is one empty line`) — The placeholder shows in that line, focused or not.
- `typing` (`data-typing on the root: set by typing, cleared when the pointer moves or presses`) — The gutters and code blocks' Copy fade out, so nothing moves beside the words being written.
- `read-only` (`readOnly / the readonly attribute (aria-readonly="true" on the root)`) — No gutter, carets, placeholders or empty media panels; checkboxes are disabled, links and mentions open on click.

**Sizes**
- Density — Text follows the type scale (body --ayy-text-md, headings 3xl, 2xl and xl), not density. Menu rows, the formatting bar and the media panel's field and button follow the control sizes, so data-density="touch" makes them bigger; the gutter buttons stay 1.5rem.
- Width — Fills its container; images and embeds fill the column (an image can be resized from 20% to 100%). The gutter hangs about 3.25rem outside the inline start, or inside with --inset.

**Custom element** `<ayy-block-editor>` (@danitesler/ayywi/elements) — A <div class="ayy-block-editor"> of blocks, and optionally a <script type="application/json" data-mentions> with mention lists.
- attribute `placeholder`: Shown while the document is empty.
- attribute `label`: Accessible name of the editor (default "Editor").
- attribute `readonly`: Show the document without editing it.
- event `ayy-change`: { value } — every block, after each change.
- event `ayy-mention-click`: { trigger, id, label } — a mention chip was clicked.

**React** — `import { BlockEditor } from "@danitesler/ayywi/react";`
- `<BlockEditor>` renders <div class="ayy-block-editor"> that the editor fills with blocks. Props: `value` BlockEditorBlock[] — the document, controlled (pass back what onChange gives you).; `defaultValue` BlockEditorBlock[] — the document to start with, uncontrolled.; `onChange` (value: BlockEditorBlock[]) => void — after every change.; `placeholder` string — shown while the document is empty.; `readOnly` boolean — show the document without editing it.; `mentions` BlockEditorMentionSource[] — { trigger, label?, options } per trigger; options is a list of { id, label, hint?, avatar? } or a (query) => list or Promise of one.; `upload` (file: File) => string | Promise<string> — store a pasted, dropped or picked file, return its URL. Default: a data: URL.; `onMentionClick` (mention: { trigger, id, label }, event: MouseEvent) => void; `inset` boolean — keep the gutter inside the editor's box.; `aria-label` string — accessible name of the editor (default "Editor").; `...rest` Native <div> attributes (id, className, style…).

**Accessibility**
- Name the editor (aria-label in React, label on <ayy-block-editor>): it's a role="group" of lines, each a role="textbox" named by its type (Text, Heading 1, To-do list).
- Everything works from the keyboard: Enter, Backspace and the arrows move through blocks; Tab and Shift+Tab nest; Mod+Enter opens or closes a toggle, whose arrow is not a tab stop; in a table Tab and Shift+Tab move between cells (Tab in the last one adds a row), Enter goes down a row and adds one after the last, Mod+Enter adds a row below, the arrows leave the table at its first and last row, Mod+Shift+arrows move the row or column, and the block actions menu (Mod+/) groups what works on the row and column the caret was in under Insert, Duplicate, Move, Align, Width, Clear and Delete (→ opens a group, ← or Esc goes back); Esc selects the block (then ↑/↓, Shift+↑/↓, Delete, Mod+D, Mod+Shift+↑/↓, Enter to edit again); Mod+/ opens block actions, Mod+Alt+0–8 turns a block into another type, Mod+B/I/U, Mod+Shift+S, Mod+E and Mod+K format. Tab nests, so the way out of the editor is Esc twice, then Tab.
- The / and mention menus keep focus in the line: ↑/↓ move through aria-activedescendant, Enter or Tab picks, Esc closes without closing a parent Dialog. The block actions menu takes focus and gives it back.
- Block selections, moves and failed uploads are read out in a polite live region.
- Images take their caption as alt text: write one for every picture that carries meaning.

**Do**
- Use a Block editor for documents people write and come back to: notes on a task, a page in a wiki, a spec, a long description with headings, lists, to-dos and media.
- Store the value (blocks) as it is, or convert it with blockEditorToMarkdown / blockEditorFromMarkdown when the storage is Markdown, and render it elsewhere with blockEditorToHtml.
- Pass mentions for the people and records your app has (@ for people, # for issues), with a function when the list is long or remote.
- Pass upload so pasted, dropped and picked files go to your storage instead of the default data: URLs.
- Keep tables for short, plain facts (a price list, a schedule). Cells are plain text, one line each, up to 100 rows and 12 columns; a spreadsheet pasted into a cell fills the cells from there.

**Don't**
- Don't use a Block editor for a short reply, a comment or a single field — use Textarea, or Mentions when the text needs @mentions.
- Don't wrap it in a bordered box like an input: it's the page. Put it straight in the page or a Card, with room at its inline start for the gutter (or --inset).
- Don't trust a value from elsewhere as HTML: pass it through the editor or blockEditorNormalize, which keep only the inline HTML it makes.

## Block editor — A page: headings, lists, to-dos, a callout, mentions, an image and code

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-block-editor> reads the blocks written inside it; a data-mentions script gives it the @ and # lists. -->
<ayy-block-editor label="Q3 onboarding launch" placeholder="Write the plan, or type / for blocks">
  <script type="application/json" data-mentions>[{"trigger": "@", "label": "People", "options": [{"id": "ada", "label": "Ada Lovelace", "hint": "Engineering lead", "avatar": true}, {"id": "grace", "label": "Grace Hopper", "hint": "Platform", "avatar": true}, {"id": "alan", "label": "Alan Turing", "hint": "Security", "avatar": true}, {"id": "margaret", "label": "Margaret Hamilton", "hint": "Release manager", "avatar": true}]}, {"trigger": "#", "label": "Issues", "options": [{"id": "142", "label": "Auth token refresh race", "hint": "#142 · In review"}, {"id": "158", "label": "Onboarding checklist copy", "hint": "#158 · To do"}, {"id": "163", "label": "Activation event double-counts", "hint": "#163 · In progress"}]}]</script>
  <div class="ayy-block-editor ayy-block-editor--inset" style="max-inline-size: 46rem">
    <div class="ayy-block-editor__block" data-type="heading-1"><div class="ayy-block-editor__text">Q3 onboarding launch</div></div>
    <div class="ayy-block-editor__block" data-type="text"><div class="ayy-block-editor__text">Ship the new onboarding to <strong>every workspace</strong> by 30 September. <span class="ayy-block-editor__mention" contenteditable="false" data-trigger="@" data-id="ada" data-label="Ada Lovelace"><span class="ayy-block-editor__mention-trigger">@</span>Ada Lovelace</span> owns the rollout, <span class="ayy-block-editor__mention" contenteditable="false" data-trigger="@" data-id="margaret" data-label="Margaret Hamilton"><span class="ayy-block-editor__mention-trigger">@</span>Margaret Hamilton</span> the release notes.</div></div>
    <div class="ayy-block-editor__block" data-type="callout"><div class="ayy-block-editor__text">Code freeze is <strong>12 September</strong>. Anything not merged by then moves to Q4.</div></div>
    <div class="ayy-block-editor__block" data-type="heading-2"><div class="ayy-block-editor__text">Milestones</div></div>
    <div class="ayy-block-editor__block" data-type="todo" data-checked><input type="checkbox" class="ayy-checkbox ayy-block-editor__check" aria-label="Done" checked><div class="ayy-block-editor__text">Finish the onboarding copy</div></div>
    <div class="ayy-block-editor__block" data-type="todo"><input type="checkbox" class="ayy-checkbox ayy-block-editor__check" aria-label="Done"><div class="ayy-block-editor__text">Fix <span class="ayy-block-editor__mention" contenteditable="false" data-trigger="#" data-id="142" data-label="Auth token refresh race"><span class="ayy-block-editor__mention-trigger">#</span>Auth token refresh race</span> before the beta</div></div>
    <div class="ayy-block-editor__block" data-type="todo"><input type="checkbox" class="ayy-checkbox ayy-block-editor__check" aria-label="Done"><div class="ayy-block-editor__text">Beta with 20 workspaces</div></div>
    <div class="ayy-block-editor__block" data-type="todo" data-indent="1"><input type="checkbox" class="ayy-checkbox ayy-block-editor__check" aria-label="Done"><div class="ayy-block-editor__text">Pick workspaces that already talk to support</div></div>
    <div class="ayy-block-editor__block" data-type="heading-2"><div class="ayy-block-editor__text">Rollout</div></div>
    <div class="ayy-block-editor__block" data-type="number"><span class="ayy-block-editor__marker" aria-hidden="true">1.</span><div class="ayy-block-editor__text">Internal workspaces, behind a flag</div></div>
    <div class="ayy-block-editor__block" data-type="number"><span class="ayy-block-editor__marker" aria-hidden="true">2.</span><div class="ayy-block-editor__text">10% of new sign-ups</div></div>
    <div class="ayy-block-editor__block" data-type="number"><span class="ayy-block-editor__marker" aria-hidden="true">3.</span><div class="ayy-block-editor__text">Everyone, once activation holds at <em>40%</em> for a week</div></div>
    <div class="ayy-block-editor__block" data-type="quote"><div class="ayy-block-editor__text">Measure activation, not sign-ups.</div></div>
    <div class="ayy-block-editor__block" data-type="image"><figure class="ayy-block-editor__media"><div class="ayy-block-editor__frame"><img class="ayy-block-editor__image" src="data:image/svg+xml;utf8,&lt;svg xmlns=&#x27;http://www.w3.org/2000/svg&#x27; width=&#x27;1200&#x27; height=&#x27;520&#x27; viewBox=&#x27;0 0 1200 520&#x27;&gt;&lt;defs&gt;&lt;linearGradient id=&#x27;f&#x27; x1=&#x27;0&#x27; y1=&#x27;0&#x27; x2=&#x27;1&#x27; y2=&#x27;0&#x27;&gt;&lt;stop offset=&#x27;0&#x27; stop-color=&#x27;%236366f1&#x27;/&gt;&lt;stop offset=&#x27;1&#x27; stop-color=&#x27;%2314b8a6&#x27;/&gt;&lt;/linearGradient&gt;&lt;/defs&gt;&lt;rect width=&#x27;1200&#x27; height=&#x27;520&#x27; fill=&#x27;%23f4f4f5&#x27;/&gt;&lt;rect x=&#x27;80&#x27; y=&#x27;80&#x27; width=&#x27;1040&#x27; height=&#x27;70&#x27; rx=&#x27;14&#x27; fill=&#x27;url(%23f)&#x27;/&gt;&lt;rect x=&#x27;80&#x27; y=&#x27;180&#x27; width=&#x27;780&#x27; height=&#x27;70&#x27; rx=&#x27;14&#x27; fill=&#x27;url(%23f)&#x27; fill-opacity=&#x27;.8&#x27;/&gt;&lt;rect x=&#x27;80&#x27; y=&#x27;280&#x27; width=&#x27;520&#x27; height=&#x27;70&#x27; rx=&#x27;14&#x27; fill=&#x27;url(%23f)&#x27; fill-opacity=&#x27;.6&#x27;/&gt;&lt;rect x=&#x27;80&#x27; y=&#x27;380&#x27; width=&#x27;410&#x27; height=&#x27;70&#x27; rx=&#x27;14&#x27; fill=&#x27;url(%23f)&#x27; fill-opacity=&#x27;.45&#x27;/&gt;&lt;/svg&gt;" alt="Activation funnel from the last beta" width="1200" height="520"></div><figcaption class="ayy-block-editor__caption">Activation funnel from the last beta</figcaption></figure></div>
    <div class="ayy-block-editor__block" data-type="code" data-language="typescript"><div class="ayy-block-editor__text">// Start with 10% of new sign-ups
flags.enable("onboarding-v2", { percent: 10 });</div></div>
    <div class="ayy-block-editor__block" data-type="divider"><hr class="ayy-block-editor__rule"></div>
    <div class="ayy-block-editor__block" data-type="text"><div class="ayy-block-editor__text"></div></div>
  </div>
</ayy-block-editor>
```

React:

```tsx
import { useState } from "react";
import { blockEditorMentionHtml } from "@danitesler/ayywi";
import { BlockEditor, type BlockEditorBlock, type BlockEditorMentionSource } from "@danitesler/ayywi/react";

const MENTIONS: BlockEditorMentionSource[] = [
  {
    trigger: "@",
    label: "People",
    options: [
      { id: "ada", label: "Ada Lovelace", hint: "Engineering lead", avatar: true },
      { id: "grace", label: "Grace Hopper", hint: "Platform", avatar: true },
      { id: "alan", label: "Alan Turing", hint: "Security", avatar: true },
      { id: "margaret", label: "Margaret Hamilton", hint: "Release manager", avatar: true },
    ],
  },
  {
    trigger: "#",
    label: "Issues",
    options: [
      { id: "142", label: "Auth token refresh race", hint: "#142 · In review" },
      { id: "158", label: "Onboarding checklist copy", hint: "#158 · To do" },
      { id: "163", label: "Activation event double-counts", hint: "#163 · In progress" },
    ],
  },
];

const FUNNEL =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='520' viewBox='0 0 1200 520'><defs><linearGradient id='f' x1='0' y1='0' x2='1' y2='0'><stop offset='0' stop-color='%236366f1'/><stop offset='1' stop-color='%2314b8a6'/></linearGradient></defs><rect width='1200' height='520' fill='%23f4f4f5'/><rect x='80' y='80' width='1040' height='70' rx='14' fill='url(%23f)'/><rect x='80' y='180' width='780' height='70' rx='14' fill='url(%23f)' fill-opacity='.8'/><rect x='80' y='280' width='520' height='70' rx='14' fill='url(%23f)' fill-opacity='.6'/><rect x='80' y='380' width='410' height='70' rx='14' fill='url(%23f)' fill-opacity='.45'/></svg>";

const ada = blockEditorMentionHtml({ trigger: "@", id: "ada", label: "Ada Lovelace" });
const margaret = blockEditorMentionHtml({ trigger: "@", id: "margaret", label: "Margaret Hamilton" });
const race = blockEditorMentionHtml({ trigger: "#", id: "142", label: "Auth token refresh race" });

const START: BlockEditorBlock[] = [
  { id: "title", type: "heading-1", html: "Q3 onboarding launch" },
  { id: "intro", type: "text", html: `Ship the new onboarding to <strong>every workspace</strong> by 30 September. ${ada} owns the rollout, ${margaret} the release notes.` },
  { id: "freeze", type: "callout", html: "Code freeze is <strong>12 September</strong>. Anything not merged by then moves to Q4." },
  { id: "h-milestones", type: "heading-2", html: "Milestones" },
  { id: "m1", type: "todo", checked: true, html: "Finish the onboarding copy" },
  { id: "m2", type: "todo", html: `Fix ${race} before the beta` },
  { id: "m3", type: "todo", html: "Beta with 20 workspaces" },
  { id: "m4", type: "todo", indent: 1, html: "Pick workspaces that already talk to support" },
  { id: "h-rollout", type: "heading-2", html: "Rollout" },
  { id: "r1", type: "number", html: "Internal workspaces, behind a flag" },
  { id: "r2", type: "number", html: "10% of new sign-ups" },
  { id: "r3", type: "number", html: "Everyone, once activation holds at <em>40%</em> for a week" },
  { id: "quote", type: "quote", html: "Measure activation, not sign-ups." },
  { id: "funnel", type: "image", src: FUNNEL, caption: "Activation funnel from the last beta" },
  { id: "flag", type: "code", language: "typescript", html: "// Start with 10% of new sign-ups\nflags.enable(\"onboarding-v2\", { percent: 10 });" },
  { id: "rule", type: "divider" },
  { id: "end", type: "text", html: "" },
];

export default function Example() {
  const [doc, setDoc] = useState(START);
  return (
    <BlockEditor
      aria-label="Q3 onboarding launch"
      inset
      value={doc}
      onChange={setDoc}
      mentions={MENTIONS}
      placeholder="Write the plan, or type / for blocks"
      style={{ maxInlineSize: "46rem" }}
    />
  );
}
```

## Block editor — Task notes in a Card, editable or read-only

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-card" style="max-inline-size: 34rem">
  <div class="ayy-card__header">
    <h3 class="ayy-card__title">Migrate legacy plans</h3>
    <p class="ayy-card__description">Due 14 Nov · Billing</p>
  </div>
  <div class="ayy-card__content ayy-stack">
    <ayy-block-editor label="Notes" placeholder="Add notes… type / for headings, lists and more">
      <div class="ayy-block-editor ayy-block-editor--inset">
        <div class="ayy-block-editor__block" data-type="text"><div class="ayy-block-editor__text">Customers on the old plan keep their price until renewal.</div></div>
        <div class="ayy-block-editor__block" data-type="bullet"><span class="ayy-block-editor__marker" aria-hidden="true">•</span><div class="ayy-block-editor__text">Email them <strong>30 days</strong> before</div></div>
        <div class="ayy-block-editor__block" data-type="bullet"><span class="ayy-block-editor__marker" aria-hidden="true">•</span><div class="ayy-block-editor__text">Link the <a href="https://example.com/pricing">new pricing page</a></div></div>
        <div class="ayy-block-editor__block" data-type="todo"><input type="checkbox" class="ayy-checkbox ayy-block-editor__check" aria-label="Done"><div class="ayy-block-editor__text">Draft the email</div></div>
        <div class="ayy-block-editor__block" data-type="toggle"><div class="ayy-block-editor__text">What customers will ask</div></div>
        <div class="ayy-block-editor__block" data-type="text" data-indent="1"><div class="ayy-block-editor__text"><strong>Will my price change?</strong> Not until your next renewal.</div></div>
        <div class="ayy-block-editor__block" data-type="text" data-indent="1"><div class="ayy-block-editor__text"><strong>Can I switch early?</strong> Yes, from Settings → Billing.</div></div>
        <div class="ayy-block-editor__block" data-type="table">
          <!-- ayywi-lint-disable-next-line -- the editor reads these rows and draws its own table -->
          <table>
            <thead><tr><th>Plan</th><th style="text-align: end">Old price</th><th style="text-align: end">New price</th></tr></thead>
            <tbody>
              <tr><th scope="row">Starter</th><td style="text-align: end">$9</td><td style="text-align: end">$12</td></tr>
              <tr><th scope="row">Team</th><td style="text-align: end">$24</td><td style="text-align: end">$29</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </ayy-block-editor>
    <div class="ayy-field ayy-field--inline">
      <!-- The readonly attribute switches the editor between editing and showing. -->
      <input class="ayy-switch" type="checkbox" role="switch" id="notes-locked-html" onchange="this.closest('.ayy-card').querySelector('ayy-block-editor').toggleAttribute('readonly', this.checked)" />
      <label class="ayy-label" for="notes-locked-html">Read only</label>
    </div>
  </div>
</div>
```

React:

```tsx
import { useState } from "react";
import { BlockEditor, Card, CardContent, CardDescription, CardHeader, CardTitle, Field, Label, Switch, type BlockEditorBlock } from "@danitesler/ayywi/react";

const NOTES: BlockEditorBlock[] = [
  { id: "n1", type: "text", html: "Customers on the old plan keep their price until renewal." },
  { id: "n2", type: "bullet", html: "Email them <strong>30 days</strong> before" },
  { id: "n3", type: "bullet", html: "Link the <a href=\"https://example.com/pricing\">new pricing page</a>" },
  { id: "n4", type: "todo", html: "Draft the email" },
  { id: "n5", type: "toggle", html: "What customers will ask", open: false },
  { id: "n6", type: "text", indent: 1, html: "<strong>Will my price change?</strong> Not until your next renewal." },
  { id: "n7", type: "text", indent: 1, html: "<strong>Can I switch early?</strong> Yes, from Settings → Billing." },
  {
    id: "n8",
    type: "table",
    rows: [
      ["Plan", "Old price", "New price"],
      ["Starter", "$9", "$12"],
      ["Team", "$24", "$29"],
    ],
    align: ["start", "end", "end"],
    headerColumn: true,
  },
];

export default function Example() {
  const [notes, setNotes] = useState(NOTES);
  const [locked, setLocked] = useState(false);
  return (
    <Card style={{ maxInlineSize: "34rem" }}>
      <CardHeader>
        <CardTitle>Migrate legacy plans</CardTitle>
        <CardDescription>Due 14 Nov · Billing</CardDescription>
      </CardHeader>
      <CardContent className="ayy-stack">
        <BlockEditor aria-label="Notes" inset value={notes} onChange={setNotes} readOnly={locked} placeholder="Add notes… type / for headings, lists and more" />
        <Field inline>
          <Switch id="notes-locked" checked={locked} onCheckedChange={setLocked} />
          <Label htmlFor="notes-locked">Read only</Label>
        </Field>
      </CardContent>
    </Card>
  );
}
```

---
Part of @danitesler/ayywi 0.1.2: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
