#!/usr/bin/env python3
"""Check local JavaScript imports and import.meta.url assets, including lazy tools."""
from pathlib import Path
import re
import json
import sys

root = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path(__file__).resolve().parents[1]
skip = {'.git', 'node_modules', '_portal', 'test-results', 'test-results-portal', '__pycache__', 'playwright-report', '.tmp'}
patterns = [
    r'''\b(?:import|export)\s+(?:[^;\n]*?\s+from\s*)?["'](\.[^"']+)["']''',
    r'''\bimport\s*\(\s*["'](\.[^"']+)["']\s*\)''',
    r'''new URL\(\s*["'](\.[^"']+)["']\s*,\s*import.meta.url''',
]
failures = []
for path in root.rglob('*'):
    if any(p in skip for p in path.relative_to(root).parts):
        continue
    if path.suffix == '.css':
        for match in re.finditer(r'''url\(\s*["']?([^\s"')]+)''', path.read_text(errors='replace')):
            ref = match[1].split('?')[0].split('#')[0]
            if ref and not re.match(r'^(?:[a-z][a-z0-9+.-]*:|//|/|\$)', ref, re.I) and not (path.parent / ref).exists():
                failures.append(f'{path.relative_to(root)}: missing CSS asset {match[1]}')
    if path.name == 'manifest.json' and path.parent.name == 'fonts':
        for ref in json.loads(path.read_text()).get('files', []):
            if not (path.parent / ref).is_file():
                failures.append(f'{path.relative_to(root)}: missing font file {ref}')
    if path.suffix not in ('.js', '.mjs'):
        continue
    text = path.read_text(errors='replace')
    for pattern in patterns:
        for match in re.finditer(pattern, text):
            target = match[1].split('?')[0].split('#')[0]
            if '${' not in target and not (path.parent / target).exists():
                failures.append(f'{path.relative_to(root)}:{text[:match.start()].count(chr(10))+1}: {match[1]}')
if failures:
    print('\n'.join(failures))
    sys.exit(1)
print('check-imports: local modules, lazy assets, CSS assets, and font manifests resolve.')
