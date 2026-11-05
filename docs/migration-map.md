# TCEA MediaMkr — Migration Map

TCEA MediaMkr adapts the maintainer's own prior open-source educational tools
into one independent, TCEA-branded collection. This file tracks each tool's
final name, purpose, URL path, and migration status.

| Tool | Purpose | Path | Status |
|---|---|---|---|
| ClipMkr | Video creation and editing | `apps/clipmkr/` | Planned |
| AudioMkr | Audio recording and editing | `apps/audiomkr/` | Planned |
| FormatMkr | Media conversion and preparation | `apps/formatmkr/` | Planned |
| PixelMkr | Image editing | `apps/pixelmkr/` | Planned |
| BGMkr | Background removal and replacement | `apps/bgmkr/` | Planned |
| PuzzleMkr | Interactive classroom puzzles | `apps/puzzlemkr/` | Planned |
| CodeMkr | QR code generation | `apps/codemkr/` | **Done** — static only; tracking-redirect backend removed; EN/ES |
| MemeMkr | Meme and captioned-image creation | `apps/mememkr/` | Planned |
| GIFMkr | Animated GIF creation | `apps/gifmkr/` | Planned |
| PlotMkr | Charts, graphs, and data visualization | `apps/plotmkr/` | Planned |
| DocMkr | PDF document tools | `apps/docmkr/` | Planned |

## Naming rules

- Every tool name ends in **Mkr** and uses PascalCase for display.
- Folder paths are lowercase.
- Exported filenames are prefixed with the lowercase tool name.

## Migration checklist (per tool)

1. Copy only the files the tool needs into its folder.
2. Apply the shared TCEA chrome and theme.
3. Remove any dependency on external sites; bundle libraries locally.
4. Rebrand all public-facing strings, titles, metadata, and export filenames.
5. Keep English + Spanish working via the i18n engine.
6. Record third-party components in `../THIRD_PARTY_LICENSES.md`.
7. Verify file/network/storage behavior for `privacy-inventory.md`.
8. Run the validators and update this table's status.
