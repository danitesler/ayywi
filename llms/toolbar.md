# Toolbar

Category: Actions. A row or column of tools and actions for one surface: an editor's tools, a canvas rail, formatting over a selection. role="toolbar" makes it one Tab stop with arrow keys between items; tools that stay on are aria-pressed. Square icon buttons (or icon and label), groups, separators and a spacer; plain, vertical, floating or scrolling. Also called: toolbar, tool-bar, tool-rail, toolrail, tool-button, tool-btn, format-bar.

**Classes**
- `.ayy-toolbar` — Root, role="toolbar" with an aria-label ("Annotate"). A row of items with a small gap.
- `.ayy-toolbar--vertical` — A column (a side rail). Add aria-orientation="vertical" so the up and down arrows move.
- `.ayy-toolbar--floating` — A raised pill with a border and a shadow, floating over a canvas, a photo or a text selection.
- `.ayy-toolbar--scroll` — One line that scrolls sideways when the tools don't fit (phones).
- `.ayy-toolbar--sm` — Smaller buttons and icons (--ayy-size-control-sm), for a floating bar over text.
- `.ayy-toolbar__group` — Tools that belong together: role="group", with an aria-label when it has a name. With data-exclusive, <ayy-toolbar> keeps one of its aria-pressed buttons on (the current tool).
- `.ayy-toolbar__separator` — A hairline between groups: role="separator". Horizontal in a vertical toolbar.
- `.ayy-toolbar__spacer` — Takes the free space, pushing what follows to the far end (actions after tools). aria-hidden.
- `.ayy-toolbar__button` — A tool: <button type="button">. Square with only an icon (then it needs an aria-label), wider with an icon and a short label. Height follows data-density. aria-pressed for a tool that stays on, aria-expanded while its menu is open.

**States**
- `default` — A row of square icon buttons in the soft text colour, split into groups by separators; floating puts them on a raised pill with the overlay shadow.
- `hover` (`.ayy-toolbar__button:hover:not(:disabled) (devices that hover)`) — Wash-hover background, full text colour.
- `pressed` — doesn't apply: No pressed look; a tool that stays on is selected (aria-pressed).
- `focus` (`.ayy-toolbar__button:focus-visible`) — 2px ring, 1px offset. The toolbar is one Tab stop; arrow keys move between buttons.
- `disabled` (`.ayy-toolbar__button:disabled`) — --ayy-opacity-disabled, not-allowed cursor; the arrow keys skip it (Redo with nothing to redo).
- `selected` (`.ayy-toolbar__button[aria-pressed="true"]`) — The current tool or an applied format: a wash tile with a line-strong hairline and the full text colour. Forced colours: Highlight fill.
- `error` — doesn't apply: Tools don't fail visibly; say so in a toast if an action can't run.
- `loading` — doesn't apply: Tools act at once. A long export shows a Spinner in its own dialog or a toast.
- `open` (`.ayy-toolbar__button[aria-expanded="true"]`) — Its menu or popover is open: drawn like selected.

**Sizes**
- `sm` — Buttons at the sm control height (28px compact, 32 comfortable, 40 touch), 16px icons.
- `md` (default) — Buttons at the md control height (32px compact, 40 comfortable, 44 touch), 20px icons.
- Density — Button size follows data-density (above).
- Width — Hugs its buttons. vertical makes a column; scroll keeps one line that scrolls sideways on phones; a spacer pushes later items to the far end.

**JS (framework-free)**: toolbarClass({ vertical?, floating?, scroll?, size?, className? }) → string; toolbarButtonClass, toolbarGroupClass, toolbarSeparatorClass, toolbarSpacerClass constants; connectToolbar(el) → { refresh, destroy } wires the keyboard pattern on plain markup.

**Custom element** `<ayy-toolbar>` (@danitesler/ayywi/elements) — 
- event `ayy-press`: { button, pressed } before a button's aria-pressed changes; preventDefault() keeps the old state.

**React** — `import { Toolbar, ToolbarButton, ToolbarGroup, ToolbarSeparator, ToolbarSpacer } from "@danitesler/ayywi/react";`
- `<Toolbar>` renders <div role="toolbar" class="ayy-toolbar">. Props: `vertical` boolean — a column; sets aria-orientation="vertical"; `floating` boolean — a raised pill with a shadow; `scroll` boolean — one line that scrolls sideways; `size` "sm" | "md"
- `<ToolbarButton>` renders <button type="button" class="ayy-toolbar__button">. Props: `pressed` boolean — aria-pressed, for tools that stay on; omit for one-off actions
- `<ToolbarGroup>` renders <div role="group" class="ayy-toolbar__group">. Props: 
- `<ToolbarSeparator>` renders <div role="separator" class="ayy-toolbar__separator">. Props: 
- `<ToolbarSpacer>` renders <div aria-hidden="true" class="ayy-toolbar__spacer">. Props: 

**Accessibility**
- role="toolbar" with an aria-label. Tab reaches it once (the last tool used, else the pressed one, else the first); Left/Right (Up/Down when vertical) move between tools, mirrored in RTL; Home/End jump to the ends. Disabled tools are skipped.
- Every icon-only tool needs an aria-label ("Rectangle"), and the name shouldn't change with its state — aria-pressed says whether it's on.
- Text fields and radio groups (swatches, a segmented control) inside keep their own arrow keys; the radio group is one stop.
- On is a wash tile with a hairline, not colour alone; High Contrast fills it with the system highlight.

**Do**
- Use a toolbar for the tools of one surface: an image or canvas editor, a text selection, a media viewer, a table's bulk actions.
- Put the tools that switch modes in a group where one is pressed (the current tool), then separators, then one-off actions (Undo, Redo), then a ToolbarSpacer and the labelled actions (Copy, Save).
- Use vertical for a side rail on wide screens and scroll on phones; floating over a canvas or next to a selection.
- Put a Swatch group (size sm, track) in it for colours, and a DropdownMenu trigger (a ToolbarButton) for overflow.

**Don't**
- Don't use a toolbar for page navigation — use Tabs, the App shell or a Bottom nav — or for a page's one or two actions — use Buttons in a Page header.
- Don't wrap a toolbar onto several lines; scroll it, or move rare tools into a menu.
- Don't make every tool icon-only when there's room: the main action reads better with a label ("Copy").
- Don't give toolbar buttons title tooltips on touch screens; the aria-label is the name.

## Toolbar — Editor tools, undo and a labelled action

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-toolbar> (@danitesler/ayywi/elements): one Tab stop, arrow keys between tools; in a data-exclusive group pressing a tool releases the others. -->
<ayy-toolbar>
  <div role="toolbar" class="ayy-toolbar" aria-label="Annotate" style="inline-size: 100%">
    <div role="group" class="ayy-toolbar__group" aria-label="Tools" data-exclusive="">
      <button type="button" aria-pressed="false" class="ayy-toolbar__button" aria-label="Select"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5.10772 14.3857L5.58594 7.91256C5.61875 7.46854 5.64642 7.05187 5.67232 6.66186C5.85017 3.98379 5.94481 2.55876 7.04807 2.10979C8.15132 1.66082 9.2022 2.61969 11.1771 4.42168C11.4647 4.68413 11.772 4.96446 12.1018 5.26093L16.9102 9.58273C18.2626 10.7983 18.9389 11.4062 18.9934 11.9885C19.0309 12.3882 18.9067 12.7862 18.6489 13.0924C18.2733 13.5385 17.3734 13.6473 15.5737 13.8647C14.8156 13.9563 14.4365 14.0021 14.2073 14.2038C14.0479 14.344 13.9376 14.5321 13.8925 14.7404C13.8277 15.0399 13.9707 15.3964 14.2567 16.1095L15.7394 19.8058C15.9107 20.2328 15.9963 20.4464 15.995 20.6429C15.9932 20.9078 15.8865 21.1609 15.6986 21.3462C15.5591 21.4837 15.3471 21.57 14.9232 21.7425C14.4993 21.915 14.2873 22.0013 14.0921 22C13.8292 21.9982 13.5778 21.8907 13.3939 21.7015C13.2574 21.561 13.1717 21.3475 13.0004 20.9204L11.5177 17.2241C11.2317 16.5111 11.0887 16.1545 10.8355 15.9844C10.6595 15.8662 10.4503 15.8081 10.239 15.8187C9.935 15.834 9.63074 16.0663 9.02224 16.5308C7.57763 17.6337 6.85532 18.1851 6.27746 18.1269C5.88085 18.0871 5.51701 17.8877 5.26831 17.574C4.90595 17.1169 4.9732 16.2065 5.10772 14.3857Z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
      <button type="button" aria-pressed="true" class="ayy-toolbar__button" aria-label="Arrow"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 6.65032C9 6.65032 15.9383 6.10759 16.9154 7.08463C17.8924 8.06167 17.3496 15 17.3496 15M16.5 7.5L6.5 17.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
      <button type="button" aria-pressed="false" class="ayy-toolbar__button" aria-label="Rectangle"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" stroke-width="1.5"></path></svg></button>
      <button type="button" aria-pressed="false" class="ayy-toolbar__button" aria-label="Text"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 21.001H9" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M12 3.00001V21.0008M12 3.00001C13.3874 3.00001 15.1695 3.03055 16.5884 3.17649C17.1885 3.2382 17.4886 3.26906 17.7541 3.37791C18.3066 3.60429 18.7518 4.10063 18.9194 4.67681C19 4.95382 19 5.26992 19 5.90215M12 3.00001C10.6126 3.00001 8.83047 3.03055 7.41161 3.17649C6.8115 3.2382 6.51144 3.26906 6.24586 3.37791C5.69344 3.60429 5.24816 4.10063 5.08057 4.67681C5 4.95382 5 5.26992 5 5.90215" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg></button>
      <button type="button" aria-pressed="false" class="ayy-toolbar__button" aria-label="Highlight"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.6777 16.2071L8.79289 18.3223M6.6777 16.2071L2.5 20.5H6.5L8.79289 18.3223M6.6777 16.2071C6.28717 15.8166 6.29534 15.1872 6.63537 14.752C7.42742 13.7383 7.71531 12.8216 7.79924 12.1382C7.89158 11.3863 8.07366 10.5734 8.60933 10.0377L9.50122 9.14828M8.79289 18.3223C9.18342 18.7128 9.81278 18.7047 10.248 18.3646C11.2617 17.5726 12.1784 17.2847 12.8618 17.2008C13.6137 17.1084 14.4266 16.9263 14.9623 16.3907L15.8517 15.4988M15.8517 15.4988L9.50122 9.14828M15.8517 15.4988C16.2422 15.8893 16.8754 15.8893 17.2659 15.4988L21.5 11.2647M9.50122 9.14828C9.1107 8.75776 9.1107 8.12459 9.50122 7.73407L13.7353 3.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
      <button type="button" aria-pressed="false" class="ayy-toolbar__button" aria-label="Blur"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12.5926 2.21C12.2371 1.93 11.7433 1.93 11.3877 2.21C9.51122 3.66 3.97049 8.39 4.00012 13.9C4.00012 18.36 7.58531 22 12.0001 22C16.4149 22 20 18.37 20 13.91C20.0099 8.48 14.4593 3.67 12.5926 2.21Z" stroke="currentColor" stroke-width="1.5"></path><path d="M12 2V22" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M12 19L20 15M12 14.1806L19 10.5M12 9.36145L16.5727 7" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
    </div>
    <div role="separator" class="ayy-toolbar__separator"></div>
    <button type="button" class="ayy-toolbar__button" aria-label="Undo"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C8.66873 3 5.76018 4.80989 4.20404 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M3 3V4.27816C3 6.47004 3 7.56599 3.70725 8.16512C4.4145 8.76425 5.49553 8.58408 7.6576 8.22373L9 8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
    <button type="button" class="ayy-toolbar__button" aria-label="Redo" disabled=""><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C15.3313 3 18.2398 4.80989 19.796 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M20.9991 3V4.27816C20.9991 6.47004 20.9991 7.56599 20.2918 8.16512C19.5846 8.76425 18.5036 8.58408 16.3415 8.22373L14.9991 8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
    <div aria-hidden="true" class="ayy-toolbar__spacer"></div>
    <button type="button" class="ayy-toolbar__button"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Copy</button>
  </div>
</ayy-toolbar>
```

React:

```tsx
import {
  ArrowUpRight01Icon,
  BlurIcon,
  Copy01Icon,
  Cursor01Icon,
  HighlighterIcon,
  Redo02Icon,
  SquareIcon,
  TextIcon,
  Undo02Icon,
} from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Icon, Toolbar, ToolbarButton, ToolbarGroup, ToolbarSeparator, ToolbarSpacer } from "@danitesler/ayywi/react";

const TOOLS = [
  { id: "select", label: "Select", icon: Cursor01Icon },
  { id: "arrow", label: "Arrow", icon: ArrowUpRight01Icon },
  { id: "rectangle", label: "Rectangle", icon: SquareIcon },
  { id: "text", label: "Text", icon: TextIcon },
  { id: "highlight", label: "Highlight", icon: HighlighterIcon },
  { id: "blur", label: "Blur", icon: BlurIcon },
];

export default function Example() {
  const [tool, setTool] = useState("arrow");
  return (
    <Toolbar aria-label="Annotate" style={{ inlineSize: "100%" }}>
      <ToolbarGroup aria-label="Tools" data-exclusive="">
        {TOOLS.map((t) => (
          <ToolbarButton key={t.id} aria-label={t.label} pressed={tool === t.id} onClick={() => setTool(t.id)}>
            <Icon icon={t.icon} />
          </ToolbarButton>
        ))}
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarButton aria-label="Undo">
        <Icon icon={Undo02Icon} />
      </ToolbarButton>
      <ToolbarButton aria-label="Redo" disabled>
        <Icon icon={Redo02Icon} />
      </ToolbarButton>
      <ToolbarSpacer />
      <ToolbarButton>
        <Icon icon={Copy01Icon} />
        Copy
      </ToolbarButton>
    </Toolbar>
  );
}
```

## Toolbar — Floating formatting bar

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- Buttons with aria-pressed toggle on click inside <ayy-toolbar>; listen for "ayy-press" to apply the format. -->
<ayy-toolbar>
  <div role="toolbar" class="ayy-toolbar ayy-toolbar--floating ayy-toolbar--sm" aria-label="Text formatting">
    <button type="button" aria-pressed="true" class="ayy-toolbar__button" aria-label="Bold"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 6C5 4.58579 5 3.87868 5.43934 3.43934C5.87868 3 6.58579 3 8 3H12.5789C15.0206 3 17 5.01472 17 7.5C17 9.98528 15.0206 12 12.5789 12H5V6Z" stroke="currentColor" fill-rule="evenodd" clip-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M12.4286 12H13.6667C16.0599 12 18 14.0147 18 16.5C18 18.9853 16.0599 21 13.6667 21H8C6.58579 21 5.87868 21 5.43934 20.5607C5 20.1213 5 19.4142 5 18V12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
    <button type="button" aria-pressed="false" class="ayy-toolbar__button" aria-label="Italic"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4H19" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M8 20L16 4" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M5 20H12" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg></button>
    <button type="button" aria-pressed="false" class="ayy-toolbar__button" aria-label="Underline"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5.5 3V11.5C5.5 15.0899 8.41015 18 12 18C15.5899 18 18.5 15.0899 18.5 11.5V3" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M3 21H21" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg></button>
    <div role="separator" class="ayy-toolbar__separator"></div>
    <button type="button" class="ayy-toolbar__button"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9.14339 10.691L9.35031 10.4841C11.329 8.50532 14.5372 8.50532 16.5159 10.4841C18.4947 12.4628 18.4947 15.671 16.5159 17.6497L13.6497 20.5159C11.671 22.4947 8.46279 22.4947 6.48405 20.5159C4.50532 18.5372 4.50532 15.329 6.48405 13.3503L6.9484 12.886" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M17.0516 11.114L17.5159 10.6497C19.4947 8.67095 19.4947 5.46279 17.5159 3.48405C15.5372 1.50532 12.329 1.50532 10.3503 3.48405L7.48405 6.35031C5.50532 8.32904 5.50532 11.5372 7.48405 13.5159C9.46279 15.4947 12.671 15.4947 14.6497 13.5159L14.8566 13.309" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg>Link</button>
    <button type="button" class="ayy-toolbar__button" aria-label="Delete"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M9.5 16.5L9.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M14.5 16.5L14.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg></button>
  </div>
</ayy-toolbar>
```

React:

```tsx
import { Delete02Icon, Link01Icon, TextBoldIcon, TextItalicIcon, TextUnderlineIcon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Icon, Toolbar, ToolbarButton, ToolbarSeparator } from "@danitesler/ayywi/react";

export default function Example() {
  const [bold, setBold] = useState(true);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  return (
    <Toolbar aria-label="Text formatting" floating size="sm">
      <ToolbarButton aria-label="Bold" pressed={bold} onClick={() => setBold(!bold)}>
        <Icon icon={TextBoldIcon} />
      </ToolbarButton>
      <ToolbarButton aria-label="Italic" pressed={italic} onClick={() => setItalic(!italic)}>
        <Icon icon={TextItalicIcon} />
      </ToolbarButton>
      <ToolbarButton aria-label="Underline" pressed={underline} onClick={() => setUnderline(!underline)}>
        <Icon icon={TextUnderlineIcon} />
      </ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton>
        <Icon icon={Link01Icon} />
        Link
      </ToolbarButton>
      <ToolbarButton aria-label="Delete">
        <Icon icon={Delete02Icon} />
      </ToolbarButton>
    </Toolbar>
  );
}
```

## Toolbar — Vertical rail

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- aria-orientation="vertical": the up and down arrows move between tools. -->
<ayy-toolbar>
  <div role="toolbar" aria-orientation="vertical" class="ayy-toolbar ayy-toolbar--vertical ayy-toolbar--floating" aria-label="Drawing tools">
    <div role="group" class="ayy-toolbar__group" data-exclusive="">
      <button type="button" aria-pressed="false" class="ayy-toolbar__button" aria-label="Select"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5.10772 14.3857L5.58594 7.91256C5.61875 7.46854 5.64642 7.05187 5.67232 6.66186C5.85017 3.98379 5.94481 2.55876 7.04807 2.10979C8.15132 1.66082 9.2022 2.61969 11.1771 4.42168C11.4647 4.68413 11.772 4.96446 12.1018 5.26093L16.9102 9.58273C18.2626 10.7983 18.9389 11.4062 18.9934 11.9885C19.0309 12.3882 18.9067 12.7862 18.6489 13.0924C18.2733 13.5385 17.3734 13.6473 15.5737 13.8647C14.8156 13.9563 14.4365 14.0021 14.2073 14.2038C14.0479 14.344 13.9376 14.5321 13.8925 14.7404C13.8277 15.0399 13.9707 15.3964 14.2567 16.1095L15.7394 19.8058C15.9107 20.2328 15.9963 20.4464 15.995 20.6429C15.9932 20.9078 15.8865 21.1609 15.6986 21.3462C15.5591 21.4837 15.3471 21.57 14.9232 21.7425C14.4993 21.915 14.2873 22.0013 14.0921 22C13.8292 21.9982 13.5778 21.8907 13.3939 21.7015C13.2574 21.561 13.1717 21.3475 13.0004 20.9204L11.5177 17.2241C11.2317 16.5111 11.0887 16.1545 10.8355 15.9844C10.6595 15.8662 10.4503 15.8081 10.239 15.8187C9.935 15.834 9.63074 16.0663 9.02224 16.5308C7.57763 17.6337 6.85532 18.1851 6.27746 18.1269C5.88085 18.0871 5.51701 17.8877 5.26831 17.574C4.90595 17.1169 4.9732 16.2065 5.10772 14.3857Z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
      <button type="button" aria-pressed="true" class="ayy-toolbar__button" aria-label="Pen"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
      <button type="button" aria-pressed="false" class="ayy-toolbar__button" aria-label="Arrow"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 6.65032C9 6.65032 15.9383 6.10759 16.9154 7.08463C17.8924 8.06167 17.3496 15 17.3496 15M16.5 7.5L6.5 17.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
      <button type="button" aria-pressed="false" class="ayy-toolbar__button" aria-label="Rectangle"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" stroke-width="1.5"></path></svg></button>
      <button type="button" aria-pressed="false" class="ayy-toolbar__button" aria-label="Ellipse"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></circle></svg></button>
      <button type="button" aria-pressed="false" class="ayy-toolbar__button" aria-label="Text"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 21.001H9" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M12 3.00001V21.0008M12 3.00001C13.3874 3.00001 15.1695 3.03055 16.5884 3.17649C17.1885 3.2382 17.4886 3.26906 17.7541 3.37791C18.3066 3.60429 18.7518 4.10063 18.9194 4.67681C19 4.95382 19 5.26992 19 5.90215M12 3.00001C10.6126 3.00001 8.83047 3.03055 7.41161 3.17649C6.8115 3.2382 6.51144 3.26906 6.24586 3.37791C5.69344 3.60429 5.24816 4.10063 5.08057 4.67681C5 4.95382 5 5.26992 5 5.90215" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg></button>
    </div>
  </div>
</ayy-toolbar>
```

React:

```tsx
import { ArrowUpRight01Icon, CircleIcon, Cursor01Icon, PencilEdit02Icon, SquareIcon, TextIcon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Icon, Toolbar, ToolbarButton, ToolbarGroup } from "@danitesler/ayywi/react";

const TOOLS = [
  { id: "select", label: "Select", icon: Cursor01Icon },
  { id: "pen", label: "Pen", icon: PencilEdit02Icon },
  { id: "arrow", label: "Arrow", icon: ArrowUpRight01Icon },
  { id: "rectangle", label: "Rectangle", icon: SquareIcon },
  { id: "ellipse", label: "Ellipse", icon: CircleIcon },
  { id: "text", label: "Text", icon: TextIcon },
];

export default function Example() {
  const [tool, setTool] = useState("pen");
  return (
    <Toolbar aria-label="Drawing tools" vertical floating>
      <ToolbarGroup data-exclusive="">
        {TOOLS.map((t) => (
          <ToolbarButton key={t.id} aria-label={t.label} pressed={tool === t.id} onClick={() => setTool(t.id)}>
            <Icon icon={t.icon} />
          </ToolbarButton>
        ))}
      </ToolbarGroup>
    </Toolbar>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
