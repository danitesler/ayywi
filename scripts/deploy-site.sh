#!/usr/bin/env bash
# Publishes the preview to https://danitesler.com/ayywi/, from this machine (there is no hosted CI).
# Hostinger serves the danitesler/danitesler repo root as-is, so a deploy is one commit to that repo's main, under ayywi/.
#
# Works in the website checkout at $DANITESLER_REPO (default ../danitesler) when it is on main with no local edits in
# ayywi/; otherwise in a temporary shallow clone, leaving any checkout alone. Earlier releases under ayywi/v/ stay and
# keep their versions.json entries, so links pinned to a release keep working. ayywi/**/.htaccess lives in the website
# repo and is never touched.
#
#   scripts/deploy-site.sh              build, commit and push
#   scripts/deploy-site.sh --no-push    commit in the local checkout only, to look at the diff first
#   scripts/deploy-site.sh --clone      always use a temporary clone
#   scripts/deploy-site.sh --yes        push unpushed website commits along without asking
#   scripts/deploy-site.sh --allow-dirty  deploy uncommitted ayywi changes (the commit message says -dirty)
set -euo pipefail
cd "$(dirname "$0")/.."

REPO="${DANITESLER_REPO:-../danitesler}"
REMOTE="${DANITESLER_REMOTE:-https://github.com/danitesler/danitesler.git}"
SITE="https://danitesler.com/ayywi/"

push=1 force_clone=0 yes=0 allow_dirty=0
for arg in "$@"; do
  case "$arg" in
    --no-push) push=0 ;;
    --clone) force_clone=1 ;;
    --yes) yes=1 ;;
    --allow-dirty) allow_dirty=1 ;;
    *) echo "Unknown option: $arg" >&2; exit 2 ;;
  esac
done

if [[ -n "$(git status --porcelain)" ]]; then
  if (( ! allow_dirty )); then
    echo "ayywi has uncommitted changes; commit them first or pass --allow-dirty" >&2
    exit 1
  fi
  SOURCE="$(git rev-parse --short HEAD)-dirty"
else
  SOURCE="$(git rev-parse --short HEAD)"
fi

is_website() {
  [[ -d "$1/.git" ]] && [[ "$(git -C "$1" remote get-url origin 2>/dev/null)" =~ github\.com[:/]danitesler/danitesler(\.git)?$ ]]
}

mode=clone
if (( force_clone )); then
  reason="--clone"
elif ! is_website "$REPO"; then
  reason="no danitesler/danitesler checkout at $REPO"
elif [[ "$(git -C "$REPO" branch --show-current)" != main ]]; then
  reason="$REPO is on $(git -C "$REPO" branch --show-current), not main"
elif [[ -n "$(git -C "$REPO" status --porcelain -- ayywi)" ]]; then
  reason="$REPO has uncommitted changes in ayywi/"
else
  mode=local
fi

if [[ $mode == clone ]] && (( ! push )); then
  echo "--no-push needs the local checkout, but: $reason" >&2
  exit 1
fi

pnpm preview:build

if [[ $mode == local ]]; then
  target="$(cd "$REPO" && pwd)"
  echo "Deploying into $target"
  if ! git -C "$target" pull -q --ff-only origin main; then
    echo "$target/main has diverged from origin; sort it out there, then deploy again" >&2
    exit 1
  fi
  if (( push )); then
    ahead="$(git -C "$target" log --oneline origin/main..main)"
    if [[ -n "$ahead" ]] && (( ! yes )); then
      echo "$target has unpushed commits that would go live with this deploy:"
      echo "$ahead"
      [[ -t 0 ]] || { echo "Pass --yes to push them, or push or reset them first" >&2; exit 1; }
      read -r -p "Push them too? [y/N] " answer
      [[ $answer == [yY]* ]] || exit 1
    fi
  fi
else
  echo "Deploying through a temporary clone ($reason)"
  target="$(mktemp -d)"
  trap 'rm -rf "$target"' EXIT
  git clone -q --depth 1 --branch main "$REMOTE" "$target"
fi

# Keep the releases the site already has: their entries in versions.json, and their files under v/ (never deleted).
node --input-type=module - "$target/ayywi/versions.json" preview/dist/versions.json <<'EOF'
import { existsSync, readFileSync, writeFileSync } from "node:fs";
const [live, built] = process.argv.slice(-2);
const current = JSON.parse(readFileSync(built, "utf8"));
if (existsSync(live)) {
  for (const release of JSON.parse(readFileSync(live, "utf8")).versions ?? []) {
    if (!current.versions.some((v) => v.id === release.id)) current.versions.push(release);
  }
}
writeFileSync(built, `${JSON.stringify(current, null, 2)}\n`);
EOF

mkdir -p "$target/ayywi"
rsync -a --delete --exclude /v/ --exclude .htaccess preview/dist/ "$target/ayywi/"
rsync -a preview/dist/v/ "$target/ayywi/v/"

git -C "$target" add -A -- ayywi
if git -C "$target" diff --cached --quiet -- ayywi; then
  echo "Nothing changed in ayywi/; nothing to deploy"
  exit 0
fi
git -C "$target" commit -q -m "Deploy ayywi $SOURCE" -- ayywi

if (( ! push )); then
  echo "Committed \"Deploy ayywi $SOURCE\" in $target, not pushed. Look it over, then: git -C $target push origin main"
  exit 0
fi
git -C "$target" push -q origin main
echo "Deployed $SOURCE to $SITE (Hostinger picks it up in a minute or two)"
if [[ $mode == clone ]] && is_website "$REPO"; then
  echo "Your checkout at $REPO is now behind origin: git -C $REPO pull before your next website push"
fi
