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
Runtime (bundled locally under `apps/bgmkr/assets/vendor/`, license files included):

| Component | Version | License | Source |
|---|---|---|---|
| Transformers.js | 3.8.1 | Apache-2.0 | https://github.com/huggingface/transformers.js |
| ONNX Runtime Web | 1.22.0-dev | MIT | https://github.com/microsoft/onnxruntime |
| @huggingface/jinja | 0.5.3 | MIT | https://github.com/huggingface/transformers.js |
| JSZip | bundled | MIT (or GPL-3.0-or-later; used under MIT) | https://github.com/Stuk/jszip |

Models (downloaded on request from Hugging Face, not bundled; pixels never sent):

| Model | License | Source |
|---|---|---|
| ORMBG (Fast) | Apache-2.0 | https://huggingface.co/onnx-community/ormbg-ONNX |
| BEN2 (Best) | MIT, © 2025 Prama LLC | https://huggingface.co/onnx-community/BEN2-ONNX |

Runtime license texts and SHA-256 checksums are preserved in
`apps/bgmkr/assets/vendor/`. White/color removal and built-in backgrounds work
fully offline with no model download.

### GIFMkr
No third-party libraries. The GIF encoder and MP4 muxer are original
project code (AGPL-3.0-or-later); MP4 export uses the browser's built-in
WebCodecs API. Fonts as noted under Shared.

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
