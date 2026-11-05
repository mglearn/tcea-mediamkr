/* Google Drive saving is not enabled in TCEA MediaMkr.
 *
 * Drive transfer needs an organization-managed Google OAuth client, which this
 * free, self-contained edition does not ship. Every tool already lets you
 * download or save your work to your own device — use those options instead.
 *
 * These stubs keep the import surface intact so the tools load normally; each
 * throws a clear, friendly message if a Drive action is ever invoked.
 */
const MESSAGE = 'Saving to Google Drive is not available in this edition. Use Download or Save to keep a copy on your device.';

export function saveToGoogleDrive() { return Promise.reject(new Error(MESSAGE)); }
export function openFromGoogleDrive() { return Promise.reject(new Error(MESSAGE)); }
export function connectGoogleDrive() { return Promise.reject(new Error(MESSAGE)); }
