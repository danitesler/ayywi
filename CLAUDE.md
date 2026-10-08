@AGENTS.md

## Claude-specific

- Adding or changing a component: follow the `ayywi-add-component` skill (`.claude/skills/ayywi-add-component/SKILL.md`).
- After any change run `pnpm build && pnpm typecheck && pnpm check && pnpm test` and fix what they report before saying you're done. Interactive or visual change: also `pnpm test:e2e`.
- Run `scripts/check-all.sh` before merging. Never add GitHub Actions workflows or other hosted CI: all checks run locally.
- For visual changes, run `pnpm preview:build` and look at the result (Playwright + Chromium work in cloud sessions) in a dark and a light theme, in RTL, at touch density, and below 48rem (phone layouts of the App shell and Navbar only show there).
