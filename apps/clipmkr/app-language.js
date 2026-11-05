(() => {
const STORAGE_KEY = "mediamkr.language";
const languages = [ ["en","English","en","ltr"], ["es","Español","es","ltr"] ];
const shared = { es: {"Language":"Idioma","Open":"Abrir","Close":"Cerrar","Cancel":"Cancelar","Continue":"Continuar","Delete":"Eliminar","Duplicate":"Duplicar","Undo":"Deshacer","Redo":"Rehacer","Ready":"Listo","Help":"Ayuda","Export":"Exportar","Import":"Importar","Split":"Dividir","Save copy":"Guardar copia","Choose files":"Elegir archivos","Project name":"Nombre del proyecto","Local only":"Solo local","Apps":"Aplicaciones"} };
const appStrings = { clipmkr: { es: {"Private video editing. Right in your browser.":"Edición privada de video. Directamente en tu navegador.","LOCAL-FIRST · NO MEDIA UPLOADS":"LOCAL PRIMERO · SIN SUBIR ARCHIVOS","Start editing":"Comenzar a editar","Import media":"Importar medios","Optimize video":"Optimizar video","Cut":"Cortar","Copy":"Copiar","Paste":"Pegar","Append":"Añadir al final","Insert":"Insertar","Overwrite":"Sobrescribir","Ripple on":"Ondulación activa","Snap on":"Ajuste activo","Video track":"Pista de video","Audio track":"Pista de audio","Title":"Título","Import captions":"Importar subtítulos","Shortcuts":"Atajos","Export video":"Exportar video","MEDIA":"MEDIOS","Drop media here":"Suelta archivos aquí","Video, audio, and images are analyzed and stored only in this browser.":"El video, audio y las imágenes se analizan y almacenan solo en este navegador.","Preview canvas":"Vista previa","PROJECT":"PROYECTO","Canvas":"Lienzo","Landscape 16:9":"Horizontal 16:9","Portrait 9:16":"Vertical 9:16","Square 1:1":"Cuadrado 1:1","Frame rate":"Frecuencia de fotogramas","Privacy by design":"Privacidad desde el diseño","No account, analytics, ads, trackers, or media uploads.":"Sin cuenta, analíticas, anuncios, rastreadores ni cargas multimedia.","View privacy details":"Ver detalles de privacidad","TIMELINE":"LÍNEA DE TIEMPO","Autosaved locally":"Guardado automático local","Getting ready to record":"Preparación para grabar","Connect your headset and choose it as your computer input.":"Conecta los auriculares y selecciónalos como entrada del equipo.","Grant camera and microphone permission below.":"Concede permiso para usar la cámara y el micrófono.","Select the exact microphone, then continue to the recorder.":"Selecciona el micrófono exacto y continúa a la grabadora.","Microphone to record":"Micrófono para grabar","System default microphone":"Micrófono predeterminado del sistema","Set up recording permissions":"Configurar permisos de grabación","Requesting permission…":"Solicitando permiso…","Continue with selected microphone":"Continuar con el micrófono seleccionado","Continue to editor":"Continuar al editor","Edit without recording setup":"Editar sin configurar la grabación","Screen sharing is selected securely by your browser when each recording starts.":"El navegador permite seleccionar de forma segura qué pantalla compartir al iniciar cada grabación.","What would you like to do?":"¿Qué deseas hacer?","Record video":"Grabar video","Edit video":"Editar video","Back":"Atrás"} } };
const script = document.querySelector("script[data-ds-language]");
const app = script?.dataset.dsLanguage || "";
const storesPreference = script?.dataset.dsLanguageStorage !== "none";
const originals = new WeakMap();
const rendered = new WeakMap();
const pdfUI = ".topbar,.tools,#dropZone,#importNotice,#inkTools,#textFormatTools,#placementTools,dialog,.statusbar,.skip-link,#sidebar .panel-heading,#thumbnails span";
let current = "en";
let observer;

function dictionary() { return {...(shared[current] || {}), ...(appStrings[app]?.[current] || {})}; }
function translateValue(value, map) {
  if (map[value]) return map[value];
  if (app === "__pdfmode__") {
    const patterns = [
      [/^(.+) converted to PDF\. (\d+) pages\.$/, "{file} converted to PDF. {count} pages.", ["file","count"]],
      [/^(.+) downloaded\.$/, "{file} downloaded.", ["file"]],
      [/^Opening (.+)…$/, "Opening {file}…", ["file"]],
      [/^Adding (.+)…$/, "Adding {file}…", ["file"]],
      [/^(\d+) pages selected\. Page (\d+) is active\.$/, "{count} pages selected. Page {page} is active.", ["count","page"]],
      [/^Page (\d+) actions$/, "Page {page} actions", ["page"]],
      [/^(\d+) selected pages$/, "{count} selected pages", ["count"]],
      [/^(\d+) pages? rotated\.$/, "{count} pages rotated.", ["count"]],
      [/^(\d+) pages? duplicated\.$/, "{count} pages duplicated.", ["count"]],
      [/^(\d+) pages? deleted\. Undo is available\.$/, "{count} pages deleted. Undo is available.", ["count"]],
      [/^Click or tap the page to place (.+)\. Arrow keys move the preview; Enter places it\. Escape cancels\.$/, "Click or tap the page to place {item}. Arrow keys move the preview; Enter places it. Escape cancels.", ["item"]],
      [/^(.+) placed\. Drag to move or use the handles to resize\. Undo is available\.$/, "{item} placed. Drag to move or use the handles to resize. Undo is available.", ["item"]],
      [/^(.+) opened\. (\d+) pages\.$/, "{file} opened. {count} pages.", ["file","count"]],
      [/^Page (\d+) of (\d+)$/, "Page {page} of {count}", ["page","count"]],
      [/^Undid (.+)\.$/, "Undid {item}.", ["item"]],
      [/^Redid (.+)\.$/, "Redid {item}.", ["item"]],
    ];
    for (const [pattern, template, keys] of patterns) {
      const match = value.match(pattern);
      if (match && map[template]) return keys.reduce((text, key, i) => text.replaceAll(`{${key}}`, key === "item" ? translateValue(match[i+1], map) : match[i+1]), map[template]);
    }
    const history = value.match(/^(Undo|Redo) (.+)$/);
    if (history) return `${map[history[1]] || history[1]} ${translateValue(history[2], map)}`;
    const count = value.match(/^(\d+) matching tools$/);
    if (count) return `${count[1]} ${map["Matching tools"] || "matching tools"}`;
    const context = value.match(/^(.*?) · Open a PDF to use this tool$/);
    if (context) return `${translateValue(context[1], map)} · ${map["Open a PDF to use this tool"] || "Open a PDF to use this tool"}`;
    const page = value.match(/^Page (\d+)$/);
    if (page) return `${({es:"Página",vi:"Trang",ar:"صفحة",zh:"页",uh:"पृष्ठ / صفحہ"})[current] || "Page"} ${page[1]}`;
  }
  const caseMatch = Object.keys(map).find((key) => key.toLocaleLowerCase("en") === value.toLocaleLowerCase("en"));
  if (caseMatch) return map[caseMatch];
  const decorated = value.match(/^(\P{L}*)(.*?)(\P{L}*)$/u);
  if (decorated && decorated[2] !== value) {
    const core = Object.keys(map).find((key) => key.toLocaleLowerCase("en") === decorated[2].trim().toLocaleLowerCase("en"));
    if (core) return `${decorated[1]}${map[core]}${decorated[3]}`;
  }
  return value;
}
function translateNode(node, map) {
  if (node.nodeType === Node.TEXT_NODE) {
    if (!node.parentElement || node.parentElement.closest(".ds-language-control,script,style")) return;
    if (app === "__pdfmode__" && !node.parentElement.closest(pdfUI)) return;
    if (!originals.has(node) || (app === "__pdfmode__" && rendered.get(node) !== node.nodeValue)) originals.set(node, node.nodeValue);
    const source = originals.get(node); const trimmed = source.trim();
    if (!trimmed) return;
    const replacement = translateValue(trimmed, map);
    node.nodeValue = source.replace(trimmed, replacement);
    rendered.set(node, node.nodeValue);
    return;
  }
  if (!(node instanceof Element) || node.closest(".ds-language-control")) return;
  for (const attr of (app !== "__pdfmode__" || node.closest(pdfUI) ? ["aria-label", "title", "placeholder"] : [])) {
    if (!node.hasAttribute(attr)) continue;
    const dataName = `data-ds-original-${attr.replace("aria-label", "aria")}`;
    if (!node.hasAttribute(dataName)) node.setAttribute(dataName, node.getAttribute(attr));
    node.setAttribute(attr, translateValue(node.getAttribute(dataName), map));
  }
  for (const child of node.childNodes) translateNode(child, map);
}
function applyLanguage(code) {
  current = languages.some(([item]) => item === code) ? code : "en";
  const language = languages.find(([item]) => item === current);
  document.documentElement.lang = language[2];
  if (current === "en") document.documentElement.removeAttribute("dir"); else document.documentElement.dir = language[3];
  const map = dictionary(); observer?.disconnect(); translateNode(document.body, map);
  observer?.observe(document.body, {subtree:true,childList:true,characterData:true});
  window.dispatchEvent(new CustomEvent("mediamkr:language", {detail:{language:current}}));
}
function preferredLanguage() {
  let stored = null;
  if (storesPreference) {
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (_) { /* storage can be unavailable */ }
  }
  if (languages.some(([code]) => code === stored)) return stored;
  const browser = navigator.language.toLowerCase(); return languages.find(([code, , html]) => browser.startsWith(code === "uh" ? "hi" : html))?.[0] || "en";
}
function addSwitcher() {
  let label = document.querySelector(".ds-language-control");
  if (!label) {
    label = document.createElement("label"); label.className = "ds-language-control";
    const caption = document.createElement("span"); caption.textContent = "🌐 Language";
    const picker = document.createElement("select"); picker.setAttribute("aria-label", "Language");
    for (const [code, name] of languages) {
      const option = document.createElement("option"); option.value = code; option.textContent = name; picker.append(option);
    }
    label.append(caption, picker);
    document.body.append(label);
  }
  const select = label.querySelector("select"); select.value = current;
  select.addEventListener("change", () => {
    if (storesPreference) {
      try { localStorage.setItem(STORAGE_KEY, select.value); } catch (_) { /* storage can be unavailable */ }
    }
    applyLanguage(select.value); label.querySelector("span").textContent = `🌐 ${translateValue("Language", dictionary())}`;
  });
  label.querySelector("span").textContent = `🌐 ${translateValue("Language", dictionary())}`;
}

current = preferredLanguage();
observer = new MutationObserver((records) => { const map = dictionary(); observer.disconnect(); for (const record of records) { if (record.type === "characterData") { if (app !== "__pdfmode__") originals.delete(record.target); translateNode(record.target, map); } else for (const node of record.addedNodes) translateNode(node, map); } observer.observe(document.body,{subtree:true,childList:true,characterData:true}); });
if (current !== "en") applyLanguage(current);
else observer.observe(document.body,{subtree:true,childList:true,characterData:true});
addSwitcher();
})();
