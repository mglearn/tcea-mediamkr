(() => {
const STORAGE_KEY = "mediamkr.language";
const languages = [
  ["en", "English", "en", "ltr"], ["es", "Español", "es", "ltr"],
];
const shared = { es: {"Language":"Idioma","Open":"Abrir","Close":"Cerrar","Cancel":"Cancelar","Continue":"Continuar","Delete":"Eliminar","Duplicate":"Duplicar","Undo":"Deshacer","Redo":"Rehacer","Ready":"Listo","Help":"Ayuda","Export":"Exportar","Import":"Importar","Split":"Dividir","Save copy":"Guardar copia","Choose files":"Elegir archivos","Project name":"Nombre del proyecto","Local only":"Solo local","Apps":"Aplicaciones"} };
const appStrings = { formatmkr: { es: {"Private splitter & joiner":"Divisor y combinador privado","YOUR MEDIA NEVER LEAVES THIS DEVICE":"TUS ARCHIVOS MULTIMEDIA NUNCA SALEN DE ESTE DISPOSITIVO","Cut and combine media without the upload.":"Corta y combina archivos multimedia sin subirlos.","Trim exact moments, split long recordings, or join compatible clips. MP4, M4V, MOV, MKV, WebM, AVI, WMV, OGG, OGM, MP3, WAV, FLAC, and more.":"Recorta momentos exactos, divide grabaciones largas o une clips compatibles. MP4, M4V, MOV, MKV, WebM, AVI, WMV, OGG, OGM, MP3, WAV, FLAC y más.","Trim":"Recortar","Keep one section":"Conservar una sección","Create multiple parts":"Crear varias partes","Join":"Unir","Combine in order":"Combinar en orden","Choose a video or audio file":"Elegir un archivo de video o audio","Drop files here or browse your device":"Suelta archivos aquí o explora tu dispositivo","Files are read locally and are never uploaded.":"Los archivos se leen localmente y nunca se suben.","On-device":"En el dispositivo","Processing happens in this tab with a locally hosted FFmpeg engine.":"El procesamiento ocurre en esta pestaña con un motor FFmpeg local.","Broad format support":"Amplia compatibilidad de formatos","Honest quality choices":"Opciones de calidad claras"} } };
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
    var host = document.querySelector(".mm-header nav"), cta = host && host.querySelector(".mm-cta");
    if (host && cta) host.insertBefore(label, cta);
    else if (host) host.append(label);
    else document.body.append(label);
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
