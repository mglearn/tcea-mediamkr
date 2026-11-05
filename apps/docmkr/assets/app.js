/* DocMkr — merge, split, and prepare PDFs locally using pdf-lib. */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var t = function (k, vars) {
    var s = window.MM_I18n ? window.MM_I18n.t(k) : k;
    if (vars) s = s.replace(/\{(\w+)\}/g, function (m, n) { return vars[n] != null ? vars[n] : m; });
    return s;
  };

  var items = [];   // { id, name, kind: 'pdf'|'image', bytes, pageCount, range, rotate }
  var nextId = 1;

  function setStatus(msg, cls) {
    var el = $("status"); el.textContent = msg || ""; el.className = "dm-status " + (cls || "");
  }

  function readFile(file) {
    return new Promise(function (resolve, reject) {
      var r = new FileReader();
      r.onload = function () { resolve(new Uint8Array(r.result)); };
      r.onerror = reject;
      r.readAsArrayBuffer(file);
    });
  }

  async function addFiles(fileList, kind) {
    var files = Array.prototype.slice.call(fileList);
    var added = 0;
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      try {
        var bytes = await readFile(file);
        var pageCount = null;
        if (kind === "pdf") {
          var doc = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
          pageCount = doc.getPageCount();
        }
        items.push({
          id: nextId++, name: file.name, kind: kind, bytes: bytes,
          type: file.type, pageCount: pageCount, range: "", rotate: 0
        });
        added++;
      } catch (e) {
        setStatus(t("status.error") + " " + file.name, "error");
      }
    }
    if (added) setStatus(t("status.loaded", { n: added }), "");
    render();
  }

  function move(idx, delta) {
    var j = idx + delta;
    if (j < 0 || j >= items.length) return;
    var tmp = items[idx]; items[idx] = items[j]; items[j] = tmp;
    render();
  }
  function removeItem(id) { items = items.filter(function (it) { return it.id !== id; }); render(); }

  // Parse "1-3, 5" (1-based) into 0-based indices, validated against pageCount.
  function parseRange(str, pageCount) {
    str = (str || "").trim();
    if (!str) { var all = []; for (var i = 0; i < pageCount; i++) all.push(i); return all; }
    var out = [];
    var parts = str.split(",");
    for (var p = 0; p < parts.length; p++) {
      var seg = parts[p].trim(); if (!seg) continue;
      var m = seg.match(/^(\d+)\s*-\s*(\d+)$/);
      if (m) {
        var a = parseInt(m[1], 10), b = parseInt(m[2], 10);
        if (!a || !b || a > b || b > pageCount) return null;
        for (var n = a; n <= b; n++) out.push(n - 1);
      } else if (/^\d+$/.test(seg)) {
        var v = parseInt(seg, 10);
        if (!v || v > pageCount) return null;
        out.push(v - 1);
      } else { return null; }
    }
    return out.length ? out : null;
  }

  function render() {
    var list = $("fileList");
    if (!items.length) {
      list.innerHTML = '<p class="dm-empty">' + t("list.empty") + "</p>";
      $("merge").disabled = true; $("clear").disabled = true;
      return;
    }
    $("merge").disabled = false; $("clear").disabled = false;
    list.innerHTML = "";
    items.forEach(function (it, idx) {
      var row = document.createElement("div");
      row.className = "dm-item";
      var isPdf = it.kind === "pdf";
      row.innerHTML =
        '<div class="dm-item-main">' +
          '<span class="dm-badge">' + (isPdf ? "PDF" : "IMG") + "</span>" +
          '<span class="dm-name" title="' + escapeAttr(it.name) + '">' + escapeHtml(it.name) + "</span>" +
          (isPdf ? '<span class="dm-pages">' + t("col.pages") + ": " + it.pageCount + "</span>" : "") +
        "</div>" +
        '<div class="dm-item-controls">' +
          (isPdf ? '<label class="dm-range"><span class="visually-hidden">' + t("col.range") + '</span>' +
            '<input type="text" data-range value="' + escapeAttr(it.range) + '" placeholder="' + escapeAttr(t("range.ph")) + '"></label>' : "") +
          '<label class="dm-rot"><span class="visually-hidden">' + t("col.rotate") + '</span>' +
            '<select data-rotate>' +
              '<option value="0">' + t("rotate.0") + "</option>" +
              '<option value="90">' + t("rotate.90") + "</option>" +
              '<option value="180">' + t("rotate.180") + "</option>" +
              '<option value="270">' + t("rotate.270") + "</option>" +
            "</select></label>" +
          '<button type="button" class="dm-icon" data-up aria-label="' + escapeAttr(t("btn.up")) + '">↑</button>' +
          '<button type="button" class="dm-icon" data-down aria-label="' + escapeAttr(t("btn.down")) + '">↓</button>' +
          '<button type="button" class="dm-icon dm-remove" data-remove aria-label="' + escapeAttr(t("btn.remove")) + '">✕</button>' +
        "</div>";
      var rot = row.querySelector("[data-rotate]"); if (rot) rot.value = String(it.rotate || 0);
      var rng = row.querySelector("[data-range]");
      if (rng) rng.addEventListener("input", function () { it.range = rng.value; });
      if (rot) rot.addEventListener("change", function () { it.rotate = parseInt(rot.value, 10) || 0; });
      row.querySelector("[data-up]").addEventListener("click", function () { move(idx, -1); });
      row.querySelector("[data-down]").addEventListener("click", function () { move(idx, 1); });
      row.querySelector("[data-remove]").addEventListener("click", function () { removeItem(it.id); });
      list.appendChild(row);
    });
  }

  function escapeHtml(s) { return String(s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function escapeAttr(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function fileName() {
    var base = ($("outName").value || "").trim().replace(/\.pdf$/i, "")
      .replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
    return "docmkr-" + (base || "document") + ".pdf";
  }

  function download(bytes, name) {
    var blob = new Blob([bytes], { type: "application/pdf" });
    var url = URL.createObjectURL(blob), a = document.createElement("a");
    a.href = url; a.download = name; a.click();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
  }

  async function build() {
    if (!items.length) { setStatus(t("status.needFiles"), "error"); return; }
    setStatus(t("status.building"), "");
    try {
      var out = await PDFLib.PDFDocument.create();
      var deg = PDFLib.degrees;
      for (var i = 0; i < items.length; i++) {
        var it = items[i];
        if (it.kind === "pdf") {
          var src = await PDFLib.PDFDocument.load(it.bytes, { ignoreEncryption: true });
          var indices = parseRange(it.range, it.pageCount);
          if (!indices) { setStatus(t("status.badRange") + " " + it.name, "error"); return; }
          var pages = await out.copyPages(src, indices);
          pages.forEach(function (pg) {
            if (it.rotate) {
              var cur = pg.getRotation().angle || 0;
              pg.setRotation(deg((cur + it.rotate) % 360));
            }
            out.addPage(pg);
          });
        } else {
          var img;
          if (/png$/i.test(it.type) || /\.png$/i.test(it.name)) img = await out.embedPng(it.bytes);
          else img = await out.embedJpg(it.bytes);
          var dims = img.scale(1);
          var page = out.addPage([dims.width, dims.height]);
          page.drawImage(img, { x: 0, y: 0, width: dims.width, height: dims.height });
          if (it.rotate) page.setRotation(deg(it.rotate % 360));
        }
      }
      var bytes = await out.save();
      download(bytes, fileName());
      setStatus(t("status.done"), "success");
    } catch (e) {
      setStatus(t("status.error") + " " + (e && e.message ? e.message : e), "error");
    }
  }

  function wire() {
    $("addPdf").addEventListener("click", function () { $("pdfInput").click(); });
    $("addImages").addEventListener("click", function () { $("imgInput").click(); });
    $("pdfInput").addEventListener("change", function () { addFiles(this.files, "pdf"); this.value = ""; });
    $("imgInput").addEventListener("change", function () { addFiles(this.files, "image"); this.value = ""; });
    $("merge").addEventListener("click", build);
    $("clear").addEventListener("click", function () { items = []; render(); setStatus(t("status.ready"), ""); });
    render(); setStatus(t("status.ready"), "");
    document.addEventListener("mm:langchange", function () { render(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wire);
  else wire();
})();
