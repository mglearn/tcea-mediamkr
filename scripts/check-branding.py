#!/usr/bin/env python3
"""Branding scanner for TCEA MediaMkr.

Fails if prohibited public-facing branding appears in the published files.
Maintains an allowlist for required legal notices and compatibility markers.

Usage:
    python3 scripts/check-branding.py
Exit code 0 = clean, 1 = prohibited branding found.
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Prohibited public-facing brand tokens (case-insensitive, word-ish match).
PROHIBITED = [
    r"splatworks",
    r"drawsplat",
    # Original tool names mapped into MediaMkr:
    r"videosplat", r"audiosplat", r"mediasplat", r"imagesplat",
    r"backdropsplat", r"memepuzzle", r"qrsplat", r"memesplat",
    r"gifsplat", r"graphsplat", r"pdfsplat",
    # Old candidate names to avoid as published titles:
    r"\bVideoMkr\b", r"\bImageMkr\b", r"\bQRmkr\b",
    r"\bChartMkr\b", r"\bGraphMkr\b", r"\bAGIFMaker\b",
]

# Files/dirs excluded from scanning.
SKIP_DIRS = {".git", "node_modules", "test-results", ".wrangler", ".tmp"}
SCAN_EXT = {".html", ".htm", ".js", ".mjs", ".css", ".json", ".md",
            ".webmanifest", ".svg", ".txt"}

# Lines that may legitimately contain a token (allowlist by substring).
# This scanner file itself defines the tokens, so it is skipped.
ALLOW_FILES = {
    os.path.join("scripts", "check-branding.py"),
}

patterns = [re.compile(p, re.IGNORECASE) for p in PROHIBITED]


def rel(path):
    return os.path.relpath(path, ROOT)


def main():
    findings = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for name in filenames:
            ext = os.path.splitext(name)[1].lower()
            if ext not in SCAN_EXT:
                continue
            full = os.path.join(dirpath, name)
            relpath = rel(full)
            if relpath in ALLOW_FILES:
                continue
            try:
                with open(full, "r", encoding="utf-8", errors="ignore") as f:
                    for lineno, line in enumerate(f, 1):
                        for pat in patterns:
                            if pat.search(line):
                                findings.append((relpath, lineno, pat.pattern,
                                                 line.strip()[:120]))
            except OSError:
                continue

    if findings:
        print("PROHIBITED BRANDING FOUND:\n")
        for relpath, lineno, pat, snippet in findings:
            print(f"  {relpath}:{lineno}  [{pat}]  {snippet}")
        print(f"\n{len(findings)} issue(s). Replace public-facing branding "
              "before publishing.")
        return 1

    print("check-branding: clean — no prohibited public branding found.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
