(function(){
  const $=id=>document.getElementById(id);
  const t=(key,vars)=>window.WidgetI18n?window.WidgetI18n.t(key,vars):key;

  const state={
    frames: [], // {id, name, w, h, image}
    lastBlobUrl: null
  };
  let nextId=1;

  function setStatus(msg, cls){
    const el=$('statusLine'); el.textContent=msg||''; el.className='status '+(cls||'');
  }

  function renderList(){
    const wrap=$('frameList');
    if(!state.frames.length){
      wrap.innerHTML='<p class="empty-hint">'+t('frames.empty')+'</p>';
      return;
    }
    wrap.innerHTML='';
    state.frames.forEach((f,idx)=>{
      const row=document.createElement('div'); row.className='frame-row';
      const img=document.createElement('img'); img.className='thumb'; img.src=f.image.src; img.alt='';
      const meta=document.createElement('div'); meta.className='meta';
      meta.innerHTML='<strong>'+(idx+1)+'.</strong> '+escapeHtml(f.name)+'<br><span style="color:#64748b">'+f.w+'×'+f.h+'</span>';
      const acts=document.createElement('div'); acts.className='row-actions';
      const up=mkBtn('↑', t('row.up'), ()=>move(idx,-1));
      const down=mkBtn('↓', t('row.down'), ()=>move(idx,1));
      const del=mkBtn('✕', t('row.remove'), ()=>remove(idx)); del.classList.add('danger');
      acts.append(up,down,del);
      row.append(img,meta,acts);
      wrap.append(row);
    });
  }
  function mkBtn(label,title,onClick){ const b=document.createElement('button'); b.type='button'; b.textContent=label; b.title=title; b.addEventListener('click',onClick); return b; }
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  function move(idx,dir){
    const j=idx+dir; if(j<0||j>=state.frames.length) return;
    const [item]=state.frames.splice(idx,1); state.frames.splice(j,0,item); renderList();
  }
  function remove(idx){ state.frames.splice(idx,1); renderList(); }

  function loadFile(file){
    return new Promise((res,rej)=>{
      const fr=new FileReader();
      fr.onload=()=>{
        const img=new Image();
        img.onload=()=>res({ id:nextId++, name:file.name, w:img.naturalWidth, h:img.naturalHeight, image:img });
        img.onerror=()=>rej(new Error(file.name));
        img.src=fr.result;
      };
      fr.onerror=()=>rej(new Error(file.name));
      fr.readAsDataURL(file);
    });
  }

  $('frameInput').addEventListener('change', async ev=>{
    const files=Array.from(ev.target.files||[]); if(!files.length) return;
    setStatus(t('status.loading',{n:files.length}),'info');
    try{
      for(const f of files){
        const frame=await loadFile(f);
        state.frames.push(frame);
      }
      renderList();
      setStatus(t('status.loaded',{n:files.length}),'success');
    }catch(err){
      setStatus(t('status.loadFail',{name:err.message}),'danger');
    }
    ev.target.value='';
  });

  $('clearFramesBtn').addEventListener('click', ()=>{
    state.frames=[]; renderList(); setStatus(t('status.cleared'),'info');
  });
  $('resetBtn').addEventListener('click', ()=>{
    state.frames=[]; renderList();
    $('previewWrap').innerHTML='<p class="placeholder">'+t('preview.placeholder')+'</p>';
    $('downloadBtn').disabled=true;
    if(state.lastBlobUrl){ URL.revokeObjectURL(state.lastBlobUrl); state.lastBlobUrl=null; }
    setStatus('','');
  });

  // Encoder lives in assets/js/gif-encoder.js (window.MediaMkrGifEncoder).

  function framesToCanvases(){
    const first=state.frames[0];
    const maxW=parseInt($('maxWidthInput').value,10)||0;
    let targetW=first.w, targetH=first.h;
    if(maxW>0 && first.w>maxW){
      const scale=maxW/first.w;
      targetW=Math.round(first.w*scale);
      targetH=Math.round(first.h*scale);
    }
    return state.frames.map(f=>{
      const c=document.createElement('canvas'); c.width=targetW; c.height=targetH;
      const ctx=c.getContext('2d');
      ctx.fillStyle='#ffffff'; ctx.fillRect(0,0,targetW,targetH);
      // Letterbox/scale-fit the frame inside targetW×targetH to preserve aspect.
      const fr=f.w/f.h, tr=targetW/targetH;
      let dw, dh;
      if(fr>tr){ dw=targetW; dh=Math.round(targetW/fr); } else { dh=targetH; dw=Math.round(targetH*fr); }
      const dx=Math.round((targetW-dw)/2), dy=Math.round((targetH-dh)/2);
      ctx.drawImage(f.image, dx, dy, dw, dh);
      return c;
    });
  }

  $('generateBtn').addEventListener('click', ()=>{
    if(!state.frames.length){ setStatus(t('status.needFrames'),'danger'); return; }
    const btn=$('generateBtn'); btn.disabled=true; setStatus(t('status.encoding'),'info');
    setTimeout(()=>{
      try{
        const delayMs=parseInt($('delayInput').value,10)||450;
        const loop=Math.max(0, parseInt($('loopInput').value,10)||0);
        const mode=$('qualityInput').value==='fast'?'fast':'best';
        const dither=$('ditherInput').checked;
        const paletteSize=parseInt($('paletteSizeInput').value,10)||256;
        const canvases=framesToCanvases();
        const blob=window.MediaMkrGifEncoder.encode(canvases, {delayMs, loopCount:loop, mode, dither, paletteSize});
        if(state.lastBlobUrl) URL.revokeObjectURL(state.lastBlobUrl);
        state.lastBlobUrl=URL.createObjectURL(blob);
        const wrap=$('previewWrap'); wrap.innerHTML='';
        const img=document.createElement('img'); img.src=state.lastBlobUrl; img.alt='Generated GIF preview';
        wrap.appendChild(img);
        $('downloadBtn').disabled=false;
        const kb=Math.round(blob.size/1024);
        setStatus(t('status.ready',{kb:kb}),'success');
      }catch(err){
        setStatus(t('status.encodeFail',{msg:err.message||err}),'danger');
      }finally{
        btn.disabled=false;
      }
    }, 16);
  });

  $('downloadBtn').addEventListener('click', ()=>{
    if(!state.lastBlobUrl) return;
    const a=document.createElement('a'); a.href=state.lastBlobUrl; a.download='gifmkr-animation.gif';
    document.body.appendChild(a); a.click(); a.remove();
  });

  // Hide the video button entirely if the browser can't record.
  if (window.MediaMkrGifEncoder && !window.MediaMkrGifEncoder.videoSupported()) {
    const vb = $('recordVideoBtn'); if (vb) vb.style.display = 'none';
  }
  $('recordVideoBtn')?.addEventListener('click', async ()=>{
    if(!state.frames.length){ setStatus(t('status.needFrames'),'danger'); return; }
    const btn=$('recordVideoBtn'); btn.disabled=true;
    const delayMs=parseInt($('delayInput').value,10)||450;
    const loop=Math.max(1, parseInt($('loopInput').value,10)||1);
    // WebCodecs path is not real-time; MediaRecorder path is. Show the
    // real-time estimate either way — it's the upper bound.
    const usingWebCodecs = window.MediaMkrGifEncoder && window.MediaMkrGifEncoder.webCodecsMp4Available && window.MediaMkrGifEncoder.webCodecsMp4Available();
    const msgKey = usingWebCodecs ? 'status.encodingMp4' : 'status.recording';
    setStatus(t(msgKey,{s: Math.ceil(state.frames.length * loop * delayMs / 1000)}),'info');
    try{
      const canvases=framesToCanvases();
      const blob=await window.MediaMkrGifEncoder.encodeVideo(canvases, {delayMs, loopCount:loop});
      const ext = blob.type.indexOf('mp4') >= 0 ? 'mp4' : 'webm';
      const url=URL.createObjectURL(blob);
      const a=document.createElement('a'); a.href=url; a.download='gifmkr-animation.'+ext;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(()=>URL.revokeObjectURL(url), 4000);
      const kb=Math.round(blob.size/1024);
      setStatus(t('status.videoReady',{kb:kb, ext:ext.toUpperCase()}),'success');
    } catch(err){
      setStatus(t('status.videoFail',{msg:err.message||err}),'danger');
    } finally {
      btn.disabled=false;
    }
  });

  // Re-render the (mostly static) UI text on language change.
  document.addEventListener('widget-i18n:changed', renderList);
  renderList();
})();
