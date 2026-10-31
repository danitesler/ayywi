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

Left alone on purpose: **Table** already has `--compact` and `--spacious`.

## Not done yet, in order of how much I'd want them

1. **Menu.** Radix and Chakra size it. It has sub-menus, rows and a React context to thread through, so it needs
   its own pass.
2. **Choice card.** Radix `CheckboxCards`/`RadioCards` (1–3) and Chakra's cards. Its indicator already reads
   `--ayy-size-check`, so the new tokens are half the work.
3. **Property list, Empty state, Tree.** Radix/Chakra/Mantine `DataList`, Chakra/Mantine `EmptyState`, Chakra
   `TreeView`.
4. **Stat `lg`**, **Button `xs`/`xl`** (Chakra `2xs`–`2xl`, Mantine `xs`–`xl`), **Popover** (Radix 1–4), **Code block**.
5. **A scope-wide size.** Ant Design's `componentSize` sizes everything under one provider. ayywi's `data-density`
   does this for height; a `data-size` that sets the step for every control in a toolbar or a form would close the
   gap with `size="sm"` on each control. It needs every component to read a shared variable, so it is a design
   decision, not a quick follow-up.

## Docs issue found on the way

Ten component metas say the `lg` control is "40px compact, 48 comfortable, 52 touch". The tokens say 36 / 44 / 48
(`--ayy-size-control-lg` is `2.25rem`, `2.75rem`, `3rem`). Affected: app-shell, bottom-nav, button, fab, input,
pin-input, search-bar, select, settings, tag-input. Not fixed here because it's unrelated to this change.
