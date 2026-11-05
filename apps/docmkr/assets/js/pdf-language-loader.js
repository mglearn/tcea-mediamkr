const select = document.querySelector("[data-pdf-language]");
const supported = new Set(["en", "es"]);
let stored;
try { stored = localStorage.getItem("mediamkr.language"); } catch { /* Private/file origins can disable storage. */ }
select.value = supported.has(stored) ? stored : "en";

function loadController() {
  if (document.querySelector("script[data-ds-language]")) return;
  const script = document.createElement("script");
  script.src = "./assets/js/app-language.js";
  script.dataset.dsLanguage = "docmkr";
  document.body.append(script);
}

loadController();
select.addEventListener("change", () => {
  try { localStorage.setItem("mediamkr.language", select.value); } catch { /* Language switching still works. */ }
  loadController();
});
