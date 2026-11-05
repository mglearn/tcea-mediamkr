# TCEA MediaMkr — Developer Guide

## Architecture

- Static HTML/CSS/JS. No build step is required to serve the site.
- **Fully relative paths.** No root-relative (`/…`) URLs, so the collection runs
  from any base path — GitHub Pages (`/tcea-mediamkr/`) or another host under a
  subpath such as `/portal`. When adding links, always use relative paths
  (`../../assets/…`, `apps/<tool>/`, etc.).
- Shared design lives in `assets/css` (`tcea-theme.css`, `layout.css`,
  `components.css`) and `assets/js` (`i18n.js`, `navigation.js`, `utilities.js`).
- Each app is self-contained under `apps/<tool>/` and may keep its own
  `assets/`. App-specific code stays inside the app folder.

## Shared design system

Use the CSS custom properties from `tcea-theme.css` (e.g. `--tcea-navy`,
`--tcea-gold`). Reuse the `mm-*` classes for headers, footers, cards, and
buttons so every tool looks consistent.

## Internationalization

- `assets/js/i18n.js` provides `window.MM_I18n` with `register()`, `t()`,
  `apply()`, and `init()`.
- Mark translatable text with `data-i18n="key"` and attributes with
  `data-i18n-attr="placeholder:key;aria-label:key2"`.
- Supported languages: **English (`en`)** and **Spanish (`es`)**. Arabic-style
  RTL handling exists in the engine but is not currently used.
- Register per-app strings in the app folder and call `MM_I18n.init()` after
  registration (the shared `navigation.js` does this on the homepage).

## Adding or updating a tool

1. Place the tool's files under `apps/<tool>/`.
2. Keep dependencies local to the app folder; no external runtime dependencies
   on other sites.
3. Apply the shared header/footer chrome and TCEA theme.
4. Prefix exported filenames with the tool name (e.g. `codemkr-…`).
5. Record third-party components in `../THIRD_PARTY_LICENSES.md`.
6. Run the validators in `../scripts/` before committing.

## Validation

```bash
python3 scripts/check-branding.py   # prohibited public branding
python3 scripts/check-links.py       # local links resolve; flag external hosts
python3 scripts/check-licenses.py    # legal files present
```
