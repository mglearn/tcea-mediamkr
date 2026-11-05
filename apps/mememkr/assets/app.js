/* MemeMkr — captioned-image maker, fully local (canvas). */
(function () {
  "use strict";
  var $ = function (s) { return document.querySelector(s); };
  var t = function (k) { return window.MM_I18n ? window.MM_I18n.t(k) : k; };
  var canvas = $("#canvas"), ctx = canvas.getContext("2d");
  var uploaded = null;
  var controls = ["template", "topText", "bottomText", "labelText", "font", "fontSize", "fill", "stroke", "strokeWidth", "ratio"];

  function rounded(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill(); }

  function drawChoice(w, h) {
    var g = ctx.createLinearGradient(0, 0, w, h); g.addColorStop(0, "#082759"); g.addColorStop(1, "#0A3476");
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#111827"; rounded(w * .08, h * .30, w * .84, h * .48, 30);
    ctx.fillStyle = "#374151"; rounded(w * .13, h * .37, w * .74, h * .31, 24);
    ctx.fillStyle = "#147AD6"; rounded(w * .20, h * .43, w * .23, h * .16, 45); rounded(w * .57, h * .43, w * .23, h * .16, 45);
    ctx.fillStyle = "#9cc4ec"; rounded(w * .22, h * .44, w * .19, h * .035, 20); rounded(w * .59, h * .44, w * .19, h * .035, 20);
    ctx.fillStyle = "#FCB040"; ctx.beginPath(); ctx.arc(w * .5, h * .75, 52, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#082759"; ctx.font = "900 " + Math.max(22, w * .027) + "px Arial"; ctx.textAlign = "center"; ctx.fillText("?", w * .5, h * .765);
  }
  function drawBase(w, h) {
    if (uploaded) {
      ctx.fillStyle = "#000"; ctx.fillRect(0, 0, w, h);
      var scale = Math.min(w / uploaded.width, h / uploaded.height), dw = uploaded.width * scale, dh = uploaded.height * scale;
      ctx.drawImage(uploaded, (w - dw) / 2, (h - dh) / 2, dw, dh); return;
    }
    if ($("#template").value === "choice") return drawChoice(w, h);
    if ($("#template").value === "classic") {
      var g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#147AD6"); g.addColorStop(.5, "#0A3476"); g.addColorStop(1, "#FCB040");
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); return;
    }
    ctx.fillStyle = "#111827"; ctx.fillRect(0, 0, w, h);
  }
  function wrap(text, maxWidth) {
    var words = text.trim().toUpperCase().split(/\s+/), lines = [], line = "";
    for (var i = 0; i < words.length; i++) {
      var test = line ? line + " " + words[i] : words[i];
      if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = words[i]; }
      else line = test;
    }
    if (line) lines.push(line);
    return lines.slice(0, 3);
  }
  function caption(text, y, fromBottom, size) {
    if (!text.trim()) return;
    ctx.font = "900 " + size + "px " + $("#font").value;
    ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.lineJoin = "round";
    ctx.fillStyle = $("#fill").value; ctx.strokeStyle = $("#stroke").value;
    ctx.lineWidth = Number($("#strokeWidth").value) * 2;
    var lines = wrap(text, canvas.width * .91), lh = size * 1.04;
    var start = fromBottom ? canvas.height - y - lines.length * lh : y;
    lines.forEach(function (line, i) {
      var yy = start + i * lh;
      if (ctx.lineWidth) ctx.strokeText(line, canvas.width / 2, yy);
      ctx.fillText(line, canvas.width / 2, yy);
    });
  }
  function render() {
    var parts = $("#ratio").value.split(","), w = Number(parts[0]), h = Number(parts[1]);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    drawBase(w, h);
    var size = Number($("#fontSize").value);
    caption($("#topText").value, h * .035, false, size);
    caption($("#bottomText").value, h * .035, true, size);
    caption($("#labelText").value, h * .71, false, Math.max(24, size * .48));
  }

  controls.forEach(function (id) { $("#" + id).addEventListener("input", render); });
  function loadTemplate() {
    var value = $("#template").value;
    if (value.indexOf("../") !== 0) { uploaded = null; render(); return; }
    // A finished library example — it already includes captions baked into the image.
    $("#topText").value = ""; $("#bottomText").value = ""; $("#labelText").value = "";
    $("#status").textContent = t("msg.exampleLoaded");
    var image = new Image();
    image.onload = function () { uploaded = image; render(); };
    image.onerror = function () { $("#status").textContent = t("msg.imgFail"); };
    image.src = value;
  }
  $("#template").addEventListener("change", loadTemplate);
  $("#upload").addEventListener("change", function (event) {
    var file = event.target.files[0]; if (!file) return;
    var image = new Image();
    image.onload = function () { uploaded = image; URL.revokeObjectURL(image.src); render(); };
    image.onerror = function () { $("#status").textContent = t("msg.imgFail"); };
    image.src = URL.createObjectURL(file);
  });

  function filename() { return "mememkr-" + new Date().toISOString().slice(0, 10) + ".png"; }
  $("#download").addEventListener("click", function () {
    canvas.toBlob(function (blob) {
      var url = URL.createObjectURL(blob), a = document.createElement("a");
      a.href = url; a.download = filename(); a.click();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      $("#status").textContent = t("msg.saved");
    }, "image/png");
  });
  $("#copy").addEventListener("click", function () {
    new Promise(function (resolve) { canvas.toBlob(resolve, "image/png"); })
      .then(function (blob) { return navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]); })
      .then(function () { $("#status").textContent = t("msg.copied"); })
      .catch(function () { $("#status").textContent = t("msg.copyFail"); });
  });
  $("#reset").addEventListener("click", function () {
    uploaded = null; $("#template").value = "choice";
    $("#topText").value = "START EARLY AND RELAX";
    $("#bottomText").value = "WAIT UNTIL THE LAST MINUTE";
    $("#labelText").value = "ME, THE NIGHT BEFORE";
    render();
  });

  render();
  document.addEventListener("mm:langchange", render);
})();
