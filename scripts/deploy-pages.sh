#!/usr/bin/env bash
# Publishes the preview site to GitHub Pages, from this machine (there is no hosted CI).
# Builds the preview, carries every earlier release's runtime files over (keep-versions.mjs), and force-pushes
# preview/dist to the gh-pages branch, which Pages serves as-is (Settings → Pages → Deploy from a branch: gh-pages, /).
#
#   scripts/deploy-pages.sh            AYYWI_SITE=<url ending in /> for another host
set -euo pipefail
cd "$(dirname "$0")/.."

SITE="${AYYWI_SITE:-https://danitesler.github.io/ayywi/}"
REMOTE="$(git remote get-url origin)"
SOURCE="$(git rev-parse --short HEAD)$(git diff --quiet HEAD || echo "-dirty")"

VITE_AYYWI_SITE="$SITE" pnpm preview:build
AYYWI_SITE="$SITE" node scripts/keep-versions.mjs
touch preview/dist/.nojekyll # serve every file as-is, no Jekyll

out="$(mktemp -d)"
trap 'rm -rf "$out"' EXIT
cp -R preview/dist/. "$out"
git -C "$out" init -q -b gh-pages
git -C "$out" add -A
git -C "$out" -c user.name="$(git config user.name)" -c user.email="$(git config user.email)" commit -q -m "Deploy $SOURCE"
git -C "$out" push -q -f "$REMOTE" gh-pages
echo "Deployed $SOURCE to $SITE (Pages takes a minute or two to update)"
