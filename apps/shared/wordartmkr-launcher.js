// Shared WordArtMkr editor: same-origin iframe + source/nonce-checked PNG handoff.
// Opens WordArtMkr embedded, sends the starting text, and receives a PNG back.
export function openWordArtMkr({ text = 'Your words', onInsert } = {}) {
  if (document.querySelector('#wordartmkrEditorDialog')) return;
  const requestId = crypto.randomUUID(), origin = location.origin, previous = document.activeElement, target = origin === 'null' ? '*' : origin;
  const dialog = document.createElement('dialog'); dialog.id = 'wordartmkrEditorDialog'; dialog.setAttribute('aria-label', 'WordArtMkr lettering editor');
  Object.assign(dialog.style, { width: 'min(1250px,96vw)', height: '92dvh', maxWidth: '96vw', maxHeight: '94dvh', padding: '0', border: '1px solid #dce3ef', borderRadius: '13px', overflow: 'hidden', background: '#EEF4FC', color: '#0A3476', boxSizing: 'border-box' });
  const bar = document.createElement('div'); Object.assign(bar.style, { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', background: '#fff', borderBottom: '1px solid #dce3ef' });
  const title = document.createElement('strong'); title.textContent = 'WordArtMkr · Text effects & SpellArt'; title.style.flex = '1';
  const close = document.createElement('button'); close.type = 'button'; close.textContent = 'Close'; close.setAttribute('aria-label', 'Close WordArtMkr editor'); close.onclick = () => dialog.close();
  const status = document.createElement('span'); status.setAttribute('role', 'status'); status.style.fontSize = '12px';
  const frame = document.createElement('iframe'); frame.title = 'WordArtMkr lettering studio'; frame.allow = 'clipboard-write'; Object.assign(frame.style, { display: 'block', width: '100%', height: 'calc(100% - 53px)', border: '0' }); frame.referrerPolicy = 'no-referrer';
  const url = new URL('../wordartmkr/', location.href); url.searchParams.set('embed', '1'); url.searchParams.set('request', requestId); frame.src = url.href;
  bar.append(title, status, close); dialog.append(bar, frame); document.body.append(dialog);
  let inserting = false;
  async function receive(event) {
    const d = event.data; if (event.origin !== origin || event.source !== frame.contentWindow || !d || d.source !== 'WordArtMkr' || d.requestId !== requestId) return;
    if (d.type === 'wordartmkr-ready') { frame.contentWindow.postMessage({ type: 'wordartmkr-init', requestId, text: String(text).slice(0, 220) }, target); return; }
    if (d.type !== 'wordartmkr-result' || inserting) return;
    if (typeof d.dataUrl !== 'string' || d.dataUrl.length > 22000000 || !/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(d.dataUrl) || !Number.isInteger(d.width) || !Number.isInteger(d.height) || d.width < 1 || d.height < 1 || d.width > 8192 || d.height > 8192 || d.width * d.height > 16000000) { status.textContent = 'The artwork could not be inserted. Choose a smaller PNG.'; return; }
    inserting = true; status.textContent = 'Adding artwork…';
    try { const blob = await (await fetch(d.dataUrl)).blob(), bitmap = await createImageBitmap(blob); const matches = bitmap.width === d.width && bitmap.height === d.height; bitmap.close(); if (!matches) throw Error('The artwork dimensions do not match.'); await onInsert?.({ file: new File([blob], 'WordArtMkr.png', { type: 'image/png' }), dataUrl: d.dataUrl, width: d.width, height: d.height, alt: String(d.alt || 'WordArtMkr text artwork').slice(0, 2000) }); dialog.close(); }
    catch (error) { status.textContent = error.message || 'Artwork could not be inserted.'; inserting = false; }
  }
  window.addEventListener('message', receive); dialog.addEventListener('close', () => { window.removeEventListener('message', receive); frame.src = 'about:blank'; dialog.remove(); previous?.focus?.(); }, { once: true }); dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } }); dialog.showModal(); close.focus(); return dialog;
}
