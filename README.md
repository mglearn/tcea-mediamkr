# TCEA MediaMkr

**Create. Edit. Share. Teach.**

TCEA MediaMkr is a collection of free, browser-based media creation and editing
applications for K–16 educators. Everything runs client-side in the browser —
no accounts, no tracking, and your files stay on your device.

- **Live:** https://mglearn.github.io/tcea-mediamkr/
- **Organization:** https://tcea.org/

## The tools

| Tool | What it does |
|---|---|
| **ClipMkr** | Video creation and editing |
| **AudioMkr** | Audio recording and editing |
| **FormatMkr** | Media conversion and preparation |
| **PixelMkr** | Image editing |
| **BGMkr** | Background removal and replacement |
| **PuzzleMkr** | Interactive classroom puzzles |
| **CodeMkr** | QR code generation |
| **MemeMkr** | Meme and captioned-image creation |
| **GIFMkr** | Animated GIF creation |
| **PlotMkr** | Charts, graphs, and data visualization |
| **DocMkr** | PDF document tools |

## Design principles

1. **Client-side first.** HTML, CSS, and JavaScript with no required backend.
2. **Portable.** Fully relative links so the collection runs from any subpath —
   GitHub Pages (`/tcea-mediamkr/`) or other hosting (e.g. a `/portal` path).
3. **Private by default.** No accounts, analytics, or student-data collection.
4. **Accessible.** Targets WCAG 2.2 AA; see [`ACCESSIBILITY.md`](ACCESSIBILITY.md).
5. **Bilingual.** English and Spanish throughout, with a language switcher.
6. **Consistent.** One shared TCEA navy-and-gold design system.

## Repository layout

```
tcea-mediamkr/
├── index.html              Homepage (searchable tool grid)
├── assets/css, assets/js   Shared theme + i18n + navigation
├── apps/<tool>/            One folder per application
├── docs/                   User, teacher, and developer guides
├── scripts/                Branding, link, and license validators
├── tests/                  Smoke, branding, functional, a11y, privacy, export
└── .github/workflows/      Validation + deploy
```

## Running locally

Any static file server works. For example:

```bash
cd tcea-mediamkr
python3 -m http.server 8080
# then open http://localhost:8080/
```

## Languages

The interface ships in **English** and **Spanish**. The choice is saved locally
in the browser and applied across pages.

## Licensing

Application code is licensed under **AGPL-3.0-or-later** — see
[`LICENSE`](LICENSE), [`NOTICE.md`](NOTICE.md), and
[`THIRD_PARTY_LICENSES.md`](THIRD_PARTY_LICENSES.md). Bundled third-party
libraries keep their own licenses, which are preserved.

## Privacy

See [`PRIVACY.md`](PRIVACY.md). In short: no accounts, no tracking, local
processing, local downloads.

---

Copyright © 2026 Miguel Guhlin. A TCEA collection.
