# Accessibility

TCEA MediaMkr targets **WCAG 2.2 AA**. Accessibility is treated as a
requirement, not an afterthought, across the collection.

## Shared commitments

- Keyboard navigation for interactive controls.
- Visible focus indicators (`:focus-visible`) on all focusable elements.
- Screen-reader labels on controls, menus, and dialogs.
- Color contrast that meets AA for text and essential UI.
- Responsive layouts that reflow on small screens and when zoomed.
- `prefers-reduced-motion` is honored; non-essential animation is suppressed.
- A skip link to jump straight to main content.
- Alternative text for meaningful images; decorative icons are hidden from
  assistive technology.

## Canvas-based editors

Image, video, and drawing tools use a canvas, which is inherently visual. Where
a tool relies on a canvas, it provides keyboard-accessible controls and
reasonable accessible alternatives (for example, data tables or text summaries
for charts in PlotMkr).

## Known limits

We do not claim full conformance for every tool until it has been tested with
assistive technology. Per-tool accessibility notes are tracked as each
application is migrated and verified.

## Reporting

If you hit an accessibility barrier, please report it via TCEA at
<https://tcea.org/> so it can be prioritized.
