#!/usr/bin/env bash
# TCEA MediaMkr — validate before publishing.
# No build step is required to serve the site; this just runs the validators.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "== TCEA MediaMkr validation =="
python3 scripts/check-licenses.py
python3 scripts/check-branding.py
python3 scripts/check-links.py
echo "== All checks passed =="
