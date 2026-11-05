#!/usr/bin/env python3
"""Link checker for TCEA MediaMkr.

- Verifies local href/src targets resolve on disk.
- Flags unexpected external domains (allowlist below).
- Flags root-relative URLs (they break on subpath deployments).

Usage: python3 scripts/check-links.py
Exit 0 = ok, 1 = problems found.
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP_DIRS = {".git", "node_modules", "test-results", ".wrangler", ".tmp"}

# External hosts that are allowed to appear in links.
ALLOWED_HOSTS = {
    "tcea.org", "www.tcea.org",
    "mglearn.github.io",
    "fonts.googleapis.com", "fonts.gstatic.com",
    "www.gnu.org",
    "github.com",            # corresponding-source links (AGPL)
    "huggingface.co",        # on-demand model info/download (BGMkr)
}

ATTR_RE = re.compile(r'(?:href|src)\s*=\s*["\']([^"\']+)["\']', re.IGNORECASE)
HOST_RE = re.compile(r'^https?://([^/]+)/?', re.IGNORECASE)


def rel(p):
    return os.path.relpath(p, ROOT)


def check_file(path):
    problems = []
    base = os.path.dirname(path)
    try:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            text = f.read()
    except OSError:
        return problems

    for m in ATTR_RE.finditer(text):
        url = m.group(1).strip()
        if not url or url.startswith(("#", "mailto:", "tel:", "data:", "javascript:")):
            continue
        if url.startswith("//"):
            problems.append(("protocol-relative", url))
            continue
        mo = HOST_RE.match(url)
        if mo:
            host = mo.group(1).lower()
            if host not in ALLOWED_HOSTS:
                problems.append(("external-host", url))
            continue
        if url.startswith("/"):
            problems.append(("root-relative (breaks subpath deploy)", url))
            continue
        # Local relative link: strip query/hash and resolve.
        local = url.split("#", 1)[0].split("?", 1)[0]
        if not local:
            continue
        target = os.path.normpath(os.path.join(base, local))
        if local.endswith("/"):
            ok = os.path.isdir(target) or os.path.isfile(os.path.join(target, "index.html"))
        else:
            ok = os.path.exists(target)
        if not ok:
            problems.append(("missing-local-target", url))
    return problems


def main():
    issues = 0
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for name in filenames:
            if not name.lower().endswith((".html", ".htm")):
                continue
            full = os.path.join(dirpath, name)
            for kind, url in check_file(full):
                print(f"  {rel(full)}: [{kind}] {url}")
                issues += 1
    if issues:
        print(f"\ncheck-links: {issues} issue(s) found.")
        return 1
    print("check-links: clean — all local links resolve, no stray externals.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
