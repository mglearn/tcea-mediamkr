/* CodeMkr — static, local QR generation. No backend, no tracking redirects. */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var t = function (k) { return window.MM_I18n ? window.MM_I18n.t(k) : k; };

  var STORAGE_KEY = "codemkr.designs.v1";
  var CONFIG_KEY = "codemkr.backend.v1";
  var state = { mode: "standard", editAction: "create", svg: "", payload: "",
    adminKey: "", shortUrl: "", logoData: "", originalLogoData: "" };
  var templates = {
    classic: { dark: "#172033", light: "#ffffff" },
    custom: null
  };

  function escapeXml(v) {
    return String(v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c];
    });
  }
  function escapeWifi(v) { return v.replace(/([\\;,:"])/g, "\\$1"); }

  function payload() {
    var type = $("contentType").value;
    if (type === "wifi") {
      return "WIFI:T:" + $("wifiSecurity").value + ";S:" + escapeWifi($("wifiName").value) +
        ";P:" + escapeWifi($("wifiPassword").value) + ";H:" + $("wifiHidden").checked + ";";
    }
    var value = $("qrContent").value.trim();
    if (type === "email") return value.indexOf("mailto:") === 0 ? value : "mailto:" + value;
    if (type === "phone") return value.indexOf("tel:") === 0 ? value : "tel:" + value;
    return value;
  }

  function finderCell(row, col, count) {
    return (row < 7 && col < 7) || (row < 7 && col >= count - 7) || (row >= count - 7 && col < 7);
  }

  function makeSvg(value) {
    if (!value) return "";
    var qr = qrcode(0, $("errorLevel").value);
    qr.addData(value); qr.make();
    var count = qr.getModuleCount(), quiet = Number($("quietZone").value), total = count + quiet * 2;
    var dark = $("darkColor").value, light = $("lightColor").value;
    var cells = "";
    for (var row = 0; row < count; row++) {
      for (var col = 0; col < count; col++) {
        if (qr.isDark(row, col)) {
          cells += '<rect x="' + (col + quiet) + '" y="' + (row + quiet) + '" width="1" height="1"' +
            (finderCell(row, col, count) ? ' class="finder"' : "") + "/>";
        }
      }
    }
    var activeLogo = state.logoData || "";
    var logoSize = total * Number($("centerImageSize").value) / 100;
    var logoX = (total - logoSize) / 2, pad = Math.max(0.8, logoSize * 0.08);
    var logo = activeLogo ?
      '<rect x="' + (logoX - pad) + '" y="' + (logoX - pad) + '" width="' + (logoSize + pad * 2) +
      '" height="' + (logoSize + pad * 2) + '" rx="' + pad + '" fill="' + light + '"/>' +
      '<image href="' + escapeXml(activeLogo) + '" x="' + logoX + '" y="' + logoX + '" width="' +
      logoSize + '" height="' + logoSize + '" preserveAspectRatio="xMidYMid meet"/>' : "";
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + total + " " + total +
      '" width="' + $("qrSize").value + '" height="' + $("qrSize").value +
      '" role="img" aria-label="QR code"><rect width="' + total + '" height="' + total +
      '" fill="' + light + '"/><g fill="' + dark + '">' + cells + "</g>" + logo + "</svg>";
  }

  function config() {
    try { return JSON.parse(localStorage.getItem(CONFIG_KEY)) || {}; } catch (e) { return {}; }
  }
  function updateBackendState() {
    var ready = Boolean(config().endpoint && config().redirectBase);
    if ($("editableRun")) $("editableRun").disabled = !ready;
    if ($("editableStatus")) $("editableStatus").textContent =
      ready ? t("ed.configured") : t("ed.needConfig");
  }
  function setMode(mode) {
    state.mode = mode;
    document.querySelectorAll("[data-mode]").forEach(function (b) {
      var active = b.getAttribute("data-mode") === mode;
      b.classList.toggle("active", active); b.setAttribute("aria-pressed", active);
    });
    $("standardFields").hidden = mode !== "standard";
    $("editableFields").hidden = mode !== "editable";
    state.shortUrl = ""; updateBackendState(); render();
  }
  function setEditAction(action) {
    state.editAction = action;
    document.querySelectorAll("[data-edit-action]").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-edit-action") === action);
    });
    $("codeField").hidden = action !== "update";
    $("editableRun").textContent = action === "create" ? t("ed.create") : t("ed.update");
  }
  function runEditable() {
    var settings = config(), destination = $("editableDestination").value.trim();
    if (!settings.endpoint || !destination) { $("editableStatus").textContent = t("ed.needDest"); return; }
    var code = $("editableCode").value.trim();
    if (state.editAction === "update" && !code) { $("editableStatus").textContent = t("ed.needCode"); return; }
    $("editableRun").disabled = true; $("editableStatus").textContent = t("ed.contacting");
    fetch(settings.endpoint, {
      method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: state.editAction, destination: destination, code: code, adminKey: state.adminKey })
    }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, result: j }; }); })
      .then(function (res) {
        if (!res.ok || !res.result.ok) throw new Error(res.result.error || t("ed.rejected"));
        var resultCode = res.result.code || code;
        state.shortUrl = res.result.shortUrl || (settings.redirectBase + encodeURIComponent(resultCode));
        $("editableCode").value = resultCode;
        $("editableStatus").textContent = state.editAction === "create"
          ? t("ed.created") + " " + resultCode : t("ed.updated");
        render();
      }).catch(function (err) { $("editableStatus").textContent = t("ed.error") + " " + err.message; })
      .then(function () { $("editableRun").disabled = false; });
  }

  function render() {
    try {
      state.payload = state.mode === "editable"
        ? (state.shortUrl || $("editableDestination").value.trim()) : payload();
      state.svg = makeSvg(state.payload);
      $("qrPreview").innerHTML = state.svg || "<p>" + t("preview.enterContent") + "</p>";
      $("payloadPreview").textContent = state.payload || t("preview.nothing");
      $("scanMessage").textContent = state.svg ? t("preview.ready") : t("preview.enter");
    } catch (error) {
      state.svg = "";
      $("qrPreview").innerHTML = "<p>" + t("preview.tooLong") + "</p>";
      $("scanMessage").textContent = error.message;
    }
  }

  var FIELD = {
    url: { label: "lbl.url", type: "url", ph: "ph.url" },
    text: { label: "lbl.text", type: "text", ph: "ph.text" },
    email: { label: "lbl.email", type: "email", ph: "ph.email" },
    phone: { label: "lbl.phone", type: "tel", ph: "ph.phone" }
  };

  function setContentType() {
    var type = $("contentType").value, wifi = type === "wifi";
    $("wifiFields").hidden = !wifi;
    $("primaryField").hidden = wifi;
    if (!wifi) {
      var f = FIELD[type];
      $("primaryField").childNodes[0].nodeValue = t(f.label);
      $("qrContent").type = f.type;
      $("qrContent").placeholder = t(f.ph);
    }
    render();
  }

  function designs() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch (e) { return []; }
  }
  function refreshDesigns() {
    var select = $("savedDesigns"), value = select.value;
    select.innerHTML = '<option value="">' + t("opt.chooseSaved") + "</option>";
    designs().forEach(function (d) {
      var opt = document.createElement("option");
      opt.value = d.id; opt.textContent = d.name; select.append(opt);
    });
    select.value = value;
  }
  function snapshot() {
    return {
      id: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
      name: $("designName").value.trim() || "Untitled QR",
      contentType: $("contentType").value, content: $("qrContent").value,
      wifiName: $("wifiName").value, wifiPassword: "", wifiSecurity: $("wifiSecurity").value,
      wifiHidden: $("wifiHidden").checked, template: $("template").value,
      dark: $("darkColor").value, light: $("lightColor").value,
      size: $("qrSize").value, error: $("errorLevel").value, quiet: $("quietZone").value
    };
  }
  function saveDesign() {
    var list = designs(), item = snapshot();
    var existing = list.findIndex(function (e) { return e.name === item.name; });
    if (existing >= 0) { item.id = list[existing].id; list.splice(existing, 1, item); }
    else list.unshift(item);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 30)));
    refreshDesigns(); $("savedDesigns").value = item.id;
    $("scanMessage").textContent = t("msg.saved");
  }
  function loadDesign(id) {
    var item = designs().find(function (e) { return e.id === id; });
    if (!item) return;
    $("designName").value = item.name; $("contentType").value = item.contentType;
    $("qrContent").value = item.content; $("wifiName").value = item.wifiName;
    $("wifiPassword").value = item.wifiPassword; $("wifiSecurity").value = item.wifiSecurity;
    $("wifiHidden").checked = item.wifiHidden;
    $("template").value = templates[item.template] || item.template === "custom" ? item.template : "classic";
    $("darkColor").value = item.dark; $("lightColor").value = item.light;
    $("qrSize").value = item.size; $("errorLevel").value = item.error; $("quietZone").value = item.quiet;
    setContentType(); updateQuiet(); render();
  }

  function applyTemplate() {
    var item = templates[$("template").value];
    if (item) { $("darkColor").value = item.dark; $("lightColor").value = item.light; }
    render();
  }
  function updateQuiet() {
    $("quietOutput").textContent = $("quietZone").value + " " + t("unit.modules"); render();
  }
  function updateCenterImageSize() {
    $("centerImageSizeOutput").textContent = $("centerImageSize").value + " " + t("unit.ofWidth"); render();
  }
  function removeCenterImage() {
    state.logoData = ""; state.originalLogoData = "";
    $("centerImage").value = ""; $("cartoonEffect").checked = false;
    $("centerImageControls").hidden = true; $("centerImageHelp").textContent = t("help.center"); render();
  }

  // Default center image: the TCEA logo composited onto a navy tile so it
  // reads against the QR's light center. Users can replace or remove it.
  function loadDefaultLogo() {
    var image = new Image();
    image.onload = function () {
      var S = 512, pad = 56, canvas = document.createElement("canvas");
      canvas.width = canvas.height = S;
      var ctx = canvas.getContext("2d"), r = 72;
      ctx.fillStyle = "#0A3476";
      ctx.beginPath();
      ctx.moveTo(r, 0); ctx.arcTo(S, 0, S, S, r); ctx.arcTo(S, S, 0, S, r);
      ctx.arcTo(0, S, 0, 0, r); ctx.arcTo(0, 0, S, 0, r); ctx.closePath(); ctx.fill();
      var maxW = S - pad * 2, maxH = S - pad * 2;
      var scale = Math.min(maxW / image.naturalWidth, maxH / image.naturalHeight);
      var w = image.naturalWidth * scale, h = image.naturalHeight * scale;
      ctx.drawImage(image, (S - w) / 2, (S - h) / 2, w, h);
      state.originalLogoData = state.logoData = canvas.toDataURL("image/png");
      $("cartoonEffect").checked = false; $("errorLevel").value = "H";
      $("centerImageControls").hidden = false;
      $("centerImageHelp").textContent = t("help.center");
      render();
    };
    image.onerror = function () { render(); };
    image.src = "assets/tcea-logo-white.png";
  }

  function cartoonize(dataUrl) {
    return new Promise(function (resolve, reject) {
      var image = new Image();
      image.onload = function () {
        var scale = Math.min(1, 512 / Math.max(image.naturalWidth, image.naturalHeight));
        var canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        var ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var source = new Uint8ClampedArray(pixels.data), step = 51;
        for (var y = 0; y < canvas.height; y++) {
          for (var x = 0; x < canvas.width; x++) {
            var i = (y * canvas.width + x) * 4;
            if (source[i + 3] === 0) continue;
            var right = (y * canvas.width + Math.min(x + 1, canvas.width - 1)) * 4;
            var down = (Math.min(y + 1, canvas.height - 1) * canvas.width + x) * 4;
            var light = (source[i] + source[i + 1] + source[i + 2]) / 3;
            var rl = (source[right] + source[right + 1] + source[right + 2]) / 3;
            var dl = (source[down] + source[down + 1] + source[down + 2]) / 3;
            if (Math.max(Math.abs(light - rl), Math.abs(light - dl)) > 38) {
              pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = 25;
            } else {
              pixels.data[i] = Math.round(source[i] / step) * step;
              pixels.data[i + 1] = Math.round(source[i + 1] / step) * step;
              pixels.data[i + 2] = Math.round(source[i + 2] / step) * step;
            }
          }
        }
        ctx.putImageData(pixels, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      image.onerror = reject;
      image.src = dataUrl;
    });
  }
  function updateLogoEffect() {
    $("centerImageHelp").textContent = t("msg.cartoonApplying");
    var done = function (ok) {
      $("centerImageHelp").textContent = ok
        ? ($("cartoonEffect").checked ? t("msg.cartoonDone") : t("msg.cartoonOff"))
        : t("msg.cartoonFail");
      render();
    };
    if ($("cartoonEffect").checked) {
      cartoonize(state.originalLogoData).then(function (d) { state.logoData = d; done(true); })
        .catch(function () { done(false); });
    } else { state.logoData = state.originalLogoData; done(true); }
  }
  function loadCenterImage() {
    var file = $("centerImage").files[0];
    var allowed = { "image/png": 1, "image/jpeg": 1, "image/webp": 1 };
    if (!file) return removeCenterImage();
    if (!allowed[file.type] || file.size > 2 * 1024 * 1024) {
      $("centerImage").value = ""; $("centerImageHelp").textContent = t("msg.centerTooBig"); return;
    }
    var reader = new FileReader();
    reader.onload = function () {
      state.originalLogoData = reader.result; state.logoData = reader.result;
      $("cartoonEffect").checked = false; $("errorLevel").value = "H";
      $("centerImageControls").hidden = false;
      $("centerImageHelp").textContent = t("msg.centerAdded"); render();
    };
    reader.onerror = function () { $("centerImageHelp").textContent = t("msg.centerUnreadable"); };
    reader.readAsDataURL(file);
  }

  function resetDesign() {
    state.logoData = ""; state.originalLogoData = "";
    $("contentType").value = "url"; $("qrContent").value = "";
    $("wifiName").value = ""; $("wifiPassword").value = ""; $("wifiSecurity").value = "WPA";
    $("wifiHidden").checked = false;
    $("template").value = "classic"; $("darkColor").value = "#172033"; $("lightColor").value = "#ffffff";
    $("qrSize").value = "512"; $("errorLevel").value = "M"; $("quietZone").value = "4";
    $("centerImage").value = ""; $("centerImageSize").value = "18"; $("cartoonEffect").checked = false;
    $("centerImageControls").hidden = true; $("centerImageHelp").textContent = t("help.center");
    $("designName").value = "My QR code"; $("savedDesigns").value = "";
    setContentType(); updateQuiet(); updateCenterImageSize(); loadDefaultLogo(); $("qrContent").focus();
  }

  function fileName(ext) {
    var base = ($("designName").value || "").trim().replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-|-$/g, "").toLowerCase();
    return "codemkr-" + (base || "qr") + "." + ext;
  }
  function download(blob, name) {
    var url = URL.createObjectURL(blob), link = document.createElement("a");
    link.href = url; link.download = name; link.click();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }
  function canvasBlob() {
    var size = Number($("qrSize").value), canvas = $("renderCanvas"), ctx = canvas.getContext("2d");
    canvas.width = canvas.height = size;
    var svgBlob = new Blob([state.svg], { type: "image/svg+xml" }), url = URL.createObjectURL(svgBlob);
    return new Promise(function (resolve, reject) {
      var image = new Image();
      image.onload = function () {
        ctx.clearRect(0, 0, size, size); ctx.drawImage(image, 0, 0, size, size);
        URL.revokeObjectURL(url); canvas.toBlob(resolve, "image/png");
      };
      image.onerror = reject; image.src = url;
    });
  }
  function copyPng() {
    if (!state.svg) return;
    canvasBlob().then(function (blob) {
      return navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    }).then(function () { $("scanMessage").textContent = t("msg.pngCopied"); })
      .catch(function () { $("scanMessage").textContent = t("msg.pngBlocked"); });
  }
  function copySvg() {
    if (!state.svg) return;
    navigator.clipboard.writeText(state.svg)
      .then(function () { $("scanMessage").textContent = t("msg.svgCopied"); })
      .catch(function () { $("scanMessage").textContent = t("msg.svgBlocked"); });
  }

  function wire() {
    $("contentType").onchange = setContentType;
    document.querySelectorAll("#qrForm input,#qrForm select").forEach(function (input) {
      input.addEventListener("input", render);
    });
    $("template").onchange = applyTemplate;
    $("quietZone").oninput = updateQuiet;
    $("centerImage").onchange = loadCenterImage;
    $("centerImageSize").oninput = updateCenterImageSize;
    $("cartoonEffect").onchange = updateLogoEffect;
    $("removeCenterImage").onclick = removeCenterImage;
    $("saveDesign").onclick = saveDesign;
    $("savedDesigns").onchange = function () { loadDesign($("savedDesigns").value); };
    $("newDesign").onclick = resetDesign;
    $("copyPng").onclick = copyPng;
    $("copySvg").onclick = copySvg;
    $("downloadSvg").onclick = function () {
      if (state.svg) download(new Blob([state.svg], { type: "image/svg+xml" }), fileName("svg"));
    };
    $("downloadPng").onclick = function () {
      if (state.svg) canvasBlob().then(function (b) { download(b, fileName("png")); });
    };

    // Editable / dynamic QR (optional, admin-configured redirect; off by default).
    document.querySelectorAll("[data-mode]").forEach(function (b) {
      b.onclick = function () { setMode(b.getAttribute("data-mode")); };
    });
    document.querySelectorAll("[data-edit-action]").forEach(function (b) {
      b.onclick = function () { setEditAction(b.getAttribute("data-edit-action")); };
    });
    if ($("backendSetup")) $("backendSetup").onclick = function () {
      var c = config();
      $("backendUrl").value = c.endpoint || ""; $("redirectBase").value = c.redirectBase || "";
      $("adminKey").value = ""; $("backendDialog").showModal();
    };
    if ($("saveBackend")) $("saveBackend").onclick = function (e) {
      e.preventDefault();
      var endpoint = $("backendUrl").value.trim(), redirectBase = $("redirectBase").value.trim();
      if (!endpoint || !redirectBase) return;
      localStorage.setItem(CONFIG_KEY, JSON.stringify({ endpoint: endpoint, redirectBase: redirectBase }));
      state.adminKey = $("adminKey").value; $("backendDialog").close(); updateBackendState();
    };
    if ($("editableRun")) $("editableRun").onclick = runEditable;

    setContentType(); refreshDesigns(); updateQuiet(); updateCenterImageSize();
    setMode("standard"); setEditAction("create"); updateBackendState();
    loadDefaultLogo(); render();

    // Re-render dynamic strings when the language changes.
    document.addEventListener("mm:langchange", function () {
      setContentType(); refreshDesigns(); updateQuiet(); updateCenterImageSize(); updateBackendState();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wire);
  } else { wire(); }
})();
