/* GIFMkr — locale dictionary (English + Spanish).
   after assets/js/widget-i18n.js. AI-seeded; native-speaker review pending. */
WidgetI18n.register('gifmkr', {
  en: {
    'Home': 'Home', 'Help': 'Help', 'Visit TCEA.org': 'Visit TCEA.org',
    'Privacy': 'Privacy', 'Accessibility': 'Accessibility', 'Licenses': 'Licenses',
    'doc.title': 'GIFMkr — MediaMkr',
    'header.eyebrow': 'TCEA MediaMkr',
    'header.h1': 'GIFMkr',
    'header.subtitle': 'Add image frames, set per-frame delay and loop count, preview the animation, and download a ready-to-share GIF. Everything runs in your browser — nothing is uploaded.',
    'header.allTools': 'All Tools',
    'header.home': 'Home',

    'panel.frames.aria': 'Frames and settings',
    'panel.stage.aria': 'GIF preview and download',

    'frames.h2': 'Frames',
    'frames.hint': 'Tip: drag-add multiple images at once. The first frame\'s size sets the GIF dimensions; other frames are scaled to match.',
    'frames.empty': 'No frames yet. Click <strong>Add Frames</strong> to pick images.',

    'settings.h3': 'Animation Settings',
    'settings.delay': 'Frame delay (milliseconds)',
    'settings.loop': 'Loop count (0 = forever)',
    'settings.maxWidth': 'Max width in pixels (0 = original)',
    'settings.quality': 'Color quality',
    'settings.qualityFast': 'Fast — fixed 256-color palette',
    'settings.qualityBest': 'Best — per-frame palette',
    'settings.dither': 'Dither (Floyd-Steinberg) — smooths gradients',
    'settings.paletteSize': 'Palette size (Best mode)',
    'settings.pal256': '256 colors — best quality',
    'settings.pal128': '128 colors — smaller file',
    'settings.pal64': '64 colors — smallest file',
    'settings.pal32': '32 colors — tiny / posterized',

    'about.h3': 'About',
    'about.html': 'Encoded locally with a small custom GIF writer (fixed cube or per-frame median-cut palette, optional Floyd-Steinberg dithering). ',

    'stage.h2': 'Preview & Download',
    'preview.placeholder': 'Your generated GIF will appear here.',

    'button.addFrames': 'Add Frames',
    'button.clearFrames': 'Clear All',
    'button.generate': 'Generate GIF',
    'button.download': 'Download GIF',
    'button.recordVideo': 'Export as Video (MP4 / WebM)',
    'button.reset': 'Reset',

    'row.up': 'Move up',
    'row.down': 'Move down',
    'row.remove': 'Remove frame',

    'status.loading': 'Loading {n} image(s)…',
    'status.loaded': 'Added {n} frame(s).',
    'status.loadFail': 'Could not load image: {name}',
    'status.cleared': 'Frames cleared.',
    'status.needFrames': 'Add at least one frame first.',
    'status.encoding': 'Encoding GIF…',
    'status.ready': 'GIF ready ({kb} KB). Click Download to save.',
    'status.encodeFail': 'GIF encoding failed: {msg}',
    'status.recording': 'Recording video (real-time, ~{s}s)…',
    'status.encodingMp4': 'Encoding MP4 via native WebCodecs (faster than real-time)…',
    'status.videoReady': '{ext} video ready ({kb} KB) — saved.',
    'status.videoFail': 'Video export failed: {msg}'
  },
  es: {
    'Home': 'Inicio', 'Help': 'Ayuda', 'Visit TCEA.org': 'Visitar TCEA.org',
    'Privacy': 'Privacidad', 'Accessibility': 'Accesibilidad', 'Licenses': 'Licencias',
    'doc.title': 'GIFMkr — MediaMkr',
    'header.eyebrow': 'TCEA MediaMkr',
    'header.h1': 'GIFMkr',
    'header.subtitle': 'Agrega cuadros de imagen, define el retardo por cuadro y el número de repeticiones, previsualiza la animación y descarga un GIF listo para compartir. Todo se ejecuta en tu navegador — nada se sube.',
    'header.allTools': 'Todas las Herramientas',
    'header.home': 'Inicio',

    'panel.frames.aria': 'Cuadros y configuración',
    'panel.stage.aria': 'Previsualización y descarga del GIF',

    'frames.h2': 'Cuadros',
    'frames.hint': 'Sugerencia: añade varias imágenes a la vez. El tamaño del primer cuadro define las dimensiones del GIF; los demás se escalan para coincidir.',
    'frames.empty': 'Aún no hay cuadros. Haz clic en <strong>Agregar Cuadros</strong> para elegir imágenes.',

    'settings.h3': 'Configuración de Animación',
    'settings.delay': 'Retardo por cuadro (milisegundos)',
    'settings.loop': 'Número de repeticiones (0 = para siempre)',
    'settings.maxWidth': 'Ancho máximo en píxeles (0 = original)',
    'settings.quality': 'Calidad de color',
    'settings.qualityFast': 'Rápido — paleta fija de 256 colores',
    'settings.qualityBest': 'Mejor — paleta por cuadro',
    'settings.dither': 'Difuminado (Floyd-Steinberg) — suaviza los gradientes',
    'settings.paletteSize': 'Tamaño de paleta (modo Mejor)',
    'settings.pal256': '256 colores — máxima calidad',
    'settings.pal128': '128 colores — archivo más pequeño',
    'settings.pal64': '64 colores — el más pequeño',
    'settings.pal32': '32 colores — diminuto / posterizado',

    'about.h3': 'Acerca de',
    'about.html': 'Codificado localmente con un pequeño codificador GIF (paleta cúbica fija o paleta por cuadro mediante corte mediano, con difuminado Floyd-Steinberg opcional). ',

    'stage.h2': 'Previsualización y Descarga',
    'preview.placeholder': 'Tu GIF generado aparecerá aquí.',

    'button.addFrames': 'Agregar Cuadros',
    'button.clearFrames': 'Borrar Todo',
    'button.generate': 'Generar GIF',
    'button.download': 'Descargar GIF',
    'button.recordVideo': 'Grabar como Video (WebM / MP4)',
    'button.reset': 'Reiniciar',

    'row.up': 'Subir',
    'row.down': 'Bajar',
    'row.remove': 'Eliminar cuadro',

    'status.loading': 'Cargando {n} imagen(es)…',
    'status.loaded': 'Se agregaron {n} cuadro(s).',
    'status.loadFail': 'No se pudo cargar la imagen: {name}',
    'status.cleared': 'Cuadros borrados.',
    'status.needFrames': 'Agrega al menos un cuadro primero.',
    'status.encoding': 'Codificando GIF…',
    'status.ready': 'GIF listo ({kb} KB). Haz clic en Descargar para guardarlo.',
    'status.encodeFail': 'La codificación del GIF falló: {msg}',
    'status.recording': 'Grabando video (tiempo real, ~{s}s)…',
    'status.encodingMp4': 'Codificando MP4 con WebCodecs nativo (más rápido que tiempo real)…',
    'status.videoReady': 'Video {ext} listo ({kb} KB) — guardado.',
    'status.videoFail': 'La exportación de video falló: {msg}'
  }
});
