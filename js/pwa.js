/* Установка как приложения и работа офлайн */
(function (IT) {
  IT.pwa = { prompt: null, standalone: IT.native || (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true };
  if (!IT.native && "serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function (e) { console.warn("SW", e); });
    });
  }
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault(); IT.pwa.prompt = e;
    if (IT.route === "profile") IT.render();
  });
  window.addEventListener("appinstalled", function () { IT.pwa.prompt = null; IT.pwa.standalone = true; IT.toast(IT.icon("check") + " Приложение установлено", "ok"); });
  IT.pwa.install = function () {
    if (IT.pwa.prompt) { IT.pwa.prompt.prompt(); IT.pwa.prompt.userChoice.then(function () { IT.pwa.prompt = null; IT.render(); }); return; }
    var ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    IT.modal('<h3 class="m-title">Установить на телефон</h3>' + (ios
      ? '<ol class="sm"><li>Откройте эту страницу в <b>Safari</b>.</li><li>Нажмите «Поделиться» (квадрат со стрелкой).</li><li>Выберите «На экран „Домой“».</li></ol>'
      : '<ol class="sm"><li>Откройте страницу в <b>Chrome</b>.</li><li>Нажмите ⋮ в правом верхнем углу.</li><li>Выберите «Установить приложение» или «Добавить на главный экран».</li></ol>') +
      '<button class="btn primary mt" data-close>Понятно</button>');
  };
  window.addEventListener("online", function () { document.documentElement.classList.remove("is-offline"); });
  window.addEventListener("offline", function () { document.documentElement.classList.add("is-offline"); IT.toast("Нет сети: уроки, словарь и диалоги работают, ИИ — когда появится интернет.", "warn"); });
})(window.IT);
