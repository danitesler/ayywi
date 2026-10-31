# Component sizes

ayywi sized buttons, inputs, selects and a handful of controls. Most of the rest of the library had one size. This
records what other systems size, what we added, and what is left.

## How the research was done

The systems' docs sites weren't reachable from the sandbox, so I read the published npm packages instead: the type
definitions and recipes list every component that takes a size, and by which values. That is better evidence than a docs
page, with one gap: Radix Themes defines Button, Checkbox, Tabs and its menus' sizes in shared base files I didn't parse,
so its counts below are a floor.

Packages read: `@radix-ui/themes` 3.3.0, `@mantine/core` 9.7.4, `@chakra-ui/react` 3.37.0, `antd` 6.6.8,
`@mui/material` 9.5.0, plus `bootstrap` 5.3.8 and `@carbon/styles` 1.118.0 for class names.

## What they do

| System | Scale | Components with a size | Notes |
|---|---|---|---|
| Chakra v3 | `2xs`–`2xl` | ~55 recipes | Nearly everything with a visual footprint, including Alert, Card, Accordion, Table, Tabs, Steps, Menu, Kbd, Stat, Tree view, Empty state |
| Mantine 9 | `xs`–`xl` | ~50 | Form controls, Pagination, Stepper, Pill, Kbd, Accordion, Avatar, Data list, Empty state, Toolbar. Not Tabs, Alert, Card or Menu |
| Radix Themes | `1`–`3` (Card to `5`, Avatar and text to `9`) | ~30 verified | Alert (Callout), Card, Checkbox/Radio cards, Data list, Popover, Table, Switch, Slider, Kbd |
| Ant Design | `small`/`middle`/`large` | ~30 | Also a global `componentSize` on `ConfigProvider`: one setting sizes every descendant |
| MUI | `small`/`medium` (a few `large`) | ~20 | Checkbox, Radio, Switch, Chip, Slider, Pagination, Table, Rating, Fab, TextField |

What is common across them: form controls, selection controls, small labels (badge, tag, chip, kbd), navigation
(tabs, pagination, steps) and containers whose padding changes (card, alert, accordion).

## What we did

Rule used: add a size where at least three of the five systems size it, or where ayywi already had the scale and the
step was missing. Every size is `sm` / `md` / `lg`, `md` is the default and adds no class, and heights come from the
density tokens so `data-density` still works.

| Component | Evidence (of 5) | Notes |
|---|---|---|
| Checkbox, Radio, Switch | 3, 5, 5 | New tokens `--ayy-size-check-sm/lg` and `--ayy-size-switch-sm/lg`. The label beside or around the control takes the matching text size. `RadioGroup size` sets the whole group |
| Textarea | 5 | Same steps as Input |
| Badge | 4 | |
| Chip | 3 | `md` is the old size, so nothing moves for existing users |
| Keyboard hint | 3 | Em-based, so it steps from the text around it |
| Slider | 4 | Track and thumb; a range sizes both of its inputs |
| Pagination, Steps | 3, 3 | Pagination's page-size picker steps with it |
| Card, Accordion | 3, 3 | Card padding and title go through per-card private variables, so a nested card keeps its own size |
| Tabs | 2 + Carbon | Nested tabs in a panel keep their own size |
| Alert | 2 (Chakra, Radix Callout) | Thinner evidence |
| Breadcrumb | 1 (Chakra) | Thinnest evidence of the lot; cheap, so it went in |
| Segmented control, Number field | `lg` added | Other systems offer three steps |
| Search bar | `sm` added | |
| FAB | `lg` added | MUI has small/medium/large |
| Avatar | `xs` and `2xl` added | Radix, Chakra, Mantine all go wider than `sm`–`xl` |
| Choice card | Radix + Chakra cards | The corner radio or checkbox steps with the new check tokens; `ChoiceGroup size` sets every card. Time-slot (`compact`) cards keep their own spacing |
| Property list, Empty state, Tree | 3, 2, 2 | Each already had a `compact` option; `sm` shares its rules and adds smaller text (Tree's `sm` is its `compact`), `lg` is new |
| Menu | Radix, Chakra, Carbon | `DropdownMenu size` reaches every panel, flyouts included; a panel can override it |
| Button | Radix 4 steps, Chakra and Mantine 5 | `xs`, `xl`, `icon-xs`, `icon-xl`. The app shell's row styling and the icon-only tooltip and lint rules all key off size names, so they were updated too |
| Popover, Code block | Radix/Chakra/Mantine, Chakra | Padding and text; Popover also its widest width |

Left alone on purpose: **Table** already has `--compact` and `--spacious`.

## Left out on purpose

- **Stat `lg`.** Its default is already a 48px number and there is no larger type token, so an `lg` would be a
  made-up literal. A bigger number is the `.ayy-display` / `.ayy-h1` job.
- **Table.** Already has `--compact` and `--spacious`.
- **Choice card `compact` (time slots).** A different shape with its own metrics; `size` changes only its text.

## Not done yet

1. **A scope-wide size.** Ant Design's `componentSize` sizes everything under one provider. ayywi's `data-density` is
   scoped the same way but changes what each step means, not which step controls use. Because density works by
   redefining tokens, a `data-size="sm"` could remap `--ayy-size-control-md` to the `sm` value for a subtree and shrink
   every component that defaults to `md` without editing them. Untested; components that size themselves from other
   tokens (chip, pagination) wouldn't follow without more work. This is a design decision, not a follow-up.
2. **Sizes for the rest.** Timeline, Skeleton, Dropzone, Color picker and Mentions are sized by one or two of the five
   systems; none has enough evidence yet.

## A hazard to keep in mind

Custom properties inherit, and popovers (menus, popovers, date pickers) sit inside whatever DOM element renders them. A
private variable such as `--_h` or `--_icon` set by an ancestor leaks into them. The sizes in this work use
component-specific names (`--_menu-h`, `--_card-pad`, `--_choice-pad`…) for that reason, and the menu resets its
values on every panel so a flyout inside a large menu doesn't inherit large. New sizes should do the same.

## Docs issue found on the way

Ten component metas say the `lg` control is "40px compact, 48 comfortable, 52 touch". The tokens say 36 / 44 / 48
(`--ayy-size-control-lg` is `2.25rem`, `2.75rem`, `3rem`). Affected: app-shell, bottom-nav, button, fab, input,
pin-input, search-bar, select, settings, tag-input. Not fixed here because it's unrelated to this change.
