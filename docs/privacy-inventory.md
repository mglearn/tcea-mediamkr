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
| CodeMkr | Pending | Pending | — | Pending | No |
| MemeMkr | Pending | Pending | — | Pending | No |
| PuzzleMkr | Pending | Pending | — | Pending | No |
| PlotMkr | Pending | Pending | — | Pending | No |
| PixelMkr | Pending | Pending | screen capture (on use) | Pending | No |
| BGMkr | Pending | Pending | — | on-device model | No |
| GIFMkr | Pending | Pending | — | Pending | No |
| DocMkr | Pending | Pending | — | Pending | No |
| AudioMkr | Pending | Pending | mic (on record) | Pending | No |
| FormatMkr | Pending | Pending | — | WASM | No |
| ClipMkr | Pending | Pending | mic/screen (on use) | WASM | No |

> Web fonts are loaded from Google Fonts on every page. This is the only
> expected third-party request in the shared shell; it can be removed by
> self-hosting the fonts.
