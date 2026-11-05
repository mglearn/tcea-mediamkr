# TCEA MediaMkr — Privacy Inventory

For each tool, we verify actual behavior before claiming it is private. This
inventory records what was checked and found.

## What we check per tool

1. File inputs (what file types, and how they are read)
2. Network requests (any outbound requests, and to where)
3. Local storage / IndexedDB usage
4. Browser cache / service worker behavior
5. Camera / microphone access (and when it is requested)
6. External processing libraries (bundled locally vs. remote)
7. Remote models or APIs (if any)
8. Data deletion behavior

## Status

| Tool | Network requests | Local storage | Camera/mic | Processing | Verified |
|---|---|---|---|---|---|
| CodeMkr | None (fonts only) | `codemkr.designs.v1` (saved designs, opt-in) | — | Fully local (qrcode.js) | Yes |
| MemeMkr | None (fonts only) | none | — | Fully local (canvas) | Yes |
| PuzzleMkr | None (fonts only) | `mediamkr.puzzlemkr.latest` (last puzzle, opt-in) | — | Fully local | Yes |
| PlotMkr | None (fonts + TEKS links) | `plotmkr.projects.v1` (opt-in) | — | Fully local | Yes |
| PixelMkr | Model from HF on demand (smart bg removal; pixels local) | none | screen capture + camera (on use) | On-device + local canvas | Yes |
| BGMkr | Model from Hugging Face on demand (pixels stay local); optional background-image URL fetch | none | — | On-device (Transformers.js/ONNX WASM); white/color fully local | Yes |
| GIFMkr | None (fonts only) | none | — | Fully local (custom GIF encoder; MP4 via WebCodecs) | Yes |
| BingoMkr | None (fonts only) | game data in shareable URL (opt-in) | — | Fully local | Yes |
| DocMkr | None (fonts only) | none | — | Fully local (pdf-lib) | Yes |
| AudioMkr | On-device model assets (local) | app persistence (local) | mic (on record) | Fully local (Web Audio + WASM) | built-from-source |
| FormatMkr | Pending | Pending | — | WASM | No |
| ClipMkr | Pending | Pending | mic/screen (on use) | WASM | No |

> Web fonts are loaded from Google Fonts on every page. This is the only
> expected third-party request in the shared shell; it can be removed by
> self-hosting the fonts.
