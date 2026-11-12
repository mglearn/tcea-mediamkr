# Functional checks

Run `npm ci` and install Playwright browser runtimes. Serve the collection with a
static web server, then set `MEDIAMKR_URL` to its URL (including the trailing slash)
and run `npm test`. The default local URL is
`http://127.0.0.1:4183/mglearn/mediamkr/`.

The suite checks startup and local assets for all 17 tools in Chrome, Firefox,
and mobile WebKit. It also checks bundled Arabic, Indic, and CJK font loading,
PowerPoint poster rendering/export, PixelMkr
background removal and ZIP export with Undo, and PuzzleMkr setup/student activity.
Google Fonts CSS is replaced with an empty stylesheet during these checks so
network availability does not affect functional results; local font fallbacks apply.

For the portal copy, point `MEDIAMKR_URL` to that collection and run the same suite.
These checks cover startup and the named workflows, not every feature of every tool.
