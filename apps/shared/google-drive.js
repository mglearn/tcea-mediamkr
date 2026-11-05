/* Google Drive save via Google Identity Services (drive.file scope only — the tool
 * can see only the files it creates). Reads the OAuth client id from
 *   <meta name="google-drive-client-id" content="XXXX.apps.googleusercontent.com">
 * No startup Google requests, stored tokens, background uploads, or public sharing;
 * a token is requested only when the user clicks Save to Google Drive.
 */
import { loadIdentity, connectionsAllowed } from './google-drive-auth.js';

const SCOPE = 'https://www.googleapis.com/auth/drive.file';

function clientId(configured) {
  return configured || document.querySelector('meta[name="google-drive-client-id"]')?.content || '';
}

function requestToken(id) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const done = (err, tok) => { if (settled) return; settled = true; err ? reject(err) : resolve(tok); };
    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: id, scope: SCOPE, include_granted_scopes: false,
        callback: (r) => {
          if (r.error || !r.access_token) { done(new Error('Google Drive permission was not granted. Your local work is unchanged.')); return; }
          done(null, r.access_token);
        },
        error_callback: () => done(new Error('Google sign-in was closed or blocked. Allow the popup and try again.'))
      });
      tokenClient.requestAccessToken({ prompt: 'select_account' });
    } catch (error) { done(error); }
  });
}

async function upload(blob, name, token) {
  const type = blob.type || 'application/octet-stream';
  const boundary = 'mediamkr-' + crypto.randomUUID();
  const metadata = JSON.stringify({ name, mimeType: type });
  const body = new Blob([
    '--' + boundary + '\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n', metadata,
    '\r\n--' + boundary + '\r\nContent-Type: ' + type + '\r\n\r\n', blob,
    '\r\n--' + boundary + '--\r\n'
  ]);
  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
    method: 'POST', redirect: 'error',
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'multipart/related; boundary=' + boundary },
    body
  });
  if (!response.ok) {
    if (response.status === 401) throw new Error('Google authorization expired. Choose Save to Google Drive again.');
    if (response.status === 403) throw new Error('Google Drive denied this action. Check your account permissions and your school Workspace policy.');
    throw new Error('Google Drive could not save the file (' + response.status + '). Your local copy is unchanged.');
  }
  const id = (await response.json()).id;
  if (typeof id !== 'string' || !/^[\w-]+$/.test(id)) throw new Error('Google Drive did not return a usable file. Try saving again.');
  return { id, name, webViewLink: 'https://drive.google.com/file/d/' + id + '/view' };
}

function confirmToast(name, link) {
  const el = document.createElement('div');
  el.setAttribute('role', 'status');
  el.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:2147483647;max-width:min(92vw,440px);display:flex;align-items:center;gap:10px;background:#0A3476;color:#fff;border:2px solid #FCB040;border-radius:12px;padding:12px 16px;font:600 14px/1.4 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;box-shadow:0 12px 30px rgba(8,39,89,.4)';
  const text = document.createElement('span');
  text.textContent = 'Saved “' + name + '” to Google Drive.';
  const link_ = document.createElement('a');
  link_.href = link; link_.target = '_blank'; link_.rel = 'noopener noreferrer'; link_.textContent = 'Open in Drive';
  link_.style.cssText = 'color:#FCB040;text-decoration:underline;white-space:nowrap';
  el.append(text, link_);
  document.body.append(el);
  setTimeout(() => el.remove(), 9000);
}

export async function saveToGoogleDrive(options) {
  connectionsAllowed();
  const id = clientId(options && options.clientId);
  if (!id) throw new Error('Google Drive needs a configured OAuth client on this host. Ask your administrator, or save a local copy for now.');
  await loadIdentity();
  connectionsAllowed();
  const token = await requestToken(id);
  const blob = await options.buildFile();
  if (!(blob instanceof Blob)) throw new Error('The file could not be prepared. Save a local copy and try again.');
  const name = String(options.fileName || 'project').replace(/[\x00-\x1f/\\]/g, '-').trim() || 'project';
  const result = await upload(blob, name, token);
  confirmToast(result.name, result.webViewLink);
  return result;
}

export function openFromGoogleDrive() {
  return Promise.reject(new Error('Opening from Google Drive is not available yet — download the file from Drive and open it here.'));
}
export function connectGoogleDrive() {
  return Promise.reject(new Error('Connecting Google Drive on its own is not available; use Save to Google Drive.'));
}
