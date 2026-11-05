/* TCEA MediaMkr — shared navigation behavior.
 * Wires up the language switcher present in the header. Safe to load on
 * every page (homepage and apps). Degrades gracefully if elements absent.
 */
(function () {
  "use strict";

  function initLangSwitcher() {
    var sel = document.querySelector("[data-mm-lang]");
    if (!sel || !window.MM_I18n) return;

    // Populate options from registered dictionaries if empty.
    if (!sel.options.length) {
      var names = { en: "English", es: "Español" };
      window.MM_I18n.available().forEach(function (code) {
        var opt = document.createElement("option");
        opt.value = code;
        opt.textContent = names[code] || code;
        sel.appendChild(opt);
      });
    }
    sel.value = window.MM_I18n.lang;
    sel.addEventListener("change", function () {
      window.MM_I18n.apply(sel.value);
      sel.value = window.MM_I18n.lang;
    });
  }

  function boot() {
    if (window.MM_I18n) window.MM_I18n.init();
    initLangSwitcher();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
