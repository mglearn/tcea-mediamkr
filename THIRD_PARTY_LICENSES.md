# Third-Party Licenses

TCEA MediaMkr bundles third-party open-source components. Each keeps its own
copyright and license. This inventory is updated as each tool is migrated; any
component that ships inside an application's folder also carries its own license
or notice file alongside the code.

> **Status:** This file is maintained per application. As each tool is added, its
> third-party dependencies (and on-device models, where used) are recorded below
> with name, version, license, and source.

## Shared

| Component | Purpose | License |
|---|---|---|
| DM Sans, DM Serif Display, DM Mono (Google Fonts) | Typography | SIL Open Font License 1.1 |

## Per-application

### CodeMkr
| Component | Version | Purpose | License | Source |
|---|---|---|---|---|
| qrcode.js (Kazuhiko Arase) | bundled | QR code generation | MIT | http://www.d-project.com/ |

The MIT copyright/license header is preserved in
`apps/codemkr/assets/vendor/qrcode.js`. "QR Code" is a registered trademark of
DENSO WAVE INCORPORATED.

### MemeMkr
_To be recorded on migration._

### PuzzleMkr
_To be recorded on migration._

### PlotMkr
_To be recorded on migration (charting library)._

### PixelMkr
_To be recorded on migration._

### BGMkr
_To be recorded on migration (background-removal model + runtime)._

### GIFMkr
_To be recorded on migration (GIF encoder)._

### AudioMkr
_To be recorded on migration (audio + captioning runtime/model)._

### FormatMkr
_To be recorded on migration (media-conversion WASM toolchain)._

### ClipMkr
_To be recorded on migration (video pipeline, captioning runtime/model)._

### DocMkr
_To be recorded on migration (PDF library)._

---

If you believe a required attribution is missing, please open an issue so it can
be added promptly.
