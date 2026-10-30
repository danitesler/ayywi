# Critique response plan (2026-10-11)

Source: three external critiques of the README, package and positioning. They read the README, not the code. I checked each claim against the repo and npm.

## What the critiques got right, verified

| Claim | Verified? | Notes |
|---|---|---|
| `npx ayywi …` resolves the wrong package | **Yes, worse than stated** | Unscoped `ayywi` is unclaimed on npm, so anyone can publish it. `ayywi init` (0.0.1, published) **writes `npx ayywi mcp` into users' MCP configs**. Fixed on main, but users get the fix only after a release. |
| Unpinned CDN | Yes | Fixed in README (jsDelivr `@0.0.1` + SRI). Get started prompts already use `v/<release>/`, but fall back to unpinned `dist/` from localhost. |
| Live preview 404s | Dropped | There is no hosted preview. Run `pnpm preview`. |
| README is ahead of the release | **Yes, worse than stated** | Published 0.0.1 has 54 components (main has 66) and **no brand engine at all**: no `brand` command, no `createBrand()`, no `create_brand` MCP tool. 25 commits since `v0.0.1`. |
| Contrast claim muddy | Wording only | The engine already checks the label on the button at 4.5:1 (`src/brand.ts`). README now says so. |
| No accessibility evidence | Partly | axe runs on every component page and showcase app, and `pnpm check` tests text × surface × theme contrast. It just isn't published anywhere. |
| GitHub About empty | Yes | No description, homepage or topics. |

## Done in this pass

- `cli/init.mjs` writes `npx -y @danitesler/ayywi mcp`; test asserts it.
- Every `npx ayywi` in sources, prompts, skill, reviewer agent and generated docs → `npx @danitesler/ayywi`. The lint hook keeps `npx --no ayywi` (it never installs, so it's safe).
- AGENTS snippet said "`ayywi` on npm" → `@danitesler/ayywi`.
- README: quick-start pinned to jsDelivr `@0.0.1` with SRI; added a Tailwind/shadcn line that matches the Get started prompts; removed "senior product designer" and "production-ready"; added an early-status note and a screenshot; replaced the a11y adjectives with what's actually tested; noted that the brand engine isn't released yet.
- CHANGELOG entries under Unreleased → Fixed.

## P0: stop hurting users (this week)

1. **Release 0.1.0.** This is what gets the `init` fix to users and makes the README true. Afterwards, update the README pins and SRI hashes to `0.1.0` and remove the "not in 0.0.1" brand note.
2. **Automate the README pins.** Add a `pnpm check` rule: the README's jsDelivr version equals `package.json` version, and each `integrity` matches `dist/`. Without it, the pins will go stale on the next release.
3. **Claim unscoped `ayywi` on npm** with a two-file shim whose bin runs `@danitesler/ayywi`. That removes the typosquat risk and makes `npx ayywi` work as people expect. *You need to publish it.*
4. **Dropped.** No hosted preview. `pnpm preview` is the preview.
5. **Pin the localhost fallback** in `preview/src/prompts.ts` to jsDelivr `@<version>` instead of the site's unversioned `dist/`.
6. **Fill in GitHub About** (command below; I didn't run it because it's public-facing).

## P1: prove the core claim

7. **Publish eval numbers.** `evals/run.mjs` already compares with vs without the kit. Add a shadcn/Tailwind baseline arm, run each task at least 3 times, and render the outputs in Chromium so axe and a screenshot get recorded per output. Commit `evals/RESULTS.md` and link a summary table from the README. This is the whole pitch, so it comes before anything else in P1.
8. **Publish the a11y evidence.** Have the e2e run write a per-component axe summary into the preview build (`/a11y.html` or JSON), and link it from the README. Add a "known limitations" list. Has anyone tested with a real screen reader? If not, say so.
9. **Component maturity instead of cutting scope.** Add `"status": "stable" | "beta"` to each `*.meta.json`, carry it through the manifest, and have MCP `get_component` and `pick_component` warn agents about beta components. That deals with "66 components is a lot to vouch for" without deleting anything.
10. **A plain-HTML starter** (`examples/plain-html/index.html`): one App shell screen with all three list states, using no agent and no build step. That gives skeptics a 30-second test.

## P2: design depth

11. **Reword the states rule** so it depends on the data lifecycle: first load vs background refresh, no data yet vs no results. Today's "every list and table" encourages boilerplate.
12. **Layout archetypes**: a few documented page compositions per showcase type, plus "when not to use" notes, so ayywi apps don't all come out with the same layout.
13. **Theme × density × direction screenshot matrix** for about 10 core components, to catch visual regressions. Locally, like everything else.
14. **Document the JS boundary**: which components work with CSS only, and which need `@danitesler/ayywi/elements` or React.

## Decisions for you

- **Audience:** the critiques want the README to lead with "non-designer shipping with an AI builder" and move the PM and designer pitches lower. You rewrote it for three audiences two commits ago, so I left the structure alone.
- **Name:** "ayywi" has no pronunciation or meaning anywhere in the README. If there's a story behind it, one line under the title would fix that.

## Discarded

- The second critique's sections on "agent sessions, MCP connection states, settings for an agent manager". It mixed ayywi up with a different product.
- "Link axe results in CI". The repo deliberately has no hosted CI, so P1 #8 publishes them from the local run instead.
