# Menu: submenus and more item types

A request for the Dropdown menu component (`src/components/menu/`). The menu today has plain
items, destructive items, shortcuts, group labels and separators, plus CSS for checked
`menuitemcheckbox` / `menuitemradio` rows. It can't show more options from a row, and its rules
say "Don't nest menus". Apps need both, so this plan adds a submenu and a few other row types.

It comes from Takerr (a screenshot app built on ayywi). Takerr built its own submenu for a
"Self-Timer" row that opens "in 3 / 5 / 10 seconds" beside it. The lessons from that are listed
under each part, so the shared component avoids the same bugs.

Each part below is a separate change. Do them in this order. Every one needs its classes, states
and sizes in `menu.meta.json` (the contract check fails otherwise), an example, the React
component, `<ayy-menu>` support, tests, docs and a CHANGELOG entry.

---

## 1. Submenu (a row that opens more options beside the menu)

### What it is

A menu row whose label is followed by a chevron (›) at the inline end. Hovering it, focusing it
or pressing ArrowRight opens a second panel **next to** the menu with that row's items. Choosing
an item in the panel runs it and closes the whole menu. The parent row itself never runs an action.

Use it to keep a menu short when one action has variants: "Self-timer → 3s / 5s / 10s",
"Export → PNG / JPG / PDF", "Move to → (list of folders)", "Sort by → …".

### Looks

- Parent row: a normal `.ayy-menu__item` with a chevron at the inline end where a shortcut would
  go (`margin-inline-start: auto`, muted colour). The chevron points to the inline end, so it
  mirrors in RTL.
- While its panel is open, the parent row keeps the hover background (`--ayy-color-wash-hover`),
  so you can see which row the panel belongs to.
- Panel: the same surface as `.ayy-menu` (border, radius, raised surface, overlay shadow, open
  animation). Its width fits its content, with the menu's own min/max widths.

### Placement (the part Takerr got wrong first)

- The panel opens to the **inline end** of the menu (right in LTR) with a small gap
  (`--ayy-space-1`). Its **first item lines up with the parent row**, so the panel's top edge sits
  above the row by the panel's padding plus border.
- When there's no room at the inline end, it opens at the inline start instead. Measure against
  the viewport, or against a boundary the host gives (see "Host-sized windows" below).
- Vertically, keep the panel inside the boundary: if it would run off the bottom, move it up
  until it fits, and never above the top.
- **The panel must not render inside the menu's scrolling box.** `.ayy-menu` may have
  `overflow: auto` (long menus scroll), and that clips an absolutely positioned child, so the
  panel gets cut off or never shows. Render it as its own popover (the `popover` attribute puts
  it in the top layer) or portal it out, and position it from the parent row's bounding box.
  Takerr's first version put the panel inside the row with `position: absolute;
  inset-block-end: 100%`. It floated over the rows above and got clipped. Don't do that.

### Hover behaviour

- Pointer onto the parent row: open after a short delay (about 100 ms), so sweeping down the
  list doesn't flash panels.
- Pointer onto another row of the main menu: close the panel, after the same delay.
- **Moving diagonally from the parent row into the panel must not close it.** Add a "safe
  triangle" (pointer-intent cone). While the pointer moves inside the triangle from where it
  left the row to the panel's near corners, other rows don't take hover. Without it, crossing
  the row below on the way to the panel closes the panel.
- The pointer leaving the menu completely (into empty space) leaves the panel open. Clicking
  outside closes everything, as now.
- Clicking the parent row opens the panel at once (for touch and for people who click).

### Keyboard (WAI-ARIA menu pattern)

| Key | On the parent row | Inside the panel |
|---|---|---|
| ArrowRight (ArrowLeft in RTL) | Opens the panel and focuses its first item | — |
| Enter / Space | Same as ArrowRight | Runs the item and closes everything |
| ArrowLeft (ArrowRight in RTL) | — | Closes the panel, focus back to the parent row |
| Esc | Closes the menu | Closes **only the panel**, focus back to the parent row; a second Esc closes the menu |
| ArrowUp / ArrowDown, Home / End, type-ahead | Move in the main menu (close any open panel) | Move inside the panel only |
| Tab | Closes everything (as now) | Closes everything |

### Accessibility

- Parent row: `role="menuitem"`, `aria-haspopup="menu"`, `aria-expanded="true|false"`,
  `aria-controls` = the panel's id.
- Panel: `role="menu"`, `aria-labelledby` = the parent row.
- Disabled parent rows (`disabled` / `aria-disabled`) don't open, and the arrow keys skip them
  as they skip other disabled items.
- The chevron is `aria-hidden`.

### Depth

Support one level. A submenu inside a submenu technically works if the code is recursive, but the
docs should say: one level; if you need more, use a dialog or Command.

### Host-sized windows (desktop apps)

In a desktop app, the menu often lives in its own transparent window that's exactly the size of
the menu (Tauri, Electron). There, a panel beside the menu falls outside the window and isn't
drawn. The component can't resize the window, but it can make that easy:

- An `onPanelLayout({ open, width, height, side })` callback (React prop / element event
  `ayy-submenu-layout`) that fires when a panel opens, closes or changes size. It reports the room
  the panel needs beside the menu. The host then grows its window and says which side it went.
- A `boundary` option (an element or a rect) so "is there room on the right?" is measured against
  the host's screen area, not the window's viewport.
- A way for the host to force the side (`side="end" | "start"`). Takerr's Rust code decides
  the side from the monitor's edge, then tells the page.

### API sketch

React:

```tsx
<DropdownMenuSub>
  <DropdownMenuSubTrigger icon={<TimerIcon />}>Self-timer</DropdownMenuSubTrigger>
  <DropdownMenuSubContent>
    <DropdownMenuItem onSelect={() => capture(3)}>In 3 seconds</DropdownMenuItem>
    <DropdownMenuItem onSelect={() => capture(5)}>In 5 seconds</DropdownMenuItem>
  </DropdownMenuSubContent>
</DropdownMenuSub>
```

HTML / `<ayy-menu>`: a `.ayy-menu__item.ayy-menu__item--sub` button with
`aria-haspopup="menu"`, followed by a `[popover].ayy-menu.ayy-menu--sub` panel. `connectMenu`
finds the pairs and wires them up. `ayy-select` fires for items in panels too, with the same
`{ value, item }` payload.

New classes: `ayy-menu__item--sub` (the parent row, which draws the chevron), `ayy-menu--sub`
(the panel), `ayy-menu__chevron` if the chevron is a separate element.

New states for the meta: `open` on the parent row (`[aria-expanded="true"]`, which keeps the
hover background) and on the panel.

### Docs changes

- Replace "Don't nest menus." with: "Nest one level at most, for variants of one action. Don't
  hide frequent actions in a submenu."
- `aka`: add `submenu`, `nested-menu`, `flyout`, `cascading-menu`.

### Tests

- Opens on hover after the delay; doesn't open while you sweep past.
- The diagonal move into the panel keeps it open (pointer path across the row below).
- Opens at the inline end, flips to the start near the right edge, and mirrors in RTL.
- Moves up to stay inside a short viewport.
- Not clipped when the main menu scrolls (main menu with `max-block-size` and `overflow: auto`).
- Every key in the table above, including the first Esc closing only the panel.
- Picking a panel item fires `onSelect` / `ayy-select` once and closes both.

---

## 2. Inline expandable section (an accordion inside the menu)

### What it is

A row that expands its items **in place, below itself**, pushing the rows under it down, instead
of opening a side panel. It's the accordion version of a submenu.

Use it when a side panel doesn't fit or feels wrong:
- touch and narrow screens (phones, sheets);
- menus in a fixed-size window that can't grow sideways;
- "More options" that reveal a few rarely used rows.

The submenu should **switch to this on its own** for coarse pointers or a narrow boundary
(`(pointer: coarse)`, or a boundary narrower than the menu plus the panel). The same markup then
works on every device.

### Looks and behaviour

- The row has a chevron at the inline end that points down and turns up when open (like
  `.ayy-accordion__trigger`).
- Its children are indented by the icon width plus gap, so their text lines up with the parent's
  label. They roll open with the accordion's motion and respect `prefers-reduced-motion`.
- By default only one section is open at a time (opening one closes the others), like an
  accordion with a shared name. An option allows several.
- Click, Enter, Space or ArrowRight expand it; ArrowLeft or a second click collapse it. When it
  expands, focus stays on the row. ArrowDown then walks into the children, and they join the
  normal up/down order.
- The menu's height changes, so a host-sized window needs the same resize callback as the
  submenu (height this time).

### Accessibility

The row is `role="menuitem"` with `aria-expanded` and `aria-controls`. Its children sit in a
`role="group"` labelled by the row, and stay `menuitem`s.

### Classes and API

`ayy-menu__item--expand` (the row), `ayy-menu__group--inline` (the children), with an `open`
state. React: `<DropdownMenuSub inline>` or a separate `DropdownMenuSection` with a
`defaultOpen` prop.

---

## 3. React components for check and radio rows

The CSS for checked rows exists (`[aria-checked="true"]`: semibold with a check at the inline
end), but React has no components for them, so apps build them by hand.

- `DropdownMenuCheckboxItem`: `checked`, `onCheckedChange`, renders
  `role="menuitemcheckbox"`.
- `DropdownMenuRadioGroup` (`value`, `onValueChange`, `role="group"`) with
  `DropdownMenuRadioItem` (`value`, `role="menuitemradio"`).
- **Toggling one doesn't close the menu by default** (people often flip several view options).
  A `closeOnSelect` prop changes that.
- Use them with a submenu for "Sort by → Name / Date / Size". The parent row can show the current
  choice (see 4).

---

## 4. A value or badge at the end of a row

A muted text at the inline end, in the shortcut's place: the current choice of a submenu
("Self-timer · 5s"), a count ("Unread · 12"), or a small badge ("New").

- `.ayy-menu__value`: muted, `--ayy-text-xs`, never wraps. On a submenu parent it sits before the
  chevron.
- Badges use the existing Badge component at its smallest size; don't add a menu-only badge.
- React: a `value` prop on `DropdownMenuItem` and `DropdownMenuSubTrigger`.

---

## 5. A row with a description

A second line under the label, for actions that need a few words of explanation ("Capture area —
drag to select part of the screen").

- `.ayy-menu__item--described` lets the row grow taller (`min-block-size` stays the control
  height; padding on both block sides). The description is `.ayy-menu__description`: soft text
  colour, `--ayy-text-xs`, which may wrap to two lines. The icon aligns with the label, not the
  centre.
- `aria-describedby` points from the item to its description, so the label stays the accessible
  name and type-ahead still matches it.
- Docs: use it sparingly; a menu where every row has one should probably be a list or a dialog.

---

## 6. Opening at a point (context menus) and a static menu

Two ways to show the same menu without a trigger button. Takerr needs both: it opens the menu at
the pointer from a global shortcut, and inside its own window the menu is always shown.

- **At a point**: `connectMenu(null, content, { at: { x, y } })` or a `openAt(x, y)` on the
  controller, and in React `<DropdownMenu anchorPoint={{ x, y }}>`. It opens with its top-start
  corner at the point and flips up or to the start when it would run off the boundary (same
  boundary option as the submenu). Right-click helper: `onContextMenu` on any element opens it at
  the pointer and prevents the browser's menu. Focus goes back to whatever had it before.
- **Static**: `.ayy-menu--static` shows the menu as a normal box (no popover, no open/close
  animation, opacity 1), still with the full keyboard model. For menus that are the whole window
  (desktop pop-up menus) or are embedded in a page. Today Takerr overrides `.ayy-menu`'s popover
  styles by hand to do this.

---

## Not in scope (say so in the docs)

- Form fields, sliders or search boxes inside a menu: use Popover, or Command for a menu you
  filter by typing.
- Navigation between pages: use links.
- More than one level of submenus.
