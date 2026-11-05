/* Optional, user-triggered Google authorization (Google Identity Services).
 *
 * Used by CalMkr for Google Calendar sync. It loads Google's GSI client on demand
 * only when the user chooses to connect; there are no startup Google requests,
 * stored tokens, background uploads, or public sharing.
 *
 * To enable a tool that uses this, the page must carry an OAuth client id:
 *   <meta name="google-drive-client-id" content="XXXX.apps.googleusercontent.com">
 * and the tool reads it from there. Without that meta tag the tool shows a clear
 * "ask your administrator to configure a Google OAuth client" message.
 *
 * The requestToken* helpers below are not used by the shipped tools (CalMkr runs
 * its own token client via window.google.accounts.oauth2); they remain disabled.
 */

export function connectionsAllowed() {
  if (navigator.onLine === false) {
    throw new Error('This needs an internet connection. Your work still stays on this device.');
  }
}

let identityLoading = null;

export function loadIdentity() {
  connectionsAllowed();
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  if (identityLoading) return identityLoading;
  identityLoading = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const failed = () => {
      clearTimeout(timer); script.remove(); identityLoading = null;
      reject(new Error('Google sign-in could not load. Check your connection and try again.'));
    };
    const timer = setTimeout(failed, 15000);
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onerror = failed;
    script.onload = () => { clearTimeout(timer); if (window.google?.accounts?.oauth2) resolve(); else failed(); };
    document.head.append(script);
  });
  return identityLoading;
}

const DISABLED = 'This Google authorization path is not enabled in this edition.';
export function requestToken() { return Promise.reject(new Error(DISABLED)); }
export function requestTokenInWindow() { return Promise.reject(new Error(DISABLED)); }
