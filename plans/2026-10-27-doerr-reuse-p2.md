# Reusable UI from Doerr for Ayywi — second pass

Source review: 2026-10-27. Supersedes the open rows of `plans/2026-10-doerr-reuse.md` (2026-10-24); the P1 rows there have shipped.

Compared ayywi at `block-editor/blocks` (84 components, everything under `## Unreleased`) with Doerr at `a92423a` (`src/components`, `src/styles`). Doerr pins the published `@danitesler/ayywi@0.1.2`, so none of the components ayywi added since that release are used there yet.

## What changed since 2026-10-24

| Oct 24 backlog row | Status now |
| --- | --- |
| 1 Inline edit | Shipped in ayywi (`inline-edit`). Doerr still uses `PageTitle`, `InlineName`, `Cells` text editing. |
| 2 Record picker | Shipped (`record-picker`). Doerr still uses `ItemPicker` (`Links.tsx`) and `OptionPicker` (`Cells.tsx`). |
| 3 Property list | Shipped (`property-list`). Doerr still uses `Prop` (`ItemProps.tsx`) and `.doerr-prop`. |
| 4 Tree | Shipped (`tree`). Doerr still draws `.doerr-tree` in `Sidebar.tsx`. |
| 10 Emoji / icon picker | Shipped (`icon-picker`, with emoji). Doerr still uses `EmojiPicker.tsx`. |
| 11 Caret suggestions / mentions | Shipped (`mentions`, `block-editor`). Doerr still uses `NotesEditor.tsx`. |
| 5 Confirm / choice / text helpers | Open → **P2** |
| 6 Board / Kanban | Open → **P2** |
| 7 Event calendar | Open → **P2** |
| 9 Find / replace bar | Open → **P2** |
| 13 Editable checklist | Open → **P2** (promoted: two Doerr screens now repeat it) |
| 8 Typed condition builder | Open → P3 |
| 12 Recurrence editor | Open → P3, recipe only (Doerr's `RepeatEditor` is already built from ayywi pieces) |
| 14 Attachment list | Open → P3, recipe only |
| 15 Record detail / peek | Open → P3, recipe only |
| 16 Document workbench | Out of core scope (unchanged) |

## P2 scope (this plan)

Ranked by reuse outside Doerr, repetition inside Doerr, and how far ayywi already is.

| # | Addition | Where it lives in Doerr | Why it belongs in ayywi | Effort |
| --- | --- | --- | --- | --- |
| 1 | **Toast with several actions** | `ReminderToasts.tsx:15` (`richToast`, the only `ayywi-candidate:` marker besides the page title) | `toast()` takes one `action`; Doerr mounts a React root inside a toast to get Open + three snoozes. Any app with reminders, undo + view, or retry + details hits this. | Small |
| 2 | **Prompt dialogs** (`confirmDialog`, `choiceDialog`, `promptDialog`) | `confirm.tsx`, called from 17 files | Every app hand-writes an awaitable confirm. ayywi already does imperative UI for toasts; the dialog markup exists (`dialog/examples/confirm`). | Medium |
| 3 | **Find bar** | `.doerr-findbar` in `WordEditor.tsx:871`, `SheetEditor.tsx:1080`, `PdfViewer.tsx:1507`, `styles/office.css:138` | Three copies in one app. Search bar has no match count, previous/next, match case or replace. | Medium |
| 4 | **Checklist** | `Checklist.tsx`, `Subtasks.tsx`, `.doerr-checklist` | Enter adds, Backspace on empty removes, focus follows, a count and progress on top. Onboarding steps, packing lists, release checklists. | Medium |
| 5 | **Board** | `BoardView.tsx`, `DatabaseView.tsx:358` (`DatabaseBoard`), `styles/board.css` | Two boards in Doerr share hand-written column CSS. ayywi's Drag and drop has a `board` example laid out with inline styles; it needs a real layout contract. | Medium |
| 6 | **Event calendar** | `CalendarView.tsx`, `DatabaseCalendar.tsx` (shared `useRowsPerDay`), `styles/calendar.css` | A month of records with overflow and drag-to-reschedule. Date picker selects a date; it can't show records on dates. | Large |

## Already covered — migrate Doerr, don't add to ayywi

| Doerr code | Use instead |
| --- | --- |
| `AmountChart` (`HabitDetail.tsx:230`): hand-drawn bars, goal line, table toggle | `BarChart` with `lines={[{ name: "Goal", values, compare: true }]}` (the `combo` example) and `TableChart` |
| `EmojiPicker.tsx`, `.doerr-emoji-picker` | Icon picker |
| `PageTitle.tsx`, `InlineName`, text cells | Inline edit |
| `ItemPicker`, `OptionPicker` | Record picker |
| `Prop`, `.doerr-prop` | Property list |
| `.doerr-tree` in `Sidebar.tsx` | Tree |
| `NotesEditor.tsx` | Block editor (larger migration; check feature parity first) |
| `CommandPalette.tsx` (Dialog + own list) | Command |
| `lib/dnd.ts` for board, calendar and checklist drags | Drag and drop, through the P2 components |

The migration needs an ayywi release first (the maintainer decides), then `pnpm up @danitesler/ayywi` in Doerr. It is a separate plan in the Doerr repo.

## P3 backlog (not in this plan)

- **Condition builder** (`FilterConditions.tsx`, `DatabaseFilters.tsx`): field → operator → typed value rows inside Filter bar. Needs its own design pass.
- **Week strip** (`HabitsView.tsx:52`): seven days with a progress dial each, previous/next week. Today it's ChoiceGroup + ChoiceCard compact + a hand-drawn ring; a `ProgressRing` inside the card may be enough — try it as an example first.
- **Check-in ring button** (`HabitCheck.tsx`, `.doerr-hcheck`): a round button whose ring fills with progress. Try Button `icon` + Progress ring as an example first.
- **Status month** (`HabitDetail.tsx:134`, `.doerr-hcal`): a month where each day is a toggle with a done / part / missed tone and a legend. Could become an Event calendar variant once that ships.
- **Smart input tokens** (`QuickAdd.tsx`, `.doerr-token`): parsed tokens as removable chips under a field with suggestions. Parsing stays in the app; the visual may be a Tag input or Mentions example.
- **Recipes** (contract.mjs screens): recurrence editor, attachment list, record detail / peek.
- **Toast with a list** (`showMissedReminders`): a short list of records under the toast text. Wait for a second use.

## Constraints that carry over

- ayywi's product is a token-driven CSS class contract with framework-free behaviour, thin React wrappers and light-DOM elements where interaction needs them. A Doerr React file moved over is not an extraction.
- No `useStore`, Tauri, `Task`/`Row`/`Folder` types. Controlled values, neutral ids, intent callbacks. Persistence, NLP parsing, scheduling and matching stay in the app.
- Reuse before adding: Card, Popover, Drag and drop, date utilities (`datePickerMonth`, `datePickerLabels`), Progress, Checkbox, Input, Button.
- Every addition ships CSS, helper, React, element (if interactive), meta, HTML + React examples, tests, CHANGELOG and README rows, and passes `scripts/check-all.sh`.
