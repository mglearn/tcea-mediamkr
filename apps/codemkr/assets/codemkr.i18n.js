/* CodeMkr — English + Spanish strings. */
(function () {
  "use strict";
  if (!window.MM_I18n) return;
  window.MM_I18n.register({
    en: {
      "nav.home": "Home", "nav.help": "Help", "nav.tcea": "Visit TCEA.org",
      "skip": "Skip to QR settings",
      "intro.eyebrow": "QR codes without the clutter",
      "intro.h1": "Create and download QR codes.",
      "intro.p": "Make polished QR codes right in your browser. Everything is generated and exported on this device — nothing is uploaded.",

      "f.contentType": "Content type",
      "ct.url": "Website URL", "ct.text": "Plain text", "ct.email": "Email",
      "ct.phone": "Phone", "ct.wifi": "Wi-Fi",
      "f.wifiName": "Network name", "f.wifiPassword": "Password",
      "f.wifiSecurity": "Security", "sec.none": "None", "f.wifiHidden": "Hidden network",

      "lbl.url": "Destination URL", "lbl.text": "Text", "lbl.email": "Email address", "lbl.phone": "Phone number",
      "ph.url": "https://example.org/resource", "ph.text": "Type or paste text",
      "ph.email": "name@example.org", "ph.phone": "+1 555 555 5555",

      "style.legend": "Style",
      "f.template": "Template", "tpl.classic": "Classic", "tpl.custom": "Custom colors",
      "f.dots": "Dots", "f.background": "Background",
      "f.size": "Size", "f.error": "Error correction",
      "err.L": "Low", "err.M": "Medium", "err.Q": "Quartile", "err.H": "High",
      "f.quiet": "Quiet zone", "f.centerImage": "Custom center image",
      "f.centerImageSize": "Center image size", "f.cartoon": "Cartoon effect",
      "btn.removeCenter": "Remove center image",
      "help.center": "PNG, JPEG, or WebP, up to 2 MB. The image stays on this device. Test the finished QR before sharing.",

      "f.designName": "Design name", "btn.save": "Save design locally", "btn.reset": "Reset",
      "f.saved": "Saved designs", "opt.chooseSaved": "Choose a saved design…",

      "preview.ready": "Ready to scan", "preview.enter": "Add content to continue",
      "btn.copyPng": "Copy PNG", "btn.downloadPng": "Download PNG",
      "btn.copySvg": "Copy SVG", "btn.downloadSvg": "Download SVG",
      "preview.contents": "QR contents", "preview.nothing": "Nothing yet",
      "preview.enterContent": "Enter content to create a QR code.",
      "preview.tooLong": "This content is too long for the selected error-correction level.",

      "help.h1": "Standard QR", "help.p1": "The destination is stored directly in the QR. Generation and export stay entirely on this device.",
      "help.h2": "Print safely", "help.p2": "Keep a clear quiet zone, use strong contrast, and test the final printed code with more than one device before distributing it. Center images cover QR modules, so smaller is safer.",
      "help.h3": "Center images", "help.p3": "Adding a logo lowers how much of the code is readable, so high error correction is turned on automatically. Always scan-test before sharing.",

      "msg.saved": "Design saved only in this browser.",
      "msg.pngCopied": "PNG copied to clipboard.",
      "msg.pngBlocked": "This browser blocked image copying. Use Download PNG instead.",
      "msg.svgCopied": "SVG markup copied to clipboard.",
      "msg.svgBlocked": "Clipboard access was blocked. Use Download SVG instead.",
      "msg.centerAdded": "Center image added locally. High error correction enabled; test the finished QR before sharing.",
      "msg.centerTooBig": "Choose a PNG, JPEG, or WebP image no larger than 2 MB.",
      "msg.centerUnreadable": "That image could not be read. Try another file.",
      "msg.cartoonApplying": "Applying the local cartoon effect…",
      "msg.cartoonDone": "Cartoon effect applied locally. High error correction is enabled; test the finished QR.",
      "msg.cartoonOff": "Original center image restored. High error correction is enabled; test the finished QR.",
      "msg.cartoonFail": "The cartoon effect could not be applied to this image.",
      "unit.modules": "modules", "unit.ofWidth": "% of QR width",
      "footer.local": "Local-first static QR generation"
    },
    es: {
      "nav.home": "Inicio", "nav.help": "Ayuda", "nav.tcea": "Visitar TCEA.org",
      "skip": "Saltar a la configuración del QR",
      "intro.eyebrow": "Códigos QR sin complicaciones",
      "intro.h1": "Crea y descarga códigos QR.",
      "intro.p": "Crea códigos QR pulidos directamente en tu navegador. Todo se genera y exporta en este dispositivo: no se sube nada.",

      "f.contentType": "Tipo de contenido",
      "ct.url": "Dirección web", "ct.text": "Texto simple", "ct.email": "Correo electrónico",
      "ct.phone": "Teléfono", "ct.wifi": "Wi-Fi",
      "f.wifiName": "Nombre de la red", "f.wifiPassword": "Contraseña",
      "f.wifiSecurity": "Seguridad", "sec.none": "Ninguna", "f.wifiHidden": "Red oculta",

      "lbl.url": "URL de destino", "lbl.text": "Texto", "lbl.email": "Correo electrónico", "lbl.phone": "Número de teléfono",
      "ph.url": "https://ejemplo.org/recurso", "ph.text": "Escribe o pega texto",
      "ph.email": "nombre@ejemplo.org", "ph.phone": "+1 555 555 5555",

      "style.legend": "Estilo",
      "f.template": "Plantilla", "tpl.classic": "Clásico", "tpl.custom": "Colores personalizados",
      "f.dots": "Puntos", "f.background": "Fondo",
      "f.size": "Tamaño", "f.error": "Corrección de errores",
      "err.L": "Baja", "err.M": "Media", "err.Q": "Cuartil", "err.H": "Alta",
      "f.quiet": "Zona de silencio", "f.centerImage": "Imagen central personalizada",
      "f.centerImageSize": "Tamaño de la imagen central", "f.cartoon": "Efecto caricatura",
      "btn.removeCenter": "Quitar imagen central",
      "help.center": "PNG, JPEG o WebP, hasta 2 MB. La imagen permanece en este dispositivo. Prueba el QR terminado antes de compartirlo.",

      "f.designName": "Nombre del diseño", "btn.save": "Guardar diseño localmente", "btn.reset": "Restablecer",
      "f.saved": "Diseños guardados", "opt.chooseSaved": "Elige un diseño guardado…",

      "preview.ready": "Listo para escanear", "preview.enter": "Agrega contenido para continuar",
      "btn.copyPng": "Copiar PNG", "btn.downloadPng": "Descargar PNG",
      "btn.copySvg": "Copiar SVG", "btn.downloadSvg": "Descargar SVG",
      "preview.contents": "Contenido del QR", "preview.nothing": "Nada todavía",
      "preview.enterContent": "Ingresa contenido para crear un código QR.",
      "preview.tooLong": "Este contenido es demasiado largo para el nivel de corrección de errores seleccionado.",

      "help.h1": "QR estándar", "help.p1": "El destino se almacena directamente en el QR. La generación y exportación ocurren completamente en este dispositivo.",
      "help.h2": "Imprime con seguridad", "help.p2": "Mantén una zona de silencio clara, usa buen contraste y prueba el código impreso con más de un dispositivo antes de distribuirlo. Las imágenes centrales cubren módulos del QR, así que más pequeñas es más seguro.",
      "help.h3": "Imágenes centrales", "help.p3": "Agregar un logotipo reduce la parte legible del código, por lo que la corrección de errores alta se activa automáticamente. Siempre haz una prueba de escaneo antes de compartir.",

      "msg.saved": "El diseño se guardó solo en este navegador.",
      "msg.pngCopied": "PNG copiado al portapapeles.",
      "msg.pngBlocked": "Este navegador bloqueó la copia de imágenes. Usa Descargar PNG.",
      "msg.svgCopied": "Código SVG copiado al portapapeles.",
      "msg.svgBlocked": "Se bloqueó el acceso al portapapeles. Usa Descargar SVG.",
      "msg.centerAdded": "Imagen central agregada localmente. Corrección de errores alta activada; prueba el QR terminado antes de compartir.",
      "msg.centerTooBig": "Elige una imagen PNG, JPEG o WebP de no más de 2 MB.",
      "msg.centerUnreadable": "No se pudo leer esa imagen. Prueba con otro archivo.",
      "msg.cartoonApplying": "Aplicando el efecto caricatura local…",
      "msg.cartoonDone": "Efecto caricatura aplicado localmente. Corrección de errores alta activada; prueba el QR terminado.",
      "msg.cartoonOff": "Imagen central original restaurada. Corrección de errores alta activada; prueba el QR terminado.",
      "msg.cartoonFail": "No se pudo aplicar el efecto caricatura a esta imagen.",
      "unit.modules": "módulos", "unit.ofWidth": "% del ancho del QR",
      "footer.local": "Generación de QR estática, local primero"
    }
  });
})();
