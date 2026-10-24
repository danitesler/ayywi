# Table column controls implementation plan

**Goal:** Add column menus, icons, freeze, wrap, shared filters/groups, insertion and a trailing add-column control; keep sparse and resized tables full width.
**Architecture:** Extend the existing table CSS contract and thin React components with header slots and wrapping. Reuse DropdownMenu for controls, keep application column/data state in the playground, and share plain-table behavior through connectTable.
**Constraints:** Preserve existing workspace changes, zero runtime dependencies, tokens/logical properties, accessible controls, generated docs only through the generator. No release or commit requested.

- [x] Add browser regression tests for menus, insertion, grouping/filter routing, wrapping, multiple frozen columns and sparse/empty width; observe missing functionality.
- [x] Add header slots, wrap/add-column classes and shared column behavior, including cumulative pin offsets and minimum container width.
- [x] Extend the playground's column model and existing controls with functional menu actions, editable new columns and empty-column recovery.
- [x] Update metadata, regenerate matching HTML from React, and record changes under Unreleased.
- [x] Run build, typecheck, contract checks, node tests, browser interaction tests and visual checks; review the resulting changes.

Review focus: column order and stable data keys, hidden/all-hidden columns, resized layouts, multiple pins and RTL, focus when opening another menu or inserting a column, matching HTML behavior.

Verification: build, typecheck and contract checks passed; all 248 browser tests passed, including the new menu/column regressions and the full theme accessibility sweep.
