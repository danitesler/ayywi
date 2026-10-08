#!/usr/bin/env bash
# Every check ayywi has, run locally on this Linux box. There is no hosted CI (never add GitHub
# Actions workflows): run this before merging, tagging or publishing.
#
#   scripts/check-all.sh            # everything
#   scripts/check-all.sh --quick    # skip the preview build and Playwright e2e
#
# Steps: build (tokens, manifest, dist/), typecheck (library, preview, examples, tests), pnpm check
# (design rules, docs ↔ CSS ↔ props drift, generated files, example lint), node tests, the preview
# site build, and Playwright + axe against it. The skill evals (evals/run.mjs) need a coding agent
# and aren't run here.
#
# Needs for the full run: Playwright's chromium (pnpm exec playwright install chromium).
set -euo pipefail
cd "$(dirname "$0")/.."
quick=0
[[ "${1:-}" == "--quick" ]] && quick=1
failed=()
step() {
  local name="$1"; shift
  echo
  echo "━━ $name"
  if "$@"; then echo "✓ $name"; else echo "✗ $name"; failed+=("$name"); fi
}
# Playwright reuses whatever already answers on its port, which would test another app.
e2e() {
  if (exec 3<>/dev/tcp/127.0.0.1/4173) 2>/dev/null; then
    echo "port 4173 is already in use: stop that server first, or Playwright tests it instead"
    return 1
  fi
  pnpm exec playwright test
}

step "build" pnpm -s build
step "typecheck" pnpm -s typecheck
step "pnpm check (design rules, docs drift, generated files)" pnpm -s check
step "build left no uncommitted changes" git diff --exit-code --stat
step "node tests" pnpm -s test

if [[ $quick == 0 ]]; then
  step "preview build" pnpm -s preview:build
  step "Playwright e2e (+ axe)" e2e
fi

echo
if (( ${#failed[@]} )); then
  echo "Failed: ${failed[*]}"
  exit 1
fi
echo "All checks passed."
