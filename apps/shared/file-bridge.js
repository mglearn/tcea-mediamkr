// Standalone file handling for TCEA MediaMkr.
//
// In a combined suite these helpers would hand a file off to whichever sibling
// tool owns its format. TCEA MediaMkr ships each tool on its own, so every file
// opens in the current tool and work persists to this device's localStorage.

const PARAM = 'open-file';
let incomingToken;
if (typeof location !== 'undefined') incomingToken = new URL(location.href).searchParams.get(PARAM);

// No cross-tool transfers in this edition.
export function isTransferredWorkspace() { return false; }

// Normal, persistent per-tool storage on this device.
export function workspaceStorage() {
  return (typeof window !== 'undefined' && window.localStorage) ? window.localStorage : null;
}

// There are no sibling tools to route to — the current tool opens every file
// itself (its own importer reports anything it cannot read).
export async function routeFileToApp() { return false; }

// Clear any stray ?open-file token from the address bar, then report that there
// is no transferred file waiting.
export async function consumeTransferredFile() {
  if (incomingToken && typeof history !== 'undefined') {
    const url = new URL(location.href);
    url.searchParams.delete(PARAM);
    history.replaceState(history.state, '', url);
    incomingToken = null;
  }
  return null;
}
