@AGENTS.md

## Claude-specific

- Adding or changing a component: follow the `ayywi-add-component` skill (`.claude/skills/ayywi-add-component/SKILL.md`).
- After any change run `pnpm build && pnpm typecheck && pnpm check && pnpm test` and fix what they report before saying you're done. Interactive or visual change: also `pnpm test:e2e`.
- For visual changes, run `pnpm preview:build` and look at the result (Playwright + Chromium work in cloud sessions) in both themes, in RTL, and at touch density.
