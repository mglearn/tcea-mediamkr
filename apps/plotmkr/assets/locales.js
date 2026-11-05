/* PlotMkr — English + Spanish. Auto-tags matching text nodes so the existing
   markup needs no per-element data-i18n attributes. */
(function () {
  "use strict";
  var es = {
    // Chrome
    "Home": "Inicio", "Help": "Ayuda", "Visit TCEA.org": "Visitar TCEA.org",
    "Privacy": "Privacidad", "Accessibility": "Accesibilidad", "Licenses": "Licencias",
    "Skip to graph controls": "Saltar a los controles del gráfico",
    "🔒 Local processing": "🔒 Procesamiento local",
    // Hero
    "One graph studio. Six ways to explore.": "Un estudio de gráficos. Seis formas de explorar.",
    "Make data visible.": "Haz visibles los datos.",
    "Create playful classroom charts, pictographs, coordinate planes, specialty visualizations, and interactive function graphs.":
      "Crea gráficos divertidos para el aula, pictogramas, planos de coordenadas, visualizaciones especiales y gráficos de funciones interactivos.",
    "What would you like to create?": "¿Qué te gustaría crear?",
    "Quick chart": "Gráfico rápido", "Picture graph": "Pictograma", "Coordinate plane": "Plano de coordenadas",
    "Expression calculator": "Calculadora de expresiones", "Geometry": "Geometría", "Specialty chart": "Gráfico especial",
    "PlotMkr Examples": "Ejemplos de PlotMkr",
    // Controls
    "Editing level": "Nivel de edición", "Simple": "Simple", "Advanced": "Avanzado", "Reset": "Restablecer",
    "Chart type": "Tipo de gráfico", "Bar": "Barras", "Horizontal bar": "Barras horizontales", "Line": "Líneas",
    "Area": "Área", "Pie": "Circular", "Donut": "Dona", "Scatter / XY": "Dispersión / XY",
    "Data": "Datos", "one row per line: label,value": "una fila por línea: etiqueta,valor",
    "Picture rows": "Filas de imágenes", "+ Add row": "+ Agregar fila", "Each picture equals": "Cada imagen equivale a",
    "Show values": "Mostrar valores", "Show key": "Mostrar leyenda", "Emoji palette": "Paleta de emojis",
    "Points": "Puntos", "x,y,label — one per line": "x,y,etiqueta — uno por línea",
    "Connect points": "Conectar puntos", "Show labels": "Mostrar etiquetas", "Positive quadrant only": "Solo cuadrante positivo",
    "Linear equation, y = mx + b": "Ecuación lineal, y = mx + b", "Slope m": "Pendiente m", "Intercept b": "Intersección b",
    "Expressions": "Expresiones", "one per line; use x, a, b, c": "una por línea; usa x, a, b, c",
    "Degrees": "Grados", "Roots": "Raíces", "Intersections": "Intersecciones", "Show value table": "Mostrar tabla de valores",
    "PlotMkr function reference": "Referencia de funciones de PlotMkr",
    "Specialty type": "Tipo especial", "Bubble": "Burbujas", "Radar": "Radar", "Polar": "Polar",
    "Stacked bar": "Barras apiladas", "Stacked area": "Área apilada", "Pyramid": "Pirámide",
    "Geometry tool": "Herramienta de geometría", "Move points": "Mover puntos", "Point": "Punto",
    "Segment": "Segmento", "Polygon": "Polígono", "Circle": "Círculo",
    "Choose a tool, then work directly on the coordinate plane.": "Elige una herramienta y trabaja directamente en el plano de coordenadas.",
    "Snap to grid": "Ajustar a la cuadrícula", "Labels": "Etiquetas", "Measurements": "Medidas",
    "Finish polygon": "Terminar polígono", "Undo last": "Deshacer último", "Clear geometry": "Borrar geometría",
    "Graph title": "Título del gráfico", "X-axis label": "Etiqueta del eje X", "Y-axis label": "Etiqueta del eje Y",
    "Source / attribution": "Fuente / atribución", "Style": "Estilo", "Theme": "Tema",
    "Bright": "Brillante", "Pastel": "Pastel", "High Contrast": "Alto contraste", "Printer Friendly": "Para imprimir", "Notebook": "Cuaderno", "Chalkboard": "Pizarra",
    "Primary color": "Color principal", "Background": "Fondo", "Grid": "Cuadrícula", "Legend": "Leyenda",
    "Values": "Valores", "Pattern fills": "Rellenos con patrón", "Graph window": "Ventana del gráfico",
    "Grid interval": "Intervalo de cuadrícula", "Graph description": "Descripción del gráfico",
    "Copy accessible data table": "Copiar tabla de datos accesible", "Project name": "Nombre del proyecto",
    "Save locally": "Guardar localmente", "Project JSON": "Proyecto JSON", "Open JSON / CSV": "Abrir JSON / CSV",
    "Saved projects": "Proyectos guardados", "Choose a project…": "Elige un proyecto…",
    "Live preview": "Vista previa", "Ready": "Listo",
    "Copy PNG": "Copiar PNG", "PNG": "PNG", "SVG": "SVG", "JPEG": "JPEG", "Print / PDF": "Imprimir / PDF", "CSV": "CSV",
    "Choose by purpose": "Elige según el propósito",
    "Privacy first": "Privacidad primero",
    "Graph responsibly": "Grafica con responsabilidad",
    "Edit chart item": "Editar elemento del gráfico", "Value": "Valor", "Color": "Color",
    "Cancel": "Cancelar", "Apply": "Aplicar",
    "What would you like to create today?": "¿Qué te gustaría crear hoy?",
    "PlotMkr · Local-first graph creation · No account required":
      "PlotMkr · Creación de gráficos local · Sin cuenta"
  };

  var en = {}; Object.keys(es).forEach(function (k) { en[k] = k; });

  if (!window.WidgetI18n) return;
  window.WidgetI18n.register("plotmkr", { en: en, es: es });

  // Auto-tag static text nodes + placeholders whose text matches a dictionary key.
  function tag() {
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    var nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      var text = node.textContent.trim(), parent = node.parentElement;
      if (!parent || parent.closest("script,style,textarea") || !Object.prototype.hasOwnProperty.call(en, text)) return;
      if (!parent.children.length) parent.dataset.i18n = text;
      else { var span = document.createElement("span"); span.dataset.i18n = text; span.textContent = text; node.replaceWith(span); }
    });
    document.querySelectorAll("[placeholder]").forEach(function (el) {
      if (Object.prototype.hasOwnProperty.call(en, el.getAttribute("placeholder"))) el.setAttribute("data-i18n-placeholder", el.getAttribute("placeholder"));
    });
    if (window.WidgetI18n.refresh) window.WidgetI18n.refresh();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", tag);
  else tag();
})();
