/* TCEA MediaMkr — homepage search + category filtering (no dependencies). */
(function () {
  "use strict";

  function initGrid() {
    var search = document.querySelector("[data-mm-search]");
    var chips = Array.prototype.slice.call(document.querySelectorAll("[data-mm-filter]"));
    var cards = Array.prototype.slice.call(document.querySelectorAll(".mm-card[data-name]"));
    var empty = document.querySelector("[data-mm-empty]");
    var sections = Array.prototype.slice.call(document.querySelectorAll("[data-mm-section]"));
    if (!cards.length) return;

    var activeCat = "all";

    function norm(s) { return (s || "").toLowerCase().trim(); }

    function refresh() {
      var q = norm(search && search.value);
      var shown = 0;

      cards.forEach(function (card) {
        var name = norm(card.getAttribute("data-name"));
        var cat = card.getAttribute("data-category");
        var desc = norm(card.textContent);
        var matchCat = activeCat === "all" || cat === activeCat;
        var matchQ = !q || name.indexOf(q) !== -1 || desc.indexOf(q) !== -1;
        var visible = matchCat && matchQ;
        card.hidden = !visible;
        if (visible) shown++;
      });

      // Hide a category heading when none of its cards are visible.
      sections.forEach(function (sec) {
        var any = sec.querySelectorAll(".mm-card:not([hidden])").length > 0;
        sec.hidden = !any;
      });

      if (empty) empty.setAttribute("data-visible", shown === 0 ? "true" : "false");
    }

    if (search) search.addEventListener("input", refresh);

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        activeCat = chip.getAttribute("data-mm-filter");
        chips.forEach(function (c) {
          c.setAttribute("aria-pressed", c === chip ? "true" : "false");
        });
        refresh();
      });
    });

    // Re-evaluate when language changes (descriptions change text).
    document.addEventListener("mm:langchange", refresh);
    refresh();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGrid);
  } else {
    initGrid();
  }
})();
