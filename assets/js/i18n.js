/* TCEA MediaMkr — lightweight i18n engine (no dependencies).
 *
 * Usage in HTML:
 *   <span data-i18n="hero.tagline">Create. Edit. Share. Teach.</span>
 *   <input data-i18n-attr="placeholder:search.placeholder">
 * Languages: English, Spanish, Vietnamese, Chinese, Arabic (RTL).
 * Choice persists in localStorage under "mm-lang". Nothing is sent anywhere.
 */
(function (global) {
  "use strict";

  var RTL = ["ar", "he", "fa", "ur"];
  var STORE_KEY = "mm-lang";

  var MM_I18n = {
    lang: "en",
    dicts: {},

    register: function (strings) {
      // Merge a dictionary bundle: { en: {...}, es: {...}, ... }
      Object.keys(strings).forEach(function (code) {
        this.dicts[code] = Object.assign(this.dicts[code] || {}, strings[code]);
      }, this);
    },

    t: function (key) {
      var d = this.dicts[this.lang] || {};
      if (key in d) return d[key];
      var en = this.dicts.en || {};
      return key in en ? en[key] : key;
    },

    available: function () {
      return Object.keys(this.dicts);
    },

    detect: function () {
      var saved = null;
      try { saved = localStorage.getItem(STORE_KEY); } catch (e) {}
      if (saved && this.dicts[saved]) return saved;
      var nav = (navigator.language || "en").slice(0, 2).toLowerCase();
      return this.dicts[nav] ? nav : "en";
    },

    apply: function (lang) {
      if (lang && this.dicts[lang]) this.lang = lang;
      try { localStorage.setItem(STORE_KEY, this.lang); } catch (e) {}

      var dir = RTL.indexOf(this.lang) !== -1 ? "rtl" : "ltr";
      document.documentElement.setAttribute("lang", this.lang);
      document.documentElement.setAttribute("dir", dir);

      var self = this;
      // Text content. If the element wraps child elements (e.g. a <label>
      // containing a <select>/<input>), update only its leading text node so
      // the nested controls are preserved — never clobber them with textContent.
      document.querySelectorAll("[data-i18n]").forEach(function (el) {
        var v = self.t(el.getAttribute("data-i18n"));
        if (v == null) return;
        if (el.children.length === 0) { el.textContent = v; return; }
        var textNode = null;
        for (var i = 0; i < el.childNodes.length; i++) {
          if (el.childNodes[i].nodeType === 3 && el.childNodes[i].textContent.trim()) {
            textNode = el.childNodes[i]; break;
          }
        }
        if (textNode) textNode.textContent = v;
        else el.insertBefore(document.createTextNode(v), el.firstChild);
      });
      // Attributes: "placeholder:key;aria-label:key2"
      document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
        el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
          var bits = pair.split(":");
          if (bits.length === 2) el.setAttribute(bits[0].trim(), self.t(bits[1].trim()));
        });
      });

      document.dispatchEvent(new CustomEvent("mm:langchange", { detail: { lang: this.lang } }));
    },

    init: function () {
      this.lang = this.detect();
      this.apply(this.lang);
    }
  };

  global.MM_I18n = MM_I18n;
})(window);
