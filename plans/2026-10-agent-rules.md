# Agent rules: two-speed e2e, and trimming what the rules cost (2026-10-23)

Goal: an agent should run the expensive checks at the right moment instead of always or never, and the rule files should cost less context without losing the traps they exist to prevent.

## What the rules cost today

| File | Size | ~Tokens | Loaded |
|---|---|---|---|
| `AGENTS.md` | 15.8 KB | 3.9k | every session, every agent |
| `CLAUDE.md` | 0.7 KB | 0.2k | Claude (which also `@`-imports `AGENTS.md`) |
| `.claude/skills/ayywi-add-component/SKILL.md` | 7.6 KB | 1.9k | any component work |
| `ai/AGENTS.snippet.md` (generated; `ayywi init` pastes it into an app's `AGENTS.md`) | 24.2 KB | 6.1k | **every request, in every app that installed ayywi** |
| `ai/cursor/ayywi.mdc` (generated) | 22.4 KB | 5.6k | the same, in Cursor |
| `ai/skills/ayywi/SKILL.md` | 16.4 KB | 4.1k | when the consumer skill activates |
| `ai/skills/ayywi/reference.md` (generated) | 94.6 KB | 23.7k | on demand only |

Measured with `wc -c`, tokens estimated at chars / 4. `AGENTS.md` by section: gotchas 1,473, versioning + changelog 786, layout 623, commands 369, rules 336, intro 314.

## Findings

### 1. The e2e rule is all-or-nothing, and "after any change" is overstated — do now

Facts:

- 168 tests in 9 specs. `pnpm test:e2e`'s webServer runs `pnpm preview:build && pnpm preview:serve`, so even one test pays a full preview build.
- `-g` matches the whole test title: `-g "Dialog"` selects 17 tests across 5 files (settings, pages, regressions, app-components), while `tests/e2e/interactions.spec.ts -g "dialog"` selects 5.
- A scoped run against an already-running dev server took **6.9s for 2 tests** (`dialog opens`), no preview build.
- Four specs can't be scoped by component: `pages` (every page renders), `theming` (axe over every page × theme, plus 7 showcase apps), `dist` (the built bundle), `app-components` (showcase scenarios).

Change: two speeds in `AGENTS.md`. Scoped while iterating, whole suite against the built preview before calling it done (`:dir()` → `:lang()` is a build-time transform, so a dev-server run can pass where the build fails). Docs-only changes skip build/test/e2e — `pnpm check` is the one that reads docs.

### 2. `AGENTS.md` enumerates every custom element — considered, rejected

Line 11 lists 26 custom element tags. It looks like the obvious thing to replace with a pointer to `src/elements/`, and that edit was made and then reverted: `scripts/check.mjs:334` requires every registered tag to appear verbatim in `AGENTS.md` and `ai/skills/ayywi/SKILL.md`, so the list is a checked contract, not prose that drifts. Keep it (and keep the check).

### 3. `CLAUDE.md` repeats the gate verbatim — do now

`CLAUDE.md:6-7` restates `AGENTS.md:61,63` word for word (minus the e2e nuance). Two copies, one will rot. Keep the two lines that are actually Claude-specific (the skill pointer, the preview review checklist) and let `AGENTS.md` own the checks.

### 4. The changelog section says the format twice — do now

Five prose bullets, then an "Entry format" block repeating the same four rules. Same facts fit in one paragraph plus one example block: ~950 chars instead of ~1,700.

### 5. The consumer kit is the real token cost — Phase 2

`Need → component` is 89% of `ai/AGENTS.snippet.md` (21.5k of 24.2k chars): 52 lines, avg 415 chars, each picking a component and then listing the anti-patterns ("Not a raw `<select>`, …"). That map, the MCP `pick_component` tool and `llms-full.txt` all answer the same question, and only the snippet is always-on.

Fix belongs in the generator, not the output: render one compact line per need (~150 chars) and let `pick_component` / `llms-full.txt` carry the "not X" detail. Estimated saving ~3k tokens per request per consuming app. Not done here: `contract.mjs` (`NEEDS`) and `build-manifest.mjs` feed four generated files, and the change needs `pnpm check` + `pnpm test` + a look at the MCP output.

### 6. Parallel sessions share a port and a build directory — ports fixed, builds open

`reuseExistingServer: !process.env.CI` meant Playwright bound to whatever answered on 4173, with no idea which tree it served. Two sessions at once: one starts a server, the other's suite tests the first session's code and reports failures that don't exist in its tree; the agent "fixes" them, retries, fails differently. `scripts/check-all.sh` already refused a busy port; `pnpm test:e2e` silently reused one.

Fixed for ports: reuse is opt-in (`E2E_REUSE=1`), a busy port fails with Playwright's "already used" error, and the docs pick a per-shell port (`E2E_PORT=$((4200 + $$ % 300))`). Verified both paths: busy port → error; `E2E_REUSE=1` on that port → 2 tests passed in 5.8s.

Still open: two sessions in one checkout rewrite the same `dist/`, `manifest/` and `llms/` during `pnpm build`. Only a worktree per session fixes that (the empty `.claude/worktrees/` suggests it was tried); the cost is an install per worktree, so it needs a deliberate decision rather than a rule.

### 7. Deliberately not cut

- **Gotchas (1,473 tokens).** The largest section and the best value in the file: they document failures no other check catches (`:dir()` rewriting, `<dialog>` display, popover light-dismiss, WebKit focus). Splitting them into a linked doc would save ~1.4k tokens per session and cost one silent regression per skipped read. Keeping them.
- **Release steps (10 numbered, high stakes, no CI).** Trimming a step is how a release half-lands.
- **`llms-full.txt` (410 KB).** On demand, never always-on; its size costs nothing until an agent asks for it.

## Done in this pass

1. `AGENTS.md`
   - Commands: two-speed e2e loop, docs-only exception, why the built run still matters.
   - Changelog: one paragraph + one format block.
   - Two gotchas reworded shorter without losing a fact (icons, WebKit focus).
2. `CLAUDE.md`: drop the duplicated gate, keep the Claude-specific lines.
3. `.claude/skills/ayywi-add-component/SKILL.md`: verify step uses the two-speed loop.
4. `playwright.config.ts`: `reuseExistingServer` is opt-in (`E2E_REUSE=1`) instead of on outside CI.
5. `scripts/check-all.sh`: comment now matches that behaviour (the port pre-flight stays).

## Verification

- `pnpm check`: green. An earlier run flagged three stale generated files from the in-progress component work in the tree (`manifest/components.json`, `llms-full.txt`, `llms/toolbar.md`); another process regenerated them mid-pass, so this pass didn't touch them either way.
- `pnpm typecheck` and `bash -n scripts/check-all.sh`: green.
- Port isolation, both paths: a server on 4300 → `Error: http://127.0.0.1:4300 is already used…`; the same run with `E2E_REUSE=1` → 2 passed.
- `pnpm exec playwright test --list` for the filters quoted in the new text: `tests/e2e/interactions.spec.ts -g "dialog"` → 5 tests, one file. A scoped run against a dev server on 4173 passed in 6.9s.
- The custom-element list in `AGENTS.md` stays: `scripts/check.mjs:334` requires it, and the check caught its removal immediately.
