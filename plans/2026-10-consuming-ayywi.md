# Consuming ayywi: one way for every app (2026-10-20)

Goal: updating ayywi in an app is one command, building a new ayywi feature next to an app shows up live, and any agent that installs ayywi sets the project up this way on its own.

## Where things stand

| | takerr | dooduu (committed) | dooduu (uncommitted) |
|---|---|---|---|
| Source | `vendor/ayywi`: committed copy of `dist/`, made by `scripts/sync-ayywi.mjs` | `file:vendor/ayywi-0.3.0.tgz` | `file:../ayywi`, pnpm `injected` |
| Import name | `ayywi` | `ayywi` | `@danitesler/ayywi` |
| Version | 0.0.3-ish, built from main | "0.3.0", but the tgz isn't in git and the one on disk is 0.0.3 | Whatever `../ayywi` has, uncommitted work included |
| Fresh clone installs | yes | no | only with `../ayywi` built next to it |
| Agent files | none | `.claude/skills/ayywi` copied by an old `init`, already out of date | same |

Other problems:
- Unscoped `ayywi` on npm is now only the CLI shim, so `import … from "ayywi/react"` can't come from npm.
- `init` copies the skill, Cursor rule and agent once, and `keep`s them afterwards. Nothing refreshes them after an upgrade, which is how dooduu's copy drifted.
- dooduu's `src/styles/fonts.css` points at `../../node_modules/@danitesler/ayywi/dist/fonts/…`.
- Rule 24 in `scripts/lib/contract.mjs` still says class helpers come from `"ayywi"` (unscoped).
- Neither app's docs describe what it actually does. dooduu's AGENTS.md still says "vendored tgz".

## The model

1. **Committed state: npm only.** `"@danitesler/ayywi": "^0.x.y"`, and imports only from `@danitesler/ayywi` and its exports. No vendored copies, no tgz files, no `file:`/`link:` deps, no paths into `node_modules`.
2. **Developing ayywi alongside an app: opt-in and uncommitted.** Run `ayywi build --watch` in the ayywi checkout and `AYYWI_DIR=../ayywi pnpm dev` in the app. A Vite helper aliases the package to that checkout and dedupes React. Without the env var, the app uses npm as usual.
3. **Shipping a feature:** the feature goes into ayywi, not the app. Release ayywi, then `pnpm up @danitesler/ayywi` and `npx @danitesler/ayywi init --update` in each app.
4. **Agent files follow the installed version.** `init --update` rewrites everything `init` owns. `lint` warns when the project's copies are older than the installed package.

## Phase 1: ayywi

Every item lands on its own branch off a clean main. The 76 uncommitted files on main are someone's in-progress work and have to be committed or parked first. `contract.mjs` is one of them.

### 1a. Write the rules once, in the contract

Add `SETUP` to `scripts/lib/contract.mjs` next to `RULES`. `build-manifest.mjs` renders it as a **"Installing and updating ayywi"** section in every generated file agents read: `ai/AGENTS.snippet.md`, `ai/cursor/ayywi.mdc`, `ai/skills/ayywi/SKILL.md`, `llms-full.txt`, and MCP `get_rules` (plus a short note in the MCP server instructions).

Draft text:

> - Install from npm: `pnpm add @danitesler/ayywi` (or npm/yarn), then `npx @danitesler/ayywi init`. Import only from `@danitesler/ayywi`, `@danitesler/ayywi/react`, `@danitesler/ayywi/elements` and the CSS exports. Never from `ayywi` (that is only the CLI) and never from a path inside `node_modules`.
> - Never vendor ayywi: no copy of its `dist/` in the repo, no `.tgz`, no `file:`/`link:` dependency in a committed `package.json`. A fresh clone must install with `pnpm install` alone.
> - To change ayywi while building an app, set `AYYWI_DIR` to an ayywi checkout and run the app's dev server. Don't commit that, and don't commit a workspace link.
> - Upgrade with `pnpm up @danitesler/ayywi` and then `npx @danitesler/ayywi init --update`, and read the CHANGELOG entries between the two versions.
> - When ayywi is missing a component or a variant, compose existing pieces in the app, mark the composition with a `// ayywi-candidate: <what>` comment, and propose it upstream. Don't fork or restyle an ayywi component in the app.

Also fix rule 24's `"ayywi"` → `"@danitesler/ayywi"`.

### 1b. `init` sets the project up this way

- `init --update`: rewrites everything init owns (skill, agent, Cursor rule, AGENTS section, MCP entries) without touching the rest of the project. That's `--force` limited to init's own files, with a clearer name.
- Writes `.claude/skills/ayywi/.ayywi-version` (and the same stamp in the AGENTS section) so we can tell what's stale.
- When `package.json` doesn't list `@danitesler/ayywi`, prints the install command instead of carrying on silently.

### 1c. `lint` enforces the rules

New project-level findings, which also show up through the hook:
- `vendored-ayywi`: a `vendor/**/ayywi*`, an `ayywi*.tgz`, or a `file:`/`link:` spec for the package.
- `unscoped-import`: `from "ayywi…"`.
- `node-modules-path`: `node_modules/@danitesler/ayywi` in CSS or TS.
- `stale-agent-files`: version stamp < installed version → "run `npx @danitesler/ayywi init --update`".

### 1d. Live development with a sibling checkout

- `build --watch` in `scripts/build.mjs`, exposed as `pnpm dev:lib`.
- A `@danitesler/ayywi/vite` export: `ayywiDev()` returns `{}` unless `AYYWI_DIR` is set. When it is, it returns `resolve.alias` → `<AYYWI_DIR>/dist` (per subpath, matching `exports`), `resolve.dedupe: ['react', 'react-dom']`, and `server.fs.allow` for the checkout. Apps add one line: `plugins: [react(), ayywiDev()]`.
- Known gap: `tsc` still reads the npm types until a release. That's fine for a few days of work on a feature. If it's a problem, `ayywiDev` can print a `tsconfig` `paths` snippet.

### 1e. Smaller fixes

- `"./fonts/*": "./dist/fonts/*"` in `exports`, so a font subset like dooduu's can import through the package.
- Optional: `scripts/release.mjs` to script the 10 release steps in AGENTS.md → Releases, up to the point where it stops before `npm publish`. That makes "release ayywi, bump the apps" cheap enough to do for one small feature.
- README → "AI setup": add the install and update rules from 1a.

Then ask the maintainer about a release (AGENTS.md → Releases). The suggestion is **0.2.0**, since the new lint findings can fail an existing app's `lint`.

## Phase 2: takerr (clean tree, do it first)

1. Delete `vendor/ayywi` and `scripts/sync-ayywi.mjs`, and the `sync:ayywi` script.
2. `pnpm add @danitesler/ayywi@^0.2.0` and drop `"ayywi": "link:vendor/ayywi"`.
3. Rewrite imports: `"ayywi"` / `"ayywi/react"` / `"ayywi/css"` / `"ayywi/fonts.css"` → `@danitesler/ayywi/…` (34 import sites).
4. `ayywiDev()` in `vite.config.ts`.
5. `npx @danitesler/ayywi init`. Review the AGENTS.md diff, since takerr's own AGENTS.md already has ayywi lines at 4, 21, 96 and 157 that need to go or point at the new section.
6. Check for visual changes from 0.0.3 → 0.2.0 (theme rename `dark-soft` → `dark-contrast` already happened; read the CHANGELOG for the rest).
7. `pnpm check`, then run the app and look at the main windows.

## Phase 3: dooduu (after its in-flight change lands)

dooduu has 89 uncommitted files that already rename imports to `@danitesler/ayywi` and switch to `file:../ayywi`. Finish or commit that work first, then:

1. `"@danitesler/ayywi": "^0.2.0"`, and remove `dependenciesMeta.injected` and `vendor/*.tgz`.
2. `src/styles/fonts.css` → `@danitesler/ayywi/fonts/…`.
3. `ayywiDev()` in `vite.config.ts`.
4. `npx @danitesler/ayywi init --update` refreshes the stale skill and AGENTS section. Rewrite AGENTS.md rule 8 ("Never edit vendor tgz…") to point at the ayywi section.
5. `.mcp.json`: `npx ayywi mcp` → `npx -y @danitesler/ayywi mcp` (init's `keep` won't change an existing entry, so do this by hand or have `--update` do it).
6. `pnpm check`, `pnpm test:e2e`, run the app.

## Done when

- Fresh clones of takerr and dooduu install and build with only `pnpm install`.
- `grep -r "vendor/ayywi\|from \"ayywi\|node_modules/@danitesler" takerr dooduu` finds nothing.
- `npx @danitesler/ayywi lint` in each app reports no setup findings.
- An edit to an ayywi component shows up in a running app with `AYYWI_DIR` set, and React isn't loaded twice (no hooks error).
- `npx @danitesler/ayywi init` in an empty project writes the "Installing and updating" section, and a fresh agent asked to "add ayywi to this app" installs from npm.

## Open questions

1. **Should the ayywi `main` work be released before the apps move?** dooduu's new code imports whatever `../ayywi` has, uncommitted changes included. If it uses anything that isn't in 0.1.0, it can only move to npm once that ships.
2. **Vite helper in the package, or a documented snippet?** Shipping `@danitesler/ayywi/vite` means every app gets fixes to the alias logic, but it adds a public export that has to keep working. I'd ship it.
3. **Would a monorepo be better?** Not for two apps with their own release cycles. Revisit if a third app shows up and the cross-repo changes become weekly.
