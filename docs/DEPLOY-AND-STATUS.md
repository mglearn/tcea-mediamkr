# TCEA MediaMkr — Deployment & Status Notes

_Working notes. Not shipped to end users (dev doc)._

## Deploying to courses.tcea.org/portal (WP Engine)

The whole collection is **static** (no server code) and uses **only relative links**,
so it runs at any base path. To produce a clean upload bundle:

```bash
bash scripts/build-portal.sh
```

This writes `_portal/` (a folder) and `tcea-mediamkr-portal.zip`. Upload the **contents
of `_portal/`** into the `/portal` directory on WP Engine (SFTP or the file manager).

The bundle **excludes** dev/GitHub clutter: `.github/`, `scripts/`, `tests/`,
`README.md`, `CHANGELOG.md`, `.gitignore`, `.nojekyll`. It **includes** `index.html`,
`legal.html`, `404.html`, `assets/`, `apps/`, `docs/` (in-tool Help targets), and the
license files.

> Always run `build-portal.sh` fresh right before deploying — `_portal/` is a
> gitignored build artifact and can go stale after edits.

### Host-agnostic by design
- No absolute internal links, no links back to the GitHub repo (`check-links.py` enforces).
- Only external hosts kept: `tcea.org` and Google Fonts CDN (work anywhere).
- Google Drive is **stubbed** everywhere (needs org OAuth) — every tool offers Download/device save instead.

## Validators (run before any deploy)

```bash
python3 scripts/check-branding.py   # no splat/*Splat product names in public files
python3 scripts/check-links.py      # all local links resolve, no stray externals
python3 scripts/check-licenses.py   # required legal files present
```

`check-branding.py` now also bans the office-suite names
(writesplat/showsplat/gridsplat/listsplat/layoutsplat/fontsplat) and has a
`\b[a-z]{3,}splat\b` catch-all. It skips `_portal/`.

## Versioning
- Overall collection version lives in `VERSION` (`1.0.0`) and shows as **v1.0** in the
  homepage and `legal.html` footers. No dates/timestamps anywhere (by request).

## Status — verified working (browser, Nov 2026)
Homepage, CodeMkr, BGMkr, GIFMkr, MemeMkr, PuzzleMkr, PlotMkr, PixelMkr, BingoMkr,
AudioMkr, FormatMkr, ClipMkr, DocMkr, WordWebMkr, **MarkMkr**, **CalMkr**, **WordArtMkr**,
**PageMkr** — all load and run; whole-collection branding + links clean.

### Fixed this pass
- **MarkMkr**: navy palette (was blue/cyan, purple shadows removed); real **File / Edit
  dropdown menus** (all actions) + quick Clean/Find buttons; new **Water Cycle** sample
  replacing the GenAI example (EN+ES); dropped the non-functional Google Drive button.
- **CalMkr**: replaced the paint-splat blob icon with a clean navy/gold calendar.
- **PageMkr & CalMkr**: created `apps/shared/` (photo-blur, file-bridge, office-text,
  word-legacy runtime, wordartmkr-launcher, Drive stubs) — these imports were **missing**,
  so both tools failed to load. PageMkr now loads.
- **PageMkr sample**: de-splatted all suite text (→ Mkr names), replaced 3 embedded
  SplatWorks screenshots with clean navy/gold images, added `mediamkr-logo.png`,
  removed orphan `splatworks-logo.png`, fixed the WordArtMkr insert button.
- **WordArtMkr**: copied the 7 referenced fonts into `apps/wordartmkr/fonts/` (were fetched
  from a broken `../../mediamkr/layoutsplat/fonts/` path — all fonts were failing).
- **DocMkr**: scrubbed every `.csplat`/CipherSplat/SplatPrivacy reference (Protect
  feature was dropped earlier).
- **ClipMkr / WordWebMkr**: scrubbed `ClipSplat` UI strings and ConceptSplat/MarkdownSplat comments.

### Also done (cleanup pass)
- **FontMkr renamed to WordArtMkr** everywhere (it came from FontSplat; the new name is
  descriptive): folder `apps/wordartmkr/`, launcher, tile image, display name, embed
  protocol tokens (`wordartmkr-*`), project id, homepage card + i18n.
- **Removed the dead sibling-suite code** entirely: `suite-interchange.mjs`,
  `suite-data.mjs`, `suite-data-src.mjs` deleted and unwired from `exports.mjs`,
  `publishing.mjs`, `text-import.mjs`, `merge-ui.mjs`, `publishing-ui.mjs` + dead i18n
  keys. Mail-merge (CSV/TSV/Excel) and text import still work; only the GridMkr/ListMkr/
  WriteMkr/ShowMkr JSON paths are gone.
- **Removed references to non-existent docs** (`pagemkr-comic-studio.md`, `pagemkr-labels.md`)
  from code comments.

## Known remaining items (next pass)
1. **WordArtMkr preset "Splat shine"** and the "Make a splash / Find your splash" copy use
   the word *splash* (fine) and *Splat* (borderline — not a product name, common
   paint-splat word). Rename if zero tolerance is wanted.
2. **`data-action="save-drive"` buttons** (e.g. PageMkr) still show though Drive is
   stubbed (they surface a clear "use Download" error). Consider hiding for polish,
   like MarkMkr's was removed.
3. **WordArtMkr bold/italic variants** aren't copied (only Regular weights) — canvas
   synthesizes bold/italic, so it works, but true cuts could be added.
4. **localStorage note**: PageMkr autosaves; if you tested the old sample, clear
   `pagemkr.autosave.v1` to see the clean starter (fresh users are unaffected).
