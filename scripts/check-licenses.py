#!/usr/bin/env python3
"""License/legal-file presence check for TCEA MediaMkr.

Usage: python3 scripts/check-licenses.py
Exit 0 = ok, 1 = a required file is missing or empty.
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

REQUIRED = [
    "LICENSE",
    "NOTICE.md",
    "THIRD_PARTY_LICENSES.md",
    "PRIVACY.md",
    "ACCESSIBILITY.md",
    "CHANGELOG.md",
]


def main():
    missing = []
    for name in REQUIRED:
        path = os.path.join(ROOT, name)
        if not os.path.isfile(path) or os.path.getsize(path) == 0:
            missing.append(name)
    if missing:
        print("Missing or empty required legal files:")
        for m in missing:
            print(f"  - {m}")
        return 1
    print("check-licenses: all required legal files present.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
