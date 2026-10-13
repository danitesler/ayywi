# Dropdown menu

Category: Actions. List of actions that opens from a button. Native popover + WAI-ARIA menu keyboard model (arrows, Home/End, type-ahead, Esc/Tab), submenus and inline expandable sections. Also called: menu, dropdown, dropdown-menu, context-menu, menu-item, submenu, nested-menu, cascading-menu.

**Classes**
- `.ayy-menu` — On the element with popover and role="menu".
- `.ayy-menu--sub` — Submenu flyout panel.
- `.ayy-menu--static` — Static menu rendered inline in a page or window without popover behavior.
- `.ayy-menu__item` — Each action: a <button role="menuitem">.
- `.ayy-menu__item--destructive` — Red item for destructive actions.
- `.ayy-menu__item--sub` — Submenu parent row with an inline-end chevron.
- `.ayy-menu__item--expand` — Inline accordion row that expands its items below itself.
- `.ayy-menu__item--described` — Two-line row with an aligned label and soft description.
- `.ayy-menu__item-text` — Text container for a described row's label and description.
- `.ayy-menu__description` — Soft description text under a described row's label.
- `.ayy-menu__value` — Muted text or badge before the chevron or shortcut.
- `.ayy-menu__chevron` — Chevron icon pointing towards the inline end or down when expandable.
- `.ayy-menu__group--inline` — Indented role="group" of items revealed by an expandable row.
- `.ayy-menu__shortcut` — Keyboard shortcut hint at the end of an item.
- `.ayy-menu__label` — Small uppercase group label.
- `.ayy-menu__separator` — Divider (role="separator").

**States**
- `default` — Raised surface panel with a line-strong border and the overlay shadow; items are transparent rows with muted icons.
- `hover` (`.ayy-menu__item:hover`) — Item gets the wash-hover background.
- `pressed` — doesn't apply: Items have no pressed look: activating one runs it and closes the menu.
- `focus` (`.ayy-menu__item:focus (arrow keys) / :focus-visible`) — Focused item gets the wash-hover background; keyboard focus adds a 2px ring inset by 2px. Forced colours: Highlight fill.
- `disabled` (`.ayy-menu__item:disabled or [aria-disabled="true"]`) — Item dims to --ayy-opacity-disabled with a not-allowed cursor; arrow keys skip it.
- `selected` (`.ayy-menu__item[aria-checked="true"] on role="menuitemradio" or "menuitemcheckbox"`) — Semibold with a check at the inline end, drawn in currentColor. For view options in a menu (density, sort, show/hide columns); to choose a form value, use Select.
- `error` — doesn't apply: A menu has no error state; report a failed command with a toast.
- `loading` — doesn't apply: Build the items before opening; if they load, put the trigger Button in loading until they're ready.
- `open` (`:popover-open or [aria-expanded="true"] on parent row`) — Fades in and scales up from 97%; parent rows keep the hover background while open.

**Sizes**
- Density — Items are the md control height (32px compact, 40 comfortable, 44 touch) with control md text.
- Width — At least 11rem, at most 20rem (or the viewport minus 1rem); grows with its longest item.

**JS (framework-free)**: menuItemClass({ destructive?, sub?, expand?, described?, className? }); menuClass, menuLabelClass, menuSeparatorClass, menuShortcutClass, menuValueClass, menuChevronClass, menuDescriptionClass, menuGroupInlineClass constants; connectMenu(trigger, content, { side?, align?, at?, boundary?, static?, subSide?, onSelect?, onToggle?, onSubmenuLayout? })

**Custom element** `<ayy-menu>` (@danitesler/ayywi/elements) — A trigger <button> and a [popover] element with role="menu" containing .ayy-menu__item buttons, optional submenu panels, and expandable groups.
- attribute `side`: bottom | top | start | end
- attribute `align`: start | center | end
- attribute `open`: Two-way open state
- event `ayy-select`: { value: string, item: HTMLElement } — value is the item's data-value, else its text
- event `ayy-open-change`: { open: boolean }
- event `ayy-submenu-layout`: { open: boolean, width: number, height: number, side: FloatingSide }

**React** — `import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@danitesler/ayywi/react";`
- `<DropdownMenu>` renders nothing (state provider). Props: `open / defaultOpen` boolean; `onOpenChange` (open: boolean) => void; `anchorPoint` { x: number, y: number }; `boundary` Element | Rect
- `<DropdownMenuTrigger>` renders Button. Props: `...ButtonProps` variant, size…
- `<DropdownMenuContent>` renders <div popover role="menu">. Props: `side` "bottom" | "top" | "start" | "end"; `align` "start" | "center" | "end"; `static` boolean; `boundary` Element | Rect; `subSide` "end" | "start"; `onSubmenuLayout` (layout) => void
- `<DropdownMenuItem>` renders <button role="menuitem">. Props: `onSelect` () => void — runs when chosen; the menu then closes unless closeOnSelect=false; `destructive` boolean; `shortcut` string — hint like "⌘D"; `value` ReactNode; `description` ReactNode; `icon` ReactNode; `closeOnSelect` boolean
- `<DropdownMenuLabel>` renders <div role="presentation">.
- `<DropdownMenuSeparator>` renders <div role="separator">.
- `<DropdownMenuSub>` renders nothing (submenu state provider). Props: `open / defaultOpen` boolean; `onOpenChange` (open: boolean) => void; `inline` boolean
- `<DropdownMenuSubTrigger>` renders <button role="menuitem" aria-haspopup="menu">. Props: `icon` ReactNode; `value` ReactNode; `description` ReactNode
- `<DropdownMenuSubContent>` renders <div popover role="menu"> or <div role="group"> (inline). Props: `side` "end" | "start"; `align` "start"
- `<DropdownMenuCheckboxItem>` renders <button role="menuitemcheckbox">. Props: `checked` boolean; `onCheckedChange` (checked: boolean) => void; `closeOnSelect` boolean
- `<DropdownMenuRadioGroup>` renders <div role="group">. Props: `value` string; `onValueChange` (value: string) => void; `closeOnSelect` boolean
- `<DropdownMenuRadioItem>` renders <button role="menuitemradio">. Props: `value` string

**Accessibility**
- Opening moves focus to the first item; arrows move, Home/End jump, letters jump to matching items.
- ArrowRight / ArrowLeft open and close submenus (mirrored in RTL); Esc inside a submenu closes only that panel.
- Esc or Tab closes the menu and focus returns to the trigger.
- Icon-only triggers (⋯) need aria-label.

**Do**
- Use a menu for an item's secondary actions (rename, duplicate, delete) and for overflow “⋯” menus in toolbars and table rows.
- Nest one level at most, for variants of one action. Don't hide frequent actions in a submenu.
- Put destructive actions last, after a separator.
- Keep item labels to a verb + noun: "Rename project".

**Don't**
- Don't use a menu to choose a value in a form — use Select or Radio.
- Don't use a menu to navigate between pages — use links.
- Don't put form fields or rich content in a menu — use Popover.
- Don't nest submenus more than one level.

## Dropdown menu — Item actions

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-menu> (@danitesler/ayywi/elements) adds placement and the menu keyboard model, and fires "ayy-select" with the item's data-value. -->
<ayy-menu>
  <button type="button" class="ayy-button ayy-button--outline" popovertarget="project-menu-html" aria-haspopup="menu">Project actions</button>
  <div class="ayy-menu" id="project-menu-html" popover role="menu">
    <div class="ayy-menu__label" role="presentation">Marketing site</div>
    <button type="button" class="ayy-menu__item" role="menuitem" data-value="rename">
      <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"/><path d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
      Rename <span class="ayy-menu__shortcut">⌘R</span>
    </button>
    <button type="button" class="ayy-menu__item" role="menuitem" data-value="duplicate">
      <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
      Duplicate <span class="ayy-menu__shortcut">⌘D</span>
    </button>
    <button type="button" class="ayy-menu__item" role="menuitem" disabled>
      <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M11 13C10.6446 13.0097 10.3134 13.0226 10.0008 13.0379C6.3 13.2193 3.28417 16.3058 3 20.0002" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><circle cx="11" cy="6" r="4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M17.5 20.5C15.2909 20.5 13.5 18.7091 13.5 16.5M17 13C19.2091 13 21 14.7909 21 17M17 14.5V11.5L15.5 13L17 14.5ZM17.5 19V22L19 20.5L17.5 19Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
      Transfer ownership
    </button>
    <div class="ayy-menu__separator" role="separator"></div>
    <button type="button" class="ayy-menu__item ayy-menu__item--destructive" role="menuitem" data-value="delete">
      <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/><path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/><path d="M9.5 16.5L9.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/><path d="M14.5 16.5L14.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/></svg>
      Delete project
    </button>
  </div>
</ayy-menu>
```

React:

```tsx
import { Copy01Icon, Delete02Icon, PencilEdit02Icon, UserSwitchIcon } from "@hugeicons/core-free-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Icon,
  toast,
} from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger variant="outline">Project actions</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Marketing site</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => toast("Rename")} shortcut="⌘R">
          <Icon icon={PencilEdit02Icon} />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => toast("Duplicated")} shortcut="⌘D">
          <Icon icon={Copy01Icon} />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Icon icon={UserSwitchIcon} />
          Transfer ownership
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive onSelect={() => toast.error("Project deleted")}>
          <Icon icon={Delete02Icon} />
          Delete project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

## Dropdown menu — Submenus and options

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-menu> (@danitesler/ayywi/elements) supports submenus and inline expandable groups. -->
<ayy-menu>
  <button type="button" class="ayy-button ayy-button--outline" popovertarget="capture-menu-html" aria-haspopup="menu">Capture options</button>
  <div class="ayy-menu" id="capture-menu-html" popover role="menu">
    <div class="ayy-menu__label" role="presentation">Takerr</div>
    <button type="button" class="ayy-menu__item ayy-menu__item--described" role="menuitem" data-value="capture-area">
      <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 3V18C6 19.8856 6 20.8284 6.58579 21.4142C7.17157 22 8.11438 22 10 22H21" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/><path d="M18 21V6C18 4.11438 18 3.17157 17.4142 2.58579C16.8284 2 15.8856 2 14 2H3" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/></svg>
      <span class="ayy-menu__item-text">
        <span>Capture area</span>
        <span class="ayy-menu__description">Drag to select part of the screen</span>
      </span>
      <span class="ayy-menu__shortcut">⌘4</span>
    </button>

    <button type="button" class="ayy-menu__item ayy-menu__item--sub" role="menuitem" aria-haspopup="menu" aria-expanded="false" aria-controls="submenu-timer">
      <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 8V12L14.5 14.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
      Self-timer
      <span class="ayy-menu__value">5s</span>
      <span class="ayy-menu__chevron" aria-hidden="true"></span>
    </button>
    <div class="ayy-menu ayy-menu--sub" id="submenu-timer" popover role="menu">
      <div role="group">
        <button type="button" class="ayy-menu__item" role="menuitemradio" aria-checked="false" data-value="off">Off</button>
        <button type="button" class="ayy-menu__item" role="menuitemradio" aria-checked="false" data-value="3">In 3 seconds</button>
        <button type="button" class="ayy-menu__item" role="menuitemradio" aria-checked="true" data-value="5">In 5 seconds</button>
        <button type="button" class="ayy-menu__item" role="menuitemradio" aria-checked="false" data-value="10">In 10 seconds</button>
      </div>
    </div>

    <button type="button" class="ayy-menu__item ayy-menu__item--sub" role="menuitem" aria-haspopup="menu" aria-expanded="false" aria-controls="submenu-format">
      <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 15V3M12 15L8 11M12 15L16 11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M2 17L2.62112 19.4845C2.84655 20.3862 3.65922 21 4.58988 21H19.4101C20.3408 21 21.1535 20.3862 21.3789 19.4845L22 17" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/></svg>
      Export format
      <span class="ayy-menu__value">PNG</span>
      <span class="ayy-menu__chevron" aria-hidden="true"></span>
    </button>
    <div class="ayy-menu ayy-menu--sub" id="submenu-format" popover role="menu">
      <div role="group">
        <button type="button" class="ayy-menu__item" role="menuitemradio" aria-checked="true" data-value="png">PNG (lossless)</button>
        <button type="button" class="ayy-menu__item" role="menuitemradio" aria-checked="false" data-value="jpg">JPG (compressed)</button>
        <button type="button" class="ayy-menu__item" role="menuitemradio" aria-checked="false" data-value="pdf">PDF (document)</button>
      </div>
    </div>

    <button type="button" class="ayy-menu__item ayy-menu__item--expand" role="menuitem" aria-expanded="false" aria-controls="menu-inline-options">
      <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"/><path d="M2 17L12 22L22 17" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"/><path d="M2 12L12 17L22 12" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"/></svg>
      Advanced options
      <span class="ayy-menu__chevron" aria-hidden="true"></span>
    </button>
    <div class="ayy-menu__group--inline" id="menu-inline-options" role="group" hidden>
      <button type="button" class="ayy-menu__item" role="menuitemcheckbox" aria-checked="true" data-value="pointer">
        Include pointer
      </button>
    </div>

    <div class="ayy-menu__separator" role="separator"></div>
    <button type="button" class="ayy-menu__item" role="menuitem" data-value="fullscreen">
      <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="13" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M9 3H15L16.5 5H20C21.1046 5 22 5.89543 22 7V19C22 20.1046 21.1046 21 20 21H4C2.89543 21 2 20.1046 2 19V7C2 5.89543 2.89543 5 4 5H7.5L9 3Z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"/></svg>
      Full screen <span class="ayy-menu__shortcut">⌘3</span>
    </button>
  </div>
</ayy-menu>
```

React:

```tsx
import { useState } from "react";
import {
  Camera01Icon,
  Clock01Icon,
  CropIcon,
  Download01Icon,
  Layers01Icon,
} from "@hugeicons/core-free-icons";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Icon,
  toast,
} from "@danitesler/ayywi/react";

export default function Example() {
  const [timer, setTimer] = useState("off");
  const [format, setFormat] = useState("png");
  const [showCursor, setShowCursor] = useState(true);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger variant="outline">Capture options</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Takerr</DropdownMenuLabel>
        <DropdownMenuItem
          icon={<Icon icon={CropIcon} />}
          description="Drag to select part of the screen"
          onSelect={() => toast("Capture area")}
          shortcut="⌘4"
        >
          Capture area
        </DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger
            icon={<Icon icon={Clock01Icon} />}
            value={timer === "off" ? "Off" : `${timer}s`}
          >
            Self-timer
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={timer} onValueChange={(val) => { setTimer(val); toast(`Timer: ${val}s`); }}>
              <DropdownMenuRadioItem value="off">Off</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="3">In 3 seconds</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="5">In 5 seconds</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="10">In 10 seconds</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger icon={<Icon icon={Download01Icon} />} value={format.toUpperCase()}>
            Export format
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={format} onValueChange={(val) => { setFormat(val); toast(`Format: ${val.toUpperCase()}`); }}>
              <DropdownMenuRadioItem value="png">PNG (lossless)</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="jpg">JPG (compressed)</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="pdf">PDF (document)</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub inline>
          <DropdownMenuSubTrigger icon={<Icon icon={Layers01Icon} />}>
            Advanced options
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuCheckboxItem
              checked={showCursor}
              onCheckedChange={(checked) => {
                setShowCursor(checked);
                toast(checked ? "Cursor included" : "Cursor hidden");
              }}
            >
              Include pointer
            </DropdownMenuCheckboxItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          icon={<Icon icon={Camera01Icon} />}
          onSelect={() => toast("Screen captured")}
          shortcut="⌘3"
        >
          Full screen
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---
Part of @danitesler/ayywi 0.0.3: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
