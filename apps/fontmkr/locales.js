/* FontMkr — English + Spanish (auto-tags matching text nodes). */
(function(){
"use strict";
var es={
 "Home":"Inicio","Visit TCEA.org":"Visitar TCEA.org","Privacy":"Privacidad","Accessibility":"Accesibilidad","Licenses":"Licencias","All tools":"Todas las herramientas","Made on your device":"Hecho en tu dispositivo",
 "YOUR WORDS, YOUR STYLE":"TUS PALABRAS, TU ESTILO",
 "Text":"Texto","Bend":"Curvar","Pictures":"Imágenes","Project":"Proyecto",
 "Text & typography":"Texto y tipografía","Your text":"Tu texto","Typeface":"Tipografía","Weight":"Grosor","Regular":"Normal","Bold":"Negrita","Heavy":"Extra negrita",
 "Text size":"Tamaño del texto","Letter spacing":"Espaciado entre letras","Color & effects":"Color y efectos","Main color":"Color principal","Second color":"Color secundario","Outline":"Contorno","Outline width":"Grosor del contorno","3D depth":"Profundidad 3D",
 "SpellArt · bend lettering":"Arte de letras · curvar texto","Bend strength":"Intensidad de la curva","Rotation":"Rotación","Slant":"Inclinación","Italic":"Cursiva",
 "Optional background badge":"Insignia de fondo opcional","Badge fill":"Relleno de la insignia","Badge edge":"Borde de la insignia",
 "Add image":"Agregar imagen","Selected image":"Imagen seleccionada","Width %":"Ancho %","Opacity":"Opacidad",
 "Local font":"Fuente local","Save project":"Guardar proyecto","Open project":"Abrir proyecto","Your own font & project":"Tu propia fuente y proyecto",
 "Free placement":"Colocación libre","Arch above":"Arco arriba","Arch below":"Arco abajo","Above & below":"Arriba y abajo","Text below the picture":"Texto debajo de la imagen","Lettering around the picture":"Texto alrededor de la imagen"
};
var en={}; Object.keys(es).forEach(function(k){en[k]=k;});
if(!window.WidgetI18n)return;
window.WidgetI18n.register("fontmkr",{en:en,es:es});
function tag(){
 var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),ns=[];while(w.nextNode())ns.push(w.currentNode);
 ns.forEach(function(n){var t=n.textContent.trim(),p=n.parentElement;if(!p||p.closest("script,style,textarea,select")||!Object.prototype.hasOwnProperty.call(en,t))return;if(!p.children.length)p.dataset.i18n=t;else{var sp=document.createElement("span");sp.dataset.i18n=t;sp.textContent=t;n.replaceWith(sp);}});
 if(window.WidgetI18n.refresh)window.WidgetI18n.refresh();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",tag);else tag();
})();
