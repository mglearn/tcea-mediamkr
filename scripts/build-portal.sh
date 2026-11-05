#!/usr/bin/env bash
# Build a clean, host-agnostic deploy bundle for TCEA MediaMkr.
#
# Produces  _portal/  (a folder you can upload as-is) and  tcea-mediamkr-portal.zip
# containing only what the site needs to run — no GitHub/dev clutter.
#
# Target:  https://courses.tcea.org/portal/  (or any static host / subpath).
# Every link in the site is relative, so the bundle works at any base path.
#
# Usage:   bash scripts/build-portal.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
OUT="_portal"
ZIP="tcea-mediamkr-portal.zip"

rm -rf "$OUT" "$ZIP"
mkdir -p "$OUT"

# ---- Ship only what the running site needs ----
# Pages + the one combined policy page + the error page:
cp index.html legal.html 404.html "$OUT"/
# Shared design/code/images/icons:
cp -r assets "$OUT"/assets
# All tools:
cp -r apps "$OUT"/apps
# In-browser help targets (linked from tool "Help" menus) — user-facing docs only.
# Dev docs (developer-guide, migration-map, source-license-audit, privacy-inventory,
# DEPLOY-AND-STATUS) are intentionally NOT shipped.
mkdir -p "$OUT"/docs
for d in user-guide.md teacher-guide.md pagemkr-comic-studio.md pagemkr-labels.md; do
  [ -f "docs/$d" ] && cp "docs/$d" "$OUT"/docs/
done
# License/compliance text kept available (also summarized in legal.html):
cp LICENSE NOTICE.md THIRD_PARTY_LICENSES.md "$OUT"/ 2>/dev/null || true

# ---- Strip anything dev/VCS that may have been copied inside app folders ----
find "$OUT" -type d \( -name .git -o -name node_modules -o -name test-results -o -name .tmp \) -prune -exec rm -rf {} + 2>/dev/null || true
find "$OUT" -name '.DS_Store' -delete 2>/dev/null || true

# ---- Zip it (so it can be dropped into a file manager / SFTP) ----
( cd "$OUT" && zip -qr "../$ZIP" . )

echo "Built:"
echo "  $OUT/            (folder — upload its CONTENTS to the /portal directory)"
echo "  $ZIP   ($(du -h "$ZIP" | cut -f1))"
echo
echo "Excluded (not needed to run): .github/ scripts/ tests/ README.md CHANGELOG.md"
echo "  .gitignore .nojekyll PRIVACY.md ACCESSIBILITY.md (legal.html supersedes the last two)."
