/* Hide stubbed "Save to Google Drive" controls.
 *
 * Google Drive saving is not enabled in TCEA MediaMkr (it needs an organization-
 * managed OAuth client). Every tool already offers Download / device save, so the
 * Drive buttons would only ever show a "not available" message. This hides them.
 *
 * Works for both static buttons and ones a framework renders later (it re-checks on
 * DOM changes, debounced). It only hides short, button-like controls whose text is a
 * Drive action — never long paragraphs that merely mention Google Drive.
 */
(function () {
  'use strict';
  var SELECTOR = 'button, a, [role="menuitem"], .quick-action-btn';
  var scheduled = false;

  function looksLikeDriveControl(el) {
    if (el.getAttribute('data-mm-drive-hidden') === '1') return false;
    var text = (el.textContent || '').replace(/\s+/g, ' ').trim();
    // Short, button-sized label that names Google Drive as an action.
    return text.length > 0 && text.length < 42 && /google drive/i.test(text);
  }

  function hideDrive() {
    scheduled = false;
    var nodes = document.querySelectorAll(SELECTOR);
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (looksLikeDriveControl(el)) {
        el.style.setProperty('display', 'none', 'important');
        el.hidden = true;
        el.setAttribute('data-mm-drive-hidden', '1');
      }
    }
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    setTimeout(hideDrive, 200);
  }

  function start() {
    hideDrive();
    try {
      new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
    } catch (e) { /* MutationObserver unavailable — the initial pass still ran. */ }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
