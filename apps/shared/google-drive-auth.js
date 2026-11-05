/* Google authorization is not enabled in TCEA MediaMkr.
 *
 * Connecting to Google Drive or Google Calendar needs an organization-managed
 * OAuth client, which this free, self-contained edition does not ship. The
 * tools work fully offline; use each tool's Download / device-backup option.
 *
 * These stubs preserve the import surface so the tools load normally. Any
 * attempt to actually connect fails with a clear, friendly message.
 */
const MESSAGE = 'Google connections are not available in this edition. Your work stays on this device — use Download or a device backup.';

export function connectionsAllowed() { throw new Error(MESSAGE); }
export function loadIdentity() { return Promise.reject(new Error(MESSAGE)); }
export function requestToken() { return Promise.reject(new Error(MESSAGE)); }
export function requestTokenInWindow() { return Promise.reject(new Error(MESSAGE)); }
